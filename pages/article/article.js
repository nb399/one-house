// pages/article/article.js
import { Config } from '../../utils/config.js';
import { Article } from '../myarticle/myarticle-model.js';
var article = new Article;
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ReplyTo:'发表评论',
    pname:'',
    pid:0,
    topImage:[],

    //图片  
hdimg: [],
  //是否采用衔接滑动  
  circular: true,
  //是否显示画板指示点  
  indicatorDots: true,
  //选中点的颜色  
  indicatorcolor: "#000",
  //是否竖直  
  vertical: false,
  //是否自动切换  
  autoplay: false,
  //滑动动画时长毫秒  
  duration: 100,
  //所有图片的高度  
  imgheights: [],
  //图片宽度  
  imgwidth: 750,
  //默认  
  current: 0,

 
  },

  //example.js
  submit: function (e) {
    console.log(e.detail.formId);
    var that=this;
    that.setData({
      formId: e.detail.formId
    })
  },
  gohome:function(e){
    wx.switchTab({
      url: '/pages/pbl/pbl',
    })
  },
  /**
   * 跳转个人主页
   */
  _personPage: function (e) {

    var that = this;
    var personid = e.currentTarget.dataset.personid;
    wx.navigateTo({
      url: '../attention-people/attention-people?personid=' + personid,
    })

  },
  imageLoad: function (e) {
    
    var that=this;
  
    //获取图片真实宽度  
    var  imageId = e.currentTarget.id;
    var imgIndex=e.currentTarget.dataset.index;
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;

    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var mode ="aspectFit"
    if (imgheight > 760 || imgheight<200){     
      mode = "aspectFill";
      imgheight=700    
    }



    // var imgMode={};
    // imgMode.mode=mode;
    // imgMode.imgheights = imgheight;
    
    // var imgheights = this.data.imgheights

    //++++++++++
 
    let images = this.data.images;
  
    if (imgIndex == images.length-1)
      wx.hideLoading()


    let imageObj = null;

  
    for (let i = 0; i < images.length; i++) {
      let img = images[i];
   
      if (img.id == imageId) {
       
        imageObj = img;
       
        break;
      }
    }


    
    imageObj.mode = mode
    imageObj.imgheights = imgheight
    
    let topImage = this.data.topImage;
    topImage.push(imageObj)
    that.setData({
      topImage: topImage
    })

    console.log(imageId+'图片加载' + Date())

  },
  bindchange: function (e) {

    this.setData({ current: e.detail.current })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.verify().then(res => {
      if (!res) {
        return 0;
      }
      console.log(res)
      wx.getSystemInfo({
        success: (res) => {
          that.setData({
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth,
            screenHeight: res.screenHeight
          });
        }
      })

      var userinfo = wx.getStorageSync('userinfo');

      var article_id = options.article_id

      if (options.video) {
        this._getVideo(article_id)
        that.setData({
          articleType: 'video'
        })
      }
      else
      { this._getArticle(article_id); }



      this._getcommentlist(article_id);

      that.setData({
        article_id: article_id,
        userinfo: userinfo
      })

    })
 
  },
  _getrelationlist(articleType){
    var that=this;
    article.relationlist(articleType, (res) => {
console.log(res)
    })
  },
  /**
   * 获取视频
   */
  _getVideo:function(article_id){
  
      var that = this;
      var uid = wx.getStorageSync('uid');
      article.getVideo(article_id,(res)=>{
        for (var i in res.praisepeople) {

          if (res.praisepeople[i].uid == uid) {
            res.ispraised = true;
            break;
          }
          else
            res.ispraised = false;

        }
        that.setData({
          article: res
        })
      })
    },
  /**
   * 点赞
   */
  _Praise: function (e) {

    var that = this;


    var article_id = e.currentTarget.dataset.id;
    var article = that.data.article
    wx.showLoading({
      title: '点点赞',
      mask: true
    })

    wx.request({
      url: Config.restUrl+'article/praise?article_id=' + article_id,
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {

        res.data ? article.praise_num++ : article.praise_num--;
          article.ispraised = res.data
        


        that.setData({
      
          article: article
        })
        wx.hideLoading();
      }
    })
  },


/**
 * 获取article
 */
  _getArticle: function (article_id){
var that=this;
var images=[];
var uid=wx.getStorageSync('uid');
wx.showLoading({
  title: '正在加载',
})
    article.getArticle(article_id,(res)=>{
 
      for (var i in res.items) {
        images.push({ id: res.items[i].id, imgUrl: res.items[i].img_url, artimgUrl: res.items[i].artwork_url })
  }

      for (var i in res.praisepeople) {

        if (res.praisepeople[i].uid == uid) {
          res.ispraised = true;
          break;
    }
    else
          res.ispraised = false;

  }
  that.setData({
    images: images,
    article: res,
    topic: res.topic
  })
  that._getrelationlist(res.type[0].category_id)
  console.log('数据请求结束：' + Date())
})

  },
  /**
  * 播放语音
  */
  _PlayRecorder: function (e) {
    var that = this;
    console.log('点击播放')

    if (that.data.playing) {
      if (this.innerAudioContext.src == e.currentTarget.dataset.url) {
        console.log('正在播放，返回')
        return 0;
      }
      else {
        this.innerAudioContext.stop()
      }
    }


    that.setData({
      playing: true,
      soundImg: '/imgs/icon/getrecorder.gif',
      soundTips: '- 获取中 -'
    })
    this.innerAudioContext = wx.createInnerAudioContext()

    this.innerAudioContext.src = e.currentTarget.dataset.url;
    this.innerAudioContext.play();
    this.innerAudioContext.onPlay(() => {

      that.setData({
        soundImg: '/imgs/icon/sound.gif',
        soundTips: '- 播放中 -'
      })
      console.log('Play')
    })
    this.innerAudioContext.onCanplay((res) => { console.log('Canplay') })
    this.innerAudioContext.onStop((res) => { console.log('Stop') 
      console.log('End')
      that.setData({
        playing: false
      })
      wx.hideToast()})
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      switch (res.errCode) {
        case 10004: wx.showToast({
          title: '音频损失',
          icon: 'none'
        }); break;
        case 10002: wx.showToast({
          title: '网络错误'
        }); break;
        default: wx.showToast({
          title: '网络出错'
        });
      }
    })
    this.innerAudioContext.onEnded((res) => {
      console.log('End')
      that.setData({
        playing: false
      })
      wx.hideToast()
    })

  },
  /**
   * 预览图片
   */
  _previewimg:function(e){
    var that = this;
    var imgs = [];

    for (var i in e.currentTarget.dataset.imgs) {
      imgs.push(e.currentTarget.dataset.imgs[i].artimgUrl)
    }
    console.log(imgs)
    wx.previewImage({
      current: imgs[0], // 当前显示图片的http链接
      urls: imgs, // 需要预览的图片http链接列表
      complete: function (res) {
        console.log(res)
      }
    })

  },
  /**
   * 获取article_id的评论表
   */
  _getcommentlist(article_id){
    var that=this;
    article.getCommentlist(article_id, (res) => {
      var floornum = 1;
      for (var i = 0; i < res.length; i++) {
        res[i].pid == 0 ? res[i].floor = floornum && floornum++ : ''
      }
      that.setData({
        commentlist: res,
      })

    })

  },
  /**
   * 点击回复
   */
  _reply:function(e){
   console.log(e)
    var that=this;
    that.setData({
      ReplyTo:'回复:'+e.currentTarget.dataset.author,
      puid: e.currentTarget.dataset.puid,
      pname: e.currentTarget.dataset.author,
      pid: e.currentTarget.dataset.pid,
      pformId: e.currentTarget.dataset.pformid,
      article_id: e.currentTarget.dataset.article_id
    })
  },
  /**
   * 记录输入框
   */
  _cinremember:function(e){
   
    this.setData({
      user_cin:e.detail.value
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (e) {
var that=this;
    var imageUrl = e.target.dataset.item
    return {
      title: e.target.dataset.item.content.substr(0, 16) + '...',
      path: '/pages/article/article?' + (that.data.articleType?'video=1&':'')+'article_id=' + e.target.dataset.id,
      // imageUrl: imageUrl.items ? imageUrl.items[0].img_url : imageUrl.img_url,
      success: function (res) {
       
        wx.showToast({
          image: '/imgs/icon/pay@success.png',
          title: '转发成功',
        })
        var param = { type: that.data.articleType?'video':'article', id: e.target.dataset.id }
        article.forward(param, (res) => {
      
        })

      },
      fail: function (res) {
      
        wx.showToast({
          image: '/imgs/icon/pay@error.png',
          title: '转发失败',
        })
      }
    }
  },
  /**
   * 转发
   */
  _Forward: function (e) {
console.log(e)
  },
/**
 * 回复楼主
 */
  _replyAuthor:function(){
    var that=this;
    that.setData({
      pid:0,
      ReplyTo: '发表评论',
    })
  },
  /**
   * 点击发送
   */
  _sendcomment:function(e){
    var that=this;
    if (!that.data.user_cin)
         return;
    
   wx.request({
     url: Config.restUrl+'/addcomment',
     data: {
       pformId: that.data.pformId,
       formId:that.data.formId,
       puid:that.data.puid,
       pid: that.data.pid,
       content: that.data.user_cin,
       article_id: that.data.article_id,
       author: that.data.userinfo.nickName,
       avatarUrl: that.data.userinfo.avatarUrl,
       topic:that.data.topic,
       pname: that.data.pname},
     method: 'post',
     header: {
       'content-type': 'application/x-www-form-urlencoded',
       'token': wx.getStorageSync('token')
     },
     success:function(res){

       that.setData({
         user_cin:'',
         pid:0,
         ReplyTo: '发表评论',
       })
       wx.showToast({
         title: '发表成功',
       })
       that._getcommentlist(that.data.article_id)
     }
   })
  


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
  this.setData({
    playing:false
  })
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
    if (this.innerAudioContext)
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


})