import auth from '../../utils/auth.js';
import { Token } from '../../utils/token.js';
const app = getApp();
Page({
  data: {
    redirect_url: '',
    reType: '',
    reTab: '',
    unLoginHide: true,
    haveLogin: false,
    userInfo: {},
    changeTabByClick: false,
    curUserId: 0
  },

  onLoad: function (options) {
    let that = this;
    let redirect_url = decodeURIComponent(app.reUrl);
    let reType = app.reType;
    let reTab = app.reTab;
    that.setData({
      redirect_url: redirect_url,
      reType: reType,
      reTab: reTab
    })
    let authorizeItem = app.authorizeItem ? app.authorizeItem : ''
    that.setData({
      authorizeItem: authorizeItem
    })
    let authorizeBtn = ""
    let authorizeBarTitle = ""
    let authorizeTitle = ""
    let authorizeDesc = ""
    let authorizeopenType = ""
    switch (authorizeItem) {
      case "scope.userLocation":
        {
          authorizeDesc = "使用你的地理位置功能"
          authorizeopenType = "openSetting"
          authorizeBtn = "前往授权"
          authorizeBarTitle = "微信授权"
          authorizeTitle = "前往授权设置，打开［地理位置］，才能正常使用小程序地理位置功能"
        }
        break;
      case "scope.record":
        {
          authorizeDesc = "使用你的录音功能"
          authorizeopenType = "openSetting"
          authorizeBtn = "前往授权"
          authorizeBarTitle = "微信授权"
          authorizeTitle = "前往授权设置，打开［录音］，才能正常使用小程序l录音功能"
        }
        break;
      case "scope.writePhotosAlbum":
        {
          authorizeDesc = "使用你的保存到相册功能"
          authorizeopenType = "openSetting"
          authorizeBtn = "前往授权"
          authorizeBarTitle = "微信授权"
          authorizeTitle = "前往授权设置，打开［保存到相册］，才能正常使用小程序保存到相册功能"
        }
        break;
      default:
        {
          authorizeDesc = "使用你的账号登录该小程序"
          authorizeopenType = "getUserInfo"
          authorizeBtn = "确认登陆"
          authorizeBarTitle = "微信安全登陆"
          authorizeTitle = "即将登录好好看房社区，哪儿也不去，在家看房！"
        }
        break
    }
    that.setData({
      authorizeBtn: authorizeBtn,
      authorizeTitle: authorizeTitle,
      authorizeDesc: authorizeDesc,
      authorizeopenType: authorizeopenType
    })
    wx.setNavigationBarTitle({
      title: authorizeBarTitle,
    })
    /**
    * 获取系统信息
    */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

  },

  onReady: function () {
  },

  onShow: function () {
    var _this = this;
    if (!auth.checkLogin()) {
      this.setData({
        unLoginHide: false
      });

    } else {
      this.setData({
        haveLogin: true
      });
    }
  },

  login: function (e) {
    var that = this;
    if (!auth.checkLogin()) {
      auth.tapToAuthorize(that.data.redirect_url, that.data.reType, that.data.reTab);
    } else {
      auth.login("/pages/main/main", that.data.reType, that.data.reTab);
    }

  },

  bindGetUserInfo: function (info) {
    if (info && info.detail && info.detail.userInfo) {
      wx.showLoading({
        title: '登录中',
      })
      auth.getUserInfoVerson2(info.detail)
    } else {
      wx.showModal({
        title: '用户未授权',
        content: '如需正常使用小程序功能，请按【申请授权】按钮，勾选用户信息并点击确定。',
        confirmText: '申请授权',
        confirmColor: '#eb5441',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/auth/auth',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/bar/index/index',
            })
          }
        }
      });
    }
  },

  /**
  * 授权回调
  */
  openSettingCallback: function () {
    app.authorizeItem = ''
    auth.goBack();
  }

})
