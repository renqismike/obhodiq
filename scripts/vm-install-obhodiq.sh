#!/bin/sh

set -eu

SDK_ROOT="${1:-${OPENWRT_SDK_ROOT:-}}"
VM_HOST="${2:-${OPENWRT_VM_HOST:-}}"
VM_PORT="${VM_PORT:-${OPENWRT_VM_PORT:-22}}"

if [ -z "${SDK_ROOT:-}" ] || [ -z "${VM_HOST:-}" ]; then
  echo "Usage: $0 <sdk-root> <vm-host>" >&2
  echo "Optional: set VM_PORT or OPENWRT_VM_PORT." >&2
  exit 1
fi

PKG_DIR="$SDK_ROOT/bin/packages/mipsel_24kc/base"
BACKEND_IPK="$(ls -1 "$PKG_DIR"/obhodiq_*.ipk | sort | tail -n 1)"
LUCI_IPK="$(ls -1 "$PKG_DIR"/luci-app-obhodiq_*.ipk | sort | tail -n 1)"

ssh -p "$VM_PORT" "$VM_HOST" '
  opkg remove luci-app-podkop-sub-manager podkop-sub-manager >/dev/null 2>&1 || true
  opkg remove luci-app-obhodiq obhodiq >/dev/null 2>&1 || true
  rm -f /tmp/obhodiq_*.ipk /tmp/luci-app-obhodiq_*.ipk
'

ssh -p "$VM_PORT" "$VM_HOST" 'cat >/tmp/obhodiq.ipk' < "$BACKEND_IPK"
ssh -p "$VM_PORT" "$VM_HOST" 'cat >/tmp/luci-app-obhodiq.ipk' < "$LUCI_IPK"
ssh -p "$VM_PORT" "$VM_HOST" 'opkg install /tmp/obhodiq.ipk /tmp/luci-app-obhodiq.ipk'

printf 'Obhodiq installed on VM.\n'
