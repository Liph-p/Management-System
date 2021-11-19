import axios from "axios";
import qs from "querystring";
import NProgress from "nprogress";
import { message } from "antd";
import "nprogress/nprogress.css"

const instance = axios.create(
  /* {
    timeout:2000
  } */
)

instance.interceptors.request.use(
  (config)=>{
    const {method,data} = config
    NProgress.start()
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
  message.error(error.message,1)
  return new Promise(()=>{});
});


export default instance