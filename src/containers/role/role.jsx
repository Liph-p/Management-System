import React, { Component } from "react";
import { connect } from "react-redux";
import {Card,Button,Table,message,Modal,Form,Input,Tree} from 'antd';
import dayjs from "dayjs";
import {reqRoleList,reqAddRole,reqAddAuth} from "../../api";
import menuList from "../../config/menu-config";
const {TreeNode} = Tree


class Role extends Component{
  state = {
    roleList:[],
    addRoleVisible: false,
    isShowAuth: false,
    checkedKeys: [],//权限key数组
    menuList,
    _id:"",//角色id
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

  //设置权限弹窗方法 start
  showAuth = ({_id,menus}) => {
    console.log(_id,menus);    
    this.setState({
      _id,
      checkedKeys:menus,
      isShowAuth: true,
    });
  };
  handleAuthOk = async() => {
    let {_id,checkedKeys} = this.state
    let {userName} = this.props
    console.log(userName);
    let result = await reqAddAuth({_id,menus:checkedKeys,auth_name:userName})
    const{status,data,msg} = result 
    if(status === 0){
      console.log(data);
      message.success('授权成功',1)
      this.setState({
        isShowAuth: false,
      });
      this.getRoleList()
    }else message.error(msg)
    
  };
  handleAuthCancel = e => {
    console.log(e);
    this.setState({
      isShowAuth: false,
    });
  };
  //设置权限弹窗方法 end

  //-----------------tree-start-------------------
  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });
  //-----------------tree--end--------------------

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
        render: (item)=>{
          return (
            <Button type="link" onClick={()=>{this.showAuth(item)}}>设置权限</Button>
          )
        }
      },
    ];
    const data = this.state.roleList
    //树的数据
    const treeData = this.state.menuList

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

        <Modal
          title="设置角色权限"
          visible={this.state.isShowAuth}
          onOk={this.handleAuthOk}
          onCancel={this.handleAuthCancel}
        >
          <Tree
            checkable
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            // treeData={treeData}
            defaultExpandAll
          >
            <TreeNode title='平台功能' key='top'>
              {this.renderTreeNodes(treeData)}
            </TreeNode>
          </Tree>          
        </Modal>
      </div>    
    )
  }
}

export default connect(
  state=>({userName:state.userInfo.user.username})
)(Role)
