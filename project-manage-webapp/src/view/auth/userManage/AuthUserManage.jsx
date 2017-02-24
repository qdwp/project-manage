import React from "react"
import { Row, Col, Tooltip, message, Button, Modal, Icon, Transfer, Form } from "antd";
import QueueAnim from "rc-queue-anim";
import TdCard from "../../../component/TdCard";
import { openNotice, buildTableTip } from "../../../common/antdUtil";
import { tddefUrl } from "../../../config/server";
import { defaultPage } from "../../../common/authConstant";
import { rspInfo } from "../../../common/authConstant";
import { callAjax, parseDate, getLoginInfo } from '../../../common/util';
import { filterObject } from "../../../common/util";
import AuthUserManageSearchForm from "./AuthUserManageSearchForm";
import AuthUserManageForm from "./AuthUserManageForm";
import TdPageTable from "../../../component/TdPageTable"
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;
/**
 * AuthUserManage 用户管理功能
 *
 * Auth: jiangdi  Time: 2016-04-25
 * update: li.sy  Time：2016-04-26
 */
class AuthUserManage extends React.Component {
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
            tableSelectedRows: [],
            tableSelectedRowKeys: [],
            modalTitle: "用户管理",
            confirmLoading: false,
            tableLoading: false,
            tableData: [],
            usrRoleData: [],
            targetKeys: [],
            assignModalVisible: false,
            currentRecord: {},
            treeData: []
        }
    }
    //组件构建完成时触发
    componentDidMount() {
        let opt = {
            url: tddefUrl.authOrg.selectDropdownListTree,
            type: "POST",
            dataType: "json",
            data: {}
        };
        let obj = this;
        callAjax(opt, function (result) {
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                obj.setState({
                    treeData: result.rspData.list
                });
            } else {
                openNotice("error", result.rspMsg, "查询机构信息失败");
            }
        }, function (req, info, opt) {
            openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
        });
    }
    //获取当前登陆用户名
    getUsrName(){
        let usr = getLoginInfo();
        // console.log(usr);
        return usr.usrName;
    }
    //事件控制相关方法
    //点击“高级搜索”事件
    handleAdvLinkClick() {
        this.setState({
            advSearchShow: !this.state.advSearchShow
        });
    }
    //点击“详情”链接事件(text:该单元格数据 record:该行记录对象 key:该行KEY)
    handleDetailLinkClick(text, record, key) {
        this.state.formData = record;
        this.setState({
            modalVisible: !this.state.modalVisible,
            modalOprType: 3,
            modalTitle: "用户详情"
        }, () => {
            //重置子组件表单数据
            this.setState({ formReset: true }, () => {
                //将子组件表单重置标识置为false
                this.setState({
                    formReset: false
                });
            });
        });
    }

    //点击“分配角色”链接事件(text:该单元格数据 record:该行记录对象 key:该行KEY)
    handleAssignLinkClick(text, record, key) {
        let opt = {
            url: tddefUrl.authRole.disRole,
            data: {
                usrId: record.usrId
            }
        };
        let obj = this;
        callAjax(opt, function (result) {
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                obj.setState({
                    usrRoleData: result.rspData.allRoleList,
                    targetKeys: result.rspData.usrCurrRoleIdList,
                    assignModalVisible: !obj.state.assignModalVisible,
                    currentRecord: record
                });
            } else {
                openNotice("error", result.rspMsg, "查询用户角色信息失败");
            }
        }, function (req, info, opt) {
            openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
        });
    }
    handleAssignModalOk() {
        console.log(this.state.currentRecord.usrId);
        let obj = this;
        let opt = {
            url: tddefUrl.authRole.assignUsrRole,
            data: {
                usrId: obj.state.currentRecord.usrId,
                roleIds: obj.state.targetKeys.join()
            }
        };
        this.setState({
            confirmLoading: true
        });
        callAjax(opt, function (result) {
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                openNotice("success", result.rspMsg, "分配角色成功");
                obj.setState({
                    assignModalVisible: !obj.state.assignModalVisible,
                    confirmLoading: false
                });
            } else {
                obj.setState({
                    confirmLoading: false
                });
                openNotice("error", result.rspMsg, "分配角色成功失败");
            }
        }, function (req, info, opt) {
            obj.setState({
                confirmLoading: false
            });
            openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
        });
    }
    handleRestPwdLinkClick() {
        let obj = this;
        if (this.state.tableSelectedRows.length == 1) {
            confirm({
                title: '您是否确认要重置该用户密码',
                content: '',
                onOk() {
                    let data = obj.state.tableSelectedRows[0];
                    let opt = {
                        url: tddefUrl.authUsr.resetUsrPwd,
                        data: {
                            usrId: data.usrId
                        }
                    };
                    callAjax(opt, function (result) {
                        if (result.rspCod === rspInfo.RSP_SUCCESS) {
                            openNotice("success", "重置密码成功，初始密码" + result.rspData, "提示", 5);
                        } else {
                            openNotice("error", result.rspMsg, "重置密码失败");
                        }
                    }, function (req, info, opt) {
                        openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
                    });
                },
                onCancel() { }
            });
        } else if (this.state.tableSelectedRows.length > 1) {
            openNotice("warning", "不允许同时对多个用户重置密码");
        } else {
            openNotice("warning", "请选择需要操作的记录");
        }
    }
    handleUnlockLinkClick(){
      let obj = this;
      if (this.state.tableSelectedRows.length == 1) {
        confirm({
          title: '您是否确认要解锁该用户密码',
          content: '',
          onOk() {
            let data = obj.state.tableSelectedRows[0];
            let opt = {
              url: tddefUrl.authUsr.unLock,
              data: {
                usrId: data.usrId
              }
            };
            callAjax(opt, function (result) {
              if (result.rspCod === rspInfo.RSP_SUCCESS) {
                openNotice("success", "用户解锁成功");
                obj.setState({
                  tdTableReload: true,
                  tableSelectedRowKeys: [],
                  tableSelectedRows: []
                }, () => {
                  obj.setState({
                    tdTableReload: false
                  })
                });
              } else {
                openNotice("error", result.rspMsg, "用户解锁失败");
              }
            }, function (req, info, opt) {
              openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
            });
          },
          onCancel() { }
        });
      } else if (this.state.tableSelectedRows.length > 1) {
        openNotice("warning", "不允许同时对多个用户解锁");
      } else {
        openNotice("warning", "请选择需要操作的记录");
      }
    }

    //点击添加按钮弹出添加对话框
    handleAddBtnClick() {
        this.setState({
            formData: {},
            modalVisible: !this.state.modalVisible,
            modalOprType: 1,
            modalTitle: '添加用户'
        }, () => {
            //重置子组件表单数据
            this.setState({ formReset: true }, () => {
                //将子组件表单重置标识置为false
                this.setState({
                    formReset: false
                });
            })
        });
    }
    //添加对话框的确定按钮
    handleAddModalOk() {
        //获取addUserForm表单数据
        let formData = filterObject(this.state.formData);
        let opt = {
            url: tddefUrl.authUsr.addUser,
            data: formData
        };
        let obj = this;
        //请求后台添加用户接口
        callAjax(opt, function (result) {
            console.log(result);
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                openNotice("success", "添加用户成功,初始密码为"+result.rspData, "提示");
                obj.props.form.resetFields();
                obj.setState({
                    confirmLoading: false,
                    modalVisible: !obj.state.modalVisible,
                    modalOprType: 0,
                    tdTableReload: true,
                    tableSelectedRowKeys: [],
                    tableSelectedRows: []
                }, () => {
                    obj.setState({
                        tdTableReload: false
                    });
                });

            } else {
                openNotice("error", result.rspMsg, "添加用户失败");
                obj.setState({
                    confirmLoading: false
                });
            }
        }, function (req, info, opt) {
            openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
            obj.setState({
                confirmLoading: false
            });
        });
    }
    /**
     * 编辑用户按钮事件
     */
    handlerEditBtnClick() {
        const tableSelectedRows = this.state.tableSelectedRows;
        if (tableSelectedRows !== undefined && tableSelectedRows.length === 1) {
            console.log(this.state.tableSelectedRows);
            this.state.formData = tableSelectedRows[0];
            this.setState({
                modalVisible: !this.state.modalVisible,
                modalOprType: 2,
                modalTitle: '编辑用户'
            }, () => {
                //重置子组件表单数据
                this.setState({ formReset: true }, () => {
                    //将子组件表单重置标识置为false
                    this.setState({
                        formReset: false
                    });
                })
            });
        } else if (tableSelectedRows !== undefined && tableSelectedRows.length === 0) {
            openNotice("warning", "请选择需修改的记录");
        } else {
            openNotice("warning", "不允许修改多条记录");
        }
    }
    /**
     * 编辑用户弹出框确定事件
     */
    handlEditModalOk() {
        let formData = filterObject(this.state.formData);
        console.log("form data =  " + formData);
        let opt = {
            url: tddefUrl.authUsr.editUser,
            data: formData
        };
        let obj = this;
        callAjax(opt, function (result) {
            console.log(result);
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                openNotice("success", "修改用户成功", "提示");
                obj.props.form.resetFields();
                obj.setState({
                    confirmLoading: false,
                    modalVisible: !obj.state.modalVisible,
                    modalOprType: 0,
                    tdTableReload: true,
                    tableSelectedRowKeys: [],
                    tableSelectedRows: []
                }, () => {
                    obj.setState({
                        tdTableReload: false
                    });
                });
            } else {
                openNotice("error", result.rspMsg, "修改用户失败");
                obj.setState({
                    confirmLoading: false
                });
            }
        }, function (req, info, opt) {
            openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
            obj.setState({
                confirmLoading: false
            });
        });
    }
    /**
     * 删除按钮点击事件
     */
    handlerDeleteBtnClick() {
        let obj = this;
        let row = obj.state.tableSelectedRows[0];
        // console.log(row);
        
        if (this.state.tableSelectedRows.length === 1) {
            //如果禁用的用户和当前用户相同 不允许删除
            if (row.usrName === obj.getUsrName()) {
                openNotice("warn", "禁止删除当前用户", "提示");
                return;
            }
            confirm({
                title: '您确认要删除改该用户吗？',
                content: '',
                onOk() {
                    let data = obj.state.tableSelectedRows;
                    let usrIds = "";
                    data.forEach(v => (usrIds = usrIds + "," + v.usrId + ""));
                    let opt = {
                        url: tddefUrl.authUsr.deleteUser,
                        data: { usrId: usrIds.substring(1, usrIds.length) }
                    }
                    callAjax(opt, function (result) {
                        if (result.rspCod === rspInfo.RSP_SUCCESS) {
                            openNotice("success", "删除用户成功", "提示");
                            //重新加载table数据
                            obj.setState({
                                tdTableReload: true,
                                tableSelectedRowKeys: [],
                                tableSelectedRows: []
                            }, () => {
                                obj.setState({
                                    tdTableReload: false
                                })
                            });
                        } else {
                            openNotice("error", result.rspMsg, "删除用户失败");
                        }
                    }, function (req, info, opt) {
                        openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
                    });
                },
                onCancel() { }
            });
        } else if (this.state.tableSelectedRows.length > 0) {
            openNotice("warning", "不允许同时删除多条记录");
        } else {
            openNotice("warning", "请选择需要删除的记录");
        }
    }
    /**
      * 启用按钮点击事件
      */
    handlerEnableBtnClick(param) {
        if (this.state.tableSelectedRows.length === 1) {
            this.handlerRecordSts("enable");
        } else if (this.state.tableSelectedRows.length > 1) {
            openNotice("warning", "不允许同时启用多条记录");
        } else {
            openNotice("warning", "请选择需启用的记录");
        }
    }
    /**
    * 禁用按钮点击事件
    */
    handlerDisableBtnClick() {
        if (this.state.tableSelectedRows.length === 1) {
            this.handlerRecordSts("disable");
        } else if (this.state.tableSelectedRows.length > 1) {
            openNotice("warning", "不允许同时禁用多条记录");
        } else {
            openNotice("warning", "请选择需禁用的记录");
        }
    }
    handlerRecordSts(param) {
        let obj = this;
        let data = obj.state.tableSelectedRows;
        let row = obj.state.tableSelectedRows[0];
        if (param === "enable" && row.usrStatus === "1") {
            openNotice("warn", "用户状态已启用，无需操作", "提示");
            return;
        }
        if (param === "disable" && row.usrStatus === "0") {
            openNotice("warn", "用户状态已禁用，无需操作", "提示");
            return;
        }
        //如果禁用的用户和当前用户相同 不允许禁用
        if(row.usrName === obj.getUsrName()){
            openNotice("warn", "禁止禁用当前用户", "提示");
            return;
        }
        let usrIds = "";
        data.forEach(v => (usrIds = usrIds + "," + v.usrId + ""));
        confirm({
            title: "您是否确认要" + (param === "enable" ? "启用" : "禁用") + "选中项",
            content: "",
            onOk() {
                let opt = {
                    url: tddefUrl.authUsr.enableUser,
                    data: { usrStatus: (param === "enable" ? "1" : "0"), usrId: usrIds.substring(1, usrIds.length) }
                }
                callAjax(opt, function (result) {
                    if (result.rspCod === rspInfo.RSP_SUCCESS) {
                        openNotice("success", (param === "enable" ? "启用" : "禁用") + "用户成功", "提示");
                        //重新加载table数据
                        obj.setState({
                            tdTableReload: true,
                            tableSelectedRowKeys: [],
                            tableSelectedRows: []
                        }, () => {
                            obj.setState({
                                tdTableReload: false
                            })
                        });
                    } else {
                        openNotice("error", result.rspMsg, (param === "enable" ? "启用" : "禁用") + "用户失败");
                    }
                }, function (req, info, opt) {
                    console.log(info);
                    openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
                });
            },
            onCancel() { }
        });
    }
    handleFormSubmit(dat) {
        this.setState({ tdTableReload: true, tdTableParam: dat,tableSelectedRows: [] }, () => {
            this.setState({ tdTableReload: false });
        });
    }
    handleFormReset() {
        this.setState({ formData: {} });
    }
    //角色穿梭框事件
    handleChange(targetKeys) {
        this.setState({
            targetKeys: targetKeys
        });
    }
    handlerRowSelect(selectedRowKeys, selectedRows) {
        this.setState({
            tableSelectedRows: selectedRows,
            tableSelectedRowKeys: selectedRowKeys
        });
    }
    renderTableList(result) {
        if (result.rspCod === rspInfo.RSP_SUCCESS) {
            return {
                total: result.rspData.total,
                list: result.rspData.list
            };
        } else {
            openNotice("error", result.rspMsg, "查询失败");
        }
    }

    //模态框确认点击事件，修改子页面props valid状态,触发子页面执行回调
    handleModalOk() {
      this.setState({
        modelIsValid: true
      },()=>{
        this.setState({modelIsValid: false});
      });
    }
    //模态框子页面回调
    callbackValid(oprType, errors, data) {
        this.setState({
            modelIsValid: false
        });
        const obj = this;
        if (!!errors) {
            //openNotice("error","填写信息有误!","提示",1);
            return;
        } else {
            this.setState({
                formData: Object.assign({}, this.state.formData, data),
                formReset: false,
                confirmLoading: true
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
    render() {
        //定义变量和参数
        const obj = this;
        const tableColumns = [
            { title: "用户名", dataIndex: "usrName", width: 120, render: (text) => buildTableTip(text, 120) },
            { title: "用户姓名", dataIndex: "usrRealName", width: 120, render: (text) => buildTableTip(text, 120) },
            { title: "所属机构", dataIndex: "orgName", width: 100, render: (text) => buildTableTip(text, 100) },
            {
                title: "用户状态", dataIndex: "usrStatus", width: 100, render(text, record, key) {
                    return (
                        text === "1" ? "启用" : "禁用"
                    );
                }
            },
            { title: "最后登录时间", dataIndex: "lastLoginTime", width: 150, render: (text) => buildTableTip(parseDate(text), 150) },
            { title: "登录失败数", dataIndex: "failLoginTimes", width: 120 },
            { title: "是否被锁定", dataIndex: "isLock", width: 100 ,render(text, record, key){
              if(text == 0){
                return(<span>未锁定</span>);
              }else if(text ==1){
                return(<span>锁定</span>);
              }
            }},
            { title: "创建人", dataIndex: "creObj", width: 100 },
            { title: "创建时间", dataIndex: "creTim", width: 150, render: (text) => buildTableTip(parseDate(text), 150) },
            //以下click事件中不能使用this
            {
                title: "操作", key: "operation", width: 200, fixed: 'right', render(text, record, key) {
                    return (
                        <span>
                            <a href="javascript:void(0)" onClick={() => { obj.handleDetailLinkClick(text, record, key) } }>详情</a>
                            <span className="ant-divider"></span>
                            <a href="javascript:void(0)" onClick={() => { obj.handleAssignLinkClick(text, record, key) } }>分配角色</a>

                        </span>
                    );
                }
            }
        ];
        const assignRoleInfoVDom = (
            <Transfer
                dataSource={this.state.usrRoleData} showSearch listStyle={{ width: 200, height: 300, marginLeft: 20 }}
                titles={['未选角色', '已选角色']} operations={['添加角色', '移除角色']}
                targetKeys={this.state.targetKeys} onChange={this.handleChange.bind(this) }
                render={item => `${item.roleName}`} footer={this.renderFooter} />
        );
        const modalIsDetail = {
            footer: ""
        }
        const toolbar = [
            { icon: "plus", text: "新增", click: () => { obj.handleAddBtnClick() } },
            { icon: "edit", text: "修改", click: () => { obj.handlerEditBtnClick() } },
            { icon: "delete", text: "删除", click: () => { obj.handlerDeleteBtnClick() } },
            { icon: "check", text: "启用", click: () => { obj.handlerEnableBtnClick() } },
            { icon: "minus", text: "禁用", click: () => { obj.handlerDisableBtnClick() } },
            { icon: "notification", text: "重置密码", click: () => { obj.handleRestPwdLinkClick() } },
          { icon: "unlock", text: "解锁", click: () => { obj.handleUnlockLinkClick() } }
        ]
        //渲染虚拟DOM
        return (
            <div>
                <TdCard hideHead="true" shadow="true">
                    <AuthUserManageSearchForm treeData={this.state.treeData}
                        onSubmit={this.handleFormSubmit.bind(this) }
                        onReset={this.handleFormReset.bind(this) } />
                    <p className="br"/>

                    <TdPageTable rowKey={record => record.usrId}
                        rowSelectCallback={this.handlerRowSelect.bind(this) }
                        url={tddefUrl.authUsr.queryUserList}
                        toolbar={toolbar}
                        loadParam={this.state.tdTableParam}
                        reload={this.state.tdTableReload}
                        renderResult={this.renderTableList}
                        columns={tableColumns} />
                    <Modal  title={this.state.modalTitle} visible={this.state.modalVisible}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={() => { this.setState({ modalVisible: false }); } }
                        onOk={this.handleModalOk.bind(this) }
                        {...(this.state.modalOprType === 3 ? modalIsDetail : null) }>
                        <AuthUserManageForm formReset={this.state.formReset}
                            valid={this.state.modelIsValid}
                            formData={this.state.formData}
                            oprType={this.state.modalOprType}
                            treeData={this.state.treeData}
                            validCallback={(oprType, errors, data) => {
                                this.callbackValid(oprType, errors, data);
                            } }/>
                    </Modal>
                    <Modal width={600} title="分配角色" visible={this.state.assignModalVisible}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={() => { this.setState({ assignModalVisible: false }); } }
                        onOk={this.handleAssignModalOk.bind(this) }>
                        {assignRoleInfoVDom}
                    </Modal>
                </TdCard>
            </div>
        );
    }
}
//必须有create包装,才会带this.props.form属性
AuthUserManage = Form.create()(AuthUserManage);
export default AuthUserManage;
