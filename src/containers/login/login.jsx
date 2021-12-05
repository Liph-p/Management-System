import React,{Component} from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { createSaveUserInfoAction } from "../../redux/action_creators/login_action";
import { loginReq } from "../../api/index";

import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "antd/dist/antd.less";
import logo from "../../static/imgs/logo.png"
import "./css/login.less"

//UI组件
class Login extends Component{
  componentDidMount(){
    console.log(this.props)
  }
  //点击登录按钮的回调 antdv4.版本进行了写法的更新
  onFinish = async(values)=>{
    console.log('Received values of form: ', values);
    let {username,password} = values
    /* loginReq(username,password).then(
      (value)=>{console.log(value)}
    ).catch(
      (error)=>{
        console.log(error.message)
      }
    ) */
    let result = await loginReq(username,password)
    let {status,msg,data} = result
    if(status === 0 ){
      //将用户信息还有token交由redux管理
      this.props.saveUserInfo(data)
      //跳转到admin路由
      // this.props.history.replace("/admin") 
      // console.log(result);
    }else{
      message.warning(msg,1)
    }     
  }
  //统一验证
  onFinishFailed = ()=>{
    message.error("表单输入有误，请检查！",1)
  }
  //密码验证器 自定义验证
  pwdValidator = (rule,value)=>{
    if(!value){
      return Promise.reject(new Error("请输入密码!"))
    }else if (!/^\w+$/.test(value)){
      return Promise.reject(new Error("密码必须是字母、数字、下划线组成!"))
    }else if (value.length > 12){
      return Promise.reject(new Error("密码必须小于等于12位!"))
    }else if (value.length < 4){
      return Promise.reject(new Error("密码必须大于等于4位!"))
    }else{
      return Promise.resolve()
    }
  }
  //render
  render(){
    let {isLogin} = this.props
    if(isLogin){
      return <Redirect to="/admin/home" />
    }else{    
      return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h1>
            后台管理系统
          </h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form
            name="normal_login"
            className="login-form"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="username"
              // 声明式验证
              rules={[
                {required: true, message: '请输入用户名!'},
                {max: 12, message: '用户名必须小于等于12位!'},
                {min: 4, message: '用户名必须大于等于4位!'},
                {pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成!'},
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {validator:this.pwdValidator},
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
      )
    }
        
  }
}


//容器组件
export default connect(
  state=>({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo:createSaveUserInfoAction
  }
)(Login)


/* 
Redirect to/Link to/编程式路由跳转都会改变前端路由，react在改变前端路由后会从头开始
找(从App开始找)，会一路重新渲染相关组件，但是不会重新挂载，这些组件只会在开始时挂载一次
*/