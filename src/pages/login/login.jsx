import React,{Component} from "react";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "antd/dist/antd.less";
import logo from "./imgs/logo.png"
import "./css/login.less"


export default class Login extends Component{
  //点击登录按钮的回调 antdv4.版本进行了写法的更新
  onFinish = (values)=>{
    console.log('Received values of form: ', values);
  }
  //密码验证器
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

  render(){
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
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="username"
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