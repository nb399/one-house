// pages/attention-people/attention-people.js
import { Config } from '../../utils/config.js';
import {People} from 'people-model.js';
import { Pbl} from '../pbl/pbl-model.js';
var PBL = new Pbl;
var people= new People;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoadedAll: false,
    attentionArticleList: [],
    attentionPage: 1,
    articleArr: [],
    pageIndex: 1,
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    col1H: 0,
    col2H: 0,
    topTow: ['关注', '发现'],
    TopCategoryList: ['美妆', '美食', '宠物', '服饰', '杭州', '自拍', '搞笑', '尬聊'],
    tabIndex: '美妆',
    topTowIndex: '发现'
  },

  /**
   * 预览图片
   */
  _previewimg: function (e) {

    var that = this;
    var imgs = [];

    for (var i in e.currentTarget.dataset.imgs) {
      imgs.push(e.currentTarget.dataset.imgs[i].img_url)
    }

    wx.previewImage({
      current: imgs[0], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
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
 * 点击关注
 */
  _attention: function (e) {
    var that = this;
    console.log(e)

    var id = e.currentTarget.dataset.id;
   

    PBL.addAttention(id, (res) => {   
      that.setData({
        'Person.watchlist[0]': res
      })
      wx.showToast({
        title: res?'已关注':'已取消',
      })
    })
  },
  /**
  * 点赞
  */
  _Praise: function (e) {

    var that = this;
    var col = e.currentTarget.dataset.col, col1 = that.data.col1, col2 = that.data.col2;
    var index = e.currentTarget.dataset.index;
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
        col == 1 ? col1[index].praisepeople[0] = res.data : col2[index].praisepeople[0] = res.data

          if (res.data)
          { col == 1 ? col1[index].praise_num++ : col2[index].praise_num++ }
          else {
            col == 1 ? col1[index].praise_num-- : col2[index].praise_num--
          }
        


        that.setData({
          col1: col1,
          col2: col2,
        })
        wx.hideLoading();
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var personid=options.personid;
  var that=this;
  that.setData({
    personid: personid
  })
  people.getPerson(personid,(res)=>{
    wx.setNavigationBarTitle({
      title:res.nickname+'的主页'
    })
    console.log(res)
    that.setData({
      Person:res,
      
    })
  })



  wx.getSystemInfo({
    success: (res) => {
      let ww = res.windowWidth;
      let wh = res.windowHeight;
      let imgWidth = ww * 0.48;
      let scrollH = wh * 0.86;

      this.setData({
        windowWidth: ww,
        scrollH: scrollH,
        imgWidth: imgWidth,
        pageIndex: 1
      });

      //加载首组图片
      this.loadImages();

    }
  })



  },

  onImageLoad: function (e) {
    var that = this;
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度
    var nowlist = that.data.images;
    let imageObj = null;
    for (let i = 0; i < nowlist.length; i++) {
      let img = nowlist[i];
      if (img.id == imageId) {
        imageObj = img;
        break;
      }
    }


    imageObj.height = imgHeight;
    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;
    let col1H = this.data.col1H;
    let col2H = this.data.col2H;
    //判断当前图片添加到左列还是右列

    if (col1H <= col2H) {
      col1H += (imgHeight + 200);
      col1.push(imageObj);
    } else {
      col2H += (imgHeight + 200);
      col2.push(imageObj);
    }
    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2,
      col1H: col1H,
      col2H: col2H
    };
    // 当前这组图片已加载完毕，则清空图片临时加载区域的内容

    if (!loadingCount) {
      wx.hideLoading()
      data.loadimgs = [];
    }

    this.setData(data);
  },

  loadImages: function () {
    var that = this;
    var isLoadedAll = that.data.isLoadedAll;
    var personid = that.data.personid;
    console.log(isLoadedAll)
    console.log(that.data.loadingCount)
    if (that.data.isLoadedAll || that.data.loadingCount) {
      console.log(555)
      return 0;
    }
    that.setData({
      loadingCount: 1
    })
    console.log(666)
    people.getPersonArticles(that.data.pageIndex, personid, (res) => {
      var newArr = res.data;
      var loadimgs = [];
      if (newArr.length > 0) {
        for (var k in newArr) {
          loadimgs.push({ id: newArr[k].id, pic: newArr[k].items[0].img_url })
        }
        that.setData({
          loadimgs: loadimgs,
          loadingCount: loadimgs.length,
        })
      }
      else {
        that.setData({
          loadimgs: [],
          loadingCount: 0,
          isLoadedAll: true
        })
        wx.hideLoading();
      }
      that.setData({
        pageIndex: ++that.data.pageIndex,
        images: newArr,
      });
    }
    )
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