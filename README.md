# Lab 10 - Next.js SSG, ISR, SSR y CSR

Aplicacion desarrollada con Next.js 16 para el laboratorio de Desarrollo de Aplicaciones Web Avanzado. El proyecto implementa rutas estaticas y dinamicas, consumo de APIs externas, cache, ISR, CSR, manejo de errores y despliegue en Render.

## Deploy

Aplicacion publicada:

https://lab10-dawa-fernandomas.onrender.com

## APIs utilizadas

### Rick and Morty API

Documentacion oficial:

https://rickandmortyapi.com/documentation/#character

Endpoints usados:

```text
https://rickandmortyapi.com/api/character
https://rickandmortyapi.com/api/character/1
https://rickandmortyapi.com/api/character/?name=rick
```

### PokeAPI

Endpoints usados:

```text
https://pokeapi.co/api/v2/pokemon?limit=151
https://pokeapi.co/api/v2/pokemon/{name}
```

## Funcionalidades

### Rick and Morty

Ruta principal:

```text
/rick_morty
```

Caracteristicas:

- Lista inicial de personajes consumida desde Server Component.
- Peticion inicial con `cache: "force-cache"` para comportamiento tipo SSG.
- Busqueda en tiempo real con CSR usando `useState` y `useEffect`.
- Filtros por `name`, `status`, `type` y `gender`.
- Ordenamiento por `A-Z`, `Z-A` y popularidad.
- Imagenes con `next/image` y carga lazy por defecto.
- UI inspirada en el diseno RickMania entregado en HTML.
- Justificacion tecnica visible en la pagina.

Ruta de detalle:

```text
/rick_morty/[id]
```

Caracteristicas:

- Detalle de cada personaje por ID.
- Campos mostrados: ID, tipo, estado, especie, genero, fecha de creacion, origen, locacion actual y apariciones.
- `generateStaticParams()` para generar rutas estaticas por personaje.
- ISR cada 10 dias usando:

```ts
export const revalidate = 864000;
```

- Cache local durante el build para evitar exceso de peticiones a la API y prevenir errores `429 Too Many Requests`.
- Apariciones compactas: se muestran 5 episodios y un boton para mostrar mas.

### Pokemon

Ruta principal:

```text
/pokemon
```

Caracteristicas:

- Lista de los primeros 151 Pokemon.
- ISR con `next: { revalidate: 86400 }`.
- Imagenes remotas con `next/image`.
- Error boundary con `app/pokemon/error.tsx`.

Ruta de detalle:

```text
/pokemon/[name]
```

Caracteristicas:

- Detalle por nombre del Pokemon.
- `generateStaticParams()` para generar rutas estaticas.
- Metadata dinamica por Pokemon.

## Manejo de errores

El proyecto incluye:

```text
app/pokemon/error.tsx
app/not-found.tsx
```

Uso:

- `error.tsx` se muestra cuando ocurre un error dentro del segmento `/pokemon`.
- `not-found.tsx` se muestra para rutas no existentes, por ejemplo `/pokemon-1`.

## Estructura de carpetas

Estructura principal del proyecto:

```text
.
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   ├── pokemon
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   └── [name]
│   │       └── page.tsx
│   └── rick_morty
│       ├── page.tsx
│       ├── RickMortyExplorer.tsx
│       └── [id]
│           ├── page.tsx
│           └── EpisodeList.tsx
├── src
│   ├── lib
│   │   └── rick-morty.ts
│   └── types
│       ├── pokemon.ts
│       └── rick-morty.ts
├── next.config.ts
├── package.json
└── README.md
```

Nota: la carpeta activa para rutas es `app/`. La carpeta `src/` se usa para tipos y librerias compartidas.

## Configuracion de imagenes remotas

En `next.config.ts` se permiten imagenes desde:

```text
raw.githubusercontent.com
rickandmortyapi.com
```

Esto es necesario para usar `next/image` con imagenes externas.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Render
- Rick and Morty API
- PokeAPI

## Ejecucion local

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

Validar TypeScript:

```bash
npx tsc --noEmit
```

Ejecutar lint:

```bash
npm run lint
```

Compilar:

```bash
npm run build
```

Ejecutar produccion local:

```bash
npm run start
```

## Despliegue en Render

Tipo de servicio:

```text
Web Service
```

Configuracion:

```text
Language: Node
Branch: main
Root Directory: vacio
Build Command: npm install && npm run build
Start Command: npm run start
```

No es necesario agregar manualmente la variable `PORT`; Render la configura automaticamente.

## Justificacion de renderizado

- SSG: la lista inicial de Rick and Morty usa `cache: "force-cache"` porque la primera pagina puede servirse cacheada.
- CSR: la busqueda usa `useState` y `useEffect` porque depende de lo que el usuario escribe y filtra en tiempo real.
- ISR: el detalle de personajes usa `revalidate = 864000` para regenerar datos cada 10 dias.
- SSR/Server Components: se usan para consumir datos desde el servidor y entregar contenido ya renderizado.
