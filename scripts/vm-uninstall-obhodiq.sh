#!/bin/sh

set -eu

VM_HOST="${1:-${OPENWRT_VM_HOST:-}}"
VM_PORT="${VM_PORT:-${OPENWRT_VM_PORT:-22}}"

if [ -z "${VM_HOST:-}" ]; then
  echo "Usage: $0 <vm-host>" >&2
  echo "Optional: set VM_PORT or OPENWRT_VM_PORT." >&2
  exit 1
fi

ssh -p "$VM_PORT" "$VM_HOST" '
  /etc/init.d/obhodiq stop >/dev/null 2>&1 || true
  /etc/init.d/obhodiq disable >/dev/null 2>&1 || true
  opkg remove luci-app-obhodiq obhodiq >/dev/null 2>&1 || true
  apk del luci-app-obhodiq obhodiq >/dev/null 2>&1 || true
  rm -rf /etc/obhodiq /var/run/obhodiq
  rm -f /etc/config/obhodiq /etc/init.d/obhodiq /usr/bin/obhodiq /www/cgi-bin/obhodiq
  rm -f /usr/share/luci/menu.d/luci-app-obhodiq.json
  rm -rf /usr/lib/obhodiq /www/luci-static/resources/view/obhodiq
  rm -f /tmp/obhodiq*.ipk /tmp/obhodiq*.apk /tmp/obhodiq-auto-update.log /tmp/obhodiq-ping-refresh.log
  uci -q delete podkop.config.node >/dev/null 2>&1 || true
  if uci -q show podkop 2>/dev/null | grep -q "^podkop.config="; then
    if ! uci -q show podkop 2>/dev/null | grep -q "^podkop.config\\.[^=]*="; then
      uci -q delete podkop.config >/dev/null 2>&1 || true
    fi
  fi
  uci -q commit podkop >/dev/null 2>&1 || true
  /etc/init.d/podkop reload >/dev/null 2>&1 || /etc/init.d/podkop restart >/dev/null 2>&1 || true
'

printf 'Obhodiq removed from VM.\n'
