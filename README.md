# Clínica Miró.ai — Landing minimalista (Next.js + Tailwind + Monda + Dentalink)

### Características
- Fondo negro/azul muy oscuro, tipografía **Monda** en blanco mate.
- Botones y títulos en **azul neón** con glow.
- Formulario de agenda conectado a **API Dentalink**: busca/crea paciente y crea **cita**.
- Listo para **Vercel**.

---
## Requisitos
- Node 18+
- Token Dentalink (`Authorization: Token <TOKEN>`)

## Instalación
```bash
npm i
npm run dev
```

## Variables de entorno
Crea `.env` basado en `.env.example`:
```bash
DENTALINK_TOKEN=tu_token
```

## Deploy en Vercel
1. Sube este repo a GitHub.
2. Importa en Vercel → añade `DENTALINK_TOKEN` en Project Settings → Environment Variables.
3. Deploy.

## Ajustes importantes
- Reemplaza el número de WhatsApp en:
  - `/pages/index.js` (link visible)
  - `/pages/api/agendar.js` (mensaje post-agenda)
- Ajusta los campos requeridos por tu **instancia Dentalink** para `/pacientes` y `/citas` (pueden variar según cuenta).
- Si tu Dentalink requiere `hora` o `profesional_id`, añádelo en el body de `/citas`.

---
## Estructura
```
public/fonts/Monda.woff
pages/_app.js
pages/index.js
pages/api/agendar.js
styles/globals.css
tailwind.config.js
postcss.config.js
next.config.js
```
