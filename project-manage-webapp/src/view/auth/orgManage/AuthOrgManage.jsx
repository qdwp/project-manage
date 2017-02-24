import React from "react"
import { Row, Tooltip, Col, Form,DatePicker, Select, Table, Button, Modal,Icon,Alert } from "antd";
import TdCard from "../../../component/TdCard";
import { openNotice,buildTableTip } from "../../../common/antdUtil";
import { tddefUrl } from "../../../config/server";
import { defaultPage } from "../../../common/authConstant";
import { rspInfo } from "../../../common/authConstant";
import { callAjax,parseDate } from '../../../common/util';
import { filterObject } from "../../../common/util";
import TdPageTable from "../../../component/TdPageTable"
import AuthOrgManageForm from "./AuthOrgManageForm";
import AuthOrgManageModalForm from "./AuthOrgManageModalForm";
import TdTreeStructure from "../../../component/TdTreeStructure";

const confirm = Modal.confirm;
const ButtonGroup = Button.Group;
/**
 * AuthOrgManage 机构管理功能
 *
 * Auth: li.sy  Time: 2016-04-29
 */
class AuthOrgManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tdTableReload: false,
            tdTableParam: {},
            advSearchShow: false,
            modalVisible: false,
            modelIsValid: false,
            modalOprType: 0,
            formReset: false,
            formData: {},
            tableSelectedRows:[],
            tableSelectedRowKeys : [],
            modalTitle:"用户管理",
            confirmLoading:false,
            treeData:[]
        }
    }
    //组件构建完成时触发
    componentDidMount() {
        this.queryAllOrg();
    }
    queryAllOrg(){
        let opt={
            url:tddefUrl.authOrg.queryOrgList,
            type:"POST",
            dataType:"json",
            data:{}
        };
        let obj = this;
        callAjax(opt,function(result){
            if(result.rspCod === rspInfo.RSP_SUCCESS){
                obj.setState({
                    treeData:result.rspData.list
                });
            }else{
                openNotice("error",result.rspMsg,"查询机构信息失败");
            }
        },function(req, info, opt){
            console.log(info);
            openNotice("error",rspInfo.RSP_NETWORK_ERROR,"提示");
        });
    }
    //按钮组点击事件
    handlerButtonGroupClick(ev) {
        const text = ev.target.innerText.replace(/\s/g, "");
        switch(text) {
            case "启用": 
                 if(this.state.tableSelectedRows.length > 0) {
                       this.handlerEnableBtnClick("enable");
                 }else {
                       openNotice("warning", "请选择需启用的记录");
                 }
                 break;
           case "禁用": 
                 if(this.state.tableSelectedRows.length > 0) {
                       this.handlerEnableBtnClick("disable");
                 }else {
                       openNotice("warning", "请选择需禁用的记录");
                 }
                 break;
           default:
                openNotice("error", "操作失败");
                break;
           }
    } 
    //点击“高级搜索”事件
    handleAdvLinkClick() {
      this.setState({advSearchShow: !this.state.advSearchShow});
    }   
    //点击添加按钮弹出添加对话框  
    handleAddBtnClick(curNode) {
        console.log("curNode = " + curNode);
        this.setState({
            formData:{parentOrgId:curNode},
            modalVisible: !this.state.modalVisible,
            modalOprType: 1,
            modalTitle:'添加机构'
        }, () => {
            //重置子组件表单数据
            this.setState({ formReset: true }, () => {
                this.setState({formReset: false});
            })              
        });
        
    }
    //添加对话框的确定按钮
    handleAddModalOk(){
      //获取addUserForm表单数据
      let addFormData = filterObject(this.state.formData);
      let obj = this;
      console.log(addFormData);
      let opt={
        url:tddefUrl.authOrg.addOrg,
        data:addFormData
      };
      //请求后台添加机构接口
      callAjax(opt,function(result){
          console.log(result);
          if(result.rspCod === rspInfo.RSP_SUCCESS){
              openNotice("info","添加机构成功","提示");
              obj.props.form.resetFields();
              obj.setState({
                  confirmLoading:false,
                  modalVisible: !obj.state.modalVisible,
                  modalOprType: 0,
                  tableSelectedRows:[],
                  tableSelectedRowKeys : [],
                  tdTableReload:true,
                  tdTableParam: {},
                  //重新加载表格数据
              },() => {obj.setState({tdTableReload:false});obj.queryAllOrg();}
              );          
          }else{
              openNotice("error",result.rspMsg,"添加机构失败");
              obj.setState({confirmLoading:false});
          }
      },function(req, info, opt){
          console.log(info);
          openNotice("error",rspInfo.RSP_NETWORK_ERROR,"提示");
          obj.setState({confirmLoading:false});
      });
    }
    //表格分页、排序、筛选变化时触发时触发事件
    handleTableChange(pagination, filters, sorter) {
      //设置分页条状态为当前点击页数
      const pager = this.state.tablePagination;
      pager.current = pagination.current;
      //查询点击的页数的记录
      this.loadTableData(pagination.current, pager.pageSize,filterObject(this.getFormData()), filters, sorter);
    }     
    // 编辑机构按钮事件
    handlerEditBtnClick(curNode) {
        let opt = {
            url:tddefUrl.authOrg.selectByOrgId,
            data: {orgId:curNode}
        };
        let obj = this;
        callAjax(opt, function (result) {
            if(result.rspCod === rspInfo.RSP_SUCCESS){
                obj.state.formData = result.rspData.authOrg;
                obj.setState({
                    modalVisible: !obj.state.modalVisible,
                    modalOprType: 2,
                    modalTitle:'编辑机构'
                }, () => {
                    //重置子组件表单数据
                    obj.setState({ formReset: true }, () => {
                        //将子组件表单重置标识置为false
                        obj.setState({formReset: false});
                    });
                });
            } else {
                openNotice("error", result.rspMsg, "查询机构信息失败");
            }
        }, function (req, info, opt) {
            console.log(info);
            openNotice("error",rspInfo.RSP_NETWORK_ERROR,"提示");
        });
        
    }
    //编辑机构弹出框确定事件
    handlEditModalOk() {
      let editFormData = filterObject(this.state.formData);
      console.log("form data =  " + editFormData);
      let opt = {
          url:tddefUrl.authOrg.ediOrg,
          data: editFormData
      };
      let obj = this;
      callAjax(opt, function (result) {
          console.log(result);
          if(result.rspCod === rspInfo.RSP_SUCCESS){
              openNotice("info", "修改机构成功", "提示");
              obj.props.form.resetFields();
              obj.setState({
                  confirmLoading:false,
                  modalVisible: !obj.state.modalVisible,
                  tableSelectedRows:[],
                  tableSelectedRowKeys : [],
                  tdTableReload:true,
                  tdTableParam: {},
                  //重新加载表格数据
               },()=>{obj.setState({tdTableReload:false});obj.queryAllOrg();}
               );
          } else {
              openNotice("error", result.rspMsg, "修改机构失败");
              obj.setState({confirmLoading:false});
          }
      }, function (req, info, opt) {
          console.log(info);
          openNotice("error",rspInfo.RSP_NETWORK_ERROR,"提示");
          obj.setState({confirmLoading:false});
      });
    }
    //删除按钮点击事件
    handlerDeleteBtnClick(curNode) {
          let obj = this;
          confirm({
              title: '您是否确认要删除选中项',
              content: '',              
              onOk() {
                  let opt = {
                      url:tddefUrl.authOrg.deleteOrg,
                      data: { orgId: curNode }
                  }
                  callAjax(opt, function (result) {
                      if(result.rspCod === rspInfo.RSP_SUCCESS){
                          openNotice("info", "删除机构成功", "提示");
                          obj.setState({
                              tdTableReload:true,
                              tdTableParam: {},
                          },()=>{obj.setState({tdTableReload:false});obj.queryAllOrg();});
                      } else {
                          openNotice("error", result.rspMsg, "删除机构失败");
                      }
                  }, function (req, info, opt) {
                      console.log(info);
                      openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
                  });
              },onCancel() { }
          });
      
    } 
    /**
    * 启用按钮点击事件
    */
    handlerEnableBtnClick(curNode) {
        this.handlerRecordSts("enable",curNode);
        
    }
    /**
    * 禁用按钮点击事件
    */
    handlerDisableBtnClick(curNode) {
        this.handlerRecordSts("disable",curNode);
        
    }
    handlerRecordSts(param,curNode) {
      let obj = this;
      console.log(curNode);
      if(param === "enable" && curNode.isUse ==="1"){
          openNotice("warn","机构状态已启用，无需操作","提示");
          return;
      }
      if(param === "disable" && curNode.isUse ==="0"){
          openNotice("warn","机构状态已禁用，无需操作","提示");
          return;
      }
      confirm({
          title: "您是否确认要" + (param === "enable" ? "启用" : "禁用") + "选中项",
          content: "",
          onOk() {
              let opt = {
                  url:tddefUrl.authOrg.enableOrg,
                  data: { isUse: (param === "enable" ? "1" : "0"), orgId: curNode }
              }
              callAjax(opt, function (result) {
                  if(result.rspCod === rspInfo.RSP_SUCCESS){
                      openNotice("info", (param === "enable" ? "启用" : "禁用") + "机构成功", "提示");
                      obj.setState({
                              tdTableReload:true,
                              tdTableParam: {},
                          },()=>{
                              obj.setState({tdTableReload:false});
                              obj.queryAllOrg();
                      });
                  } else {
                      openNotice("error", result.rspMsg, (param === "enable" ? "启用" : "禁用") + "机构失败  ");
                  }
              }, function (req, info, opt) {
                  console.log(info);
                  openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
              });
          },onCancel() { }
      });
    }  
    //搜索
    handleFormSubmit(dat) {
        this.setState({tdTableReload: true, tdTableParam: dat},()=>{
            this.setState({tdTableReload:false});
        }); 
    }
    handleFormReset() {
         this.setState({formData: {}});
    }
    //模态框确认点击事件，修改子页面props valid状态,触发子页面执行回调
    handleModalOk() {
      this.setState({modelIsValid: true});
    }
    //模态框子页面回调
    callbackValid(oprType, errors, data) {
      this.setState({modelIsValid: false});
      const obj = this;
      if (!!errors) {
          console.log("表单校验失败!");
          return;
      } else {
          console.log("子页面表单校验成功。");
          console.log("modal form data=>" + data);
          this.setState({
              formData: Object.assign({}, this.state.formData, data),
              formReset: false,
              confirmLoading:true
          }, () => {
              switch (oprType) {
                  case 1:
                      obj.handleAddModalOk();
                      break;
                  case 2:
                      obj.handlEditModalOk();
                      break;
                  default:
                      openNotice("error", "操作失败");
                      break;
              }
          });
      }
    } 
    renderTableList(result) {
      return {
          total: result.rspData.total,
          list: result.rspData.list
      };
    }
    handlerRowSelect(selectedRowKeys, selectedRows){
      this.setState({
          tableSelectedRows:selectedRows,
          tableSelectedRowKeys : selectedRowKeys
      });
    } 

    render() {
       //定义变量和参数
       const obj = this;
       const modalIsDetail = { footer: ""}        
        const tableColumns = [
            {title: "机构编号", dataIndex: "orgId"},
            {title: "机构名", dataIndex: "orgName"},
            {title: "上级机构编号", dataIndex: "parentOrgId"},
            {title: "机构描述", dataIndex: "orgDesc", render:(text) => buildTableTip(text,100)},
            {title: "是否使用", dataIndex: "isUse",render(text, record, key){
                    return (
                         text === "1" ? "启用" : "禁用"
                    );
                }
            },
            {title: "创建人", dataIndex: "creObj"},
            {title: "创建时间", dataIndex: "creTim",width:140,render:(text) => parseDate(text)},
            {title: "更新人", dataIndex: "updObj"},
            {title: "更新时间", dataIndex: "updTim",width:140,render:(text) => parseDate(text)},
        ];        
        const tableRowSelection = {
            selectedRowKeys:obj.state.tableSelectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
                obj.setState({
                    tableSelectedRowKeys:selectedRowKeys,
                    tableSelectedRows:selectedRows
                });
            },
        };
        const toolbar = [
            {icon: "plus", text: "新增子机构", click: (curNode) => {obj.handleAddBtnClick(curNode)}},
            {icon: "edit", text: "修改本机构", click: (curNode) => {obj.handlerEditBtnClick(curNode)}},
            {icon: "cross", text: "删除本机构", click: (curNode) => {obj.handlerDeleteBtnClick(curNode)}},
            {icon: "check", text: "启用本机构", click: (curNode) => {obj.handlerEnableBtnClick(curNode)}},
            {icon: "minus", text: "禁用本机构", click: (curNode) => {obj.handlerDisableBtnClick(curNode)}}
        ]
        const columnsTree = [
            { title: "机构ID", dataIndex: "orgId" },
            { title: "机构名称", dataIndex: "orgName" },
            { title: "机构描述", dataIndex: "orgDesc" },
            { title: "创建人", dataIndex: "creObj" },
            {
                title: "创建时间", dataIndex: "creTim", render(v) {
                    if (v.length === 14) {
                        return `${v.substring(0, 4)}-${v.substring(4, 6)}-${v.substring(6, 8)} ${v.substring(8, 10)}:${v.substring(10, 12)}:${v.substring(12, 14)}`;
                    } else {
                        return v;
                    }
                }
            }
        ];
        //渲染虚拟DOM
        return (
           <div>
               <TdCard hideHead shadow>
                    <Alert message={(<span><b>公司组织架构</b> &nbsp;请在节点上点击 <b>右键</b> 进行操作</span>) } type="info" showIcon />
                    <TdTreeStructure columns={tableColumns} actions={toolbar} data={this.state.treeData[0]} dict={{ key: "key", text: "orgName" }} />
                    <Modal 
                          title={this.state.modalTitle} visible={this.state.modalVisible} 
                          confirmLoading={this.state.confirmLoading}
                          onCancel={() => { this.setState({ modalVisible: false }); } } 
                          onOk={this.handleModalOk.bind(this) }
                          {...(this.state.modalOprType === 3 ? modalIsDetail : null) }>
                          <AuthOrgManageModalForm formReset={this.state.formReset}
                           valid={this.state.modelIsValid}
                           formData={this.state.formData}
                           oprType={this.state.modalOprType}
                           validCallback={(oprType, errors, data) => {
                               this.callbackValid(oprType, errors, data);
                           } }/>
                   </Modal>
                </TdCard>
           </div>
           );
       }
}
//必须有create包装,才会带this.props.form属性
AuthOrgManage = Form.create()(AuthOrgManage);
export default AuthOrgManage;