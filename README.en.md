# Obhodiq

> VPN subscription parser and manager for Podkop on OpenWrt

[Русский](README.md) | [English](README.en.md)

Obhodiq is an add-on for [Podkop](https://github.com/itdoginfo/podkop) on OpenWrt. It is designed for VPN subscription links: Obhodiq takes a subscription URL, parses it, builds a server list, and passes the result to Podkop. Podkop then handles routing, `URLTest`, manual switching, and latency checks.

## Contents

- [Important](#important)
- [What Obhodiq does](#what-obhodiq-does)
- [How it works](#how-it-works)
- [Formats the parser can read](#formats-the-parser-can-read)
- [What this means in practice](#what-this-means-in-practice)
- [Requirements](#requirements)
- [Install](#install)
- [Manual install](#manual-install)
- [Manual language switch](#manual-language-switch)
- [Remove](#remove)
- [Interface](#interface)
- [How subscription auto-update works](#how-subscription-auto-update-works)
- [Important behavior](#important-behavior)
- [If your subscription does not work](#if-your-subscription-does-not-work)
- [Testing status](#testing-status)

> [!IMPORTANT]
> Obhodiq does **not** replace Podkop. It works **only together with** the original Podkop and requires Podkop to be installed first.

> [!IMPORTANT]
> Disclaimer. Obhodiq is **not a censorship-circumvention tool, not a VPN service, and not a standalone VPN client**. The author does not support using the project to violate the laws of any country.
>
> The project is intended for **technical subscription processing and Podkop configuration management on OpenWrt**: Obhodiq takes a subscription link, parses it, and prepares configuration data for an already installed Podkop. Actual connection handling, `URLTest`, routing, transport behavior, and traffic processing are handled by Podkop and its dependencies.

> [!WARNING]
> Obhodiq is currently in **beta**. It is already usable, but different providers, subscription styles, and individual servers may behave differently.

> [!NOTE]
> A quick parsing demo is available here:
> [renqismike.github.io/obhodiq](https://renqismike.github.io/obhodiq/)
>
> - subscription data stays only in the browser cache
> - the demo uses a local `device id` stored in the browser and reused for later checks
> - this reduces the chance that a provider will count each repeated check as a new device
> - different VPN providers may still account for such requests differently

## Important

> [!NOTE]
> The project is intended for **technical subscription processing and Podkop configuration management on OpenWrt**.
>
> Obhodiq itself:
> - **does not include its own VPN/proxy engine**
> - **does not establish tunnels**
> - **does not route traffic on its own**
> - **does not act as a VPN or proxy provider**
> - **does not provide access to any resources by itself**
>
> Everything related to actual connections and traffic forwarding is handled by Podkop and its dependencies.

## What Obhodiq does

- accepts VPN subscription links
- parses plain, base64, and many JSON-based subscriptions
- extracts servers from subscriptions and exports them to Podkop
- keeps `URLTest` available for automatic best-server selection
- allows manual server selection
- allows per-server enable/disable
- imports `WS` servers **disabled by default**, while still allowing them to be enabled manually
- shows subscription info, active server, and ping returned by Podkop
- supports manual and scheduled subscription refresh

## How it works

1. Add a subscription URL.
2. Obhodiq downloads the subscription and parses supported links inside it.
3. Supported servers are prepared and exported to Podkop.
4. Podkop then handles routing, `URLTest`, manual switching, and latency.

## Formats the parser can read

Obhodiq is aimed at the kinds of subscriptions commonly used by VPN providers today: mainly V2Ray / Xray / sing-box style subscriptions and some provider-side wrapper formats.

The parser currently handles:

- plain link lists
- base64-wrapped subscriptions
- many JSON-based subscription payloads
- HAPP-style wrappers such as `happ://add/https://...`

For part of those provider-side wrappers, Obhodiq also uses `HApp 1.0` client emulation so that some subscription endpoints return the expected payload at all.

Link families the parser can currently recognize and parse:

- `vless://`
- `vmess://`
- `trojan://`
- `ss://`
- `socks4://`
- `socks5://`
- `hy2://`
- `hysteria://`
- `hysteria2://`

## What this means in practice

> [!IMPORTANT]
> `WS` servers are currently **imported disabled by default**. In our testing they were often unstable, but Podkop / sing-box maintainers indicate that `WS` may work in some cases, so such servers can still be enabled manually and tested separately.

It is important to separate two things:

1. Obhodiq managed to parse the link and add the server to the list.
2. Podkop managed to actually apply that server, ping it, and use it successfully.

Obhodiq is only responsible for the first part. After that, Podkop decides what it can actually apply, ping, and use.

Currently hard-filtered before export:

- `XHTTP`

Additional notes:

- `happ://add/https://...` is treated as a wrapper format, not as a proxy type
- encrypted `happ://crypt4/...` subscriptions are not claimed as fully supported
- `WS`, `GRPC`, `Hysteria`, and similar formats may parse correctly, but actual behavior still depends on Podkop, `sing-box`, and the provider
- `WS` is currently imported **disabled by default** because in our testing it was often unstable; however, Podkop / sing-box documentation and maintainer comments indicate that `WS` may work, so such servers can still be enabled manually and tested case by case
- Podkop uses `sing-box`, so support for `VLESS`, `WS`, `Reality`, and other transport-dependent formats depends on `sing-box` capabilities
- for more complex cases, Podkop also supports manual configuration through `Outbound Config`

Based on current testing:

- standard `VLESS` subscriptions are the best-verified path for `URLTest` in Podkop
- `Trojan`, `Shadowsocks`, `Socks`, `Hysteria2`, `VMess`, and other link families are parsed by Obhodiq, but this does not mean every such server is guaranteed to work in Podkop with every provider
- if a server has no ping, it does not automatically mean the link is broken; it means Podkop did not return usable latency for that server in the current setup

Useful references:

- [Podkop Sections](https://podkop.net/docs/sections/#tip-podklyucheniya-connection-type)
- [Custom Outbound in Podkop](https://podkop.net/docs/own-outbound/#amnezia-vless)

## Requirements

- OpenWrt
- original [Podkop](https://github.com/itdoginfo/podkop) already installed
- recommended Podkop versions: `0.7.19`, `0.7.20`
- recommended OpenWrt versions: `24.10.6`, `25.12.5`

## Install

Install the original Podkop first:

```sh
sh <(wget -O - https://raw.githubusercontent.com/itdoginfo/podkop/refs/heads/main/install.sh)
```

Then install Obhodiq:

```sh
sh <(wget -O - https://renqismike.github.io/obhodiq/install.sh)
```

If GitHub Pages is routed poorly by the provider, fallback command:

```sh
sh <(wget -O - https://github.com/renqismike/obhodiq/raw/main/install.sh)
```

## Manual install

If you prefer manual installation, use the package files from the release assets.

For OpenWrt with `opkg`:

```sh
opkg install obhodiq_0.2.0_all.ipk luci-app-obhodiq_0.2.0_all.ipk
```

For OpenWrt with `apk`:

```sh
apk add --allow-untrusted obhodiq-0.2.0.apk luci-app-obhodiq-0.2.0.apk
```

### Manual language switch

The commands below work the same for Obhodiq installed either through `opkg` (`ipk`) or through `apk`.

```sh
/usr/bin/obhodiq set-lang ru
/usr/bin/obhodiq set-lang en
```

## Remove

Recommended full removal:

```sh
sh <(wget -O - https://renqismike.github.io/obhodiq/uninstall.sh)
```

Fallback command:

```sh
sh <(wget -O - https://github.com/renqismike/obhodiq/raw/main/uninstall.sh)
```

Manual package removal with `opkg`:

```sh
opkg remove luci-app-obhodiq
opkg remove obhodiq
```

Manual package removal with `apk`:

```sh
apk del luci-app-obhodiq
apk del obhodiq
```

Important:

- the `uninstall.sh` method is the main recommended one, because it uses the official uninstall script from the repository
- manual removal through `opkg` or `apk` should also clean up Obhodiq leftovers correctly when the current package version is installed
- removing Obhodiq is intended not to remove or break Podkop itself

## Interface

![Obhodiq interface screenshot](images/obhodiq-ui.png)

Main actions:

- `Save URL` stores the subscription URL
- `Refresh subscription` downloads and rebuilds the current subscription
- `Subscription auto-update` sets the refresh schedule
- the power button enables or disables Obhodiq integration

Server list:

- `Auto` keeps Podkop in `URLTest` mode
- the radio button switches between auto mode and a manual server
- the checkbox enables or excludes a server from export
- `Ping` shows the value returned by Podkop

### How subscription auto-update works

Auto-update uses cron scheduling, not "time since you selected it".

Current schedule:

- `30 minutes` — at minute `00` and `30` of every hour
- `1 hour` — at the start of every hour
- `3 hours` — at `00:00`, `03:00`, `06:00`, `09:00`, `12:00`, `15:00`, `18:00`, `21:00`
- `6 hours` — at `00:00`, `06:00`, `12:00`, `18:00`
- `12 hours` — at `00:00` and `12:00`
- `24 hours` — every day at `03:00`
- `Never` — disabled

If Obhodiq is turned off with the power button, scheduled auto-update does not run.

## Important behavior

- if a server appears in the list, it means Obhodiq managed to parse it
- if a server has ping, it means Podkop returned latency for it
- if a server has no ping, it does not always mean the link is broken, but it does mean that in Podkop this server did not return usable latency
- a link family being listed in this README means parser support in Obhodiq, not an unconditional guarantee that every server of that family will work with every provider
- parser support in Obhodiq **does not guarantee** that every provider-specific subscription endpoint will parse successfully

## If your subscription does not work

- not every provider-side subscription format is guaranteed to match the formats already tested in Obhodiq
- if your link does not parse or behaves unexpectedly, please open an issue in the repository
- if possible, include a sanitized sample or a description of the response format without personal tokens, UUIDs, domains, or private URLs
- if it is a new valid format, I will try to review it and add support where possible

## Testing status

This is still a beta release and has only been checked against a limited set of subscriptions from different VPN providers, not against every possible provider or subscription style on the market.

Tested during development on:

- OpenWrt `24.10.6` with `opkg`
- OpenWrt `25.12.5` with `apk`
- Podkop `0.7.19-r1`
- Podkop `0.7.20-r1`

The latest checks also confirmed:

- clean `apk` install after full Obhodiq removal
- clean `ipk` install on a real router after full Obhodiq removal
- Obhodiq removal without removing or breaking Podkop itself

## Support

If Obhodiq was useful to you and you want to support further development, you can use any of the options below.

**[Donate via CloudTips](https://pay.cloudtips.ru/p/13b7f0a4)**

<table>
  <tr>
    <td align="center" width="33%">
      <img src="images/support-usdt-trc20.png" alt="QR USDT TRC20" width="200">
    </td>
    <td align="center" width="33%">
      <img src="images/support-usdt-bep20.png" alt="QR USDT BEP20" width="200">
    </td>
    <td align="center" width="33%">
      <img src="images/support-binance.png" alt="QR Binance Pay" width="235">
    </td>
  </tr>
  <tr>
    <td align="center"><strong>USDT (TRC20 / Tron)</strong></td>
    <td align="center"><strong>USDT (BEP20 / BNB Smart Chain)</strong></td>
    <td align="center"><strong>Binance Pay</strong></td>
  </tr>
  <tr>
    <td align="center"><code>TYmyHohGWZWGrfb7fKHhCNDX6cvC81jMrU</code></td>
    <td align="center"><code>0x038feAFa22c8FDC8dB98CAd1943a64545B42CB0d</code></td>
    <td align="center"><code>Binance Pay</code></td>
  </tr>
</table>

Thank you for supporting the project.
