-- Config for j_fingerprint
Config = Config or {}

-- default language (en, de, ...)
Config.Locale = 'en'

-- item name that can be used to open the scanner
Config.ItemName = 'fingerprint_scanner'

-- notification system: 'esx' (ESX.ShowNotification) or 'chat' (chat:addMessage) or 'custom'
Config.Notify = {
    type = 'esx'
}

-- distance for closest player check (meters)
Config.MaxDistance = 3.0

-- you can add other config options here (e.g. ranks, allowed jobs...)
