var Promise = require('es6-promise.js');
var WxRequest = require('wxRequest.js');
var PageUrl = require('PageUrl.js');
// var myCache = require('../wcache.js');
// const qiniuUploader = require("../qiniuUploader");
var app = getApp();
/**
 * 多图上传
 */
function uploadImages(tempFilePaths, saveDir, i, okArr, cb) {
  var that = this;
  if (tempFilePaths.length==0) {
    wx.hideLoading();
    cb([])
    return;
  }  
  var upUrl = 'https://nb399.oss-cn-hangzhou.aliyuncs.com';
  let fileId = Date.now().toString(36)
  fileId += Math.random().toString(36).substr(3).concat('_'+tempFilePaths[i].width +'_'+ tempFilePaths[i].height);
  let filePath = tempFilePaths[i].url;
  wx.showLoading({
    title: '上传' + (i+1) + '/' + tempFilePaths.length,
  })
  wx.uploadFile({
    url: upUrl,
    filePath: filePath,
    name: 'file',
    formData: {
      name: filePath,
      key: saveDir + fileId,
      policy: 'eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==',
      OSSAccessKeyId: 'LTAIgp9NVodxC5Jy',
      signature: 'FKPTHUeq4fUUl45OyZzvilmjkSw=',
      success_action_status: "200"
    },
    success: function(res) {
      let saveUrl = upUrl + '/' + saveDir + fileId;
      okArr.push(saveUrl)
      console.log(i, okArr, tempFilePaths.length)
      if (i == (tempFilePaths.length - 1)) {
        console.log(okArr)
        wx.hideLoading();
        cb(okArr)
      } else {
        that.uploadImages(tempFilePaths, saveDir, ++i, okArr, cb)
      }
    }
  })

}
/**
 * 是否为空
 */
function isEmpty(a) {
  //    var a = "";
  //    var a = " ";
  //    var a = null;
  //    var a = undefined;
  //    var a = [];
  //    var a = {};
  //    var a = NaN;

  if (a === undefined) { // 只能用 === 运算来测试某个值是否是未定义的
    console.log("为undefined");
    return true;
  }

  if (a == null) { // 等同于 a === undefined || a === null
    console.log("为null");
    return true;
  }


  // String    
  if (a == "" || a == null || a == undefined) { // "",null,undefined
    console.log("字符串为空");
    return true;
  }
  if (!a) { // "",null,undefined,NaN
    console.log("为空");
    return true;
  }


  // Array
  if (a.length == 0) { // "",[]
    console.log("数组为空");
    return true;
  }
  if (!a.length) { // "",[]
    console.log("为空");
    return true;
  }

  // Object {}
  if (Object.getOwnPropertyNames(a).length==0) { // 普通对象使用 for...in 判断，有 key 即为 false
    console.log("对象为空");
    return true;
  }
  return false;
}
/**
 * 是否为空对象
 */
function isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}


function uploadFileOne(i, tempFilePaths, saveDir, cb) {
  let fileId = Date.now().toString(36)
  fileId += Math.random().toString(36).substr(3);
  let filePath = tempFilePaths[i]
  var upUrl = 'https://nb399.oss-cn-hangzhou.aliyuncs.com';
  wx.uploadFile({
    url: upUrl,
    filePath: filePath,
    name: 'file',
    formData: {
      name: filePath,
      key: saveDir + fileId,
      policy: 'eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==',
      OSSAccessKeyId: 'LTAIgp9NVodxC5Jy',
      signature: 'FKPTHUeq4fUUl45OyZzvilmjkSw=',
      success_action_status: "200"
    },
    success: function(res) {
      let saveUrl = upUrl + '/' + saveDir + fileId;
      wx.hideLoading();
      cb(saveUrl)
    }
  })
}

// 多久之前
function getFotmatTime(createtime) {
  var now = Date.parse(new Date()) / 1000;
  var limit = now - createtime;
  var content = "";
  if (limit < 60) {
    content = "刚刚";
  } else if (limit >= 60 && limit < 3600) {
    content = Math.floor(limit / 60) + "分钟前";
  } else if (limit >= 3600 && limit < 86400) {
    content = Math.floor(limit / 3600) + "小时前";
  } else if (limit >= 86400 && limit < 2592000) {
    content = Math.floor(limit / 86400) + "天前";
  } else if (limit >= 2592000 && limit < 31104000) {
    content = Math.floor(limit / 2592000) + "个月前";
  } else {
    content = "很久前";
  }
  return content;
}

function toastNoIcon(str) {
  wx.showToast({
    title: str,
    icon: 'none'
  })
}
// 第一个参数是要求和的数组对象，后面是要求和的字段（不定项），如果要求和的字段值是字符串也做了相应转换
function obj_sum(arr, ...param) {
  var temp = {};
  arr.forEach(function(item, index) {
    for (var k in item) {
      if (param.indexOf(k) >= 0) {
        if ((typeof item[k]) == 'string') {
          item[k] = item[k] * 1
        }
        if (temp[k]) {
          temp[k] += item[k];
        } else {
          temp[k] = item[k];
        }
      }
    }
  });
  return temp;
};
//深度拷贝对象
function copyObj(a) {
  var c = {};
  c = JSON.parse(JSON.stringify(a));
  return c;
}

function checkPic(filePath) {
  var params = {
    url: "check/pic",
    method: 'POST',
    data: {
      url: filePath
    }
  }
  return WxRequest._Prequest(params);
}
/**
 * 对象数组按属性倒叙
 */
function objArrCompare(property) {
  return function(obj1, obj2) {
    var value1 = obj1[property];
    var value2 = obj2[property];
    return value2 - value1; // 升序
  }
}
/**
 * 生成随机字符串（时间+）
 */
function randomChar(l) {
  var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  var tmp = "";
  var timestamp = new Date().getTime();
  for (var i = 0; i < 4; i++) {
    tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
  }
  return timestamp + tmp;
}
/**
 * 解析&参数
 */
function parseUrl(query) {
  var queryArr = query.split("&");
  var obj = {};
  queryArr.forEach(function(item) {
    var value = item.split("=")[0];
    var key = item.split("=")[1];
    obj[value] = key;
  });
  return obj;
}
/**
 * 从服务器更新用户本地信息
 */
function updateLocalInfo(that) {
  let params = {
    url: 'user_profile',
    method: 'GET',
  }
  WxRequest._Prequest(params).then(res => {
    console.log(res);
    wx.setStorageSync('userinfo', res.data)
    that.setData({
      userinfo: res.data
    })
  }, res => {
    console.log('updateLocalInfo：网络错误')
  })
}
/**
 * 未登录提示
 */
function promptNotLoggedIn() {
  wx.showToast({
    title: '您还没有登录',
    icon: 'none',
    duration: 1500,
    success() {
      setTimeout(function() {
        wx.switchTab({
          url: '/pages/mine/index/index',
        })
      }, 1500)
    }
  })
}
/**
 * 获取七牛上传toeken,并设置uptoken缓存时间
 */
function getUptokenFromServer() {
  return new Promise(function(resolve, reject) {
    let uptoken = myCache.get('uptoken');
    if (uptoken) {
      resolve(uptoken)
    } else {
      let params = {
        url: 'qiniu/token',
        method: 'GET',
      }
      WxRequest._Prequest(params).then(res => {
        myCache.put('uptoken', res.data.uptoken, 3500);
        resolve(res.data.uptoken)
      })
    }
  })


}
/**
 * 选择图片阿里云上传一张
 */
function aliChooseUpload(saveDir, cb) {
  var that = this;
  var imgKey = Date.parse(new Date()) + '.jpg';
  // 选择图片
  wx.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    success: function(res) {
      console.log(res)
      wx.showLoading({
        title: '正在上传',
      })
      var filePath = res.tempFilePaths[0];
      var upUrl = 'https://nb399.oss-cn-hangzhou.aliyuncs.com';
      let fileId = filePath.slice(20);
      wx.uploadFile({
        url: upUrl,
        filePath: filePath,
        name: 'file',
        formData: {
          name: filePath,
          key: saveDir + fileId,
          policy: 'eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==',
          OSSAccessKeyId: 'LTAIgp9NVodxC5Jy',
          signature: 'FKPTHUeq4fUUl45OyZzvilmjkSw=',
          success_action_status: "200"
        },
        success: function(res) {
          let saveUrl = upUrl + '/' + saveDir + fileId;
          wx.hideLoading();
          cb(saveUrl)
        }
      })



    }
  })
}
/**
 * 选择图片七牛上传一张
 */
function qiniuChooseUpload(sourceType, cb) {
  var that = this;
  var imgKey = Date.parse(new Date()) + '.jpg';
  // 选择图片
  wx.chooseImage({
    count: 1,
    sourceType: sourceType,
    success: function(res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      getUptokenFromServer().then(uptoken => {
        wx.showLoading({
          title: '0%',
        })
        qiniuUploader.upload(filePath, (res) => {
          cb(res)
        }, (error) => {
          console.log('error: ' + error);
        }, {
          region: 'ECN',
          domain: 'p7cwdv69q.bkt.clouddn.com',
          key: imgKey,
          uptoken: uptoken,
        }, (res) => {
          wx.showLoading({
            title: res.progress + '%',
          })
        });
      })

    }
  })
}
/**
 * 预览相册
 */
function previewImage(album, e) {
  var url = e.currentTarget.dataset.url;
  var urls = [];
  for (var i = 0; i < album.length; i++) {
    urls[i] = album[i]['image_url']
  }
  wx.previewImage({
    current: url, // 当前显示图片的http链接
    urls: urls // 需要预览的图片http链接列表
  })
}
/**
 * 验证电话号码格式
 */
function isPoneAvailable(tel) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(tel)) {
    wx.showToast({
      title: '手机号格式不正确！',
      icon: 'none'
    });
    return false;
  } else {
    return true;
  }
}
/**
 * 验证用户是否登陆
 */
function isLogined(that) {
  let token = wx.getStorageSync('token')
  return new Promise(function(reslove, reject) {
    if (token) {
      that.setData({
        userinfo: wx.getStorageSync('userinfo')
      })
      reslove(true)
    } else {
      wx.showToast({
        title: '您还未登录',
        icon: 'none',
        duration: 1500
      })
      reject('没有token')
      setTimeout(function() {
        let tempPage = PageUrl.getCurrentPageUrlWithArgs()
        app.globalData.savePageForLogin = tempPage;
        wx.switchTab({
          url: '/pages/mine/index/index'
        })
      }, 1500)
    }
  })
}
/**
 * 跳转至充值页
 */
function goChargePage() {
  var systemInfo = wx.getSystemInfoSync()
  if (systemInfo.platform == 'ios') {
    wx.showModal({
      title: '提醒',
      content: '由于苹果公司规定，无法在小程序中进行支付。可下载‘亲家来了’继续操作',
      showCancel: false,
      confirmText: '知道了'
    })
    return;
  }
  wx.navigateTo({
    url: '/pages/mine/charge/charge',
  })
}
/**
 * 验证本地用户是否实名认证
 */
function isLocalCertifyed() {
  let userinfo = wx.getStorageSync('userinfo');
  return new Promise(function(reslove, reject) {
    if (userinfo.certification == 1) {
      reslove(true)
    } else {
      reslove(false)
    }

  })
}

function isHighSpan(temp) {
  var re = '<spanclass="highlight">$&</span>'
  if (re.indexOf(temp) == -1) return false;
  return true;
}
/**
 * 字符串不为空且不全是空格
 */
function checkIsBlank(str) {
  if (this.isEmpty(str)) return true;
  while (str.lastIndexOf(" ") >= 0) {
    str = str.replace(" ", "");
  }
  if (str.length == 0) {
    console.log('空白')
    return true;
  } else {
    return false;
  }
}
module.exports = {
  checkIsBlank: checkIsBlank,
  isEmpty: isEmpty,
  isHighSpan: isHighSpan,
  updateLocalInfo: updateLocalInfo,
  promptNotLoggedIn: promptNotLoggedIn,
  qiniuChooseUpload: qiniuChooseUpload,
  previewImage: previewImage,
  isPoneAvailable: isPoneAvailable,
  isLogined: isLogined,
  isLocalCertifyed: isLocalCertifyed,
  parseUrl: parseUrl,
  randomChar: randomChar,
  aliChooseUpload: aliChooseUpload,
  getCurrentPageUrlWithArgs: PageUrl.getCurrentPageUrlWithArgs,
  getCurrentPageUrl: PageUrl.getCurrentPageUrl,
  goChargePage: goChargePage,
  objArrCompare: objArrCompare,
  copyObj: copyObj,
  obj_sum: obj_sum,
  toastNoIcon: toastNoIcon,
  getFotmatTime: getFotmatTime,
  uploadFileOne: uploadFileOne,
  uploadImages: uploadImages
}