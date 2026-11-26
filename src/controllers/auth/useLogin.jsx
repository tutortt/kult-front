import { useReducer } from "react";

import { EMPTY_CREDENTIALS } from "../../models/auth/credentials";
import {
  hasValidationErrors,
  validateCredentials,
} from "../../models/auth/loginValidation";
import { authenticate } from "./authService";
import { LOGIN_MESSAGES, toLoginMessage } from "./loginError";

export const LOGIN_STATUS = Object.freeze({
  IDLE: "idle",
  INVALID: "invalid",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
});

const FIELD_CHANGED = "fieldChanged";
const SUBMIT_INVALID = "submitInvalid";
const SUBMIT_STARTED = "submitStarted";
const SUBMIT_SUCCEEDED = "submitSucceeded";
const SUBMIT_FAILED = "submitFailed";

const initialState = {
  values: EMPTY_CREDENTIALS,
  errors: {},
  status: LOGIN_STATUS.IDLE,
  message: "",
};

/**
 * Reductor explícito: el formulario tiene una máquina de estados clara
 * en lugar de cuatro estados independientes que pueden desincronizarse.
 */
function reducer(state, action) {
  switch (action.type) {
    case FIELD_CHANGED:
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
        errors: { ...state.errors, [action.name]: undefined },
        status: LOGIN_STATUS.IDLE,
        message: "",
      };
    case SUBMIT_INVALID:
      return {
        ...state,
        errors: action.errors,
        status: LOGIN_STATUS.INVALID,
        message: LOGIN_MESSAGES.invalid,
      };
    case SUBMIT_STARTED:
      return { ...state, errors: {}, status: LOGIN_STATUS.LOADING, message: "" };
    case SUBMIT_SUCCEEDED:
      return {
        ...state,
        status: LOGIN_STATUS.SUCCESS,
        message: LOGIN_MESSAGES.success,
      };
    case SUBMIT_FAILED:
      return {
        ...state,
        status: LOGIN_STATUS.ERROR,
        message: action.message,
      };
    default:
      return state;
  }
}

/**
 * Controlador del formulario de acceso.
 * Delega la validación al dominio y la comunicación al caso de uso.
 *
 * @param {(credentials: import('../../models/auth/credentials').Credentials) => Promise<unknown>} [loginUseCase]
 */
export function useLogin(loginUseCase = authenticate) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    dispatch({
      type: FIELD_CHANGED,
      name,
      value: type === "checkbox" ? checked : value,
    });
  }

  async function submit(event) {
    event.preventDefault();

    const errors = validateCredentials(state.values);
    if (hasValidationErrors(errors)) {
      dispatch({ type: SUBMIT_INVALID, errors });
      return;
    }

    dispatch({ type: SUBMIT_STARTED });
    try {
      await loginUseCase(state.values);
      dispatch({ type: SUBMIT_SUCCEEDED });
    } catch (error) {
      dispatch({ type: SUBMIT_FAILED, message: toLoginMessage(error) });
    }
  }

  return {
    ...state,
    isLoading: state.status === LOGIN_STATUS.LOADING,
    updateField,
    submit,
  };
}
