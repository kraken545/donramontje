#!/usr/bin/env bash
# Don Ramon Jetfuel — preview local con Docker
# Uso: ./preview.sh [up|down|logs|restart|status]
set -euo pipefail
cd "$(dirname "$0")"

NAME="donramontje-preview"
IMAGE="nginx:1.27-alpine"
SITE="$(cd .. && pwd)/site"
NGINX="$(pwd)/nginx.conf"

# Detectar backend: docker compose > docker-compose (funcional) > docker run nativo
BACKEND=""
if docker compose version >/dev/null 2>&1; then
  BACKEND="compose"
elif docker-compose version >/dev/null 2>&1; then
  BACKEND="docker-compose"
else
  BACKEND="native"
fi

up_native() {
  if docker ps -a --format '{{.Names}}' | grep -qx "$NAME"; then
    docker start "$NAME" >/dev/null
  else
    docker run -d \
      --name "$NAME" \
      -p 8080:80 \
      -v "$SITE":/usr/share/nginx/html:ro \
      -v "$NGINX":/etc/nginx/conf.d/default.conf:ro \
      --restart unless-stopped \
      "$IMAGE" >/dev/null
  fi
}

down_native() { docker rm -f "$NAME" >/dev/null 2>&1 || true; }
logs_native() { docker logs -f --tail=100 "$NAME"; }
restart_native() { docker restart "$NAME" >/dev/null; }
status_native() { docker ps -a --filter "name=$NAME"; }

case "${1:-up}" in
  up)
    if [ "$BACKEND" = "compose" ]; then docker compose up -d
    elif [ "$BACKEND" = "docker-compose" ]; then docker-compose up -d
    else up_native; fi
    echo ""
    echo "  Don Ramon Jetfuel preview: http://localhost:8080"
    echo "  Hot-reload: edita site/ y refresca el navegador."
    ;;
  down)
    if [ "$BACKEND" = "compose" ]; then docker compose down
    elif [ "$BACKEND" = "docker-compose" ]; then docker-compose down
    else down_native; fi
    ;;
  restart)
    if [ "$BACKEND" = "compose" ]; then docker compose restart
    elif [ "$BACKEND" = "docker-compose" ]; then docker-compose restart
    else restart_native; fi
    ;;
  logs)
    if [ "$BACKEND" = "compose" ]; then docker compose logs -f --tail=100
    elif [ "$BACKEND" = "docker-compose" ]; then docker-compose logs -f --tail=100
    else logs_native; fi
    ;;
  status)
    if [ "$BACKEND" = "compose" ]; then docker compose ps
    elif [ "$BACKEND" = "docker-compose" ]; then docker-compose ps
    else status_native; fi
    ;;
  *)
    echo "Uso: ./preview.sh [up|down|logs|restart|status]"
    exit 1
    ;;
esac
