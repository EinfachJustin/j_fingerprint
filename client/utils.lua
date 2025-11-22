local ESX = exports['es_extended']:getSharedObject()

-- helper to fetch localized string
local function _U(key, ...)
    local lang = Config and Config.Locale or 'en'
    if Locales and Locales[lang] and Locales[lang][key] then
        local text = Locales[lang][key]
        if select('#', ...) > 0 then
            return string.format(text, ...)
        end
        return text
    end
    if select('#', ...) > 0 then
        return string.format(key, ...)
    end
    return key
end

-- unified notify function (uses Config.Notify.type)
function Notify(msgKeyOrText, ...)
    local text = msgKeyOrText
    if Locales and Config and Locales[Config.Locale] and Locales[Config.Locale][msgKeyOrText] then
        text = _U(msgKeyOrText, ...)
    elseif select('#', ...) > 0 then
        text = string.format(msgKeyOrText, ...)
    end

    if Config and Config.Notify and Config.Notify.type == 'esx' then
        ESX.ShowNotification(text)
    elseif Config and Config.Notify and Config.Notify.type == 'chat' then
        TriggerEvent('chat:addMessage', { args = { text } })
    else
        ESX.ShowNotification(text)
    end
end

-- expose localization helper
function Translate(key, ...)
    return _U(key, ...)
end
