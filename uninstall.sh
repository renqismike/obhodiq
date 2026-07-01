#!/bin/sh

set -eu

remove_pkg() {
  pkg="$1"

  if command -v opkg >/dev/null 2>&1; then
    opkg remove "$pkg" >/dev/null 2>&1 || true
    return 0
  fi

  if command -v apk >/dev/null 2>&1; then
    apk del "$pkg" >/dev/null 2>&1 || true
    return 0
  fi
}

/etc/init.d/obhodiq stop >/dev/null 2>&1 || true
/etc/init.d/obhodiq disable >/dev/null 2>&1 || true

remove_pkg luci-app-obhodiq
remove_pkg obhodiq

rm -rf /etc/obhodiq /var/run/obhodiq
rm -f /tmp/obhodiq-auto-update.log
rm -f /etc/config/obhodiq /etc/init.d/obhodiq /usr/bin/obhodiq /www/cgi-bin/obhodiq
rm -f /usr/share/luci/menu.d/luci-app-obhodiq.json
rm -rf /usr/lib/obhodiq /www/luci-static/resources/view/obhodiq

printf 'Obhodiq removed. Podkop was not touched.\n'
