// pages/publish/publish.js
import { Config } from '../../utils/config.js';


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
  const { frameBuffer } = res
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
    tempRecorder:'',
    progress: 0,
    user_cin: '',
    typeArray: ['选择分类', '美妆', '美食', '宠物', '服饰', '杭州', '自拍', '搞笑', '尬聊'],
    typeIndex:0,
    recording:0,
    chooseMark:true
  },
  /**
   * 重新录制
   */
  _ReRecorder:function(e){
    var that = this;
    that.setData({
      recorderDuration:'',
      recording: 0,
      tempRecorder:'',
      onlineRecorder:''
    })
  },
  /**
   * 点击播放
   */
  _PlayRecorder:function(e){
    var that=this;
    

    if (!that.data.onlineRecorder){

      wx.showToast({
        title: '正在处理',
        icon:'loading',
        duration:1500
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
    var str = that.data.onlineRecorder.data;

    str = str.replace(/"/g, '');
   
    
    this.innerAudioContext = wx.createInnerAudioContext()
   
    this.innerAudioContext.src = Config.Url+'public/recorder/' + str;
    this.innerAudioContext.play();
    this.innerAudioContext.onStop((res)=>{
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
    this.innerAudioContext.onEnded((res)=>{
      console.log(1)
      that.setData({
        playing:false
      })
      // wx.hideToast()
    })

  },
  /**
   * 点击停止
   */
  _StopRecorder:function(e){
    var that=this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop2', res)
      that.setData({
        recording: 2,
        recorderDuration: (res.duration / 1000).toFixed(1),
        tempRecorder: res.tempFilePath,
        
      })
      wx.uploadFile({
        url: Config.restUrl+'upload/uploadRecorder',
        filePath: res.tempFilePath,
        formData: { idStr: 0 },
        header: {
          'token': wx.getStorageSync('token')
        }, // 设置请求的 header
        name: 'recorder',
        success: function (res) {         
          console.log(res)
          that.setData({
          onlineRecorder: res
          })
        }
      })
    })
   
 
    
  },
  /**
   * 点击录音
   */
  _Recorder:function(e){
    var that=this;
    that.setData({
      recording:1
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
      wx.uploadFile({
        url: Config.restUrl+'upload/uploadRecorder',
        filePath: res.tempFilePath,
        formData: { idStr: 0 },
        header: {
          'token': wx.getStorageSync('token')
        }, // 设置请求的 header
        name: 'recorder',
        success: function (res) {
          console.log(res)
          that.setData({        
            onlineRecorder: res
          })
        }
      })
    })
  },
/**
 * 选择地址
 */
chooseLocation:function(e){
  var that=this;
  wx.chooseLocation({
    success:function(res){
      console.log(res)
      that.setData({
        locationName:res.name
      })
    }
  })
},
/**
 * 重选地址
 */
 resetLocation:function(e){
    console.log(666)
    this.setData({
      locationName:''
    })
  },
  /**
   * 记录标题
   */
  _cintopicremember:function(e){
    this.setData({
      user_cintopic: e.detail.value
    })
  },

  
  /**
   * 记录输入框
   */
  _cinremember: function (e) {


    this.setData({
      user_cin: e.detail.value
    })
  },
  /**
   * 点击发布
   */
  _publishmy: function (e) {
    var that = this;
    if (that.data.recording==1){
      wx.showToast({
        title: '录音还未完成',
      })
      return;
    }
    if (!that.data.user_cintopic) {
      wx.showToast({
        title: '请输入标题',
      })
      return;
    }
    let idStr = Date.now().toString(36)
    idStr += Math.random().toString(36).substr(3)
    console.log(idStr)
    wx.showLoading({
      title: '正在发布',
      mask: true
    })

    that._uploadfile(0, that.data.tempFilePaths, 0, 0, idStr, 0);
  },
  /**
   * 上传文件（图片）
   */
  _uploadfile: function (i, tempFilePaths, successUp, failUp, idStr, savecontent) {
   
    var that = this;
    var articleType=[];
    var typeName=[];
    for (var k in that.data.category){
      if (that.data.category[k].choosed)
      {
        articleType.push(that.data.category[k].id)
        typeName.push(that.data.category[k].name)
      }
     
    }
    articleType = JSON.stringify(articleType)
    typeName = JSON.stringify(typeName)
    console.log(articleType)
    console.log(typeName)
    if (!tempFilePaths || i + 1 == tempFilePaths.length)
    { savecontent = 1 ;
     
      wx.uploadFile({
        url: Config.restUrl+'upload/uploadRecorder',
        header: {
          'token': wx.getStorageSync('token')
        }, // 设置请求的 header
        filePath: that.data.tempRecorder,
        formData: { idStr:idStr},
        name: 'recorder',
        success: function (res) {         
          console.log(res)
        }
      })
  
    }
   
var big=2;
wx.getImageInfo({
  src: tempFilePaths[i],
  success:function(res){
    console.log(res)
    if(res.height>500||res.width>500)
    {
      big=1
    }
    wx.uploadFile({
      url: Config.restUrl+'upload/upload_imgs', //仅为示例，非真实的接口地址
      filePath: tempFilePaths[i],
      header: {
        'token': wx.getStorageSync('token')
      }, // 设置请求的 header
      name: 'file',
      formData: {
        haveRecorder: that.data.tempRecorder?1:0,
        articleType: articleType,
        typeName: typeName,
        locationName: that.data.locationName ? that.data.locationName:'',
        topic: that.data.user_cintopic,
        content: that.data.user_cin,
        author: that.data.userinfo.nickName,
        avatarUrl: that.data.userinfo.avatarUrl,       
        idStr: idStr,
        savecontent: savecontent,
        big: big
      },
      success: function (res) {
        successUp++
        var data = res.data


      },
      fail: function (res) {
        failUp++
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
        i++;
        console.log(i)
        wx.showToast({
          title: '已上传' + i + '张',
          duration:30000
        })
        that.setData({
          progress: i * 100 / tempFilePaths.length
        })
        if (i == tempFilePaths.length) {
          wx.hideLoading();
          wx.showToast({
            title: '总共' + successUp + '张上传成功, ' + failUp + '张上传失败！',
          })
          console.log('总共' + successUp + '张上传成功, ' + failUp + '张上传失败！')
          setTimeout(function () {
            wx.switchTab({
              url: '../pbl/pbl',
            })
          }, 1500)

        }
        else {  //递归调用uploadDIY函数
          that._uploadfile(i, tempFilePaths, successUp, failUp, idStr, savecontent);

        }


      },


    })
  }
})


  },
  /**
   * 选择图片
   */
  _chooseimg: function (start) {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var length = tempFilePaths.length; //总共个数
        var i = 0; //第几个
        that.setData({
          tempFilePaths: tempFilePaths,
          tempFilePaths_length: length,
          tempFilePaths_i: i
        })
        console.log(res)
      },
      fail:function(res){
        if (start==1){
          wx.navigateBack({

          })
        }
     
      }
    })
  },
  /**
   * 图片预览
   */
  _previewimg: function (e) {
    var that = this;
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: that.data.tempFilePaths // 需要预览的图片http链接列表
    })
  },
  /**
   * 下一步
   */
  _nextStep:function(e){
    var that=this;
    var category=that.data.category;
    for (var i in category){
      if (category[i].choosed)
      {
        that.setData({
          chooseMark: false
        })
        that._chooseimg(1);
        break;
      }
    }
    if(that.data.chooseMark){
      wx.showToast({
        title:'请选择标签'
      })
    }
 
  },
/**
 * 选择标签
 */
  _chooseMark:function(e){
    var that=this;
    var index=e.currentTarget.dataset.index;
    var category=that.data.category;
    console.log(category[index])
    category[index].choosed ? category[index].choosed=false : category[index].choosed=true;
    that.setData({
      category: category
    })
    console.log(that.data.category[index])
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

      wx.request({
        url: Config.restUrl+'Upload/getCategory',
        success:function(res){
          console.log(res)
          that.setData({
            category:res.data
          })
        }

    })

    var userinfo = wx.getStorageSync('userinfo');
    that.setData({

      userinfo: userinfo
    })
  },

 
  onReady: function () {    
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
  onShow: function () {
    this.setData({
      playing: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.innerAudioContext.stop();
    this.innerAudioContext.onStop((res) => {
      console.log('Stop')
      that.setData({
        playing: false
      })
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.innerAudioContext.stop();
    
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