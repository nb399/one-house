// pages/myarticle/myarticle.js
import { Article } from '../myarticle/myarticle-model.js';
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that._loadData();

  },
  /**
   * 加载数据
   */
  _loadData: function (callback) {
    var that = this;
    article.getArticles(this.data.pageIndex, (res) => {
      var data = res.data;

      if (data.length > 0) {
        this.data.articleArr.push.apply(this.data.articleArr, data);
        this.setData({
          articleArr: this.data.articleArr
        });
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
   * 删除帖
   */
  _delete_article: function (e) {
    var that = this;
    wx.showModal({
      title: '删除此帖',
      content: '确定要删除吗？？',
      success: function (res) {
        console.log(e.currentTarget.dataset.id);

        if (res.confirm) {
          console.log('用户点击确定')
          var id = e.currentTarget.dataset.id;


          article.deleteArticle(id, (res) => {
       console.log(res)
            that.setData({
              articleArr: res.data
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    console.log(666)
    console.log(this.data.pageIndex);
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._loadData();
      //scroll-view
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})