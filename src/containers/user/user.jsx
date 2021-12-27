import React, { Component } from "react";
import {Card,Button,Table,message,Modal,Form,Input,Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import {reqUsersList,reqAddUser,reqUpdateUser,reqDeleteUser} from "../../api/index";
const { Option } = Select;
const { confirm } = Modal;

export default class User extends Component{
  state = {
    userList:[],
    roleList:[],
    isShowAdd:false,
    _id:"",//判断新增或者修改的_id
    modalCurrentValue:""
  }
  componentDidMount(){
    this.getUsersList()
  }
  getUsersList = async()=>{
    let result = await reqUsersList()
    const {status,data,msg} = result 
    if(status === 0){
      console.log(data);
      this.setState({userList:data.users,roleList:data.roles})
    }else message.error(msg)
  }

  //添加用户确认回调
  handleOk = async()=>{
   try {
      let value = await this.formAddRef.validateFields()
      console.log(value);
      let result
      if(!this.state._id) result = await reqAddUser(value)
      else result = await reqUpdateUser({...value,_id:this.state._id})      
      const {status,msg} = result
      if(status === 0){
        !this.state._id? message.success("添加用户成功",1):message.success("更新用户成功",1)        
        this.getUsersList()
        this.setState({isShowAdd:false})
      }else message.error(msg,1)
    } catch (error) {
      console.log(error);
      message.error("表单输入有误，请检查！",1)
    }    
  }
  //添加用户取消回调
  handleCancel = ()=>{
    this.setState({isShowAdd:false})
  }
  //select选择框回调
  handleChange = (value)=>{
    console.log(`selected ${value}`);
  }
  showModal = (item)=>{
    console.log(item);
    if(item){
      this.setState({isShowAdd:true,_id:item._id,modalCurrentValue:item})
      if(this.formAddRef){
        this.formAddRef.setFieldsValue({
          username: item.username,
          phone: item.phone,
          email: item.email,
          role_id: item.role_id,          
        })
      } 
    } 
    else{
      if(this.formAddRef){
        console.log("清除表单");
        this.formAddRef.setFieldsValue({
          username:null,
          password:null,
          phone:null,
          email:null,
          role_id:null,          
        })
      }
      this.setState({isShowAdd:true,_id:""})   
    }
  }

  showConfirm = (item)=>{
    confirm({
      title: `确认删除${item.username}吗？`,
      icon: <ExclamationCircleOutlined />,
      onOk:async ()=>{
        let result = await reqDeleteUser(item._id)
        if(result.status === 0){
          message.success("删除用户成功！")
          this.getUsersList()
        }
      },
      onCancel() {
      },
    });
  }
  render(){
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time', 
        render:(time)=>dayjs(time).format('YYYY年MM月DD日 HH:mm:ss')     
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render:(id)=>{
          let role = this.state.roleList.find((item)=>{
            return item._id === id
          })
          return role.name
        }
      },
      {
        title: '操作',
        key: 'option',
        render: (item)=>{
          return (
            <div>
              <Button type="link" onClick={()=>{this.showModal(item)}}>修改</Button>
              <Button type="link" onClick={()=>{this.showConfirm(item)}}>删除</Button>
            </div>
            
          )
        }
      },
    ];
    const data = this.state.userList
    return (
      <div>
        <Card title={<Button type="primary"
          onClick={()=>{this.showModal()}}
        >创建用户</Button>}>
          <Table columns={columns} dataSource={data} rowKey="_id" />
        </Card>
        <Modal
          title={!this.state._id? "创建用户":"修改用户"}
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form ref={(input)=>this.formAddRef=input}
            name="add-ref" 
            labelCol={{span:4}} 
            wrapperCol={{span:16}}
            initialValues={{
              username: this.state.modalCurrentValue.username,
              phone: this.state.modalCurrentValue.phone,
              email: this.state.modalCurrentValue.email,
              role_id: this.state.modalCurrentValue.role_id,
            }}
          >
            <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
              <Input placeholder="请输入用户名"/>
            </Form.Item>
            {
              !this.state._id?
              (<Form.Item name="password" label="密码" rules={[{ required: true }]}>
              <Input placeholder="请输入密码"/>
              </Form.Item>):null
            }
            
            <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
              <Input placeholder="请输入手机号"/>
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
              <Input placeholder="请输入邮箱"/>
            </Form.Item>
            <Form.Item name="role_id" label="角色" rules={[{ required: true }]}>
              <Select placeholder="请选择角色" onChange={this.handleChange}>
                {this.state.roleList.map((item)=>{
                  return (
                    <Option value={item._id} key={item._id}>{item.name}</Option>
                  )
                })}
              </Select>
            </Form.Item>
            </Form>
        </Modal>
      </div>
    )
  }
}
