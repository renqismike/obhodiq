# Obhodiq Demo API

Минимальный серверный API для GitHub Pages-демо.

Что делает:
- принимает URL подписки
- запускает текущий shell-парсер Obhodiq
- возвращает JSON для фронтенда

Что не делает:
- не запускает Podkop
- не считает пинги
- не маршрутизирует трафик
- не хранит подписки после завершения запроса

## Запуск

```bash
chmod +x demo-api/parse-subscription.sh
python3 demo-api/server.py
```

По умолчанию сервер слушает `127.0.0.1:8787`.

Полезные переменные:

```bash
export OBHODIQ_DEMO_HOST=0.0.0.0
export OBHODIQ_DEMO_PORT=8787
export OBHODIQ_DEMO_ORIGIN=https://renqismike.github.io
```

## Endpoint

`POST /api/parse`

Body:

```json
{
  "url": "https://example.com/subscription"
}
```
