# Notas de investigación (deep search) — Sistema Don Ramon Jetfuel: Laravel + WordPress

> Documento interno del desarrollador. Recoge los hallazgos de 6 búsquedas profundas
> realizadas el 14-sep-2026, con URLs de las fuentes y conclusiones prácticas para
> decidir el plan. No es material para el cliente.

---

## Búsqueda 1 — Integración Laravel + WordPress: patrones

**Fuentes:**
- Guía completa de patrones de integración (2026): https://attowp.com/backend-server/laravel-for-wordpress-users/laravel-wordpress-integration/
- Headless WP + Laravel, patrones prácticos: https://neevalex.com/headless-wordpress-laravel-practical-integration-patterns/
- Paquete Corcel (oficial): https://github.com/corcel/corcel
- WP Engine, cómo integrar WP y Laravel: https://wpengine.com/blog/wordpress-laravel/
- Corcel sin overhead HTTP (misma BD): https://blog.daryledesilva.com/query-wordpress-from-laravel-with-corcel-no-http-overhead/
- Docs de integración de Corcel con Laravel: https://deepwiki.com/corcel/corcel/6-laravel-integration

**Hallazgos clave:**

1. **Hay 3 patrones de integración que funcionan en producción:**
   - **REST API bridge (WP headless):** WordPress expone contenido vía REST API y Laravel lo consume con su HTTP client, cacheándolo en Redis. Códigos totalmente separados. Es el más limpio, pero añade latencia por cada petición y hay que cachear agresivamente (TTL 60–300 s). Gutenberg/shortcodes no se renderizan solos en el lado Laravel.
   - **Base de datos compartida con Corcel:** Laravel lee directamente las tablas `wp_*` usando Eloquent (segunda conexión de BD). Sin HTTP, más rápido, soporta ACF, custom post types, taxonomías, menús y thumbnails. Ojo: Corcel está pensado para **leer**, no escribir; las escrituras deben ir por REST API para que se disparen los hooks de WP. Acopla ambas apps a la misma BD (si la BD cae, caen las dos).
   - **Webhooks (event sync):** WP dispara webhooks (plugin WP Webhooks) hacia Laravel cuando pasa algo (post publicado, pedido creado). Arquitectura desacoplada, cada sistema con su propia BD. Requiere colas, reintentos y monitorización de la "dead letter queue".

2. **Autenticación compartida — 4 enfoques:**
   - **JWT:** WP genera un JWT al login (plugin "JWT Authentication for WP REST API") y Laravel lo valida con un guard propio. Comparten el secreto. Ideal si WP es el sistema principal.
   - **Laravel Sanctum como capa de auth:** Laravel es dueño de los usuarios y WP se autentica contra Laravel. Invierte la relación.
   - **Cookie de sesión compartida en subdominios** (`.dominio.com`): simple pero frágil.
   - **OAuth 2.0 con Laravel Passport:** lo más robusto para ecosistemas de varias apps.
   - En cualquier caso: hay que **sincronizar usuarios** entre ambos (webhook de registro).

3. **Despliegue híbrido recomendado por la fuente para proyectos pequeños:**
   - Mismo servidor, directorios distintos (`/var/www/wordpress` y `/var/www/laravel`), nginx enruta por subdominio. Adecuado hasta ~50.000 visitas/mes.
   - Docker Compose con un contenedor por app es ideal para desarrollo reproducible.
   - Mantener repos separados, pipelines separados y variables de entorno separadas.

4. **Contexto de versiones (2026):** Laravel 12 (feb-2026) trajo starter kits con Livewire 3 / Inertia 2 y Reverb (WebSockets) maduro; **Laravel 13 ya es la versión actual** (los docs oficiales marcan la 12.x como "old version"). WordPress 6.7 (nov-2025) mejoró la REST API (revisiones para custom post types) y el rendimiento de opciones autoloaded.

5. **Cuándo NO hacer híbrido (cita textual de la fuente):** sitios solo de contenido con lógica mínima, equipos sin desarrolladores, presupuestos que no soportan mantener dos codebases a largo plazo.

**Conclusión práctica para Don Ramon:** para un food truck con 1 dueño no técnico, lo que tiene sentido no es tanto "integrar" WP con Laravel, sino decidir **quién publica el sitio público** (WP si el cliente quiere editar solo; estático si no) y que el dashboard Laravel viva aparte con su propia base de datos. La integración real solo haría falta si el menú publicado en la web tuviera que salir de la misma fuente que el dashboard — en ese caso, **Corcel (lectura) o REST API** son las vías baratas.

---

## Búsqueda 2 — Arquitectura Docker Compose: Laravel + MySQL + WordPress + nginx en una máquina

**Fuentes:**
- Laravel Sail (entorno Docker oficial de Laravel, base del compose): https://laravel.com/docs/13.x/sail
- DigitalOcean, Laravel + nginx + MySQL con Docker Compose (feb-2026): https://www.digitalocean.com/community/tutorials/how-to-set-up-laravel-nginx-and-mysql-with-docker-compose
- WordPress con Docker Compose (nginx + MySQL + PHP-FPM), feb-2026: https://oneuptime.com/blog/post/2026-02-08-how-to-run-wordpress-with-docker-compose-nginx-mysql-php/view
- WordPress Docker detrás de nginx reverse proxy (compose completo, verificado): https://stackoverflow.com/questions/55607916/wordpress-docker-behind-nginx-reverse-proxy
- Reverse proxy nginx con Docker Compose: https://hackernoon.com/how-to-nginx-reverse-proxy-with-docker-compose-ul7b3y40
- Dockerizing Laravel (nginx + MySQL + phpMyAdmin + PHP 8.2): https://dev.to/kamruzzaman/dockerizing-a-laravel-app-nginx-mysql-phpmyadmin-and-php-82-43ne

**Hallazgos clave:**

1. **Patrón estándar de la pila (cada app = 2 contenedores):**
   - `nginx` (front, expone 80/443) → `php-fpm` (ejecuta Laravel o WordPress) vía `fastcgi_pass php:9000` en la red interna.
   - `mysql` (un contenedor, puede servir a ambas apps con dos bases de datos: p. ej. `donramontje` para Laravel y `wordpress` para WP, o una sola BD con prefijos `wp_`).
   - La red interna de Docker hace de DNS: los contenedores se ven por nombre de servicio (`db:3306`, `php:9000`).

2. **Detalles prácticos verificados en las fuentes:**
   - nginx necesita ver los archivos PHP si usa `try_files` para reescribir a `index.php` (montar el mismo volumen en nginx y php-fpm, o usar `volumes_from`).
   - El contenedor PHP **no necesita puerto expuesto al host**: solo el webserver debe alcanzarlo por la red interna (exponer 9000 al host es un riesgo de seguridad).
   - Para WordPress en Docker: imagen oficial `wordpress:*` con `WORDPRESS_DB_HOST: db:3306` y montar `wp-content` en un volumen del host para persistir y hacer backups.
   - Para Laravel: imagen php-fpm propia (con extensiones) + nginx, o directamente Sail (que trae `compose.yaml` con `laravel.test`, mysql, redis, mailpit ya configurados; se puede `sail:add` para añadir servicios).
   - Caddy se menciona como alternativa a nginx con TLS automático vía Let's Encrypt (config más corta); en Docker, Traefik es la alternativa "canónica" para reverse proxy, pero para 2 apps nginx simple es lo más directo.

3. **Backups y persistencia:** volúmenes de host para `db` (datos MySQL) y `wp-content`; `restart: always` en los servicios; contras `depends_on` para arranque ordenado.

**Conclusión práctica:** un solo `docker-compose.yml` con 5-6 servicios (proxy/nginx, app-laravel + php-fpm, wordpress + php-fpm, mysql, opcional redis) cubre el 100 % del caso en una sola VPS. Este es el espejo exacto del flujo "preview local → producción" que ya usamos en el proyecto actual (nginx en puerto 8080).

---

## Búsqueda 3 — Hosting gratis o barato para Laravel (2026)

**Fuentes (precios oficiales consultados):**
- Railway: https://railway.com/pricing
- Render: https://render.com/pricing
- Fly.io: https://fly.io/docs/about/pricing/
- Hetzner Cloud: https://www.hetzner.com/cloud/
- Referencias de ecosistema: Laravel Forge https://forge.laravel.com · Laravel Cloud https://laravel.com/cloud

**Hallazgos clave (qué es realista y qué no):**

1. **Railway:** Trial de $5 sin tarjeta (30 días). Plan Hobby **$5/mes** incluye $5 de uso. Tarifas: ~$10/GB RAM·mes, ~$20/vCPU·mes, egress $0.05/GB, volúmenes $0.15/GB·mes. El plan Free ($1 de crédito/mes) no permite dominios propios → inútil para un negocio real. Un Laravel pequeño + MySQL cabe justo en el Hobby (~$5–10/mes).
2. **Render:** Web service **Free** ($0, 512 MB/0.1 CPU) — pero se duerme tras inactividad y hay que pagar el workspace Pro ($25/mes) para cosas serias; Starter $7/mes. Postgres gratis solo 30 días, luego desde $6/mes. Bandwidth gratis solo 5 GB/mes. Realista: ~$10–20/mes para el stack completo.
3. **Fly.io:** Sin plan, puro consumo: `shared-cpu-1x` 256 MB ≈ $2/mes, 1 GB ≈ $5.92/mes, volúmenes $0.15/GB·mes, egress $0.02–0.12/GB. **Requiere tarjeta de crédito** desde el inicio (sin tarjeta no hay cuenta usable). Un Laravel + MySQL ≈ $6–12/mes.
4. **Hetzner:** VPS compartido desde **~4–6 €/mes** (p. ej. líneas CX/CAX/CPX de 2 vCPU/2-4 GB), tráfico incluido muy generoso (~20 TB), firewall gratis, y **apps de un clic para WordPress y Docker CE**. Es la opción con mejor relación precio/potencia para UN único servidor que corra WP + Laravel + MySQL juntos.
5. **Laravel Forge:** desde $12/mes (plan Hobby) solo por la gestión, **más el servidor aparte** (Hetzner/DigitalOcean). Útil para deploys cómodos, no es un hosting en sí. **Laravel Cloud** es el PaaS oficial (pago por uso); no hay nada gratis permanente en Laravel.

**Conclusión práctica:** no existe hosting de producción *realmente gratis* para Laravel; lo máximo es trial/dormir. La ruta más barata y honesta para el cliente: **VPS Hetzner (~5 €/mes)** con Docker Compose, o Fly.io/Railway (~$5–10/mes) si no queremos administrar un VPS. Para la fase de preview local: Docker gratis en la máquina del desarrollador (como ya hacemos).

---

## Búsqueda 4 — Seguridad y auth para un dashboard Laravel de un solo negocio

**Fuentes:**
- Autenticación híbrida WP+Laravel (JWT/Sanctum/cookie/OAuth): https://attowp.com/backend-server/laravel-for-wordpress-users/laravel-wordpress-integration/
- Docs Filament v5 (paneles, security, autorización): https://filamentphp.com/docs
- Corcel con auth de usuarios WP: https://deepwiki.com/corcel/corcel/6-laravel-integration

**Hallazgos clave:**

1. **Para UN solo negocio con 1–3 usuarios NO hace falta integración de auth con WordPress.** Lo estándar y suficiente es la auth nativa de Laravel: **Breeze** (login simple) o **Jetstream** (2FA, sesiones, roles con teams). Filament se monta encima y hereda el guard.
2. **Si algún día WP y Laravel comparten usuarios** (no es el caso probable aquí), las vías son: JWT generado por WP con plugin (`jwt-authentication-for-wp-rest-api`), Sanctum como dueño de usuarios, cookie de sesión compartida en subdominio, o Passport OAuth2. La fuente recomienda sincronizar usuarios vía webhook sí o sí.
3. **Filament v5** incluye: multi-tenancy nativa (irrelevante aquí con 1 tenant, pero gratis), paneles múltiples, y se complementa con el plugin estándar **spatie/laravel-permission** para roles/permisos y plugins de 2FA/auditoría (800+ plugins registrados en filamentphp.com/plugins).
4. **Buenas prácticas para un dashboard de negocio único** (síntesis de las fuentes): HTTPS obligatorio (Let's Encrypt), acceso por dominio privado tipo `admin.donramontje.cw` sin indexación (robots noindex), rate limiting de login, 2FA (Jetstream o plugin Filament), backups automáticos (paquete Spatie Backup cubre app + BD de WP si se comparte), y NO exponer php-fpm ni MySQL al host (solo dentro de la red Docker — ver Búsqueda 2).

**Conclusión práctica:** Laravel + Breeze/Jetstream + Filament + spatie/laravel-permission es el stack de seguridad mínimo y sobrado para este caso. WP, si existe, queda separado y con su propio login de administrador.

---

## Búsqueda 5 — Filament vs Nova vs panel a medida para un dashboard de food truck

**Fuentes:**
- Comparativa profunda Filament v5 vs Nova v5.8 (abr-2026, agencia Laravel): https://laramate.de/en/blog/filament-vs-nova
- Filament vs Nova vs Backpack (2025): https://filament-hub.com/blog/filament-vs-nova-vs-backpack-in-2025-which-admin-stack-actually-doesnt-suck
- Investigación con benchmarks y ROI: https://edmondscommerce.co.uk/research/php/laravel-admin-panels/
- Otras comparativas: https://dev.to/cyber_aurora_/laravel-nova-vs-filament-the-best-admin-panels-5f9a · https://arsenaltech.com/blog/filament-vs-laravel-nova-cto-guide

**Hallazgos clave:**

1. **Filament:** open source (MIT), **gratis**, 30.000+ estrellas GitHub, 800+ plugins de 350+ autores, 1.7M descargas/mes. Todo en PHP/Livewire/Blade/Tailwind: un campo custom es **1 clase PHP + 1 vista Blade** (sin Vue, sin Webpack). v5 añade multi-tenancy nativa, SDUI (server-driven UI), hooks de render y soporte de IA para generar CRUDs. Ideal para el caso food truck: recursos CRUD de **menú, pedidos WhatsApp, horarios, galería** se hacen con `make:filament-resource` en minutos.
2. **Nova:** oficial de Laravel pero **de pago por proyecto** (~90 €/año proyecto sencillo + ~70 €/año renovación; Unlimited ~275 € + ~230 €/año según laramate). Requiere además skills de Vue.js para personalizar (3 componentes Vue por campo custom). Ecosistema de plugins pequeño y mayormente de pago. Solo gana si el equipo ya domina Vue.
3. **Backpack/Orchid:** comunidades mucho menores; no recomendables para proyectos nuevos según las fuentes.
4. **Panel a medida (Blade/Livewire sin framework de admin):** máxima libertad pero se tarda 3–5× más en CRUDs, tablas, filtros, uploads y notificaciones; solo justificado si el UI tiene que ser 100 % custom (no es el caso).

**Conclusión práctica:** **Filament es la opción obvia**: gratis, sin licencias, más rápido de construir, y sus componentes (tables/forms) se pueden reutilizar fuera del panel si un día se necesita. Coste de licencias en 3 años: 0 € vs ~300–500 € de Nova.

---

## Búsqueda 6 — WordPress como sitio público vs mantener el sitio estático actual

**Fuentes:**
- WP vs sitio estático para negocios (jun-2026): https://brandonfire.com/blog/wordpress-vs-static-site/
- WP vs HTML estático y SEO (abr-2026): https://www.searchscaleai.com/blog/wordpress-vs-static-html-which-better-seo-2026/
- Kinsta, WP vs HTML estático (feb-2026): https://kinsta.com/blog/wordpress-vs-static-html/
- WPBeginner, WP vs HTML para negocios (abr-2026): https://www.wpbeginner.com/beginners-guide/wordpress-vs-html-whats-best-for-your-business-website/
- HubSpot, HTML vs WordPress: https://blog.hubspot.com/website/wordpress-vs-html
- Hilos de r/SEO con opiniones de ambos lados: https://www.reddit.com/r/SEO/comments/164n64h/

**Hallazgos clave:**

1. **Estático (lo que ya tenemos):** más rápido, más seguro (sin BD ni plugins que parchear), hosting casi gratis, cero mantenimiento de plugins. El punto débil: editar contenido requiere al desarrollador (o editar `data.js`). WPBeginner lo resume: para un negocio pequeño no técnico con cambios mensuales, sale a cuenta pagar 30–60 min de desarrollador por actualización.
2. **WordPress:** el cliente edita solo (menús, fotos, avisos, blog), plugins SEO (Yoast/AIOSEO) sin tocar código. Los contras reales y medidos: más lento (hacen falta hosting decente + cache + CDN para llegar a 1.5–2 s), superficie de ataque mayor (plugins desactualizados = hackeos), y coste de mantenimiento típico: hosting $25–60/mes + plugins $100–400/año + actualizaciones periódicas (fuente: searchscaleai).
3. **El matiz importante:** para el caso de un food truck, lo que el cliente realmente quiere poder cambiar solo es **el menú, precios, horarios y fotos** — exactamente lo que el dashboard Laravel/Filament ya le daría. Si el dashboard escribe esos datos y la web pública los lee (archivos estáticos generados, JSON vía API o Corcel), **no hace falta WordPress para nada**.

**Conclusión práctica:** WordPress solo se justifica si el cliente quiere publicar contenido libre (blog/noticias) sin pasar por el desarrollador. Para un food truck, mantener el estático actual + dashboard es más barato, más rápido y menos frágil. WP queda como opción "si el cliente lo pide".

---

## Síntesis transversal (para el plan de opciones)

| Decisión | Recomendación respaldada por fuentes |
|---|---|
| Sitio público | Mantener el estático actual (rápido, seguro, ya hecho). WP solo si el cliente exige autoedición total |
| Dashboard | Laravel + Filament (gratis, CRUDs de menú/pedidos/horarios/galería en días) |
| Auth | Breeze/Jetstream + spatie/laravel-permission; nada de JWT con WP salvo que se unifique login |
| Integración WP (si existe) | REST API o Corcel para leer menú; webhooks solo si hay eventos entre sistemas |
| Infra local/prod | Docker Compose: nginx + php-fpm(Laravel) + php-fpm(WP opcional) + MySQL + redis opcional |
| Hosting | VPS Hetzner ~5 €/mes (todo en una máquina) o Fly.io/Railway $5–10/mes; gratis real no existe |
| Costes de licencias | 0 € (todo open source) frente a Nova (~90–300 €/año) |
