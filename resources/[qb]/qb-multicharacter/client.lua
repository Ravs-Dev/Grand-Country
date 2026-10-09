local QBCore = exports['qb-core']:GetCoreObject()

local uiOpen, busy = false, false

local cam, previewPed, crate, currentCitizen, animToken
local previewRevision = 0

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

local function normalizeModel(model)
    if not model then return nil end

    if type(model) == 'number' then
        return model
    end

    if type(model) == 'string' then
        local numeric = tonumber(model)
        if numeric then return numeric end
        return joaat(model)
    end

    return nil
end

local function requestModel(model)
    local hash = normalizeModel(model)

    if not hash or hash == 0 then
        return nil
    end

    if not IsModelInCdimage(hash) or not IsModelValid(hash) then
        print(('[GCR Multi] Invalid ped model: %s'):format(tostring(model)))
        return nil
    end

    RequestModel(hash)

    local untilTime = GetGameTimer() + 10000
    while not HasModelLoaded(hash) and GetGameTimer() < untilTime do
        Wait(20)
    end

    if not HasModelLoaded(hash) then
        print(('[GCR Multi] Model load timeout: %s'):format(tostring(model)))
        return nil
    end

    return hash
end

local function clearPreview()
    previewRevision = previewRevision + 1
    animToken = (animToken or 0) + 1

    if previewPed and DoesEntityExist(previewPed) then
        SetEntityAsMissionEntity(previewPed, true, true)
        DeletePed(previewPed)

        if DoesEntityExist(previewPed) then
            DeleteEntity(previewPed)
        end
    end

    if crate and DoesEntityExist(crate) then
        SetEntityAsMissionEntity(crate, true, true)
        DeleteEntity(crate)
    end

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

    local myRevision = previewRevision
    skin = decodeSkin(skin)

    -- illenium appearance often also stores the model inside appearance data.
    if (not model or model == '') and skin and skin.model then
        model = skin.model
    end

    local hash = requestModel(model) or requestModel('mp_m_freemode_01')
    if not hash then return end

    -- Another character may have been selected while the model was streaming.
    if not uiOpen or myRevision ~= previewRevision then
        SetModelAsNoLongerNeeded(hash)
        return
    end

    local p = Config.Scene.Ped
    local z = p.z + (Config.Scene.PedHeightOffset or 0.0)

    RequestCollisionAtCoord(p.x, p.y, z)

    previewPed = CreatePed(
        4,
        hash,
        p.x,
        p.y,
        z,
        p.w,
        false, -- local-only preview: each connected player gets their own character
        false
    )

    if not previewPed or previewPed == 0 or not DoesEntityExist(previewPed) then
        print('[GCR Multi] Failed to create preview ped.')
        previewPed = nil
        SetModelAsNoLongerNeeded(hash)
        return
    end

    SetEntityAsMissionEntity(previewPed, true, true)
    SetEntityCoordsNoOffset(previewPed, p.x, p.y, z, false, false, false)
    SetEntityHeading(previewPed, p.w)
    SetEntityInvincible(previewPed, true)
    SetEntityCanBeDamaged(previewPed, false)
    SetBlockingOfNonTemporaryEvents(previewPed, true)
    SetPedCanRagdoll(previewPed, false)
    SetEntityVisible(previewPed, true, false)
    ResetEntityAlpha(previewPed)
    SetEntityAlpha(previewPed, 255, false)
    SetEntityCollision(previewPed, true, true)
    SetEntityAlwaysPrerender(previewPed, true)
    SetPedDefaultComponentVariation(previewPed)
    FreezeEntityPosition(previewPed, true)

    if Config.Scene.Crate then
        local cHash = requestModel(Config.Scene.CrateModel)

        if cHash and myRevision == previewRevision and uiOpen then
            local off = Config.Scene.CrateOffset

            crate = CreateObjectNoOffset(
                cHash,
                p.x + off.x,
                p.y + off.y,
                p.z + off.z,
                false,
                false,
                false
            )

            if crate and DoesEntityExist(crate) then
                SetEntityAsMissionEntity(crate, true, true)
                SetEntityHeading(crate, p.w)
                FreezeEntityPosition(crate, true)
            end

            SetModelAsNoLongerNeeded(cHash)
        end
    end

    -- Apply saved face, hair, clothes and accessories.
    if skin and myRevision == previewRevision and DoesEntityExist(previewPed) then
        if GetResourceState('illenium-appearance') == 'started' then
            local ok, err = pcall(function()
                exports['illenium-appearance']:setPedAppearance(previewPed, skin)
            end)

            if not ok then
                print(('[GCR Multi] illenium-appearance preview failed: %s'):format(tostring(err)))
            end
        elseif Config.UseQbClothing and GetResourceState('qb-clothing') == 'started' then
            TriggerEvent('qb-clothing:client:loadPlayerClothing', skin, previewPed)
        else
            print('[GCR Multi] Saved skin found, but illenium-appearance / qb-clothing is not started.')
        end
    elseif not skin then
        print('[GCR Multi] No active skin saved. Showing default ped preview.')
    end

    -- Some appearance resources touch alpha/components, so force preview visibility again.
    if myRevision == previewRevision and previewPed and DoesEntityExist(previewPed) then
        SetEntityCoordsNoOffset(previewPed, p.x, p.y, z, false, false, false)
        SetEntityHeading(previewPed, p.w)
        SetEntityVisible(previewPed, true, false)
        ResetEntityAlpha(previewPed)
        SetEntityAlpha(previewPed, 255, false)
        SetEntityCollision(previewPed, true, true)
        FreezeEntityPosition(previewPed, true)

        animToken = (animToken or 0) + 1
        local ped = previewPed
        CreateThread(function()
            loadIdle(ped)
        end)
    end

    SetModelAsNoLongerNeeded(hash)
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

local function closeMenu(restorePlayer)
    if restorePlayer == nil then restorePlayer = true end

    uiOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({action = 'hide'})
    clearPreview()
    leaveCamera()

    if restorePlayer then
        local player = PlayerPedId()
        FreezeEntityPosition(player, false)
        SetEntityVisible(player, true, false)
        SetEntityCollision(player, true, true)
    end

    TriggerEvent('gcr-hud:client:setMultichar', false)
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
        local cached = modelCache[citizenid]
        makePreview(cached.model, cached.data)
        return
    end

    QBCore.Functions.TriggerCallback('gcr-multicharacter:server:getSkin', function(model, skinJson)
        if not uiOpen or currentCitizen ~= requested then return end

        local skin = decodeSkin(skinJson)

        if (not model or model == '') and skin and skin.model then
            model = skin.model
        end

        model = tonumber(model) or model or 'mp_m_freemode_01'

        if not skin then
            print(('[GCR Multi] Skin missing for citizenid %s; check playerskins.active and appearance save data.'):format(requested))
        end

        modelCache[requested] = {
            model = model,
            data = skin
        }

        makePreview(model, skin)
    end, citizenid)
end)

RegisterNetEvent('qb-multicharacter:client:chooseChar', function()
    if uiOpen then
        closeMenu(false)
        Wait(150)
    end

    busy = false
    currentCitizen = nil
    modelCache = {}

    DoScreenFadeOut(Config.FadeTime)
    Wait(Config.FadeTime + 100)

    local player = PlayerPedId()

    -- Keep the real player hidden; the menu uses a local-only preview ped.
    SetEntityCoordsNoOffset(
        player,
        Config.Scene.Ped.x,
        Config.Scene.Ped.y,
        Config.Scene.Ped.z + 1.5,
        false,
        false,
        false
    )

    FreezeEntityPosition(player, true)
    SetEntityVisible(player, false, false)
    SetEntityCollision(player, false, false)

    uiOpen = true

    TriggerEvent('gcr-hud:client:setMultichar', true)

    streamScene()
    enterCamera()

    -- Always draw a fallback immediately, then replace it with the saved character.
    makePreview('mp_m_freemode_01', nil)

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

        closeMenu(false)

        TriggerServerEvent('gcr-multicharacter:server:select', data.citizenid)

    end

    cb({ok = true})

end)

RegisterNUICallback('create', function(data, cb)

    if uiOpen and not busy then

        busy = true

        DoScreenFadeOut(350)

        Wait(380)

        closeMenu(false)

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

    closeMenu(false)

    local ped = PlayerPedId()

    SetEntityCoords(ped, Config.DefaultSpawn.x, Config.DefaultSpawn.y, Config.DefaultSpawn.z)

    SetEntityHeading(ped, Config.DefaultSpawn.w)

    FreezeEntityPosition(ped, false)
    SetEntityVisible(ped, true, false)
    SetEntityAlpha(ped, 255, false)
    SetEntityCollision(ped, true, true)

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

AddEventHandler('onResourceStop', function(resource)
    if resource ~= GetCurrentResourceName() then return end

    SetNuiFocus(false, false)
    clearPreview()
    leaveCamera()

    local player = PlayerPedId()
    FreezeEntityPosition(player, false)
    SetEntityVisible(player, true, false)
    SetEntityCollision(player, true, true)
end)

RegisterNetEvent('qb-multicharacter:client:closeNUI', closeMenu)

RegisterNetEvent('qb-multicharacter:client:closeNUIdefault', function()

    TriggerEvent('gcr-multicharacter:client:finish', 'default', {}, true)

end)

CreateThread(function()
    while true do
        if uiOpen then
            if not previewPed or not DoesEntityExist(previewPed) then
                if currentCitizen then
                    TriggerEvent('gcr-multicharacter:client:preview', currentCitizen)
                else
                    makePreview('mp_m_freemode_01', nil)
                end
            else
                SetEntityVisible(previewPed, true, false)
                SetEntityAlpha(previewPed, 255, false)
                SetEntityAlwaysPrerender(previewPed, true)
            end

            Wait(750)
        else
            Wait(1000)
        end
    end
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
