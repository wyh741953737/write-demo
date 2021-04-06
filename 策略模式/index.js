
export function isIdentity (value) {
    var ret = false;
    var idCard = value ? value.trim() : value;
    var w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    if (idCard.length == 18) {
        //身份证号码长度必须为18，只要校验位正确就算合法
        var crc = idCard.substring(17);
        var a = new Array();
        var sum = 0;
        for (var i = 0; i < 17; i++) {
            a.push(idCard.substring(i, i + 1));
            sum += parseInt(a[i], 10) * parseInt(w[i], 10);
        }
        sum %= 11;
        var res = "-1";
        switch (sum) {
            case 0: { res = "1"; break; }
            case 1: { res = "0"; break; }
            case 2: { res = "X"; break; }
            case 3: { res = "9"; break; }
            case 4: { res = "8"; break; }
            case 5: { res = "7"; break; }
            case 6: { res = "6"; break; }
            case 7: { res = "5"; break; }
            case 8: { res = "4"; break; }
            case 9: { res = "3"; break; }
            case 10: { res = "2"; break; }
        }

        if (crc.toLowerCase() == res.toLowerCase()) { ret = true; }
    }
    return ret;
}

export function isMobile (value) {
    return /^1\d{10}$/g.test(value);
}

export function isEmail (value){
    const email = value ? value.trim() : value
    // 正则由后端提供
    return /^([a-zA-Z0-9])([a-zA-Z0-9_\.\-]){2,}([a-zA-Z0-9])\@(([a-zA-Z0-9\-])+\.)+(com|edu|gov|int|mil|net|org|biz|info|pro|name|museum|coop|aero|xxx|idv|cn)$/.test(email);
}

export function isFirmContact(value) {
  return /^\d{11,12}$/g.test(value.replace(/[^0-9]/ig, ''));
}

export function isExpectAmount(value) {
  if (value === '') return true

  if (value< 3000 || value > 100000){
    return false
  }
  return value % 1000  === 0
}

export function lessMillion(value){
  return value > 0 &&  value <= 1000000
}

export function moreMillion(value){
  return value > 0 &&  value <= 99999999
}

export function moreMillionAndZero(value){
  return value >= 0 &&  value <= 99999999
}

export function isCarNumber(value){
  return !value || /^.[A-Z](\w{5,6})$/g.test(value)
}

export function isEmpty(value) {
  let returnValue = value;
  if(value instanceof Array) {
    returnValue = value.length;
  } else if (value instanceof Object) {
    returnValue = Object.keys(value).length;
  } else if(typeof value === 'string') {
    returnValue = value.replace(/(^\s+)|(\s+$)/g, '');
  }
  return !!returnValue;
}

export function hasEmojiBrow(value) {
  return /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(value);
}

export function isCreditCard (value){
  const creditCard = value ? value.trim() : value;
  return /[0-9\s+]{16,19}/.test(creditCard);
}

