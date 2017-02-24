/**
 * 互联网支付
 */


/**
 * 默认Table的分页信息
 */
export const defaultPage = {
    pageSize:5,
    pageNum:1
}
/**
 * 后台返回信息标识
 */
export const rspInfo = {
    COMM_SUCCESS:"01000000",
    //对账管理-试算平衡
    RSPCOD_SUCCESS:"01000000",
    CHK_RSPCOD_SUCCESS:"01030000",
    //风控系统-交易成功
    
    //对账管理-对账模块
    CHK_SUCCESS:"01030000",
    
	RCS_EC_TXN_SUCCESS:"01050000",
    RSP_NETWORK_ERROR : "网络错误", //网络错误标识

    //订单-交易成功
    ORD_RSPCOD_SUCCESS: "01040000",
    
    //费率管理
    FEE_RSPCOD_SUCCESS: "01060000",
    //订单管理
    ORD_RES_SUCCESS:"01040000"
}
/**
 * 后台返回信息标识
 */
export const chnOrgBankRspInfo = {
	CHN_ORG_PAY_RSP_SUCCESS : "01070000",   //返回成功标识
	RSP_ERROR : "",  //返回错误标识，一般不需要
	CHN_ORG_PAY_RSP_NETWORK_ERROR : "网络错误"  //网络错误标识
}
/**
 * 会员常量
 */
export const memConstant = {
    SYS_MEMBER_USR_TYPE:"001",//用户
    SYS_MEMBER_MER_TYPE:"002",//商户
}


/**
 * 订单常量
 */
export const orderConstant = {
    ORD_TYPE_PRD:"01",//消费
    ORD_TYPE_CHARGE:"02",//充值
    ORD_TYPE_WITHDRAW:"03",//提现
    ORD_TYPE_TRANS:"04",//转账
    ORD_TYPE_REF:"05",//退款
    
    ORD_STS_SUS:"00"//订单状态成功
}

/**
 * 风控常量
 */
export const rcsConstant = {
    RCS_EXEC_TRAN_STS_SUS:"01",//可疑交易
    RCS_EXEC_TRAN_STS_EXC:"02",//异常交易
    RCS_EXEC_TRAN_STS_FREE:"03",//释放交易
    RCS_IS_NOT_USE:"0"//是否可用-禁用
}
/**
 * 对账常量
 */
export const chkConstant = {
    SYS_ID:"010",
    CHK_CHN_STS_BM:"02",//通道对账状态-业务多账
    CHK_CHN_STS_CHM:"03",//通道对账状态-通道多账
    CHK_CHN_STS_AMTERR:"04",//通道对账状态-金额不符
    CHK_ERR_DEAL_STS_FIN:"01"//错账处理状态-处理完成
}

/**
 * 公共常量
 */
export const pubConstant = {
    PUB_EXPORT_TYPE_ORD_TRANS :"01",//导出类型-转账订单导出
    PUB_EXPORT_TYPE_USR_BASIC :"02",//导出类型-用户基本信息导出
    PUB_EXPORT_TYPE_USR_ACCOUNT :"03",//导出类型-用户账户信息导出
    PUB_EXPORT_TYPE_USR_CARD :"04",//导出类型-用户银行卡绑定信息导出
    PUB_EXPORT_TYPE_STL_PAY :"05",//导出类型-结算信息导出
    PUB_EXPORT_TYPE_SHR_PAY :"06",//导出类型-分润信息导出
    PUB_EXPORT_TYPE_RCS_ONEUSERLIMIT:"07",//导出类型-风控指定用户限额导出
    PUB_EXPORT_TYPE_RCS_ALLUSERLIMIT:"08",//导出类型-风控分类用户限额导出
    PUB_EXPORT_TYPE_RCS_ONEMERLIMIT:"09",//导出类型-风控指定商户限额导出
    PUB_EXPORT_TYPE_RCS_ALLMERLIMIT:"10",//导出类型-风控所有商户限额导出
    
    PUB_EXPORT_TYPE_RCS_USERLEVEL:"11",//导出类型-用户等级信息
    PUB_EXPORT_TYPE_RCS_PAYBLACK:"12",//导出类型-用户黑名单信息
    PUB_EXPORT_TYPE_RCS_TXNRECORDINF:"13",//导出类型-实时监控记录
    PUB_EXPORT_TYPE_RCS_TXNRECORDHIS:"14",//导出类型-历史监控记录
    PUB_EXPORT_TYPE_RCS_EXCEPTRULE:"15",//导出类型-异常规则
    PUB_EXPORT_TYPE_ORD_PRD :"16",//导出类型-消费订单导出
    PUB_EXPORT_TYPE_ORD_CHA :"17",//导出类型-充值订单导出
    PUB_EXPORT_TYPE_ORD_WIT :"18",//导出类型-提现订单导出
    PUB_EXPORT_TYPE_ORD_REF :"19",//导出类型-退款订单导出
    PUB_EXPORT_TYPE_AGT_EXCEPTRULE:"20",//导出类型-代理商基本信息导出
    PUB_EXPORT_TYPE_AGT_ACC_EXCEPTRULE:"21",//导出类型-代理商账户信息导出
	PUB_EXPORT_TYPE_MER_BASIC:"22",//导出类型-商户信息管理记录导出
    PUB_EXPORT_TYPE_MERACC:"23",//导出类型-商户账户信息记录导出
    PUB_EXPORT_TYPE_CAS_ACCBALANCEINFO: "24",//账户平衡查询信息记录导出
    PUB_EXPORT_TYPE_CAS_SUBBALANCEINFO: "25",//科目平衡查询信息记录导出
    PUB_EXPORT_TYPE_CHK_COREACC:"26",//导出类型-核心对账信息记录导出
    PUB_EXPORT_TYPE_CHK_ERRORINF:"27",//导出类型-错账处理列表
    PUB_EXPORT_TYPE_CHK_DOUBT:"28",//导出类型-疑账处理列表
    PUB_EXPORT_TYPE_CHK_PAYCHN:"29",//导出类型-支付通道对账单
    PUB_EXPORT_TYPE_REPORT_USRDAILYORD:"30",//导出类型-用户每日交易统计
    
    PUB_AUTH_OBJECT_PERSON    :"00",//可查看对象-个人
    PUB_AUTH_OBJECT_MER       :"01",//可查看对象-商户
    PUB_AUTH_OBJECT_ROLE      :"02",//可查看对象-角色
    
    PUB_DELETE_FILE_CAN_NOT   : "00",//文件是否可删除-否
    PUB_DELETE_FILE_CAN       : "01",//文件是否可删除-是
    PUB_SAVE_DAYS             : "7",//文件保存天数
   
    
}

/**总的非法字符 */
export const invalidCharacters = ["%", "_", "(", ")", "{", "}","@"];
/**特殊字符的判断--不能连续输入两次或多次  以及对应的正则判断表达式 */
export const continueRepeatCharacters = ["@"];
export const constinueRepeatCharacterReg = /[@]{2}/;
/**特殊的字符 该字符不能在最前面也不能在最后面*/
export const specialCharacters = ["_"];
/**删除，修改，新增初步判断标识 --可添加其他相关修改标识 */
export const operationFlags = ["del","revise","update","upd","add"];
