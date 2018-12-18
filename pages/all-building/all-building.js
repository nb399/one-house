// pages/all-building/all-building.js

import {
  allModel
} from 'all-model.js';
var allM = new allModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noMore:false,
    buildAreasIndex: 0,
    area_type_id: 0,
    buildAreas: [{
        id: 0,
        title: '全部区域'
      }, {
        id: 330002,
        title: '上城区'
      }, {
        id: 330003,
        title: '下城区'
      }, {
        id: 330004,
        title: '江干区'
      }, {
        id: 330005,
        title: '拱墅区'
      }, {
        id: 330006,
        title: '西湖区'
      }, {
        id: 330007,
        title: '滨江区'
      }, {
        id: 330008,
        title: '萧山区'
      }, {
        id: 330009,
        title: '余杭区'
      }, {
        id: 330010,
        title: '大江东'
      }, {
        id: 330011,
        title: '富阳区'
      }, {
        id: 330012,
        title: '临安区'
      },
      {
        id: 330013,
        title: '建德市'
      }, {
        id: 330014,
        title: '淳安县'
      },
    ],
    buildTypesIndex: 0,
    build_type_id: 0,
    buildTypes: [{
      id: 0,
      title: '全楼楼盘'
    }, {
      id: 2,
      title: '即将拿证'
    }, {
      id: 3,
      title: '正在公示'
    }, {
      id: 4,
      title: '正在登记'
    }, {
      id: 5,
      title: '即将摇号'
    }, {
      id: 6,
      title: '已摇号'
    }, ],
    buildingList: [],
    page: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getBannerData();
    this.getBuildingList();

  },
  /**
   * 加载数据
   */
  getBannerData: function() {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var id = 1;
    this.setData({
      loading: true
    })
    allM.getBannerData(id, (res) => {
      this.setData({
        'bannerArr': res,
        loading: false
      });
    });
  },
  /**
   * 获取楼盘列表
   */
  getBuildingList() {
    var that = this;
    this.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中..',
    })
    allM.getbuildsData(that.data.build_type_id, that.data.area_type_id, that.data.page, (data) => {
      wx.hideLoading();
      let oldData = that.data.buildingList;
      let newData = data.data ? data.data:[];
      that.setData({
        buildingList: oldData.concat(newData),
        loading: false
      });
      if (!data.has_more){
        that.setData({
          noMore:true
        })
      }
    });
  },
  /**
   * 切换楼盘类型
   */
  buildTypeChange(e) {
    var that = this;
    var buildTypesIndex = e.detail.value;
    if (buildTypesIndex == that.data.buildTypesIndex) return;
    var curretBuildType = that.data.buildTypes[buildTypesIndex];
    that.setData({
      buildingList: [],
      page: 0,
      noMore:false,
      buildTypesIndex: buildTypesIndex,
      build_type_id: curretBuildType.id
    })
    that.getBuildingList();
  },
  /**
   * 切换楼盘区域
   */
  buildAreaChange(e) {
    var that = this;
    var buildAreasIndex = e.detail.value;
    if (buildAreasIndex == that.data.buildAreasIndex) return;
    var curretBuildArea = that.data.buildAreas[buildAreasIndex];
    that.setData({
      buildingList: [],
      page: 0,
      noMore: false,
      buildAreasIndex: buildAreasIndex,
      area_type_id: curretBuildArea.id
    })
    that.getBuildingList();
  },
  /**
   * 前往楼盘详情
   */
  goBuildingDetail(e){
    var that=this;
    var build_id=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/one-building/one-building?build_id=' + build_id,
    })
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
    var that = this;
    if (!that.data.loading&&!that.data.noMore) {
      that.setData({
        page: ++that.data.page
      })
      that.getBuildingList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})