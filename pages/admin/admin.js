// pages/admin/admin.js
import {
  Config
} from '../../utils/config.js';
import {
  Admin
} from 'admin-model.js';
var adminM = new Admin();
var cy = require('../../utils/cy.js');
import { $wuxSelect } from '../../dist/index'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publish: {},
    uploadKind:0,
    searchRes:[],
    searchTypeArr:[
    '公司信息','楼盘信息','关联公司'
    ],
    area_type: [{
      value: 0,
      title: '全部区域'
    }, {
      value: 330002,
      title: '上城区'
    }, {
      value: 330003,
      title: '下城区'
    }, {
      value: 330004,
      title: '江干区'
    }, {
      value: 330005,
      title: '拱墅区'
    }, {
      value: 330006,
      title: '西湖区'
    }, {
      value: 330007,
      title: '滨江区'
    }, {
      value: 330008,
      title: '萧山区'
    }, {
      value: 330009,
      title: '余杭区'
    }, {
      value: 330010,
      title: '大江东'
    }, {
      value: 330011,
      title: '富阳区'
    }, {
      value: 330012,
      title: '临安区'
    },
    {
      value: 330013,
      title: '建德市'
    }, {
      value: 330014,
      title: '淳安县'
    },
    ],


    build_type: [{
      value: 0,
      title: '全楼楼盘'
    }, {
      value: 1, 
      title: '暂未开盘'
    }, {
      value: 2,
      title: '即将拿证'
    }, {
      value: 3,
      title: '正在公示'
    }, {
      value: 4,
      title: '正在登记'
    }, {
      value: 5,
      title: '即将摇号'
    }, {
      value: 6,
      title: '已摇号'
    },],
  },
/**
 * 切换选择类型
 */
  onChangeSearchType(){
    var that=this;
    $wuxSelect('#search_type').open({
      options: that.data['searchTypeArr'],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          that.setData({
            search_type: options[index],
          })
        }
      },
    })
  },
  onClickPick(e) {
    var that = this;
    var label = e.currentTarget.dataset.label;
    $wuxSelect('#' + label).open({
      options: that.data[label],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            [`publish.${label}`]: options[index].title,
            [`publish.${label + '_id'}`]: options[index].value,
          })
        }
      },
    })
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
    if (that.data.search_type=='楼盘信息'){
      that.searchBuilding(keyword);

    }else{
      that.searchBuildCompany(keyword);

    }
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
      "publish.id": '',
      "publish.iname": '',
    })

  },
  /**
   * 
   */
  onBlur(e) {
    console.log(e)
    var that = this;
    var label = e.target.dataset.label
    console.log(e)
    that.setData({
      [`publish.${label}`]: e.detail.value
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
    adminM.searchBuildCompany(param, res => {
      console.log(res)
      if (!cy.checkIsBlank(res.data)) {
        that.setData({
          searchRes: res.data
        })
      }
    })
  },
  /**
   * 搜索楼盘
   */
  searchBuilding(keyword){
    var that = this;
    let param = {
      keyword: keyword
    }
    adminM.searchBuilding(param, res => {
      console.log(res)
      if (!cy.checkIsBlank(res.data)) {
        that.setData({
          searchRes: res.data
        })
      }
    })
  },
  /**
   * 选择楼盘
   */
  chooseBuild(e) {
    var that = this;
    var build = e.currentTarget.dataset.build;
    if (that.data.search_type=='关联公司'){
      that.setData({
        "publish.company_id": build.id,
        "publish.company_name": build.name,
        searchRes: []
      })
    }else{
      that.setData({
        "publish.id": build.id,
        "publish.name": build.name,
        searchRes: []
      })
    }

  },
  /**
   * 选地址
   */
  _chooseLocation() {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          'publish.address': res.address,
          'publish.areaLat': res.latitude,
          'publish.areaLng': res.longitude,
        })
      },
    })
  },
  /**
  * 选择图片
  */
  _chooseimg: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = [];
        for (let i in res.tempFilePaths) {
          wx.getImageInfo({
            src: res.tempFilePaths[i],
            success(result) {
              tempFilePaths.push({
                url: res.tempFilePaths[i],
                height: result.height,
                width: result.width
              })
              switch (type) {
                case 'banner_urls': that.setData({
                  banner_urls: tempFilePaths,
                }); break;
                case 'publicity_plan_imgs': that.setData({
                  publicity_plan_imgs: tempFilePaths,
                }); break;
                case 'poster_url': that.setData({
                  poster_url: tempFilePaths,
                }); break;
                case 'house_plan': that.setData({
                  house_plan: tempFilePaths,
                }); break;
              }

              console.log(res)
            }
          })
        }
      }
    })
  },
  /**
   * 上传表单
   */
  uploadForm() {
    var that = this;
    var params = that.data.publish;
    console.log(params)
    if (that.data.search_type=='公司信息'){
      adminM.uploadFormCompany(params, res => {
        console.log(res)
        wx.showModal({
          title: '提醒',
          content: '上传成功',
          confirmText:'重置',
          cancelText:'继续',
          success(res){
            if(res.confirm){
              wx.redirectTo({
                url: '/pages/admin/admin',
              })
            }
          }
        })
     
      })
    }else{
      adminM.uploadForm(params, res => {
        console.log(res)
        wx.showModal({
          title: '提醒',
          content: '上传成功',
          confirmText: '重置',
          cancelText: '继续',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/admin/admin',
              })
            }else{
              that.setData({
                uploadKind:0
              })
            }
          }
        })

      })
    }

  },
  /**
 * 上传资源
 */
  uploadConetnt(data=[], name) {
    var that = this;
    cy.uploadImages(data, 'fang/', 0, [], imgsUrl => {
      console.log(imgsUrl)
      that.data.uploadKind++;
      if (imgsUrl.length > 0) {
        that.data.publish[name] = imgsUrl.join(',');
      }
      if (that.data.uploadKind == 4) {
        that.uploadForm();
      }
    })
  },
  /**
   * 点击提交
   */
  _submit() {
    var that = this;
    wx.showLoading({
      title: '上传中..',
    })
    that.uploadConetnt(that.data.poster_url, 'poster_url');
    that.uploadConetnt(that.data.publicity_plan_imgs, 'publicity_plan_imgs');
    that.uploadConetnt(that.data.banner_urls, 'banner_urls');
    that.uploadConetnt(that.data.house_plan, 'house_plan');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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