import React, {Component} from "react";
import {connect} from "react-redux";
import {Link,withRouter} from "react-router-dom";
import {Menu} from 'antd';
import {createSaveTitleAction} from "../../../redux/action_creators/menu_actions";
import logo from "../../../static/imgs/logo.png";
import menuConf from "../../../config/menu-config";

import "./left-nav.less"
const { SubMenu,Item } = Menu;
// antd侧边导航动态添加图标
// https://blog.csdn.net/qq_43130927/article/details/108081724?utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~aggregatepage~first_rank_ecpm_v1~rank_v31_ecpm-2-108081724.pc_agg_new_rank&utm_term=antd4+%E5%A6%82%E4%BD%95%E5%8A%A8%E6%80%81%E7%BB%99Menu%E5%9B%BE%E6%A0%87&spm=1000.2123.3001.4430

class LeftNav extends Component{
  componentDidMount(){
  }

  createMenu=(target)=>{
    return target.map((item)=>{
      if(!item.children){
        return(
          <Item key={item.key} icon={item.icon} onClick={()=>{this.props.saveTitle(item.title)}}>
            <Link to={item.path}>
              {item.title}
            </Link>
          </Item>
        )
      }else{
        return(
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {this.createMenu(item.children)}
          </SubMenu>
        )
      }
    })
  }
  render(){
    return (
      <div>
        <header className="nav-header">
          <img src={logo} alt="logo"/>
          <span>商品后台管理</span>
        </header>
        <Menu
          defaultSelectedKeys={this.props.location.pathname.indexOf("product")!==-1? "product":this.props.location.pathname.split("/").reverse()[0]}
          defaultOpenKeys={this.props.location.pathname.split("/").splice(2)}
          mode="inline"
          theme="dark"
        >
          {this.createMenu(menuConf)}
        </Menu>
      </div>
    );
  }
}
export default connect(
  () => ({}),
  {saveTitle:createSaveTitleAction}  
)(withRouter(LeftNav))
