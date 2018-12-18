// home.js

import { Home } from 'home-model.js';

var home = new Home();
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[
      {
        icon:'/imgs/icon/icon-quanbu.png',
        name:'全部楼盘',
        url:'/pages/all-building/all-building'
      }, {
        icon: '/imgs/icon/icon-jijiang.png',
        name: '即将拿证',
      }, {
        icon: '/imgs/icon/icon-gongshi.png',
        name: '正在公示',
      }, {
        icon: '/imgs/icon/icon-dengji.png',
        name: '正在登记',
      }, {
        icon: '/imgs/icon/icon-jijiangyaohao.png',
        name: '即将摇号',
      }, {
        icon: '/imgs/icon/icon-jieguo.png',
        name: '已摇号',
      }, {
        icon: '/imgs/icon/icon-shidi.png',
        name: '实地盘跑',
      }, {
        icon: '/imgs/icon/icon-yuyue.png',
        name: '预约看房',
      }    ],
    swiperIndex: 1,
    category: '',
    indexId: ''
  },
  _swiperChange: function (e) {
    var that = this;
    if(e.detail.source=="autoplay"){
      return 0;
    }
    var swiperIndex = e.detail.current;
    that.setData({
      swiperIndex: swiperIndex
    })
  },
  /**
   * 轮播往左
   */
  _swiperLeft: function (e) {
    var that = this;

    var swiperIndex = that.data.swiperIndex;
    swiperIndex > 0 ? swiperIndex-- : swiperIndex = 3
    that.setData({
      swiperIndex: swiperIndex
    })
  },
  /**
   * 轮播向右
   */
  _swiperRight: function (e) {
    var that = this;

    var swiperIndex = that.data.swiperIndex;
    swiperIndex < 3 ? swiperIndex++ : swiperIndex = 0
    that.setData({
      swiperIndex: swiperIndex
    })
  },
  /**
   * 滚轴位置
   */
  onPageScroll: function (e) {
    if (e.scrollTop > 30 && e.scrollTop < 300) {
      this.setData({
        optical: e.scrollTop * 3 / 1000
      })
    }
    else if (e.scrollTop > 500) {
      this.setData({
        optical: 1
      })
    }
  },
  onLoad: function () {
    var that = this;
    this._loadData();

  },
  /**
   * 跳转至搜索页
   */
  _search: function (e) {
    wx.navigateTo({
      url: '../search/search?searchfrom=0',
    })
  },
  /**
   * 跳转至消息页
   */
  _message: function (e) {
    wx.navigateTo({
      url: '../message/message',
    })
  },
  /**
   * 评论
   */
  _comment: function (e) {
    var that = this;
    var article_id = e.currentTarget.dataset.id;
    // if (article_id == 1258963257) {
    //   wx.navigateTo({
    //     url: '../copywriting/copywriting?video=1&article_id=' + article_id,
    //   })
    // }
   
      wx.navigateTo({
        url: '../article/article?video=1&article_id=' + article_id,
      })
    

  },
  /**
   * 点赞
   */
  _praise: function (e) {
    var that = this;
 
    console.log(e);
    wx.showLoading({
      title: '点点赞',
    })
    var id = e.currentTarget.dataset.id;
    home.Praise(id, (res) => {
      console.log(res)
      var videolist = that.data.videolist;
      console.log(e.currentTarget.dataset.index)

      videolist[e.currentTarget.dataset.index].ispraised = res

      if (res)
      { videolist[e.currentTarget.dataset.index].praise_num++ }
      else {
        videolist[e.currentTarget.dataset.index].praise_num--
      }
      that.setData({
        videolist: videolist
      })
      console.log(that.data.videolist)
      wx.hideLoading();
    });

  },



  /**
   * 加载数据
   */
  _loadData: function () {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var id = 1;
    home.getcategory(res => {
      console.log(res)
      that.setData({
        'category.big': res[0],
        'category.small': res
      })
    })
    home.getVideoData((res) => {
      console.log(res)
      var data = res;
      if (data.length > 0) {
        for (var i in data) {
          if (data[i].praisepeople.length)
            for (var j in data[i].praisepeople) {
              if (data[i].praisepeople[j].uid == uid) {
                data[i].ispraised = true;
                break;
              }
              else
                data[i].ispraised = false;
            }
        }
        this.setData({
          videolist: data,
          loading: true
        });
        console.log(that.data.videolist)
      }
      else{
        this.setData({

          loading: true
        })
      }

    })
    home.getBannerData(id, (res) => {
      this.setData({
        'bannerArr': res
      });
    });

    home.getThemeData((res) => {

      this.setData({
        'themeArr': res
      });
    });

    home.getProductsData((data) => {

      this.setData({
        productsArr: data,

      });

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

        productsArr[index].usercollection[0] = 1;
        that.setData({
          productsArr: productsArr
        })
      }
      else {
        console.log(333)
        productsArr[index].usercollection[0] = 0;
        that.setData({
          productsArr: productsArr
        })


      }
      wx.hideLoading();
    })
  },
  /**
   * 跳转至商品详情
   */
  onProductsItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    });
  },
  /**
   * 跳转至主题页
   */
  onThemesItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    var name = home.getDataSet(event, 'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name
    })
  },
  /**
   * 播放视频
   */
  PlayVideo: function (e) {
    console.log(e)
    var that = this;
    if (that.data.indexId && that.data.indexId != e.currentTarget.id) {
      that.videoContext = wx.createVideoContext(that.data.indexId);
      that.videoContext.pause();
      console.log("暂停: " + that.data.indexId)
    }
    that.setData({
      indexId: e.currentTarget.id
    })

    console.log("当前: " + that.data.indexId);

  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {

    this.onLoad();
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    console.log(555)
  },

})