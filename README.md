# kgame_Back

API y juego en tiempo real de **kgame**, un juego tipo Kahoot para repasar *Ética y
Legislación en TI* (proyecto final, UTEZ). Frontend: [kgame_Front](https://github.com/Chefs11/kgame_Front).

**Stack:** NestJS 12 · Socket.IO · PostgreSQL (TypeORM) · Vitest

## Requisitos
Node 22+, npm y Docker (para PostgreSQL).

## Puesta en marcha
```bash
cp .env.example .env
docker compose up -d        # PostgreSQL en el puerto 5432
npm install
npm run start:dev           # http://localhost:3000
```
Comprobación: `GET http://localhost:3000/health` → `{"status":"ok"}`.

## Scripts
| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Servidor con recarga |
| `npm run build` | Compila a `dist/` |
| `npm test` | Pruebas unitarias |
| `npm run test:e2e` | Pruebas e2e |
| `npm run lint` | Linter (oxlint) |

## Estructura
```
src/
  main.ts            arranque, CORS y validación global
  app.module.ts      configuración y conexión a PostgreSQL
  health/            endpoint de salud
  game/              gateway Socket.IO (salas por PIN)
```

## Eventos Socket.IO (base)
- `room:join` `{ pin, nickname }` → une al jugador a la sala y emite `player:joined`.
- `player:left` se emite al salir un jugador.

## Legal
Licencia MIT (ver `LICENSE`). Recursos de terceros en `ATTRIBUTIONS.md`.
Si se recaban datos de jugadores, el Aviso de Privacidad se publica en el frontend.
