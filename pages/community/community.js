// pages/community/community.js
import { Config } from '../../utils/config.js';
import { Article } from '../myarticle/myarticle-model.js';
import {Community} from 'community-model.js'
var community=new Community;
var article = new Article;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    articleArr: [],
    isLoadedAll: false
  },
  /**
   * 预览图片
   */
  _previewimg: function (e) {
    console.log(e)
    var that = this;
    var imgs = [];

    for (var i in e.currentTarget.dataset.imgs) {
      imgs.push(e.currentTarget.dataset.imgs[i].img_url)
    }
    console.log(imgs)
    wx.previewImage({
      current: imgs[e.currentTarget.dataset.imgindex], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that=this;
   
        that.setData({
      pageIndex: 1,
      articleArr: [],
      isLoadedAll: false
    })
    wx.showLoading({
      title: '正在刷新',
    })
    that._loadData(function(){
      wx.hideLoading();
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 点赞
   */
  _Praise: function (e) {
    console.log(e);
    var that = this;
    var article_id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '点点赞',
    })

    wx.request({
      url: Config.restUrl+'/article/praise?article_id=' + article_id,
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        
        var articleArr = that.data.articleArr;
        console.log(e.currentTarget.dataset.index)
        
        articleArr[e.currentTarget.dataset.index].ispraised=res.data
        if (res.data)
        { articleArr[e.currentTarget.dataset.index].praise_num++}
        else{
          articleArr[e.currentTarget.dataset.index].praise_num--
        }
        that.setData({
          articleArr: articleArr
        })
        wx.hideLoading();
      }
    })
  },
  /**
   * 点击前往发布
   */
  _writetie: function () {
    wx.navigateTo({
      url: '../publish/publish',
    })
  },
  /**
   * 获取社区文章列表
   */
  _loadData: function (callback) {

    var that = this;
    community._GetCategoryImgs((res)=>{
      console.log(res)
      that.setData({
        'community.big':res[0],
        'community.small':res
      })
     
    })
    article.getAllArticles(this.data.pageIndex, (res) => {
      var data = res.data;
      var uid = wx.getStorageSync('uid');
      if (data.length > 0) {
        this.data.articleArr.push.apply(this.data.articleArr, data);
        for (var i in this.data.articleArr) {
          if (this.data.articleArr[i].praisepeople.length)
            for (var j in this.data.articleArr[i].praisepeople) {
              if (this.data.articleArr[i].praisepeople[j].uid == uid) {
                this.data.articleArr[i].ispraised = true;
              }
              else
                this.data.articleArr[i].ispraised = false;
            }
        }
        this.setData({
          articleArr: this.data.articleArr
        });
        console.log(that.data.articleArr)
      }
      else {
        this.data.isLoadedAll = true;
      }
      callback && callback();
    })
  },
  /**
   * 点击查看帖
   */
  look_article: function (e) {
    console.log(e)
    var article_id = e.currentTarget.id;
    wx.navigateTo({
      url: '../article/article?article_id=' + article_id,
    })
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
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    console.log(1111)
    this.onLoad();
    console.log(2222)
    wx.stopPullDownRefresh()
  },
  /**
   * 刷新
   */
  _redo:function(){
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    console.log(this.data.pageIndex);
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._loadData();
      //scroll-view
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
console.log(777)
    var imageUrl=e.target.dataset.item
    return {
      title: e.target.dataset.item.content.substr(0,16)+'...',
      path: '/pages/article/article?article_id=' + e.target.dataset.id,
      imageUrl: imageUrl.items[0] ? imageUrl.items[0].img_url:'',
      success: function (res) {    
        wx.showToast({
          image:'/imgs/icon/pay@success.png',
          title: '转发成功',
        })
        var param = { type: 'article', id: e.target.dataset.id}
        article.forward(param,(res)=>{
          console.log(res)
        })
       
      },
      fail: function (res) {      
        wx.showToast({
          image:'/imgs/icon/pay@error.png',
          title: '转发失败',
        })
      }
    }
  },
  /**
   * 转发
   */
  _Forward:function(e){
    console.log(e)
  }
})