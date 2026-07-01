#!/bin/sh

set -eu

APP_NAME="Obhodiq"
APP_PKG="obhodiq"
LUCI_PKG="luci-app-obhodiq"
OBHODIQ_VERSION="${OBHODIQ_VERSION:-0.1.0-r2}"
RELEASE_BASE_URL="${RELEASE_BASE_URL:-https://raw.githubusercontent.com/renqismike/obhodiq/main/dist}"
TMP_DIR="${TMPDIR:-/tmp}/obhodiq-install"

log() {
  printf '%s\n' "$*" >&2
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

cleanup() {
  rm -rf "$TMP_DIR"
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
  url="${RELEASE_BASE_URL}/${file_name}"
  out="${TMP_DIR}/${file_name}"

  log "Downloading ${file_name}"
  if command -v wget >/dev/null 2>&1; then
    wget -O "$out" "$url" >/dev/null 2>&1 || return 1
  elif command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$out" "$url" || return 1
  else
    fail "wget or curl is required."
  fi

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
  require_podkop

  backend_pkg="$(fetch_asset "$APP_PKG")" || fail "Failed to download ${APP_PKG}.${PKG_EXT}"
  luci_pkg="$(fetch_asset "$LUCI_PKG")" || fail "Failed to download ${LUCI_PKG}.${PKG_EXT}"

  install_package_files "$backend_pkg" "$luci_pkg"

  if ask_ru_package; then
    set_obhodiq_lang "ru"
  else
    set_obhodiq_lang "en"
  fi

  /etc/init.d/obhodiq enable >/dev/null 2>&1 || true
  /etc/init.d/obhodiq restart >/dev/null 2>&1 || true

  log "${APP_NAME} installed successfully."
}

main "$@"
