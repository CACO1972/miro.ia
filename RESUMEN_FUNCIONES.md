# Resumen de Funciones - Clínica Miró.ai

## 📋 Índice Rápido

### Frontend (pages/index.js)
| Función | Tipo | Propósito |
|---------|------|-----------|
| `Home()` | React Component | Renderiza la página principal |
| `handleSubmit(e)` | Async Function | Procesa envío del formulario |

### Backend (pages/api/agendar.js)
| Función | Tipo | Propósito |
|---------|------|-----------|
| `handler(req, res)` | API Handler | Gestiona agendamiento vía Dentalink |

### Configuración (pages/_app.js)
| Función | Tipo | Propósito |
|---------|------|-----------|
| `App()` | React Component | Wrapper global de Next.js |

---

## 🔍 Descripción Breve de Funciones

### 1. `Home()` - Componente Principal
```javascript
export default function Home()
```
- **Renderiza:** Hero, formulario de agenda, footer
- **Campos del formulario:** nombre, RUT, teléfono, fecha
- **Interacción:** Llama a `handleSubmit()` al enviar

### 2. `handleSubmit(e)` - Envío de Formulario
```javascript
async function handleSubmit(e)
```
- **Entrada:** Evento del formulario
- **Proceso:**
  1. Previene recarga de página
  2. Extrae datos del formulario
  3. Envía POST a `/api/agendar`
  4. Muestra resultado
  5. Redirige a WhatsApp (si aplica)
- **Salida:** Alert con mensaje + redirección opcional

### 3. `handler(req, res)` - API de Agendamiento
```javascript
export default async function handler(req, res)
```
- **Entrada:** Request con datos del paciente
- **Proceso:**
  1. Valida método POST
  2. Valida campos obligatorios
  3. Valida token de Dentalink
  4. Busca paciente por RUT
  5. Crea paciente (si no existe)
  6. Crea cita
  7. Genera link de WhatsApp
- **Salida:** JSON con mensaje y link de WhatsApp

### 4. `App()` - Configuración Global
```javascript
export default function App({ Component, pageProps })
```
- **Entrada:** Componente de página y props
- **Proceso:** Importa estilos globales
- **Salida:** Renderiza página con estilos

---

## 🔄 Flujo de Datos

```
Usuario → Formulario → handleSubmit() → API /agendar → Dentalink
                                            ↓
Usuario ← WhatsApp ← Alert ← Respuesta ← handler()
```

---

## 🔑 Variables de Entorno

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `DENTALINK_TOKEN` | String | Token de autenticación para API Dentalink |

---

## 📡 Endpoints Utilizados

### Internos (Next.js)
- `POST /api/agendar` - Crear cita

### Externos (Dentalink)
- `GET /api/v1/pacientes?rut={rut}` - Buscar paciente
- `POST /api/v1/pacientes` - Crear paciente
- `POST /api/v1/citas` - Crear cita

---

## ⚡ Respuestas HTTP

| Código | Significado | Cuándo |
|--------|-------------|--------|
| 200 | Éxito | Cita creada correctamente |
| 400 | Bad Request | Faltan datos obligatorios |
| 405 | Method Not Allowed | Método HTTP incorrecto |
| 500 | Server Error | Error interno o token faltante |
| 502 | Bad Gateway | Error al comunicarse con Dentalink |

---

## 🛠️ Configuración Personalizable

### Número de WhatsApp
- **Ubicación 1:** `pages/index.js` línea 32
- **Ubicación 2:** `pages/api/agendar.js` línea 69
- **Valor actual:** `56900000000`

### Motivo de cita
- **Ubicación:** `pages/api/agendar.js` línea 60
- **Valor actual:** `"Evaluación inicial IA"`

---

## 📊 Estadísticas del Código

| Métrica | Valor |
|---------|-------|
| Total de funciones | 4 |
| Líneas de código (aprox.) | 150 |
| Archivos JavaScript | 3 |
| Llamadas a API externa | 3 |
| Validaciones | 5 |

---

## ✅ Checklist de Validaciones

### Frontend
- [x] Prevención de envío por defecto
- [x] Conversión de FormData a objeto
- [x] Manejo de errores con try/catch
- [x] Feedback al usuario (alerts)

### Backend
- [x] Validación de método HTTP
- [x] Validación de campos obligatorios
- [x] Validación de token
- [x] Manejo de paciente existente/nuevo
- [x] Manejo de errores de Dentalink

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor
npm start
```

---

## 📝 Notas Importantes

1. **RUT:** Se envía tal como el usuario lo ingresa (sin validación de formato)
2. **Fecha:** Debe ser formato YYYY-MM-DD
3. **Teléfono:** Se acepta cualquier formato
4. **WhatsApp:** Siempre redirige después de agendar
5. **Token:** Debe estar configurado en variables de entorno

---

## 🎯 Casos de Uso

### Caso 1: Paciente Nuevo
1. Usuario completa formulario
2. Sistema busca por RUT → No existe
3. Sistema crea paciente nuevo
4. Sistema crea cita
5. Usuario recibe confirmación y va a WhatsApp

### Caso 2: Paciente Existente
1. Usuario completa formulario
2. Sistema busca por RUT → Existe
3. Sistema usa ID existente
4. Sistema crea cita
5. Usuario recibe confirmación y va a WhatsApp

### Caso 3: Error en Dentalink
1. Usuario completa formulario
2. Sistema intenta comunicarse con Dentalink
3. Dentalink retorna error
4. Usuario recibe mensaje de error específico

---

## 🔒 Seguridad

### Implementado
- ✅ Token en variable de entorno
- ✅ Validación de método HTTP
- ✅ Validación de campos obligatorios
- ✅ URL encoding de parámetros

### Por implementar
- ⚠️ Validación de formato de RUT
- ⚠️ Validación de formato de teléfono
- ⚠️ Rate limiting
- ⚠️ CAPTCHA
- ⚠️ Sanitización de inputs

---

Documento generado: 30 de octubre de 2024
Versión: 1.0.0
