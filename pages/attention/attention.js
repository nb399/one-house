// pages/attention/attention.js

import {
  Attention
} from 'attention-model.js'
import {
  Article
} from '../myarticle/myarticle-model.js';
var article = new Article;
var AttentionM = new Attention;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attentionArticleList: [],
    attentionPage: 1,
  },
  /**
* 点击播放视频
*/
  _playVideo(e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.id;
    if (this.videoContext) {
      this.videoContext.pause();
    }
    this.videoContext = wx.createVideoContext(id);

  },
  /**
   * 加载关注内容
   */
  loadAttention: function(e) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var page = that.data.attentionPage;
    AttentionM.attentionArticles(uid, page, (res) => {
      var newArr = res.data;
      var newAttention = that.data.attentionArticleList;
      for (let i in newArr){
        newArr[i].imgList = newArr[i].imgList.split(',')
      }
      that.setData({
        attentionArticleList: newAttention.concat(newArr)
      })

    })

  },
  /**
   * 跳转个人主页
   */
  _personPage: function(e) {

    var that = this;
    var personid = e.currentTarget.dataset.personid;
    wx.navigateTo({
      url: '../attention-people/attention-people?personid=' + personid,
    })

  },
  /**
   * 点击关注
   */
  _attention: function(e) {
    var that = this;


    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;

    AttentionM.addAttention(id, (res) => {
      var recommendedList = that.data.recommendedList;


      recommendedList[index].attentioned = res
      that.setData({
        recommendedList: recommendedList
      })
    })
  },
  /**
   * 点赞
   */
  _Praise: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var article_id = e.currentTarget.dataset.id;
    var AAList = that.data.attentionArticleList;
    wx.showToast({
      title: '点点赞',
      mask: true,
    })
    AttentionM.clickLove(article_id, (res) => {
      res ? AAList[index].praise_num++ : AAList[index].praise_num--;
      AAList[index].praisepeople[0] = res
      that.setData({
        attentionArticleList: AAList
      })
    })
  },
  /**
   * 预览图片
   */
  _previewimg: function(e) {
    var that = this;
    var imgs = [];
    for (var i in e.currentTarget.dataset.imgs) {
      imgs.push(e.currentTarget.dataset.imgs[i].artwork_url)
    }
    wx.previewImage({
      current: imgs[0], // 当前显示图片的http链接
      urls: imgs, // 需要预览的图片http链接列表
      complete: function(res) {}
    })
  },
  /**
   * 点击查看帖
   */
  _look_article: function(e) {
    var article_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article/article?article_id=' + article_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    AttentionM.attentionlist((res) => {
      that.setData({
        attentionlist: res
      })
    })
    AttentionM.recommendedList(uid, (res) => {
      that.setData({
        recommendedList: res
      })
    })
    that.loadAttention();
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
    wx.hideTabBarRedDot({
      index: 3,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this;
    if (that.videoContext) {
      that.videoContext.pause();
    }
    wx.showTabBarRedDot({
      index: 3,
    })
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
    var that = this;
    that.setData({
      attentionArticleList: [],
      attentionPage: 1
    })
    that.loadAttention();
    wx.stopPullDownRefresh()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.attentionPage++;
    this.loadAttention();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})