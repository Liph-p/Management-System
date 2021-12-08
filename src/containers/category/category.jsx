import React, {Component} from "react";
import {connect} from "react-redux";
import {Card,Button,Table,message,Modal,Form,Input} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {reqCategoryList,reqAddCategoryList,reqUpdateCategoryList} from "../../api/index";
import {PAGE_SIZE} from "../../config";
import {createSaveCateList} from "../../redux/action_creators/category_action";

class Category extends Component{
  state = {
    categoryList:[],
    isLoading:true,
    visible:false,
    operType:"",
    modalCurrentValue:"",//用于数据回显
    modalCurrentId:""
  }
  //显示弹窗(用于增加分类)
  showAdd = () => {
    this.setState({
      visible: true,
      operType:"Add",
    });
    console.log(this.formRef);
    if(this.formRef){
      this.formRef.setFieldsValue({categoryName: ""})
    } 
  };
  //显示弹窗(用于更新分类)
  showUpdate = (item) => {
    const{name,_id} = item
    console.log(name,_id);
    this.setState({
      visible: true,
      operType:"Update",
      modalCurrentValue:name,
      modalCurrentId:_id
    });
    console.log(this.formRef);
    if(this.formRef){
      // console.log(this.formRef);
      this.formRef.setFieldsValue({categoryName: name})
    } 
  };
  //真正执行添加操作
  toAdd = async(value)=>{
    console.log(value);
    let result = await reqAddCategoryList(value.categoryName)
    let {status,data,msg} = result
    if(status === 0){
      message.success('新增商品分类成功',1)
      let categoryList = [...this.state.categoryList]
      categoryList.unshift(data)
      this.setState({categoryList,visible: false,})
      this.formRef.setFieldsValue({categoryName: ""})
      console.log(this.formRef);
    }else if(status === 1){
      message.error(msg,1)
    }    
  }
  //真正执行修改操作
  toUpdate = async(categoryObj) => {
    let result = await reqUpdateCategoryList(categoryObj)
    const {status,msg} = result
    if(status === 0){
      message.success('更新分类名称成功',1)
      this.getCategoryList()
      this.setState({visible: false}); //隐藏弹窗
      
    }else if(status === 1){
      message.error(msg,1)
    }

  }
  handleOk = async() => {
    let {operType} = this.state
    try {
      //统一验证
      //validateFields这个触发表单验证,当什么也不输入,会提醒分类名称必须输入!
      //这个时候还点击ok就会触发这个验证
      let value = await this.formRef.validateFields()
      if(operType === "Add") this.toAdd(value)
      if(operType === "Update") {
        const categoryId = this.state.modalCurrentId
        const categoryName = value.categoryName
        const categoryObj = {categoryId,categoryName}
        this.toUpdate(categoryObj);
      }
    } catch (error) {
      console.log(error);
      message.error("表单输入有误，请检查！",1)
      return
    }    
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  getCategoryList = async()=>{
    let result = await reqCategoryList()
    this.setState({isLoading:false})
    let {status,data,msg} = result
    if(status === 0){
      this.setState({categoryList:data.reverse()})
      this.props.saveCateList(data)
    }else if(status === 1){
      message.error(msg,1)
    }
  }
  componentDidMount(){
    this.getCategoryList()
  }
  render(){
    let data = this.state.categoryList
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'categoryName',
      },
      {
        title: '操作',
        // dataIndex: 'age',
        render:(item)=>{return <Button type="link" onClick={()=>{this.showUpdate(item)}}>修改分类</Button>},
        key: 'operation',
        align:"center",
        width:"25%"
      }
    ];
    return (
      <div>
        <Card extra={<Button type="primary"
          icon={<PlusOutlined />}
          onClick={this.showAdd}
          >添加</Button>}>
          <Table columns={columns}
          dataSource={data}
          rowKey="_id"
          bordered={true}
          pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true }}
          loading={this.state.isLoading} />
        </Card>
        <Modal
          title={this.state.operType==="Add"?"添加分类":"修改分类"}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form
            name="normal_category"
            className="category-form"
            ref={(ref)=>{this.formRef = ref}}
            initialValues={{
              categoryName: this.state.modalCurrentValue,
            }}
            // setFieldsValue={{
            //   categoryName: this.state.modalCurrentValue,
            // }}
          >
            <Form.Item
              name="categoryName"
              // 声明式验证
              rules={[{required: true, message: '分类名称必须输入!'},]}
            >
              <Input placeholder="请输入分类名称" />
            </Form.Item>
          </Form>
          
        </Modal>
      </div>
      
    )
  }
}

export default connect(
  (state)=>({}),
  {saveCateList:createSaveCateList}  
)(Category)