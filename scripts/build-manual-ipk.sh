#!/bin/sh

set -eu

PROJ="${1:-}"
OUT="${2:-}"

if [ -z "$PROJ" ] || [ -z "$OUT" ]; then
  echo "Usage: $0 <project-root> <output-dir>" >&2
  exit 1
fi

WORK="/tmp/obh-ipk-build"
IPKG_BUILD="${IPKG_BUILD:-/mnt/c/Users/artem/OneDrive/Documents/Роутер/sdk24link/scripts/ipkg-build}"
rm -rf "$WORK"
mkdir -p "$WORK/backend/data" "$WORK/backend/control" "$WORK/luci/data" "$WORK/luci/control" "$OUT"

mkdir -p "$WORK/backend/data/etc/config" \
  "$WORK/backend/data/etc/init.d" \
  "$WORK/backend/data/usr/bin" \
  "$WORK/backend/data/usr/lib/obhodiq" \
  "$WORK/backend/data/www/cgi-bin"

cp "$PROJ/packages/obhodiq/files/etc/config/obhodiq" "$WORK/backend/data/etc/config/obhodiq"
cp "$PROJ/packages/obhodiq/files/etc/init.d/obhodiq" "$WORK/backend/data/etc/init.d/obhodiq"
cp "$PROJ/packages/obhodiq/files/usr/bin/obhodiq" "$WORK/backend/data/usr/bin/obhodiq"
cp "$PROJ/packages/obhodiq/files/usr/lib/obhodiq/"* "$WORK/backend/data/usr/lib/obhodiq/"
cp "$PROJ/packages/obhodiq/files/www/cgi-bin/obhodiq" "$WORK/backend/data/www/cgi-bin/obhodiq"

chmod 0755 \
  "$WORK/backend/data/etc/init.d/obhodiq" \
  "$WORK/backend/data/usr/bin/obhodiq" \
  "$WORK/backend/data/usr/lib/obhodiq/"*.sh \
  "$WORK/backend/data/www/cgi-bin/obhodiq"

cat > "$WORK/backend/control/control" <<'EOF'
Package: obhodiq
Version: 0.2.0
Depends: podkop, curl, jq, coreutils-base64
Source: local
Section: net
Category: Network
Title: Obhodiq subscription manager for Podkop
Architecture: all
Maintainer: renqismike
Description: Subscription parsing, filtering, latency checks, and Podkop sync layer.
EOF

cat > "$WORK/backend/control/conffiles" <<'EOF'
/etc/config/obhodiq
EOF

cat > "$WORK/backend/control/postinst" <<'EOF'
#!/bin/sh
[ -n "$IPKG_INSTROOT" ] && exit 0
mkdir -p /etc/obhodiq /var/run/obhodiq
/etc/init.d/obhodiq enable >/dev/null 2>&1 || true
/etc/init.d/obhodiq restart >/dev/null 2>&1 || true
exit 0
EOF

cat > "$WORK/backend/control/prerm" <<'EOF'
#!/bin/sh
[ -n "$IPKG_INSTROOT" ] && exit 0
ACTION="${1:-remove}"
/etc/init.d/obhodiq stop >/dev/null 2>&1 || true
[ "$ACTION" = "upgrade" ] && exit 0
/usr/bin/obhodiq set-update-schedule never >/dev/null 2>&1 || true
/etc/init.d/obhodiq disable >/dev/null 2>&1 || true
if [ -f /etc/crontabs/root ]; then
  tmp_file="$(mktemp)"
  awk -v begin="# BEGIN PODKOP-SUB-MANAGER" -v end="# END PODKOP-SUB-MANAGER" '
    $0 == begin { skip = 1; next }
    $0 == end { skip = 0; next }
    skip != 1 { print }
  ' /etc/crontabs/root > "$tmp_file"
  mv "$tmp_file" /etc/crontabs/root
  /etc/init.d/cron restart >/dev/null 2>&1 || /etc/init.d/cron reload >/dev/null 2>&1 || true
fi
exit 0
EOF

cat > "$WORK/backend/control/postrm" <<'EOF'
#!/bin/sh
[ -n "$IPKG_INSTROOT" ] && exit 0
ACTION="${1:-remove}"
[ "$ACTION" = "upgrade" ] && exit 0
rm -rf /etc/obhodiq /var/run/obhodiq
rm -f /tmp/obhodiq-auto-update.log /tmp/obhodiq-ping-refresh.log /tmp/obhodiq*.ipk /tmp/obhodiq*.apk
rm -f /etc/config/obhodiq /etc/init.d/obhodiq /usr/bin/obhodiq /www/cgi-bin/obhodiq
rm -rf /usr/lib/obhodiq
exit 0
EOF

chmod 0755 \
  "$WORK/backend/control/postinst" \
  "$WORK/backend/control/prerm" \
  "$WORK/backend/control/postrm"

mkdir -p "$WORK/backend/pkg/CONTROL"
cp -a "$WORK/backend/data/." "$WORK/backend/pkg/"
cp -a "$WORK/backend/control/." "$WORK/backend/pkg/CONTROL/"
"$IPKG_BUILD" "$WORK/backend/pkg" "$OUT" >/dev/null
mv "$OUT/obhodiq_0.2.0_all.ipk" "$OUT/obhodiq_0.2.0_all.ipk.tmp" 2>/dev/null || true
if [ -f "$OUT/obhodiq_0.2.0_all.ipk.tmp" ]; then
  mv "$OUT/obhodiq_0.2.0_all.ipk.tmp" "$OUT/obhodiq_0.2.0_all.ipk"
fi

mkdir -p \
  "$WORK/luci/data/www/luci-static/resources/view/obhodiq" \
  "$WORK/luci/data/usr/share/luci/menu.d"

cp "$PROJ/packages/luci-app-obhodiq/htdocs/luci-static/resources/view/obhodiq/main.js" \
  "$WORK/luci/data/www/luci-static/resources/view/obhodiq/main.js"
cp "$PROJ/packages/luci-app-obhodiq/root/usr/share/luci/menu.d/luci-app-obhodiq.json" \
  "$WORK/luci/data/usr/share/luci/menu.d/luci-app-obhodiq.json"

cat > "$WORK/luci/control/control" <<'EOF'
Package: luci-app-obhodiq
Version: 0.2.0
Depends: luci-base, obhodiq
Source: local
Section: luci
Category: LuCI
Title: LuCI app for Obhodiq
Architecture: all
Maintainer: renqismike
Description: LuCI UI for the Obhodiq subscription manager.
EOF

cat > "$WORK/luci/control/postrm" <<'EOF'
#!/bin/sh
[ -n "$IPKG_INSTROOT" ] && exit 0
rm -f /usr/share/luci/menu.d/luci-app-obhodiq.json
rm -rf /www/luci-static/resources/view/obhodiq
exit 0
EOF

chmod 0755 "$WORK/luci/control/postrm"

mkdir -p "$WORK/luci/pkg/CONTROL"
cp -a "$WORK/luci/data/." "$WORK/luci/pkg/"
cp -a "$WORK/luci/control/." "$WORK/luci/pkg/CONTROL/"
"$IPKG_BUILD" "$WORK/luci/pkg" "$OUT" >/dev/null
mv "$OUT/luci-app-obhodiq_0.2.0_all.ipk" "$OUT/luci-app-obhodiq_0.2.0_all.ipk.tmp" 2>/dev/null || true
if [ -f "$OUT/luci-app-obhodiq_0.2.0_all.ipk.tmp" ]; then
  mv "$OUT/luci-app-obhodiq_0.2.0_all.ipk.tmp" "$OUT/luci-app-obhodiq_0.2.0_all.ipk"
fi

echo "Built manual IPK packages in $OUT"
