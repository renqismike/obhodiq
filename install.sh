#!/bin/sh

set -eu

APP_NAME="Obhodiq"
APP_PKG="obhodiq"
LUCI_PKG="luci-app-obhodiq"
REPO_OWNER="${REPO_OWNER:-renqismike}"
REPO_NAME="${REPO_NAME:-obhodiq}"
OBHODIQ_VERSION="${OBHODIQ_VERSION:-}"
OBHODIQ_RELEASE_TAG="${OBHODIQ_RELEASE_TAG:-}"
RELEASE_BASE_URL="${RELEASE_BASE_URL:-}"
TMP_DIR="${TMPDIR:-/tmp}/obhodiq-install"
CONFIG_BACKUP_FILE="${TMPDIR:-/tmp}/obhodiq-install-backup"
STATE_BACKUP_DIR="${TMPDIR:-/tmp}/obhodiq-install-state"

log() {
  printf '%s\n' "$*" >&2
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

note() {
  printf '%s\n' "$*" >&2
}

cleanup() {
  rm -rf "$TMP_DIR"
  rm -f "$CONFIG_BACKUP_FILE"
  rm -rf "$STATE_BACKUP_DIR"
}

trap cleanup EXIT INT TERM

detect_pkg_manager() {
  if command -v opkg >/dev/null 2>&1; then
    PKG_EXT="ipk"
    PKG_MANAGER="opkg"
    return 0
  fi

  if command -v apk >/dev/null 2>&1; then
    PKG_EXT="apk"
    PKG_MANAGER="apk"
    return 0
  fi

  fail "Neither opkg nor apk was found."
}

fetch_text() {
  url="$1"

  if command -v wget >/dev/null 2>&1; then
    wget -qO- "$url" 2>/dev/null || return 1
    return 0
  fi

  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" || return 1
    return 0
  fi

  fail "wget or curl is required."
}

release_version_key() {
  tag="${1#v}"
  base="$tag"
  rev="0"

  case "$tag" in
    *-r*)
      base="${tag%-r*}"
      rev="${tag##*-r}"
      case "$rev" in
        ''|*[!0-9]*) rev="0" ;;
      esac
      ;;
  esac

  major="$(printf '%s' "$base" | awk -F. '{print ($1 == "" ? 0 : $1) + 0}')"
  minor="$(printf '%s' "$base" | awk -F. '{print ($2 == "" ? 0 : $2) + 0}')"
  patch="$(printf '%s' "$base" | awk -F. '{print ($3 == "" ? 0 : $3) + 0}')"

  printf '%09d%09d%09d%09d' "$major" "$minor" "$patch" "$rev"
}

pick_highest_release_tag() {
  json="$1"
  tmp_file="$(mktemp)"
  best_tag=""
  best_key=""

  printf '%s' "$json" | tr '\n' ' ' | sed 's/},[[:space:]]*{/}\n{/g' > "$tmp_file"

  while IFS= read -r release_item || [ -n "${release_item:-}" ]; do
    case "$release_item" in
      *'"draft":false'*'"prerelease":false'*)
        tag="$(printf '%s' "$release_item" | sed -n 's/.*"tag_name":[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)"
        [ -n "$tag" ] || continue
        key="$(release_version_key "$tag")"
        if [ -z "$best_key" ] || [ "$key" \> "$best_key" ]; then
          best_key="$key"
          best_tag="$tag"
        fi
        ;;
    esac
  done < "$tmp_file"

  rm -f "$tmp_file"
  printf '%s\n' "$best_tag"
}

resolve_release() {
  if [ -n "$RELEASE_BASE_URL" ] && [ -n "$OBHODIQ_VERSION" ]; then
    return 0
  fi

  release_list_api="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases?per_page=20"
  release_list_json="$(fetch_text "$release_list_api")" || fail "Failed to fetch Obhodiq release metadata."
  latest_tag="$(pick_highest_release_tag "$release_list_json")"

  if [ -z "$latest_tag" ]; then
    release_api="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest"
    release_json="$(fetch_text "$release_api")" || fail "Failed to fetch the latest Obhodiq release metadata."
    latest_tag="$(printf '%s' "$release_json" | sed -n 's/.*"tag_name":[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)"
  fi

  [ -n "$latest_tag" ] || fail "Failed to detect the latest Obhodiq release tag."

  if [ -z "$OBHODIQ_RELEASE_TAG" ]; then
    OBHODIQ_RELEASE_TAG="$latest_tag"
  fi

  if [ -z "$OBHODIQ_VERSION" ]; then
    OBHODIQ_VERSION="${OBHODIQ_RELEASE_TAG#v}"
  fi

  if [ -z "$RELEASE_BASE_URL" ]; then
    RELEASE_BASE_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${OBHODIQ_RELEASE_TAG}"
  fi

  log "Using Obhodiq release: ${OBHODIQ_RELEASE_TAG}"
}

require_podkop() {
  if ! command -v /usr/bin/podkop >/dev/null 2>&1 && ! command -v podkop >/dev/null 2>&1; then
    fail "Original Podkop is required before installing ${APP_NAME}."
  fi

  podkop_version=""
  if command -v opkg >/dev/null 2>&1; then
    podkop_version="$(
      opkg status podkop 2>/dev/null | sed -n 's/^Version: v\{0,1\}//p' | head -n 1
    )"
  elif command -v apk >/dev/null 2>&1; then
    podkop_version="$(
      apk list --installed podkop 2>/dev/null | sed -n 's/^podkop-\([^ ]*\) .*/\1/p' | head -n 1
    )"
  fi

  if [ -n "${podkop_version:-}" ]; then
    log "Detected Podkop version: ${podkop_version}"
  else
    log "Podkop is installed, but its package version could not be detected."
  fi
}

install_package_files() {
  case "$PKG_MANAGER" in
    opkg)
      opkg install "$@"
      ;;
    apk)
      apk add --allow-untrusted "$@"
      ;;
    *)
      fail "Unsupported package manager: $PKG_MANAGER"
      ;;
  esac
}

backup_existing_config() {
  command -v uci >/dev/null 2>&1 || return 0
  uci -q show obhodiq >/dev/null 2>&1 || return 0

  {
    printf 'enabled=%s\n' "$(uci -q get obhodiq.main.enabled 2>/dev/null || true)"
    printf 'lang=%s\n' "$(uci -q get obhodiq.main.lang 2>/dev/null || true)"
    printf 'subscription_url=%s\n' "$(uci -q get obhodiq.main.subscription_url 2>/dev/null || true)"
    printf 'update_schedule=%s\n' "$(uci -q get obhodiq.main.update_schedule 2>/dev/null || true)"
    printf 'selection_mode=%s\n' "$(uci -q get obhodiq.main.selection_mode 2>/dev/null || true)"
    printf 'active_server_id=%s\n' "$(uci -q get obhodiq.main.active_server_id 2>/dev/null || true)"
    printf 'active_group=%s\n' "$(uci -q get obhodiq.main.active_group 2>/dev/null || true)"
    printf 'podkop_section_name=%s\n' "$(uci -q get obhodiq.main.podkop_section_name 2>/dev/null || true)"
    printf 'auto_select=%s\n' "$(uci -q get obhodiq.main.auto_select 2>/dev/null || true)"
    printf 'test_url=%s\n' "$(uci -q get obhodiq.main.test_url 2>/dev/null || true)"
    printf 'latency_timeout=%s\n' "$(uci -q get obhodiq.main.latency_timeout 2>/dev/null || true)"
    printf 'latency_attempts=%s\n' "$(uci -q get obhodiq.main.latency_attempts 2>/dev/null || true)"
    printf 'outage_retry_minutes=%s\n' "$(uci -q get obhodiq.main.outage_retry_minutes 2>/dev/null || true)"
    printf 'last_subscription_update=%s\n' "$(uci -q get obhodiq.main.last_subscription_update 2>/dev/null || true)"
  } > "$CONFIG_BACKUP_FILE"
}

backup_existing_state() {
  [ -d /etc/obhodiq ] || return 0

  rm -rf "$STATE_BACKUP_DIR"
  mkdir -p "$STATE_BACKUP_DIR"
  cp -fpR /etc/obhodiq/. "$STATE_BACKUP_DIR"/ 2>/dev/null || true
}

cleanup_config_leftovers() {
  rm -f /etc/config/obhodiq-opkg || true
}

restore_existing_config() {
  command -v uci >/dev/null 2>&1 || return 0
  [ -s "$CONFIG_BACKUP_FILE" ] || return 0

  while IFS='=' read -r key value || [ -n "${key:-}" ]; do
    [ -n "${key:-}" ] || continue
    case "$key" in
      enabled|lang|subscription_url|update_schedule|selection_mode|active_server_id|active_group|podkop_section_name|auto_select|test_url|latency_timeout|latency_attempts|outage_retry_minutes|last_subscription_update)
        [ -n "${value:-}" ] || continue
        uci -q set "obhodiq.main.${key}=${value}" || true
        ;;
    esac
  done < "$CONFIG_BACKUP_FILE"

  uci -q commit obhodiq || true
}

restore_existing_state() {
  [ -d "$STATE_BACKUP_DIR" ] || return 0

  mkdir -p /etc/obhodiq
  cp -fpR "$STATE_BACKUP_DIR"/. /etc/obhodiq/ 2>/dev/null || true
}

fetch_asset() {
  pkg_name="$1"
  case "$PKG_MANAGER" in
    opkg)
      file_name="${pkg_name}_${OBHODIQ_VERSION}_all.${PKG_EXT}"
      ;;
    apk)
      file_name="${pkg_name}-${OBHODIQ_VERSION}.${PKG_EXT}"
      ;;
    *)
      fail "Unsupported package manager: $PKG_MANAGER"
      ;;
  esac
  out="${TMP_DIR}/${file_name}"
  release_url="${RELEASE_BASE_URL}/${file_name}"
  raw_url="https://github.com/${REPO_OWNER}/${REPO_NAME}/raw/main/packages/downloads/${file_name}"

  log "Downloading ${file_name}"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$out" "$release_url" || \
    curl -fsSL -o "$out" "$raw_url" || true
  fi

  if [ ! -s "$out" ] && command -v wget >/dev/null 2>&1; then
    wget -O "$out" "$release_url" >/dev/null 2>&1 || \
    wget --no-check-certificate -O "$out" "$release_url" >/dev/null 2>&1 || \
    wget -O "$out" "$raw_url" >/dev/null 2>&1 || \
    wget --no-check-certificate -O "$out" "$raw_url" >/dev/null 2>&1 || true
  fi

  [ -s "$out" ] || fail "wget or curl could not download ${file_name}."

  printf '%s\n' "$out"
}

ask_ru_package() {
  if [ -n "${OBHODIQ_WITH_RU:-}" ]; then
    case "$OBHODIQ_WITH_RU" in
      1|y|Y|yes|YES|true|TRUE) return 0 ;;
      *) return 1 ;;
    esac
  fi

  if [ ! -t 0 ]; then
    return 1
  fi

  printf 'Use Russian as default language? / Сделать русский языком по умолчанию? [Y/N]: '
  read -r answer || true
  case "${answer:-}" in
    y|Y|yes|YES) return 0 ;;
    *) return 1 ;;
  esac
}

set_obhodiq_lang() {
  lang="$1"

  if command -v uci >/dev/null 2>&1; then
    uci -q set obhodiq.main.lang="$lang" || true
    uci -q commit obhodiq || true
  fi

  /usr/bin/obhodiq set-lang "$lang" >/dev/null 2>&1 || true
}

main() {
  mkdir -p "$TMP_DIR"
  detect_pkg_manager
  resolve_release
  require_podkop
  backup_existing_config
  backup_existing_state

  backend_pkg="$(fetch_asset "$APP_PKG")" || fail "Failed to download ${APP_PKG}.${PKG_EXT}"
  luci_pkg="$(fetch_asset "$LUCI_PKG")" || fail "Failed to download ${LUCI_PKG}.${PKG_EXT}"

  install_package_files "$backend_pkg" "$luci_pkg"
  restore_existing_config
  restore_existing_state
  cleanup_config_leftovers

  if ask_ru_package; then
    set_obhodiq_lang "ru"
  else
    set_obhodiq_lang "en"
  fi

  cleanup_config_leftovers
  /etc/init.d/obhodiq enable >/dev/null 2>&1 || true
  /etc/init.d/obhodiq restart >/dev/null 2>&1 || true

  note "Obhodiq is a subscription parser and Podkop integration layer."
  note "Actual traffic routing and connection handling are performed by Podkop."
  log "${APP_NAME} installed successfully."
}

main "$@"
