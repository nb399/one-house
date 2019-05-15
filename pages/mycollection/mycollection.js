// pages/mycollection/mycollection.js
import { Pbl } from '../pbl/pbl-model.js';
var PBL = new Pbl;
import { Home } from '../home/home-model.js';

var home = new Home();

import {Base} from '../../utils/base.js';

var base=new Base;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  tab:0,
  },
/**
 * 切换顶部
 */
  _changeTab:function(e){
    var that=this;
    that.setData({
      tab:that.data.tab==0?1:0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  that._loadData((res)=>{
    console.log(res)
    var productsArr=res;
    for (var i in productsArr){
      productsArr[i].usercollection=1
    }
    that.setData({
      productsArr: productsArr,

    });
  });
  },
  /**
 * 跳转至商品详情
 */
  onProductsItemTap: function (event) {
    var id = home.getDataSet(event, 'id');  
    wx.navigateTo({
      url: '../one-building/one-building?type=company&company_id=' + id
    });
  },
  /**
  * 收藏
  */
  _Collecting: function (event) {
    var that = this;
    var id = home.getDataSet(event, 'id');
    var index = home.getDataSet(event, 'index');
    wx.showLoading({
      mask: true
    })
    home.DoCollecte(id, (res) => {
      console.log(res)
      var productsArr = that.data.productsArr;
      if (res) {

        productsArr[index].usercollection = 1;
        that.setData({
          productsArr: productsArr
        })
      }
      else {
        console.log(333)
        productsArr[index].usercollection = 0;
        that.setData({
          productsArr: productsArr
        })


      }
      wx.hideLoading();
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
/**
 * 加载数据
 */
  _loadData: function (callback){
    var that=this;
    var params={
      url:'collection/UserCollection',
      sCallback:function(res){
        callback && callback(res)
      }
    }
    base.request(params)
    PBL.attentionlist((res) => {
      console.log(res)
      that.setData({
        attentionlist: res
      })
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