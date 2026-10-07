#!/bin/zsh
set -e
task_project_dir="$(cd "$(dirname "$0")" && pwd)"
cd "$task_project_dir"
task_preview_url='http://localhost:4173'

if /usr/bin/curl -fsS "$task_preview_url" 2>/dev/null | /usr/bin/grep -q 'Moto Motion Lab'; then
  /usr/bin/open "$task_preview_url"
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  for task_node_bin in \
    "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin" \
    "$HOME/Documents/Codex/2026-10-06/npx-create-video-latest/outputs/runtime/node-v24.21.0-darwin-arm64/bin"; do
    if [[ -x "$task_node_bin/node" ]]; then
      export PATH="$task_node_bin:$PATH"
      break
    fi
  done
fi
if ! command -v node >/dev/null 2>&1; then
  print '请先安装 Node.js 22 或更新版本，再打开机车动效实验室。'
  read 'task_answer?按回车关闭。'
  exit 1
fi
if [[ ! -d node_modules ]]; then
  npm ci
fi
npm run dev &
task_server_pid=$!
trap 'kill "$task_server_pid" 2>/dev/null || true' EXIT INT TERM
for task_attempt in {1..40}; do
  if /usr/bin/curl -fsS "$task_preview_url" >/dev/null 2>&1; then
    /usr/bin/open "$task_preview_url"
    break
  fi
  sleep 0.5
done
print '机车动效实验室已启动。关闭此终端窗口会停止本次启动的服务。'
wait "$task_server_pid"
