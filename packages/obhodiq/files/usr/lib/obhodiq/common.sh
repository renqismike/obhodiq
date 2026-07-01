#!/bin/sh

RUNTIME_DIR="${RUNTIME_DIR:-/var/run/obhodiq}"
DATA_DIR="${DATA_DIR:-/etc/obhodiq}"
STATE_FILE="${STATE_FILE:-$DATA_DIR/state.json}"
RAW_FILE="${RAW_FILE:-$DATA_DIR/subscription.raw}"
HEADER_FILE="${HEADER_FILE:-$RUNTIME_DIR/subscription.headers}"
PARSED_FILE="${PARSED_FILE:-$DATA_DIR/servers.json}"
GROUPS_FILE="${GROUPS_FILE:-$DATA_DIR/groups.json}"
EXCLUDED_FILE="${EXCLUDED_FILE:-$DATA_DIR/excluded.json}"
META_FILE="${META_FILE:-$DATA_DIR/meta.json}"
EXPORT_FILE="${EXPORT_FILE:-$DATA_DIR/active-export.json}"
PODKOP_FILE="${PODKOP_FILE:-$DATA_DIR/podkop-section.json}"
LATENCY_FILE="${LATENCY_FILE:-$DATA_DIR/latency.json}"
ERROR_FILE="${ERROR_FILE:-$DATA_DIR/error.json}"
PODKOP_APPLY_FILE="${PODKOP_APPLY_FILE:-$RUNTIME_DIR/apply-podkop.sh}"
PODKOP_APPLY_RESULT_FILE="${PODKOP_APPLY_RESULT_FILE:-$DATA_DIR/podkop-apply-result.json}"
PODKOP_UCI_SNIPPET_FILE="${PODKOP_UCI_SNIPPET_FILE:-$DATA_DIR/podkop-main-section.txt}"
DEVICE_ID_FILE="${DEVICE_ID_FILE:-$DATA_DIR/device.id}"
CONFIG_NAME="${CONFIG_NAME:-obhodiq}"
UCI_BIN="${UCI_BIN:-uci}"

ensure_runtime_dir() {
  mkdir -p "$RUNTIME_DIR"
}

ensure_data_dir() {
  mkdir -p "$DATA_DIR"
}

ensure_json_file() {
  file="$1"
  default_json="$2"
  [ -f "$file" ] || printf '%s\n' "$default_json" > "$file"
}

init_storage_files() {
  ensure_runtime_dir
  ensure_data_dir
  ensure_json_file "$STATE_FILE" '{}'
  ensure_json_file "$PARSED_FILE" '{"updated_at":null,"count":0,"servers":[]}'
  ensure_json_file "$GROUPS_FILE" '{}'
  ensure_json_file "$EXCLUDED_FILE" '[]'
  ensure_json_file "$META_FILE" '{}'
  ensure_json_file "$ERROR_FILE" '{}'
  ensure_json_file "$EXPORT_FILE" '{}'
  ensure_json_file "$PODKOP_FILE" '{}'
  ensure_json_file "$LATENCY_FILE" '{}'
  ensure_json_file "$PODKOP_APPLY_RESULT_FILE" '{}'
}

get_client_device_id() {
  ensure_data_dir

  if [ -s "$DEVICE_ID_FILE" ]; then
    cat "$DEVICE_ID_FILE"
    return 0
  fi

  device_id="$(
    cat /proc/sys/kernel/random/uuid 2>/dev/null \
      || dd if=/dev/urandom bs=16 count=1 2>/dev/null | od -An -tx1 | tr -d ' \n'
  )"
  device_id="$(printf '%s' "$device_id" | tr -d '\r\n')"
  [ -n "${device_id:-}" ] || device_id="obhodiq-device"
  printf '%s\n' "$device_id" > "$DEVICE_ID_FILE"
  printf '%s\n' "$device_id"
}

log_msg() {
  echo "[obhodiq] $*"
}

has_uci() {
  command -v "$UCI_BIN" >/dev/null 2>&1
}

config_get() {
  section="$1"
  option="$2"
  default_value="${3:-}"

  if has_uci; then
    value="$("$UCI_BIN" -q get "$CONFIG_NAME.$section.$option" 2>/dev/null || true)"
  else
    value=""
  fi

  if [ -n "${value:-}" ]; then
    printf '%s\n' "$value"
  else
    printf '%s\n' "$default_value"
  fi
}

config_set() {
  section="$1"
  option="$2"
  value="$3"

  has_uci || return 0

  escaped_value="$(printf '%s' "$value" | sed "s/'/'\\\\''/g")"
  printf "set %s.%s.%s='%s'\ncommit %s\n" \
    "$CONFIG_NAME" "$section" "$option" "$escaped_value" "$CONFIG_NAME" | "$UCI_BIN" -q batch
}

require_jq() {
  command -v jq >/dev/null 2>&1 || {
    log_msg "jq is required"
    return 1
  }
}

has_podkop_service() {
  [ -x /etc/init.d/podkop ]
}

has_podkop_cmd() {
  command -v /usr/bin/podkop >/dev/null 2>&1 || command -v podkop >/dev/null 2>&1
}

podkop_exec() {
  if command -v /usr/bin/podkop >/dev/null 2>&1; then
    /usr/bin/podkop "$@"
  else
    podkop "$@"
  fi
}
