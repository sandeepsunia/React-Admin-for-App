'use strict';
import Cookies from "browser-cookies";

const AUTH_TOKEN_KEY = 'authToken';

export const persistToken = (token) => {
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: 10000,
    path: '/dashboard'
  })
}

export const expireToken = () => {
  Cookies.erase(AUTH_TOKEN_KEY, {
    path: '/login'
  })
}

export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY);
}