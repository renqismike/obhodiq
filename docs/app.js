(function () {
  function resolveApiBase() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var override = (params.get('api') || '').trim();
      if (override) {
        return override.replace(/\/$/, '');
      }
    } catch (error) {
      // Ignore URLSearchParams issues and continue with host-based fallback.
    }

    var host = (window.location && window.location.hostname) || '';
    if (host === 'demo-api.invalid' || host === '127.0.0.1') {
      return (window.location.origin || '').replace(/\/$/, '') + '/obhodiq-api';
    }

    return 'https://demo-api.invalid/obhodiq-api';
  }

  var API_BASE = resolveApiBase();

  var state = {
    raw: null,
    enabledMap: Object.create(null),
    primaryMode: 'auto',
    primaryId: '',
    busy: false
  };

  var form = document.getElementById('parse-form');
  var input = document.getElementById('subscription-url');
  var parseButton = document.getElementById('parse-button');
  var clearButton = document.getElementById('clear-button');
  var copyAllButton = document.getElementById('copy-all-button');
  var statusBar = document.getElementById('status-bar');
  var summaryLine = document.getElementById('summary-line');
  var noticeBox = document.getElementById('notice-box');
  var serversBody = document.getElementById('servers-body');
  var previewList = document.getElementById('preview-list');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var tabContents = Array.prototype.slice.call(document.querySelectorAll('.tab-content'));

  var metaProfile = document.getElementById('meta-profile');
  var metaTraffic = document.getElementById('meta-traffic');
  var metaExpire = document.getElementById('meta-expire');
  var metaUpdated = document.getElementById('meta-updated');
  var metaRemaining = document.getElementById('meta-remaining');
  var metaTimeLeft = document.getElementById('meta-time-left');

  function setBusy(isBusy, label) {
    state.busy = !!isBusy;
    parseButton.disabled = !!isBusy;
    parseButton.textContent = isBusy ? (label || 'Разбираем...') : 'Разобрать подписку';
  }

  function setStatus(message, isError) {
    statusBar.textContent = message || '';
    statusBar.classList.toggle('is-error', !!isError);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeDisplayName(value) {
    return String(value == null ? '' : value)
      .replace(/([\u{1F1E6}-\u{1F1FF}]{2})/gu, ' $1 ')
      .replace(/([🟢🔃🚀🌐🐢])/gu, ' $1 ')
      .replace(/\s+/g, ' ')
      .trim();
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

  function formatDate(ts) {
    var n = Number(ts || 0);
    if (!n) {
      return '-';
    }

    var date = new Date(n * 1000);
    if (isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleString('ru-RU');
  }

  function formatTimeLeft(expireTs) {
    var expire = Number(expireTs || 0);
    if (!expire) {
      return '-';
    }

    var now = Math.floor(Date.now() / 1000);
    var diff = expire - now;

    if (diff <= 0) {
      return 'Истекло';
    }

    var days = Math.floor(diff / 86400);
    var hours = Math.floor((diff % 86400) / 3600);
    return days > 0 ? days + ' д. ' + hours + ' ч.' : hours + ' ч.';
  }

  function normalizeRawResponse(payload) {
    if (!payload || !payload.status) {
      return null;
    }

    return payload.status;
  }

  function getServers() {
    return state.raw && Array.isArray(state.raw.servers) ? state.raw.servers.slice() : [];
  }

  function getVisibleServers() {
    return getServers().map(function (server) {
      var enabled = state.enabledMap[server.id];
      if (enabled == null) {
        enabled = server.excluded !== true;
      }

      return Object.assign({}, server, {
        enabled: !!enabled
      });
    });
  }

  function getPreviewServers() {
    return getVisibleServers().filter(function (server) {
      return server.enabled && server.unsupported !== true;
    });
  }

  function buildStatusText(server) {
    if (server.unsupported === true) {
      return '<span class="status-pill is-unsupported">' + escapeHtml(server.unsupported_reason || 'Не поддерживается') + '</span>';
    }

    if (server.maybe_unsupported === true) {
      return '<span class="status-pill is-maybe">' + escapeHtml(server.maybe_unsupported_reason || 'Может не поддерживаться') + '</span>';
    }

    return '<span class="status-pill">Поддерживается</span>';
  }

  function renderMeta() {
    var meta = (state.raw && state.raw.meta) || {};
    var profile = meta.profile_title || '-';
    var used = Number(meta.used || ((Number(meta.upload || 0) + Number(meta.download || 0)) || 0));
    var remaining = meta.remaining;

    metaProfile.textContent = profile;
    metaTraffic.textContent = bytesToHuman(used);
    metaExpire.textContent = formatDate(meta.expire);
    metaUpdated.textContent = formatDate(meta.updated_at);
    metaRemaining.textContent = (remaining == null || remaining === '' || Number(remaining) === 0) ? 'Без лимита' : bytesToHuman(remaining);
    metaTimeLeft.textContent = formatTimeLeft(meta.expire);
  }

  function renderSummary() {
    var visible = getVisibleServers();
    var supported = visible.filter(function (server) { return server.unsupported !== true; }).length;
    var unsupported = visible.filter(function (server) { return server.unsupported === true; }).length;
    var previewCount = getPreviewServers().length;

    summaryLine.textContent = 'Поддерживается: ' + supported + ' • Ссылок для Podkop: ' + previewCount + ' • Не поддерживается: ' + unsupported;
  }

  function renderNotice() {
    var meta = (state.raw && state.raw.meta) || {};
    var error = (state.raw && state.raw.subscription_error && state.raw.subscription_error.message) || '';
    var notices = Array.isArray(meta.notices) ? meta.notices.filter(Boolean) : [];
    var announce = meta.announce || '';
    var chunks = [];

    if (announce) {
      chunks.push(announce);
    }

    notices.forEach(function (notice) {
      if (chunks.indexOf(notice) === -1) {
        chunks.push(notice);
      }
    });

    if (error && chunks.indexOf(error) === -1) {
      chunks.push(error);
    }

    if (!chunks.length) {
      noticeBox.classList.add('is-hidden');
      noticeBox.textContent = '';
      return;
    }

    noticeBox.classList.remove('is-hidden');
    noticeBox.innerHTML = chunks.map(escapeHtml).join('<br>');
  }

  function renderServers() {
    var servers = getVisibleServers();

    if (!servers.length) {
      serversBody.innerHTML = '<tr><td colspan="5" class="empty-row">После успешного парсинга здесь появится список серверов.</td></tr>';
      return;
    }

    var autoChecked = state.primaryMode === 'auto' ? ' checked' : '';
    var autoRow = [
      '<tr>',
      '<td class="radio-wrap"><input class="server-radio" type="radio" name="primary-mode" value="auto"' + autoChecked + '></td>',
      '<td class="toggle-wrap">-</td>',
      '<td><div class="server-main">Авто</div><div class="server-sub">Локальный предпросмотр URLTest-группы</div></td>',
      '<td>URLTEST</td>',
      '<td><span class="status-pill">Превью</span></td>',
      '</tr>'
    ].join('');

    var rows = servers.map(function (server) {
      var checked = state.enabledMap[server.id];
      if (checked == null) {
        checked = server.excluded !== true;
      }

      var primaryChecked = state.primaryMode === 'manual' && state.primaryId === server.id ? ' checked' : '';
      var enabledChecked = checked ? ' checked' : '';
      var secondary = [];

      if (server.unsupported === true) {
        secondary.push(server.unsupported_reason || 'Не поддерживается');
      } else if (server.maybe_unsupported === true) {
        secondary.push('По умолчанию выключен');
      } else if (!checked) {
        secondary.push('Выключен в превью');
      } else {
        secondary.push('Будет показан в Podkop Preview');
      }

      return [
        '<tr>',
        '<td class="radio-wrap"><input class="server-radio" data-server-radio="' + escapeHtml(server.id) + '" type="radio" name="primary-mode" value="' + escapeHtml(server.id) + '"' + primaryChecked + (server.unsupported ? ' disabled' : '') + '></td>',
        '<td class="toggle-wrap"><input class="server-toggle" data-server-toggle="' + escapeHtml(server.id) + '" type="checkbox"' + enabledChecked + (server.unsupported ? ' disabled' : '') + '></td>',
        '<td><div class="server-main">' + escapeHtml(normalizeDisplayName(server.name)) + '</div><div class="server-sub">' + escapeHtml(secondary.join(' • ')) + '</div></td>',
        '<td>' + escapeHtml(server.type_label || '-') + '</td>',
        '<td>' + buildStatusText(server) + '</td>',
        '</tr>'
      ].join('');
    });

    serversBody.innerHTML = autoRow + rows.join('');
  }

  function renderPreview() {
    var previewServers = getPreviewServers();

    if (!previewServers.length) {
      previewList.innerHTML = '<div class="preview-empty">Нет серверов для предпросмотра.</div>';
      return;
    }

    previewList.innerHTML = previewServers.map(function (server) {
      var flags = [];
      if (state.primaryMode === 'manual' && state.primaryId === server.id) {
        flags.push('Выбран вручную');
      }
      if (server.maybe_unsupported === true) {
        flags.push('WS по умолчанию выключен');
      }

      return [
        '<article class="preview-item">',
        '<div class="preview-item-head">',
        '<div>',
        '<div class="preview-item-name">' + escapeHtml(normalizeDisplayName(server.name)) + '</div>',
        '<div class="preview-item-type">' + escapeHtml(flags.join(' • ') || (server.type_label || '-')) + '</div>',
        '</div>',
        '<button class="btn btn-secondary btn-small" type="button" data-copy-link="' + escapeHtml(server.id) + '">Копировать</button>',
        '</div>',
        '<pre class="preview-link">' + escapeHtml(server.url || server.link || '') + '</pre>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderAll() {
    renderMeta();
    renderSummary();
    renderNotice();
    renderServers();
    renderPreview();
  }

  function resetState() {
    state.raw = null;
    state.enabledMap = Object.create(null);
    state.primaryMode = 'auto';
    state.primaryId = '';

    metaProfile.textContent = '-';
    metaTraffic.textContent = '0 B';
    metaExpire.textContent = '-';
    metaUpdated.textContent = '-';
    metaRemaining.textContent = 'Без лимита';
    metaTimeLeft.textContent = '-';
    summaryLine.textContent = 'Поддерживается: 0 • Ссылок для Podkop: 0 • Не поддерживается: 0';
    noticeBox.classList.add('is-hidden');
    noticeBox.textContent = '';
    serversBody.innerHTML = '<tr><td colspan="5" class="empty-row">Здесь появятся серверы после разбора подписки.</td></tr>';
    previewList.innerHTML = '<div class="preview-empty">Пока нечего показывать.</div>';
  }

  function applyParsedState(status) {
    state.raw = status;
    state.enabledMap = Object.create(null);
    state.primaryMode = 'auto';
    state.primaryId = '';

    getServers().forEach(function (server) {
      state.enabledMap[server.id] = server.excluded !== true;
    });

    renderAll();
  }

  function parseSubscription(url) {
    return fetch(API_BASE.replace(/\/$/, '') + '/api/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url })
    }).then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (payload) {
        if (!response.ok) {
          throw new Error((payload && payload.error) || ('HTTP ' + response.status));
        }
        return payload;
      });
    });
  }

  function copyText(value, successText) {
    if (!value) {
      setStatus('Нечего копировать.', true);
      return;
    }

    navigator.clipboard.writeText(value).then(function () {
      setStatus(successText, false);
    }).catch(function () {
      setStatus('Не удалось скопировать.', true);
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (state.busy) {
      return;
    }

    var url = (input.value || '').trim();
    if (!url) {
      setStatus('Вставьте ссылку подписки.', true);
      return;
    }

    setBusy(true);
    setStatus('Разбираем подписку...', false);
    resetState();

    parseSubscription(url).then(function (payload) {
      var status = normalizeRawResponse(payload);
      if (!status) {
        throw new Error('Сервер не вернул ожидаемый ответ.');
      }

      applyParsedState(status);

      if (status.subscription_error && status.subscription_error.message) {
        setStatus(status.subscription_error.message, true);
      } else {
        setStatus('Подписка успешно разобрана.', false);
      }
    }).catch(function (error) {
      setStatus(String(error && error.message || error), true);
    }).finally(function () {
      setBusy(false);
    });
  });

  clearButton.addEventListener('click', function () {
    input.value = '';
    resetState();
    setStatus('Готово к проверке.', false);
  });

  copyAllButton.addEventListener('click', function () {
    var links = getPreviewServers().map(function (server) {
      return server.url || server.link || '';
    }).filter(Boolean);
    copyText(links.join('\n'), 'Все ссылки скопированы.');
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var value = tab.getAttribute('data-tab');
      tabs.forEach(function (item) {
        item.classList.toggle('is-active', item === tab);
      });
      tabContents.forEach(function (content) {
        content.classList.toggle('is-active', content.getAttribute('data-tab-content') === value);
      });
    });
  });

  serversBody.addEventListener('change', function (event) {
    var toggleId = event.target.getAttribute('data-server-toggle');
    var radioId = event.target.getAttribute('data-server-radio');

    if (toggleId) {
      state.enabledMap[toggleId] = !!event.target.checked;
      if (!event.target.checked && state.primaryMode === 'manual' && state.primaryId === toggleId) {
        state.primaryMode = 'auto';
        state.primaryId = '';
      }
      renderSummary();
      renderServers();
      renderPreview();
      return;
    }

    if (event.target.name === 'primary-mode' && event.target.value === 'auto') {
      state.primaryMode = 'auto';
      state.primaryId = '';
      renderServers();
      renderPreview();
      return;
    }

    if (radioId) {
      state.primaryMode = 'manual';
      state.primaryId = radioId;
      if (state.enabledMap[radioId] === false) {
        state.enabledMap[radioId] = true;
      }
      renderSummary();
      renderServers();
      renderPreview();
    }
  });

  previewList.addEventListener('click', function (event) {
    var serverId = event.target.getAttribute('data-copy-link');
    if (!serverId) {
      return;
    }

    var server = getPreviewServers().find(function (item) {
      return item.id === serverId;
    });
    if (!server) {
      return;
    }

    copyText(server.url || server.link || '', 'Ссылка скопирована.');
  });

  resetState();
})();
