# Obhodiq Release Notes

## English

### Obhodiq 0.1.1

This release focuses on stabilizing package installation, subscription refresh behavior, server switching, and cleaner Podkop integration.

Main changes in this release:

- verified clean install and clean reinstall on OpenWrt `24.10.6` (`opkg`) and OpenWrt `25.12.5` (`apk`)
- verified clean removal of Obhodiq without removing or breaking Podkop
- refreshed package contents so backend, CGI, init script, CLI, LuCI page and runtime helper scripts are included in release packages
- fixed cases where old subscription data could survive after a failed update or overlapping refresh
- fixed manual server switching so repeated switching between different servers is applied correctly
- fixed auto-update behavior so disabling Obhodiq also stops its cron-based refresh
- improved subscription import flow and provider-wrapper handling
- kept partial `HApp 1.0` emulation for some wrapped subscription feeds
- `WS` servers are now imported disabled by default, but can still be enabled manually
- updated install/uninstall scripts and project documentation

Tested with:

- Podkop `0.7.19`
- Podkop `0.7.20`
- OpenWrt `24.10.6`
- OpenWrt `25.12.5`

## Русский

### Obhodiq 0.1.1

Этот релиз в первую очередь посвящён стабилизации установки пакетов, обновления подписок, переключения серверов и более чистой интеграции с Podkop.

Основные изменения в этом релизе:

- подтверждена чистая установка и чистая переустановка на OpenWrt `24.10.6` (`opkg`) и OpenWrt `25.12.5` (`apk`)
- подтверждено чистое удаление Obhodiq без удаления и поломки Podkop
- обновлён состав пакетов: в релизные файлы входят backend, CGI, init-скрипт, CLI, LuCI-страница и служебные runtime-скрипты
- исправлены случаи, когда после неудачного обновления или пересекающихся refresh-запусков могло оставаться старое состояние подписки
- исправлено ручное переключение серверов: повторное переключение между разными серверами теперь применяется корректно
- исправлена логика автообновления: при выключении Obhodiq его cron-обновление тоже останавливается
- улучшен импорт подписок и обработка провайдерских обёрток
- сохранена частичная эмуляция `HApp 1.0` для части обёрнутых точек выдачи подписок
- `WS`-серверы теперь импортируются выключенными по умолчанию, но их можно включить вручную
- обновлены `install/uninstall`-скрипты и документация проекта

Проверено на:

- Podkop `0.7.19`
- Podkop `0.7.20`
- OpenWrt `24.10.6`
- OpenWrt `25.12.5`
