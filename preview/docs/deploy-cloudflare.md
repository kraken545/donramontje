# Deploy — Don Ramon Jetfuel en Cloudflare Pages (gratis)

El repo ya está en GitHub: `https://github.com/kraken545/donramontje` (público, rama `main`).
El sitio desplegable está en la carpeta `site/` (HTML+CSS+JS puro, sin build).

## Opción A — Dashboard (recomendado, despliegue automático con cada push)

1. Entra en https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Autoriza GitHub y selecciona el repo `kraken545/donramontje`
3. Configuración de build:
   - Build command: *(vacío)*
   - Build output directory: `site`
4. **Save and Deploy**

Resultado: `https://donramontje.pages.dev` (SSL automático). Cada `git push` a `main` redespliega solo.

El archivo `site/_headers` aplica las reglas de caché automáticamente (Cloudflare lo lee tal cual).

## Opción B — CLI (wrangler)

```bash
npx wrangler login
npx wrangler pages project create donramontje --production-branch=main
npx wrangler pages deploy site --project-name donramontje
```

## Dominio propio (opcional, gratis)

1. Compra el dominio (p. ej. donramontje.com) donde sea
2. Cloudflare Pages → proyecto → **Custom domains** → añade el dominio
3. Apunta los DNS en Cloudflare (se hace solo si el dominio está en CF)

## JSON-LD / SEO

`site/index.html` incluye datos estructurados (FoodEstablishment). Si se usa dominio propio,
actualizar la URL en el bloque `<script type="application/ld+json">` (campo `"menu"`).
