(function () {
  var I18N = {
    ru: {
      heroSubtitle: 'Демо парсинга подписок для Podkop',
      heroNote: 'Эта страница только разбирает подписку и показывает результат. Пинги, реальная работа серверов и совместимость с конкретным роутером здесь не проверяются.',
      subscriptionLabel: 'Ссылка подписки',
      subscriptionPlaceholder: 'Вставьте ссылку подписки',
      parseButton: 'Разобрать подписку',
      parseButtonBusy: 'Разбираем...',
      clearButton: 'Очистить',
      tabOverview: 'Обзор',
      tabLinks: 'Ссылки',
      thPrimary: 'Основной',
      thEnabled: 'Вкл',
      thServer: 'Сервер',
      thType: 'Тип',
      thStatus: 'Статус',
      cardProfile: 'Профиль',
      cardTraffic: 'Трафик',
      cardExpire: 'Истекает',
      cardUpdated: 'Обновлено',
      cardRemaining: 'Остаток',
      cardTimeLeft: 'Осталось',
      summarySupported: 'Поддерживается',
      summaryInList: 'В списке',
      summaryUnsupported: 'Не поддерживается',
      previewTopline: 'Ниже показаны ссылки, которые Obhodiq сформировал после разбора подписки и отправляет в Podkop.',
      copyAll: 'Скопировать всё',
      copyOne: 'Копировать',
      emptyServers: 'После успешного парсинга здесь появится список серверов.',
      emptyInitial: 'Здесь появятся серверы после разбора подписки.',
      noLinks: 'Нет ссылок для показа.',
      nothingYet: 'Пока нечего показывать.',
      auto: 'Авто',
      autoDesc: 'Локальный предпросмотр URLTest-группы',
      preview: 'Превью',
      supported: 'Поддерживается',
      maybe: 'Может не поддерживаться',
      unsupported: 'Не поддерживается',
      manual: 'Выбран вручную',
      wsDisabled: 'WS выключен по умолчанию',
      unlimited: 'Без лимита',
      expired: 'Истекло',
      dayShort: 'д.',
      hourShort: 'ч.',
      nothingToCopy: 'Нечего копировать.',
      copyFailed: 'Не удалось скопировать.',
      copiedAll: 'Все ссылки скопированы.',
      copiedOne: 'Ссылка скопирована.',
      needUrl: 'Вставьте ссылку подписки.',
      parsing: 'Разбираем подписку...',
      badResponse: 'Сервер не вернул ожидаемый ответ.',
      parseOk: 'Подписка успешно разобрана.',
      ready: 'Готово к проверке.'
      ,
      demoInfoTitle: 'Перед проверкой',
      demoInfoText: 'Введённые ссылки используются только для текущей проверки. Но ваш VPN-провайдер может посчитать такой запрос как новое устройство или новую сессию.',
      demoInfoLink: 'Ссылка для тестов: renqismike.github.io/obhodiq/'
    },
    en: {
      heroSubtitle: 'Podkop subscription parsing demo',
      heroNote: 'This page only parses a subscription and shows the result. Pings, real server operation, and compatibility with a specific router are not checked here.',
      subscriptionLabel: 'Subscription URL',
      subscriptionPlaceholder: 'Paste subscription URL',
      parseButton: 'Parse subscription',
      parseButtonBusy: 'Parsing...',
      clearButton: 'Clear',
      tabOverview: 'Overview',
      tabLinks: 'Links',
      thPrimary: 'Primary',
      thEnabled: 'On',
      thServer: 'Server',
      thType: 'Type',
      thStatus: 'Status',
      cardProfile: 'Profile',
      cardTraffic: 'Traffic',
      cardExpire: 'Expires',
      cardUpdated: 'Updated',
      cardRemaining: 'Remaining',
      cardTimeLeft: 'Time left',
      summarySupported: 'Supported',
      summaryInList: 'In list',
      summaryUnsupported: 'Unsupported',
      previewTopline: 'Below are the links that Obhodiq generated after parsing the subscription and sends to Podkop.',
      copyAll: 'Copy all',
      copyOne: 'Copy',
      emptyServers: 'The server list will appear here after a successful parse.',
      emptyInitial: 'Servers will appear here after the subscription is parsed.',
      noLinks: 'No links to show.',
      nothingYet: 'Nothing to show yet.',
      auto: 'Auto',
      autoDesc: 'Local URLTest group preview',
      preview: 'Preview',
      supported: 'Supported',
      maybe: 'May be unsupported',
      unsupported: 'Unsupported',
      manual: 'Selected manually',
      wsDisabled: 'WS disabled by default',
      unlimited: 'Unlimited',
      expired: 'Expired',
      dayShort: 'd.',
      hourShort: 'h.',
      nothingToCopy: 'Nothing to copy.',
      copyFailed: 'Copy failed.',
      copiedAll: 'All links copied.',
      copiedOne: 'Link copied.',
      needUrl: 'Paste a subscription URL.',
      parsing: 'Parsing subscription...',
      badResponse: 'Server returned an unexpected response.',
      parseOk: 'Subscription parsed successfully.',
      ready: 'Ready to check.'
      ,
      demoInfoTitle: 'Before testing',
      demoInfoText: 'Entered links are used only for the current check. However, your VPN provider may count such a request as a new device or a new session.',
      demoInfoLink: 'Test page: renqismike.github.io/obhodiq/'
    }
  };

  function resolveApiBase() {
    var host = (window.location && window.location.hostname) || '';

    try {
      var params = new URLSearchParams(window.location.search || '');
      var override = (params.get('api') || '').trim();
      if (override) {
        try {
          window.localStorage.setItem('obhodiq-demo-api', override.replace(/\/$/, ''));
        } catch (storageError) {
          // ignore
        }
        return override.replace(/\/$/, '');
      }
    } catch (error) {
      // ignore
    }

    if (host === 'renqismike.github.io') {
      try {
        window.localStorage.setItem('obhodiq-demo-api', 'https://anonchattapps.duckdns.org/obhodiq-api');
      } catch (storageError) {
        // ignore
      }
      return 'https://anonchattapps.duckdns.org/obhodiq-api';
    }

    try {
      var savedApiBase = (window.localStorage.getItem('obhodiq-demo-api') || '').trim();
      if (savedApiBase) {
        return savedApiBase.replace(/\/$/, '');
      }
    } catch (storageError) {
      // ignore
    }

    return (window.location.origin || '').replace(/\/$/, '') + '/obhodiq-api';
  }

  var API_BASE = resolveApiBase();

  var state = {
    raw: null,
    enabledMap: Object.create(null),
    primaryMode: 'auto',
    primaryId: '',
    busy: false,
    lang: 'ru',
    statusKey: 'ready',
    statusText: '',
    statusError: false
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
  var langButtons = Array.prototype.slice.call(document.querySelectorAll('.lang-btn'));
  var heroProfile = document.getElementById('hero-profile');

  var metaProfile = document.getElementById('meta-profile');
  var metaTraffic = document.getElementById('meta-traffic');
  var metaExpire = document.getElementById('meta-expire');
  var metaUpdated = document.getElementById('meta-updated');
  var metaRemaining = document.getElementById('meta-remaining');
  var metaTimeLeft = document.getElementById('meta-time-left');

  function t(key) {
    var dict = I18N[state.lang] || I18N.ru;
    return dict[key] || key;
  }

  function applyLanguage() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      var key = node.getAttribute('data-i18n');
      node.textContent = t(key);
    });
    input.placeholder = t('subscriptionPlaceholder');
    langButtons.forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-lang') === state.lang);
    });
    if (!state.raw) {
      metaRemaining.textContent = t('unlimited');
    }
    syncStatus();
  }

  function setBusy(isBusy, label) {
    state.busy = !!isBusy;
    parseButton.disabled = !!isBusy;
    parseButton.textContent = isBusy ? (label || t('parseButtonBusy')) : t('parseButton');
  }

  function syncStatus() {
    var message = state.statusKey ? t(state.statusKey) : (state.statusText || '');
    statusBar.textContent = message;
    statusBar.classList.toggle('is-error', !!state.statusError);
  }

  function setStatusKey(key, isError) {
    state.statusKey = key || '';
    state.statusText = '';
    state.statusError = !!isError;
    syncStatus();
  }

  function setStatusText(message, isError) {
    state.statusKey = '';
    state.statusText = message || '';
    state.statusError = !!isError;
    syncStatus();
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

    return date.toLocaleString(state.lang === 'ru' ? 'ru-RU' : 'en-US');
  }

  function formatTimeLeft(expireTs) {
    var expire = Number(expireTs || 0);
    if (!expire) {
      return '-';
    }

    var now = Math.floor(Date.now() / 1000);
    var diff = expire - now;
    if (diff <= 0) {
      return t('expired');
    }

    var days = Math.floor(diff / 86400);
    var hours = Math.floor((diff % 86400) / 3600);
    return days > 0 ? days + ' ' + t('dayShort') + ' ' + hours + ' ' + t('hourShort') : hours + ' ' + t('hourShort');
  }

  function normalizeRawResponse(payload) {
    return payload && payload.status ? payload.status : null;
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
      return '<span class="status-pill is-unsupported">' + escapeHtml(server.unsupported_reason || t('unsupported')) + '</span>';
    }
    if (server.maybe_unsupported === true) {
      return '<span class="status-pill is-maybe">' + escapeHtml(server.maybe_unsupported_reason || t('maybe')) + '</span>';
    }
    return '<span class="status-pill">' + escapeHtml(t('supported')) + '</span>';
  }

  function renderMeta() {
    var meta = (state.raw && state.raw.meta) || {};
    var profile = meta.profile_title || '-';
    var used = Number(meta.used || ((Number(meta.upload || 0) + Number(meta.download || 0)) || 0));
    var remaining = meta.remaining;

    heroProfile.textContent = profile;
    metaProfile.textContent = profile;
    metaTraffic.textContent = bytesToHuman(used);
    metaExpire.textContent = formatDate(meta.expire);
    metaUpdated.textContent = formatDate(meta.updated_at);
    metaRemaining.textContent = (remaining == null || remaining === '' || Number(remaining) === 0) ? t('unlimited') : bytesToHuman(remaining);
    metaTimeLeft.textContent = formatTimeLeft(meta.expire);
  }

  function renderSummary() {
    var visible = getVisibleServers();
    var supported = visible.filter(function (server) { return server.unsupported !== true; }).length;
    var unsupported = visible.filter(function (server) { return server.unsupported === true; }).length;
    var previewCount = getPreviewServers().length;

    summaryLine.textContent = t('summarySupported') + ': ' + supported + ' • ' + t('summaryInList') + ': ' + previewCount + ' • ' + t('summaryUnsupported') + ': ' + unsupported;
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
      serversBody.innerHTML = '<tr><td colspan="5" class="empty-row">' + escapeHtml(t('emptyServers')) + '</td></tr>';
      return;
    }

    var autoChecked = state.primaryMode === 'auto' ? ' checked' : '';
    var autoRow = [
      '<tr>',
      '<td><div class="cell-primary"><input class="server-radio" type="radio" name="primary-mode" value="auto"' + autoChecked + '></div></td>',
      '<td><div class="cell-enabled">-</div></td>',
      '<td><div class="cell-server"><div class="server-main">' + escapeHtml(t('auto')) + '</div><div class="server-sub">' + escapeHtml(t('autoDesc')) + '</div></div></td>',
      '<td><div class="cell-type">URLTEST</div></td>',
      '<td><div class="cell-status"><span class="status-pill">' + escapeHtml(t('preview')) + '</span></div></td>',
      '</tr>'
    ].join('');

    var rows = servers.map(function (server) {
      var checked = state.enabledMap[server.id];
      if (checked == null) {
        checked = server.excluded !== true;
      }

      var primaryChecked = state.primaryMode === 'manual' && state.primaryId === server.id ? ' checked' : '';
      var enabledChecked = checked ? ' checked' : '';

      return [
        '<tr>',
        '<td><div class="cell-primary"><input class="server-radio" data-server-radio="' + escapeHtml(server.id) + '" type="radio" name="primary-mode" value="' + escapeHtml(server.id) + '"' + primaryChecked + (server.unsupported ? ' disabled' : '') + '></div></td>',
        '<td><div class="cell-enabled"><input class="server-toggle" data-server-toggle="' + escapeHtml(server.id) + '" type="checkbox"' + enabledChecked + (server.unsupported ? ' disabled' : '') + '></div></td>',
        '<td><div class="cell-server"><div class="server-main">' + escapeHtml(normalizeDisplayName(server.name)) + '</div></div></td>',
        '<td><div class="cell-type">' + escapeHtml(server.type_label || '-') + '</div></td>',
        '<td><div class="cell-status">' + buildStatusText(server) + '</div></td>',
        '</tr>'
      ].join('');
    });

    serversBody.innerHTML = autoRow + rows.join('');
  }

  function renderPreview() {
    var previewServers = getPreviewServers();

    if (!previewServers.length) {
      previewList.innerHTML = '<div class="preview-empty">' + escapeHtml(t('noLinks')) + '</div>';
      return;
    }

    previewList.innerHTML = previewServers.map(function (server) {
      var flags = [];
      if (state.primaryMode === 'manual' && state.primaryId === server.id) {
        flags.push(t('manual'));
      }
      if (server.maybe_unsupported === true) {
        flags.push(t('wsDisabled'));
      }

      return [
        '<article class="preview-item">',
        '<div class="preview-item-head">',
        '<div>',
        '<div class="preview-item-name">' + escapeHtml(normalizeDisplayName(server.name)) + '</div>',
        '<div class="preview-item-type">' + escapeHtml(flags.join(' • ') || (server.type_label || '-')) + '</div>',
        '</div>',
        '<button class="btn btn-secondary btn-small" type="button" data-copy-link="' + escapeHtml(server.id) + '">' + escapeHtml(t('copyOne')) + '</button>',
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
    heroProfile.textContent = '-';
    metaTraffic.textContent = '0 B';
    metaExpire.textContent = '-';
    metaUpdated.textContent = '-';
    metaRemaining.textContent = t('unlimited');
    metaTimeLeft.textContent = '-';
    summaryLine.textContent = t('summarySupported') + ': 0 • ' + t('summaryInList') + ': 0 • ' + t('summaryUnsupported') + ': 0';
    noticeBox.classList.add('is-hidden');
    noticeBox.textContent = '';
    serversBody.innerHTML = '<tr><td colspan="5" class="empty-row">' + escapeHtml(t('emptyInitial')) + '</td></tr>';
    previewList.innerHTML = '<div class="preview-empty">' + escapeHtml(t('nothingYet')) + '</div>';
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
      setStatusKey('nothingToCopy', true);
      return;
    }

    navigator.clipboard.writeText(value).then(function () {
      setStatusText(successText, false);
    }).catch(function () {
      setStatusKey('copyFailed', true);
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (state.busy) {
      return;
    }

    var url = (input.value || '').trim();
    if (!url) {
      setStatusKey('needUrl', true);
      return;
    }

    setBusy(true);
    setStatusKey('parsing', false);
    resetState();

    parseSubscription(url).then(function (payload) {
      var status = normalizeRawResponse(payload);
      if (!status) {
        throw new Error(t('badResponse'));
      }

      applyParsedState(status);

      if (status.subscription_error && status.subscription_error.message) {
        setStatusText(status.subscription_error.message, true);
      } else {
        setStatusKey('parseOk', false);
      }
    }).catch(function (error) {
      setStatusText(String(error && error.message || error), true);
    }).finally(function () {
      setBusy(false);
    });
  });

  clearButton.addEventListener('click', function () {
    input.value = '';
    resetState();
    setStatusKey('ready', false);
  });

  copyAllButton.addEventListener('click', function () {
    var links = getPreviewServers().map(function (server) {
      return server.url || server.link || '';
    }).filter(Boolean);
    copyText(links.join('\n'), t('copiedAll'));
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

  langButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      state.lang = button.getAttribute('data-lang') || 'ru';
      try {
        window.localStorage.setItem('obhodiq-demo-lang', state.lang);
      } catch (error) {
        // ignore
      }
      applyLanguage();
      renderAll();
      setBusy(state.busy);
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

    copyText(server.url || server.link || '', t('copiedOne'));
  });

  try {
    var savedLang = window.localStorage.getItem('obhodiq-demo-lang');
    if (savedLang === 'ru' || savedLang === 'en') {
      state.lang = savedLang;
    }
  } catch (error) {
    // ignore
  }

  applyLanguage();
  resetState();
  setStatusKey('ready', false);
})();
