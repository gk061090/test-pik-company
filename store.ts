import { useMemo } from "react";
import { createStore, applyMiddleware, Action } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import axios from "axios";
import thunk, { ThunkAction } from "redux-thunk";
import { fetchLogin } from "./utils/fetchLogin";
import { saveTokenData, getTokenData, fetchRefreshToken } from "./utils";
import Router from "next/router";
import { IUser } from "./__interfaces__/user";

let store;

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const GET_USER = "GET_USER";
export const SAVE_TOKEN_DATA = "SAVE_TOKEN_DATA";

export const login = ({
  email,
  password,
}: IUser): ThunkAction<void, RootState, unknown, Action> => async (
  dispatch
) => {
  try {
    const { token, refresh_token, expiration, user } = await fetchLogin({
      email,
      password,
    });

    dispatch({ type: LOGIN, payload: user });

    const tokenData = {
      token,
      refresh_token,
      expiration,
    };

    saveTokenData(tokenData);

    dispatch({ type: SAVE_TOKEN_DATA, payload: tokenData });
  } catch {
    alert("Ошибка авторизации");
  }
};

export const getUser = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action
> => async (dispatch) => {
  try {
    const tokenData = getTokenData();

    if (!tokenData) {
      throw new Error("No token data");
    }

    let token = tokenData.token;

    if (Date.now() >= +tokenData.expiration * 1000) {
      try {
        const response = await fetchRefreshToken(tokenData.refresh_token);
        token = response.token;
        saveTokenData({ ...tokenData, ...response });
        dispatch({
          type: SAVE_TOKEN_DATA,
          payload: { ...tokenData, ...response },
        });
      } catch {
        throw new Error("Error in /refresh_token");
      }
    }

    const response = await axios.get<IUser>("http://localhost:9090/user", {
      headers: { Authorization: token },
    });

    dispatch({ type: GET_USER, payload: response?.data });
  } catch (error) {
    console.log(error);
    Router.push("/login");
  }
};

const initialState = {
  user: {},
  tokenData: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case GET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: {},
      };
    case SAVE_TOKEN_DATA:
      return {
        ...state,
        tokenData: action.payload,
      };
    default:
      return state;
  }
};

function initStore(preloadedState = initialState) {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunk))
  );
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    store = undefined;
  }

  if (typeof window === "undefined") return _store;
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

export type RootState = ReturnType<typeof reducer>;
