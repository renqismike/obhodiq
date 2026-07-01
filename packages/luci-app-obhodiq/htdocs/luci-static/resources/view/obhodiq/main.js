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
    no_ping: 'Podkop did not return ping',
    unsupported_short: 'unsupported',
    cannot_read_status: 'Could not read status: ',
    manager_not_interfering: 'Manager is disabled and does not interfere with Podkop',
    saving: 'Saving...',
    url_saved: 'URL saved',
    refreshing_sub: 'Refreshing subscription...',
    sub_updated: 'Subscription updated',
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
    no_ping: 'Podkop не дал пинг',
    unsupported_short: 'не поддерж.',
    cannot_read_status: 'Не удалось прочитать статус: ',
    manager_not_interfering: 'Менеджер отключён и не вмешивается в Podkop',
    saving: 'Сохраняем...',
    url_saved: 'Ссылка сохранена',
    refreshing_sub: 'Обновляем подписку...',
    sub_updated: 'Подписка обновлена',
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
      statusPollTimer: null,
      statusRequestSeq: 0,
      statusAppliedSeq: 0,
      statusSuspend: false,
      latencyRefreshActive: false,
      latencyRefreshStartedAt: 0,
      latencyLastCount: -1,
      latencyStableRounds: 0
    };
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
    var infoBar = el('div', {
      style: 'min-height:20px;margin:10px 0 14px;color:#95a6c5;font-size:13px;'
    }, [t('loading_data')]);
    var tableBody = el('tbody');
    var subUrlInput = el('input', {
      type: 'text',
      placeholder: t('sub_placeholder'),
      style: 'width:100%;height:46px;padding:0 14px;border-radius:12px;border:1px solid #334056;background:#111722;color:#eef4ff;margin-bottom:12px;'
    });
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

    function setInfo(message, isError) {
      infoBar.style.color = isError ? '#ff9191' : '#95a6c5';
      infoBar.textContent = message || '';
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
      state.data = Object.assign({}, state.data, {
        active_server_id: '',
        count: 0,
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
      return findServerById(state.data.live.resolved_active_id);
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
        return state.data && state.data.live && state.data.live.main_out_now === 'main-urltest-out' ? t('auto') : '-';
      }
      return (state.data && state.data.live && state.data.live.main_out_now === 'main-urltest-out')
        ? t('auto_current', { name: liveServer.name })
        : liveServer.name;
    }

    function renderSummary(data) {
      var meta = data.meta || {};
      var notices = Array.isArray(meta.notices) ? meta.notices.filter(function (item) {
        return !!item;
      }) : [];
      var summaryMessages = notices.slice();
      if (meta.announce) {
        summaryMessages.unshift(meta.announce);
      }
      setUiLang(data.lang || 'en');
      updateStaticTexts();
      scheduleSelect.innerHTML = '';
      ['never', '30m', '1h', '3h', '6h', '12h', '24h'].forEach(function (value) {
        scheduleSelect.appendChild(el('option', { value: value }, [scheduleLabel(value)]));
      });
      scheduleSelect.value = data.update_schedule || state.updateSchedule || 'never';
      subscriptionMeta.innerHTML = '';
      subscriptionMeta.appendChild(el('div', {
        style: 'font-size:16px;font-weight:700;color:#f4f7ff;min-height:26px;display:flex;align-items:center;'
      }, [text(meta.profile_title || '-', '-')]));
      subscriptionMeta.appendChild(el('div', {
        style: 'min-height:18px;font-size:12px;color:#8fa2c0;display:flex;align-items:center;'
      }, [
        t('supported_line', {
          supported: String(data.supported_count || 0),
          latency: String(data.latency_count || 0),
          unsupported: String(data.unsupported_count || 0)
        })
      ]));
      if (summaryMessages.length) {
        subscriptionMeta.appendChild(el('div', {
          style: 'padding:10px 12px;border-radius:12px;background:rgba(227,173,63,.12);border:1px solid rgba(227,173,63,.35);color:#ffe3a3;font-size:13px;line-height:1.45;'
        }, [summaryMessages.join(' | ')]));
      }
      subscriptionMeta.appendChild(el('div', {
        style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;'
      }, [
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('active')]),
          el('div', { style: 'font-size:14px;font-weight:700;' }, [getActiveCardText()])
        ]),
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('traffic')]),
          el('div', { style: 'font-size:14px;font-weight:700;' }, [bytesToHuman(meta.used || 0)])
        ]),
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('expires')]),
          el('div', { style: 'font-size:14px;font-weight:700;' }, [formatExpire(meta.expire)])
        ]),
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('updated')]),
          el('div', { style: 'font-size:14px;font-weight:700;' }, [formatUpdated(data.updated_at || meta.updated_at || 0)])
        ]),
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('remaining')]),
          el('div', { style: 'font-size:14px;font-weight:700;' }, [Number(meta.total || 0) > 0 ? bytesToHuman(meta.remaining || 0) : t('unlimited')])
        ]),
        el('div', { style: 'min-height:44px;padding:10px 12px;border-radius:12px;background:#202838;border:1px solid #2f3b4e;color:#d7e2f5;' }, [
          el('div', { style: 'font-size:11px;color:#91a2bf;text-transform:uppercase;margin-bottom:4px;' }, [t('time_left')]),
          el('div', { style: 'font-size:14px;font-weight:700;color:#ffd36b;' }, [formatRemaining(meta)])
        ])
      ]));
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
          style: 'padding:14px 10px;font-weight:700;color:' + (isUnsupported ? '#ff9191' : (srv.latency != null ? '#7effc2' : '#90a2bf')) + ';width:120px;'
        }, [isUnsupported ? t('unsupported_short') : formatPing(srv.latency)]));

        tableBody.appendChild(tr);
      });
    }

    function refresh() {
      var requestSeq = ++state.statusRequestSeq;
      return jsonRequest(commandUrl('&cmd=status'))
        .then(function (data) {
          if (requestSeq < state.statusAppliedSeq) {
            return;
          }
          state.statusAppliedSeq = requestSeq;
          setUiLang(data.lang || 'en');
          updateStaticTexts();
          state.data = data;
          state.selectionMode = data.configured_selection_mode || data.selection_mode || 'auto';
          state.pendingEnabled = {};
          (data.servers || []).forEach(function (srv) {
          state.pendingEnabled[srv.id] = !srv.excluded && !srv.unsupported;
        });
          state.activeId = data.configured_active_server_id || data.active_server_id || ((data.servers && data.servers[0] && data.servers[0].id) || '');
          state.enabled = data.enabled !== false;
          state.updateSchedule = data.update_schedule || 'never';
          subUrlInput.value = data.subscription_url || '';
          scheduleSelect.value = state.updateSchedule;
          updateEnabledButton();
          renderSummary(data);
          renderTable(data);
          if (data.subscription_error && data.subscription_error.message) {
            setInfo(data.subscription_error.message, true);
          } else if (data.meta && Array.isArray(data.meta.notices) && data.meta.notices.length) {
            setInfo(data.meta.notices[0], false);
          } else if (data.meta && data.meta.announce) {
            setInfo(data.meta.announce, false);
          } else {
            setInfo(state.enabled ? '' : t('manager_not_interfering'), false);
          }
        })
        .catch(function (e) {
          setInfo(t('cannot_read_status') + String(e), true);
        });
    }

    function getExpectedLatencyCount(data) {
      return Math.max(0, Number(data && data.enabled_count || 0));
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
          var timedOut = (Date.now() - state.latencyRefreshStartedAt) >= 75000;

          if (current > state.latencyLastCount) {
            state.latencyStableRounds = 0;
          } else {
            state.latencyStableRounds++;
          }
          state.latencyLastCount = current;

          if (total > 0 && current >= total) {
            stopLatencyProgress();
            setInfo(t('ping_updated'), false);
            return;
          }

          if (timedOut || state.latencyStableRounds >= 3) {
            stopLatencyProgress();
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

    function saveUrl() {
      setButtonBusy(saveUrlButton, true, t('saving'));
      return runAction('set-url', { url: subUrlInput.value || '' }, t('url_saved'))
        .finally(function () {
          setButtonBusy(saveUrlButton, false);
        });
    }

    function refreshSubscription() {
      state.statusSuspend = true;
      setButtonBusy(refreshSubButton, true, t('refreshing_sub'));
      setInfo(t('refreshing_sub'), false);
      clearSubscriptionView();
      return requestCommand('refresh-apply', {})
        .then(function () {
          return wait(1800);
        })
        .then(function () {
          return refresh();
        })
        .then(function () {
          if (!state.data || !state.data.subscription_error || !state.data.subscription_error.message) {
            setInfo(t('sub_updated'), false);
          }
        })
        .catch(function (e) {
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
      return wait(350)
        .then(function () {
          return requestCommand('refresh-latency', {});
        })
        .then(function () {
          state.latencyRefreshActive = true;
          state.latencyRefreshStartedAt = Date.now();
          state.latencyLastCount = -1;
          state.latencyStableRounds = 0;
          return refresh();
        })
        .then(function () {
          if (!state.latencyRefreshActive) {
            return;
          }

          var total = getExpectedLatencyCount(state.data);
          var current = getCurrentLatencyCount(state.data);
          state.latencyLastCount = current;

          if (total > 0 && current >= total) {
            stopLatencyProgress();
            setInfo(t('ping_updated'), false);
            return;
          }

          setInfo(formatLatencyProgressMessage(state.data, false), false);
          return pollLatencyProgress();
        })
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
        chain = Promise.all(changed.map(function (change) {
          return requestCommand(change.shouldEnable ? 'include' : 'exclude', { id: change.id });
        }));
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
        }).then(function () {
          return wait(1600);
        });
      }

      return chain.then(function () {
        if (revisionAtStart != null && revisionAtStart !== state.applyRevision) {
          return;
        }
        return refresh().then(function () {
          setInfo(applyAfter ? t('selection_applied') : t('selection_saved'), false);
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

    root.appendChild(el('div', {
      style: 'background:linear-gradient(180deg,#1c2432 0%,#171d28 100%);border:1px solid #2d3749;border-radius:18px;padding:22px 24px 20px;margin-bottom:16px;'
    }, [
      el('div', {
        style: 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;'
      }, [
        el('div', {
          style: 'font-size:20px;font-weight:800;color:#f4f7ff;'
        }, ['Obhodiq']),
        (toggleEnabledButton = buildButton('⏻', toggleManagerEnabled))
      ]),
      subscriptionMeta,
      subUrlInput,
      el('div', { style: 'display:flex;gap:10px;flex-wrap:wrap;align-items:center;' }, [
        (saveUrlButton = buildButton(t('save_url'), saveUrl, true)),
        (refreshSubButton = buildButton(t('refresh_sub_btn'), refreshSubscription)),
        el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-left:auto;' }, [
          (scheduleCaption = el('span', { style: 'font-size:13px;color:#91a2bf;' }, [t('auto_update_sub')])),
          scheduleSelect,
          el('div', { style: 'min-width:96px;' }, [
            (saveScheduleButton = buildButton(t('save'), saveSchedule))
          ])
        ])
      ])
    ]));

    root.appendChild(infoBar);

    root.appendChild(table);
    refresh().finally(function () {
      scheduleStatusPoll();
    });
    return root;
  }
});
