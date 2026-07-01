#!/bin/sh

refresh_latency_cache() {
  require_jq || return 1
  init_storage_files

  if ! has_podkop_cmd; then
    printf '%s\n' '{}' > "$LATENCY_FILE"
    log_msg "podkop command not found, latency cache cleared"
    return 0
  fi

  save_latency_json() {
    printf '%s' "$1" | jq '
      if type == "object" then
        with_entries(.value |= (if type == "number" then . else (try tonumber catch .) end))
      else
        .
      end
    ' > "$LATENCY_FILE"
  }

  raw_output="$(
    /usr/bin/podkop clash_api get_group_latency main-urltest-out 10000 2>/dev/null \
      || podkop clash_api get_group_latency main-urltest-out 10000 2>/dev/null \
      || /usr/bin/podkop clash_api get_group_latency main-out 10000 2>/dev/null \
      || podkop clash_api get_group_latency main-out 10000 2>/dev/null \
      || true
  )"

  if printf '%s' "$raw_output" | jq -e 'type == "object" and length > 0' >/dev/null 2>&1; then
    save_latency_json "$raw_output"
    return 0
  fi

  tags="$(
    jq -r '.enabled_servers[]? | .tag // empty' "$PODKOP_FILE" 2>/dev/null || true
  )"
  [ -n "${tags:-}" ] || {
    printf '%s\n' '{}' > "$LATENCY_FILE"
    log_msg "latency data unavailable: no enabled tags"
    return 0
  }

  tmp_dir="$(mktemp -d)"
  batch_count=0
  batch_limit=6

  for tag in $tags; do
    (
      response="$(podkop_exec clash_api get_proxy_latency "$tag" 10000 2>/dev/null || true)"
      delay="$(printf '%s' "$response" | jq -r '.delay // empty' 2>/dev/null || true)"
      [ -n "${delay:-}" ] || exit 0
      printf '%s\t%s\n' "$tag" "$delay" > "$tmp_dir/$tag"
    ) &
    batch_count=$((batch_count + 1))
    if [ "$batch_count" -ge "$batch_limit" ]; then
      wait
      batch_count=0
    fi
  done
  wait

  tmp_file="$(mktemp)"
  printf '%s\n' '{}' > "$tmp_file"

  for result_file in "$tmp_dir"/*; do
    [ -f "$result_file" ] || continue
    tag="$(cut -f1 "$result_file" 2>/dev/null || true)"
    delay="$(cut -f2 "$result_file" 2>/dev/null || true)"
    [ -n "${tag:-}" ] || continue
    [ -n "${delay:-}" ] || continue
    next_file="$(mktemp)"
    jq --arg tag "$tag" --argjson latency "$delay" '. + {($tag): $latency}' "$tmp_file" > "$next_file"
    mv "$next_file" "$tmp_file"
  done

  mv "$tmp_file" "$LATENCY_FILE"
  rm -rf "$tmp_dir"
}

select_best_server() {
  require_jq || return 1
  init_storage_files

  refresh_latency_cache >/dev/null 2>&1 || true

  best_id="$(
    jq -r --slurpfile latency "$LATENCY_FILE" --slurpfile podkop "$PODKOP_FILE" '
      [
        .servers[] as $server
        | ($podkop[0].enabled_servers // [] | map(select(.id == $server.id)) | first) as $enabled
        | select($enabled != null)
        | select(($latency[0][$enabled.tag] // null) != null)
        | {
            id: $server.id,
            latency: ($latency[0][$enabled.tag] | tonumber)
          }
      ]
      | sort_by(.latency)
      | .[0].id // empty
    ' "$PARSED_FILE"
  )"

  [ -n "${best_id:-}" ] || {
    log_msg "no latency-backed server available"
    return 1
  }

  set_active_server "$best_id"
  log_msg "selected best server: $best_id"
}
