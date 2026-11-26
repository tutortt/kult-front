import { useReducer } from "react";

import { EMPTY_REGISTRATION } from "../../models/auth/registration";
import {
  hasValidationErrors,
  validateRegistration,
} from "../../models/auth/registrationValidation";
import { REGISTRATION_MESSAGES, toRegistrationMessage } from "./registrationError";
import { register } from "./registerService";

export const REGISTER_STATUS = Object.freeze({
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
  values: EMPTY_REGISTRATION,
  errors: {},
  status: REGISTER_STATUS.IDLE,
  message: "",
};

function reducer(state, action) {
  switch (action.type) {
    case FIELD_CHANGED:
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
        errors: { ...state.errors, [action.name]: undefined },
        status: REGISTER_STATUS.IDLE,
        message: "",
      };
    case SUBMIT_INVALID:
      return {
        ...state,
        errors: action.errors,
        status: REGISTER_STATUS.INVALID,
        message: REGISTRATION_MESSAGES.invalid,
      };
    case SUBMIT_STARTED:
      return { ...state, errors: {}, status: REGISTER_STATUS.LOADING, message: "" };
    case SUBMIT_SUCCEEDED:
      return {
        ...state,
        status: REGISTER_STATUS.SUCCESS,
        message: REGISTRATION_MESSAGES.success,
      };
    case SUBMIT_FAILED:
      return {
        ...state,
        status: REGISTER_STATUS.ERROR,
        message: action.message,
      };
    default:
      return state;
  }
}

/**
 * Controlador del formulario de registro: valida, gestiona estados y delega
 * la comunicación al caso de uso.
 *
 * @param {(values: import('../../models/auth/registration').Registration) => Promise<unknown>} [registerUseCase]
 */
export function useRegister(registerUseCase = register) {
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

    const errors = validateRegistration(state.values);
    if (hasValidationErrors(errors)) {
      dispatch({ type: SUBMIT_INVALID, errors });
      return;
    }

    dispatch({ type: SUBMIT_STARTED });
    try {
      await registerUseCase(state.values);
      dispatch({ type: SUBMIT_SUCCEEDED });
    } catch (error) {
      dispatch({ type: SUBMIT_FAILED, message: toRegistrationMessage(error) });
    }
  }

  return {
    ...state,
    isLoading: state.status === REGISTER_STATUS.LOADING,
    updateField,
    submit,
  };
}
