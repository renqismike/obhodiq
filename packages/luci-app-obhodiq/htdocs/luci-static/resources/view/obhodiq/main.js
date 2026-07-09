'use strict';
'require view';

var UI_LANG = 'en';
var I18N = {
  en: {
    none: 'none',
    every_30m: 'Every 30 minutes',
    every_1h: 'Every hour',
    every_3h: 'Every 3 hours',
    every_6h: 'Every 6 hours',
    every_12h: 'Every 12 hours',
    every_24h: 'Every 24 hours',
    never: 'Never',
    loading: 'Loading...',
    expired: 'Expired',
    days_hours: '{days} d. {hours} h.',
    hours: '{hours} h.',
    loading_data: 'Loading data...',
    sub_placeholder: 'Paste subscription URL',
    empty_subscription_title: 'Subscription not added',
    empty_subscription_text: 'Paste a subscription URL and click Save URL.',
    working: 'Working...',
    done: 'Done',
    error: 'Error: ',
    manager_disabled: 'Manager disabled',
    auto: 'Auto',
    auto_current: 'Auto: {name}',
    supported_line: 'Supported: {supported} • With ping: {latency} • Unsupported: {unsupported}',
    active: 'Active',
    traffic: 'Traffic',
    expires: 'Expires',
    updated: 'Updated',
    remaining: 'Remaining',
    unlimited: 'Unlimited',
    time_left: 'Time left',
    auto_selected: 'Currently selected: {name}',
    auto_desc: 'Podkop selects the best server through URLTest',
    manual_selected: 'Selected manually',
    active_now: 'Active now',
    selected_by_podkop: 'Currently selected by Podkop',
    disabled: 'Disabled',
    unsupported: 'Unsupported by Podkop',
    maybe_unsupported: 'May be unsupported',
    no_ping: 'Podkop did not return ping',
    unsupported_short: 'unsupported',
    maybe_unsupported_short: 'may be unsupported',
    cannot_read_status: 'Could not read status: ',
    manager_not_interfering: 'Manager is disabled and does not interfere with Podkop',
    saving: 'Saving...',
    url_saved: 'URL saved',
    url_saved_refresh_needed: 'URL saved. Refresh subscription to load new data',
    refreshing_sub: 'Refreshing subscription...',
    sub_updated: 'Subscription updated',
    subscription_parse_failed: 'Subscription update is not complete yet or no supported servers were found',
    saving_schedule: 'Saving update schedule...',
    schedule_saved: 'Update schedule saved',
    enabling_manager: 'Enabling manager...',
    disabling_manager: 'Disabling manager...',
    manager_enabled: 'Manager enabled',
    manager_disabled_done: 'Manager disabled',
    refreshing_ping: 'Refreshing ping...',
    ping_updated: 'Ping updated',
    ping_progress: 'Pings are still updating: {current} / {total}',
    ping_partial: 'Ping updated: {current} / {total}',
    applying_selection: 'Applying selection...',
    saving_selection: 'Saving...',
    selection_applied: 'Selection applied',
    selection_saved: 'Saved',
    status: 'Status',
    status_badge_idle: 'Ready',
    status_badge_working: 'Loading',
    status_badge_success: 'Ready',
    status_badge_error: 'Error',
    status_badge_disabled: 'Off',
    status_ready_title: 'Ready',
    status_ready_text: 'Subscription loaded.',
    status_loading_title: 'Loading data',
    status_loading_text: 'Reading the current state.',
    status_fetching_title: 'Downloading subscription',
    status_fetching_text: 'Receiving data from the provider.',
    status_parsing_title: 'Parsing subscription',
    status_parsing_text: 'Preparing the server list.',
    status_applying_title: 'Sending servers to Podkop',
    status_applying_text: 'Saving supported servers to Podkop.',
    status_best_title: 'Selecting the best server',
    status_best_text: 'Podkop is choosing the best server.',
    status_latency_title: 'Checking ping',
    status_latency_text: 'Podkop is still updating ping values.',
    status_done_title: 'Completed',
    status_done_text: '',
    status_error_title: 'Error',
    status_error_text: 'The last action ended with an error.',
    status_disabled_title: 'Manager disabled',
    status_disabled_text: 'Obhodiq does not interfere with Podkop.',
    status_empty_title: 'Subscription not added',
    status_empty_text: 'Paste a subscription URL and click Save URL.',
    primary: 'Primary',
    enabled_col: 'On',
    server: 'Server',
    type: 'Type',
    ping: 'Ping',
    save_url: 'Save URL',
    refresh_sub_btn: 'Refresh subscription',
    auto_update_sub: 'Subscription auto-update',
    save: 'Save'
  },
  ru: {
    none: 'нет',
    every_30m: 'Каждые 30 минут',
    every_1h: 'Каждый час',
    every_3h: 'Каждые 3 часа',
    every_6h: 'Каждые 6 часов',
    every_12h: 'Каждые 12 часов',
    every_24h: 'Каждые 24 часа',
    never: 'Никогда',
    loading: 'Загрузка...',
    expired: 'Истекло',
    days_hours: '{days} д. {hours} ч.',
    hours: '{hours} ч.',
    loading_data: 'Загрузка данных...',
    sub_placeholder: 'Вставьте ссылку подписки',
    empty_subscription_title: 'Подписка не добавлена',
    empty_subscription_text: 'Вставьте ссылку подписки и нажмите «Сохранить ссылку».',
    working: 'Выполняется...',
    done: 'Готово',
    error: 'Ошибка: ',
    manager_disabled: 'Менеджер выключен',
    auto: 'Авто',
    auto_current: 'Авто: {name}',
    supported_line: 'Поддерживается: {supported} • С пингом: {latency} • Не поддерживается: {unsupported}',
    active: 'Активный',
    traffic: 'Трафик',
    expires: 'Истекает',
    updated: 'Обновлено',
    remaining: 'Остаток',
    unlimited: 'Без лимита',
    time_left: 'Осталось',
    auto_selected: 'Сейчас выбран: {name}',
    auto_desc: 'Podkop сам выбирает лучший сервер через URLTest',
    manual_selected: 'Выбран вручную',
    active_now: 'Активный сейчас',
    selected_by_podkop: 'Сейчас выбран Podkop',
    disabled: 'Отключён',
    unsupported: 'Не поддерживается Podkop',
    maybe_unsupported: 'Может не поддерживаться',
    no_ping: 'Podkop не дал пинг',
    unsupported_short: 'не поддерж.',
    maybe_unsupported_short: 'может не подд.',
    cannot_read_status: 'Не удалось прочитать статус: ',
    manager_not_interfering: 'Менеджер отключён и не вмешивается в Podkop',
    saving: 'Сохраняем...',
    url_saved: 'Ссылка сохранена',
    url_saved_refresh_needed: 'Ссылка сохранена. Обновите подписку, чтобы загрузить новые данные',
    refreshing_sub: 'Обновляем подписку...',
    sub_updated: 'Подписка обновлена',
    subscription_parse_failed: 'Подписка ещё не догрузилась или не найдено поддерживаемых серверов',
    saving_schedule: 'Сохраняем расписание обновления...',
    schedule_saved: 'Расписание обновления сохранено',
    enabling_manager: 'Включаем менеджер...',
    disabling_manager: 'Отключаем менеджер...',
    manager_enabled: 'Менеджер включён',
    manager_disabled_done: 'Менеджер отключён',
    refreshing_ping: 'Обновляем пинг...',
    ping_updated: 'Пинг обновлён',
    ping_progress: 'Пинги ещё обновляются: {current} / {total}',
    ping_partial: 'Пинг обновлён: {current} / {total}',
    applying_selection: 'Применяем выбор...',
    saving_selection: 'Сохраняем...',
    selection_applied: 'Выбор применён',
    selection_saved: 'Сохранено',
    status: 'Статус',
    status_badge_idle: 'Готово',
    status_badge_working: 'Загрузка',
    status_badge_success: 'Готово',
    status_badge_error: 'Ошибка',
    status_badge_disabled: 'Выкл',
    status_ready_title: 'Готово',
    status_ready_text: 'Подписка загружена.',
    status_loading_title: 'Загрузка данных',
    status_loading_text: 'Читаем текущее состояние.',
    status_fetching_title: 'Загружаем подписку',
    status_fetching_text: 'Получаем данные от провайдера.',
    status_parsing_title: 'Разбираем подписку',
    status_parsing_text: 'Готовим список серверов.',
    status_applying_title: 'Отправляем серверы в Podkop',
    status_applying_text: 'Сохраняем серверы в Podkop.',
    status_best_title: 'Выбираем лучший сервер',
    status_best_text: 'Podkop выбирает лучший сервер.',
    status_latency_title: 'Проверяем пинг',
    status_latency_text: 'Podkop ещё обновляет пинги.',
    status_done_title: 'Готово',
    status_done_text: '',
    status_error_title: 'Ошибка',
    status_error_text: 'Последнее действие завершилось с ошибкой.',
    status_disabled_title: 'Менеджер выключен',
    status_disabled_text: 'Obhodiq не вмешивается в работу Podkop.',
    status_empty_title: 'Подписка не добавлена',
    status_empty_text: 'Вставьте ссылку подписки и нажмите «Сохранить ссылку».',
    primary: 'Основной',
    enabled_col: 'Вкл',
    server: 'Сервер',
    type: 'Тип',
    ping: 'Пинг',
    save_url: 'Сохранить ссылку',
    refresh_sub_btn: 'Обновить подписку',
    auto_update_sub: 'Автообновление подписки',
    save: 'Сохранить'
  }
};

function setUiLang(value) {
  UI_LANG = value === 'ru' ? 'ru' : 'en';
}

function t(key, vars) {
  var table = I18N[UI_LANG] || I18N.en;
  var value = table[key] || I18N.en[key] || key;
  Object.keys(vars || {}).forEach(function (name) {
    value = value.replace(new RegExp('\\{' + name + '\\}', 'g'), String(vars[name]));
  });
  return value;
}

function el(tag, attrs, children) {
  var node = E(tag, attrs || {});
  (children || []).forEach(function (child) {
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

function text(value, fallback) {
  return value == null || value === '' ? (fallback || '-') : String(value);
}

function commandUrl(extra) {
  var suffix = extra || '';
  if (suffix && suffix.charAt(0) !== '&') {
    suffix = '&' + suffix;
  }
  return '/cgi-bin/obhodiq?_ts=' + Date.now() + suffix;
}

function encodeBody(params) {
  var body = [];
  Object.keys(params || {}).forEach(function (key) {
    body.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key] == null ? '' : params[key]));
  });
  return body.join('&');
}

function request(url, body) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(body ? 'POST' : 'GET', url, true);
    xhr.setRequestHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    xhr.setRequestHeader('Pragma', 'no-cache');
    if (body) {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText || '');
      } else {
        reject(new Error('HTTP ' + xhr.status + ' ' + (xhr.responseText || '').slice(0, 160)));
      }
    };
    xhr.onerror = function () {
      reject(new Error('Network error'));
    };
    xhr.send(body || null);
  });
}

function requestCommand(cmd, params) {
  var payload = params || {};
  payload.cmd = cmd;
  return request(commandUrl(''), encodeBody(payload));
}

function wait(ms) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, ms);
  });
}

function jsonRequest(url, body) {
  return request(url, body).then(function (t) {
    return JSON.parse(t || '{}');
  });
}

function bytesToHuman(bytes) {
  var value = Number(bytes || 0);
  if (!isFinite(value) || value <= 0) {
    return '0 B';
  }
  var units = ['B', 'KB', 'MB', 'GB', 'TB'];
  var idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx++;
  }
  return value.toFixed(value >= 100 || idx === 0 ? 0 : 1) + ' ' + units[idx];
}

function formatExpire(ts) {
  var n = Number(ts || 0);
  if (!n) {
    return '-';
  }
  var d = new Date(n * 1000);
  return isNaN(d.getTime()) ? String(ts) : d.toLocaleString(UI_LANG === 'ru' ? 'ru-RU' : 'en-US');
}

function formatPing(value) {
  if (value == null || value === '') {
    return t('none');
  }
  var n = Number(value);
  return isFinite(n) ? Math.round(n) + ' ms' : String(value);
}

function scheduleLabel(value) {
  switch (value) {
    case '30m': return t('every_30m');
    case '1h': return t('every_1h');
    case '3h': return t('every_3h');
    case '6h': return t('every_6h');
    case '12h': return t('every_12h');
    case '24h': return t('every_24h');
    case 'never':
    default:
      return t('never');
  }
}

function cleanErrorMessage(message) {
  var value = String(message || '').replace(/\s+/g, ' ').trim();
  var httpMatch;
  var httpCode;
  var httpNames;
  if (!value) {
    return t('status_error_text');
  }

  value = value.replace(/^(Error:\s*)+/i, '');
  value = value.replace(/^Could not read status:\s*/i, '');
  value = value.replace(/^Не удалось прочитать статус:\s*/i, '');

  if (/^HTTP 0$/i.test(value) || /^HTTP 0\b/i.test(value) || /Network error/i.test(value)) {
    return UI_LANG === 'ru'
      ? 'Не удалось получить ответ от ссылки подписки.'
      : 'Could not get a response from the subscription URL.';
  }

  httpMatch = value.match(/(?:HTTP|error:)\s*(\d{3})/i) || value.match(/returned error:\s*(\d{3})/i);
  if (httpMatch) {
    httpCode = String(httpMatch[1]);
    httpNames = {
      '400': UI_LANG === 'ru' ? 'Неверный запрос' : 'Bad Request',
      '401': UI_LANG === 'ru' ? 'Требуется авторизация' : 'Unauthorized',
      '403': UI_LANG === 'ru' ? 'Доступ запрещён' : 'Forbidden',
      '404': UI_LANG === 'ru' ? 'Ссылка не найдена' : 'Not Found',
      '410': UI_LANG === 'ru' ? 'Ссылка больше недоступна' : 'Gone',
      '429': UI_LANG === 'ru' ? 'Слишком много запросов' : 'Too Many Requests',
      '500': UI_LANG === 'ru' ? 'Внутренняя ошибка сервера' : 'Internal Server Error',
      '502': UI_LANG === 'ru' ? 'Сервер провайдера временно недоступен' : 'Provider server is temporarily unavailable',
      '503': UI_LANG === 'ru' ? 'Сервис временно недоступен' : 'Service Unavailable',
      '504': UI_LANG === 'ru' ? 'Сервер провайдера не ответил вовремя' : 'Provider server timed out'
    };
    return UI_LANG === 'ru'
      ? 'Ошибка подписки: сервер вернул ' + httpCode + (httpNames[httpCode] ? ' (' + httpNames[httpCode] + ')' : '')
      : 'Subscription error: server returned ' + httpCode + (httpNames[httpCode] ? ' (' + httpNames[httpCode] + ')' : '');
  }

  if (/Subscription update is not complete yet or no supported servers were found/i.test(value)) {
    return UI_LANG === 'ru'
      ? 'Подписка ещё не успела прогрузиться или не найдено поддерживаемых серверов.'
      : 'The subscription is still loading or no supported servers were found.';
  }

  if (/Подписка ещё не догрузилась или не найдено поддерживаемых серверов/i.test(value)) {
    return 'Подписка ещё не успела прогрузиться или не найдено поддерживаемых серверов.';
  }

  return value;
}

function successStatusTitle(message) {
  var value = String(message || '').trim();
  if (!value) {
    return t('status_done_title');
  }
  return value;
}

function successStatusText(message) {
  var value = String(message || '').trim();

  if (!value) {
    return '';
  }

  if (value === t('url_saved_refresh_needed')) {
    return UI_LANG === 'ru'
      ? 'Теперь нажмите «Обновить подписку».'
      : 'Now click “Refresh subscription”.';
  }

  return '';
}

function isLikelySubscriptionInput(value) {
  var input = String(value || '').trim();
  if (!input) {
    return false;
  }

  return /^(https?:\/\/|happ:\/\/|vless:\/\/|vmess:\/\/|trojan:\/\/|ss:\/\/|socks4:\/\/|socks5:\/\/|hy2:\/\/|hysteria:\/\/|hysteria2:\/\/)/i.test(input);
}

function isEmptySubscriptionState(data) {
  var url = String((data && data.subscription_url) || '').trim();
  return !url && Number((data && data.count) || 0) <= 0 && Number((data && data.supported_count) || 0) <= 0;
}

function buildButton(label, onClick, accent) {
  var background = accent ? '#e3ad3f' : '#1b2433';
  var border = accent ? '#e3ad3f' : '#344157';
  var color = accent ? '#171b22' : '#edf3ff';
  var button = el('button', {
    type: 'button',
    style: [
      'height:42px',
      'padding:0 16px',
      'border-radius:12px',
      'border:1px solid ' + border,
      'background:' + background,
      'color:' + color,
      'font-weight:700',
      'cursor:pointer',
      'transition:transform .08s ease, background .15s ease, border-color .15s ease'
    ].join(';')
  }, [label]);
  button.setAttribute('data-normal-label', label);
  button.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (button.disabled) {
      return;
    }
    return onClick(ev);
  });
  button.addEventListener('mousedown', function (ev) {
    ev.currentTarget.style.transform = 'translateY(2px) scale(.975)';
    ev.currentTarget.style.filter = 'brightness(.9)';
    ev.currentTarget.style.boxShadow = 'inset 0 3px 10px rgba(0,0,0,.28)';
  });
  button.addEventListener('mouseup', function (ev) {
    ev.currentTarget.style.transform = 'translateY(0) scale(1)';
    ev.currentTarget.style.filter = 'none';
    ev.currentTarget.style.boxShadow = 'none';
  });
  button.addEventListener('mouseleave', function (ev) {
    ev.currentTarget.style.transform = 'translateY(0) scale(1)';
    ev.currentTarget.style.filter = 'none';
    ev.currentTarget.style.boxShadow = 'none';
  });
  return button;
}

function setButtonBusy(button, isBusy, busyLabel) {
  if (!button) {
    return;
  }
  button.disabled = !!isBusy;
  button.textContent = isBusy ? (busyLabel || t('loading')) : (button.getAttribute('data-normal-label') || button.textContent);
  button.style.opacity = isBusy ? '.72' : '1';
  button.style.cursor = isBusy ? 'progress' : 'pointer';
  button.style.transform = 'translateY(0) scale(1)';
  button.style.filter = 'none';
  button.style.boxShadow = 'none';
}

function formatRemaining(meta) {
  var expire = Number(meta && meta.expire || 0);
  if (!expire) {
    return '-';
  }
  var diff = expire - Math.floor(Date.now() / 1000);
  if (diff <= 0) {
    return t('expired');
  }
  var days = Math.floor(diff / 86400);
  var hours = Math.floor((diff % 86400) / 3600);
  return days > 0 ? t('days_hours', { days: days, hours: hours }) : t('hours', { hours: hours });
}

function formatUpdated(value) {
  var n = Number(value || 0);
  if (!n) {
    return '-';
  }
  var d = new Date(n * 1000);
  return isNaN(d.getTime()) ? '-' : d.toLocaleString(UI_LANG === 'ru' ? 'ru-RU' : 'en-US');
}

return view.extend({
  render: function () {
    var state = {
      data: null,
      pendingEnabled: {},
      activeId: '',
      selectionMode: 'auto',
      enabled: true,
      updateSchedule: 'never',
      applyTimer: null,
      applyInFlight: false,
      applyRevision: 0,
      passiveLatencyTrackingUntil: 0,
      statusPollTimer: null,
      statusRequestSeq: 0,
      statusAppliedSeq: 0,
      statusSuspend: false,
      subscriptionRefreshLoading: false,
      pendingSavedUrl: '',
      subscriptionRefreshPreviousUpdatedAt: 0,
      latencyRefreshActive: false,
      latencyRefreshStartedAt: 0,
      latencyLastCount: -1,
      latencyStableRounds: 0,
      urlInputDirty: false,
      infoMessage: '',
      infoIsError: false
    };
    var uiVersion = '0.2.0';
    var saveUrlButton;
    var refreshSubButton;
    var refreshPingButton;
    var saveScheduleButton;
    var toggleEnabledButton;
    var scheduleCaption;
    var primaryHeader;
    var enabledHeader;
    var serverHeader;
    var typeHeader;
    var pingHeader;

    var root = el('div', { class: 'cbi-map', style: 'max-width:1260px' });
    var statusBadge;
    var statusTitle;
    var statusText;
    var statusMeta;
    var statusDot;
    var statusPanel = el('div', {
      style: 'display:grid;grid-template-columns:minmax(0,1fr);gap:4px;align-items:flex-start;padding:9px 12px;border-radius:12px;border:1px solid #334056;background:#202838;min-height:54px;box-sizing:border-box;color:#d7e2f5;grid-column:1 / span 10;'
    }, [
      el('div', { style: 'min-width:0;display:grid;grid-template-rows:minmax(20px,auto) minmax(14px,auto) minmax(12px,auto);row-gap:2px;' }, [
        el('div', { style: 'display:flex;align-items:center;gap:8px;min-height:20px;' }, [
          (statusDot = el('span', {
            style: 'width:8px;height:8px;border-radius:999px;background:#6ea0ff;box-shadow:0 0 0 4px rgba(110,160,255,.12);flex:none;'
          })),
          (statusTitle = el('strong', { style: 'font-size:13px;line-height:1.2;color:#f4f7ff;min-width:0;flex:1 1 auto;' }, [t('status_loading_title')])),
          (statusBadge = el('span', {
            style: 'display:inline-flex;align-items:center;justify-content:center;height:20px;min-width:62px;padding:0 8px;border-radius:999px;border:1px solid #334056;background:#202838;color:#9eb0cc;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;visibility:hidden;'
          }, [t('loading')]))
        ]),
        (statusText = el('div', { style: 'color:#9fb0cb;font-size:11px;line-height:1.25;min-height:14px;padding-left:16px;' }, [t('status_loading_text')])),
        (statusMeta = el('div', { style: 'color:#7f93b1;font-size:10px;line-height:1.2;min-height:12px;visibility:hidden;padding-left:16px;' }))
      ])
    ]);
    var tableBody = el('tbody');
    var subUrlInput = el('input', {
      type: 'text',
      placeholder: t('sub_placeholder'),
      style: 'width:100%;height:46px;padding:0 14px;border-radius:12px;border:1px solid #334056;background:#111722;color:#eef4ff;margin-bottom:12px;'
    });
    subUrlInput.addEventListener('input', function () {
      state.urlInputDirty = true;
    });

    function shouldPreserveUrlInput(nextUrl) {
      var currentInput = (subUrlInput.value || '').trim();
      var normalizedNextUrl = normalizeUrl(nextUrl);
      var normalizedInput = normalizeUrl(currentInput);

      if (!state.urlInputDirty) {
        return false;
      }

      if (!normalizedInput) {
        return false;
      }

      return normalizedInput !== normalizedNextUrl;
    }
    var scheduleSelect = el('select', {
      style: 'width:180px;min-width:180px;height:42px;padding:0 12px;border-radius:12px;border:1px solid #334056;background:#111722;color:#eef4ff;'
    }, [
      el('option', { value: 'never' }, [t('never')]),
      el('option', { value: '30m' }, [t('every_30m')]),
      el('option', { value: '1h' }, [t('every_1h')]),
      el('option', { value: '3h' }, [t('every_3h')]),
      el('option', { value: '6h' }, [t('every_6h')]),
      el('option', { value: '12h' }, [t('every_12h')]),
      el('option', { value: '24h' }, [t('every_24h')])
    ]);
    var subscriptionMeta = el('div', {
      style: 'display:grid;gap:8px;margin-bottom:18px;min-height:0;align-content:start;'
    });

    function renderStatusPanel(data) {
      var view = getRuntimeStatusView(data);
      var metaValue = String(view.meta || '');
      var toneStyles = {
        loading: {
          border: '#2f3b4e',
          background: '#202838',
          dot: '#6ea0ff',
          glow: 'rgba(110,160,255,.12)',
          badgeBg: '#223149',
          badgeBorder: '#3a5478',
          badgeColor: '#bed1f3',
          text: '#b6c7e2'
        },
        success: {
          border: '#2f3b4e',
          background: '#202838',
          dot: '#57d394',
          glow: 'rgba(87,211,148,.12)',
          badgeBg: '#233129',
          badgeBorder: '#355344',
          badgeColor: '#bdeecf',
          text: '#b6d8c2'
        },
        error: {
          border: '#2f3b4e',
          background: '#202838',
          dot: '#ff7f93',
          glow: 'rgba(255,127,147,.12)',
          badgeBg: '#3a2530',
          badgeBorder: '#69404e',
          badgeColor: '#ffc1cc',
          text: '#f0b7c1'
        },
        muted: {
          border: '#2f3b4e',
          background: '#202838',
          dot: '#8e98a9',
          glow: 'rgba(142,152,169,.12)',
          badgeBg: '#232937',
          badgeBorder: '#424a57',
          badgeColor: '#c7cfdb',
          text: '#a9b4c8'
        },
        info: {
          border: '#2f3b4e',
          background: '#202838',
          dot: '#6ea0ff',
          glow: 'rgba(110,160,255,.12)',
          badgeBg: '#202838',
          badgeBorder: '#334056',
          badgeColor: '#9eb0cc',
          text: '#9fb0cb'
        }
      };
      var tone = toneStyles[view.tone] || toneStyles.info;

      statusPanel.style.borderColor = tone.border;
      statusPanel.style.background = tone.background;
      statusDot.style.background = tone.dot;
      statusDot.style.boxShadow = '0 0 0 6px ' + tone.glow;
      statusTitle.textContent = view.title;
      statusText.textContent = view.text;
      statusText.style.color = tone.text;
      statusText.style.visibility = view.text ? 'visible' : 'hidden';
      statusBadge.textContent = view.badge;
      statusBadge.style.background = tone.badgeBg;
      statusBadge.style.borderColor = tone.badgeBorder;
      statusBadge.style.color = tone.badgeColor;
      statusBadge.style.visibility = view.badge && String(view.badge).trim().toLowerCase() !== String(view.title || '').trim().toLowerCase()
        ? 'visible'
        : 'hidden';
      if (
        metaValue === t('ping_updated') ||
        metaValue === t('sub_updated') ||
        metaValue === t('selection_applied') ||
        metaValue === t('selection_saved') ||
        metaValue === t('schedule_saved') ||
        metaValue === t('url_saved') ||
        metaValue === t('url_saved_refresh_needed')
      ) {
        metaValue = '';
      }
      statusMeta.textContent = metaValue;
      statusMeta.style.visibility = metaValue ? 'visible' : 'hidden';
    }

    function setInfo(message, isError) {
      state.infoMessage = message || '';
      state.infoIsError = !!isError;
      renderStatusPanel(state.data);
    }

    function getRuntimeStatusView(data) {
      var runtime = (data && data.runtime_status) || {};
      var tone = 'info';
      var badge = t('status_badge_idle');
      var title = t('status_ready_title');
      var textValue = t('status_ready_text');
      var meta = '';

      if (!state.enabled) {
        return {
          tone: 'muted',
          badge: t('status_badge_disabled'),
          title: t('status_disabled_title'),
          text: t('status_disabled_text'),
          meta: ''
        };
      }

      if (data && isEmptySubscriptionState(data)) {
        return {
          tone: 'muted',
          badge: t('status_badge_idle'),
          title: t('status_empty_title'),
          text: t('status_empty_text'),
          meta: ''
        };
      }

      if (state.subscriptionRefreshLoading && !data) {
        return {
          tone: 'loading',
          badge: t('status_badge_working'),
          title: t('status_loading_title'),
          text: t('status_loading_text'),
          meta: ''
        };
      }

      if (state.infoIsError && state.infoMessage) {
        return {
          tone: 'error',
          badge: t('status_badge_error'),
          title: t('status_error_title'),
          text: cleanErrorMessage(state.infoMessage),
          meta: ''
        };
      }

      if (state.subscriptionRefreshLoading) {
        tone = 'loading';
        badge = t('status_badge_working');
      }

      if (runtime && runtime.busy) {
        tone = runtime.level === 'error' ? 'error' : 'loading';
        badge = runtime.level === 'error' ? t('status_badge_error') : t('status_badge_working');
        switch (String(runtime.phase || '')) {
          case 'fetching':
            title = t('status_fetching_title');
            textValue = t('status_fetching_text');
            break;
          case 'parsing':
            title = t('status_parsing_title');
            textValue = t('status_parsing_text');
            break;
          case 'applying':
            title = t('status_applying_title');
            textValue = t('status_applying_text');
            break;
          case 'selecting-best':
            title = t('status_best_title');
            textValue = t('status_best_text');
            break;
          case 'latency':
            title = t('status_latency_title');
            textValue = t('status_latency_text');
            break;
          default:
            title = t('status_loading_title');
            textValue = t('status_loading_text');
            break;
        }
        if (runtime.total) {
          meta = t('ping_progress', {
            current: String(runtime.current || 0),
            total: String(runtime.total || 0)
          });
        } else if (state.infoMessage && !state.infoIsError) {
          meta = state.infoMessage;
        }
      } else if (state.latencyRefreshActive || Number(state.passiveLatencyTrackingUntil || 0) > Date.now()) {
        tone = 'loading';
        badge = t('status_badge_working');
        title = t('status_latency_title');
        textValue = t('status_latency_text');
        meta = formatLatencyProgressMessage(data || state.data || {}, false);
      } else if (state.infoMessage && !state.infoIsError) {
        if (state.infoMessage === t('sub_updated') || state.infoMessage === t('ping_updated') || state.infoMessage === t('selection_applied') || state.infoMessage === t('selection_saved') || state.infoMessage === t('schedule_saved') || state.infoMessage === t('url_saved') || state.infoMessage === t('url_saved_refresh_needed')) {
          tone = 'success';
          badge = t('status_badge_success');
          title = successStatusTitle(state.infoMessage);
          textValue = successStatusText(state.infoMessage);
          meta = '';
        } else {
          textValue = state.infoMessage;
          meta = '';
        }
      }

      if (data && data.subscription_error && data.subscription_error.message && Number(data.count || 0) <= 0 && !runtime.busy) {
        tone = 'error';
        badge = t('status_badge_error');
        title = t('status_error_title');
        textValue = cleanErrorMessage(data.subscription_error.message);
        meta = '';
      }

      return {
        tone: tone,
        badge: badge,
        title: title,
        text: textValue,
        meta: meta
      };
    }

    function relabelButton(button, label) {
      if (!button) {
        return;
      }
      button.setAttribute('data-normal-label', label);
      if (!button.disabled) {
        button.textContent = label;
      }
    }

    function updateStaticTexts() {
      subUrlInput.placeholder = t('sub_placeholder');
      relabelButton(saveUrlButton, t('save_url'));
      relabelButton(refreshSubButton, t('refresh_sub_btn'));
      relabelButton(saveScheduleButton, t('save'));
      if (scheduleCaption) {
        scheduleCaption.textContent = t('auto_update_sub');
      }
      if (primaryHeader) {
        primaryHeader.textContent = t('primary');
      }
      if (enabledHeader) {
        enabledHeader.textContent = t('enabled_col');
      }
      if (serverHeader) {
        serverHeader.textContent = t('server');
      }
      if (typeHeader) {
        typeHeader.textContent = t('type');
      }
      if (pingHeader) {
        pingHeader.textContent = t('ping');
      }
      renderStatusPanel();
    }

    function buildParams(params) {
      var extra = '';
      Object.keys(params || {}).forEach(function (key) {
        extra += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(params[key] == null ? '' : params[key]);
      });
      return extra;
    }

    function clearLatenciesView() {
      if (!state.data) {
        return;
      }
      state.data = Object.assign({}, state.data, {
        servers: (state.data.servers || []).map(function (srv) {
          return Object.assign({}, srv, { latency: null });
        })
      });
      renderSummary(state.data);
      renderTable(state.data);
    }

    function clearSubscriptionView() {
      if (!state.data) {
        return;
      }
      state.subscriptionRefreshLoading = true;
      state.data = Object.assign({}, state.data, {
        active_server_id: '',
        count: 0,
        supported_count: 0,
        unsupported_count: 0,
        latency_count: 0,
        meta: {
          profile_title: '',
          upload: 0,
          download: 0,
          total: 0,
          expire: 0,
          remaining: 0,
          updated_at: 0
        },
        subscription_error: {},
        servers: [],
        live: {
          main_out_now: '',
          urltest_now: '',
          resolved_active_id: '',
          proxies: {}
        }
      });
      state.pendingEnabled = {};
      state.activeId = '';
      renderSummary(state.data);
      renderTable(state.data);
    }

    function clearSavedSubscriptionView(nextUrl) {
      state.subscriptionRefreshLoading = false;
      state.data = Object.assign({}, state.data || {}, {
        subscription_url: nextUrl || '',
        active_server_id: '',
        configured_active_server_id: '',
        count: 0,
        supported_count: 0,
        unsupported_count: 0,
        latency_count: 0,
        selection_mode: 'auto',
        configured_selection_mode: 'auto',
        subscription_error: {},
        selected: {},
        meta: {
          profile_title: '',
          upload: 0,
          download: 0,
          total: 0,
          expire: 0,
          remaining: 0,
          updated_at: 0,
          notices: [],
          announce: ''
        },
        servers: [],
        live: {
          main_out_now: '',
          urltest_now: '',
          resolved_active_id: '',
          proxies: {}
        },
        exported: {},
        podkop: {},
        podkop_apply: {}
      });
      state.pendingEnabled = {};
      state.activeId = '';
      state.selectionMode = 'auto';
      renderSummary(state.data);
      renderTable(state.data);
    }

    function normalizeUrl(value) {
      return ((value || '') + '').trim();
    }

    function scheduleApplySelection() {
      if (!state.enabled) {
        return;
      }
      state.applyRevision++;
      if (state.applyTimer) {
        window.clearTimeout(state.applyTimer);
      }
      state.applyTimer = window.setTimeout(function () {
        state.applyTimer = null;
        if (state.applyInFlight) {
          scheduleApplySelection();
          return;
        }
        var revisionAtStart = state.applyRevision;
        state.applyInFlight = true;
        persistSelection(true, revisionAtStart).finally(function () {
          state.applyInFlight = false;
          if (revisionAtStart !== state.applyRevision) {
            scheduleApplySelection();
          }
        });
      }, 650);
    }

    function runAction(cmd, params, successText) {
      setInfo(t('working'), false);
      return requestCommand(cmd, params)
        .then(function () {
          setInfo(successText || t('done'), false);
          return refresh();
        })
        .catch(function (e) {
          setInfo(t('error') + String(e), true);
        });
    }

    function findServerById(serverId) {
      var servers = (state.data && state.data.servers) || [];
      return servers.find(function (srv) { return srv.id === serverId; }) || null;
    }

    function getResolvedServer() {
      if (!state.data || !state.data.live) {
        return null;
      }
      var server = findServerById(state.data.live.resolved_active_id);
      if (!server) {
        return null;
      }
      if (server.excluded || server.unsupported || server.runtime_tag == null) {
        return null;
      }
      return server;
    }

    function getActiveCardText() {
      if (!state.enabled) {
        return t('manager_disabled');
      }
      var liveServer = getResolvedServer();
      if (!state.data || !state.data.live || !state.data.live.main_out_now) {
        return '-';
      }
      if (!liveServer) {
        return '-';
      }
      return (state.data && state.data.live && state.data.live.main_out_now === 'main-urltest-out')
        ? t('auto_current', { name: liveServer.name })
        : liveServer.name;
    }

    function ellipsisText(value) {
      var full = String(value || '-');
      return el('div', {
        title: full,
        style: 'font-size:12px;font-weight:700;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;'
      }, [full]);
    }

    function renderSummary(data) {
      var meta = data.meta || {};
      var emptySubscription = isEmptySubscriptionState(data);
      var notices = Array.isArray(meta.notices) ? meta.notices.filter(function (item) {
        return !!item;
      }) : [];
      var summaryMessages = [];
      var seenSummaryMessages = {};
      var announceText = String(meta.announce || '').trim();
      var announceParts = announceText
        ? announceText.split(/\n+/).map(function (item) { return String(item || '').trim(); }).filter(Boolean)
        : [];

      function pushSummaryMessage(message) {
        var text = String(message || '').trim();
        if (!text || seenSummaryMessages[text]) {
          return;
        }
        seenSummaryMessages[text] = true;
        summaryMessages.push(text);
      }

      if (announceText) {
        pushSummaryMessage(announceText);
      }

      notices.forEach(function (item) {
        var text = String(item || '').trim();
        if (!text) {
          return;
        }
        if (announceText && (announceText.indexOf(text) >= 0 || announceParts.indexOf(text) >= 0)) {
          return;
        }
        pushSummaryMessage(text);
      });
      setUiLang(data.lang || 'en');
      updateStaticTexts();
      scheduleSelect.innerHTML = '';
      ['never', '30m', '1h', '3h', '6h', '12h', '24h'].forEach(function (value) {
        scheduleSelect.appendChild(el('option', { value: value }, [scheduleLabel(value)]));
      });
      scheduleSelect.value = data.update_schedule || state.updateSchedule || 'never';
      subscriptionMeta.innerHTML = '';
      subscriptionMeta.appendChild(el('div', {
        style: 'display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin-bottom:2px;'
      }, [
        el('div', {
          title: state.subscriptionRefreshLoading ? t('loading_data') : (emptySubscription ? t('empty_subscription_title') : text(meta.profile_title || '-', '-')),
          style: 'display:inline-flex;align-items:center;min-height:34px;max-width:min(100%,420px);padding:0 14px;border-radius:14px;border:1px solid #31425d;background:#202838;color:#f4f7ff;font-size:16px;font-weight:700;box-shadow:inset 0 1px 0 rgba(255,255,255,.03);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
        }, [state.subscriptionRefreshLoading ? t('loading_data') : (emptySubscription ? t('empty_subscription_title') : text(meta.profile_title || '-', '-'))]),
        el('div', {
          style: 'min-height:18px;font-size:12px;color:#8fa2c0;display:flex;align-items:center;'
        }, [
          state.subscriptionRefreshLoading
            ? t('loading_data')
            : t('supported_line', {
                supported: String(data.supported_count || 0),
                latency: String(data.latency_count || 0),
                unsupported: String(data.unsupported_count || 0)
              })
        ])
      ]));
      if (summaryMessages.length) {
        subscriptionMeta.appendChild(el('div', {
          style: 'padding:10px 12px;border-radius:12px;background:rgba(227,173,63,.12);border:1px solid rgba(227,173,63,.35);color:#ffe3a3;font-size:13px;line-height:1.45;'
        }, [summaryMessages.join(' | ')]));
      } else if (emptySubscription) {
        subscriptionMeta.appendChild(el('div', {
          style: 'padding:10px 12px;border-radius:12px;background:rgba(143,162,192,.08);border:1px solid rgba(143,162,192,.22);color:#b8c6dc;font-size:13px;line-height:1.45;'
        }, [t('empty_subscription_text')]));
      }
      var summaryGrid = el('div', {
        style: 'display:grid;gap:8px;align-items:stretch;'
      });
      var summaryTopRow = el('div', {
        style: 'display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;align-items:stretch;'
      }, [
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('active')]),
          ellipsisText(getActiveCardText())
        ]),
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('traffic')]),
          ellipsisText(bytesToHuman(meta.used || 0))
        ]),
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('expires')]),
          ellipsisText(formatExpire(meta.expire))
        ]),
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('updated')]),
          ellipsisText(formatUpdated(data.updated_at || meta.updated_at || 0))
        ]),
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('remaining')]),
          ellipsisText(Number(meta.total || 0) > 0 ? bytesToHuman(meta.remaining || 0) : t('unlimited'))
        ])
      ]);
      var summaryBottomRow = el('div', {
        style: 'display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;align-items:stretch;'
      });
      statusPanel.style.gridColumn = '1 / span 4';
      summaryBottomRow.appendChild(statusPanel);
      summaryBottomRow.appendChild(el('div', { style: 'grid-column:span 1;min-height:54px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
        el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('time_left')]),
        el('div', {
          title: formatRemaining(meta),
          style: 'font-size:12px;font-weight:700;line-height:1.25;color:#ffd36b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;'
        }, [formatRemaining(meta)])
      ]));
      summaryGrid.appendChild(summaryTopRow);
      summaryGrid.appendChild(summaryBottomRow);
      subscriptionMeta.appendChild(summaryGrid);
      renderStatusPanel(data);
    }

    function compactIconButton(label, onClick) {
      var button = buildButton(label, onClick);
      button.style.width = '30px';
      button.style.minWidth = '30px';
      button.style.height = '30px';
      button.style.padding = '0';
      button.style.borderRadius = '8px';
      button.style.fontSize = '14px';
      button.style.lineHeight = '1';
      return button;
    }

    function updateEnabledButton() {
      if (!toggleEnabledButton) {
        return;
      }
      toggleEnabledButton.textContent = '⏻';
      toggleEnabledButton.style.width = '42px';
      toggleEnabledButton.style.minWidth = '42px';
      toggleEnabledButton.style.padding = '0';
      toggleEnabledButton.style.background = state.enabled ? '#1f3b2c' : '#3a2323';
      toggleEnabledButton.style.borderColor = state.enabled ? '#2f6d4a' : '#7b3a3a';
      toggleEnabledButton.style.color = state.enabled ? '#8ff0b0' : '#ffb0b0';
    }

    function radioInput(name, checked, onChange) {
      var input = el('input', {
        type: 'radio',
        name: name,
        checked: checked ? 'checked' : null,
        style: 'width:18px;height:18px;cursor:pointer;accent-color:#e3ad3f;'
      });
      input.addEventListener('change', onChange);
      return input;
    }

    function checkboxInput(checked, onChange) {
      var input = el('input', {
        type: 'checkbox',
        checked: checked ? 'checked' : null,
        style: 'width:18px;height:18px;cursor:pointer;accent-color:#e3ad3f;'
      });
      input.addEventListener('change', onChange);
      return input;
    }

    function renderTable(data) {
      var liveServer = getResolvedServer();
      tableBody.innerHTML = '';

      if (state.subscriptionRefreshLoading) {
        var loadingRow = el('tr', {});
        loadingRow.appendChild(el('td', {
          colspan: '5',
          style: 'padding:20px 14px;color:#9fb0cb;font-size:14px;'
        }, [t('loading_data')]));
        tableBody.appendChild(loadingRow);
        return;
      }

      var autoRow = el('tr', {
        style: state.selectionMode === 'auto' ? 'background:rgba(227,173,63,.10);' : ''
      });
      autoRow.appendChild(el('td', { style: 'padding:14px 10px;text-align:center;width:88px;' }, [
        radioInput('main-choice', state.selectionMode === 'auto', function () {
          state.selectionMode = 'auto';
          renderSummary(state.data || data);
          renderTable(state.data || data);
          scheduleApplySelection();
        })
      ]));
      autoRow.appendChild(el('td', { style: 'padding:14px 10px;text-align:center;width:70px;color:#7f8ea8;' }, ['-']));
      autoRow.appendChild(el('td', { style: 'padding:14px 10px;' }, [
        el('div', { style: 'font-weight:700;color:#f4f7ff;' }, [t('auto')]),
        el('div', { style: 'margin-top:4px;font-size:12px;color:#9babc6;' }, [
          liveServer ? t('auto_selected', { name: liveServer.name }) : t('auto_desc')
        ])
      ]));
      autoRow.appendChild(el('td', { style: 'padding:14px 10px;color:#cfd8e9;font-size:12px;' }, ['URLTEST']));
      autoRow.appendChild(el('td', {
        style: 'padding:14px 10px;font-weight:700;color:#7effc2;width:120px;'
      }, [liveServer ? formatPing(liveServer.latency) : t('none')]));
      tableBody.appendChild(autoRow);

      (data.servers || []).forEach(function (srv) {
        var enabled = state.pendingEnabled[srv.id] !== false;
        var isUnsupported = !!srv.unsupported;
        var isManualSelected = state.selectionMode === 'manual' && state.activeId === srv.id;
        var isLiveSelected = liveServer && liveServer.id === srv.id;
        var isMaybeUnsupported = !!srv.maybe_unsupported;
        var subtitle = [];

        if (isManualSelected) {
          subtitle.push(t('manual_selected'));
        }
        if (isLiveSelected) {
          subtitle.push(state.selectionMode === 'auto' ? t('selected_by_podkop') : t('active_now'));
        }
        if (!enabled) {
          subtitle.push(t('disabled'));
        }
        if (isUnsupported) {
          subtitle.push(srv.unsupported_reason || t('unsupported'));
        } else if (!enabled && isMaybeUnsupported) {
          subtitle.push(srv.maybe_unsupported_reason || t('maybe_unsupported'));
        } else if (enabled && srv.latency == null) {
          subtitle.push(t('no_ping'));
        }

        var tr = el('tr', {
          style: (enabled ? '' : 'opacity:.45;') + (isManualSelected ? 'background:rgba(227,173,63,.08);' : '')
        });

        tr.appendChild(el('td', { style: 'padding:14px 10px;text-align:center;width:88px;' }, [
          radioInput('main-choice', isManualSelected, function () {
            if (isUnsupported) {
              return;
            }
            state.selectionMode = 'manual';
            state.activeId = srv.id;
            renderSummary(state.data || data);
            renderTable(state.data || data);
            scheduleApplySelection();
          })
        ]));

        tr.appendChild(el('td', { style: 'padding:14px 10px;text-align:center;width:70px;' }, [
          checkboxInput(enabled, function (ev) {
            if (isUnsupported) {
              ev.currentTarget.checked = false;
              state.pendingEnabled[srv.id] = false;
              renderTable(state.data || data);
              return;
            }
            state.pendingEnabled[srv.id] = !!ev.currentTarget.checked;
            renderTable(state.data || data);
            scheduleApplySelection();
          })
        ]));

        tr.appendChild(el('td', { style: 'padding:14px 10px;' }, [
          el('div', { style: 'font-weight:700;color:#f4f7ff;' }, [text(srv.name)]),
          subtitle.length ? el('div', { style: 'margin-top:4px;font-size:12px;color:' + (!enabled ? '#95a2b8' : '#9fb0cb') + ';' }, [subtitle.join(' • ')]) : document.createTextNode('')
        ]));

        tr.appendChild(el('td', {
          style: 'padding:14px 10px;color:#d5dcef;font-size:12px;letter-spacing:.02em;'
        }, [text(srv.type_label || srv.scheme)]));

        tr.appendChild(el('td', {
          style: 'padding:14px 10px;font-weight:700;color:' + (isUnsupported ? '#ff9191' : ((!enabled && isMaybeUnsupported) ? '#f2c56a' : (srv.latency != null ? '#7effc2' : '#90a2bf'))) + ';width:120px;'
        }, [isUnsupported ? t('unsupported_short') : ((!enabled && isMaybeUnsupported) ? t('maybe_unsupported_short') : formatPing(srv.latency))]));

        tableBody.appendChild(tr);
      });
    }

    function refresh() {
      var requestSeq = ++state.statusRequestSeq;
      return jsonRequest(commandUrl('&cmd=status'))
        .then(function (data) {
          var refreshReady = true;
          var pendingUrl = normalizeUrl(state.pendingSavedUrl);
          var statusUrl = normalizeUrl(data && data.subscription_url);
          var parsedUrl = normalizeUrl(data && data.parsed_source_url);
          var matchesPendingUrl = !pendingUrl || statusUrl === pendingUrl || parsedUrl === pendingUrl;

          if (requestSeq < state.statusAppliedSeq) {
            return;
          }
          state.statusAppliedSeq = requestSeq;
          setUiLang(data.lang || 'en');
          updateStaticTexts();
          if (state.subscriptionRefreshLoading) {
            var currentUpdatedAt = getStatusUpdatedAt(data);
            var errorUpdatedAt = getSubscriptionErrorUpdatedAt(data);
            var parsedMatchesCurrent = hasMatchingParsedSource(data, pendingUrl || statusUrl);
            var readyWithServers = !!(
              data &&
              Number(data.count || 0) > 0 &&
              parsedMatchesCurrent &&
              isApplyReady(data, state.subscriptionRefreshPreviousUpdatedAt)
            );
            var hasFreshError = !!(
              data &&
              data.subscription_error &&
              data.subscription_error.message &&
              errorUpdatedAt >= state.subscriptionRefreshPreviousUpdatedAt
            );
            refreshReady = readyWithServers || hasFreshError || (
              currentUpdatedAt >= state.subscriptionRefreshPreviousUpdatedAt &&
              parsedMatchesCurrent &&
              isApplyReady(data, state.subscriptionRefreshPreviousUpdatedAt)
            );
          }

          if (!state.subscriptionRefreshLoading && pendingUrl && matchesPendingUrl) {
            state.pendingSavedUrl = '';
            pendingUrl = '';
          }

          if (state.subscriptionRefreshLoading && !refreshReady && !matchesPendingUrl) {
            subUrlInput.value = pendingUrl || subUrlInput.value || '';
            setInfo(t('refreshing_sub'), false);
            return;
          }

          state.subscriptionRefreshLoading = state.subscriptionRefreshLoading && !refreshReady;
          state.data = normalizeDataForDisplay(data);
          if (matchesPendingUrl) {
            state.pendingSavedUrl = '';
          } else if (pendingUrl) {
            state.data.subscription_url = pendingUrl;
          }
          state.selectionMode = state.data.configured_selection_mode || state.data.selection_mode || 'auto';
          var currentPendingEnabled = Object.assign({}, state.pendingEnabled);
          state.pendingEnabled = {};
          (state.data.servers || []).forEach(function (srv) {
            if ((state.applyInFlight || state.applyTimer) && Object.prototype.hasOwnProperty.call(currentPendingEnabled, srv.id)) {
              state.pendingEnabled[srv.id] = currentPendingEnabled[srv.id];
            } else {
              state.pendingEnabled[srv.id] = !srv.excluded && !srv.unsupported;
            }
          });
          state.activeId = state.data.configured_active_server_id || state.data.active_server_id || ((state.data.servers && state.data.servers[0] && state.data.servers[0].id) || '');
          state.enabled = state.data.enabled !== false;
          state.updateSchedule = state.data.update_schedule || 'never';
          if (!shouldPreserveUrlInput(state.data.subscription_url)) {
            subUrlInput.value = state.data.subscription_url || '';
            state.urlInputDirty = false;
          }
          scheduleSelect.value = state.updateSchedule;
          updateEnabledButton();
          if (!refreshReady) {
            setInfo(t('refreshing_sub'), false);
            return;
          }
          renderSummary(state.data);
          renderTable(state.data);
          if (state.data.subscription_error && state.data.subscription_error.message && Number(state.data.count || 0) <= 0) {
            setInfo(state.data.subscription_error.message, true);
          } else if (state.latencyRefreshActive) {
            setInfo(formatLatencyProgressMessage(state.data, false), false);
          } else if (isPassiveLatencyTrackingActive(state.data)) {
            setInfo(formatLatencyProgressMessage(state.data, false), false);
          } else {
            setInfo(state.enabled ? '' : t('manager_not_interfering'), false);
          }
        })
        .catch(function (e) {
          setInfo(t('cannot_read_status') + String(e), true);
        });
    }

    function getExpectedLatencyCount(data) {
      return Math.max(0, Number((data && (data.enabled_count || data.supported_count)) || 0));
    }

    function getCurrentLatencyCount(data) {
      return Math.max(0, Number(data && data.latency_count || 0));
    }

    function stopLatencyProgress() {
      state.latencyRefreshActive = false;
      state.latencyRefreshStartedAt = 0;
      state.latencyLastCount = -1;
      state.latencyStableRounds = 0;
    }

    function isPassiveLatencyTrackingActive(data) {
      if (!state.passiveLatencyTrackingUntil || Date.now() > state.passiveLatencyTrackingUntil) {
        state.passiveLatencyTrackingUntil = 0;
        return false;
      }
      return getExpectedLatencyCount(data) > 0 && getCurrentLatencyCount(data) < getExpectedLatencyCount(data);
    }

    function formatLatencyProgressMessage(data, finished) {
      var total = getExpectedLatencyCount(data);
      var current = getCurrentLatencyCount(data);
      if (!total) {
        return finished ? t('ping_updated') : t('refreshing_ping');
      }
      return finished
        ? t('ping_partial', { current: current, total: total })
        : t('ping_progress', { current: current, total: total });
    }

    function startLatencyProgressTracking() {
      state.latencyRefreshActive = true;
      state.latencyRefreshStartedAt = Date.now();
      state.latencyLastCount = -1;
      state.latencyStableRounds = 0;

      return refresh()
        .then(function () {
          if (!state.latencyRefreshActive) {
            return;
          }

          var total = getExpectedLatencyCount(state.data);
          var current = getCurrentLatencyCount(state.data);
          state.latencyLastCount = current;

          if (total > 0 && current >= total) {
            stopLatencyProgress();
            state.passiveLatencyTrackingUntil = 0;
            setInfo(t('ping_updated'), false);
            return;
          }

          setInfo(formatLatencyProgressMessage(state.data, false), false);
          return pollLatencyProgress();
        });
    }

    function queueLatencyRefresh() {
      state.passiveLatencyTrackingUntil = Date.now() + 300000;
      return wait(350)
        .then(function () {
          return requestCommand('refresh-latency-bg', {});
        })
        .then(function () {
          return startLatencyProgressTracking();
        })
        .catch(function () {
          return refresh().then(function () {
            if (isPassiveLatencyTrackingActive(state.data)) {
              setInfo(formatLatencyProgressMessage(state.data, false), false);
            }
          }).catch(function () {});
        });
    }

    function pollLatencyProgress() {
      if (!state.latencyRefreshActive) {
        return Promise.resolve();
      }

      return wait(2500)
        .then(function () {
          return refresh();
        })
        .then(function () {
          if (!state.latencyRefreshActive) {
            return;
          }

          var current = getCurrentLatencyCount(state.data);
          var total = getExpectedLatencyCount(state.data);
          var timedOut = (Date.now() - state.latencyRefreshStartedAt) >= 300000;

          if (current > state.latencyLastCount) {
            state.latencyStableRounds = 0;
          } else {
            state.latencyStableRounds++;
          }
          state.latencyLastCount = current;

          if (total > 0 && current >= total) {
            stopLatencyProgress();
            state.passiveLatencyTrackingUntil = 0;
            setInfo(t('ping_updated'), false);
            return;
          }

          if (timedOut || state.latencyStableRounds >= 3) {
            stopLatencyProgress();
            state.passiveLatencyTrackingUntil = 0;
            setInfo(formatLatencyProgressMessage(state.data, true), false);
            return;
          }

          setInfo(formatLatencyProgressMessage(state.data, false), false);
          return pollLatencyProgress();
        });
    }

    function scheduleStatusPoll() {
      if (state.statusPollTimer) {
        window.clearTimeout(state.statusPollTimer);
      }
      state.statusPollTimer = window.setTimeout(function () {
        state.statusPollTimer = null;
        if (state.statusSuspend || state.applyInFlight || state.applyTimer) {
          scheduleStatusPoll();
          return;
        }
        refresh().finally(function () {
          scheduleStatusPoll();
        });
      }, 15000);
    }

    function getStatusUpdatedAt(data) {
      if (!data) {
        return 0;
      }
      return Math.max(
        0,
        Number(data.updated_at || 0),
        Number((data.meta && data.meta.updated_at) || 0)
      );
    }

    function getSubscriptionErrorUpdatedAt(data) {
      if (!data || !data.subscription_error) {
        return 0;
      }

      return Math.max(0, Number(data.subscription_error.updated_at || 0));
    }

    function getApplyUpdatedAt(data) {
      if (!data || !data.podkop_apply) {
        return 0;
      }

      return Math.max(0, Number(data.podkop_apply.updated_at || 0));
    }

    function isApplyReady(data, watermark) {
      if (!data || data.enabled === false) {
        return true;
      }

      return getApplyUpdatedAt(data) >= watermark;
    }

    function hasMatchingParsedSource(data, requestedUrl) {
      var currentRequested = ((requestedUrl == null ? '' : requestedUrl) + '').trim();
      var configuredUrl = (((data && data.subscription_url) || '') + '').trim();
      var parsedUrl = (((data && data.parsed_source_url) || '') + '').trim();
      var targetUrl = currentRequested || configuredUrl;

      if (!targetUrl) {
        return !parsedUrl;
      }

      return !!parsedUrl && parsedUrl === targetUrl;
    }

    function normalizeDataForDisplay(data) {
      if (!data) {
        return data;
      }

      if (hasMatchingParsedSource(data, '')) {
        return data;
      }

      return Object.assign({}, data, {
        active_server_id: '',
        configured_active_server_id: '',
        count: 0,
        supported_count: 0,
        unsupported_count: 0,
        enabled_count: 0,
        latency_count: 0,
        servers: [],
        live: {
          main_out_now: '',
          urltest_now: '',
          resolved_active_id: '',
          proxies: {}
        },
        selected: {},
        podkop: Object.assign({}, data.podkop || {}, { enabled_servers: [] }),
        podkop_apply: {}
      });
    }

    function waitForSubscriptionRefresh(previousUpdatedAt, attemptsLeft) {
      if (attemptsLeft <= 0) {
        return Promise.resolve(false);
      }

      return wait(2500)
        .then(function () {
          return refresh();
        })
        .then(function () {
          var currentUpdatedAt = getStatusUpdatedAt(state.data);
          var errorUpdatedAt = getSubscriptionErrorUpdatedAt(state.data);
          var hasFreshError = !!(
            state.data &&
            state.data.subscription_error &&
            state.data.subscription_error.message &&
            errorUpdatedAt >= previousUpdatedAt
          );
          var parsedMatches = hasMatchingParsedSource(state.data, state.pendingSavedUrl || (state.data && state.data.subscription_url) || '');
          var readyWithServers = !!(
            state.data &&
            Number(state.data.count || 0) > 0 &&
            parsedMatches &&
            isApplyReady(state.data, previousUpdatedAt)
          );

          if (readyWithServers || (currentUpdatedAt >= previousUpdatedAt && parsedMatches && isApplyReady(state.data, previousUpdatedAt)) || hasFreshError) {
            return true;
          }

          return waitForSubscriptionRefresh(previousUpdatedAt, attemptsLeft - 1);
        })
        .catch(function () {
          return waitForSubscriptionRefresh(previousUpdatedAt, attemptsLeft - 1);
        });
    }

    function isSelectionApplied(mode, activeId, data) {
      var live = (data && data.live) || {};
      var enabledCount = Number((data && data.enabled_count) || 0);

      if (enabledCount <= 0) {
        return true;
      }

      if (mode === 'auto') {
        return data &&
          data.selection_mode === 'auto' &&
          live.main_out_now === 'main-urltest-out' &&
          !!live.urltest_now;
      }

      return data &&
        data.selection_mode === 'manual' &&
        data.active_server_id === activeId &&
        live.resolved_active_id === activeId;
    }

    function waitForSelectionApply(mode, activeId, attemptsLeft) {
      if (attemptsLeft <= 0) {
        return Promise.resolve(false);
      }

      return wait(2000)
        .then(function () {
          return refresh();
        })
        .then(function () {
          if (isSelectionApplied(mode, activeId, state.data)) {
            return true;
          }

          return waitForSelectionApply(mode, activeId, attemptsLeft - 1);
        })
        .catch(function () {
          return waitForSelectionApply(mode, activeId, attemptsLeft - 1);
        });
    }

    function saveUrl() {
      var inputUrl = (subUrlInput.value || '').trim();
      var currentUrl = (((state.data && state.data.subscription_url) || '') + '').trim();
      var urlChanged = !!inputUrl && inputUrl !== currentUrl;

      setButtonBusy(saveUrlButton, true, t('saving'));
      return requestCommand('set-url', { url: subUrlInput.value || '' })
        .then(function () {
          state.pendingSavedUrl = inputUrl;
          if (!state.data) {
            state.data = {};
          }
          state.data.subscription_url = inputUrl;
          subUrlInput.value = inputUrl;
          state.urlInputDirty = false;

          if (urlChanged) {
            setInfo(t('url_saved_refresh_needed'), false);
            return;
          }

          setInfo(t('url_saved'), false);
        })
        .catch(function (e) {
          setInfo(t('error') + String(e), true);
        })
        .finally(function () {
          setButtonBusy(saveUrlButton, false);
        });
    }

    function ensureCurrentUrlSaved() {
      var inputUrl = (subUrlInput.value || '').trim();
      var statusUrl = (((state.data && state.data.subscription_url) || '') + '').trim();

      if (!inputUrl) {
        return Promise.resolve();
      }

      if (inputUrl === statusUrl) {
        return Promise.resolve();
      }

      return requestCommand('set-url', { url: inputUrl }).then(function () {
        state.pendingSavedUrl = inputUrl;
        if (!state.data) {
          state.data = {};
        }
        state.data.subscription_url = inputUrl;
        subUrlInput.value = inputUrl;
        state.urlInputDirty = false;
      });
    }

    function refreshSubscription() {
      var previousUpdatedAt = getStatusUpdatedAt(state.data);
      var refreshStartedAt = Math.floor(Date.now() / 1000);
      var refreshWatermark = Math.max(previousUpdatedAt, refreshStartedAt);
      var requestedUrl = (subUrlInput.value || '').trim();

      stopLatencyProgress();
      state.statusSuspend = true;
      state.passiveLatencyTrackingUntil = Date.now() + 90000;
      state.subscriptionRefreshPreviousUpdatedAt = refreshWatermark;
      state.pendingSavedUrl = requestedUrl;
      setButtonBusy(refreshSubButton, true, t('refreshing_sub'));
      setInfo(t('refreshing_sub'), false);
      return ensureCurrentUrlSaved()
        .then(function () {
          clearSubscriptionView();
          return requestCommand('refresh-apply-bg', {});
        })
        .then(function () {
          return waitForSubscriptionRefresh(refreshWatermark, 20);
        })
        .then(function (recovered) {
          if (!recovered) {
            return refresh().then(function () {
              var hasServers = !!(state.data && Number(state.data.count || 0) > 0);
              var sameUrl = !requestedUrl || (((state.data && state.data.subscription_url) || '') + '').trim() === requestedUrl;
              var parsedMatches = hasMatchingParsedSource(state.data, requestedUrl);

              if (sameUrl && hasServers && parsedMatches) {
                state.subscriptionRefreshLoading = false;
                if (state.data) {
                  renderSummary(state.data);
                  renderTable(state.data);
                }
                setInfo(t('sub_updated'), false);
                queueLatencyRefresh().catch(function () {});
                return;
              }

              throw new Error(t('subscription_parse_failed'));
            });
          }

          return refresh();
        })
        .then(function () {
          state.subscriptionRefreshLoading = false;
          if (requestedUrl) {
            state.pendingSavedUrl = '';
          }
          if (state.data) {
            renderSummary(state.data);
            renderTable(state.data);
          }
          if (
            state.data &&
            state.data.subscription_error &&
            state.data.subscription_error.message &&
            Number(state.data.count || 0) <= 0
          ) {
            throw new Error(state.data.subscription_error.message);
          }
          setInfo(t('sub_updated'), false);
          queueLatencyRefresh().catch(function () {});
        })
        .catch(function (e) {
          state.subscriptionRefreshLoading = false;
          if (requestedUrl && hasMatchingParsedSource(state.data, requestedUrl)) {
            state.pendingSavedUrl = '';
          }
          if (state.data) {
            renderSummary(state.data);
            renderTable(state.data);
          }
          setInfo(t('error') + String(e), true);
        })
        .finally(function () {
          state.statusSuspend = false;
          setButtonBusy(refreshSubButton, false);
        });
    }

    function saveSchedule() {
      setButtonBusy(saveScheduleButton, true, t('saving'));
      setInfo(t('saving_schedule'), false);
      return requestCommand('set-update-schedule', { schedule: scheduleSelect.value || 'never' })
        .then(function () {
          state.updateSchedule = scheduleSelect.value || 'never';
          if (state.data) {
            renderSummary(state.data);
          }
          return refresh();
        })
        .then(function () {
          setInfo(t('schedule_saved'), false);
        })
        .catch(function (e) {
          setInfo(t('error') + String(e), true);
        })
        .finally(function () {
          setButtonBusy(saveScheduleButton, false);
        });
    }

    function toggleManagerEnabled() {
      var nextEnabled = state.enabled ? '0' : '1';
      setButtonBusy(toggleEnabledButton, true, '...');
      setInfo(nextEnabled === '1' ? t('enabling_manager') : t('disabling_manager'), false);
      return requestCommand('set-enabled', { enabled: nextEnabled })
        .then(function () {
          state.enabled = nextEnabled === '1';
          updateEnabledButton();
          return refresh();
        })
        .then(function () {
          setInfo(state.enabled ? t('manager_enabled') : t('manager_disabled_done'), false);
        })
        .catch(function (e) {
          setInfo(t('error') + String(e), true);
        })
        .finally(function () {
          setButtonBusy(toggleEnabledButton, false);
          updateEnabledButton();
        });
    }

    function refreshLatency() {
      stopLatencyProgress();
      setButtonBusy(refreshPingButton, true, '↻');
      setInfo(t('refreshing_ping'), false);
      clearLatenciesView();
      return queueLatencyRefresh()
        .catch(function (e) {
          stopLatencyProgress();
          setInfo(t('error') + String(e), true);
        })
        .finally(function () {
          stopLatencyProgress();
          setButtonBusy(refreshPingButton, false);
        });
    }

    function persistSelection(applyAfter, revisionAtStart) {
      var data = state.data || {};
      var servers = data.servers || [];
      var snapshotEnabled = {};
      var changed = [];
      var chain = Promise.resolve();
      var snapshotSelectionMode = state.selectionMode;
      var snapshotActiveId = state.activeId;

      setInfo(applyAfter ? t('applying_selection') : t('saving_selection'), false);

      servers.forEach(function (srv) {
        snapshotEnabled[srv.id] = state.pendingEnabled[srv.id] !== false;
      });

      servers.forEach(function (srv) {
        var shouldEnable = snapshotEnabled[srv.id];
        var isEnabled = !srv.excluded;
        if (shouldEnable === isEnabled) {
          return;
        }
        changed.push({
          id: srv.id,
          shouldEnable: shouldEnable
        });
      });

      if (changed.length) {
        var disabledIds = Object.keys(snapshotEnabled).filter(function (id) {
          return snapshotEnabled[id] === false;
        });
        chain = requestCommand('set-disabled-ids', {
          disabled_ids: disabledIds.join(',')
        });
      }

      chain = chain.then(function () {
        return requestCommand('set-mode', { mode: snapshotSelectionMode });
      });

      if (snapshotSelectionMode === 'manual' && snapshotActiveId) {
        chain = chain.then(function () {
          return requestCommand('set-active', { id: snapshotActiveId });
        });
      }

      if (applyAfter) {
        chain = chain.then(function () {
          return requestCommand('apply-podkop', {});
        });
      }

      return chain.then(function () {
        if (revisionAtStart != null && revisionAtStart !== state.applyRevision) {
          return;
        }
        return waitForSelectionApply(snapshotSelectionMode, snapshotActiveId, 12).then(function () {
          return refresh();
        }).then(function () {
          setInfo(applyAfter ? t('selection_applied') : t('selection_saved'), false);
          if (applyAfter) {
            queueLatencyRefresh().catch(function () {});
          }
        });
      }).catch(function (e) {
        setInfo(t('error') + String(e), true);
      });
    }

    var table = el('table', {
      class: 'table',
      style: 'width:100%;border-collapse:separate;border-spacing:0;background:#171d28;border:1px solid #2d3749;border-radius:18px;overflow:hidden;'
    }, [
      el('thead', {}, [
        el('tr', { style: 'background:#121823;' }, [
          el('th', { style: 'padding:12px 10px;color:#8ea0bf;width:88px;' }, [
            (primaryHeader = el('span', {}, [t('primary')]))
          ]),
          el('th', { style: 'padding:12px 10px;color:#8ea0bf;width:70px;' }, [
            (enabledHeader = el('span', {}, [t('enabled_col')]))
          ]),
          el('th', { style: 'padding:12px 10px;color:#8ea0bf;text-align:left;' }, [
            (serverHeader = el('span', {}, [t('server')]))
          ]),
          el('th', { style: 'padding:12px 10px;color:#8ea0bf;text-align:left;' }, [
            (typeHeader = el('span', {}, [t('type')]))
          ]),
          el('th', { style: 'padding:12px 10px;color:#8ea0bf;text-align:left;width:120px;' }, [
            el('div', { style: 'display:flex;align-items:center;gap:8px;' }, [
              (pingHeader = el('span', {}, [t('ping')])),
              (refreshPingButton = compactIconButton('↻', refreshLatency))
            ])
          ])
        ])
      ]),
      tableBody
    ]);

    root.appendChild(el('style', {}, [
      '.cbi-page-actions{display:none!important;}',
      '.cbi-tabmenu,.cbi-tab-descr{display:none!important;}',
      '.cbi-map button{transition:transform .08s ease,filter .08s ease,box-shadow .08s ease!important;}',
      '.cbi-map button:active{transform:translateY(2px) scale(.975)!important;filter:brightness(.9)!important;box-shadow:inset 0 3px 10px rgba(0,0,0,.28)!important;}',
      '.cbi-map button:hover{filter:none!important;}'
    ]));

    var contentCard = el('div', {
      style: 'background:linear-gradient(180deg,#1c2432 0%,#171d28 100%);border:1px solid #2d3749;border-radius:18px;padding:22px 24px 20px;margin-bottom:16px;'
    }, [
      el('div', {
        style: 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;'
      }, [
        el('div', {
          style: 'display:inline-flex;align-items:center;min-height:38px;padding:0 16px;border-radius:14px;border:1px solid #31425d;background:linear-gradient(180deg,#233047 0%,#1e293b 100%);color:#f4f7ff;font-size:20px;font-weight:800;letter-spacing:.01em;box-shadow:inset 0 1px 0 rgba(255,255,255,.03);min-width:0;'
        }, ['Obhodiq']),
        el('div', {
          style: 'display:flex;align-items:flex-start;gap:10px;flex:none;'
        }, [
          el('div', {
            style: 'display:inline-flex;align-items:center;justify-content:center;height:32px;padding:0 10px;border-radius:10px;border:1px solid #2f3b4e;background:#202838;color:#8fa2c0;font-size:11px;font-weight:700;letter-spacing:.04em;'
          }, ['v' + uiVersion]),
          (toggleEnabledButton = buildButton('⏻', toggleManagerEnabled))
        ]),
      ]),
      subscriptionMeta,
      subUrlInput,
      el('div', { style: 'display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px;' }, [
        (saveUrlButton = buildButton(t('save_url'), saveUrl, true)),
        (refreshSubButton = buildButton(t('refresh_sub_btn'), refreshSubscription)),
        el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-left:auto;' }, [
          (scheduleCaption = el('span', { style: 'font-size:13px;color:#91a2bf;' }, [t('auto_update_sub')])),
          scheduleSelect,
          el('div', { style: 'min-width:96px;' }, [
            (saveScheduleButton = buildButton(t('save'), saveSchedule))
          ])
        ])
      ]),
      table
    ]);
    root.appendChild(contentCard);
    refresh().finally(function () {
      scheduleStatusPoll();
    });
    return root;
  }
});
