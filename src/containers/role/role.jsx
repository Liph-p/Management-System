import React, { Component } from "react";
import {Card,Button,Table,message,Modal,Form,Input} from 'antd';
import dayjs from "dayjs";
import {reqRoleList,reqAddRole} from "../../api";


export default class Role extends Component{
  state = {
    roleList:[],
    addRoleVisible: false
  }
  componentDidMount(){
    this.getRoleList()
  }
  //获取角色列表
  getRoleList = async()=>{
    let result = await reqRoleList()
    const {status,data,msg} = result
    if(status === 0){
      this.setState({roleList:data})
    }else message.error(msg,1)
  }
  //添加角色弹窗方法 start
  showModal = () => {
    this.setState({
      addRoleVisible: true,
    });
  };
  handleOk = async() => {
    try {
      let value = await this.formAddRoleRef.validateFields()
      console.log(value);
      let result = await reqAddRole(value.roleName)
      const {status,msg} = result
      if(status === 0){
        message.success('新增角色成功')
        this.getRoleList()
        this.setState({isShowAdd:false})
      }else message.error(msg)
    } catch (error) {
      console.log(error);
      message.error("表单输入有误，请检查！",1)
    }
    this.setState({
      addRoleVisible: false,
    });
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      addRoleVisible: false,
    });
  };
  //添加角色弹窗方法 end

  //添加角色提交表单
  onAddRoleFinish = (values) => {
    console.log(values);
  };
  render(){
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render:createTime=> dayjs(createTime).format('YYYY年MM月DD日 HH:mm:ss')
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        render:authTime=> authTime? dayjs(authTime).format('YYYY年MM月DD日 HH:mm:ss'):""
      },
      {
        title: '授权人',
        key: 'auth_name',
        dataIndex: 'auth_name',
      },
      {
        title: '操作',
        key: 'option',
        render: ()=>{
          return (
            <Button type="link">设置权限</Button>
          )
        }
      },
    ];
    const data = this.state.roleList
    return (
      <div>
        <Card title={<Button type="primary" onClick={this.showModal}>添加角色</Button>}>
          <Table columns={columns} dataSource={data} rowKey="_id" />
        </Card>
        <Modal
          title="添加角色"
          visible={this.state.addRoleVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form ref={(input)=>this.formAddRoleRef=input} name="add-role-ref">
            <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            </Form>
        </Modal>
      </div>
      

    )
  }
}
