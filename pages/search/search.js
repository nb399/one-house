// pages/search/search.js
import { Search } from 'search-model.js';
var search = new Search;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabItems: ['视频', '商城', '社区'],
    wordList1: ['2018', 'PG one', '绿帽社', 'Nice'],
    wordList2: ['空运', '双击666', '狗粮', '春节放假'],
    historyList: [],
    tabIndex: 1,
  },
  highLightKeywords: function (text, words, tag) {
    var that = this;
    tag = tag || 'span';// 默认的标签，如果没有指定，使用span
    var i, len = words.length, re;

    //匹配每一个关键字字符
    for (i = 0; i < len; i++) {
      // 正则匹配所有的文本
      re = new RegExp(words[i], 'g');
      if (re.test(text) && words[i]!=' ') {
        console.log(text)
        text = text.replace(re, '<' + tag + ' class="highlight">$&</' + tag + '>');
        console.log(text)
      }
    
      
    }
    return text;
    //匹配整个关键词 不拆分
    //     re = new RegExp(words, 'g');
    //     if(re.test(text)) {
    //       text = text.replace(re, '<' + tag + ' class="highlight">$&</' + tag + '>');
    //     }
    // that.setData({
    //   text: text
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    search.GetWorldlist((res)=>{
      var wordList=[];
      for(var i in res){
        wordList.push(res[i].word)
      }
      that.setData({
        wordList1: wordList.slice(0,6),
        wordList2: wordList.slice(6)
      })
    })
    that.setData({
      tabIndex: options.searchfrom,
      historyList: wx.getStorageSync('history')
    })
    console.log(that.data.value)
  },
  /**
   * 清除搜索历史
   */
  _clearHistory: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除搜索记录吗？',
      success:function(res){
        if (res.confirm) {
          wx.removeStorageSync('history')
          that.setData({
            historyList: wx.getStorageSync('history')
          })
        }
 
      }
    })
    
  },
  /**
   * 改变热门搜索
   */
  _changeRed: function (e) {
    this.setData({
      shouqi: this.data.shouqi ? false : true
    })
  },

  //去左空格;
  ltrim: function (s) {
    return s.replace(/(^\s*)/g, "");
  },
  /**
   * 记录输入
   */
  _SaveCin: function (e) {
    var that = this;

    var cin = e.detail.value
    that.setData({
      value: cin
    })
    if (cin.length == 0) {
      that.setData({
        loading: false,
        historyList: wx.getStorageSync('history')
      })
    }
    console.log(cin)
  },
  /**
   * 快速查询
   */
  _quickSearch: function (e) {
    var that = this;
    console.log(e);
    var keyword = e.currentTarget.dataset.word;
    that.setData({
      value: keyword
    })
    that._ComfirmCin(e, keyword);

  },
  /**
   * 输入完成
   */
  _ComfirmCin: function (e, keyword) {
    var that = this;
   
    var data = this.ltrim(that.data.value)
    console.log(data)


    var keyword = keyword ? keyword : data;
    if (!keyword||keyword==' '){
      keyword='全'
    }
    console.log(typeof (keyword))
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '正在搜索',
    })
    search.GoToSearch(keyword, (res) => {
      var everyword=keyword.split('')
      console.log(everyword)
      for(var i in res)
      {
        for(var j in res[i].data){
          
          res[i].data[j].name=this.highLightKeywords(res[i].data[j].name,everyword);
          res[i].data[j].title = this.highLightKeywords(res[i].data[j].title,everyword);
          res[i].data[j].topic = this.highLightKeywords(res[i].data[j].topic,everyword);
        }
      }
   console.log(res)
         
      that.setData({
        videoArr2: [],
        articleArr2: [],
        productArr2: [],
        videoArr1: res[1].data,
        articleArr1: res[0].data,
        productArr1: res[2].data
      })
if(res.length>3)     
      that.setData({       
        videoArr2: res[4].data,
        articleArr2: res[3].data,
        productArr2: res[5].data,
        })

      
      wx.hideLoading();
      var history = [];
      var oldHistory = [];


      if (wx.getStorageSync('history')) {
        history = wx.getStorageSync('history');
        if (history.indexOf(keyword) < 0) {
          history.unshift(keyword)
        }
      }
      else {
        history.unshift(keyword)
      }
      wx.setStorageSync('history', history)
    })

  },
  /**
   * 切换Tab
   */
  _changeTab: function (e) {
    var that = this;
    console.log(e);
    var tabIndex = e.currentTarget.dataset.index;
    that.setData({
      tabIndex: tabIndex
    })

  },
  /**
   * 取消
   */
  _GoBack: function () {
    wx.navigateBack({

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
console.log(66)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})