# Plan Final — Sistema Don Ramon Jetfuel (Dashboard Laravel + WordPress)

**Fecha:** 2026-09-14 · **Estado:** DECISIONES TOMADAS

## Decisiones confirmadas

| Tema | Decisión |
|---|---|
| Arquitectura | **Plan A**: WordPress como web pública + Laravel (Filament) como dashboard |
| Contenido editable | Solo lo esencial: menú, precios, horarios, ubicación, fotos |
| Pedidos | Registrar pedidos de WhatsApp con estados: nuevo → en cocina → listo |
| Usuarios | 1 usuario (dueño) con acceso total + 2FA |
| Hosting | VPS Hetzner ~5 €/mes, todo el stack con Docker Compose |
| Panel admin | Filament (gratis, MIT) — ganador frente a Nova (de pago) |

## Arquitectura objetivo

```
donramontje.com          -> WordPress (web pública, cliente la ve)
admin.donramontje.com    -> Laravel + Filament (dashboard, solo dueño)
api.donramontje.com      -> (opcional) Laravel publica a WP vía REST API

nginx (80/443, reverse proxy)
├── wp:    php-fpm + wp-content (volumen)
├── app:   Laravel php-fpm (horizon, cron)
└── db:    MySQL (2 bases: wordpress + dashboard) — nunca expuesto al host
```

- El dashboard edita menú/precios/horarios/ubicación/fotos → publica a WordPress vía **REST API de WP con Application Passwords** (sin compartir usuarios)
- Pedidos de WhatsApp: el dueño los registra en el panel (cliente, platos, estado). Futuro: webhook de WhatsApp Business API
- Auth: Laravel Breeze + `spatie/laravel-permission` + 2FA; acceso solo desde la IP del negocio o VPN (Tailscale) si se quiere extra
- Backups: volumen de MySQL + wp-content con script cron (restic → BorgBase/Drive)

## Fases (espejo del flujo usado en esta sesión)

1. **Definir** — done (este documento) + cuestionario cliente (preguntas-cliente.md)
2. **Preparar carpetas** — `dashboard/` (Laravel) + `wordpress/` + `docker/` (compose, nginx) + `.env.example`
3. **Preview local** — Docker Compose con `admin.localhost:8081` y `www.localhost:8082`, mismo stack que producción
4. **Build** — CRUDs Filament (menú, precios, horarios, ubicación, fotos, pedidos) + sync a WP + i18n ES/EN
5. **Docs cliente** — guía "cómo usar el panel" en PDF/DOCX (plantilla word-doc-style Jetfuel)
6. **Producción** — VPS Hetzner: dominio, certificados (Caddy o nginx+Let's Encrypt), backups, deploy script

## Coste mensual estimado

- VPS Hetzner (CX22 o similar): ~5 €/mes
- Dominio donramontje.com: ~10 €/año
- Todo el software: gratis (WordPress, Laravel, Filament, MySQL)

## Riesgos y notas

- WordPress necesita actualizaciones de seguridad mensuales (se puede automatizar con CLI en cron)
- Si en el futuro el cliente NO edita nada de la web pública, se puede volver a la Opción B (estática + dashboard) sin perder el trabajo del dashboard
- El QR del menú apunta a la web pública; si se migra a WP, re-generar el QR con la nueva URL del menú
