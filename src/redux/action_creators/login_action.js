import { SAVE_USER_INFO } from "../action_types";
export const createSaveUserInfoAction = (value)=>{
  localStorage.setItem("user",JSON.stringify(value.user))
  localStorage.setItem("token",JSON.stringify(value.token))
  localStorage.setItem("token",JSON.stringify(value.token))
  return {type:SAVE_USER_INFO,data:value}
}
