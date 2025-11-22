ESX = exports['es_extended']:getSharedObject()

ESX.RegisterUsableItem(Config.ItemName or 'fingerprint_scanner', function(source)
    local xPlayer = ESX.GetPlayerFromId(source)
    TriggerClientEvent('fingerprint:startScanProcess', source)
end)

-- RegisterCommand('usescanner', function(source, args, rawCommand)
--     local xPlayer = ESX.GetPlayerFromId(source)
--     if xPlayer.job.name == 'police' then
--         TriggerClientEvent('fingerprint:startScanProcess', source)
--     end
-- end)

RegisterNetEvent('fingerprint:requestScan', function(targetId)
    TriggerClientEvent('fingerprint:showScannerUI', targetId, source)
    TriggerClientEvent('fingerprint:scanRequested', source, targetId)
end)

RegisterNetEvent('fingerprint:completeScan', function(officerId)
    local xPlayer = ESX.GetPlayerFromId(source)
    local data = {
        firstname = xPlayer.get('firstName'),
        lastname = xPlayer.get('lastName'),
        dateofbirth = xPlayer.get('dateofbirth'),
        sex = xPlayer.get('sex'),
        identifier = xPlayer.getIdentifier()
    }
    TriggerClientEvent('fingerprint:showResults', officerId, data)
end)

ESX.RegisterServerCallback('fingerprint:getClosestPlayer', function(source, cb)
    local players = ESX.GetExtendedPlayers()
    local srcPed = GetPlayerPed(source)
    local srcCoords = GetEntityCoords(srcPed)
    local closestPlayer, closestDist = nil, (Config.MaxDistance or 3.0)
    
    for _, xPlayer in pairs(players) do
        if xPlayer.source ~= source then
            local targetPed = GetPlayerPed(xPlayer.source)
            local targetCoords = GetEntityCoords(targetPed)
            local dist = #(srcCoords - targetCoords)
            if dist < closestDist then
                closestPlayer = xPlayer.source
                closestDist = dist
            end
        end
    end
    
    if closestPlayer then
        local xTarget = ESX.GetPlayerFromId(closestPlayer)
        local data = {
            identifier = xTarget.getIdentifier(),
            firstname = xTarget.get('firstName'),
            lastname = xTarget.get('lastName'),
            dateofbirth = xTarget.get('dateofbirth'),
            sex = xTarget.get('sex')
        }
        cb(closestPlayer, data)
    else
        cb(nil, nil)
    end
end) 