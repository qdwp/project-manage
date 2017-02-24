/**
 * 校验证件类型
 */
export function apIDValid(rule, value, callback) {
    const city = {
        11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ",
        31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ",
        43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ",
        61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 "
    };
    if (!value || !/^\d{6}(18|19|20|21)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
        callback('身份证号格式错误');
        return false;
    } else if (!city[value.substr(0, 2)]) {
        callback('地址编码错误');
        return false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (value.length == 18) {
            value = value.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            let sum = 0;
            let ai = 0;
            let wi = 0;
            for (let i = 0; i < 17; i++) {
                ai = value[i];
                wi = factor[i];
                sum += ai * wi;
            }
            const last = parity[sum % 11];
            if (parity[sum % 11] != value[17]) {
                callback('校验位错误');
                return false;
            } else {
                callback();
            }
        }
    }
}

// 校验全是数字
export function numValid(rule, value, callback) {
    if (!value) {
        callback();
    } else {
        let numReg =  /^[0-9]*$/;
        if(!numReg.test(value)) 
        {
            callback('必须全是数字');
            return false; 
        } else {
            callback();
        }
    }
}

// 校验0-100数字
export function num100Valid(rule, value, callback) {
    if (!value) {
        callback();
    } else {
        let num100Reg =  /^(\d{1,2}(\.\d{1,3})?|100)$/;
        if(!num100Reg.test(value)) 
        {
            callback('必须100（含）以下的数字');
            return false; 
        } else {
            callback();
        }
    }
}
/**
 * 姓名格式校验
 */
export function userRealNameValidate(rule, value, callback){
    let reg=/^([\u4e00-\u9fa5\·]{1,10}|[a-zA-Z\.\s]{2,20})$/; //允许英文，中文和英文不能同时出现，1-20位
    if (value && reg.test(value)) {
        callback();
    } else {
        callback('只能输入中文或英文，中文与英文不能同时出现');
    }
}