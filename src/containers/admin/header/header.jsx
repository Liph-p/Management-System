import React,{ Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {Button} from "antd"
import {FullscreenExitOutlined,FullscreenOutlined} from "@ant-design/icons";
import screenfull from 'screenfull';
import dayjs from "dayjs";
import { createDeleteUserAction } from "../../../redux/action_creators/login_action";
import { weatherReq } from "../../../api/index";
import menuConf from "../../../config/menu-config"

import "./header.less"

class Header extends Component{
  state={
    isFull:false,
    day:dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
    weatherInfo:"",
    title:"",
  }

  //退出登录
  logOut=()=>{
    this.props.deleteUser()
  }
  //获取天气
  getWeather=async()=>{
    let result = await weatherReq()
    this.setState({weatherInfo:result})
  }
  componentDidMount(){
    //给screenfull绑定监听
    screenfull.on("change",()=>{
      let isFull = !this.state.isFull
      this.setState({isFull})
    })
    //绑定时间变化定时器
    this.timeId = setInterval(()=>{
      this.setState({day:dayjs().format('YYYY年MM月DD日 HH:mm:ss')})
    },1000)
    //请求天气,在componentDidMount上加async不太好,再外包一个函数
    this.getWeather()
    //组件挂载时调用getTitle方法获取title,一般渲染时通过redux获取title
    this.getTitle()

  }
  //在组件将要卸载是清除定时器
  componentWillUnmount(){
    clearInterval(this.timeId)
  }
  //全屏的函数
  fullScreen = ()=>{
    //这里引入的是@5.2.0版本,@6.0.0版本会有缺少loader不能解析
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
  //获取标题
  getTitle = ()=>{
    let path = this.props.location.pathname.split("/").reverse()[0]
    if(this.props.location.pathname.indexOf("product")!==-1) path ="product"
    let title = ""
    menuConf.forEach((item)=>{
      if(item.children instanceof Array){
        let temp = item.children.find((item2)=>{
          return item2.key === path
        })
        if(temp) title = temp.title
      }else{
        if(item.key === path) title = item.title
      }
    })
    this.setState({title})
  }
  render(){
    let {user} = this.props.userInfo
    return (
      <header className="header">
        <div className="header-top">
          <Button size="small" 
          icon={this.state.isFull?<FullscreenExitOutlined />:<FullscreenOutlined/>}
          onClick={this.fullScreen}></Button>
          <span className="username">欢迎{user.username}</span>
          <Button size="small" type="link" onClick={this.logOut}>退出登录</Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            <span>{this.props.title.title || this.state.title}</span>
          </div>
          <div className="header-bottom-right">
            <span>{this.state.day}</span>
            <span>多云</span>
            <span>温度:{this.state.weatherInfo.temperature}℃</span>
            <span className="weather-wind">{this.state.weatherInfo.winddirection+"风"}{this.state.weatherInfo.windpower+"级"}</span>
            
          </div>
        </div>
        
      </header>
    )
  }
}

export default connect(
  state=>({userInfo:state.userInfo,title:state.title}),
  {
    deleteUser:createDeleteUserAction
  }
  
)(withRouter(Header))
