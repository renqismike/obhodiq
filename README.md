# Obhodiq

[English](README.md) | [Русский](README.ru.md)

Obhodiq is a beta add-on for [Podkop](https://github.com/itdoginfo/podkop) on OpenWrt.

Most VPN providers now give access through subscription links instead of one ready-to-use config. Obhodiq is made for that workflow: it takes subscription links, turns them into a server list, and passes the result to Podkop so you can keep `URLTest` or select a server manually.

<p align="center">
  <img src="images/obhodiq-ui.png" alt="Obhodiq interface screenshot" width="1100">
</p>

> [!IMPORTANT]
> Obhodiq is **not** a replacement for Podkop. It works **with** the original Podkop and depends on it being installed first.

> [!WARNING]
> Obhodiq is currently a **beta release**. Different providers and different subscription styles may behave differently. Users of this release are also effectively beta testers.

## What Obhodiq does

- imports VPN subscription links
- fetches and parses supported subscription formats
- builds a server list for Podkop
- keeps `URLTest` auto mode available
- allows manual server selection
- allows per-server enable/disable
- shows subscription info, current server, and ping returned by Podkop
- can refresh the subscription on a schedule

## How it works

1. Add a subscription URL.
2. Obhodiq downloads the subscription and parses the supported links inside it.
3. The supported servers are prepared and exported for Podkop.
4. Podkop then handles routing, `URLTest`, and latency checks.

## Subscription formats

Obhodiq is aimed at the kinds of subscription links commonly used by VPN providers today, especially V2Ray / Xray / sing-box style subscriptions and provider wrappers around them.

Current parser coverage includes:

- plain link lists
- base64-wrapped link lists
- many JSON-based subscription payloads
- HAPP-style wrapper links such as `happ://add/https://...`

Proxy/link families currently handled by the parser:

- `vless://`
- `vmess://`
- `trojan://`
- `ss://`
- `socks4://`
- `socks5://`
- `hy2://`
- `hysteria://`
- `hysteria2://`

## Compatibility notes

Obhodiq parses subscriptions and prepares the server list, but Podkop still decides what it can actually run, ping, and use successfully.

Currently hard-filtered before export:

- `XHTTP`

Other practical notes:

- `happ://add/https://...` is treated as a wrapper format, not as a proxy type itself
- encrypted `happ://crypt4/...` subscriptions are a separate case and are not claimed as fully supported here
- `WS`, `GRPC`, `Hysteria` and similar formats may parse correctly but still fail later depending on Podkop support or provider-side server behavior
- most formats that Podkop handles well should work here too, but not every imported server is guaranteed

## Requirements

- OpenWrt
- original [Podkop](https://github.com/itdoginfo/podkop) already installed
- recommended Podkop versions: `0.7.19`, `0.7.20`
- recommended OpenWrt versions: `24.10.6`, `25.12.5`

## Install

Install original Podkop first:

```sh
sh <(wget -O - https://raw.githubusercontent.com/itdoginfo/podkop/refs/heads/main/install.sh)
```

Then install Obhodiq:

```sh
sh <(wget -O - https://raw.githubusercontent.com/renqismike/obhodiq/main/install.sh)
```

## Manual install

If you prefer manual installation, use the package files from release assets or from the repository `dist/` folder.

For OpenWrt with `opkg`:

```sh
opkg install obhodiq_0.1.0-r2_all.ipk luci-app-obhodiq_0.1.0-r2_all.ipk
```

For OpenWrt with `apk`:

```sh
apk add --allow-untrusted obhodiq-0.1.0-r2.apk luci-app-obhodiq-0.1.0-r2.apk
```

## Remove

```sh
sh uninstall.sh
```

Or manually with `opkg`:

```sh
opkg remove luci-app-obhodiq
opkg remove obhodiq
```

Or manually with `apk`:

```sh
apk del luci-app-obhodiq
apk del obhodiq
```

If you want to guarantee that the saved subscription URL is removed too, use the release `uninstall.sh`.

Obhodiq is meant to be removable without removing Podkop itself.

## Interface

Main actions:

- `Save URL` stores the subscription URL
- `Refresh subscription` downloads and rebuilds the current subscription
- `Auto update` sets how often the subscription should refresh automatically
- the power toggle enables or disables Obhodiq integration

Server list:

- `Auto` keeps Podkop in `URLTest` mode
- the radio button switches between auto mode and a manual server
- the checkbox enables or disables a server for export
- `Ping` shows the value returned by Podkop

## Testing status

This is still a beta release and has only been checked against a limited set of subscription links from different VPN providers, not against every provider or every subscription style on the market.

Tested during development on:

- OpenWrt `24.10.6` with `opkg`
- OpenWrt `25.12.5` with `apk`
- Podkop `0.7.19-r1`
- Podkop `0.7.20-r1`
