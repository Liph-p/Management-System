import myAxios from "./myAxios"
import { BASE_URL } from "../config/index";

export const loginReq = (username,password)=> myAxios.post(`${BASE_URL}/login`,{username,password})
