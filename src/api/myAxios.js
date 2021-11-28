import axios from "axios";
import qs from "querystring";
import store from "../redux/store";
import NProgress from "nprogress";
import { message } from "antd";
import { createDeleteUserAction } from "../redux/action_creators/login_action";
import "nprogress/nprogress.css"

const instance = axios.create(
  /* {
    timeout:2000
  } */
)

instance.interceptors.request.use(
  (config)=>{
    const {method,data,headers} = config
    NProgress.start()
    const {token} = store.getState().userInfo
    if(token) headers.Authorization = "atguigu_" + token
    if(method.toLowerCase() === "post"){
      if(data instanceof Object){
        config.data = qs.stringify(data)
      }
    }
    return config
  }  
)

instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  NProgress.done()
  return response.data;
}, function (error) {
  NProgress.done()
  // debugger
  console.log(error.toJSON());
  if(error.response.status === 401){
    message.error("身份校验失败，请重新登录",1)
    store.dispatch(createDeleteUserAction())
  }else{
    message.error(error.message,1)
  }
  
  return new Promise(()=>{});
});


export default instance