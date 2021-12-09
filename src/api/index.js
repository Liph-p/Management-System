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
//获取商品分页列表
export const reqProductList = (pageNum,pageSize) => myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})
//对商品进行上架/下架处理
export const reqUpdateProdStatus = (productId,status) => myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})
//根据Name/desc搜索产品分页列表
export const reqSearchProduct = (pageNum,pageSize,searchType,keyWord) => myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]:keyWord}})
//根据商品ID获取商品
export const reqProdById = (productId) => myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})
//删除图片
export const reqDeletePicture = (name) => myAxios.post(`${BASE_URL}/manage/img/delete`,{name})
//添加商品
export const reqAddProduct = (productObj) => myAxios.post(`${BASE_URL}/manage/product/add`,{...productObj})
//更新商品
export const reqAddUpdateProduct = (productObj) => myAxios.post(`${BASE_URL}/manage/product/update`,{...productObj})
//获取角色列表
export const reqRoleList = () => myAxios.get(`${BASE_URL}/manage/role/list`)
//添加角色
export const reqAddRole = (roleName) => myAxios.post(`${BASE_URL}/manage/role/add`,{roleName})

