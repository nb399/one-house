
import { Token } from 'utils/token.js';
var Promise = require('utils/es6-promise.js')
var wxRequest = require('utils/wxRequest');
var wxApi = require('utils/wxApi');

App({
  onLaunch: function (options) {
    
    var that = this;
 console.log(options)
    that.globalData.options = options



      },

  verify: function () {
    var that=this;
    var token = wx.getStorageSync('token');
    //1.验证token
    var url = 'https://www.cy.ishtml.com/20181128/public/index.php/api/v1/token/verify';
    var data = { token: token };
    
    //2.获取token
    return wxRequest.postRequest(url, data).then(res => {
     
      console.log(res)
      var wxGetUserInfo = wxApi.wxGetUserInfo()
      if (res.data.isValid) {
        console.log("验证token有效")
        wx.hideLoading();
        wx.setStorageSync('uid', res.data.uid)
        return wxGetUserInfo().then(res => {
          url = 'https://www.cy.ishtml.com/20181128/public/index.php/api/v1/token/userinfo';
          console.log(res.userInfo)

          data= {uid: wx.getStorageSync('uid'),data: res.userInfo}
          wxRequest.postRequest(url, data);
          wx.setStorageSync('userinfo', res.userInfo)
          console.log(res)
          return 14;
        }, res => {
          wx.setStorageSync('userinfo', res.userInfo)
          console.log(res)
          wx.redirectTo({
            url: "/pages/login/login?path=/" + this.globalData.options.path + "&article_id=" + this.globalData.options.query.article_id,
          })
          return 0;
        })        
      }
      else {
        console.log("验证token无效")
        wx.showLoading({
          title: '正在登陆',
        })
        var wxLogin = wxApi.wxLogin()
        return wxLogin().then(res => {
          console.log("成功获取code")
          var url = 'https://www.cy.ishtml.com/20181128/public/index.php/api/v1/token/user';
          var data = { code: res.code };
          //2.获取token
          return wxRequest.postRequest(url, data)
        }).then(res => {
          console.log("成功获取token", res)
          wx.setStorageSync('token', res.data.token);
          
          return that.verify();
          })
      }
    })
















    // var token = new Token();
    // token.verify();


  },

  globalData: {
    options:null
  }
});