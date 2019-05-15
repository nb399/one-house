import httpUtil from '../../utils/http.js';
import api from '../../utils/api.js';
import util from '../../utils/util.js';
import tips from '../../utils/tips-utils.js';
import auth from '../../utils/auth.js';
const app = getApp();
const res = wx.getSystemInfoSync()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: res.windowWidth,
    windowHeight: 0,

    postHeight: 0,
    activityId: 0,
    activityData: [],

    scale: 0,
    titleFontSize: 20,
    loadDone: false,
    created: false,
    filePath: '',
    updateFlag: 0,

    postBjHeight: 748,
    postBjWidth: 497
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    const that = this
    let id = options.id;
    let updateFlag = options.updateFlag;
    that.setData({
      activityId: id
    })
    var scale = 1
    var titleFontSize = 20

    if (updateFlag) {
      that.setData({
        updateFlag: updateFlag
      })
    }
    that.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  draw: function() {
    const that = this
    let mainLeft = 60
    let firstTop = 80
    const postBjWidth = that.data.postBjWidth
    const postBjHeight = that.data.postBjHeight
    const ownNameFontSize = 15 //组织者姓名
    const ownDescFontSize = 14 //组织者姓名下描述
    const titleFontSize = 20 //活动标题名称
    const timeFontSize = 14
    const addrFontSize = 14
    let avaDiameter = 50 //头像直径
    const timeIconDiameter = 20 //小图标
    const addrIconDiameter = 20 //小图标
    //let timeIconPath = '/images/time-3.png'
    //let addrIconPath = '/images/location-5.png'

    //海报信息 
    const postWidth = 200
    const postHeight = 280

    var activityData = that.data.activityData

    const ctx = wx.createCanvasContext('myCanvas')
    //加载底图
    ctx.drawImage('/images/poster_temp.jpg', 0, 0, postBjWidth, postBjHeight)
    // 头像 start
    let avaTop = firstTop
    let avaLeft = mainLeft + 50
    ctx.save();
    ctx.arc(avaDiameter / 2 + avaLeft, avaDiameter / 2 + avaTop, avaDiameter / 2, 0, Math.PI * 2, false);
    ctx.clip()
    ctx.drawImage(app.currentActOwnAvaPath, 0 + avaLeft, 0 + avaTop, avaDiameter, avaDiameter);
    ctx.restore()

    // 组织者名称
    let ownName = activityData.userBase.nickname
    let avaToNameWidth = 10 //头像和名称的间距
    let ownNameTop = firstTop + 18
    let ownNameLeft = avaLeft + avaDiameter + avaToNameWidth
    ctx.setFontSize(ownNameFontSize)
    ctx.setFillStyle('#eb5441')
    ctx.setTextAlign('left')
    ctx.fillText(ownName, ownNameLeft, ownNameTop)

    // 组织者名称下面文字描述
    let ownDesc = '发起一个活动，快来参加吧！'
    let ownDescTop = ownNameTop + 25
    let ownDescLeft = ownNameLeft
    ctx.setFontSize(ownDescFontSize)
    ctx.setFillStyle('#000000')
    ctx.setTextAlign('left')
    ctx.fillText(ownDesc, ownDescLeft, ownDescTop)

    //海报 
    let postTop = firstTop + avaDiameter + 10
    let postLeft = (postBjWidth - postWidth) / 2
    ctx.drawImage(app.currentActPosterPath, postLeft, postTop, postWidth, postHeight)

    //活动名称
    var subject = util.subStr(activityData.subject, 20)
    const titleTop = postTop + postHeight + 25
    ctx.setFontSize(titleFontSize)
    ctx.setFillStyle('#eb5441')
    ctx.setTextAlign('center')
    ctx.fillText(subject, postBjWidth / 2, titleTop)

    //时间 文字
    let time = activityData.actStartWeek + ' • ' + activityData.actStartEnd
    let iconToTimeWidth = 10
    let timeTop = titleTop + 30
    ctx.setFontSize(timeFontSize)
    ctx.setFillStyle('#000000')
    ctx.setTextAlign('center')
    ctx.fillText(time, postBjWidth / 2, timeTop)


    //位置 文字
    let addressWord = activityData.areaName + ' ' + activityData.areaRemark
    let iconToAddrWidth = 10
    //let addrTop = addrIconTop + 15
    let addrTop = timeTop + 30

    let addrLeft = mainLeft + addrIconDiameter + iconToAddrWidth
    ctx.setFontSize(addrFontSize)
    ctx.setFillStyle('#000000')
    ctx.setTextAlign('center')
    ctx.fillText(addressWord, postBjWidth / 2, addrTop)


    //二维码
    const qrCodeWidth = 130
    const qrCodeHeight = 130
    let qrCodeLeft = (postBjWidth - qrCodeWidth) / 2
    const qrCodeTop = addrTop + 15

    ctx.drawImage(app.currentActQrCodePath, qrCodeLeft, qrCodeTop, qrCodeWidth, qrCodeHeight)

    //二维码文字
    const descTop = qrCodeTop + qrCodeHeight + 20
    ctx.setFontSize(12)
    ctx.setFillStyle('#696969')
    ctx.setTextAlign('center')
    ctx.fillText('长按识别图中小程序码了解更多', postBjWidth / 2, descTop)

    ctx.draw(true, this.canvasToTempFilePath)


  },
  /**
   * 绘图
   */
  canvasToTempFilePath: function() {
    const that = this
    wx.hideLoading()
    //更新
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.postBjWidth,
      height: that.data.postBjHeight,
      canvasId: 'myCanvas',
      success: function(res) {
        that.setData({
          loadDone: true
        })
        //更新到服务器
        that.setData({
          created: true,
          filePath: res.tempFilePath
        })
        //上传
        var userid = app._user.userid;
        var urlOss = api.fileUpdloadOSS(userid, 1)
        const uploadTask = wx.uploadFile({
          url: urlOss,
          filePath: res.tempFilePath,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            'user': 'test'
          },
          success: function(res) {
            if (res.statusCode == 200) {
              var retData = JSON.parse(res.data);
              if (retData.code == 0) {
                var imgPath = retData.data;
                //更新
                let param = {
                  API_URL: api.activityUpdateSimple(),
                  data: {
                    id: that.data.activityId,
                    actPoster: imgPath
                  },
                };
                httpUtil.postAPI(param).then(data => {
                  if (data.statusCode != 200) {
                    return;
                  }

                }).catch(e => {});
              } else {
                that.setData({
                  upload_fail: true,
                  upload_fail_msg: retData.message
                });
                tips.warning(retData.message)
              }
            } else {
              that.setData({
                upload_fail: true
              });
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false,
                success: function(res) {}
              });
            }
          },
          fail: function(res) {
            that.setData({
              upload_fail: true
            });
            wx.showModal({
              title: '提示',
              content: "网络请求失败，请确保网络是否正常",
              showCancel: false,
              success: function(res) {}
            });
            wx.hideToast();
          }
        })
      }
    })
  },

  getData: function() {
    wx.showLoading({
      title: '正在加载',
    })
    var that = this;
    var activityId = that.data.activityId;
    let param = {
      API_URL: api.actDetail(),
      data: {
        id: activityId
      },
    };
    httpUtil.getAPI(param).then(data => {
      if (data.statusCode != 200) {
        return;
      }
      let activityData = data.data.data;
      activityData.poster = typeof (activityData.poster) == 'string' ? activityData.poster.split(',')[0] : activityData.poster[0]
      that.setData({
        activityData: activityData
      })
      if (that.data.updateFlag != 1 && activityData.actPoster) {
        that.setData({
          filePath: activityData.actPoster,
          loadDone: true
        })
        wx.hideLoading()
        return
      }
      wx.showLoading({
        title: '正在生成海报',
      })
      //下载活动简单海报图片

      wx.downloadFile({
        url: that.data.activityData.poster + '?x-oss-process=style/w420',
        success: function(res) {
          app.currentActPosterPath = res.tempFilePath
          if (!that.data.activityData.actQrCode) {
            wx.showToast({
              title: '分享二维码不存在',
            })
            return
          }
          //二维码
          wx.downloadFile({
            url: that.data.activityData.actQrCode,
            success: function(res) {
              app.currentActQrCodePath = res.tempFilePath;
              //暂时用海报当头像
              if (true) {
                let avaUrl = that.data.activityData.userBase.avatarUrl //+ '?x-oss-process=style/w420'
                if (avaUrl) {
                  wx.downloadFile({
                    url: avaUrl,
                    success: function(res) {
                      app.currentActOwnAvaPath = res.tempFilePath;
                      that.draw()
                    },
                    fail: function() {
                      app.currentActOwnAvaPath = "/images/default-header.png"
                      that.draw()
                    }
                  })
                } else {
                  app.currentActOwnAvaPath = "/images/default-header.png"
                  that.draw()
                }
              } else {
                app.currentActOwnAvaPath = "/images/default-header.png"
                that.draw()
              }
            },
            fail: function() {
              wx.hideLoading()
              wx.showToast({
                title: '海报下载失败',
              })
            }
          })
        },
        fail: function() {
          wx.hideLoading()
          wx.showToast({
            title: '海报生成失败',
          })
        }
      })
    }).catch(e => {});
  },

  /**
   * 保存海报
   */
  savePoster: function() {

    wx.showLoading({
      title: '正在保存中',
    })
    const that = this
    if (that.data.updateFlag != 1 && that.data.activityData.actPoster) {
      //先下载 在保存
      wx.downloadFile({
        url: that.data.filePath,
        success: function(res) {
          that.saveImageToPhotosAlbum(res.tempFilePath)
        },
        fail: function() {
          wx.hideLoading()
          wx.showToast({
            title: '海报保存失败',
          })
        }
      })
    } else {
      that.saveImageToPhotosAlbum(that.data.filePath)
    }
  },
  saveImageToPhotosAlbum: function(filePath) {
    let that=this;
    //生成到本地
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '已保存到相册',
        })
      },
      fail: function(res) {
        wx.hideLoading()
        wx.getSetting({
          success(res) {
            var lef = '11'
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.showModal({
                title: '保存到相册授权',
                content: '如需正常使用小程序功能，请按【保存到相册】按钮，勾选并返回即可',
                confirmText: "前往授权",
                confirmColor: '#eb5441',
                cancelText: "取消",
                success: function (res) {
                  console.log(res)
                  /* 新版授权方式*/
                  if (res.confirm) {
                    app.authorizeItem = "scope.writePhotosAlbum"
                    auth.login("/pages/act-detail/share?id=" + that.data.activityId, 6, false)
                  }
                  else {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                }
              })               
            }
          },
          fail: function () {

          }
        })
        // wx.getSetting({ 
        //   success(res) {
        //     if (!res.authSetting['scope.writePhotosAlbum']) {
        //       wx.openSetting({
        //         success: (res) => {
        //           if (res.authSetting["scope.writePhotosAlbum"] === true) {}
        //         }
        //       })
        //     }
        //   },
        //   fail: function() {}
        // })
      }
    })
  },
  share: function(e) {

  },
  onShareAppMessage: function(res) {
    const that = this
    var userName = app._user.user_displayname
    let title = userName + '邀请你一起参加"' + that.data.activityData.subject + '"'
    console.log({
      title: title,
      path: '/pages/act-detail/act-detail?id=' + that.data.activityId,
      imageUrl: that.data.activityData.poster + '?x-oss-process=style/w280',
      success: function (res) {console.log(res) },
      fail: function (res) { console.log(res)}
    })
    return {
      title: title,
      path: '/pages/act-detail/act-detail?id=' + that.data.activityId,
      imageUrl: that.data.activityData.poster + '?x-oss-process=style/w280',
      success: function (res) { console.log(res) },
      fail: function (res) { console.log(res) }
    }
  },
  goActDetail: function() {
    wx.navigateTo({
      url: '/pages/act-detail/act-detail?id=' + this.data.activityId,
    })
  }
})