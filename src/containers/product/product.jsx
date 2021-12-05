import React, {Component} from "react";
import {connect} from "react-redux";
import {Card,Select,Input,Button,Table,message} from 'antd';
import {PlusOutlined,SearchOutlined} from '@ant-design/icons';
import {reqProductList,reqUpdateProdStatus,reqSearchProduct} from "../../api/index";
import {PAGE_SIZE} from "../../config/index";
import {createSaveProduct} from "../../redux/action_creators/product_action";
const { Option } = Select;

class Product extends Component{
  state = {
    productList:[],//商品列表数据(分页)
    total:"",//一共有多少数据
    current:1,//当前页数是哪一页
    keyWord:"",//搜索关键词
    searchType:"productName",
  }
  //获取商品分页列表
  getProductList = async(num=1) =>{
    let {keyWord,searchType} = this.state
    let result
    if(this.isSearch) result = await reqSearchProduct(num,PAGE_SIZE,searchType,keyWord)
    else result = await reqProductList(num,PAGE_SIZE)    
    const {status,data} = result
    if(status === 0){
      this.setState({
        productList:data.list,
        total:data.total,
        current:this.pageNum
      })
      this.props.saveProduct(data.list)
    }else{
      message.error("获取商品列表失败",1)
    }
  }  
  componentDidMount(){
    this.getProductList()
  }
  //对商品进行上架和下架处理
  updateProdStatus = async({_id,status})=>{
    let productList = [...this.state.productList]
    if(status === 1) status = 2
    else status = 1
    let result = await reqUpdateProdStatus(_id,status)
    if(result.status === 0){
      message.success("更新商品状态成功")
      productList = productList.map((item)=>{
        if(item._id === _id){
          item.status = status
        }
        return item
      })
      this.setState({productList})
    }
    else message.error("更新商品状态失败")
  }
  //受控页码,语句较为简单,直接写入到标签中了
  /* onChange = (page) => {
    this.getProductList(page)
  } */
  search = async()=>{
    this.isSearch = true
    this.getProductList()
  }

  render(){
    const data = this.state.productList
    const columns = [
      {
        title: '商品名称',
        width: "18%",
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        width: "10%",
        align: "center",
        dataIndex: 'price',
        key: 'price',
        render:item=>"￥"+item 
      },
      {
        title: '状态',
        width: "10%",
        align: "center",
        key: 'status',
        // dataIndex: 'status',//不写dataindex,render中传入的便是整个行的数据
        //写了就传入dataindex对应的status
        render: (item)=>{
          return (
            <div>
              <Button
                danger={item.status===1}
                type="primary"
                onClick={()=>{this.updateProdStatus(item)}}
              >
                {item.status===1?"下架":"上架"}
              </Button>
              <br/>
              <span>{item.status===1?"在售":"已下架"}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        width: "10%",
        align: "center",
        key: 'operation',
        render:(item)=>{
          return (
            <div>
              <Button
                type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/addupdate/${item._id}`)}}
              >修改</Button>
              <Button 
                type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}
              >详情</Button>
            </div>
          )
        }
      },
    ];
    return (
      <Card 
        title={
          <div>
            <Select
              defaultValue="productName"
              onChange={(value)=>{this.setState({searchType:value});console.log(value);}}
            >
              <Option value="productName">按名称搜索</Option>
              <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input
              placeholder="关键字"
              style={{width:"20%",margin:"0 10px"}}
              onChange={(event)=>{this.setState({keyWord:event.target.value})}}
            />
            <Button
              icon={<SearchOutlined/>}
              type="primary"
              onClick={this.search}
            >搜索</Button>
          </div>
        }
        extra={<Button 
          icon={<PlusOutlined/>} 
          type="primary"
          onClick={()=>{this.props.history.push("/admin/prod_about/product/addupdate")}}
        >添加商品</Button>}
      >
        <Table columns={columns}
          dataSource={data}
          bordered
          rowKey="_id"
          pagination={{
            defaultPageSize:PAGE_SIZE,
            total:this.state.total,
            current:this.state.current,
            onChange:this.getProductList          
          }}
        />
      </Card>
    )
  }
}

export default connect(
  ()=>({}),
  {saveProduct:createSaveProduct}
)(Product)
