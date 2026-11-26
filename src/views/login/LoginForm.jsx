import { useState } from "react";

import { useLogin } from "../../controllers/auth/useLogin";
import { ROUTES } from "../../controllers/router/navigation";
import { Link } from "../Link";
import { ArrowRightIcon, EyeIcon, LockIcon, MailIcon } from "../icons";
import { FormField } from "./FormField";

const EMAIL_HINT = "[Colombia reg.]";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { values, errors, status, message, isLoading, updateField, submit } =
    useLogin();

  return (
    <section className="auth-card" aria-label="Iniciar sesión">
      <div className="term mono">
        <span>Terminal // KULT-ID 2.4.9</span>
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>

      <form id="login" className="login-form" noValidate onSubmit={submit}>
        <FormField
          id="email"
          label="Identificador / Correo electrónico"
          hint={EMAIL_HINT}
          error={errors.email}
          icon={<MailIcon />}
          inputProps={{
            type: "email",
            placeholder: "usuario@correo.co",
            autoComplete: "username",
            value: values.email,
            onChange: updateField,
            required: true,
          }}
        />

        <FormField
          id="password"
          label="Contraseña cifrada"
          hint={
            <a href="/recuperar" className="lime-link">
              ¿Olvidaste tu contraseña? [Recuperar clave]
            </a>
          }
          error={errors.password}
          icon={<LockIcon />}
          inputProps={{
            type: showPassword ? "text" : "password",
            placeholder: "••••••••••••••••",
            autoComplete: "current-password",
            value: values.password,
            onChange: updateField,
            required: true,
          }}
          action={
            <button
              className="eye"
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
            >
              <EyeIcon />
            </button>
          }
        />

        <label className="check mono">
          <input
            name="rememberSession"
            type="checkbox"
            checked={values.rememberSession}
            onChange={updateField}
          />
          Mantener sesión activa en este dispositivo seguro
        </label>

        <button className="cta" type="submit" disabled={isLoading}>
          {isLoading ? "Verificando acceso…" : "Ingresar a mi cuenta"}
          <ArrowRightIcon />
        </button>

        {message && (
          <p
            className={`msg ${status === "success" ? "ok" : "err"}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <div className="or mono">[ O continuar con ]</div>
        <div className="social">
          <button type="button" disabled>
            Google // OAuth
          </button>
          <button type="button" disabled>
            Apple // Connect
          </button>
        </div>
      </form>

      <div className="signup">
        <p>
          <span>¿Aún no tienes identificador?</span>
          Apertura de fichas sujeta a disponibilidad de cupos en Colombia.
        </p>
        <Link to={ROUTES.REGISTER}>[Crear cuenta nueva]</Link>
      </div>
    </section>
  );
}
