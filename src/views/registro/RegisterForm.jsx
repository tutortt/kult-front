import { Fragment } from "react";

import { useRegister } from "../../controllers/auth/useRegister";
import { ROUTES } from "../../controllers/router/navigation";
import { CIUDADES, TALLAS } from "../../models/auth/registration";
import { getPasswordStrength } from "../../models/auth/registrationValidation";
import { Link } from "../Link";
import { AppleIcon, ArrowRightIcon, GoogleIcon } from "../icons";

function FieldError({ id, error }) {
  if (!error) return null;
  return (
    <span id={`${id}-error`} className="msg err" role="alert">
      {error}
    </span>
  );
}

/** Formulario de registro portado desde referencia/registro.html. */
export function RegisterForm() {
  const { values, errors, status, message, isLoading, updateField, submit } =
    useRegister();
  const strength = getPasswordStrength(values.password);

  return (
    <section className="auth-card" aria-labelledby="t-reg">
      <div className="card-head">
        <b id="t-reg">Datos de registro</b>
        <span>[BOG/MDE/CLO/BAQ]</span>
      </div>

      <form id="reg" className="form-grid-2 reg-form" noValidate onSubmit={submit}>
        <div className="f">
          <label htmlFor="n">
            Nombres <em>*</em>
          </label>
          <input
            id="n"
            name="nombres"
            type="text"
            placeholder="Ej. Mateo"
            autoComplete="given-name"
            required
            value={values.nombres}
            onChange={updateField}
            aria-invalid={Boolean(errors.nombres)}
            aria-describedby={errors.nombres ? "n-error" : undefined}
          />
          <FieldError id="n" error={errors.nombres} />
        </div>

        <div className="f">
          <label htmlFor="a">
            Apellidos <em>*</em>
          </label>
          <input
            id="a"
            name="apellidos"
            type="text"
            placeholder="Ej. Restrepo Cruz"
            autoComplete="family-name"
            required
            value={values.apellidos}
            onChange={updateField}
            aria-invalid={Boolean(errors.apellidos)}
            aria-describedby={errors.apellidos ? "a-error" : undefined}
          />
          <FieldError id="a" error={errors.apellidos} />
        </div>

        <div className="f full-col">
          <label htmlFor="i">
            Número de identificación <em>*</em>
          </label>
          <input
            id="i"
            name="identificacion"
            type="text"
            placeholder="Ej. 1018459201 o PA123456"
            autoComplete="off"
            maxLength="30"
            required
            value={values.identificacion}
            onChange={updateField}
            aria-invalid={Boolean(errors.identificacion)}
            aria-describedby={errors.identificacion ? "i-error" : undefined}
          />
          <FieldError id="i" error={errors.identificacion} />
        </div>

        <div className="f full-col">
          <label htmlFor="e">
            Correo electrónico <em>*</em>
          </label>
          <input
            id="e"
            name="correo"
            type="email"
            placeholder="identidad@dominio.co"
            autoComplete="email"
            required
            value={values.correo}
            onChange={updateField}
            aria-invalid={Boolean(errors.correo)}
            aria-describedby={errors.correo ? "e-error" : undefined}
          />
          <FieldError id="e" error={errors.correo} />
        </div>

        <div className="f">
          <label htmlFor="t">
            Móvil SMS drops (+57 Colombia) <em>*</em>
          </label>
          <div className="phone">
            <span>+57</span>
            <input
              id="t"
              name="celular"
              type="tel"
              inputMode="numeric"
              placeholder="300 000 0000"
              autoComplete="tel-national"
              required
              value={values.celular}
              onChange={updateField}
              aria-invalid={Boolean(errors.celular)}
              aria-describedby={errors.celular ? "t-error" : undefined}
            />
          </div>
          <FieldError id="t" error={errors.celular} />
        </div>

        <div className="f">
          <label htmlFor="c">
            Ciudad despacho <em>*</em>
          </label>
          <select
            id="c"
            name="ciudad"
            required
            value={values.ciudad}
            onChange={updateField}
            aria-invalid={Boolean(errors.ciudad)}
            aria-describedby={errors.ciudad ? "c-error" : undefined}
          >
            <option value="" disabled>
              Seleccionar…
            </option>
            {CIUDADES.map((ciudad) => (
              <option key={ciudad} value={ciudad}>
                {ciudad}
              </option>
            ))}
          </select>
          <FieldError id="c" error={errors.ciudad} />
        </div>

        <div className="f">
          <label htmlFor="p1">
            Contraseña segura <em>*</em>
          </label>
          <input
            id="p1"
            name="password"
            type="password"
            placeholder="••••••••••••"
            autoComplete="new-password"
            minLength="8"
            required
            value={values.password}
            onChange={updateField}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "p1-error" : undefined}
          />
          <FieldError id="p1" error={errors.password} />
        </div>

        <div className="f">
          <label htmlFor="p2">
            Confirmar contraseña <em>*</em>
          </label>
          <input
            id="p2"
            name="confirmacion"
            type="password"
            placeholder="••••••••••••"
            autoComplete="new-password"
            required
            value={values.confirmacion}
            onChange={updateField}
            aria-invalid={Boolean(errors.confirmacion)}
            aria-describedby={errors.confirmacion ? "p2-error" : undefined}
          />
          <FieldError id="p2" error={errors.confirmacion} />
        </div>

        <div className="strength full-col" aria-live="polite">
          <div className="row">
            <span>Nivel de cripto-seguridad</span>
            <span>{strength.label}</span>
          </div>
          <div
            className="bar2"
            role="progressbar"
            aria-valuenow={strength.level}
            aria-valuemin="0"
            aria-valuemax="4"
          >
            <span style={{ width: `${strength.percent}%` }} />
          </div>
          <small>Mínimo 8 caracteres, alfanumérico con caracteres especiales.</small>
        </div>

        <fieldset className="f full-col">
          <legend className="lbl">
            <span>Talla habitual de preferencia (pre-reserva)</span>
            <span>[Cupo 1 unidad]</span>
          </legend>
          <div className="sizes-reg">
            {TALLAS.map((talla, index) => (
              <Fragment key={talla}>
                <input
                  type="radio"
                  name="talla"
                  id={`s${index + 1}`}
                  value={talla}
                  checked={values.talla === talla}
                  onChange={updateField}
                />
                <label htmlFor={`s${index + 1}`}>{talla}</label>
              </Fragment>
            ))}
          </div>
          <FieldError id="talla" error={errors.talla} />
        </fieldset>

        <label className="check full-col">
          <input
            name="aceptaSms"
            type="checkbox"
            checked={values.aceptaSms}
            onChange={updateField}
          />
          <span>
            Deseo recibir claves de acceso anticipado 15 minutos antes vía
            WhatsApp/SMS antes del lanzamiento oficial.
          </span>
        </label>

        <label className="check full-col">
          <input
            name="aceptaTerminos"
            type="checkbox"
            required
            checked={values.aceptaTerminos}
            onChange={updateField}
            aria-invalid={Boolean(errors.aceptaTerminos)}
          />
          <span>
            Acepto los <a href="#terminos">Términos de Servicio</a> y la{" "}
            <a href="#privacidad">Política de Privacidad</a> de KULT STUDIO
            Colombia.
          </span>
        </label>
        <FieldError id="aceptaTerminos" error={errors.aceptaTerminos} />

        <button className="cta full-col" type="submit" disabled={isLoading}>
          {isLoading
            ? "Creando identificador…"
            : "Crear identificador de miembro"}
          <ArrowRightIcon />
        </button>

        {message && (
          <p
            className={`msg full-col ${status === "success" ? "ok" : "err"}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <div className="or full-col mono">O accede rápidamente con</div>

        <div className="social full-col">
          <button type="button" disabled>
            <GoogleIcon />
            Google accreditation
          </button>
          <button type="button" disabled>
            <AppleIcon />
            Apple passport
          </button>
        </div>

        <p className="login-link full-col mono">
          ¿Ya posees identificador de acceso?{" "}
          <Link to={ROUTES.LOGIN}>[Iniciar sesión aquí]</Link>
        </p>
      </form>
    </section>
  );
}
