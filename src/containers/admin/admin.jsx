import React,{Component} from "react";
import { Redirect,Switch,Route } from "react-router-dom";
import { connect } from "react-redux";
import { Layout } from 'antd';
import "./css/admin.less";
import Header from "./header/header.jsx";
import Home from "../../components/home/home";
import Bar from "../bar/bar";
import Category from "../category/category";
import Line from "../line/line";
import Pie from "../pie/pie";
import Product from "../product/product";
import AddUpdate from "../product/add_update";
import Detail from "../product/detail";
import Role from "../role/role";
import User from "../user/user";
import LeftNav from "./left-nav/left-nav";

const { Footer, Sider, Content } = Layout;


class Admin extends Component{
  componentDidMount(){
  }
  render(){
    let {isLogin} = this.props.userInfo
    if(!isLogin){
      return <Redirect to="/login" />
    }
    return (
      <Layout className="admin">
        <Sider className="sider">
          <LeftNav/>
        </Sider>
        <Layout>
          <Header></Header>
          <Content className="content">
            <Switch>
              <Route path="/admin/home" component={Home}/>
              <Route path="/admin/prod_about/category" component={Category}/>
              <Route path="/admin/prod_about/product" component={Product} exact/>
              <Route path="/admin/prod_about/product/detail/:id" component={Detail}/>
              <Route path="/admin/prod_about/product/addupdate/:id" component={AddUpdate}/>
              <Route path="/admin/prod_about/product/addupdate" component={AddUpdate}/>
              <Route path="/admin/user" component={User}/>
              <Route path="/admin/role" component={Role}/>
              <Route path="/admin/charts/bar" component={Bar}/>
              <Route path="/admin/charts/line" component={Line}/>
              <Route path="/admin/charts/pie" component={Pie}/>
              <Redirect to="/admin/home"/>
            </Switch>
          </Content>
          <Footer className="footer">推荐使用谷歌浏览器，获取最佳用户体验</Footer>
        </Layout>
      </Layout>
    )
    
  }
}

export default connect(
  state => ({userInfo:state.userInfo})
)(Admin)