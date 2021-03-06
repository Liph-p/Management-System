import React, { Component } from "react";
import { connect } from "react-redux";
import {Card,Button,Form,Input,Select,message} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import PictureWall from "./picture_wall";
import PictureTextEditor from "./rich_text_editor";
import {reqCategoryList,reqAddProduct,reqProdById,reqAddUpdateProduct} from "../../api";
const { Option } = Select;

class AddUpdate extends Component{
  state = {
    categoryList:[],
    operaType:"add"
  }
  componentDidMount(){
    const {categoryList,productList} = this.props
    if(categoryList.length) this.setState({categoryList})
    else this.getCategoryList()
    let {id} = this.props.match.params
    if(id){
      if(productList.length){
        this.setState({operaType:"update"})
        let product = productList.find((item)=>{
          return item._id === id
        })
        // let {categoryId,name,desc,price,detail,imgs} = product
        // this.setState({...product})
        this.product = product
        this.pictureWall.setImgArr(this.product.imgs)
        this.richText.setRichText(this.product.detail)
        if(this.formRef){
          this.formRef.setFieldsValue({name: this.product.name,
            desc:this.product.desc,
            price:this.product.price,
            categoryId:this.product.categoryId,            
          })
        }
      }else{
        this.getProductList(id)
      }
       

    }   
  }
  //获取分类列表（防止redux）中没有数据
  getCategoryList = async()=>{
    let result = await reqCategoryList()
    const {status,data,msg} = result
    if(status === 0){
      this.setState({categoryList:data})
    }else message.error(msg)    
  }
  //获取商品列表（防止redux）中没有数据
  getProductList = async(id)=>{
    let result = await reqProdById(id)
    const {status,data,msg} = result
    if(status === 0){
      this.product = data
      this.pictureWall.setImgArr(this.product.imgs)
      this.richText.setRichText(this.product.detail)
      if(this.formRef){
        this.formRef.setFieldsValue({name: this.product.name,
          desc:this.product.desc,
          price:this.product.price,
          categoryId:this.product.categoryId,            
        })
      }
    }else message.error(msg)    
  }
  //表提交的回调
  onFinish = async(value) => {
    const {operaType} = this.state
    let _id = this.props.match.params.id
    let imgs = this.pictureWall.getImgArr()
    let detail = this.richText.getRichText()
    let result
    if(operaType === "add") result = await reqAddProduct({...value,imgs,detail})
    else result = await reqAddUpdateProduct({...value,imgs,detail,_id})
    const {status,msg} = result
    if(status === 0){
      message.success("操作成功")
      this.props.history.replace('/admin/prod_about/product')
    }else message.error(msg)
  }

  render(){
    return (
      <Card title={
        <div>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />}
            onClick={this.props.history.goBack}
          ></Button>
          <span>商品详情</span>
        </div>
      }>
        <Form
          name="normal_addproduct"
          className="addproduct-form"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          labelCol={{md:2}}
          wrapperCol={{md:7}}
          ref={(ref)=>{this.formRef = ref}}
          initialValues={{
            // name:this.state.name,
            categoryId:""
          }}
        >
          <Form.Item
            label="商品名称"
            name="name"
            // 声明式验证
            rules={[
              {required: true, message: '请输入商品名称!'},
            ]}
            // initialValue={this.state.name}
          >
            <Input placeholder="商品名称" />
          </Form.Item>
          <Form.Item
            label="商品描述"
            name="desc"
            // 声明式验证
            rules={[
              {required: true, message: '请输入商品描述!'},
            ]}
            // initialValue={this.state.desc}
          >
            <Input placeholder="商品描述" />
          </Form.Item>
          <Form.Item
            label="商品价格"
            name="price"
            // 声明式验证
            rules={[
              {required: true, message: '请输入商品价格!'},
            ]}
          >
            <Input placeholder="商品价格" />
          </Form.Item>
          <Form.Item
            label="商品分类"
            name="categoryId"
            // 声明式验证
            rules={[
              {required: true, message: '请选择商品分类!'},
            ]}
          >
            <Select>
              <Option value="">未选择</Option>
              {this.state.categoryList.map((item)=>{
                return (
                  <Option key={item._id} value={item._id}>{item.name}</Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="商品图片"
            wrapperCol={{md:12}}
          >
            <PictureWall ref={(PictureWall)=>{this.pictureWall = PictureWall}} />
          </Form.Item>
          <Form.Item
            label="商品详情"
            wrapperCol={{md:16}}
          >
            <PictureTextEditor ref={(richText)=>{this.richText = richText}}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>

    )
  }
}

export default connect(
  state =>({categoryList:state.categoryList,productList:state.productList})
)(AddUpdate)
