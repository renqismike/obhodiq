# Obhodiq Release Notes

## English

### Obhodiq 0.1.1

This release focuses on stabilizing package installation, subscription refresh behavior, server switching, and cleaner Podkop integration.

Main changes in this release:

- verified clean install and clean reinstall on OpenWrt `24.10.6` (`opkg`) and OpenWrt `25.12.5` (`apk`)
- verified clean removal of Obhodiq without removing or breaking Podkop
- refreshed package contents so backend, CGI, init script, CLI, LuCI page and runtime helpers are included in release packages
- fixed cases where old subscription data could survive after a failed update or overlapping refresh
- fixed manual server switching so repeated switching between different servers is applied correctly
- fixed auto-update behavior so disabling Obhodiq also stops its cron-based refresh
- improved subscription import flow and provider-wrapper handling
- kept partial `HApp 1.0` emulation for some wrapped subscription endpoints
- `WS` servers are now imported disabled by default, but can still be enabled manually
- updated install/uninstall scripts and project documentation

What to expect:

- Obhodiq can parse many subscription formats, but this does not guarantee that every provider-specific endpoint will work
- Podkop / sing-box still decide whether a specific server can actually be applied and pinged
- if a subscription does not work, users should report it with a sanitized sample when possible

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

Technical note:

- Obhodiq is an auxiliary subscription parser and Podkop integration layer
- it does not include its own VPN/proxy engine
- it does not establish tunnels or route traffic by itself
- it only prepares configuration data for an already installed Podkop

Uninstall policy:

- uninstall removes Obhodiq files only
- uninstall must not remove Podkop itself

## Русский

### Obhodiq 0.1.1

Этот релиз в первую очередь посвящён стабилизации установки пакетов, обновления подписок, переключения серверов и более чистой интеграции с Podkop.

Основные изменения в этом релизе:

- подтверждена чистая установка и чистая переустановка на OpenWrt `24.10.6` (`opkg`) и OpenWrt `25.12.5` (`apk`)
- подтверждено чистое удаление Obhodiq без удаления и поломки Podkop
- обновлён состав пакетов: в релизные файлы входят backend, CGI, init-скрипт, CLI, LuCI-страница и runtime-хелперы
- исправлены случаи, когда после неудачного обновления или пересекающихся refresh-запусков могло оставаться старое состояние подписки
- исправлено ручное переключение серверов: повторное переключение между разными серверами теперь применяется корректно
- исправлена логика автообновления: при выключении Obhodiq его cron-обновление тоже останавливается
- улучшен импорт подписок и обработка провайдерских обёрток
- сохранена частичная эмуляция `HApp 1.0` для части обёрнутых subscription-endpoint
- `WS`-серверы теперь импортируются выключенными по умолчанию, но их можно включить вручную
- обновлены `install/uninstall`-скрипты и документация проекта

Что важно понимать:

- Obhodiq умеет разбирать многие форматы подписок, но это не гарантирует работу каждой провайдерской ссылки
- будет ли конкретный сервер реально применён и получит ли он пинг, по-прежнему решают Podkop / sing-box
- если какая-то подписка не заработала, лучше прислать обезличенный пример через issue

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

Техническая пометка:

- Obhodiq — это вспомогательный парсер подписок и слой интеграции с Podkop
- он не содержит собственного VPN/proxy-движка
- он не поднимает туннели и не маршрутизирует трафик самостоятельно
- он только подготавливает конфигурационные данные для уже установленного Podkop

Политика удаления:

- удаление должно затрагивать только файлы Obhodiq
- удаление не должно затрагивать сам Podkop
