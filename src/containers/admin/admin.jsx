import React,{Component} from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";



class Admin extends Component{
  render(){
    let {user,isLogin} = this.props.userInfo
    if(!isLogin){
      return <Redirect to="/login" />
    }else{
      return (
        <div className="admin">
          现在是{user.username}
        </div>
      )
    }
    
  }
}

export default connect(
  state => ({userInfo:state.userInfo})
)(Admin)