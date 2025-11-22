local ESX = exports['es_extended']:getSharedObject()
local isScanning = false
local scanningOfficer = nil

RegisterNetEvent('fingerprint:startScanProcess', function()
    ESX.TriggerServerCallback('fingerprint:getClosestPlayer', function(playerId, data)
        if playerId and data then
            TriggerServerEvent('fingerprint:requestScan', playerId)
            Notify('scanner_sent')
        else
            Notify('no_player_nearby')
        end
    end)
end)

RegisterNetEvent('fingerprint:showScannerUI', function(officerId)
    if not isScanning then
        isScanning = true
        scanningOfficer = officerId
        SetNuiFocus(true, true)
        SendNUIMessage({
            action = "show_scan_waiting"
        })
        Notify('scanner_activated')
    end
end)

RegisterNetEvent('fingerprint:scanRequested', function(targetId)
    Notify('waiting_for_scan')
end)

RegisterNetEvent('fingerprint:showResults', function(data)
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "show_report",
        id = data.identifier or "-",
        firstname = data.firstname or "-",
        lastname = data.lastname or "-",
        dob = data.dateofbirth or "-",
        gender = data.sex or "-"
    })
    Notify('scan_complete')
end)

RegisterNUICallback('scanComplete', function(data, cb)
    if isScanning and scanningOfficer then
        TriggerServerEvent('fingerprint:completeScan', scanningOfficer)
        isScanning = false
        scanningOfficer = nil
        SetNuiFocus(false, false)
        SendNUIMessage({action = "hide"})
    end
    cb({})
end)

RegisterNUICallback('close', function()
    isScanning = false
    scanningOfficer = nil
    SetNuiFocus(false, false)
    SendNUIMessage({action = "hide"})
end) 