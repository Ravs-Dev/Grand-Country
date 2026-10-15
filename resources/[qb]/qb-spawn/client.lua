local QBCore = exports['qb-core']:GetCoreObject({ 'Functions' })
local camZPlus1 = 1500
local camZPlus2 = 50
local pointCamCoords = 75
local pointCamCoords2 = 0
local cam1Time = 500
local cam2Time = 1000
local choosingSpawn = false
local Houses = {}
local cam = nil
local cam2 = nil
local lastPosition = nil

-- Functions

local function SetDisplay(bool)
    local translations = {}
    for k in pairs(Lang.fallback and Lang.fallback.phrases or Lang.phrases) do
        if k:sub(0, #'ui.') then
            translations[k:sub(#'ui.' + 1)] = Lang:t(k)
        end
    end
    choosingSpawn = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        action = 'showUi',
        status = bool,
        translations = translations
    })
end

-- Events

RegisterNetEvent('qb-spawn:client:openUI', function(value)
    SetEntityVisible(PlayerPedId(), false)
    DoScreenFadeOut(250)
    Wait(1000)
    DoScreenFadeIn(250)
    QBCore.Functions.GetPlayerData(function(PlayerData)
        cam = CreateCamWithParams('DEFAULT_SCRIPTED_CAMERA', PlayerData.position.x, PlayerData.position.y, PlayerData.position.z + camZPlus1, -85.00, 0.00, 0.00, 100.00, false, 0)
        SetCamActive(cam, true)
        RenderScriptCams(true, false, 1, true, true)
    end)
    Wait(500)
    SetDisplay(value)
end)

RegisterNetEvent('qb-houses:client:setHouseConfig', function(houseConfig)
    Houses = houseConfig
end)

local pendingFirstAppearance = false

local function openFirstAppearanceIfNeeded()
    if not pendingFirstAppearance then return end
    pendingFirstAppearance = false

    if GetResourceState('illenium-appearance') == 'started' then
        TriggerEvent('qb-clothes:client:CreateFirstCharacter')
    elseif GetResourceState('qb-clothing') == 'started' then
        TriggerEvent('qb-clothes:client:CreateFirstCharacter')
    end
end

-- Ambil posisi yang disimpan QBCore sebelum kamera spawn memindahkan ped.
-- Mendukung posisi dalam table maupun JSON, heading bernama w atau a.
local function ReadSavedPosition(position)
    if type(position) == 'string' then
        local ok, decoded = pcall(json.decode, position)
        position = ok and decoded or nil
    end
    if not position then return nil end
    local x, y, z = tonumber(position.x), tonumber(position.y), tonumber(position.z)
    local heading = tonumber(position.w or position.a or position.heading or position.h) or 0.0
    if not x or not y or not z or (x == 0 and y == 0 and z == 0) then return nil end
    return vector4(x, y, z, heading)
end

local function GetSpawnCoords(location)
    if location == 'last' then
        return lastPosition or QB.Spawns.airport.coords
    end
    return QB.Spawns[location] and QB.Spawns[location].coords or nil
end

RegisterNetEvent('qb-spawn:client:setupSpawns', function(cData, new, apps)
    pendingFirstAppearance = new == true
    -- Karakter baru/lama melihat empat pilihan. Lokasi terakhir dibaca dari data tersimpan.
    -- Jika belum pernah spawn (karakter baru), Last Location memakai fallback Airport.
    local playerData = QBCore.Functions.GetPlayerData()
    lastPosition = (not new) and (ReadSavedPosition(cData and cData.position)
        or ReadSavedPosition(playerData and playerData.position)) or nil
    SendNUIMessage({
        action = 'setupLocations',
        locations = QB.Spawns,
        houses = {},
        isNew = new == true
    })
end)

-- NUI Callbacks

RegisterNUICallback('exit', function(_, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'showUi',
        status = false
    })
    choosingSpawn = false
    cb('ok')
end)

local function SetCam(campos)
    cam2 = CreateCamWithParams('DEFAULT_SCRIPTED_CAMERA', campos.x, campos.y, campos.z + camZPlus1, 300.00, 0.00, 0.00, 110.00, false, 0)
    PointCamAtCoord(cam2, campos.x, campos.y, campos.z + pointCamCoords)
    SetCamActiveWithInterp(cam2, cam, cam1Time, true, true)
    if DoesCamExist(cam) then
        DestroyCam(cam, true)
    end
    Wait(cam1Time)

    cam = CreateCamWithParams('DEFAULT_SCRIPTED_CAMERA', campos.x, campos.y, campos.z + camZPlus2, 300.00, 0.00, 0.00, 110.00, false, 0)
    PointCamAtCoord(cam, campos.x, campos.y, campos.z + pointCamCoords2)
    SetCamActiveWithInterp(cam, cam2, cam2Time, true, true)
    SetEntityCoords(PlayerPedId(), campos.x, campos.y, campos.z)
end

RegisterNUICallback('setCam', function(data, cb)
    local location = tostring(data.posname or '')
    local spawn = QB.Spawns[location]
    if not spawn then
        cb('invalid_spawn')
        return
    end
    DoScreenFadeOut(200)
    Wait(500)
    DoScreenFadeIn(200)
    if cam and DoesCamExist(cam) then DestroyCam(cam, true) end
    if cam2 and DoesCamExist(cam2) then DestroyCam(cam2, true) end
    SetCam(GetSpawnCoords(location))
    cb('ok')
end)

local function PreSpawnPlayer()
    SetDisplay(false)
    DoScreenFadeOut(500)
    Wait(2000)
end

local function PostSpawnPlayer(ped)
    FreezeEntityPosition(ped, false)
    RenderScriptCams(false, true, 500, true, true)
    SetCamActive(cam, false)
    DestroyCam(cam, true)
    SetCamActive(cam2, false)
    DestroyCam(cam2, true)
    SetEntityVisible(PlayerPedId(), true)
    Wait(500)
    DoScreenFadeIn(250)
    openFirstAppearanceIfNeeded()
end

RegisterNUICallback('spawnplayer', function(data, cb)
    local location = tostring(data.spawnloc or '')
    local spawn = QB.Spawns[location]
    if data.typeLoc ~= 'normal' or not spawn then
        cb('invalid_spawn')
        return
    end

    local pos = GetSpawnCoords(location)
    PreSpawnPlayer()
    local ped = PlayerPedId()
    RequestCollisionAtCoord(pos.x, pos.y, pos.z)
    SetEntityCoords(ped, pos.x, pos.y, pos.z, false, false, false, false)
    SetEntityHeading(ped, pos.w)
    TriggerServerEvent('QBCore:Server:OnPlayerLoaded')
    TriggerServerEvent('qb-houses:server:SetInsideMeta', 0, false)
    TriggerServerEvent('qb-apartments:server:SetInsideMeta', 0, 0, false)
    Wait(500)
    SetEntityCoords(ped, pos.x, pos.y, pos.z, false, false, false, false)
    SetEntityHeading(ped, pos.w)
    PostSpawnPlayer()
    cb('ok')
end)

-- Threads

CreateThread(function()
    while true do
        Wait(0)
        if choosingSpawn then
            DisableAllControlActions(0)
        else
            Wait(1000)
        end
    end
end)
