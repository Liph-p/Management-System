import React, { Component } from "react";
import { connect } from "react-redux";
import {Card,Button,Form,Input,Select } from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
const { Option } = Select;

export default class AddUpdate extends Component{
  render(){
    console.log(this.props);
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
          name="normal_login"
          className="login-form"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="商品名称"
            name="productName"
            // 声明式验证
            rules={[
              {required: true, message: '请输入商品名称!'},
            ]}
          >
            <Input placeholder="商品名称" />
          </Form.Item>
          <Form.Item
            label="商品描述"
            name="productDesc"
            // 声明式验证
            rules={[
              {required: true, message: '请输入商品描述!'},
            ]}
          >
            <Input placeholder="商品描述" />
          </Form.Item>
          <Form.Item
            label="商品价格"
            name="productPrice"
            // 声明式验证
            rules={[
              {required: true, message: '请输入商品价格!'},
            ]}
          >
            <Input placeholder="商品价格" />
          </Form.Item>
          <Form.Item
            label="商品分类"
            name="productCategory"
            // 声明式验证
            rules={[
              {required: true, message: '请选择商品分类!'},
            ]}
          >
            <Select defaultValue="未选择">
              <Option value="">未选择</Option>
              {}
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>

          </Form.Item>
          <Form.Item
            label="商品名称"
            name="productName"
            // 声明式验证
            rules={[
              {required: true, message: '请输入商品名称!'},
            ]}
          >
            <Input placeholder="商品名称" />
          </Form.Item>
          <Form.Item
            label="商品名称"
            name="productName"
            // 声明式验证
            rules={[
              {required: true, message: '请输入商品名称!'},
            ]}
          >
            <Input placeholder="商品名称" />
          </Form.Item>
        </Form>
      </Card>

    )
  }
}

connect(
  state =>({categoryList:state.})
)(AddUpdate)
