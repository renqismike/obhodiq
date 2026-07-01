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

- Obhodiq includes HApp 1.0 client emulation for part of the provider-side subscription flows
- this helps with some wrapped subscription endpoints that expect a compatible client profile

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

- в Obhodiq встроена эмуляция клиента HApp 1.0 для части провайдерских сценариев подписок
- это помогает с некоторыми обёрнутыми subscription-endpoint, которые ожидают совместимый профиль клиента

Политика удаления:

- удаление должно затрагивать только файлы Obhodiq
- удаление не должно затрагивать сам Podkop
