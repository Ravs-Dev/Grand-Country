local loadingScreenClosed = false

local function closeLoadingScreen()
    if loadingScreenClosed then
        return
    end

    loadingScreenClosed = true

    -- Give the HTML a moment to show 100% and fade cleanly into the game.
    SendLoadingScreenMessage(json.encode({
        action = 'finalizeLoading',
        progress = 100
    }))

    Wait(850)
    ShutdownLoadingScreenNui()
    ShutdownLoadingScreen()
end

CreateThread(function()
    -- With loadscreen_manual_shutdown enabled, this prevents FiveM from
    -- exposing the AFTER_MAP / SESSION debug stage behind the custom UI.
    while not NetworkIsSessionStarted() do
        Wait(100)
    end

    -- Small safety delay so the first in-game/client UI frame is ready.
    Wait(1200)
    closeLoadingScreen()
end)

-- Fallback: if this resource is stopped/restarted while loading, never leave
-- the player trapped behind a stale loading NUI.
AddEventHandler('onClientResourceStop', function(resourceName)
    if resourceName ~= GetCurrentResourceName() then
        return
    end

    if not loadingScreenClosed then
        ShutdownLoadingScreenNui()
        ShutdownLoadingScreen()
    end
end)
