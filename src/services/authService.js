import http from "./httpService";
import { api } from "./../config.json";
import jwtDecode from "jwt-decode";

const apiEndpoint = api + "auth";
const tokenKey = "token";

http.setHeaders(getToken());

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export default {
  login,
  logout,
  getCurrentUser,
  loginWithJwt,
  getToken
};
