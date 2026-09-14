# Plan de opciones — Sistema Don Ramon Jetfuel (dashboard + sitio)

> Documento de decisión. Presenta 3 opciones comparables para que elijamos (tú, el desarrollador,
> y luego el cliente con su guía). Todas respetan el proyecto actual: **no se toca** `site/`, `preview/` ni `img/`.
> Cifras de coste en €/US$ aproximadas, fuentes en `deepsearch-notes.md`.

---

## Contexto en una frase para el cliente

"Tu web actual ya está funcionando y es rápida. Lo nuevo es un **panel privado** (dashboard) donde tú mismo
puedas cambiar el menú, los precios, los horarios, subir fotos y ver los pedidos que te llegan por WhatsApp,
sin depender de un programador cada vez."

---

## Opción A — WordPress público + Laravel/Filament como dashboard (todo en Docker)

**Qué es:** WordPress pasa a ser la web pública (el cliente la edita solo: páginas, fotos, avisos, incluso blog).
Laravel + Filament es el panel de administración. Ambos corren en el mismo servidor VPS con Docker Compose
(nginx reparte por subdominio: `donramontje.cw` → WordPress, `admin.donramontje.cw` → dashboard).
El menú del dashboard puede publicarse hacia WP vía REST API o Corcel (misma BD MySQL).

**Pros**
- El cliente lo controla TODO: web pública + menú + pedidos sin tocar código.
- WordPress es lo más conocido del mundo; hay plantillas bonitas baratas y plugins de SEO.
- Filament es gratis: CRUDs de menú, horarios, galería y pedidos en días de trabajo.

**Contras**
- Hay que migrar/rediseñar el sitio actual a WP (o convivir un tiempo con ambos).
- WP añade mantenimiento: actualizaciones, plugins, seguridad (es el CMS más atacado del mundo).
- Coste mensual mayor: hosting + WP bien cacheado pide ~10–25 €/mes para ir rápido.
- Dos sistemas que mantener a largo plazo.

**Coste:** ~5–10 €/mes hosting (Hetzner) + dominio + ~15–25 h de desarrollo para WP + dashboard base.
**Esfuerzo:** ALTO-MEDIO. **Riesgo:** MEDIO (mantenimiento WP).

**Elegir A si:** el cliente quiere publicar contenido libre (blog/noticias) y editar su web 100 % solo.

---

## Opción B — Mantener el sitio estático actual + Laravel/Filament como dashboard aparte  ⭐ RECOMENDADA

**Qué es:** No se toca la web estática (sigue en su hosting actual, rápida y gratis).
Se construye un panel privado Laravel + Filament con su propia base de datos:
- **Menú y precios** (mismos campos que hoy edita `data.js` a mano).
- **Horarios y ubicación** (con estado "abierto/cerrado").
- **Pedidos por WhatsApp** (el cliente los registra o llegan vía formulario de la web → WhatsApp/panel).
- **Galería de fotos** (subir/ordenar las fotos del food truck).
- El panel puede **exportar/regenerar el `data.js` del sitio estático**, de modo que el cliente edite en el panel y la web pública se actualice sola (sin WP).

**Pros**
- El sitio actual no se toca: cero riesgo, cero migración, sigue siendo rapidísimo.
- Coste mínimo: solo el VPS del dashboard (~5 €/mes Hetzner) o incluso una cuenta Fly.io/Railway barata.
- Todo el control real (menú/precios/horarios/fotos) queda en UNA sola herramienta nueva y sencilla.
- Sin WordPress → sin plugins que parchear, sin superficie de ataque extra.

**Contras**
- Si el cliente quiere escribir textos largos/noticias en la web, seguirá necesitando al desarrollador
  (se resuelve con el flujo de exportar `data.js` + pequeñas peticiones puntuales).

**Coste:** ~5 €/mes hosting + ~10–15 h de desarrollo (Filament hace el 80 % solo).
**Esfuerzo:** MEDIO-BAJO. **Riesgo:** BAJO.

**Elegir B si:** el cliente solo necesita gestionar negocio (menú, precios, horarios, fotos, pedidos)
y la web actual ya le gusta. ← **Caso más probable.**

---

## Opción C — Solo WordPress (sin Laravel)

**Qué es:** Olvidar Laravel. Todo con WordPress: web pública + plugins para menú de restaurante
(p. ej. "Restaurant Menu by MotoPress"), pedidos por WhatsApp (formulario + click-to-chat),
horarios y galería (la galería nativa de WP).

**Pros**
- Un solo sistema, lo más estándar posible; el cliente edita todo desde el panel de WP.
- Sin desarrollo a medida: se monta con plantilla + plugins en horas.
- Mucha gente disponible en el mercado para dar soporte.

**Contras**
- La "gestión de pedidos" queda limitada a lo que den los plugins (no hay historial de pedidos propio
  ni estadísticas reales; cada plugin es otra licencia y otro punto de mantenimiento).
- Rendimiento y seguridad dependen de hosting WP decente (10–25 €/mes) y mantenimiento constante.
- Renuncia al control a medida: si mañana quiere "pedidos recurrentes", "promos automáticas" o
  "estadísticas de ventas", WordPress no lo da bien.

**Coste:** hosting WP 10–25 €/mes + plantilla 0–80 € + plugins 100–300 €/año. Desarrollo inicial: 5–10 h.
**Esfuerzo:** BAJO al inicio, ALTO en mantenimiento. **Riesgo:** MEDIO (seguridad/plugins).

**Elegir C si:** el presupuesto manda por encima de todo y no se prevé crecer en funciones de gestión.

---

## Tabla comparativa

| | A: WP + Laravel/Filament | B: Estático + Laravel/Filament ⭐ | C: Solo WordPress |
|---|---|---|---|
| Web pública | WP (cliente la edita) | Estática actual (ya hecha) | WP |
| Panel de negocio | Filament (a medida) | Filament (a medida) | Plugins de WP |
| Coste inicial | ~15–25 h | ~10–15 h | ~5–10 h |
| Coste mensual | ~10–25 € | ~5 € | ~10–25 € |
| Licencias de software | 0 € | 0 € | 100–300 €/año |
| Mantenimiento | Alto (WP + Laravel) | Bajo (solo Laravel) | Alto (WP + plugins) |
| Control de pedidos/estadísticas | Total | Total | Limitado |
| Riesgo para el proyecto actual | Alto (migrar sitio) | Nulo | Alto (rehacer sitio en WP) |

---

## Recomendación clara

**Opción B.** El sitio actual ya resuelve la parte pública mejor que WordPress (más rápido, gratis, ya está
en producción y al cliente le gusta). Lo que falta es exactamente lo que Laravel + Filament hace mejor:
un panel privado donde el dueño cambie menú, precios, horarios y fotos, y donde se apunten los pedidos
que entran por WhatsApp. Con el botón "publicar", el panel puede regenerar el `data.js` del sitio estático
y la web se actualiza sola. **Cero migración, cero plugins, coste mínimo.**

**Cuándo cambiar de opinión:** si en las respuestas del cuestionario (`preguntas-cliente.md`) el cliente
dice que quiere escribir noticias/blog con frecuencia o editar él mismo la web entera, subimos a la **Opción A**
(misma arquitectura Docker, añadiendo el contenedor de WordPress). **La buena noticia: B y A comparten el 80 %
del trabajo**, así que empezar por B no descarta nada.
