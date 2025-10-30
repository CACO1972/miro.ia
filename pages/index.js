export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-bold text-neon drop-shadow-[0_0_20px_#00f0ff]">
          Clínica Miró.ai
        </h1>
        <p className="mt-6 text-lg max-w-xl">
          La primera clínica híbrida con inteligencia artificial de Latinoamérica
        </p>
        <a href="#agenda" className="mt-8 btn-neon">
          Agenda tu evaluación
        </a>
      </section>

      {/* Agenda con API Dentalink */}
      <section id="agenda" className="py-20 text-center">
        <h2 className="text-3xl font-bold text-neon drop-shadow-[0_0_12px_#00f0ff]">
          Reserva online
        </h2>
        <p className="mt-3 text-gray-300">
          Reserva directo en Dentalink o vía WhatsApp
        </p>
        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto space-y-4">
          <input className="field" placeholder="Nombre" name="nombre" required />
          <input className="field" placeholder="RUT (ej: 17.190.250-9)" name="rut" required />
          <input className="field" placeholder="Teléfono (ej: +56 9 1234 5678)" name="telefono" required />
          <input type="date" className="field" name="fecha" required />
          <button type="submit" className="w-full btn-neon">Confirmar cita</button>
        </form>
        <a href="https://wa.me/56900000000" className="mt-6 inline-block text-neon underline">
          Prefiero WhatsApp
        </a>
        <p className="mt-4 text-xs text-gray-400">
          * La evaluación online orienta, no reemplaza diagnóstico presencial.
        </p>
      </section>

      {/* Footer minimal */}
      <footer className="py-10 text-center text-sm text-gray-400 border-t border-white/10">
        © {new Date().getFullYear()} Clínica Miró.ai — Todos los derechos reservados.
      </footer>
    </div>
  );
}

async function handleSubmit(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  try {
    const res = await fetch("/api/agendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    alert(result.message || "Cita agendada con éxito");
    if (result?.whatsapp_link) {
      window.location.href = result.whatsapp_link;
    }
  } catch (err) {
    console.error(err);
    alert("Error al agendar cita");
  }
}
