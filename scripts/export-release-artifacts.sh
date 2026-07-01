#!/bin/sh

set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
PROJECT_ROOT="${2:-$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)}"
SDK_ROOT="${1:-${OPENWRT_SDK_ROOT:-}}"
APK_SDK_ROOT="${3:-${OPENWRT_APK_SDK_ROOT:-}}"
DIST_DIR="$PROJECT_ROOT/dist"
PKG_DIR="$SDK_ROOT/bin/packages/mipsel_24kc/base"
APK_PKG_DIR=""

if [ -z "${SDK_ROOT:-}" ]; then
  echo "Usage: $0 <sdk-root> [project-root] [apk-sdk-root]" >&2
  echo "Or set OPENWRT_SDK_ROOT and OPENWRT_APK_SDK_ROOT in the environment." >&2
  exit 1
fi

if [ -n "${APK_SDK_ROOT:-}" ]; then
  APK_PKG_DIR="$APK_SDK_ROOT/bin/packages/x86_64/base"
fi

mkdir -p "$DIST_DIR"
rm -f \
  "$DIST_DIR"/obhodiq_*.ipk \
  "$DIST_DIR"/luci-app-obhodiq_*.ipk \
  "$DIST_DIR"/podkop-sub-manager_*.ipk \
  "$DIST_DIR"/luci-app-podkop-sub-manager_*.ipk

[ -d "$PKG_DIR" ] && cp -f "$PKG_DIR"/obhodiq_*.ipk "$DIST_DIR"/ 2>/dev/null || true
[ -d "$PKG_DIR" ] && cp -f "$PKG_DIR"/luci-app-obhodiq_*.ipk "$DIST_DIR"/ 2>/dev/null || true
[ -d "$APK_PKG_DIR" ] && cp -f "$APK_PKG_DIR"/obhodiq-*.apk "$DIST_DIR"/ 2>/dev/null || true
[ -d "$APK_PKG_DIR" ] && cp -f "$APK_PKG_DIR"/luci-app-obhodiq-*.apk "$DIST_DIR"/ 2>/dev/null || true
cp -f "$PROJECT_ROOT/install.sh" "$DIST_DIR"/install.sh
cp -f "$PROJECT_ROOT/uninstall.sh" "$DIST_DIR"/uninstall.sh
cp -f "$PROJECT_ROOT/RELEASE.md" "$DIST_DIR"/RELEASE.md

printf 'Exported release artifacts to %s\n' "$DIST_DIR"
