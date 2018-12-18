// pages/login/login.js
import { Token } from '../../utils/token.js';
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
 parseQuery(url) {
    var ret = {};
    if(!url || url.length == 0 || url.indexOf('?') == -1) {
  return ret;
}
var query = url.split('?')[1];
var params = query.split("&"), param = [];
for (var i = params.length - 1; i >= 0; i--) {
  param = params[i].split('=');
  ret[param[0]] = decodeURIComponent(param[1]);
}
return ret;
},
  //登录
  login: function (fromPath) {
    console.log(fromPath)
    var that = this
    console.log(that.parseQuery(fromPath))
    // if (typeof success == "function") {
    //   this.data.getUserInfoSuccess = success
    // }
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log(res)
        wx.getUserInfo({
          success: function (res) {
            //平台登录
            var token = new Token();
            console.log(res)
            token.userinfo(res.userInfo, (res) => {
              wx.setStorageSync('grade', res)
            });
            wx.setStorageSync('userinfo', res.userInfo)
            console.log(fromPath)
            if (fromPath != '/pages/pbl/pbl') {
              wx.redirectTo({
                url: fromPath+'?article_id='+app.globalData.options.query.article_id,
              })
            }
            else {
              wx.switchTab({
                url: fromPath,
              })
            }
          },
          fail: function (res) {
            console.log(res)
            that.setData({
              getUserInfoFail: true
            })
          }
        })
      }
    })
  },
  //个人信息回调
  onGotUserInfo(e){
    var that=this;
    console.log(e)
    if (e.detail.errMsg =='getUserInfo:fail auth deny'){
      if (wx.openSetting) {
        wx.openSetting({
          success: function (res) {

            //尝试再次登录
            that.login(that.data.fromPath)
          }
        })
      } else {
        wx.showModal({
          title: '授权提示',
          content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
        })
    }}else{
      that.login(that.data.fromPath)

    }
  },
  //跳转设置页面授权
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {

          //尝试再次登录
          that.login(that.data.fromPath)
        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var fromPath = options.path
    console.log(options)
    that.setData({
      fromPath: fromPath
    })
    that.login(fromPath);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})