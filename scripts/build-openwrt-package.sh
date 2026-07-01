#!/bin/sh

set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
PROJECT_ROOT="${2:-$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)}"
SDK_ROOT="${1:-${OPENWRT_SDK_ROOT:-}}"

if [ -z "${SDK_ROOT:-}" ]; then
  echo "Usage: $0 <sdk-root> [project-root]" >&2
  echo "Or set OPENWRT_SDK_ROOT in the environment." >&2
  exit 1
fi

BACKEND_PKG="$PROJECT_ROOT/packages/obhodiq"
LUCI_PKG="$PROJECT_ROOT/packages/luci-app-obhodiq"

if [ ! -d "$SDK_ROOT" ]; then
  echo "SDK not found: $SDK_ROOT" >&2
  exit 1
fi

if [ ! -d "$BACKEND_PKG" ]; then
  echo "Backend package not found: $BACKEND_PKG" >&2
  exit 1
fi

rm -rf "$SDK_ROOT/package/obhodiq"
ln -s "$BACKEND_PKG" "$SDK_ROOT/package/obhodiq"

if [ -d "$LUCI_PKG" ]; then
  rm -rf "$SDK_ROOT/package/luci-app-obhodiq"
  ln -s "$LUCI_PKG" "$SDK_ROOT/package/luci-app-obhodiq"
fi

cd "$SDK_ROOT"

echo "Building obhodiq..."
make package/obhodiq/compile V=s -j1

if [ -d "$LUCI_PKG" ]; then
  echo "Building luci-app-obhodiq..."
  make package/luci-app-obhodiq/compile V=s -j1
fi

echo "Package build complete."
