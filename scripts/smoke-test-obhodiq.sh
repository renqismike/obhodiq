#!/bin/sh

set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
LIB_DIR="$ROOT_DIR/packages/obhodiq/files/usr/lib/obhodiq"
BIN_DIR="$ROOT_DIR/packages/obhodiq/files/usr/bin"
TMP_DIR="${TMPDIR:-/tmp}/obhodiq-smoke"

rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR/bin" "$TMP_DIR/data" "$TMP_DIR/run"

cat > "$TMP_DIR/bin/uci" <<'EOF'
#!/bin/sh
set -eu
DB="${MOCK_UCI_DB:?}"
mkdir -p "$(dirname "$DB")"
touch "$DB"
case "${1:-}" in
  -q)
    shift
    ;;
esac
cmd="${1:-}"
shift || true
case "$cmd" in
  get)
    key="$1"
    grep -F "${key}=" "$DB" | tail -n 1 | sed "s/^${key}=//" || true
    ;;
  set)
    pair="$1"
    key="${pair%%=*}"
    value="${pair#*=}"
    grep -Fv "${key}=" "$DB" > "$DB.tmp" || true
    printf '%s=%s\n' "$key" "$value" >> "$DB.tmp"
    mv "$DB.tmp" "$DB"
    ;;
  commit)
    :
    ;;
  *)
    echo "unsupported mock uci command: $cmd" >&2
    exit 1
    ;;
esac
EOF
chmod +x "$TMP_DIR/bin/uci"

cat > "$TMP_DIR/data/subscription.raw" <<'EOF'
ss://YWVzLTI1Ni1nY206cGFzc0BleGFtcGxlLmNvbTo0NDM=#alpha
vless://11111111-1111-1111-1111-111111111111@example.org:443?type=tcp&security=tls#beta
EOF

cat > "$TMP_DIR/run/subscription.headers" <<'EOF'
Subscription-Userinfo: upload=1000; download=2000; total=10000; expire=1893456000
Profile-Web-Page-Name: Demo
Profile-Update-Interval: 12
EOF

MOCK_UCI_DB="$TMP_DIR/mock-uci.db"
PATH="$TMP_DIR/bin:$PATH"
RUNTIME_DIR="$TMP_DIR/run"
DATA_DIR="$TMP_DIR/data"
CONFIG_NAME="obhodiq"
UCI_BIN="uci"

printf '%s=%s\n' \
  "obhodiq.main.active_group" "default" \
  "obhodiq.main.podkop_section_name" "main" \
  > "$MOCK_UCI_DB"

. "$LIB_DIR/common.sh"
. "$LIB_DIR/storage.sh"
. "$LIB_DIR/subscription.sh"
. "$LIB_DIR/ping.sh"

parse_subscription
set_active_server "srv-1"
sync_podkop_export >/dev/null
write_podkop_apply_script >/dev/null
apply_podkop_config >/dev/null
print_status
