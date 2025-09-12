export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Método no permitido" });

  const { nombre, rut, telefono, fecha } = req.body || {};
  if (!nombre || !rut || !telefono || !fecha) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  const token = process.env.DENTALINK_TOKEN;
  if (!token) return res.status(500).json({ message: "Falta DENTALINK_TOKEN en el servidor" });

  const baseUrl = "https://api.dentalink.healthatom.com/api/v1";

  try {
    // 1) Buscar paciente por RUT
    const searchUrl = `${baseUrl}/pacientes?rut=${encodeURIComponent(rut)}`;
    let pacienteRes = await fetch(searchUrl, {
      headers: { Authorization: `Token ${token}` },
    });

    if (!pacienteRes.ok) {
      const msg = await pacienteRes.text();
      return res.status(502).json({ message: "Error al buscar paciente", detail: msg });
    }
    const pacientes = await pacienteRes.json();
    let pacienteId = pacientes?.[0]?.id;

    // 2) Crear paciente si no existe
    if (!pacienteId) {
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
      if (!createPacienteRes.ok) {
        const msg = await createPacienteRes.text();
        return res.status(502).json({ message: "Error al crear paciente", detail: msg });
      }
      const nuevoPaciente = await createPacienteRes.json();
      pacienteId = nuevoPaciente.id;
    }

    // 3) Crear cita (ajusta campos según tu Dentalink)
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
    if (!createCitaRes.ok) {
      const msg = await createCitaRes.text();
      return res.status(502).json({ message: "Error al crear cita", detail: msg });
    }

    // Link opcional a WhatsApp con mensaje prellenado
    const whatsapp_link = `https://wa.me/56900000000?text=${encodeURIComponent(
      `Hola, soy ${nombre}. Ya solicité evaluación el ${fecha}. Mi RUT: ${rut}`
    )}`;

    return res.status(200).json({ message: "Cita registrada en Dentalink", whatsapp_link });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error conectando con Dentalink", error: String(error) });
  }
}
