import http from "./httpService";
import { api } from "./../config.json";
const apiEndpoint = api + "users";

export function register(user) {
  return http.post(apiEndpoint, user);
}
