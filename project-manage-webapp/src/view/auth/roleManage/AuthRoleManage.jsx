//import './AuthRole.less'
import React from "react"
import { Row, Col,Form, Button, Modal, Tree } from "antd";
import QueueAnim from "rc-queue-anim";
import TdCard from "../../../component/TdCard";
import { openNotice, buildTableTip } from "../../../common/antdUtil";
import { tddefUrl } from "../../../config/server";
import { defaultPage } from "../../../common/authConstant";
import { rspInfo } from "../../../common/authConstant";
import { callAjax, parseDate} from '../../../common/util';
import { filterObject } from "../../../common/util";
import AuthRoleManageForm from "./AuthRoleManageForm";
import AuthRoleForm from "./AuthRoleForm";
import TdPageTable from "../../../component/TdPageTable";

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
/**
 * AuthRoleManage 角色管理功能
 *
 * Auth: li.sy  Time: 2016-04-29
 */
class AuthRoleManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tdTableReload: false,
            tdTableParam: {},
            modalVisible: false,
            modelIsValid: false,
            modalOprType: 0,
            formReset: false,
            formData: {},
            advSearchShow: false,
            assignModalVisible: false,
            tableData: [],
            tableSelectedRowkeys: [],
            tableSelectedRows: [],
            itemTreeData: [],
            currentSelectedRole: {},
            checkedKeys: [],
            modalTitle: '角色管理',
            confirmLoading: false
        }
    }

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
            modalTitle: '角色详情'
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
    /**
     * 点击权限分配链接显示权限信息text:该单元格数据 record:该行记录对象 key:该行KEY
     */
    handleShowRoleAssign(text, record, key) {
        const $el = $(".authRoleAssignDiv");
        if (parseInt($el.css("right")) === 0) {
            $el.stop().animate({ right: -340 });
        } else {
            $el.stop().animate({ right: 16 });
        }
        let opt = {
            url: tddefUrl.authRole.assignRole,
            data: { roleId: record.roleId }
        };
        let obj = this;
        //请求后台添加角色接口
        callAjax(opt, function (result) {
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                obj.setState({
                    itemTreeData: result.rspData.itemTree.children,
                    checkedKeys: result.rspData.roleCurrItemIdList,
                    currentSelectedRole: {
                        roleName: record.roleName,
                        roleId: record.roleId
                    }
                });
            } else {
                openNotice("error", result.rspMsg, "查询角色权限信息失败");
            }
        }, function (req, info, opt) {
            openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
        });
    }

    onCheck(checkedKeys) {
        this.setState({
            checkedKeys: checkedKeys
        });
    }

    closeAssign() {
        const $el = $(".authRoleAssignDiv");
        if (parseInt($el.css("right")) > -340) {
            $el.stop().animate({ right: -340 });
        }
    }

    //点击提交按钮重新分配角色
    handleSubmitClick() {
        let opt = {
            url: tddefUrl.authRole.assignAuth,
            data: {
                itmIds: this.state.checkedKeys.join(),
                roleId: this.state.currentSelectedRole.roleId
            }
        };
        let obj = this;
        //请求后台添加角色接口
        callAjax(opt, function (result) {
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                openNotice("success", "分配角色权限成功","提示" );
                obj.closeAssign();
            } else {
                openNotice("error", result.rspMsg, "分配角色权限失败");
            }
        }, function (req, info, opt) {
            openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
        })

    }

    //点击取消按钮隐藏新分配角色
    handleCancelClick() {
        this.closeAssign();
    }

    //点击添加按钮弹出添加对话框
    handleAddBtnClick() {
        this.setState({
            formData: {},
            modalVisible: !this.state.modalVisible,
            modalOprType: 1,
            modalTitle: '添加角色'
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
    //组件操作相关方法
    getFormData() {
        return this.props.form.getFieldsValue();
    }
    //添加对话框的确定按钮
    handleAddModalOk() {
        //获取addUserForm表单数据
        let formData = filterObject(this.state.formData);
        let opt = {
            url: tddefUrl.authRole.addRole,
            data: formData
        };
        let obj = this;
        //请求后台添加角色接口
        callAjax(opt, function (result) {
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                openNotice("success", "添加角色成功", "提示");
                obj.props.form.resetFields();
                obj.setState({
                    modalVisible: !obj.state.modalVisible,
                    modalOprType: 0,
                    confirmLoading: false,
                    tdTableReload: true,
                    tableSelectedRowKeys:[],
                    tableSelectedRows:[]
                }, () => {
                    obj.closeAssign();
                    obj.setState({
                        tdTableReload: false
                    });
                });
            } else {
                openNotice("error", result.rspMsg, "添加角色失败");
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
    //组件操作相关方法
    // getFormData() {
    //return this.props.form.getFieldsValue();
    //}

    /**
     * 编辑角色按钮事件
     */
    handlerEditBtnClick() {
        const tableSelectedRows = this.state.tableSelectedRows;
        if (tableSelectedRows !== undefined && tableSelectedRows.length === 1) {
            //this.state.formData = tableSelectedRows[0];
            this.setState({
                modalVisible: !this.state.modalVisible,
                modalOprType: 2,
                modalTitle: '编辑角色',
                formData:tableSelectedRows[0]
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
     * 编辑角色弹出框确定事件
     */
    handlEditModalOk() {
        let formData = filterObject(this.state.formData);
        let opt = {
            url: tddefUrl.authRole.editRole,
            data: formData
        };
        let obj = this;
        callAjax(opt, function (result) {
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                openNotice("success", "修改角色成功", "提示");
                obj.props.form.resetFields();
                obj.setState({
                    modalVisible: !obj.state.modalVisible,
                    modalOprType: 0,
                    confirmLoading: false,
                    tdTableReload: true,
                    tableSelectedRowKeys:[],
                    tableSelectedRows:[]
                }, () => {
                    obj.closeAssign();
                    obj.setState({
                        tdTableReload: false
                    });
                });
            } else {
                openNotice("error", result.rspMsg, "修改角色失败");
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
        if (this.state.tableSelectedRows.length ===1 ) {
            confirm({
                title: '您是否确认要删除选中项',
                content: '',
                onOk() {
                    let data = obj.state.tableSelectedRows;
                    let roleIds = "";
                    data.forEach(v => (roleIds = roleIds + "," + v.roleId + ""));
                    let opt = {
                        url: tddefUrl.authRole.deleteRole,
                        data: { roleId: roleIds.substring(1, roleIds.length) }
                    }
                    callAjax(opt, function (result) {
                        if (result.rspCod === rspInfo.RSP_SUCCESS) {
                            openNotice("success", "删除角色成功", "提示");
                            obj.setState({
                                tdTableReload: true,
                                tableSelectedRowKeys:[],
                                tableSelectedRows:[]
                            }, () => {
                                obj.closeAssign();
                                obj.setState({
                                    tdTableReload: false
                                });
                            });
                        } else {
                            openNotice("error", result.rspMsg, "删除角色失败");
                        }
                    }, function (req, info, opt) {
                        openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
                    });
                }
            });
        }else if (this.state.tableSelectedRows.length > 1) {
            openNotice("warning", "不允许同时删除多条记录");
        }else {
            openNotice("warning", "请选择需删除的记录");
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
        }else {
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
        }else {
            openNotice("warning", "请选择需禁用的记录");
        }
    }
    handlerRecordSts(param) {
        let obj = this;
        let data = obj.state.tableSelectedRows;
        let row = obj.state.tableSelectedRows[0];
        if(param === "enable" && row.isUse ==="1"){
            openNotice("warn","角色状态已启用，无需操作","提示");
            return;
        }
        if(param === "disable" && row.isUse ==="0"){
            openNotice("warn","角色状态已禁用，无需操作","提示");
            return;
        }
        let roleIds = "";
        data.forEach(v => (roleIds = roleIds + "," + v.roleId + ""));
        confirm({
            title: "您是否确认要" + (param === "enable" ? "启用" : "禁用") + "选中项",
            content: "",
            onOk() {
                let opt = {
                    url: tddefUrl.authRole.enableRole,
                    data: {
                        isUse: (param === "enable" ? "1" : "0"),
                        roleId: roleIds.substring(1, roleIds.length)
                    }
                }
                callAjax(opt, function (result) {
                    if (result.rspCod === rspInfo.RSP_SUCCESS) {
                        openNotice("success", (param === "enable" ? "启用" : "禁用") + "角色成功", "提示");
                        obj.setState({
                            tdTableReload: true,
                            tableSelectedRowKeys:[],
                            tableSelectedRows:[]
                        }, () => {
                            obj.closeAssign();
                            obj.setState({ tdTableReload: false });
                        });
                    } else {
                        openNotice("error", result.rspMsg, (param === "enable" ? "启用" : "禁用") + "角色失败");
                    }
                }, function (req, info, opt) {
                    openNotice("error", rspInfo.RSP_NETWORK_ERROR, "提示");
                });
            }
        });
    }

    handleFormSubmit(dat) {
        this.setState({
            tdTableReload: true,
            tdTableParam: dat,
            tableSelectedRowKeys:[],
            tableSelectedRows:[]
        }, () => {
            this.closeAssign();
            this.setState({ tdTableReload: false });
        });
    }

    handleFormReset() {
        this.setState({ formData: {} });
    }

    renderTableList(result) {
        return {
            total: result.rspData.total,
            list: result.rspData.list
        };
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
        const obj = this;
        if (!!errors) {
            this.setState({
              confirmLoading: false,
              modelIsValid: false
            });
            return;
        } else {
            this.setState({
                formData: Object.assign({}, this.state.formData, data),
                formReset: true,
                confirmLoading: true,
                modelIsValid: false
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
                        this.setState({
                          confirmLoading: false,
                          modelIsValid: false
                        });
                        break;
                }
            });
        }
    }
    handlerRowSelect(selectedRowKeys, selectedRows) {
        this.setState({
            tableSelectedRows: selectedRows,
            tableSelectedRowKeys: selectedRowKeys
        });
    }

    render() {
        //定义变量和参数
        const obj = this;
        const modalIsDetail = {
            footer: ""
        }
        const tableColumns = [
            { title: "角色名称", dataIndex: "roleName", width: 200, render: (text) => buildTableTip(text, 200) },
            { title: "角色状态", dataIndex: "isUse", width: 100, render: (text) => text === "1" ? "启用" : "禁用" },
            { title: "所属系统", dataIndex: "sysName", width: 160, render: (text) => buildTableTip(text, 160) },
            { title: "角色描述", dataIndex: "roleDesc", width: 200, render: (text) => buildTableTip(text, 200) },
            { title: "创建人", dataIndex: "creObj", width: 110 },
            { title: "创建时间", dataIndex: "creTim", width: 170, render: (text) => buildTableTip(parseDate(text), 170) },
            { title: "更新人", dataIndex: "updObj", width: 110 },
            { title: "更新时间", dataIndex: "updTim", width: 170, render: (text) => buildTableTip(parseDate(text), 170) },
            {
                title: "操作", key: "operation",width: 110, render(text, record, key) {
                    return (
                        <span style={{"width": 110,"display":"block"}}>
                            <a href="javascript:void(0)" onClick={() => { obj.handleDetailLinkClick(text, record, key) } }>详情</a>
                            <span className="ant-divider"></span>
                            <a href="javascript:void(0)" onClick={() => { obj.handleShowRoleAssign(text, record, key) } }>分配权限</a>
                        </span>
                    );
                }
            }

        ];
        const tableRowSelection = {
            selectedRowKeys: obj.state.tableSelectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
                obj.setState({
                    tableSelectedRowKeys: selectedRowKeys,
                    tableSelectedRows: selectedRows
                });
            }
        };

        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.itmName} disableCheckbox={item.key === '0-0-0'}>
                        {loop(item.children) }
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.itmName} />;
        });
        const assignTreeInfoVDom = (
            <div>
                <Row>
                    <Col span="12"> <h4>当前选择角色: </h4>{this.state.currentSelectedRole.roleName}</Col>
                    <Col span="12" style={{ textAlign: "right" }}>
                        <Button type="primary" onClick={this.handleSubmitClick.bind(this) }>提交</Button>
                        <Button style={{ marginLeft: 10 }} onClick={this.handleCancelClick.bind(this) }>取消</Button>
                    </Col>
                </Row>
                <hr/>
                <h4>角色权限: </h4>
                <Tree className="myCls" showLine multiple checkable
                    onExpand={this.onExpand} checkedKeys={this.state.checkedKeys}
                    onCheck={this.onCheck.bind(this) }>
                    {loop(this.state.itemTreeData) }
                </Tree>
            </div>

        );
        const toolbar = [
            { icon: "plus", text: "新增", click: () => { obj.handleAddBtnClick() } },
            { icon: "edit", text: "修改", click: () => { obj.handlerEditBtnClick() } },
            { icon: "cross", text: "删除", click: () => { obj.handlerDeleteBtnClick() } },
            { icon: "check", text: "启用", click: () => { obj.handlerEnableBtnClick() } },
            { icon: "minus", text: "禁用", click: () => { obj.handlerDisableBtnClick() } }
        ]
        const roleAssignStyle = {
            position: "absolute",
            minHeight: 360,
            top: 263,
            right: -336,
            padding: 16,
            backgroundColor: "#fff",
            border: "solid 1px #e9e9e9",
            borderRadius: 2,
            width: 320,
            zIndex: 2,
            filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#cccccc')",
            boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)"
        };
        //渲染虚拟DOM
        return (
            <TdCard hideHead="true" shadow="true">
                <AuthRoleManageForm onSubmit={this.handleFormSubmit.bind(this) } onReset={this.handleFormReset.bind(this) } />
                <p className="br"/>
                <div>
                    <div className="authRoleAssignDiv" style={roleAssignStyle}>
                        {assignTreeInfoVDom}
                    </div>
                    <TdPageTable width="1320" rowKey={record => record.roleId} scroll={{ x: "true" }}
                        rowSelectCallback={this.handlerRowSelect.bind(this) }
                        url={tddefUrl.authRole.queryRoleList}
                        toolbar={toolbar}
                        loadParam={this.state.tdTableParam} reload={this.state.tdTableReload}
                        renderResult={this.renderTableList} columns={tableColumns} />
                </div>
                <Modal title={this.state.modalTitle}
                       visible={this.state.modalVisible}
                       confirmLoading={this.state.confirmLoading}
                      onCancel={() => { this.setState({ modalVisible: false }); } }
                      onOk={this.handleModalOk.bind(this) }
                    {...(this.state.modalOprType === 3 ? modalIsDetail : null) }>
                    <AuthRoleForm formReset={this.state.formReset}
                        valid={this.state.modelIsValid}
                        formData={this.state.formData}
                        oprType={this.state.modalOprType}
                        validCallback={(oprType, errors, data) => {
                            this.callbackValid(oprType, errors, data);
                        } }/>
                </Modal>
            </TdCard>
        );
    }
}
//必须有create包装,才会带this.props.form属性
AuthRoleManage = Form.create()(AuthRoleManage);
export default AuthRoleManage;
