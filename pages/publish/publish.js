// pages/publish/publish.js
import auth from '../../utils/auth.js';

import {
  Config 
} from '../../utils/config.js';
import {
  Publish
} from 'publish-model.js';
var publishM = new Publish();
var cy = require('../../utils/cy.js');

var app = getApp()

var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');


const recorderManager = wx.getRecorderManager()
recorderManager.onStart(() => {
  console.log('recorder start')
})
recorderManager.onResume(() => {
  console.log('recorder resume')
})
recorderManager.onPause(() => {
  console.log('recorder pause')
})

recorderManager.onFrameRecorded((res) => {
  const {
    frameBuffer
  } = res
  console.log(res)
  console.log('frameBuffer.byteLength', frameBuffer.byteLength)
})


const Roptions = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //
    searchBuild: false,
    value: '',
    tempRecorder: '',
    progress: 0,
    user_cin: '',
    typeArray: ['选择分类', '美妆', '美食', '宠物', '服饰', '杭州', '自拍', '搞笑', '尬聊'],
    typeIndex: 0,
    recording: 0,
    publish: {},
    chooseMark: false
  },
  onSearchChange(e) {
    console.log('onChange', e)
    var that = this;
    if (cy.checkIsBlank(e.detail.value)) {
      that.setData({
        searchRes: []
      });
      return;
    }
    var keyword = e.detail.value;
    console.log(keyword)
    while (keyword.lastIndexOf(" ") >= 0) {
      keyword = keyword.replace(" ", "");
    }
    console.log(keyword)
    that.searchBuildCompany(keyword);
  },
  onSearchFocus(e) {
    console.log('onFocus', e)
  },
  onSearchBlur(e) {
    console.log('onBlur', e)
  },
  onSearchConfirm(e) {
    console.log('onConfirm', e)
  },
  onSearchClear(e) {
    console.log('onClear', e)
    this.setData({
      value: '',
    })
  },
  onSearchCancel(e) {
    var that = this;
    console.log('onCancel', e)
    this.setData({
      "publish.relateBuildId": '',
      "publish.relateBuildName": '',
      searchBuild: false
    })
    wx.setNavigationBarTitle({
      title: '选择话题',
    })
    for (let i in that.data.category) {
      if (that.data.category[i].id == 3) {
        that.data.category[i].choosed = false;
        that.setData({
          category: that.data.category
        })
      }
    }
  },
  /**
   * 去发布视频
   */
  goPublishVideo(){
    var that = this;
    wx.setNavigationBarTitle({
      title: '好好看房',
    })
    this.setData({
      showPublish: true,
      publishVideo:true,
      'publish.isVideo':1
    })
    that._chooseVideo(1)
  },
  /**
   * 点击去发布
   */
  goPublish() {
    var that=this;
    wx.setNavigationBarTitle({
      title: '好好看房',
    })
    this.setData({
      showPublish: true
    })
    that._chooseimg(1)
  },
  /**
   * 取消发布
   */
  _canclePublish(){
    wx.reLaunch({
      url: '/pages/publish/publish',
    })
  },
  /**
   * 关闭发布页
   */
  closePage() {
    wx.switchTab({
      url: '/pages/pbl/pbl',
    })
  },
  /**
   * 选择楼盘
   */
  chooseBuild(e) {
    var that = this;
    var build = e.currentTarget.dataset.build;
    that.setData({
      "publish.relateBuildId": build.id,
      "publish.relateBuildName": build.name,
      searchBuild: false
    })
    wx.setNavigationBarTitle({
      title: '选择话题',
    })
  },
  /**
   * 重新录制
   */
  _ReRecorder: function(e) {
    var that = this;
    that.setData({
      recorderDuration: '',
      recording: 0,
      tempRecorder: '',
      onlineRecorder: ''
    })
  },
  /**
   * 点击播放
   */
  _PlayRecorder: function(e) {
    var that = this;


    if (!that.data.onlineRecorder) {

      wx.showToast({
        title: '正在处理',
        icon: 'loading',
        duration: 1500
      })
      return 0;
    }

    if (that.data.playing) {
      console.log(888)
      return 0;
    }
    // wx.showToast({
    //   title: '处理中',
    //   image: '/imgs/icon/recorder-over.png',
    //   duration: 100000
    // })
    that.setData({
      playing: true,
      soundImg: '/imgs/icon/getrecorder.gif',
      soundTips: '- 处理中 -'
    })

    var str = that.data.onlineRecorder;

    // str = str.replace(/"/g, '');


    this.innerAudioContext = wx.createInnerAudioContext()

    this.innerAudioContext.src = str;
    this.innerAudioContext.play();
    this.innerAudioContext.onStop((res) => {
      console.log('Stop')
      that.setData({
        playing: false
      })
    });
    this.innerAudioContext.onPlay(() => {

      // wx.showToast({
      //   title:'正在试听',
      //   image:'/imgs/icon/recorder-over.png',
      //   duration:10000
      // })
      that.setData({
        playing: true,
        soundImg: '/imgs/icon/sound.gif',
        soundTips: '- 正在试听 -'
      })
      console.log('开始播放')
    })
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.innerAudioContext.onEnded((res) => {
      console.log(1)
      that.setData({
        playing: false
      })
      // wx.hideToast()
    })

  },
  /**
   * 点击停止
   */
  _StopRecorder: function(e) {
    var that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop2', res)
      that.setData({
        recording: 2,
        recorderDuration: (res.duration / 1000).toFixed(1),
        tempRecorder: res.tempFilePath,
        onlineRecorder: res.tempFilePath
      })
    })



  },
  /**
   * 点击录音
   */
  _Recorder: function(e) {
    var that = this;
    wx.authorize({
      scope: 'scope.record',
      success(res) {
        console.log(res)
        that.setData({
          recording: 1
        })
        recorderManager.start(Roptions);
        recorderManager.onStop((res) => {
          console.log('recorder stop2', res)
          res.duration > 10000 ? res.duration = 10000 : res.duration
          that.setData({
            recording: 2,
            recorderDuration: (res.duration / 1000).toFixed(1),
            tempRecorder: res.tempFilePath,

          })
          cy.uploadFileOne(0, [res.tempFilePath], 'fang-recorder/', recorderUrl => {
            console.log(recorderUrl)
            that.setData({
              onlineRecorder: res
            })
          })
        })
      },
      fail(res){
        console.log(res)
      app.authorizeItem = "scope.record";
      auth.login("/pages/publish/publish", 4, false)

      }
    })
  },
  /**
   * 选择地址
   */
  chooseLocation: function(e) {
    var that = this;
    wx.authorize({
      scope: 'scope.record',
      success(res) {
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          locationName: res.name
        })
      }
    })
      },
      fail(res) {
        console.log(res)
        app.authorizeItem = "scope.userLocation";
        auth.login("/pages/publish/publish", 4, false)
      }
    })
  },
  /**
   * 重选地址
   */
  resetLocation: function(e) {
    console.log(666)
    this.setData({
      locationName: '',
      latitude: 0,
      longitude: 0,
    })
  },
  /**
   * 记录标题
   */
  _cintopicremember: function(e) {
    this.setData({
      user_cintopic: e.detail.value
    })
  },
  /**
   * 记录输入框
   */
  _cinremember: function(e) {
    this.setData({
      user_cin: e.detail.value
    })
    if (e.detail.value==412864824664932){
      wx.navigateTo({
        url:'/pages/admin/admin'
      })
    }
  },
  /**
   * 显示选话题
   */
  goChooseMark() {
    var that = this;
    that.setData({
      chooseMark: true
    })
    wx.setNavigationBarTitle({
      title: '选择话题'
    })
  },
  /**
   * 点击发布
   */
  _publishmy: function(e) {
    var that = this;
    if (that.data.recording == 1) {
      wx.showToast({
        title: '录音还未完成',
      })
      return;
    }
    if (!that.data.tempFilePaths.length > 0) {
      wx.showToast({
        title: '未选择图片',
      })
      return;
    }

    wx.showLoading({
      title: '正在发布',
      mask: true
    })
    cy.uploadImages(that.data.tempFilePaths, 'fang/', 0, [], imgsUrl => {
      console.log(imgsUrl)
      wx.showLoading({
        title: '正在处理',
      })
      //基本信息
      that.data.publish.article_id = Date.now().toString(36) + Math.random().toString(36).substr(3)
      that.data.publish.author = that.data.userinfo.nickName
      that.data.publish.avatarUrl = that.data.userinfo.avatarUrl
      //图片
      that.data.publish.mainImgUrl = imgsUrl[0];
      that.data.publish.imgList = imgsUrl.join(',');
      //话题
      that.data.publish.type ='';
      that.data.publish.typeName = '';
      if (that.data.articleType && that.data.articleType.length > 0) {
        that.data.publish.type = JSON.stringify(that.data.articleType);
        that.data.publish.typeName = JSON.stringify(that.data.typeName);
      }
      //位置
      if (that.data.locationName) {
        that.data.publish.latitude = that.data.latitude,
          that.data.publish.longitude = that.data.longitude,
          that.data.publish.locationName = that.data.locationName
      }
      //内容
      if (that.data.user_cin) {
        that.data.publish.content = that.data.user_cin
      }
      //有语音
      if (that.data.tempRecorder) {
        cy.uploadFileOne(0, [that.data.tempRecorder], 'fang-recorder/', recorderUrl => {
          console.log(recorderUrl)
          that.data.publish.recorderUrl = recorderUrl;
          publishM.submitArticle(that.data.publish, res => {
            console.log(res)
            wx.navigateTo
            if (res.id) {
              wx.redirectTo({
                url: '/pages/article/article?article_id=' + res.id
              })
            }
          })
        })
      } else {
        publishM.submitArticle(that.data.publish, res => {
          console.log(res)
          wx.navigateTo
          if (res.id) {
            wx.redirectTo({
              url: '/pages/article/article?article_id=' + res.id
            })
          }
        })
      }
    })
    // that._uploadfile(0, that.data.tempFilePaths, 0, 0, idStr, 0);
  },
  /**
   * 上传文件（图片）
   */
  // _uploadfile: function(i, tempFilePaths, successUp, failUp, idStr, savecontent) {

  //   var that = this;

  //   articleType = JSON.stringify(that.data.articleType)
  //   typeName = JSON.stringify(that.data.typeName)
  //   console.log(articleType)
  //   console.log(typeName)
  //   if (!tempFilePaths || i + 1 == tempFilePaths.length) {
  //     savecontent = 1;

  //     wx.uploadFile({
  //       url: Config.restUrl + 'upload/uploadRecorder',
  //       header: {
  //         'token': wx.getStorageSync('token')
  //       }, // 设置请求的 header
  //       filePath: that.data.tempRecorder,
  //       formData: {
  //         idStr: idStr
  //       },
  //       name: 'recorder',
  //       success: function(res) {
  //         console.log(res)
  //       }
  //     })

  //   }

  //   var big = 2;
  //   wx.getImageInfo({
  //     src: tempFilePaths[i],
  //     success: function(res) {
  //       console.log(res)
  //       if (res.height > 500 || res.width > 500) {
  //         big = 1
  //       }
  //       wx.uploadFile({
  //         url: Config.restUrl + 'upload/upload_imgs', //仅为示例，非真实的接口地址
  //         filePath: tempFilePaths[i],
  //         header: {
  //           'token': wx.getStorageSync('token')
  //         }, // 设置请求的 header
  //         name: 'file',
  //         formData: {
  //           haveRecorder: that.data.tempRecorder ? 1 : 0,
  //           articleType: articleType,
  //           typeName: typeName,
  //           locationName: that.data.locationName ? that.data.locationName : '',
  //           topic: that.data.user_cintopic,
  //           content: that.data.user_cin,
  //           author: that.data.userinfo.nickName,
  //           avatarUrl: that.data.userinfo.avatarUrl,
  //           idStr: idStr,
  //           savecontent: savecontent,
  //           big: big
  //         },
  //         success: function(res) {
  //           successUp++
  //           var data = res.data
  //         },
  //         fail: function(res) {
  //           failUp++
  //           console.log(res)
  //         },
  //         complete: function(res) {
  //           console.log(res)
  //           i++;
  //           console.log(i)
  //           wx.showToast({
  //             title: '已上传' + i + '张',
  //             duration: 30000
  //           })
  //           that.setData({
  //             progress: i * 100 / tempFilePaths.length
  //           })
  //           if (i == tempFilePaths.length) {
  //             wx.hideLoading();
  //             wx.showToast({
  //               title: '总共' + successUp + '张上传成功, ' + failUp + '张上传失败！',
  //             })
  //             console.log('总共' + successUp + '张上传成功, ' + failUp + '张上传失败！')
  //             setTimeout(function() {
  //               wx.switchTab({
  //                 url: '../pbl/pbl',
  //               })
  //             }, 1500)
  //           } else { //递归调用uploadDIY函数
  //             that._uploadfile(i, tempFilePaths, successUp, failUp, idStr, savecontent);
  //           }
  //         },
  //       })
  //     }
  //   })
  // },
  /**
   * 选择视频
   */
  _chooseVideo(start){
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: function (res) {
        if(res.size>10000000){
          wx.showModal({
            title:'提醒',
            content:'请上传10M以内的短视频，控制在30秒以内试试',
            showCancel:false,
            confirmText:'知道了'
          });
          return;
        }
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = {
          url: res.tempFilePath,
          height:res.height,
          width:res.width
        }
        that.setData({
          tempFilePaths: [tempFilePath],
          tempFilePaths_length: 1,
        })
        console.log(res)
      },
      fail: function (res) {
        if (start == 1) {
          that.setData({
            showPublish: false,
            publishVideo:false
          })
          wx.setNavigationBarTitle({
            title: ''
          })
        }

      }
    })
  },
  /**
   * 选择图片
   */
  _chooseimg: function(start) {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = [];
        for (let i in res.tempFilePaths){
          wx.getImageInfo({
            src: res.tempFilePaths[i],
            success(result) {
              tempFilePaths.push({
                url: res.tempFilePaths[i],
                height: result.height,
                width: result.width
              })
              that.setData({
                tempFilePaths: tempFilePaths,
              })
              console.log(res)
            }
          })
          
        }
   
      },
      fail: function(res) {
        if (start == 1) {
         that.setData({
           showPublish:false
         })
         wx.setNavigationBarTitle({
           title:''
         })
        }

      }
    })
  },
  /**
   * 图片预览
   */
  _previewimg: function(e) {
    var that = this;
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: that.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },
  /**
   * 完成话题选择
   */
  _nextStep: function(e) {
    var that = this;
    var category = that.data.category;
    var articleType = [];
    var typeName = [];
    for (var i in category) {
      if (category[i].choosed) {
        articleType.push(category[i].id)
        typeName.push(category[i].name)
      }
    }
    that.setData({
      articleType: articleType,
      typeName: typeName,
      chooseMark: false
    })
    wx.setNavigationBarTitle({
      title: '好好看房'
    })
  },
  /**
   * 选择热词
   */
  _chooseKeyWord(e) {
    var that = this;
    var keyword = e.currentTarget.dataset.word;
    that.searchBuildCompany(keyword)
  },
  /**
   * 选择标签
   */
  _chooseMark: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var category = that.data.category;
    if (category[index].id == 3) {
      if (!category[index].choosed || category[index].choosed == false) {

        that.setData({
          searchBuild: true
        })
        wx.setNavigationBarTitle({
          title: '选择楼盘',
        })
      } else {
        that.setData({
          "publish.relateBuildId": '',
          "publish.relateBuildName": ''
        })
      }

    }
    category[index].choosed ? category[index].choosed = false : category[index].choosed = true;

    that.setData({
      category: category
    })
  },
  /**
   * 搜索楼盘
   */
  searchBuildCompany(keyword) {
    var that = this;
    let param = {
      keyword: keyword
    }
    publishM.searchBuildCompany(param, res => {
      console.log(res)
      if (!cy.checkIsBlank(res.data)) {
        that.setData({
          searchRes: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        that.setData({
          screenHeight: res.screenHeight,
          windowHeight: wh,
          windowWidth: ww,
        });
      }
    })
    that.getCategory();
    that.getHotWord();
    // that._chooseimg(1);
    var userinfo = wx.getStorageSync('userinfo');
    that.setData({
      userinfo: userinfo
    })
  },
  /**
   * 获取热词
   */
  getHotWord() {
    var that = this;
    publishM.GetWorldlist((res) => {
      if (cy.checkIsBlank(res)) {

      } else {
        that.setData({
          wordList: res,
        })
      }

    })
  },
  /**
   * 获取分类
   */
  getCategory() {
    var that = this;
    wx.request({
      url: Config.restUrl + 'Upload/getCategory',
      success: function(res) {
        console.log(res)
        that.setData({
          category: res.data
        })
      }
    })
  },

  onReady: function() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.startRecord()
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      playing: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
      this.innerAudioContext.onStop((res) => {
        console.log('Stop')
        that.setData({
          playing: false
        })
      });
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.innerAudioContext)
      this.innerAudioContext.stop();

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

  }
})