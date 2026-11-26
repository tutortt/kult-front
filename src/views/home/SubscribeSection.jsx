import { useState } from "react";

/** Formulario de acceso anticipado al próximo drop. */
export function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="sub" style={{ paddingBlock: "clamp(32px,5vw,56px)" }}>
      <div className="wrap">
        <div>
          <p className="eyebrow mono" style={{ color: "var(--muted)", marginBottom: 8 }}>
            [Early access // Protocol]
          </p>
          <h2>Suscríbete al próximo drop</h2>
          <p>Recibe acceso prioritario 15 minutos antes de cada lanzamiento oficial. Sin correos innecesarios.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            aria-label="Correo electrónico"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setSent(false);
            }}
            required
          />
          <button className="btn lime" type="submit">
            {sent ? "Acceso solicitado ✓" : "Obtener acceso"}
          </button>
        </form>
      </div>
    </section>
  );
}
