#!/bin/sh

set -eu

cleanup_cron() {
  crontab_file="/etc/crontabs/root"
  marker_begin="# BEGIN PODKOP-SUB-MANAGER"
  marker_end="# END PODKOP-SUB-MANAGER"

  [ -f "$crontab_file" ] || return 0

  tmp_file="$(mktemp)"
  awk -v begin="$marker_begin" -v end="$marker_end" '
    $0 == begin { skip = 1; next }
    $0 == end { skip = 0; next }
    skip != 1 { print }
  ' "$crontab_file" > "$tmp_file"
  mv "$tmp_file" "$crontab_file"
  /etc/init.d/cron restart >/dev/null 2>&1 || /etc/init.d/cron reload >/dev/null 2>&1 || true
}

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

printf 'Removing Obhodiq. Podkop packages stay installed.\n'

/etc/init.d/obhodiq stop >/dev/null 2>&1 || true
/etc/init.d/obhodiq disable >/dev/null 2>&1 || true

cleanup_cron

remove_pkg luci-app-obhodiq
remove_pkg obhodiq

rm -rf /etc/obhodiq /var/run/obhodiq
rm -f /tmp/obhodiq-auto-update.log /tmp/obhodiq-ping-refresh.log /tmp/obhodiq*.ipk /tmp/obhodiq*.apk
rm -f /etc/config/obhodiq /etc/init.d/obhodiq /usr/bin/obhodiq /www/cgi-bin/obhodiq
rm -f /usr/share/luci/menu.d/luci-app-obhodiq.json
rm -rf /usr/lib/obhodiq /www/luci-static/resources/view/obhodiq

printf 'Obhodiq removed. Podkop packages were not removed.\n'
