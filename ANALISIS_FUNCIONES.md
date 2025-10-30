# Análisis de Funciones - Clínica Miró.ai

## Resumen Ejecutivo
Este documento proporciona un análisis detallado de todas las funciones en el proyecto Clínica Miró.ai, una landing page con integración a la API de Dentalink para agendamiento de citas médicas.

---

## Estructura del Proyecto

```
miro.ia/
├── pages/
│   ├── _app.js              # Configuración global de Next.js
│   ├── index.js             # Página principal (Home)
│   └── api/
│       └── agendar.js       # API endpoint para agendamiento
├── styles/
│   └── globals.css          # Estilos globales con Tailwind
├── public/
│   └── fonts/
│       └── Monda.woff       # Tipografía personalizada
└── [configuración]          # Archivos de configuración de Next.js y Tailwind
```

---

## 1. Funciones del Frontend

### 1.1. `Home()` - Componente Principal
**Ubicación:** `pages/index.js`  
**Tipo:** React Component (Función)  
**Propósito:** Renderiza la página principal de la landing page

#### Descripción:
Componente funcional de React que renderiza la interfaz completa de usuario incluyendo:
- Hero section con título y descripción
- Sección de agenda con formulario de reserva
- Footer con información de copyright

#### Estructura:
```javascript
export default function Home()
```

#### Elementos renderizados:
1. **Hero Section:**
   - Título: "Clínica Miró.ai"
   - Descripción: "La primera clínica híbrida con inteligencia artificial de Latinoamérica"
   - Botón CTA: "Agenda tu evaluación" (enlace a #agenda)

2. **Sección de Agenda:**
   - Título: "Reserva online"
   - Formulario con campos:
     * Nombre (requerido)
     * RUT (requerido, formato: 17.190.250-9)
     * Teléfono (requerido, formato: +56 9 1234 5678)
     * Fecha (requerido, tipo date)
   - Botón de envío: "Confirmar cita"
   - Enlace alternativo a WhatsApp
   - Disclaimer legal

3. **Footer:**
   - Copyright dinámico con año actual

#### Dependencias:
- `handleSubmit`: Función asíncrona para manejar el envío del formulario

#### Estilos aplicados:
- Clases de Tailwind CSS personalizadas
- Colores: neon (#00f0ff), dark (#020617), whiteMate (#f8fafc)
- Efectos: drop-shadow con glow effect

---

### 1.2. `handleSubmit(e)` - Manejo de Envío de Formulario
**Ubicación:** `pages/index.js`  
**Tipo:** Async Function  
**Propósito:** Procesar y enviar datos del formulario de agendamiento

#### Firma:
```javascript
async function handleSubmit(e)
```

#### Parámetros:
- `e` (Event): Evento del formulario

#### Flujo de ejecución:

1. **Prevención de comportamiento por defecto:**
   ```javascript
   e.preventDefault();
   ```
   Evita que el formulario se envíe de forma tradicional (recarga de página)

2. **Extracción de datos:**
   ```javascript
   const data = Object.fromEntries(new FormData(e.target));
   ```
   - Convierte FormData a objeto plano
   - Captura: nombre, rut, telefono, fecha

3. **Llamada a API:**
   ```javascript
   const res = await fetch("/api/agendar", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(data),
   });
   ```
   - Endpoint: `/api/agendar`
   - Método: POST
   - Content-Type: application/json

4. **Procesamiento de respuesta:**
   ```javascript
   const result = await res.json();
   alert(result.message || "Cita agendada con éxito");
   ```
   - Muestra mensaje de confirmación
   - Mensaje por defecto si no hay respuesta específica

5. **Redirección a WhatsApp (opcional):**
   ```javascript
   if (result?.whatsapp_link) {
     window.location.href = result.whatsapp_link;
   }
   ```
   - Si la API devuelve un link de WhatsApp, redirige automáticamente

#### Manejo de errores:
```javascript
catch (err) {
  console.error(err);
  alert("Error al agendar cita");
}
```
- Registra el error en consola
- Muestra alerta genérica al usuario

#### Valores esperados de retorno de API:
```javascript
{
  message: string,        // Mensaje de confirmación
  whatsapp_link?: string  // URL opcional de WhatsApp
}
```

---

## 2. Funciones del Backend (API)

### 2.1. `handler(req, res)` - API Endpoint de Agendamiento
**Ubicación:** `pages/api/agendar.js`  
**Tipo:** Next.js API Route Handler (Async Function)  
**Propósito:** Procesar solicitudes de agendamiento e integrar con Dentalink API

#### Firma:
```javascript
export default async function handler(req, res)
```

#### Parámetros:
- `req` (NextApiRequest): Objeto de solicitud HTTP
- `res` (NextApiResponse): Objeto de respuesta HTTP

#### Flujo completo de ejecución:

#### 2.1.1. Validación de método HTTP
```javascript
if (req.method !== "POST") 
  return res.status(405).json({ message: "Método no permitido" });
```
- Solo acepta solicitudes POST
- Status code: 405 (Method Not Allowed)

#### 2.1.2. Validación de datos de entrada
```javascript
const { nombre, rut, telefono, fecha } = req.body || {};
if (!nombre || !rut || !telefono || !fecha) {
  return res.status(400).json({ message: "Faltan datos obligatorios" });
}
```
- Campos requeridos: nombre, rut, telefono, fecha
- Status code: 400 (Bad Request)

#### 2.1.3. Validación de credenciales
```javascript
const token = process.env.DENTALINK_TOKEN;
if (!token) 
  return res.status(500).json({ message: "Falta DENTALINK_TOKEN en el servidor" });
```
- Verifica variable de entorno DENTALINK_TOKEN
- Status code: 500 (Internal Server Error)

#### 2.1.4. Configuración de API base
```javascript
const baseUrl = "https://api.dentalink.healthatom.com/api/v1";
```
- URL base de la API de Dentalink

### 2.2. Operación 1: Búsqueda de Paciente

#### Descripción:
Busca un paciente existente en Dentalink usando el RUT

#### Código:
```javascript
const searchUrl = `${baseUrl}/pacientes?rut=${encodeURIComponent(rut)}`;
let pacienteRes = await fetch(searchUrl, {
  headers: { Authorization: `Token ${token}` },
});
```

#### Detalles:
- **Endpoint:** `GET /api/v1/pacientes?rut={rut}`
- **Headers:** `Authorization: Token {DENTALINK_TOKEN}`
- **Query param:** rut (URL encoded)

#### Manejo de errores:
```javascript
if (!pacienteRes.ok) {
  const msg = await pacienteRes.text();
  return res.status(502).json({ 
    message: "Error al buscar paciente", 
    detail: msg 
  });
}
```
- Status code: 502 (Bad Gateway)
- Incluye detalles del error de Dentalink

#### Procesamiento de resultado:
```javascript
const pacientes = await pacienteRes.json();
let pacienteId = pacientes?.[0]?.id;
```
- Extrae el ID del primer paciente encontrado
- `pacienteId` será `undefined` si no existe

---

### 2.3. Operación 2: Creación de Paciente (Condicional)

#### Condición:
```javascript
if (!pacienteId) { ... }
```
Solo se ejecuta si el paciente no existe en el sistema

#### Código:
```javascript
const createPacienteRes = await fetch(`${baseUrl}/pacientes`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  },
  body: JSON.stringify({
    nombre,
    rut,
    telefono,
  }),
});
```

#### Detalles:
- **Endpoint:** `POST /api/v1/pacientes`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Token {DENTALINK_TOKEN}`
- **Body:**
  ```json
  {
    "nombre": "string",
    "rut": "string",
    "telefono": "string"
  }
  ```

#### Manejo de errores:
```javascript
if (!createPacienteRes.ok) {
  const msg = await createPacienteRes.text();
  return res.status(502).json({ 
    message: "Error al crear paciente", 
    detail: msg 
  });
}
```

#### Procesamiento de resultado:
```javascript
const nuevoPaciente = await createPacienteRes.json();
pacienteId = nuevoPaciente.id;
```
- Extrae el ID del paciente recién creado
- Asigna a `pacienteId` para uso posterior

---

### 2.4. Operación 3: Creación de Cita

#### Código:
```javascript
const createCitaRes = await fetch(`${baseUrl}/citas`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  },
  body: JSON.stringify({
    paciente_id: pacienteId,
    fecha, // YYYY-MM-DD
    motivo: "Evaluación inicial IA",
  }),
});
```

#### Detalles:
- **Endpoint:** `POST /api/v1/citas`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Token {DENTALINK_TOKEN}`
- **Body:**
  ```json
  {
    "paciente_id": number,
    "fecha": "YYYY-MM-DD",
    "motivo": "Evaluación inicial IA"
  }
  ```

#### Manejo de errores:
```javascript
if (!createCitaRes.ok) {
  const msg = await createCitaRes.text();
  return res.status(502).json({ 
    message: "Error al crear cita", 
    detail: msg 
  });
}
```

---

### 2.5. Generación de Link de WhatsApp

#### Código:
```javascript
const whatsapp_link = `https://wa.me/56900000000?text=${encodeURIComponent(
  `Hola, soy ${nombre}. Ya solicité evaluación el ${fecha}. Mi RUT: ${rut}`
)}`;
```

#### Detalles:
- **Número de WhatsApp:** 56900000000 (configurable)
- **Mensaje prellenado:**
  ```
  Hola, soy {nombre}. Ya solicité evaluación el {fecha}. Mi RUT: {rut}
  ```
- **Encoding:** URL encoded para caracteres especiales

---

### 2.6. Respuesta exitosa

#### Código:
```javascript
return res.status(200).json({ 
  message: "Cita registrada en Dentalink", 
  whatsapp_link 
});
```

#### Detalles:
- **Status code:** 200 (OK)
- **Response body:**
  ```json
  {
    "message": "Cita registrada en Dentalink",
    "whatsapp_link": "https://wa.me/56900000000?text=..."
  }
  ```

---

### 2.7. Manejo de errores generales

#### Código:
```javascript
catch (error) {
  console.error(error);
  return res.status(500).json({ 
    message: "Error conectando con Dentalink", 
    error: String(error) 
  });
}
```

#### Detalles:
- Captura cualquier error no manejado
- Registra en consola del servidor
- Status code: 500 (Internal Server Error)
- Incluye detalles del error en respuesta

---

## 3. Funciones de Configuración

### 3.1. `App({ Component, pageProps })` - Wrapper de Next.js
**Ubicación:** `pages/_app.js`  
**Tipo:** React Component (Función)  
**Propósito:** Configuración global de la aplicación Next.js

#### Código:
```javascript
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

#### Parámetros:
- `Component`: Página actual a renderizar
- `pageProps`: Props de la página

#### Funcionalidad:
- Importa estilos globales (Tailwind CSS)
- Envuelve todas las páginas
- Pasa props a los componentes de página

---

## 4. Flujo de Datos Completo

### 4.1. Usuario → Frontend
1. Usuario completa formulario
2. Click en "Confirmar cita"
3. `handleSubmit()` captura evento

### 4.2. Frontend → Backend
1. `handleSubmit()` extrae datos del formulario
2. Realiza fetch POST a `/api/agendar`
3. Envía JSON: `{ nombre, rut, telefono, fecha }`

### 4.3. Backend → Dentalink API
1. `handler()` valida método, datos y credenciales
2. **Paso 1:** Busca paciente por RUT
   - GET `/pacientes?rut={rut}`
3. **Paso 2 (condicional):** Crea paciente si no existe
   - POST `/pacientes`
   - Body: `{ nombre, rut, telefono }`
4. **Paso 3:** Crea cita
   - POST `/citas`
   - Body: `{ paciente_id, fecha, motivo }`

### 4.4. Backend → Frontend
1. `handler()` genera link de WhatsApp
2. Retorna JSON: `{ message, whatsapp_link }`

### 4.5. Frontend → Usuario
1. `handleSubmit()` recibe respuesta
2. Muestra alert con mensaje
3. Redirige a WhatsApp (si hay link)

---

## 5. Variables de Entorno

### 5.1. DENTALINK_TOKEN
**Tipo:** String  
**Requerido:** Sí  
**Ubicación:** `.env` o configuración de Vercel  
**Uso:** Autenticación con API de Dentalink

**Ejemplo:**
```bash
DENTALINK_TOKEN=tu_token_aqui
```

---

## 6. Dependencias Externas

### 6.1. APIs Externas
- **Dentalink API:** `https://api.dentalink.healthatom.com/api/v1`
- **WhatsApp API:** `https://wa.me/` (deep linking)

### 6.2. Librerías JavaScript
- **Next.js 14.0.0:** Framework React
- **React 18.2.0:** Biblioteca UI
- **Tailwind CSS 3.4.4:** Framework CSS

---

## 7. Códigos de Estado HTTP

### Respuestas de éxito:
- **200:** Operación exitosa
- **201:** Recurso creado (implícito en Dentalink)

### Respuestas de error del cliente:
- **400:** Faltan datos obligatorios
- **405:** Método HTTP no permitido

### Respuestas de error del servidor:
- **500:** Error interno o token faltante
- **502:** Error al comunicarse con Dentalink

---

## 8. Seguridad

### 8.1. Validaciones implementadas:
- ✅ Validación de método HTTP
- ✅ Validación de campos requeridos
- ✅ Validación de token de autenticación
- ✅ URL encoding de parámetros

### 8.2. Consideraciones de seguridad:
- ⚠️ Token almacenado en variable de entorno
- ⚠️ No hay validación de formato de RUT
- ⚠️ No hay validación de formato de teléfono
- ⚠️ No hay rate limiting
- ⚠️ No hay sanitización de inputs

### 8.3. Recomendaciones:
1. Implementar validación de formato de RUT chileno
2. Validar formato internacional de teléfono
3. Agregar rate limiting para prevenir abuso
4. Implementar CAPTCHA para prevenir bots
5. Sanitizar inputs antes de enviar a Dentalink
6. Implementar logging de errores más robusto

---

## 9. Configuración Personalizable

### 9.1. Número de WhatsApp
**Ubicación:** 
- `pages/index.js` línea 32
- `pages/api/agendar.js` línea 69

**Valor actual:** `56900000000`

**Cambiar a:**
```javascript
// En index.js
<a href="https://wa.me/TU_NUMERO_AQUI">

// En agendar.js
const whatsapp_link = `https://wa.me/TU_NUMERO_AQUI?text=...`
```

### 9.2. Motivo de cita
**Ubicación:** `pages/api/agendar.js` línea 60

**Valor actual:** `"Evaluación inicial IA"`

**Personalizar:**
```javascript
motivo: "Tu motivo personalizado aquí"
```

### 9.3. Campos de Dentalink
**Nota:** Los campos pueden variar según tu cuenta de Dentalink

**Campos adicionales posibles:**
- `hora`: Hora de la cita
- `profesional_id`: ID del profesional
- `especialidad`: Especialidad médica
- `duracion`: Duración en minutos

---

## 10. Mejoras Propuestas

### 10.1. Funcionalidad
1. Agregar selección de horario
2. Agregar selección de profesional
3. Agregar selección de especialidad
4. Implementar calendario visual
5. Agregar confirmación por email

### 10.2. Experiencia de Usuario
1. Agregar loading states
2. Mejorar mensajes de error
3. Agregar validación en tiempo real
4. Agregar tooltips informativos
5. Implementar formulario multi-paso

### 10.3. Técnicas
1. Agregar tests unitarios
2. Agregar tests de integración
3. Implementar retry logic
4. Agregar cache de respuestas
5. Implementar queue para procesamiento asíncrono

---

## 11. Diagrama de Flujo

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ Completa formulario
       ▼
┌─────────────────────┐
│   handleSubmit()    │
└──────┬──────────────┘
       │ POST /api/agendar
       ▼
┌─────────────────────┐
│   handler()         │
│   - Valida datos    │
└──────┬──────────────┘
       │
       ├─── GET /pacientes?rut={rut}
       │    (Buscar paciente)
       │
       ├─── POST /pacientes
       │    (Crear si no existe)
       │
       └─── POST /citas
            (Crear cita)
            │
            ▼
       ┌──────────────┐
       │  Dentalink   │
       │     API      │
       └──────┬───────┘
              │ Respuesta
              ▼
       ┌──────────────────┐
       │ Generar WhatsApp │
       │      link        │
       └──────┬───────────┘
              │ Retornar JSON
              ▼
       ┌──────────────────┐
       │  handleSubmit()  │
       │  - Mostrar alert │
       │  - Redirigir WA  │
       └──────────────────┘
```

---

## 12. Conclusión

El sistema implementa un flujo completo de agendamiento de citas médicas con las siguientes características:

**Fortalezas:**
- ✅ Integración directa con Dentalink
- ✅ Experiencia de usuario fluida
- ✅ Fallback a WhatsApp
- ✅ Manejo de errores básico
- ✅ Diseño responsive y moderno

**Áreas de mejora:**
- ⚠️ Validación de datos de entrada
- ⚠️ Seguridad y rate limiting
- ⚠️ Tests automatizados
- ⚠️ Manejo de errores más granular
- ⚠️ Logging y monitoreo

**Estado del proyecto:**
El proyecto está funcional y listo para deploy en Vercel, cumpliendo con los requisitos básicos de un sistema de agendamiento web.
