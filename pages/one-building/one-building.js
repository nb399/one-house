// pages/one-building/one-building.js
import {
  oneModel
} from 'one-model.js';
var oneM = new oneModel();
import {
  $wuxGallery
} from '../../dist/index'
import { Article } from '../myarticle/myarticle-model.js';
var article = new Article;
const res = wx.getSystemInfoSync()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    buildData: {},
    previewImgIndex: 0,
    tabContentMinHeight: res.windowHeight - 100,
    //阅读更多
    showMoreDetail: true
  },
  /**
 * 点击查看帖
 */
  _look_article: function (e) {

    var article_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article/article?article_id=' + article_id,
    })
  },
  /**
 * 点赞
 */
  _Praise: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var article_id = e.currentTarget.dataset.id;
    var AAList = that.data.ArticleArr;
    if (!AAList[index].praisepeople[0])
      wx.showToast({
        title: '点点赞',
        mask: true,
      })
    oneM.clickLove(article_id, (res) => {
        res ? AAList[index].praise_num++ : AAList[index].praise_num--;
        AAList[index].praisepeople[0] = res
      that.setData({
        ArticleArr: AAList
      })
    })

  },
  /**
   * 打开画廊
   */
  showGallery(e) {
    var that=this;
    that.setData({
      hideCoverView:true
    })
    console.log(e)
    var current= e.currentTarget.dataset;
    var urls= e.currentTarget.dataset.urls;
    console.log(urls)
    $wuxGallery().show({
      current,
      urls: urls.map((n) => ({
        image: n,
        remark: '缩放图片更清晰'
      })),
      cancel() {
        that.setData({
          hideCoverView: false
        })
      },
      onTap(current, urls) {
        console.log(current, urls)
        return true
      },
      showDelete: false,
      indicatorDots: true,
      indicatorColor: '#fff',
      indicatorActiveColor: '#04BE02',
    })
  },
  /**
   * 打开地图
   */
  openMap(e) {
    var that = this;
    wx.openLocation({
      latitude: Number(that.data.buildData.areaLat),
      longitude: Number(that.data.buildData.areaLng),
    })
  },
  /**
   * 去个人页
   */
  goUser(e) {
    var personid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/attention-people/attention-people?personid=' + personid,
    })
  },

  /**
   * 切换swiper图片
   */
  changeSwiperIndex(e) {
    var that = this;
    let current = e.currentTarget.dataset.index;
    if (current == that.data.previewImgIndex) return;
    that.setData({
      previewImgIndex: current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var build_id = options.build_id;
    that.setData({
      build_id: build_id
    })
    that.getBuildDetail(res => {
      console.log(res)
      that.setData({
        company_id: res
      })
      that.data.company_id = res;
      that.getArticleByCompany();
    });
    that.getSalersByBuild();
  },
  /**
   * 获取跑盘
   */
  getArticleByCompany() {
    var that = this;
    that.setData({
      loadingArticle: true
    })
    console.log(that.data.company_id)
    oneM.getArticleByCompany(that.data.company_id, data => {
      that.setData({
        loadingArticle: false,
      })

      that.setData({
        ArticleArr: data.data,
      })
    })
  },
  /**
   * 打开更多活动详情
   */
  showMoreDetail: function(e) {
    const that = this
    let houseInfo = that.data.buildData.house_source_info;
    let lastDetail = houseInfo.slice(150 + 400 * ++that.data.showMoreDetailTime);
    if (lastDetail) {
      that.setData({
        summary: houseInfo.slice(0, 150 + 400 * that.data.showMoreDetailTime)
      })
    } else {
      that.setData({
        showMoreDetail: !that.data.showMoreDetail
      })
    }

  },
  /**
   * 获取置业顾问
   */
  getSalersByBuild() {
    var that = this;
    wx.showLoading({
      title: '载入中..',
    })
    that.setData({
      loading: true
    })
    oneM.getSalersByBuild(that.data.build_id, data => {
      wx.hideLoading();
      var SalerMain = [];
      for (let i in data) {
        if (data[i].isMain) {
          SalerMain = data.splice(i, 1);
          break;
        }
      }
      that.setData({
        SalerMain: SalerMain,
        SalersArr: data
      })
    })
  },
  /**
   * page下拉事件
   */
  onPageScroll: function(e) {
    const that = this
    if (e.scrollTop > 10) {
      //获取
      // if (!this.data.show_res) {
      //   if (that.data.currentTab == 0) {
      //     if (that.data.activityData.actDetailRes) {
      //       that.getDetailRes()
      //     }
      //   }
      //   that.setData({
      //     show_res: true,
      //   })
      // }
    }
    if (e.scrollTop > (636 - that.data.tabContentMinHeight)) {
      if (!that.data.titleBarChanged) {
        that.setData({
          titleBarChanged: true
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff',
        })
        wx.setNavigationBarTitle({
          title: that.data.buildData.name,
        })
      }
    } else {
      if (that.data.titleBarChanged) {
        that.setData({
          titleBarChanged: false
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#000000',
        })
        wx.setNavigationBarTitle({
          title: '楼盘详情',
        })
      }
    }
    if (e.scrollTop > 650) {
      if (!that.data.topBarChanged) {
        that.setData({
          topBarChanged: true
        })
      }
    } else {
      if (that.data.topBarChanged) {
        that.setData({
          topBarChanged: false
        })
      }
    }
  },
  /**
   * swiper切换
   */
  changePreviewImg(e) {
    this.setData({
      previewImgIndex: e.detail.current
    })
  },
  test2(e) {
    console.log(e)
  },
  test(e) {
    console.log(e)
  },
  /**
   *变百分比 
   */
  toPercent(num, total) {
    return (Math.round(num / total * 10000) / 100.0 + "%");
  },
  /**
   * 获取楼盘详情
   */
  getBuildDetail(cb) {
    var that = this;
    wx.showLoading({
      title: '载入中..',
    })
    that.setData({
      loading: true
    })
    oneM.getOneDetail(that.data.build_id, data => {
      wx.hideLoading()
      //成功回调跑盘列表
      cb && cb(data.company_id)
      //banner图
      data.banner_urls = data.banner_urls.split(',');
      //中签概率
      data.all_probability = null;
      data.no_home_probability = null;
      data.have_home_probability = null;
      if (data.all_register_num !== null && data.all_build_num != null) {
        data.all_probability = that.toPercent(data.all_build_num, data.all_register_num);
      }
      if (data.no_home_register_num !== null && data.no_home_build_num != null) {
        data.no_home_probability = that.toPercent(data.no_home_build_num, data.no_home_register_num);
      }
      if (data.have_home_register_num !== null && data.have_home_build_num != null && data.no_home_build_num != null) {
        data.have_home_probability = that.toPercent(data.have_home_build_num, data.all_register_num - data.no_home_build_num);
      }
      // 房源信息是否有更多按钮
      if (data.house_source_info.length > 150 || data.house_source_info) {
        that.setData({
          summary: data.house_source_info.slice(0, 150) + '...',
          showMoreDetailTime: 0,
          showMoreDetail: false
        })
      }
      // 地图 
      let markers = []
      let marker = {
        id: 1,
        latitude: data.areaLat,
        longitude: data.areaLng,
        name: data.name
      }
      markers.push(marker)
      that.setData({
        markers: markers,
        loading: false,
        buildData: data,
        'buildData.housePlanArr': data.house_plan.split(',')
      })
    })
  },
  /**
   * 地图状态成功回调
   */
  mapUpdated: function() {
    this.setData({
      mapUpdated: true
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

  },

  /**
   * 用户分享
   */
  onShareAppMessage: function(e) {
    var imageUrl = e.target.dataset.item;
    var shareType = e.target.dataset.type
    if (shareType=='article'){
      return {
        title: e.target.dataset.item.content.substr(0, 16) + '...',
        path: '/pages/article/article?article_id=' + e.target.dataset.id,
        imageUrl: imageUrl.items[0] ? imageUrl.items[0].img_url : '',
        success: function (res) {
          wx.showToast({
            image: '/imgs/icon/pay@success.png',
            title: '转发成功',
          })
          var param = { type: 'article', id: e.target.dataset.id }
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
    }else{
     
    }
   
  }
})