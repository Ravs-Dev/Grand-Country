local QBCore = exports['qb-core']:GetCoreObject()
local uiOpen, busy = false, false
local cam, previewPed, crate, currentCitizen, animToken
local modelCache = {}
local sceneLoaded = false
local function streamScene()
    local scene = Config.Scene
    SetFocusPosAndVel(scene.Ped.x, scene.Ped.y, scene.Ped.z, 0.0, 0.0, 0.0)
    RequestCollisionAtCoord(scene.Ped.x, scene.Ped.y, scene.Ped.z)
    NewLoadSceneStartSphere(scene.Ped.x, scene.Ped.y, scene.Ped.z, 80.0, 0)
    local deadline = GetGameTimer() + 10000
    while GetGameTimer() < deadline and not IsNewLoadSceneLoaded() do
        RequestCollisionAtCoord(scene.Ped.x, scene.Ped.y, scene.Ped.z)
        Wait(50)
    end
    NewLoadSceneStop()
    sceneLoaded = true
end
local function decodeSkin(data)
    if type(data) == 'table' then return data end
    if type(data) ~= 'string' or data == '' then return nil end
    local ok, result = pcall(json.decode, data)
    return ok and type(result) == 'table' and result or nil
end
local function requestModel(model)
    local hash = type(model) == 'number' and model or joaat(model)
    if not IsModelInCdimage(hash) then return nil end
    RequestModel(hash)
    local untilTime = GetGameTimer() + 8000
    while not HasModelLoaded(hash) and GetGameTimer() < untilTime do Wait(20) end
    if not HasModelLoaded(hash) then return nil end
    return hash
end
local function clearPreview()
    animToken = (animToken or 0) + 1
    if previewPed and DoesEntityExist(previewPed) then DeleteEntity(previewPed) end
    if crate and DoesEntityExist(crate) then DeleteEntity(crate) end
    previewPed, crate = nil, nil
end
local function loadIdle(ped)
    local token = animToken
    local dict = Config.Scene.SitAnimDict
    RequestAnimDict(dict)
    local deadline = GetGameTimer() + 3500
    while not HasAnimDictLoaded(dict) and GetGameTimer() < deadline do Wait(40) end
    if token ~= animToken or not DoesEntityExist(ped) then return end
    if HasAnimDictLoaded(dict) then
        TaskPlayAnim(ped, dict, Config.Scene.SitAnimName, 5.0, 1.0, -1, Config.Scene.AnimMovement or 1, 0.0, false, false, false)
    else
        -- Fallback if a modified game build lacks the selected animation.
        TaskStartScenarioInPlace(ped, 'WORLD_HUMAN_SEAT_WALL', 0, true)
    end
end
local function makePreview(model, skin)
    clearPreview()
    local hash = requestModel(model) or requestModel('mp_m_freemode_01')
    if not hash or not uiOpen then return end
    local p = Config.Scene.Ped
    local z = p.z + (Config.Scene.PedHeightOffset or 0)
    previewPed = CreatePed(4, hash, p.x, p.y, z, p.w, false, true)
    SetEntityAsMissionEntity(previewPed, true, true)
    SetEntityInvincible(previewPed, true)
    SetBlockingOfNonTemporaryEvents(previewPed, true)
    SetPedCanRagdoll(previewPed, false)
    SetEntityVisible(previewPed, true, false)
    SetEntityAlpha(previewPed, 255, false)
    SetEntityCollision(previewPed, true, true)
    SetPedDefaultComponentVariation(previewPed)
    FreezeEntityPosition(previewPed, true)
    if Config.Scene.Crate then
        local cHash = requestModel(Config.Scene.CrateModel)
        if cHash then
            local off = Config.Scene.CrateOffset
            crate = CreateObjectNoOffset(cHash, p.x + off.x, p.y + off.y, p.z + off.z, false, false, false)
            SetEntityHeading(crate, p.w)
            FreezeEntityPosition(crate, true)
            SetModelAsNoLongerNeeded(cHash)
        end
    end
    SetModelAsNoLongerNeeded(hash)
    -- Standard qb-clothing supports an explicit ped argument and restores saved face/clothes.
    -- Other clothing systems need their own preview adapter; do not call player-only setters.
    if skin then
        if Config.UseQbClothing and GetResourceState('qb-clothing') == 'started' then
            TriggerEvent('qb-clothing:client:loadPlayerClothing', skin, previewPed)
        elseif GetResourceState('illenium-appearance') == 'started' then
            local ok = pcall(function()
                exports['illenium-appearance']:setPedAppearance(previewPed, skin)
            end)
            if not ok then print('[GCR Multi] illenium-appearance preview failed; check appearance data format.') end
        else
            print('[GCR Multi] Saved skin found, but supported clothing resource not running: qb-clothing / illenium-appearance.')
        end
    else
        print('[GCR Multi] No active skin saved. Showing default ped preview.')
    end
    animToken = (animToken or 0) + 1
    local ped = previewPed
    CreateThread(function() loadIdle(ped) end)
end
local function leaveCamera()
    if cam then RenderScriptCams(false, true, 350, true, true); DestroyCam(cam, false); cam = nil end
    ClearTimecycleModifier()
    ClearFocus()
    sceneLoaded = false
    DisplayRadar(true)
    TriggerEvent('qb-weathersync:client:EnableSync')
end
local function enterCamera()
    local scene = Config.Scene
    if not sceneLoaded then streamScene() end
    TriggerEvent('qb-weathersync:client:DisableSync')
    NetworkOverrideClockTime(scene.Hour, scene.Minute, 0)
    SetWeatherTypeNowPersist(scene.Weather)
    DisplayRadar(false)
    if cam then DestroyCam(cam, false) end
    cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
    SetCamCoord(cam, scene.Camera.x, scene.Camera.y, scene.Camera.z)
    PointCamAtCoord(cam, scene.LookAt.x, scene.LookAt.y, scene.LookAt.z)
    SetCamFov(cam, scene.Fov)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 900, true, true)
    if scene.CameraSway then
        CreateThread(function()
            local localCam = cam
            while uiOpen and cam == localCam do
                local t = GetGameTimer() / 1000
                SetCamCoord(localCam, scene.Camera.x + math.sin(t * 0.20) * 0.035,
                    scene.Camera.y + math.cos(t * 0.21) * 0.035, scene.Camera.z)
                PointCamAtCoord(localCam, scene.LookAt.x, scene.LookAt.y, scene.LookAt.z)
                Wait(30)
            end
        end)
    end
end
local function closeMenu()
    uiOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({action = 'hide'})
    clearPreview()
    leaveCamera()
    local player = PlayerPedId()
    FreezeEntityPosition(player, false)
    SetEntityVisible(player, true, false)
    SetEntityCollision(player, true, true)
end
local function refresh()
    QBCore.Functions.TriggerCallback('gcr-multicharacter:server:getCharacters', function(chars, max, canDelete)
        if not uiOpen then return end
        SendNUIMessage({action = 'characters', characters = chars or {}, maxSlots = max or 5, allowDelete = canDelete})
        if chars and chars[1] then
            currentCitizen = chars[1].citizenid
            TriggerEvent('gcr-multicharacter:client:preview', currentCitizen)
        else
            currentCitizen = nil
            makePreview('mp_m_freemode_01')
        end
    end)
end
RegisterNetEvent('gcr-multicharacter:client:characters', function(chars, max, canDelete)
    if not uiOpen then return end
    SendNUIMessage({action = 'characters', characters = chars, maxSlots = max, allowDelete = canDelete})
    if chars and chars[1] then
        currentCitizen = chars[1].citizenid
        TriggerEvent('gcr-multicharacter:client:preview', currentCitizen)
    else
        currentCitizen = nil
        makePreview('mp_m_freemode_01')
    end
end)
RegisterNetEvent('gcr-multicharacter:client:preview', function(citizenid)
    if not uiOpen or not citizenid then return end
    currentCitizen = citizenid
    local requested = citizenid
    if modelCache[citizenid] then
        local skin = modelCache[citizenid]
        makePreview(skin.model, skin.data)
        return
    end
    QBCore.Functions.TriggerCallback('gcr-multicharacter:server:getSkin', function(model, skinJson)
        if not uiOpen or currentCitizen ~= requested then return end
        local skin
        if type(skinJson) == 'string' then
            local ok, decoded = pcall(json.decode, skinJson)
            if ok then skin = decoded end
        elseif type(skinJson) == 'table' then skin = skinJson end
        model = tonumber(model) or model or 'mp_m_freemode_01'
        if not skin then print(('[GCR Multi] Skin missing for citizenid %s; check playerskins.active and clothing save events.'):format(requested)) end
        modelCache[citizenid] = {model = model, data = skin}
        makePreview(model, skin)
    end, citizenid)
end)
RegisterNetEvent('qb-multicharacter:client:chooseChar', function()
    if uiOpen then closeMenu() end
    busy = false
    modelCache = {}
    DoScreenFadeOut(Config.FadeTime)
    Wait(Config.FadeTime + 100)
    local player = PlayerPedId()
    SetEntityCoords(player, Config.Scene.Ped.x, Config.Scene.Ped.y, Config.Scene.Ped.z + 1.5, false, false, false, false)
    FreezeEntityPosition(player, true)
    SetEntityVisible(player, false, false)
    SetEntityCollision(player, false, false)
    uiOpen = true
    TriggerEvent('gcr-hud:client:setMultichar', true)
    enterCamera()
    makePreview('mp_m_freemode_01')
    ShutdownLoadingScreen()
    ShutdownLoadingScreenNui()
    SetNuiFocus(true, true)
    SendNUIMessage({action = 'show', photo = Config.EnablePhotoMode})
    refresh()
    DoScreenFadeIn(Config.FadeTime)
end)
RegisterNUICallback('preview', function(data, cb)
    if uiOpen and type(data.citizenid) == 'string' then
        TriggerEvent('gcr-multicharacter:client:preview', data.citizenid)
    end
    cb({ok = true})
end)
RegisterNUICallback('select', function(data, cb)
    if uiOpen and not busy and type(data.citizenid) == 'string' then
        busy = true
        DoScreenFadeOut(350)
        Wait(380)
        closeMenu()
        TriggerServerEvent('gcr-multicharacter:server:select', data.citizenid)
    end
    cb({ok = true})
end)
RegisterNUICallback('create', function(data, cb)
    if uiOpen and not busy then
        busy = true
        DoScreenFadeOut(350)
        Wait(380)
        closeMenu()
        TriggerServerEvent('gcr-multicharacter:server:create', data)
    end
    cb({ok = true})
end)
RegisterNUICallback('delete', function(data, cb)
    if uiOpen and not busy and type(data.citizenid) == 'string' then
        TriggerServerEvent('gcr-multicharacter:server:delete', data.citizenid)
    end
    cb({ok = true})
end)
RegisterNUICallback('disconnect', function(_, cb)
    TriggerServerEvent('gcr-multicharacter:server:disconnect')
    cb({ok = true})
end)
RegisterNUICallback('photo', function(data, cb)
    if uiOpen and Config.EnablePhotoMode then
        SetNuiFocus(not data.enabled, not data.enabled)
        SendNUIMessage({action = 'photo', enabled = data.enabled})
    end
    cb({ok = true})
end)
RegisterNetEvent('gcr-multicharacter:client:finish', function(mode, data, isNew)
    closeMenu()
    local ped = PlayerPedId()
    SetEntityCoords(ped, Config.DefaultSpawn.x, Config.DefaultSpawn.y, Config.DefaultSpawn.z)
    SetEntityHeading(ped, Config.DefaultSpawn.w)
    FreezeEntityPosition(ped, false)
    if mode == 'apartment' then
        TriggerEvent('apartments:client:setupSpawnUI', data)
    elseif mode == 'spawn' then
        TriggerEvent('qb-spawn:client:setupSpawns', data, isNew, nil)
        TriggerEvent('qb-spawn:client:openUI', true)
    elseif mode == 'last' then
        local pos = data.position
        if type(pos) == 'string' then local ok, val = pcall(json.decode, pos); if ok then pos = val end end
        if type(pos) == 'table' and pos.x and pos.y and pos.z then
            SetEntityCoords(ped, pos.x, pos.y, pos.z)
            SetEntityHeading(ped, pos.w or 0.0)
        end
        TriggerServerEvent('QBCore:Server:OnPlayerLoaded')
        TriggerEvent('QBCore:Client:OnPlayerLoaded')
    else
        TriggerServerEvent('QBCore:Server:OnPlayerLoaded')
        TriggerEvent('QBCore:Client:OnPlayerLoaded')
        if isNew and GetResourceState('qb-clothing') == 'started' then
            TriggerEvent('qb-clothes:client:CreateFirstCharacter')
        end
    end
    DoScreenFadeIn(700)
end)
RegisterNetEvent('qb-multicharacter:client:closeNUI', closeMenu)
RegisterNetEvent('qb-multicharacter:client:closeNUIdefault', function()
    TriggerEvent('gcr-multicharacter:client:finish', 'default', {}, true)
end)
CreateThread(function()
    while not NetworkIsSessionStarted() do Wait(300) end
    Wait(1200)
    if not LocalPlayer.state.isLoggedIn then
        TriggerEvent('qb-multicharacter:client:chooseChar')
    end
end)
-- Press BACKSPACE while in Photo Mode to return to menu.
CreateThread(function()
    while true do
        if uiOpen then
            Wait(0)
            DisableControlAction(0, 200, true)
            if IsDisabledControlJustPressed(0, 200) or IsControlJustPressed(0, 177) then
                SetNuiFocus(true, true)
                SendNUIMessage({action = 'photo', enabled = false})
            end
        else Wait(500) end
    end
end)
