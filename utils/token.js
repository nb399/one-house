import { Config } from 'config.js';

class Token {
  constructor(){
    this.verifyUrl = Config.restUrl + 'token/verify';
    this.tokenUrl = Config.restUrl + 'token/user';
    this.userinfoUrl = Config.restUrl + 'token/userinfo';
  }
  /**
   * 获取用户信息
   */
  //得到用户微信信息
  getUserInfo(cb) {

    var that = this;
    wx.login({
      success: function () {

        wx.getUserInfo({

          success: function (res) {
            typeof cb == "function" && cb(res.userInfo);
          },

          fail: function (res) {
            typeof cb == "function" && cb({
              avatarUrl: '../../imgs/icon/user@default.png',
              nickName: '好好看房'
            });
          }

        });
      },

    })
  }
  userinfo(data){
    var that=this;
    var token=wx.getStorageSync('token')
wx.request({
  url: that.userinfoUrl,
  method: 'POST',
  data: {
    uid: wx.getStorageSync('uid'),
    data: data
  },
  header: {
    'content-type': 'application/json',
    'token': token
  },
  success: function (res) {

  }
})
  }

  verify() {
    var that=this;
    var token = wx.getStorageSync('token');
    if (!token) {
    
      that.getTokenFromServer();
    }
    else {
  
 
      that._veirfyFromServer(token);
    } 
  }

 // 携带令牌去服务器校验令牌
  _veirfyFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl,
      method: 'POST',
      data: {
        token: token
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
    
        that.getUserInfo((data) => {
          that.userinfo(data);
          wx.setStorage({
            key: 'userinfo',
            data: data,
          })
        })
        var valid = res.data.isValid;
        wx.setStorageSync('uid', res.data.uid)
        if (!valid) {
         
          that.getTokenFromServer();
        }
      }
    })
  }

  //从服务器获取token
  getTokenFromServer(callBack) {
    var that = this;
    wx.login({
      success: function (res) {
   

        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res) {
      
            wx.setStorageSync('token', res.data.token);
            that._veirfyFromServer(res.data.token)
            callBack && callBack(res.data.token);
          }
        })
      }
    })



  }
}

export {Token};