#!/bin/sh

set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
PROJECT_ROOT="${2:-$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)}"
SDK_ROOT="${1:-${OPENWRT_APK_SDK_ROOT:-}}"
VERSION="${3:-0.1.0-r2}"
DIST_DIR="$PROJECT_ROOT/dist"
WORK_DIR="$SDK_ROOT/tmp/obhodiq-apk-build"
APK_BIN="$SDK_ROOT/staging_dir/host/bin/apk"

if [ -z "${SDK_ROOT:-}" ]; then
  echo "Usage: $0 <apk-sdk-root> [project-root] [version]" >&2
  echo "Or set OPENWRT_APK_SDK_ROOT in the environment." >&2
  exit 1
fi

BACKEND_ROOT="$WORK_DIR/obhodiq-root"
LUCI_ROOT="$WORK_DIR/luci-root"
BACKEND_SCRIPTS="$WORK_DIR/obhodiq-scripts"
LUCI_SCRIPTS="$WORK_DIR/luci-scripts"

mkdir -p "$DIST_DIR"
rm -rf "$WORK_DIR"
mkdir -p "$BACKEND_ROOT" "$LUCI_ROOT" "$BACKEND_SCRIPTS" "$LUCI_SCRIPTS"

mkdir -p "$BACKEND_ROOT/etc/config"
cp -f "$PROJECT_ROOT/packages/obhodiq/files/etc/config/obhodiq" "$BACKEND_ROOT/etc/config/obhodiq"

mkdir -p "$BACKEND_ROOT/etc/init.d"
cp -f "$PROJECT_ROOT/packages/obhodiq/files/etc/init.d/obhodiq" "$BACKEND_ROOT/etc/init.d/obhodiq"
chmod 0755 "$BACKEND_ROOT/etc/init.d/obhodiq"

mkdir -p "$BACKEND_ROOT/usr/bin"
cp -f "$PROJECT_ROOT/packages/obhodiq/files/usr/bin/obhodiq" "$BACKEND_ROOT/usr/bin/obhodiq"
chmod 0755 "$BACKEND_ROOT/usr/bin/obhodiq"

mkdir -p "$BACKEND_ROOT/usr/lib/obhodiq"
cp -f "$PROJECT_ROOT/packages/obhodiq/files/usr/lib/obhodiq/"* "$BACKEND_ROOT/usr/lib/obhodiq/"
chmod 0755 "$BACKEND_ROOT/usr/lib/obhodiq/"*.sh

mkdir -p "$BACKEND_ROOT/www/cgi-bin"
cp -f "$PROJECT_ROOT/packages/obhodiq/files/www/cgi-bin/obhodiq" "$BACKEND_ROOT/www/cgi-bin/obhodiq"
chmod 0755 "$BACKEND_ROOT/www/cgi-bin/obhodiq"

mkdir -p "$LUCI_ROOT/www/luci-static/resources/view/obhodiq"
cp -f "$PROJECT_ROOT/packages/luci-app-obhodiq/htdocs/luci-static/resources/view/obhodiq/main.js" \
  "$LUCI_ROOT/www/luci-static/resources/view/obhodiq/main.js"

mkdir -p "$LUCI_ROOT/usr/share/luci/menu.d"
cp -f "$PROJECT_ROOT/packages/luci-app-obhodiq/root/usr/share/luci/menu.d/luci-app-obhodiq.json" \
  "$LUCI_ROOT/usr/share/luci/menu.d/luci-app-obhodiq.json"

cat >"$BACKEND_SCRIPTS/post-install" <<'EOF'
#!/bin/sh
[ -s "${IPKG_INSTROOT}/lib/functions.sh" ] || exit 0
. "${IPKG_INSTROOT}/lib/functions.sh"
mkdir -p "${IPKG_INSTROOT}/etc/obhodiq" "${IPKG_INSTROOT}/var/run/obhodiq"
/etc/init.d/obhodiq enable >/dev/null 2>&1 || true
/etc/init.d/obhodiq restart >/dev/null 2>&1 || true
exit 0
EOF

cat >"$BACKEND_SCRIPTS/pre-deinstall" <<'EOF'
#!/bin/sh
/usr/bin/obhodiq set-update-schedule never >/dev/null 2>&1 || true
/etc/init.d/obhodiq stop >/dev/null 2>&1 || true
/etc/init.d/obhodiq disable >/dev/null 2>&1 || true
exit 0
EOF

cat >"$BACKEND_SCRIPTS/post-deinstall" <<'EOF'
#!/bin/sh
rm -rf /etc/obhodiq /var/run/obhodiq
rm -f /tmp/obhodiq-auto-update.log
rm -f /etc/config/obhodiq /etc/init.d/obhodiq /usr/bin/obhodiq /www/cgi-bin/obhodiq
rm -rf /usr/lib/obhodiq
exit 0
EOF

cat >"$LUCI_SCRIPTS/post-deinstall" <<'EOF'
#!/bin/sh
rm -f /usr/share/luci/menu.d/luci-app-obhodiq.json
rm -rf /www/luci-static/resources/view/obhodiq
exit 0
EOF

chmod 0755 "$BACKEND_SCRIPTS/post-install" "$BACKEND_SCRIPTS/pre-deinstall" "$BACKEND_SCRIPTS/post-deinstall" "$LUCI_SCRIPTS/post-deinstall"

"$APK_BIN" mkpkg \
  --info "name:obhodiq" \
  --info "version:${VERSION}" \
  --info "arch:noarch" \
  --info "license:GPL-2.0-or-later" \
  --info "description:Obhodiq subscription manager for Podkop" \
  --info "url:https://github.com/renqismike/obhodiq" \
  --info "origin:custom/obhodiq" \
  --info "maintainer:renqismike" \
  --info "depends:podkop" \
  --info "depends:curl" \
  --info "depends:jq" \
  --info "depends:coreutils-base64" \
  --script "post-install:$BACKEND_SCRIPTS/post-install" \
  --script "pre-deinstall:$BACKEND_SCRIPTS/pre-deinstall" \
  --script "post-deinstall:$BACKEND_SCRIPTS/post-deinstall" \
  --files "$BACKEND_ROOT" \
  --output "$DIST_DIR/obhodiq-${VERSION}.apk"

"$APK_BIN" mkpkg \
  --info "name:luci-app-obhodiq" \
  --info "version:${VERSION}" \
  --info "arch:noarch" \
  --info "license:GPL-2.0-or-later" \
  --info "description:LuCI app for Obhodiq" \
  --info "url:https://github.com/renqismike/obhodiq" \
  --info "origin:custom/luci-app-obhodiq" \
  --info "maintainer:renqismike" \
  --info "depends:luci-base" \
  --info "depends:obhodiq" \
  --script "post-deinstall:$LUCI_SCRIPTS/post-deinstall" \
  --files "$LUCI_ROOT" \
  --output "$DIST_DIR/luci-app-obhodiq-${VERSION}.apk"

printf 'Built APK packages in %s\n' "$DIST_DIR"
