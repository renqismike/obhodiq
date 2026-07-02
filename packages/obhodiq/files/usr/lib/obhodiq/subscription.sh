#!/bin/sh

urldecode_text() {
  value="$1"
  value="$(printf '%s' "$value" | sed 's/+/ /g; s/%/\\x/g')"
  printf '%b' "$value"
}

decode_meta_value() {
  value="$1"
  case "$value" in
    base64:*)
      decoded_value="$(printf '%s' "${value#base64:}" | base64 -d 2>/dev/null || true)"
      [ -n "${decoded_value:-}" ] && value="$decoded_value"
      ;;
  esac
  printf '%s\n' "$value"
}

get_url_param() {
  url="$1"
  key="$2"
  query="${url#*\?}"
  [ "$query" != "$url" ] || {
    printf '\n'
    return 0
  }

  printf '%s' "$query" | tr '&' '\n' | sed -n "s/^${key}=//p" | head -n 1
}

get_server_transport() {
  url="$1"
  case "${url%%://*}" in
    hy2|hysteria|hysteria2)
      printf '%s\n' "hysteria"
      return 0
      ;;
  esac
  transport="$(get_url_param "$url" type)"
  [ -n "${transport:-}" ] || transport="tcp"
  printf '%s\n' "$transport"
}

get_server_security() {
  url="$1"
  case "${url%%://*}" in
    hy2|hysteria|hysteria2)
      printf '%s\n' "tls"
      return 0
      ;;
  esac
  security="$(get_url_param "$url" security)"
  [ -n "${security:-}" ] || security="plain"
  printf '%s\n' "$security"
}

extract_body_meta_line() {
  key_regex="$1"
  [ -f "$RAW_FILE" ] || return 0
  sed -n "s/^#${key_regex}:[[:space:]]*//p" "$RAW_FILE" | head -n 1 | tr -d '\r'
}

extract_header_meta_line() {
  key_regex="$1"
  [ -f "$HEADER_FILE" ] || return 0
  sed -n "s/^${key_regex}:[[:space:]]*//p" "$HEADER_FILE" | tail -n 1 | tr -d '\r'
}

build_type_label() {
  scheme="$1"
  transport="$2"
  security="$3"

  case "$scheme" in
    vless) scheme_label="VLESS" ;;
    vmess) scheme_label="VMESS" ;;
    trojan) scheme_label="TROJAN" ;;
    ss) scheme_label="SHADOWSOCKS" ;;
    hy2|hysteria|hysteria2) scheme_label="HYSTERIA" ;;
    *) scheme_label="$(printf '%s' "$scheme" | awk '{print toupper($0)}')" ;;
  esac

  case "$transport" in
    tcp) transport_label="TCP" ;;
    grpc) transport_label="GRPC" ;;
    ws) transport_label="WS" ;;
    httpupgrade) transport_label="HTTPUPGRADE" ;;
    hysteria) transport_label="HYSTERIA" ;;
    *) transport_label="$(printf '%s' "$transport" | awk '{print toupper($0)}')" ;;
  esac

  case "$security" in
    reality) security_label="REALITY" ;;
    tls) security_label="TLS" ;;
    none|plain) security_label="PLAIN" ;;
    *) security_label="$(printf '%s' "$security" | awk '{print toupper($0)}')" ;;
  esac

  printf '%s / %s / %s / JSON\n' \
    "$scheme_label" \
    "$transport_label" \
    "$security_label"
}

is_helper_subscription_entry() {
  url="$1"
  name="$2"
  scheme="${url%%://*}"
  lowered_name="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]')"

  case "$scheme" in
    happ)
      return 0
      ;;
  esac

  case "$lowered_name" in
    *"превышен лимит устройств"*|*"разрешено только"*|*"поддержка:"*|*"доступ к telegram"*|*"доступ к telegr"*|*"device limit"*|*"support:"*|*"конфиг не найден"*|*"продлить"*|*"extend subscription"*|*"renew subscription"*)
      return 0
      ;;
  esac

  case "$name" in
    *"Конфиг не найден"*|*"Продлить"*|*"Доступ к TELEGRAM"*)
      return 0
      ;;
  esac

  return 1
}

is_auto_profile_name() {
  name="$1"
  case "$name" in
    *"Автоматический выбор"*|*"автоматический выбор"*|*"Automatic selection"*|*"automatic selection"*|*"Automatic choice"*|*"automatic choice"*|*"Самый быстрый"*|*"самый быстрый"*|*"Fastest"*|*"fastest"*|*"URLTest"*|*"urltest"*|*"Авто |"*|*"Авто|"*|*"авто |"*|*"авто|"*|*"Auto |"*|*"Auto|"*|*"auto |"*|*"auto|"*)
      return 0
      ;;
  esac

  return 1
}

collect_subscription_notices() {
  tmp_notices="$(mktemp)"
  announce_value="$(extract_header_meta_line '[Aa]nnounce')"
  [ -n "${announce_value:-}" ] || announce_value="$(extract_body_meta_line '[Aa]nnounce')"
  announce_value="$(decode_meta_value "$announce_value" | tr -d '\r')"
  if [ -n "${announce_value:-}" ]; then
    printf '%s\n' "$announce_value" >> "$tmp_notices"
  fi

  [ -f "$RAW_FILE" ] || {
    jq -Rn '[]'
    rm -f "$tmp_notices"
    return 0
  }

  while IFS= read -r line; do
    line="$(printf '%s' "$line" | sed 's/\r$//;s/^[[:space:]]*//;s/[[:space:]]*$//')"
    [ -n "$line" ] || continue
    case "$line" in
      \#*|//* ) continue ;;
    esac
    case "$line" in
      *://*)
        url="${line%%#*}"
        notice_name=""
        if [ "$url" != "$line" ]; then
          notice_name="${line#*#}"
          notice_name="$(printf '%s' "$notice_name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
          notice_name="$(urldecode_text "$notice_name")"
        fi
        if is_helper_subscription_entry "$url" "$notice_name" && [ -n "${notice_name:-}" ]; then
          printf '%s\n' "$notice_name" >> "$tmp_notices"
        fi
        ;;
    esac
  done < "$RAW_FILE"

  awk '
    {
      gsub(/\r/, "", $0)
      sub(/^[[:space:]]+/, "", $0)
      sub(/[[:space:]]+$/, "", $0)
      if (length($0) > 0 && !seen[$0]++) print $0
    }
  ' "$tmp_notices" | jq -Rn '[inputs | select(length > 0)]'
  rm -f "$tmp_notices"
}

extract_placeholder_notice() {
  file_path="$1"
  [ -f "$file_path" ] || return 0
  placeholder_line="$(
    sed -n '/^vless:\/\/00000000-0000-0000-0000-000000000000@0\.0\.0\.0:1/p' "$file_path" | head -n 1 | tr -d '\r'
  )"
  [ -n "${placeholder_line:-}" ] || return 0
  fragment="${placeholder_line##*#}"
  [ -n "${fragment:-}" ] || return 0
  urldecode_text "$fragment" | tr -d '\r'
}

extract_links_from_json_config() {
  json_file="$1"
  tmp_items="$(mktemp)"
  jq -c '
    def root_items:
      if type == "array" then .[] else . end;
    def supported_outbound:
      (
        .protocol == "vless"
        or .protocol == "vmess"
        or .protocol == "trojan"
        or .protocol == "shadowsocks"
        or .protocol == "socks"
        or .protocol == "hysteria"
        or .protocol == "hysteria2"
      );
    def helper_tag:
      ((.tag // "") as $tag
      | ($tag | startswith("fallback-"))
        or ($tag | startswith("WL-"))
        or ($tag | startswith("LOOP-"))
        or ($tag == "direct")
        or ($tag == "block")
        or ($tag == "block-http")
        or ($tag == "api"));

    root_items
    | select((.remarks // "") != "")
    | . as $cfg
    | .outbounds[]?
    | select(supported_outbound and (helper_tag | not))
    | select(. != null)
    | {
        name: ($cfg.remarks // ""),
        protocol,
        tag,
        settings,
        streamSettings
      }
  ' "$json_file" > "$tmp_items" 2>/dev/null || {
    rm -f "$tmp_items"
    return 0
  }

  while IFS= read -r item; do
    [ -n "${item:-}" ] || continue
    name="$(printf '%s' "$item" | jq -r '.name // empty' 2>/dev/null)"
        protocol="$(printf '%s' "$item" | jq -r '.protocol // empty' 2>/dev/null)"
        tag="$(printf '%s' "$item" | jq -r '.tag // empty' 2>/dev/null)"
        [ -n "${name:-}" ] || continue
    if is_auto_profile_name "$name"; then
      continue
    fi

    case "$protocol" in
      vless)
        address="$(printf '%s' "$item" | jq -r '.settings.vnext[0].address // empty' 2>/dev/null)"
        port="$(printf '%s' "$item" | jq -r '.settings.vnext[0].port // empty' 2>/dev/null)"
        user_id="$(printf '%s' "$item" | jq -r '.settings.vnext[0].users[0].id // empty' 2>/dev/null)"
        encryption="$(printf '%s' "$item" | jq -r '.settings.vnext[0].users[0].encryption // "none"' 2>/dev/null)"
        flow="$(printf '%s' "$item" | jq -r '.settings.vnext[0].users[0].flow // empty' 2>/dev/null)"
        security="$(printf '%s' "$item" | jq -r '.streamSettings.security // "none"' 2>/dev/null)"
        network="$(printf '%s' "$item" | jq -r '.streamSettings.network // "tcp"' 2>/dev/null)"
        sni="$(printf '%s' "$item" | jq -r '.streamSettings.realitySettings.serverName // .streamSettings.tlsSettings.serverName // empty' 2>/dev/null)"
        fp="$(printf '%s' "$item" | jq -r '.streamSettings.realitySettings.fingerprint // empty' 2>/dev/null)"
        pbk="$(printf '%s' "$item" | jq -r '.streamSettings.realitySettings.publicKey // empty' 2>/dev/null)"
        sid="$(printf '%s' "$item" | jq -r '.streamSettings.realitySettings.shortId // empty' 2>/dev/null)"
        header_type="$(printf '%s' "$item" | jq -r '.streamSettings.tcpSettings.header.type // empty' 2>/dev/null)"
        path="$(printf '%s' "$item" | jq -r '.streamSettings.wsSettings.path // .streamSettings.httpupgradeSettings.path // empty' 2>/dev/null)"
        host="$(printf '%s' "$item" | jq -r '.streamSettings.wsSettings.headers.Host // .streamSettings.httpupgradeSettings.host // empty' 2>/dev/null)"
        service_name="$(printf '%s' "$item" | jq -r '.streamSettings.grpcSettings.serviceName // empty' 2>/dev/null)"
        [ -n "${address:-}" ] || continue
        [ "$address" = "0.0.0.0" ] && continue
        link="vless://${user_id}@${address}:${port}?encryption=${encryption}&security=${security}&type=${network}"
        [ -n "${flow:-}" ] && link="${link}&flow=${flow}"
        [ -n "${sni:-}" ] && link="${link}&sni=${sni}"
        [ -n "${fp:-}" ] && link="${link}&fp=${fp}"
        [ -n "${pbk:-}" ] && link="${link}&pbk=${pbk}"
        [ -n "${sid:-}" ] && link="${link}&sid=${sid}"
        [ -n "${header_type:-}" ] && [ "$header_type" != "none" ] && link="${link}&headerType=${header_type}"
        [ -n "${path:-}" ] && link="${link}&path=${path}"
        [ -n "${host:-}" ] && link="${link}&host=${host}"
        [ -n "${service_name:-}" ] && link="${link}&serviceName=${service_name}"
        printf '%s#%s\n' "$link" "$name"
        ;;
      vmess)
        address="$(printf '%s' "$item" | jq -r '.settings.vnext[0].address // empty' 2>/dev/null)"
        port="$(printf '%s' "$item" | jq -r '.settings.vnext[0].port // empty' 2>/dev/null)"
        user_id="$(printf '%s' "$item" | jq -r '.settings.vnext[0].users[0].id // empty' 2>/dev/null)"
        alter_id="$(printf '%s' "$item" | jq -r '.settings.vnext[0].users[0].alterId // 0' 2>/dev/null)"
        security="$(printf '%s' "$item" | jq -r '.settings.vnext[0].users[0].security // "auto"' 2>/dev/null)"
        network="$(printf '%s' "$item" | jq -r '.streamSettings.network // "tcp"' 2>/dev/null)"
        tls="$(printf '%s' "$item" | jq -r '.streamSettings.security // empty' 2>/dev/null)"
        host="$(printf '%s' "$item" | jq -r '.streamSettings.wsSettings.headers.Host // .streamSettings.httpupgradeSettings.host // empty' 2>/dev/null)"
        path="$(printf '%s' "$item" | jq -r '.streamSettings.wsSettings.path // .streamSettings.httpupgradeSettings.path // empty' 2>/dev/null)"
        service_name="$(printf '%s' "$item" | jq -r '.streamSettings.grpcSettings.serviceName // empty' 2>/dev/null)"
        sni="$(printf '%s' "$item" | jq -r '.streamSettings.tlsSettings.serverName // empty' 2>/dev/null)"
        [ -n "${address:-}" ] || continue
        [ -n "${user_id:-}" ] || continue
        vmess_json="$(jq -nc \
          --arg v "2" \
          --arg ps "$name" \
          --arg add "$address" \
          --arg port "$port" \
          --arg id "$user_id" \
          --arg aid "$alter_id" \
          --arg scy "$security" \
          --arg net "$network" \
          --arg type "none" \
          --arg host "$host" \
          --arg path "$path" \
          --arg tls "$tls" \
          --arg sni "$sni" \
          --arg alpn "" \
          --arg fp "" \
          --arg serviceName "$service_name" \
          '{
            v:$v, ps:$ps, add:$add, port:$port, id:$id, aid:$aid, scy:$scy,
            net:$net, type:$type, host:$host, path:$path, tls:$tls, sni:$sni,
            alpn:$alpn, fp:$fp, serviceName:$serviceName
          }')"
        vmess_b64="$(printf '%s' "$vmess_json" | base64 | tr -d '\r\n')"
        [ -n "${vmess_b64:-}" ] || continue
        printf 'vmess://%s#%s\n' "$vmess_b64" "$name"
        ;;
      trojan)
        address="$(printf '%s' "$item" | jq -r '.settings.servers[0].address // empty' 2>/dev/null)"
        port="$(printf '%s' "$item" | jq -r '.settings.servers[0].port // empty' 2>/dev/null)"
        password="$(printf '%s' "$item" | jq -r '.settings.servers[0].password // empty' 2>/dev/null)"
        network="$(printf '%s' "$item" | jq -r '.streamSettings.network // "tcp"' 2>/dev/null)"
        security="$(printf '%s' "$item" | jq -r '.streamSettings.security // "tls"' 2>/dev/null)"
        sni="$(printf '%s' "$item" | jq -r '.streamSettings.tlsSettings.serverName // empty' 2>/dev/null)"
        host="$(printf '%s' "$item" | jq -r '.streamSettings.wsSettings.headers.Host // .streamSettings.httpupgradeSettings.host // empty' 2>/dev/null)"
        path="$(printf '%s' "$item" | jq -r '.streamSettings.wsSettings.path // .streamSettings.httpupgradeSettings.path // empty' 2>/dev/null)"
        service_name="$(printf '%s' "$item" | jq -r '.streamSettings.grpcSettings.serviceName // empty' 2>/dev/null)"
        [ -n "${address:-}" ] || continue
        [ -n "${password:-}" ] || continue
        link="trojan://${password}@${address}:${port}?security=${security}&type=${network}"
        [ -n "${sni:-}" ] && link="${link}&sni=${sni}"
        [ -n "${host:-}" ] && link="${link}&host=${host}"
        [ -n "${path:-}" ] && link="${link}&path=${path}"
        [ -n "${service_name:-}" ] && link="${link}&serviceName=${service_name}"
        printf '%s#%s\n' "$link" "$name"
        ;;
      shadowsocks)
        address="$(printf '%s' "$item" | jq -r '.settings.servers[0].address // empty' 2>/dev/null)"
        port="$(printf '%s' "$item" | jq -r '.settings.servers[0].port // empty' 2>/dev/null)"
        method="$(printf '%s' "$item" | jq -r '.settings.servers[0].method // empty' 2>/dev/null)"
        password="$(printf '%s' "$item" | jq -r '.settings.servers[0].password // empty' 2>/dev/null)"
        plugin="$(printf '%s' "$item" | jq -r '.settings.servers[0].plugin // empty' 2>/dev/null)"
        plugin_opts="$(printf '%s' "$item" | jq -r '.settings.servers[0].pluginOpts // empty' 2>/dev/null)"
        [ -n "${address:-}" ] || continue
        [ -n "${method:-}" ] || continue
        ss_cred="$(printf '%s:%s' "$method" "$password" | base64 | tr -d '\r\n')"
        link="ss://${ss_cred}@${address}:${port}"
        if [ -n "${plugin:-}" ]; then
          link="${link}?plugin=${plugin}"
          [ -n "${plugin_opts:-}" ] && link="${link};${plugin_opts}"
        fi
        printf '%s#%s\n' "$link" "$name"
        ;;
      socks)
        address="$(printf '%s' "$item" | jq -r '.settings.servers[0].address // empty' 2>/dev/null)"
        port="$(printf '%s' "$item" | jq -r '.settings.servers[0].port // empty' 2>/dev/null)"
        version="$(printf '%s' "$item" | jq -r '.settings.version // "5"' 2>/dev/null)"
        username="$(printf '%s' "$item" | jq -r '.settings.servers[0].users[0].user // empty' 2>/dev/null)"
        password="$(printf '%s' "$item" | jq -r '.settings.servers[0].users[0].pass // empty' 2>/dev/null)"
        [ -n "${address:-}" ] || continue
        scheme_name="socks5"
        [ "$version" = "4" ] && scheme_name="socks4"
        if [ -n "${username:-}" ]; then
          link="${scheme_name}://${username}:${password}@${address}:${port}"
        else
          link="${scheme_name}://${address}:${port}"
        fi
        printf '%s#%s\n' "$link" "$name"
        ;;
      hysteria|hysteria2)
        address="$(printf '%s' "$item" | jq -r '.settings.address // empty' 2>/dev/null)"
        port="$(printf '%s' "$item" | jq -r '.settings.port // empty' 2>/dev/null)"
        auth="$(printf '%s' "$item" | jq -r '.streamSettings.hysteriaSettings.auth // .settings.auth // empty' 2>/dev/null)"
        sni="$(printf '%s' "$item" | jq -r '.streamSettings.tlsSettings.serverName // .settings.address // empty' 2>/dev/null)"
        obfs="$(printf '%s' "$item" | jq -r '.streamSettings.finalmask.udp[0].type // empty' 2>/dev/null)"
        obfs_password="$(printf '%s' "$item" | jq -r '.streamSettings.finalmask.udp[0].settings.password // empty' 2>/dev/null)"
        [ -n "${address:-}" ] || continue
        link="hy2://${auth}@${address}:${port}?sni=${sni}&insecure=0"
        [ -n "${obfs:-}" ] && link="${link}&obfs=${obfs}"
        [ -n "${obfs_password:-}" ] && link="${link}&obfs-password=${obfs_password}"
        printf '%s#%s\n' "$link" "$name"
        ;;
    esac
  done < "$tmp_items"

  rm -f "$tmp_items"
}

get_subscription_url() {
  printf '%s\n' "$(config_get main subscription_url '')"
}

set_subscription_error() {
  require_jq || return 1
  init_storage_files
  message="${1:-Unknown subscription error}"
  updated_at="$(date +%s 2>/dev/null || printf '0')"
  jq -n \
    --arg message "$message" \
    --argjson updated_at "$updated_at" \
    '{message:$message, updated_at:$updated_at}' > "$ERROR_FILE"
}

clear_subscription_error() {
  require_jq || return 1
  init_storage_files
  printf '%s\n' '{}' > "$ERROR_FILE"
}

reset_subscription_cache() {
  init_storage_files
  printf '%s\n' '{"updated_at":null,"count":0,"servers":[]}' > "$PARSED_FILE"
  printf '%s\n' '{}' > "$META_FILE"
  printf '%s\n' '{}' > "$EXPORT_FILE"
  printf '%s\n' '{}' > "$PODKOP_FILE"
  printf '%s\n' '{}' > "$PODKOP_APPLY_RESULT_FILE"
}

get_update_schedule() {
  printf '%s\n' "$(config_get main update_schedule 'never')"
}

normalize_update_schedule() {
  schedule="${1:-never}"
  case "$schedule" in
    never|30m|1h|3h|6h|12h|24h)
      printf '%s\n' "$schedule"
      ;;
    *)
      printf '%s\n' "never"
      ;;
  esac
}

update_schedule_to_cron() {
  schedule="$(normalize_update_schedule "${1:-never}")"
  case "$schedule" in
    30m) printf '%s\n' '*/30 * * * *' ;;
    1h) printf '%s\n' '0 * * * *' ;;
    3h) printf '%s\n' '0 */3 * * *' ;;
    6h) printf '%s\n' '0 */6 * * *' ;;
    12h) printf '%s\n' '0 */12 * * *' ;;
    24h) printf '%s\n' '0 3 * * *' ;;
    never) printf '\n' ;;
  esac
}

sync_update_schedule() {
  schedule="$(get_update_schedule)"
  cron_expr="$(update_schedule_to_cron "$schedule")"
  crontab_file="/etc/crontabs/root"
  tmp_file="$(mktemp)"
  marker_begin="# BEGIN PODKOP-SUB-MANAGER"
  marker_end="# END PODKOP-SUB-MANAGER"

  [ -f "$crontab_file" ] || : > "$crontab_file"

  awk -v begin="$marker_begin" -v end="$marker_end" '
    $0 == begin { skip = 1; next }
    $0 == end { skip = 0; next }
    skip != 1 { print }
  ' "$crontab_file" > "$tmp_file"

  if [ -n "${cron_expr:-}" ]; then
    {
      printf '%s\n' "$marker_begin"
      printf '%s /usr/bin/obhodiq refresh-apply >/tmp/obhodiq-auto-update.log 2>&1\n' "$cron_expr"
      printf '%s\n' "$marker_end"
    } >> "$tmp_file"
  fi

  mv "$tmp_file" "$crontab_file"
  /etc/init.d/cron restart >/dev/null 2>&1 || /etc/init.d/cron reload >/dev/null 2>&1 || true
}

set_subscription_url() {
  url="$1"
  url="$(printf '%s' "$url" | tr -d '\r\n')"
  [ -n "${url:-}" ] || {
    log_msg "subscription url is empty"
    return 1
  }

  config_set main subscription_url "$url"
  log_msg "subscription url saved"
}

set_update_schedule() {
  schedule="$(normalize_update_schedule "${1:-never}")"
  config_set main update_schedule "$schedule"
  sync_update_schedule
  log_msg "update schedule saved: $schedule"
}

fetch_subscription() {
  init_storage_files
  url="$(config_get main subscription_url '')"
  [ -n "${url:-}" ] || {
    log_msg "subscription url is empty"
    set_subscription_error "Ошибка подписки: не задана ссылка"
    reset_subscription_cache
    : > "$RAW_FILE"
    : > "$HEADER_FILE"
    return 1
  }

  tmp_body="$(mktemp)"
  tmp_headers="$(mktemp)"
  device_id="$(get_client_device_id)"
  if ! curl -fsSL \
    -A 'Happ/1.0' \
    -H 'Accept: */*' \
    -H 'User-Agent: Happ/1.0' \
    -H "X-Hwid: ${device_id}" \
    -H "X-Device-Id: ${device_id}" \
    -H "Device-Id: ${device_id}" \
    -H "Hwid: ${device_id}" \
    -D "$tmp_headers" \
    "$url" \
    -o "$tmp_body"; then
    rm -f "$tmp_body" "$tmp_headers"
    log_msg "failed to fetch subscription"
    set_subscription_error "Ошибка подписки: не удалось загрузить ссылку"
    reset_subscription_cache
    : > "$RAW_FILE"
    : > "$HEADER_FILE"
    return 1
  fi

  mv "$tmp_body" "$RAW_FILE"
  mv "$tmp_headers" "$HEADER_FILE"
  clear_subscription_error
  log_msg "subscription fetched"
}

parse_subscription_meta() {
  require_jq || return 1
  init_storage_files
  updated_at="$(date +%s 2>/dev/null || printf '0')"

  [ -f "$HEADER_FILE" ] || {
    printf '%s\n' '{}' > "$META_FILE"
    return 0
  }

  userinfo_line="$(
    sed -n 's/^[Ss]ubscription-[Uu]serinfo:[[:space:]]*//p' "$HEADER_FILE" | tail -n 1 | tr -d '\r'
  )"
  profile_title="$(
    {
      sed -n 's/^[Pp]rofile-[Tt]itle:[[:space:]]*//p' "$HEADER_FILE"
      sed -n 's/^[Pp]rofile-[Ww]eb-[Pp]age-[Nn]ame:[[:space:]]*//p' "$HEADER_FILE"
    } | tail -n 1 | tr -d '\r'
  )"
  profile_url="$(
    sed -n 's/^[Pp]rofile-[Ww]eb-[Pp]age-[Uu]rl:[[:space:]]*//p' "$HEADER_FILE" | tail -n 1 | tr -d '\r'
  )"
  support_url="$(
    sed -n 's/^[Ss]upport-[Uu]rl:[[:space:]]*//p' "$HEADER_FILE" | tail -n 1 | tr -d '\r'
  )"
  update_interval="$(
    sed -n 's/^[Pp]rofile-[Uu]pdate-[Ii]nterval:[[:space:]]*//p' "$HEADER_FILE" | tail -n 1 | tr -d '\r'
  )"

  [ -n "${userinfo_line:-}" ] || userinfo_line="$(extract_body_meta_line '[Ss]ubscription-[Uu]serinfo')"
  [ -n "${profile_title:-}" ] || profile_title="$(extract_body_meta_line '[Pp]rofile-[Tt]itle')"
  [ -n "${profile_title:-}" ] || profile_title="$(extract_body_meta_line '[Pp]rofile-[Ww]eb-[Pp]age-[Nn]ame')"
  [ -n "${profile_url:-}" ] || profile_url="$(extract_body_meta_line '[Pp]rofile-[Ww]eb-[Pp]age-[Uu][Rr][Ll]')"
  [ -n "${support_url:-}" ] || support_url="$(extract_body_meta_line '[Ss]upport-[Uu][Rr][Ll]')"
  [ -n "${update_interval:-}" ] || update_interval="$(extract_body_meta_line '[Pp]rofile-[Uu]pdate-[Ii]nterval')"

  profile_title="$(decode_meta_value "$profile_title" | tr -d '\r')"
  announce="$(extract_header_meta_line '[Aa]nnounce')"
  [ -n "${announce:-}" ] || announce="$(extract_body_meta_line '[Aa]nnounce')"
  announce="$(decode_meta_value "$announce" | tr -d '\r')"
  notices_json="$(collect_subscription_notices)"
  if ! printf '%s' "${notices_json:-}" | jq -e . >/dev/null 2>&1; then
    notices_json='[]'
  fi

  upload="$(printf '%s' "$userinfo_line" | sed -n 's/.*upload=\([0-9][0-9]*\).*/\1/p')"
  download="$(printf '%s' "$userinfo_line" | sed -n 's/.*download=\([0-9][0-9]*\).*/\1/p')"
  total="$(printf '%s' "$userinfo_line" | sed -n 's/.*total=\([0-9][0-9]*\).*/\1/p')"
  expire="$(printf '%s' "$userinfo_line" | sed -n 's/.*expire=\([0-9][0-9]*\).*/\1/p')"

  [ -n "${upload:-}" ] || upload=0
  [ -n "${download:-}" ] || download=0
  [ -n "${total:-}" ] || total=0
  [ -n "${expire:-}" ] || expire=0

  jq -n \
    --argjson updated_at "$updated_at" \
    --arg raw_userinfo "$userinfo_line" \
    --arg profile_title "$profile_title" \
    --arg profile_url "$profile_url" \
    --arg support_url "$support_url" \
    --arg announce "$announce" \
    --argjson notices "$notices_json" \
    --arg update_interval "$update_interval" \
    --argjson upload "$upload" \
    --argjson download "$download" \
    --argjson total "$total" \
    --argjson expire "$expire" \
    '{
      updated_at: $updated_at,
      raw_userinfo: $raw_userinfo,
      profile_title: $profile_title,
      profile_url: $profile_url,
      support_url: $support_url,
      announce: $announce,
      notices: $notices,
      update_interval: $update_interval,
      upload: $upload,
      download: $download,
      total: $total,
      expire: $expire,
      used: ($upload + $download),
      remaining: (if $total > ($upload + $download) then ($total - ($upload + $download)) else 0 end)
    }' > "$META_FILE"
}

parse_subscription() {
  require_jq || return 1
  init_storage_files
  [ -f "$RAW_FILE" ] || {
    log_msg "raw subscription not found"
    set_subscription_error "Ошибка подписки: данные подписки не загружены"
    reset_subscription_cache
    return 1
  }

  prev_file="$(mktemp)"
  [ -f "$PARSED_FILE" ] && cp "$PARSED_FILE" "$prev_file"
  reset_subscription_cache
  set_subscription_error "Ошибка подписки: не удалось разобрать формат или не найдено поддерживаемых серверов"
  parse_input_file="$RAW_FILE"
  decoded_file=''
  json_file=''
  json_links_file=''
  count=0

  compact="$(tr -d '\r\n' < "$RAW_FILE")"
  if [ "${#compact}" -gt 32 ] && printf '%s' "$compact" | grep -Eq '^[A-Za-z0-9+/=]+$' && ! grep -q '://' "$RAW_FILE"; then
    decoded="$(printf '%s' "$compact" | base64 -d 2>/dev/null || true)"
    if [ -n "$decoded" ]; then
      decoded_file="$(mktemp)"
      printf '%s' "$decoded" > "$decoded_file"
      parse_input_file="$decoded_file"
    fi
  fi

  json_file="$(mktemp)"
  cp "$parse_input_file" "$json_file"
  if jq -e 'type == "array" or type == "object"' "$json_file" >/dev/null 2>&1; then
    json_links_file="$(mktemp)"
    extract_links_from_json_config "$json_file" > "$json_links_file"
    if [ -s "$json_links_file" ]; then
      parse_input_file="$json_links_file"
    fi
  fi

  tmp_list="$(mktemp)"
  while IFS= read -r line; do
    line="$(printf '%s' "$line" | sed 's/\r$//;s/^[[:space:]]*//;s/[[:space:]]*$//')"
    [ -n "$line" ] || continue
    case "$line" in
      \#*|//* ) continue ;;
    esac
    case "$line" in
      *://*)
        proxy_link="$line"
        url="${line%%#*}"
        name=""
        if [ "$url" != "$line" ]; then
          name="${line#*#}"
          name="$(printf '%s' "$name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
          name="$(urldecode_text "$name")"
        fi
        if is_auto_profile_name "$name"; then
          continue
        fi
        if is_helper_subscription_entry "$url" "$name"; then
          continue
        fi
        scheme="${url%%://*}"
        transport="$(get_server_transport "$url")"
        security="$(get_server_security "$url")"
        type_label="$(build_type_label "$scheme" "$transport" "$security")"
        unsupported_flag="false"
        unsupported_reason=""
        if [ "$transport" = "xhttp" ]; then
          unsupported_flag="true"
          unsupported_reason="Podkop не поддерживает XHTTP"
        elif [ "$scheme" = "happ" ]; then
          unsupported_flag="true"
          unsupported_reason="Podkop не поддерживает HAPP"
        elif [ "$scheme" != "vless" ] && [ "$scheme" != "vmess" ] && [ "$scheme" != "trojan" ] && [ "$scheme" != "ss" ] && [ "$scheme" != "hy2" ] && [ "$scheme" != "hysteria" ] && [ "$scheme" != "hysteria2" ] && [ "$scheme" != "socks" ] && [ "$scheme" != "socks4" ] && [ "$scheme" != "socks5" ]; then
          unsupported_flag="true"
          unsupported_reason="Podkop не поддерживает этот тип ссылки"
        fi
        [ -n "$name" ] || name="${scheme}"
        count=$((count + 1))
        [ -n "$name" ] || name="${scheme}-${count}"
        group_name="$(jq -r --arg url "$url" '
          first(.servers[]? | select(.url == $url) | .group) // "default"
        ' "$prev_file" 2>/dev/null || printf 'default')"
        excluded_flag="$(jq -r --arg url "$url" '
          first(.servers[]? | select(.url == $url) | .excluded) // false
        ' "$prev_file" 2>/dev/null || printf 'false')"
        case "$excluded_flag" in
          true|false) ;;
          *) excluded_flag="false" ;;
        esac
        [ "$unsupported_flag" = "true" ] && excluded_flag="true"
        jq -n \
          --arg id "srv-$count" \
          --arg tag "main-$count-out" \
          --arg name "$name" \
          --arg scheme "$scheme" \
          --arg transport "$transport" \
          --arg security "$security" \
          --arg type_label "$type_label" \
          --arg link "$proxy_link" \
          --arg url "$url" \
          --arg group "$group_name" \
          --arg unsupported_reason "$unsupported_reason" \
          --argjson unsupported "$unsupported_flag" \
          --argjson excluded "$excluded_flag" \
          '{
            id:$id,
            tag:$tag,
            name:$name,
            scheme:$scheme,
            transport:$transport,
            security:$security,
            type_label:$type_label,
            link:$link,
            url:$url,
            group:$group,
            helper:false,
            unsupported:$unsupported,
            unsupported_reason:$unsupported_reason,
            excluded:$excluded
          }' >> "$tmp_list"
        ;;
    esac
  done < "$parse_input_file"

  if [ "${count:-0}" -le 0 ] 2>/dev/null; then
    rm -f "$tmp_list"
    rm -f "$prev_file"
    rm -f "$decoded_file" "$json_file" "$json_links_file"
    parse_subscription_meta
    notice_message="$(jq -r '(.notices[0] // .announce // "")' "$META_FILE" 2>/dev/null || true)"
    if [ -z "${notice_message:-}" ]; then
      notice_message="$(extract_placeholder_notice "$parse_input_file" || true)"
    fi
    if [ -n "${notice_message:-}" ]; then
      set_subscription_error "Ошибка подписки: $notice_message"
    else
      set_subscription_error "Ошибка подписки: не найдено поддерживаемых серверов"
    fi
    log_msg "no supported servers found in subscription"
    return 1
  fi

  tmp_dedup="$(mktemp)"
  jq -s '
    def transport_rank:
      if .transport == "tcp" then 50
      elif .transport == "grpc" then 40
      elif .transport == "hysteria" then 35
      elif .transport == "ws" then 20
      elif .transport == "httpupgrade" then 10
      elif .transport == "xhttp" then 0
      else 5 end;
    def security_rank:
      if .security == "reality" then 6
      elif .security == "tls" then 4
      elif .security == "none" or .security == "plain" then 0
      else 1 end;
    def unsupported_rank:
      if .unsupported == true then -1000 else 0 end;
    def server_score:
      unsupported_rank + transport_rank + security_rank;

    unique_by(.url)
    | to_entries
    | map(.value + {
        __index: .key,
        __score: (.value | server_score)
      })
    | group_by(.name)
    | map(sort_by([.__score, -.__index]) | last)
    | sort_by(.__index)
    | to_entries
    | map(
        .value + {
          id: ("srv-" + ((.key + 1) | tostring)),
          tag: ("main-" + ((.key + 1) | tostring) + "-out")
        }
      )
    | map(del(.__index, .__score))
    | .[]
  ' "$tmp_list" > "$tmp_dedup"
  mv "$tmp_dedup" "$tmp_list"
  count="$(jq -s 'length' "$tmp_list" 2>/dev/null || printf '0')"

  updated_at="$(date +%s 2>/dev/null || printf '0')"
  jq -s --argjson updated_at "$updated_at" --argjson count "$count" '{updated_at:$updated_at,count:$count,servers:.}' "$tmp_list" > "$PARSED_FILE"
  rm -f "$tmp_list"
  rm -f "$prev_file"
  rm -f "$decoded_file" "$json_file" "$json_links_file"
  parse_subscription_meta
  clear_subscription_error
  log_msg "subscription parsed"
}

export_active_server() {
  require_jq || return 1
  init_storage_files

  active_id="$(config_get main active_server_id '')"
  if [ -z "${active_id:-}" ]; then
    active_id="$(jq -r '.servers[0].id // empty' "$PARSED_FILE")"
  fi

  selected_json="$(jq -c --arg id "$active_id" '.servers[] | select(.id == $id)' "$PARSED_FILE")"
  [ -n "${selected_json:-}" ] || return 1

  jq -n \
    --arg active_id "$active_id" \
    --arg generated_at "$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || printf '')" \
    --argjson server "$selected_json" \
    --slurpfile meta "$META_FILE" \
    '{
      active_server_id: $active_id,
      generated_at: $generated_at,
      server: $server,
      meta: ($meta[0] // {})
    }' > "$EXPORT_FILE"

  cat "$EXPORT_FILE"
}

sync_podkop_export() {
  require_jq || return 1
  init_storage_files

  active_json="$(export_active_server)"
  [ -n "${active_json:-}" ] || return 1

  enabled_json="$(
    jq -c '
      [
        .servers[]
        | select(.excluded != true and (.transport // "") != "xhttp")
        | {
            id,
            original_tag: .tag,
            name,
            type_label,
            link,
            url
          }
      ]
      | to_entries
      | map(
          .value + {
            tag: ("main-" + ((.key + 1) | tostring) + "-out"),
            runtime_tag: ("main-" + ((.key + 1) | tostring) + "-out")
          }
        )
    ' "$PARSED_FILE"
  )"
  if ! printf '%s' "${enabled_json:-}" | jq -e . >/dev/null 2>&1; then
    enabled_json='[]'
  fi
  if ! printf '%s' "${active_json:-}" | jq -e . >/dev/null 2>&1; then
    active_json='{}'
  fi
  active_server_id="$(printf '%s' "$active_json" | jq -r '.active_server_id // empty')"
  active_tag="$(
    printf '%s' "$enabled_json" | jq -r --arg id "$active_server_id" '
      first(.[]? | select(.id == $id) | .tag) // empty
    '
  )"
  selection_mode="$(config_get main selection_mode 'auto')"
  podkop_node="main-urltest-out"
  [ "$selection_mode" = "manual" ] && podkop_node="$active_tag"

  jq -n \
    --arg mode "urltest" \
    --arg selection_mode "$selection_mode" \
    --arg active_server_id "$(printf '%s' "$active_json" | jq -r '.active_server_id // empty')" \
    --arg active_tag "$active_tag" \
    --arg podkop_node "$podkop_node" \
    --argjson enabled_servers "$enabled_json" \
    --argjson source "$active_json" \
    '{
      mode: $mode,
      selection_mode: $selection_mode,
      active_server_id: $active_server_id,
      active_tag: $active_tag,
      podkop_node: $podkop_node,
      enabled_servers: $enabled_servers,
      source: $source
    }' > "$PODKOP_FILE"

  cat "$PODKOP_FILE"
}

write_podkop_apply_script() {
  require_jq || return 1
  init_storage_files

  podkop_json="$(sync_podkop_export)"
  [ -n "${podkop_json:-}" ] || return 1

  section_name="$(config_get main podkop_section_name 'main')"
  active_tag="$(printf '%s' "$podkop_json" | jq -r '.active_tag // empty')"
  podkop_node="$(printf '%s' "$podkop_json" | jq -r '.podkop_node // empty')"
  enabled_links="$(
    printf '%s' "$podkop_json" | jq -r '.enabled_servers[]? | .url'
  )"
  [ -n "${enabled_links:-}" ] || return 1

  cat > "$PODKOP_UCI_SNIPPET_FILE" <<EOF
config section '${section_name}'
        option connection_type 'proxy'
        option proxy_config_type 'urltest'
        option proxy_string ''
EOF

  printf '%s\n' "$enabled_links" | while IFS= read -r link; do
    [ -n "$link" ] || continue
    printf "        list urltest_proxy_links '%s'\n" "$link" >> "$PODKOP_UCI_SNIPPET_FILE"
  done

  if [ -n "${podkop_node:-}" ]; then
    printf "config config 'config'\n        option node '%s'\n" "$podkop_node" >> "$PODKOP_UCI_SNIPPET_FILE"
  fi

  cat > "$PODKOP_APPLY_FILE" <<EOF
#!/bin/sh
set -eu
uci -q set podkop.${section_name}.connection_type=proxy
uci -q set podkop.${section_name}.proxy_config_type=urltest
uci -q set podkop.${section_name}.proxy_string=''
uci -q delete podkop.${section_name}.urltest_proxy_links || true
EOF

  printf '%s\n' "$enabled_links" | while IFS= read -r link; do
    [ -n "$link" ] || continue
    printf "uci -q add_list podkop.%s.urltest_proxy_links='%s'\n" "$section_name" "$link" >> "$PODKOP_APPLY_FILE"
  done

  if [ -n "${podkop_node:-}" ]; then
    cat >> "$PODKOP_APPLY_FILE" <<EOF
uci -q set podkop.config=config || true
uci -q set podkop.config.node='${podkop_node}' || true
EOF
  fi

  cat >> "$PODKOP_APPLY_FILE" <<'EOF'
uci -q commit podkop
if [ -x /etc/init.d/podkop ]; then
  /etc/init.d/podkop reload || /etc/init.d/podkop restart || true
fi
EOF

  chmod +x "$PODKOP_APPLY_FILE"

  enabled_count="$(printf '%s\n' "$enabled_links" | sed '/^$/d' | awk 'END{print NR+0}')"

  jq -n \
    --arg section_name "$section_name" \
    --arg active_tag "$active_tag" \
    --arg podkop_node "$podkop_node" \
    --arg enabled_count "$enabled_count" \
    --arg script_path "$PODKOP_APPLY_FILE" \
    --arg uci_snippet_path "$PODKOP_UCI_SNIPPET_FILE" \
    '{
      section_name: $section_name,
      active_tag: $active_tag,
      podkop_node: $podkop_node,
      enabled_count: ($enabled_count | tonumber),
      script_path: $script_path,
      uci_snippet_path: $uci_snippet_path
    }'
}

apply_podkop_config() {
  require_jq || return 1
  init_storage_files

  if [ "$(get_manager_enabled)" != "1" ]; then
    jq -n '{
      applied: false,
      skipped: true,
      reason: "manager_disabled"
    }' > "$PODKOP_APPLY_RESULT_FILE"
    return 0
  fi

  preview_json="$(write_podkop_apply_script)"
  [ -n "${preview_json:-}" ] || return 1

  section_name="$(printf '%s' "$preview_json" | jq -r '.section_name')"
  active_tag="$(printf '%s' "$preview_json" | jq -r '.active_tag // empty')"
  podkop_node="$(printf '%s' "$preview_json" | jq -r '.podkop_node // empty')"
  enabled_count="$(printf '%s' "$preview_json" | jq -r '.enabled_count // 0')"
  selection_mode="$(config_get main selection_mode 'auto')"
  desired_proxy="main-urltest-out"
  [ "$selection_mode" = "manual" ] && [ -n "${active_tag:-}" ] && desired_proxy="$active_tag"
  enabled_links="$(
    jq -r '.servers[] | select(.excluded != true and (.transport // "") != "xhttp") | .url' "$PARSED_FILE"
  )"
  live_apply='{}'

  if has_uci; then
    "$UCI_BIN" -q set "podkop.${section_name}.connection_type=proxy"
    "$UCI_BIN" -q set "podkop.${section_name}.proxy_config_type=urltest"
    "$UCI_BIN" -q set "podkop.${section_name}.proxy_string="
    "$UCI_BIN" -q delete "podkop.${section_name}.urltest_proxy_links" >/dev/null 2>&1 || true
    printf '%s\n' "$enabled_links" | while IFS= read -r link; do
      [ -n "$link" ] || continue
      "$UCI_BIN" -q add_list "podkop.${section_name}.urltest_proxy_links=${link}"
    done
    if [ -n "${podkop_node:-}" ]; then
      "$UCI_BIN" -q set "podkop.config=config" >/dev/null 2>&1 || true
      "$UCI_BIN" -q set "podkop.config.node=${podkop_node}" >/dev/null 2>&1 || true
    fi
    "$UCI_BIN" -q commit podkop

    if has_podkop_service; then
      /etc/init.d/podkop reload >/dev/null 2>&1 || /etc/init.d/podkop restart >/dev/null 2>&1 || true
    fi

    if has_podkop_cmd; then
      ready_try=0
      while [ "$ready_try" -lt 10 ]; do
        if podkop_exec clash_api get_proxies >/dev/null 2>&1; then
          break
        fi
        ready_try=$((ready_try + 1))
        sleep 1
      done

      if [ -n "${desired_proxy:-}" ]; then
        apply_try=0
        while [ "$apply_try" -lt 8 ]; do
          live_apply="$(podkop_exec clash_api set_group_proxy main-out "$desired_proxy" 2>/dev/null || printf '{}')"
          if printf '%s' "$live_apply" | jq -e '.success == true' >/dev/null 2>&1; then
            break
          fi
          apply_try=$((apply_try + 1))
          sleep 1
        done
      fi
    fi

    if printf '%s' "${live_apply:-}" | jq -e . >/dev/null 2>&1; then
      live_apply="$(printf '%s' "$live_apply" | jq -c . 2>/dev/null | head -n 1)"
    else
      live_apply='{}'
    fi
    [ -n "${live_apply:-}" ] || live_apply='{}'

    jq -n \
      --arg applied "true" \
      --arg section_name "$section_name" \
      --arg active_tag "$active_tag" \
      --arg podkop_node "$podkop_node" \
      --arg selection_mode "$selection_mode" \
      --arg desired_proxy "$desired_proxy" \
      --arg enabled_count "$enabled_count" \
      --argjson live_apply "$live_apply" \
      --arg script_path "$PODKOP_APPLY_FILE" \
      --arg uci_snippet_path "$PODKOP_UCI_SNIPPET_FILE" \
      '{
        applied: ($applied == "true"),
        section_name: $section_name,
        active_tag: $active_tag,
        podkop_node: $podkop_node,
        selection_mode: $selection_mode,
        desired_proxy: $desired_proxy,
        live_apply: $live_apply,
        enabled_count: ($enabled_count | tonumber),
        script_path: $script_path,
        uci_snippet_path: $uci_snippet_path
      }' > "$PODKOP_APPLY_RESULT_FILE"
  else
    jq -n \
      --arg applied "false" \
      --arg section_name "$section_name" \
      --arg active_tag "$active_tag" \
      --arg podkop_node "$podkop_node" \
      --arg selection_mode "$selection_mode" \
      --arg desired_proxy "$desired_proxy" \
      --arg enabled_count "$enabled_count" \
      --arg script_path "$PODKOP_APPLY_FILE" \
      --arg uci_snippet_path "$PODKOP_UCI_SNIPPET_FILE" \
      '{
        applied: ($applied == "true"),
        section_name: $section_name,
        active_tag: $active_tag,
        podkop_node: $podkop_node,
        selection_mode: $selection_mode,
        desired_proxy: $desired_proxy,
        live_apply: {},
        enabled_count: ($enabled_count | tonumber),
        script_path: $script_path,
        uci_snippet_path: $uci_snippet_path
      }' > "$PODKOP_APPLY_RESULT_FILE"
  fi

  cat "$PODKOP_APPLY_RESULT_FILE"
}
