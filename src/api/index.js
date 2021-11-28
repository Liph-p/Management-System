import jsonp from "jsonp"
import { message } from 'antd';
import myAxios from "./myAxios"
import { BASE_URL,CITY} from "../config/index";
//登录请求
export const loginReq = (username,password)=> myAxios.post(`${BASE_URL}/login`,{username,password})
//获取天气
export const weatherReq = ()=>{
  return new Promise((resolve,reject)=>{
    jsonp(`https://restapi.amap.com/v3/weather/weatherInfo?city=${CITY}&key=857b8ae366153c82057a8cab021e4233`,
    (err, data)=>{
      if(err){
        message.error("请求天气接口失败，请联系管理员")
        return new Promise(()=>{})
      }else{
        let {weather,temperature,winddirection,windpower} = data.lives[0]
        let weatherObj = {weather,temperature,winddirection,windpower}
        resolve(weatherObj)
      }

    })
  })
}
//获取分类列表
export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`)
//添加分类
export const reqAddCategoryList = (categoryName) => myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName})
//更新分类
export const reqUpdateCategoryList = ({categoryId,categoryName}) => myAxios.post(`${BASE_URL}/manage/category/update`,{categoryId,categoryName})
