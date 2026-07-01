# Obhodiq Release Notes

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

Uninstall policy:

- uninstall removes Obhodiq files only
- uninstall must not remove Podkop itself
