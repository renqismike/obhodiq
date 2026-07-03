# Obhodiq Release Notes

## English

Public release assets:

- `obhodiq_<version>_all.ipk`
- `luci-app-obhodiq_<version>_all.ipk`
- `obhodiq-<version>.apk`
- `luci-app-obhodiq-<version>.apk`
- `install.sh`
- `uninstall.sh`

Obhodiq is an add-on for the original [Podkop](https://github.com/itdoginfo/podkop).

Recommended versions tested during development:

- Podkop `0.7.19`
- Podkop `0.7.20`
- OpenWrt `24.10.6`
- OpenWrt `25.12.5`

Safety notes:

- do not publish personal subscription URLs
- do not publish provider tokens
- do not publish runtime state copied from a personal router or VM
- do not publish private backups or local notes

Language policy:

- English and Russian UI strings are built into the app
- installer can switch Russian to the default UI language

Subscription compatibility notes:

- Obhodiq can parse many plain, base64 and JSON-style subscription formats, but not every provider endpoint is guaranteed to work
- Obhodiq includes partial `HApp 1.0` client emulation for some provider-side wrapped subscription flows
- `XHTTP` is hard-filtered before export
- `WS` is imported disabled by default; Podkop / sing-box may still support it in some cases, so users can enable it manually
- if a provider-specific subscription does not work, users should report it with a sanitized sample

Technical/legal note:

- Obhodiq is a subscription parser and Podkop integration layer
- it is not a standalone VPN client and does not perform routing by itself
- this note is technical only and is not legal advice

Uninstall policy:

- uninstall removes Obhodiq files only
- uninstall must not remove Podkop itself

## Русский

Публичные файлы релиза:

- `obhodiq_<version>_all.ipk`
- `luci-app-obhodiq_<version>_all.ipk`
- `obhodiq-<version>.apk`
- `luci-app-obhodiq-<version>.apk`
- `install.sh`
- `uninstall.sh`

Obhodiq — это дополнение для оригинального [Podkop](https://github.com/itdoginfo/podkop).

Рекомендуемые версии, на которых приложение проверялось во время разработки:

- Podkop `0.7.19`
- Podkop `0.7.20`
- OpenWrt `24.10.6`
- OpenWrt `25.12.5`

Правила безопасности:

- не публиковать личные ссылки подписок
- не публиковать токены провайдеров
- не публиковать runtime-состояние, скопированное с личного роутера или VM
- не публиковать личные бэкапы и локальные заметки

Языковая политика:

- английский и русский интерфейс уже встроены в приложение
- установщик может сразу сделать русский языком по умолчанию

Заметки по совместимости подписок:

- Obhodiq умеет разбирать многие plain/base64/JSON-подписки, но это не гарантирует работу каждой провайдерской ссылки
- в Obhodiq есть частичная эмуляция клиента `HApp 1.0` для части провайдерских обёрнутых сценариев подписок
- `XHTTP` жёстко отсекается до экспорта
- `WS` импортируется выключенным по умолчанию; при этом Podkop / sing-box в ряде случаев могут его поддерживать, поэтому пользователь может включить такой сервер вручную
- если провайдерская подписка не заработала, лучше прислать обезличенный пример через issue

Техническая/юридическая пометка:

- Obhodiq — это парсер подписок и слой интеграции с Podkop
- это не самостоятельный VPN-клиент и не отдельный маршрутизатор трафика
- эта формулировка носит только технический характер и не является юридической консультацией

Политика удаления:

- удаление должно затрагивать только файлы Obhodiq
- удаление не должно затрагивать сам Podkop
