import React, { Component } from "react";
import {connect} from "react-redux";
import {Card,List,Button, message} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {reqProdById,reqCategoryList} from "../../api/index";
import "./detail.less"
const {Item} = List

class Detail extends Component{
  state = {
    name:"",
    desc:"",
    price:"",
    categoryId:"",
    imgs:[],
    detail:"",
    categoryName:"",
    isLoading:true
  }
  componentDidMount(){
    let result = this.props.productList.find((item)=>{
      return item._id === this.props.match.params.id
    })
    if(result){
      // let {name,desc,price,categoryId,imgs,detail} = result
      this.categoryId = result.categoryId
      this.setState({...result})
    }else{
      this.getProdById(this.props.match.params.id)
    }

    //根据categoryList获取所属分类名
    let categoryList = this.props.categoryList
    if(categoryList.length){
      let result = categoryList.find((item)=>{
        return this.categoryId === item._id
      })
      this.setState({categoryName:result.name,isLoading:false})
    }else{
      this.getCategoryList()
   }
  }


  //发送请求根据ID获取商品
  getProdById = async(id)=>{
    let result = await reqProdById(id)
    const {status,data,msg} = result
    if(status === 0){
      // const {name,desc,price,categoryId,imgs,detail} = data
      this.categoryId = data.categoryId
      this.setState({...data})
    }else{
      message.error(msg,1)
    }
  }


  getCategoryList = async()=>{
    let result = await reqCategoryList()
    const {status,data,msg} = result
    if(status === 0){
      let result = data.find((item)=>{
        return item._id === this.categoryId
      })
      if(result) this.setState({categoryName:result.name,isLoading:false})
    }else{
      message.error(msg,1)
    }
  }
  render(){
    return (
      <div>
        <Card title={
          <div>
            <Button 
              type="link" 
              icon={<ArrowLeftOutlined />}
              onClick={this.props.history.goBack}
            ></Button>
            <span>商品详情</span>
          </div>
        }
        loading={this.state.isLoading}
        >
          <List>
            <Item className="item">
              <span className="prod-title">商品名称：</span>
              <span>{this.state.name}</span>
            </Item>
            <Item className="item">
              <span className="prod-title">商品描述：</span>
              <span>{this.state.desc}</span>
            </Item>
            <Item className="item">
              <span className="prod-title">商品价格：</span>
              <span>{this.state.price}</span>
            </Item>
            <Item className="item">
              <span className="prod-title">所属分类：</span>
              <span>{this.state.categoryName}</span>
            </Item>
            <Item className="item">
              <span className="prod-title">商品图片：</span>
              {this.state.imgs.map((item,index)=>{
                return <img key={index} src={"/upload/"+item} alt="商品图片" />
              })}
            </Item>
            <Item className="item">
              <span className="prod-title">商品详情：</span>
              <span dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
            </Item>
          </List>
        </Card>
      </div>
    )
  }
}

export default connect(
  state=>({productList:state.productList,categoryList:state.categoryList}) 
)(Detail)
