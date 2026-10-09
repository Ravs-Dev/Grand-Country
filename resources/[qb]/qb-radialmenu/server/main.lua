local RESOURCE = GetCurrentResourceName()

CreateThread(function()
    Wait(0)
    print(('^2[%s]^7 GCR radial menu loaded.'):format(RESOURCE))
end)
