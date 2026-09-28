# Tarea 4 — Pokédex (Nuxt 3 + Pinia + Nuxt Content)

Proyecto que cumple los 7 puntos de la Tarea 4:

1. **Dataset CSV** (`content/pokemon.csv`): encabezados en minúscula, sin
   espacios y con columna identificadora `id` (columnas: `id, dex, name, type1,
   type2, hp, attack, defense, speed, generation, legendary`; `legendary` es 0/1). Declarado como colección de
   tipo `data` en `content.config.ts` (módulo `@nuxt/content`).
2. **Store de Pinia** (`stores/pokemon.ts`): acción `fetchAll()` para el
   listado completo y `fetchOne(id)` para un registro individual. El listado
   (`pages/pokemon/index.vue`) se pinta desde el store y cada tarjeta enlaza
   a `/pokemon/:id`.
3. **Página de detalle** (`pages/pokemon/[id].vue`): muestra todos los
   campos del registro y enlaces al registro **anterior** y **siguiente**
   (getters `previousPokemon` / `nextPokemon` del store).
4. **Getter de promedio**: `averageHp` calcula el promedio de HP sobre todo
   el listado y se muestra en la barra superior de la página de listado.
5. **Favoritos persistentes**: `toggleFavorite(id)` en el store, marcado
   con `persist: { pick: ['favorites'], storage: piniaPluginPersistedstate.cookies() }`
   (módulo `pinia-plugin-persistedstate/nuxt`), así que sobreviven al
   recargar la página (se guardan en una cookie).
6. **Despliegue**: instrucciones para Vercel o Netlify más abajo.
7. **Entrega**: instrucciones de empaquetado en ZIP sin `node_modules`.

> **Imágenes:** cada Pokémon muestra su arte oficial, cargado desde el
> repositorio público PokeAPI/sprites usando la columna `dex` (n.º real de la
> Pokédex). Requiere internet; si una imagen no carga se muestra un "?".
>
> **Notas técnicas:** Nuxt Content devuelve el `id` de cada fila como texto y
> convierte cualquier texto a booleano de forma incorrecta ("false" → true), por
> eso el store convierte los registros a tipos reales (`toPokemon`) y
> `legendary` se guarda como 0/1.
>
> El dataset incluido es una muestra reducida en el mismo formato de un
> dataset típico de Kaggle ("Pokemon with stats"). Si el enunciado exige
> descargar el CSV exacto desde Kaggle, reemplaza
> `content/pokemon.csv` por el archivo descargado (respetando encabezados
> en minúscula, sin espacios, y una columna `id`) y ajusta el `schema` en
> `content.config.ts` si cambian las columnas.

## Stack

- Nuxt 3
- @nuxt/content v3 (colección `type: 'data'`)
- Pinia + @pinia/nuxt
- pinia-plugin-persistedstate (cookies)

## Probar localmente

Requisitos: Node.js 22.5+ (o 24) y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar en modo desarrollo
npm run dev
# abre http://localhost:3000
```

Rutas a probar:

- `/` — página de inicio
- `/pokemon` — listado completo, promedio de HP y filtro de favoritos
- `/pokemon/6` — detalle de un registro, con navegación anterior/siguiente
- Marca algún favorito (★) y recarga la página: debe seguir marcado
  (se guarda en una cookie vía `pinia-plugin-persistedstate`).

Para probar el build de producción localmente:

```bash
npm run build
node .output/server/index.mjs
# abre http://localhost:3000
```

### Nota: SQLite nativo (sin `better-sqlite3`)

`@nuxt/content` v3 necesita SQLite. Este proyecto usa el SQLite integrado
de Node (`experimental: { sqliteConnector: 'native' }` en `nuxt.config.ts`),
por lo que **no se instala ni compila ningún módulo nativo** (no hace falta
Visual Studio en Windows). Requiere **Node.js >= 22.5** (recomendado 22 o 24 LTS).
En Vercel/Netlify configura la versión de Node en 22.x o superior.

## Deploy

### Opción A: Vercel

1. Sube el proyecto a un repositorio de GitHub (sin `node_modules`).
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el
   repositorio.
3. Vercel detecta Nuxt automáticamente (Framework Preset: Nuxt.js).
   Deja el build command por defecto (`nuxt build`) y el output
   (`.output/public` para estáticos / preset `vercel` para SSR, Vercel lo
   resuelve solo).
4. Deploy. Al finalizar obtienes una URL pública (`https://tu-proyecto.vercel.app`).

También puedes hacerlo desde la CLI:

```bash
npm i -g vercel
vercel login
vercel        # deploy de prueba
vercel --prod # deploy de producción
```

### Opción B: Netlify

El proyecto ya incluye `netlify.toml` con la configuración necesaria
(usa el plugin oficial `@netlify/plugin-nuxt`, que Netlify instala solo).

1. Sube el proyecto a GitHub.
2. En [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → selecciona el repositorio.
3. Netlify detecta `netlify.toml` automáticamente. Deploy.
4. Obtienes una URL pública (`https://tu-sitio.netlify.app`).

CLI alternativa:

```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Entregables para el Aula Virtual

1. **Enlace del sitio publicado** (Vercel o Netlify).
2. **Archivo ZIP** con el código fuente, **sin `node_modules`**. Generarlo así:

```bash
# desde la carpeta del proyecto, con node_modules, .nuxt, .output y .git excluidos
zip -r tarea4-nuxt.zip . \
  -x "node_modules/*" \
  -x ".nuxt/*" \
  -x ".output/*" \
  -x ".git/*"
```

   (En este entorno ya se generó `tarea4-nuxt.zip` listo para subir.)

## Estructura del proyecto

```
tarea4-nuxt/
├── content/
│   └── pokemon.csv          # dataset (colección "data")
├── content.config.ts         # definición de la colección
├── stores/
│   └── pokemon.ts            # store de Pinia (listado, detalle, promedio, favoritos)
├── pages/
│   ├── index.vue
│   └── pokemon/
│       ├── index.vue         # listado
│       └── [id].vue          # detalle + anterior/siguiente
├── assets/main.css
├── nuxt.config.ts
├── netlify.toml
└── package.json
```
