let app = getApp()
var auth = {
  getUserInfoVerson2: function(info) {
    var s = info.encryptedData;
    var m = info.iv;
    var cc = '';
    var url = api.wcxLogon();
    wx.request({
      method: 'POST',
      url: url,
      data: {
        code: app.loginCode,
        encrypted_data: info.encryptedData,
        iv: info.iv
      },
      success: function(res) {
        var status = false;
        if (res.data.code == 0) {
          if (!app.cache || app.cache != res.data.data) {
            let userData = res.data.data
            /* 
            if (userData) {
              userData.userToken = ''
            }
           */
            wx.setStorage({
              key: "cache",
              haveLogin: true,
              data: userData
            });
            status = true;
            console.log('登陆用户信息：' + JSON.stringify(userData))   
            app.processData(userData)
          }
          app.haveLogin = true
            //引导注册
          app.getSwitchSetting().then(data => {
            let switchCode = data
            if (switchCode && res.data.data.isRegisterComplete == -1){
              wx.reLaunch({
                url: '/pages/guide/circle/circle',
              })
              return;
            }
            let reUrl = app.reUrl  //
            let reType = app.reType
            let reTab = app.reTab
            if (reUrl) {
              app.reUrl = ''
              if (reType == 1 || !reType) {
                console.log("wx.redirectTo")
                wx.redirectTo({
                  url: reUrl
                })
              } else if (reType == 2) {
                console.log("wx.redirectTo")
                wx.redirectTo({
                  url: reUrl
                })
              } else if (reType == 3) {
                if (reTab) {
                  console.log("wx.switchTab")
                  wx.switchTab({
                    url: reUrl
                  })
                } else {
                  console.log("wx.reLaunch")
                  wx.reLaunch({
                    url: reUrl
                  })
                }
              } else if (reType == 4) {
                console.log("wx.switchTab")
                wx.switchTab({
                  url: reUrl
                })
              } else if (reType == 5) {
                wx.navigateTo({
                  url: reUrl
                })
              } else if (reType == 6) {
                wx.navigateBack({
                  url: reUrl
                })
              }
            } else {
              wx.switchTab({
                url: "/pages/bar/index/index"
              })
            }
          })   
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })
          return false;
        }
      },
      fail: function(res) {
        if (app.cache) {
          wx.removeStorage({
            key: 'cache'
          });
          app.cache = '';
        }
      }
    });
  },
  userLogin: function() {
    var that = this;
    let reUrl = app.reUrl
    let reType = app.reType
    let reTab = app.reTab
    reUrl = reUrl ? reUrl : ''
    wx.login({
      success: function(res) {
        wx.hideToast();
        app.needReLogin = false;
        if (res.code) {
          app.loginCode = res.code
        }
      },
      fail: function() {}
    })
  },
  getUserInfo: function(cb) {
    var that = this;
    let reUrl = app.reUrl
    let reType = app.reType
    let reTab = app.reTab
  },
  tapToAuthorize: function() {
    console.log(888)
    var that = this;
    let reUrl = app.reUrl
    let reType = app.reType
    let reTab = app.reTab
    wx.openSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"] === true) {
          that.userLogin()
        }
      }
    })
  },
  checkLogin: function() {
    var data = wx.getStorageSync('grade')
    if (data && data.userToken && data.id) {
      app.haveLogin = true;
      return true;
    } else {
      app.haveLogin = false;
      return false;
    }
  },
  goBack: function() {
    const that = this
    let reUrl = app.reUrl
    let reType = app.reType
    let reTab = app.reTab
    if (reUrl) {
      app.reUrl = ''
      if (reType == 1 || !reType) {
        console.log("wx.redirectTo")
        wx.redirectTo({
          url: reUrl
        })
      } else if (reType == 2) {
        console.log("wx.redirectTo")
        wx.redirectTo({
          url: reUrl
        })
      } else if (reType == 3) {
        if (reTab) {
          wx.switchTab({
            url: reUrl
          })
        } else {
          wx.reLaunch({
            url: reUrl
          })
        }
      } else if (reType == 4) {
        wx.switchTab({
          url: reUrl
        })
      } else if (reType == 5) {
        wx.navigateTo({
          url: reUrl
        })
      } else if (reType == 6) {
        wx.navigateBack({
          url: reUrl
        })
      }
    } else {
      wx.switchTab({
        url: "/pages/bar/index/index"
      })
    }
  }, 
  login: function(reUrl, reType, reTab, navType) {
    const that = this
    app.reUrl = reUrl
    app.reType = reType 
    app.reTab = reTab
    switch (navType) {
      case 1:
        wx.navigateTo({
          url: '/pages/auth/auth',
        })
        break
      case 2:
        wx.redirectTo({
          url: '/pages/auth/auth',
        })
        break
      default:
        wx.navigateTo({
          url: '/pages/auth/auth',
        })
    }
  }
}
export default auth;