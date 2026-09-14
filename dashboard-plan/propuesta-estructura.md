# Propuesta de estructura y fases — Sistema Don Ramon Jetfuel (Laravel + WordPress)

> Borrador de arquitectura del proyecto nuevo (independiente del sitio actual, que NO se toca).
> Espeja el flujo que ya usamos: definir → preparar carpetas/docker → build local preview →
> docs del cliente → producción. Todo vive en una carpeta nueva hermana de `site/`, `preview/` e `img/`.

---

## 1. Estructura de carpetas propuesta

```
/mnt/c/Users/dejes/proyectos/donramontje/
├── site/                     ← PROYECTO ACTUAL (no tocar)
├── preview/                  ← PROYECTO ACTUAL (no tocar)
├── img/                      ← PROYECTO ACTUAL (no tocar)
├── dashboard-plan/           ← ESTA carpeta (planificación)
└── app-system/               ← NUEVA carpeta raíz del sistema (se crea en fase 2)
    ├── docker/
    │   ├── docker-compose.yml        # todos los servicios (borrador abajo)
    │   ├── .env.example              # claves y contraseñas (no se sube a git)
    │   ├── nginx/
    │   │   ├── proxy.conf            # reverse proxy 80/443 → apps
    │   │   ├── laravel.conf          # server block del dashboard
    │   │   └── wordpress.conf        # server block de WP (solo opción A)
    │   └── php/                      # Dockerfiles php-fpm (extensiones Laravel/WP)
    ├── backend/                      # app Laravel + Filament (el dashboard)
    │   ├── app/ (Models, Filament/Resources, Policies, Services…)
    │   ├── database/ (migrations, seeders: menú, categorías, horarios)
    │   ├── public/  (build assets)
    │   ├── storage/ (fotos de platos y galería)
    │   └── composer.json
    ├── site-static/                  # COPIA del sitio estático actual (solo lectura del original)
    │   └── assets/js/data.js         # el panel puede regenerar este archivo al "publicar"
    ├── wordpress/                    # SOLO en Opción A (imagen oficial wp + wp-content)
    ├── preview/                      # scripts de preview local + tests (mismo estilo que preview/ actual)
    │   ├── preview.sh
    │   └── scripts/ (check-dashboard.js, generate-menu-json.py…)
    └── docs/
        ├── guia-cliente-dashboard.md # manual NO técnico de uso del panel (fase 4)
        ├── deploy.md                 # pasos de despliegue en VPS (fase 5)
        └── backup-restore.md         # copias de seguridad para no técnicos
```

**Regla de oro:** `app-system/` es un proyecto git aparte del repo actual. Nunca se commitea nada de `site/`, `preview/` ni `img/` desde él.

---

## 2. Fases del proyecto (espejo del flujo de esta sesión)

### Fase 1 — Definir (documentación y decisiones)
- Entregar al cliente `preguntas-cliente.md` (adaptado a lenguaje simple) y recoger respuestas.
- Elegir opción: **B (recomendada)** / A / C según `plan-opciones.md`.
- Resultado: lista cerrada de módulos v1 (por defecto: menú, categorías, horarios, galería, pedidos WhatsApp, publicar a `data.js`).
- Criterio de salida: cuestionario respondido + opción elegida + presupuesto confirmado.

### Fase 2 — Preparar carpetas y Docker
- Crear `app-system/` con la estructura de arriba.
- `laravel new backend` (Laravel 13) + `composer require filament/filament` + Breeze (login) + spatie/laravel-permission.
- Escribir `docker/docker-compose.yml` (borrador abajo) y los `nginx/*.conf`.
- Objetivo: `docker compose up -d` levanta todo en local y se ve el panel de login en `http://localhost:8080`.
- Criterio de salida: stack arriba en local, sin datos aún.

### Fase 3 — Build local preview (el grueso del trabajo)
- Modelos + migraciones: `Product`, `Category`, `ScheduleSlot`, `GalleryImage`, `Order` (pedido WhatsApp), `Setting`.
- Recursos Filament para cada uno (CRUD completo: listas con filtros, formularios con subida de fotos, ordenación).
- Widgets de dashboard: pedidos del día, platos más vendidos (si el cliente lo pide en fase 1), estado "abierto/cerrado".
- **Publicador**: comando Artisan que genera `site-static/assets/js/data.js` (mismo formato que el actual) para actualizar la web sin WP.
- Preview local idéntico al flujo actual: nginx en `:8080`, scripts de test en `preview/scripts/`.
- Criterio de salida: el dueño puede editar menú/precios/fotos/horarios y ver los pedidos, todo probado en local.

### Fase 4 — Docs del cliente
- `docs/guia-cliente-dashboard.md`: manual NO técnico con capturas (cómo entrar, cambiar precio, marcar agotado, apuntar pedido, subir foto, publicar cambios en la web).
- `docs/backup-restore.md`: qué hacer si borra algo por error (papelera de Filament + restauración).
- Traducción del panel a ES/EN según respuesta a la pregunta 18.
- Criterio de salida: un no técnico usa el panel con la guía sin preguntar nada.

### Fase 5 — Producción
- VPS Hetzner (~5 €/mes, plan compartido 2 vCPU/2–4 GB) con Docker CE (app de un clic de Hetzner) — o Fly.io/Railway si se prefiere no administrar VPS.
- Subir `app-system/` vía git; `docker compose up -d` en el VPS; dominio `admin.donramontje.cw` → proxy nginx.
- HTTPS con Let's Encrypt (certbot o Caddy si se cambia de proxy).
- Cron de backups: `spatie/laravel-backup` a volumen/almacenamiento externo (diario BD + fotos).
- Endurecimiento: login rate-limited, 2FA, `robots: noindex` en el panel, firewall del VPS (solo 22/80/443).
- Publicar cambios del menú: el cliente pulsa "Publicar" → `data.js` se copia al hosting del sitio actual (por API/rsync, a definir con el hosting de la pregunta 21).
- Criterio de salida: panel en producción con backups y el dueño operando solo.

---

## 3. Docker Compose propuesto (BORRADOR — servicios y puertos)

> Solo como punto de partida de la fase 2. Los puertos al host solo se exponen en preview local;
> en producción solo el proxy publica 80/443.

```yaml
# app-system/docker/docker-compose.yml (borrador v0.1)
services:
  # ── Punto de entrada único: nginx reverse proxy ──
  proxy:
    image: nginx:1.27-alpine
    container_name: drj-proxy
    ports:
      - "80:80"        # en local: 8080:80 para no chocar con el preview actual
      - "443:443"
    volumes:
      - ./nginx/proxy.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/laravel.conf:/etc/nginx/conf.d/laravel.conf:ro
      - ./nginx/wordpress.conf:/etc/nginx/conf.d/wordpress.conf:ro   # solo Opción A
    depends_on: [app, wordpress]
    restart: unless-stopped

  # ── Dashboard Laravel + Filament ──
  app-php:
    build: ./php/laravel                 # php-fpm 8.4 con extensiones de Laravel
    container_name: drj-app-php
    volumes:
      - ../backend:/var/www/html         # código Laravel (fase 2-3)
    environment:
      DB_HOST: db
      DB_DATABASE: donramontje
      DB_USERNAME: ${DB_USER}
      DB_PASSWORD: ${DB_PASS}
      REDIS_HOST: redis
    networks: [internal]
    restart: unless-stopped
    # sin puertos expuestos al host: solo el proxy le habla por fastcgi (puerto 9000 interno)

  app-nginx:                              # nginx específico del dashboard (fastcgi → app-php)
    image: nginx:1.27-alpine
    container_name: drj-app-nginx
    volumes:
      - ../backend/public:/var/www/html/public:ro
      - ./nginx/laravel-server.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on: [app-php]
    networks: [internal]
    restart: unless-stopped
    # sin puertos al host: el proxy le llega por la red interna

  # ── WordPress (SOLO Opción A; en Opción B no existe) ──
  wordpress:
    image: wordpress:php8.4-fpm-alpine
    container_name: drj-wp
    volumes:
      - ../wordpress/wp-content:/var/www/html/wp-content
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: ${DB_USER}
      WORDPRESS_DB_PASSWORD: ${DB_PASS}
      WORDPRESS_DB_NAME: wordpress        # BD separada de la de Laravel
    depends_on: [db]
    networks: [internal]
    restart: unless-stopped

  # ── Base de datos compartida (una instancia, dos BD) ──
  db:
    image: mysql:8.4
    container_name: drj-db
    volumes:
      - db_data:/var/lib/mysql            # persistencia + backups desde el host
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASS}
      MYSQL_DATABASE: donramontje
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
    networks: [internal]
    restart: unless-stopped
    # sin puertos al host (3306 queda interno; acceso admin solo vía exec)

  # ── Cache/colas (opcional, barato y recomendado) ──
  redis:
    image: redis:7-alpine
    container_name: drj-redis
    networks: [internal]
    restart: unless-stopped

networks:
  internal:
    driver: bridge                          # solo el proxy queda expuesto

volumes:
  db_data:
```

**Notas del borrador:**
- **Opción B** = quitar el servicio `wordpress` (y su conf de nginx): quedan 5 servicios ligeros que caben en una VPS de 2 GB.
- **Puertos en preview local**: `proxy` mapea `8080:80` (mismo patrón que el `preview/` actual, que usa 8080) para no chocar.
- **En producción**: solo 80/443 en el proxy; MySQL/Redis/php-fpm nunca se exponen (ver Búsqueda 2 de `deepsearch-notes.md`).
- **Si el menú debe llegar a WP (Opción A)**: el backend lo publica vía REST API de WP o Corcel contra la BD `wordpress`; no se comparte tabla `wp_` con las tablas de Laravel (prefijos separados en BD distintas).
