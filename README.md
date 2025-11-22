# j_fingerprint

Fingerprint scanner for ESX.

## Features
- Easy configuration via `config.lua`
- Multi-language support via `locales/*.lua` (EN/DE included)
- Simple notify wrapper (`client/utils.lua`) to switch notification systems

## Installation
1. Copy the `j_fingerprint` folder into your server `resources` directory.
2. Add `ensure j_fingerprint` to your `server.cfg`.

## Configuration
- Edit `config.lua` to change the item name, default language and notify type:

```
Config.Locale = 'en'            -- 'en' or 'de' or your own locale
Config.ItemName = 'fingerprint_scanner'
Config.Notify.type = 'esx'      -- 'esx' | 'chat' | 'custom'
Config.MaxDistance = 3.0
```

## Localization / Translations
Translations are stored under `locales/`.

- Add a new file `locales/fr.lua` and set `Locales['fr'] = { key = 'text' }`.
- Set `Config.Locale = 'fr'` to use it.

Example (English): `locales/en.lua`

```
Locales['en'] = {
  scanner_sent = 'Scanner sent to player...',
  no_player_nearby = 'No player nearby!',
  ...
}
```

Use translation keys in the script; the notify wrapper will pick the current language.

## Notifications
Edit `Config.Notify.type` to switch between `esx` (uses `ESX.ShowNotification`) or `chat` (uses `chat:addMessage`).
If you have a custom notification resource, set `Config.Notify.type = 'custom'` and update `client/utils.lua` to call your export/event.

## Hilfe auf Deutsch
- `config.lua` anpassen um Itemname, Sprache und Benachrichtigungssystem zu ändern.
- Übersetzungen in `locales/*.lua` anlegen (z.B. `de.lua` ist bereits vorhanden).

