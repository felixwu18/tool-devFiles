
const checkID = (val) => {
  if (checkCode(val)) {
    let date = val.substring(6, 14);
    if (checkDate(date)) {
      if (checkProv(val.substring(0, 2))) {
        return true;
      }
    }
  }
  return false;
};
// 校验码校验
const checkCode = (val) => {
  let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  let code = val.substring(17);
  if (p.test(val)) {
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true;
    }
  }
  return false;
};
let checkDate = (val) => {
  let pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if (pattern.test(val)) {
    let year = val.substring(0, 4);
    let month = val.substring(4, 6);
    let date = val.substring(6, 8);
    let date2 = new Date(year + "-" + month + "-" + date);
   if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
     return true;
    }
  }
  return false;
};
const checkProv = (val) => {
  let pattern = /^[1-9][0-9]/;
  let provs = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门"
  };
  if (pattern.test(val)) {
    if (provs[val]) {
      return true;
    }
  }
  return false;
};

const formRegex = {
  // 含零正整数
  number: {
    regex: /^(0|[1-9]\d*)$/,
    message: "请输入正整数"
  },
  // // 邮箱
  email: {
    regex: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
    message: "请输入正确的邮箱"
  },
  // // 移动手机号
  tel: {
    regex: /^[1][3,4,5,6,7,8][0-9]{9}$/,
    message: "请输入正确的手机号"
  },
  // // 正数最多两位小数
  float: {
    regex: /^(([1-9]\d*)|(0{1}))(\.\d{1,2})?$/,
    message: "请输入正数最多两位小数"
  },
  // // 经度  >=-180 <=180 的数字
   longitude:{
     regex: /(^((-?[1-9]\d?)|(-?1[0-7]\d)|(0{1}))(\.\d{1,20})?$)|^-?180$/,
     message:"请输入-180到180之间的数字"
   },
  // // 纬度 >=-90  <=90 的数字
   latitude:{
     regex: /(^((-?[1-8]\d?)|(-?[1-8])|(0{1}))(\.\d{1,20})?$)|^-?90$/,
     message: "请输入-90到90之间的数字"
   },
  // // 座机号（住宅，办公）
  family: {
    regex: /^([0-9]{3,4}-)?[0-9]{7,8}$/,
    message: "请输入正确的座机号"
  },
  // // 传真
  fax: {
    regex: /^([0-9]{3,4}-)?[0-9]{7,8}$/,
    message: "请输入正确的传真号",
  },
  // // 正数 整数位10小数最多两位
  int10float: {
    regex: /^(([1-9]\d{0,9})|(0{1}))(\.\d{1,2})?$/,
    message: "请输入整数位10位小数位最多两位"
  },
  // //数字，字母横线下划线 和“#$%^&*”组合
  code:{
    regex: /^[(-\w)(#$%^&*)?]*$/,
    message:"请输入字数,字母或“#、$、%、^、&、-、_、*”"
  },
  // 身份证号码校验
  IDCardNo: {
    regexFun: checkID,
    message: "请输入正确的身份证号码"
  }
}

export default formRegex;