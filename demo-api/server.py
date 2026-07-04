#!/usr/bin/env python3

import json
import os
import subprocess
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


HOST = os.environ.get("OBHODIQ_DEMO_HOST", "127.0.0.1")
PORT = int(os.environ.get("OBHODIQ_DEMO_PORT", "8787"))
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PARSER = os.path.join(SCRIPT_DIR, "parse-subscription.sh")
ALLOWED_ORIGIN = os.environ.get("OBHODIQ_DEMO_ORIGIN", "*")


class DemoHandler(BaseHTTPRequestHandler):
    server_version = "ObhodiqDemo/0.1"

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.respond_json(200, {"ok": True, "service": "obhodiq-demo-api"})
            return

        self.respond_json(404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/api/parse":
            self.respond_json(404, {"error": "not found"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0

        raw = self.rfile.read(length)
        try:
            payload = json.loads(raw.decode("utf-8"))
        except Exception:
            self.respond_json(400, {"error": "invalid json"})
            return

        url = str(payload.get("url", "")).strip()
        if not url:
            self.respond_json(400, {"error": "url is required"})
            return

        try:
            result = subprocess.run(
                [PARSER, url],
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=150,
            )
        except subprocess.TimeoutExpired:
            self.respond_json(504, {"error": "parser timeout"})
            return
        except Exception as exc:
            self.respond_json(500, {"error": f"failed to run parser: {exc}"})
            return

        stdout = (result.stdout or "").strip()
        stderr = (result.stderr or "").strip()

        if not stdout:
            self.respond_json(500, {"error": stderr or "parser returned empty output"})
            return

        try:
            data = json.loads(stdout)
        except Exception:
            self.respond_json(500, {"error": "parser returned invalid json", "stderr": stderr, "stdout": stdout[:400]})
            return

        if stderr:
            data["_stderr"] = stderr

        self.respond_json(200, data)

    def log_message(self, fmt, *args):
        return

    def respond_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    server = ThreadingHTTPServer((HOST, PORT), DemoHandler)
    print(f"Obhodiq demo API listening on {HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
