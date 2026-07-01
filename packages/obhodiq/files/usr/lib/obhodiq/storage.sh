#!/bin/sh

save_state_json() {
  init_storage_files
  payload="$1"
  printf '%s\n' "$payload" > "$STATE_FILE"
}

get_manager_enabled() {
  value="$(config_get main enabled '1')"
  case "$value" in
    0|false|off|disabled) printf '%s\n' '0' ;;
    *) printf '%s\n' '1' ;;
  esac
}

set_manager_enabled() {
  enabled_flag="$1"
  case "$enabled_flag" in
    1|0) ;;
    true|on|enable|enabled) enabled_flag="1" ;;
    false|off|disable|disabled) enabled_flag="0" ;;
    *)
      log_msg "invalid enabled flag: $enabled_flag"
      return 1
      ;;
  esac

  config_set main enabled "$enabled_flag"
  log_msg "manager enabled set: $enabled_flag"
}

get_manager_lang() {
  value="$(config_get main lang 'en')"
  case "$value" in
    ru|en) printf '%s\n' "$value" ;;
    *) printf '%s\n' 'en' ;;
  esac
}

set_manager_lang() {
  lang="$1"
  case "$lang" in
    ru|en) ;;
    *)
      log_msg "invalid language: $lang"
      return 1
      ;;
  esac

  config_set main lang "$lang"
  log_msg "manager language set: $lang"
}

set_active_server() {
  require_jq || return 1
  init_storage_files

  server_id="$1"
  server_json="$(jq -c --arg id "$server_id" '.servers[] | select(.id == $id)' "$PARSED_FILE")"
  [ -n "${server_json:-}" ] || {
    log_msg "server not found: $server_id"
    return 1
  }

  config_set main active_server_id "$server_id"
  save_state_json "$server_json"
  log_msg "active server set: $server_id"
}

set_selection_mode() {
  init_storage_files
  mode="$1"

  case "$mode" in
    auto|manual) ;;
    *)
      log_msg "invalid selection mode: $mode"
      return 1
      ;;
  esac

  config_set main selection_mode "$mode"
  log_msg "selection mode set: $mode"
}

set_active_group() {
  init_storage_files
  group_name="$1"
  config_set main active_group "$group_name"
  log_msg "active group set: $group_name"
}

set_server_group() {
  require_jq || return 1
  init_storage_files

  server_id="$1"
  group_name="$2"
  tmp_file="$(mktemp)"

  jq --arg id "$server_id" --arg group "$group_name" '
    .servers |= map(if .id == $id then .group = $group else . end)
  ' "$PARSED_FILE" > "$tmp_file"
  mv "$tmp_file" "$PARSED_FILE"

  jq --arg id "$server_id" --arg group "$group_name" '
    . + {($id): $group}
  ' "$GROUPS_FILE" > "$tmp_file"
  mv "$tmp_file" "$GROUPS_FILE"

  log_msg "group updated: $server_id -> $group_name"
}

set_server_excluded() {
  require_jq || return 1
  init_storage_files

  server_id="$1"
  excluded_flag="$2"
  tmp_file="$(mktemp)"

  jq --arg id "$server_id" --argjson excluded "$excluded_flag" '
    .servers |= map(if .id == $id then .excluded = $excluded else . end)
  ' "$PARSED_FILE" > "$tmp_file"
  mv "$tmp_file" "$PARSED_FILE"

  if [ "$excluded_flag" = "true" ]; then
    jq --arg id "$server_id" '
      if index($id) then . else . + [$id] end
    ' "$EXCLUDED_FILE" > "$tmp_file"
  else
    jq --arg id "$server_id" '
      map(select(. != $id))
    ' "$EXCLUDED_FILE" > "$tmp_file"
  fi
  mv "$tmp_file" "$EXCLUDED_FILE"

  log_msg "excluded updated: $server_id -> $excluded_flag"
}

print_status() {
  require_jq || return 1
  init_storage_files

  configured_active_id="$(config_get main active_server_id '')"
  manager_enabled="$(get_manager_enabled)"
  subscription_url="$(config_get main subscription_url '')"
  update_schedule="$(config_get main update_schedule 'never')"
  manager_lang="$(get_manager_lang)"
  active_group="$(config_get main active_group 'default')"
  configured_selection_mode="$(config_get main selection_mode 'auto')"
  subscription_error='{}'
  if [ -f "$ERROR_FILE" ]; then
    subscription_error="$(cat "$ERROR_FILE" 2>/dev/null || printf '{}')"
    if ! printf '%s' "$subscription_error" | jq -e . >/dev/null 2>&1; then
      subscription_error='{}'
    fi
  fi
  active_id="$configured_active_id"
  selection_mode="$configured_selection_mode"
  live_proxies='{}'
  main_out_now=''
  urltest_now=''
  resolved_tag=''
  resolved_id=''

  if has_podkop_cmd; then
    proxy_try=0
    while [ "$proxy_try" -lt 5 ]; do
      live_raw="$(podkop_exec clash_api get_proxies 2>/dev/null || true)"
      if printf '%s' "$live_raw" | jq -e '.proxies' >/dev/null 2>&1; then
        live_proxies="$(printf '%s' "$live_raw" | jq '.proxies')"
        main_out_now="$(printf '%s' "$live_raw" | jq -r '.proxies["main-out"].now // empty')"
        urltest_now="$(printf '%s' "$live_raw" | jq -r '.proxies["main-urltest-out"].now // empty')"
        resolved_tag="$main_out_now"
        [ "$resolved_tag" = "main-urltest-out" ] && resolved_tag="$urltest_now"
        if [ -n "$resolved_tag" ]; then
          resolved_id="$(jq -r --arg tag "$resolved_tag" '
            first((.enabled_servers // [])[]? | select(.tag == $tag) | .id) // empty
          ' "$PODKOP_FILE" 2>/dev/null || printf '')"
        fi
        break
      fi
      proxy_try=$((proxy_try + 1))
      sleep 1
    done
  fi

  if [ -n "$main_out_now" ]; then
    if [ "$main_out_now" = "main-urltest-out" ]; then
      selection_mode="auto"
    else
      selection_mode="manual"
    fi

    if [ -n "$resolved_id" ]; then
      active_id="$resolved_id"
    fi
  fi

  jq -n \
    --arg active_id "$active_id" \
    --arg manager_enabled "$manager_enabled" \
    --arg subscription_url "$subscription_url" \
    --arg update_schedule "$update_schedule" \
    --arg manager_lang "$manager_lang" \
    --arg active_group "$active_group" \
    --arg selection_mode "$selection_mode" \
    --arg configured_active_id "$configured_active_id" \
    --arg configured_selection_mode "$configured_selection_mode" \
    --arg main_out_now "$main_out_now" \
    --arg urltest_now "$urltest_now" \
    --arg resolved_id "$resolved_id" \
    --slurpfile parsed "$PARSED_FILE" \
    --slurpfile latency "$LATENCY_FILE" \
    --slurpfile state "$STATE_FILE" \
    --slurpfile meta "$META_FILE" \
    --slurpfile exported "$EXPORT_FILE" \
    --slurpfile podkop "$PODKOP_FILE" \
    --slurpfile podkop_apply "$PODKOP_APPLY_RESULT_FILE" \
    --argjson subscription_error "$subscription_error" \
    --argjson live_proxies "$live_proxies" \
    '
      def runtime_tag_for($server; $enabled; $live_proxies):
        if ($enabled.tag // null) != null then
          $enabled.tag
        elif ($server.excluded // false) == true or ($server.unsupported // false) == true then
          null
        elif ($live_proxies[$server.tag] // null) != null then
          $server.tag
        else
          null
        end;

      def latency_for($runtime_tag; $live_proxies; $latency):
        if $runtime_tag == null then
          null
        elif (($live_proxies[$runtime_tag] // {}) | .history[0].delay?) != null then
          (($live_proxies[$runtime_tag] // {}) | .history[0].delay)
        else
          ($latency[0][$runtime_tag] // null)
        end;

      ($parsed[0].servers // []) as $parsed_servers
      | ($podkop[0].enabled_servers // []) as $enabled_servers
      | (
          $parsed_servers
          | map(
              . as $server
              | ($enabled_servers | map(select(.id == $server.id)) | first) as $enabled
              | runtime_tag_for($server; $enabled; $live_proxies) as $runtime_tag
              | . + {
                  runtime_tag: $runtime_tag,
                  latency: latency_for($runtime_tag; $live_proxies; $latency)
                }
            )
        ) as $servers
      | {
          active_server_id: $active_id,
          enabled: ($manager_enabled == "1"),
          lang: $manager_lang,
          subscription_url: $subscription_url,
          update_schedule: $update_schedule,
          active_group: $active_group,
          selection_mode: $selection_mode,
          configured_active_server_id: $configured_active_id,
          configured_selection_mode: $configured_selection_mode,
          live: {
            main_out_now: $main_out_now,
            urltest_now: $urltest_now,
            resolved_active_id: $resolved_id,
            proxies: $live_proxies
          },
          subscription_error: $subscription_error,
          selected: ($state[0] // {}),
          meta: ($meta[0] // {}),
          exported: ($exported[0] // {}),
          podkop: ($podkop[0] // {}),
          podkop_apply: ($podkop_apply[0] // {}),
          count: ($parsed[0].count // 0),
          supported_count: ($servers | map(select((.unsupported // false) != true)) | length),
          unsupported_count: ($servers | map(select((.unsupported // false) == true)) | length),
          enabled_count: ($servers | map(select((.excluded // false) != true and (.unsupported // false) != true)) | length),
          latency_count: ($servers | map(select(.latency != null)) | length),
          servers: $servers
        }
    '
}

list_servers() {
  require_jq || return 1
  init_storage_files
  jq -c '.servers // []' "$PARSED_FILE"
}

list_groups() {
  require_jq || return 1
  init_storage_files
  jq -n \
    --slurpfile parsed "$PARSED_FILE" \
    --slurpfile groups "$GROUPS_FILE" \
    --arg active_group "$(config_get main active_group 'default')" \
    '{
      active_group: $active_group,
      groups: (
        ($parsed[0].servers // [])
        | map(.group)
        | unique
      ),
      map: ($groups[0] // {})
    }'
}
