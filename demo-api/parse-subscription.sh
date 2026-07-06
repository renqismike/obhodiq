#!/bin/sh

set -eu

if [ $# -lt 1 ]; then
  printf '%s\n' '{"error":"missing subscription url"}'
  exit 1
fi

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
REPO_ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"
WORK_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$WORK_DIR"
}

trap cleanup EXIT INT TERM

export RUNTIME_DIR="$WORK_DIR/runtime"
export DATA_DIR="$WORK_DIR/data"
export CONFIG_NAME="obhodiq-demo"
export UCI_BIN="/bin/false"

CONFIG_SUBSCRIPTION_URL="$1"
CONFIG_UPDATE_SCHEDULE="never"
CONFIG_ENABLED="1"
CONFIG_LANG="ru"
CONFIG_ACTIVE_GROUP="default"
CONFIG_SELECTION_MODE="auto"
CONFIG_ACTIVE_SERVER_ID=""

. "$REPO_ROOT/packages/obhodiq/files/usr/lib/obhodiq/common.sh"
. "$REPO_ROOT/packages/obhodiq/files/usr/lib/obhodiq/storage.sh"
. "$REPO_ROOT/packages/obhodiq/files/usr/lib/obhodiq/subscription.sh"

log_msg() {
  printf '[obhodiq] %s\n' "$*" >&2
}

has_uci() {
  return 1
}

config_get() {
  section="$1"
  option="$2"
  default_value="${3:-}"

  if [ "$section" = "main" ]; then
    case "$option" in
      subscription_url) printf '%s\n' "$CONFIG_SUBSCRIPTION_URL"; return 0 ;;
      update_schedule) printf '%s\n' "$CONFIG_UPDATE_SCHEDULE"; return 0 ;;
      enabled) printf '%s\n' "$CONFIG_ENABLED"; return 0 ;;
      lang) printf '%s\n' "$CONFIG_LANG"; return 0 ;;
      active_group) printf '%s\n' "$CONFIG_ACTIVE_GROUP"; return 0 ;;
      selection_mode) printf '%s\n' "$CONFIG_SELECTION_MODE"; return 0 ;;
      active_server_id) printf '%s\n' "$CONFIG_ACTIVE_SERVER_ID"; return 0 ;;
      podkop_section_name) printf '%s\n' 'main'; return 0 ;;
    esac
  fi

  printf '%s\n' "$default_value"
}

config_set() {
  section="$1"
  option="$2"
  value="$3"

  if [ "$section" = "main" ]; then
    case "$option" in
      subscription_url) CONFIG_SUBSCRIPTION_URL="$value" ;;
      update_schedule) CONFIG_UPDATE_SCHEDULE="$value" ;;
      enabled) CONFIG_ENABLED="$value" ;;
      lang) CONFIG_LANG="$value" ;;
      active_group) CONFIG_ACTIVE_GROUP="$value" ;;
      selection_mode) CONFIG_SELECTION_MODE="$value" ;;
      active_server_id) CONFIG_ACTIVE_SERVER_ID="$value" ;;
    esac
  fi
}

has_podkop_service() {
  return 1
}

has_podkop_cmd() {
  return 1
}

podkop_exec() {
  return 1
}

fetch_ok="false"
parse_ok="false"
preview_ok="false"

init_storage_files
clear_subscription_error || true

if fetch_subscription; then
  fetch_ok="true"
fi

if parse_subscription; then
  parse_ok="true"
fi

if sync_podkop_export >/dev/null 2>&1; then
  preview_ok="true"
fi

STATUS_JSON_FILE="$(mktemp)"
ERROR_JSON_FILE="$(mktemp)"

print_status > "$STATUS_JSON_FILE"
cat "$ERROR_FILE" 2>/dev/null > "$ERROR_JSON_FILE" || printf '{}' > "$ERROR_JSON_FILE"

jq -n \
  --argjson fetch_ok "$fetch_ok" \
  --argjson parse_ok "$parse_ok" \
  --argjson preview_ok "$preview_ok" \
  --slurpfile status "$STATUS_JSON_FILE" \
  --slurpfile error "$ERROR_JSON_FILE" \
  '{
    ok: ($fetch_ok and $parse_ok),
    fetch_ok: $fetch_ok,
    parse_ok: $parse_ok,
    preview_ok: $preview_ok,
    status: {
      active_server_id: (($status[0].active_server_id) // ""),
      enabled: (($status[0].enabled) // true),
      lang: (($status[0].lang) // "ru"),
      subscription_url: (($status[0].subscription_url) // ""),
      parsed_source_url: (($status[0].parsed_source_url) // ""),
      update_schedule: (($status[0].update_schedule) // "never"),
      selection_mode: (($status[0].selection_mode) // "auto"),
      configured_active_server_id: (($status[0].configured_active_server_id) // ""),
      configured_selection_mode: (($status[0].configured_selection_mode) // "auto"),
      live: (($status[0].live) // {}),
      subscription_error: (($status[0].subscription_error) // {}),
      meta: (($status[0].meta) // {}),
      count: (($status[0].count) // 0),
      supported_count: (($status[0].supported_count) // 0),
      unsupported_count: (($status[0].unsupported_count) // 0),
      enabled_count: (($status[0].enabled_count) // 0),
      latency_count: (($status[0].latency_count) // 0),
      servers: (($status[0].servers) // [])
    },
    error: ($error[0] // {})
  }'
