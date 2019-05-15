// pages/attention-people/attention-people.js
import {
  Config
} from '../../utils/config.js';
import {
  People
} from 'people-model.js';
import {
  Pbl
} from '../pbl/pbl-model.js';
import { $wuxDialog } from '../../dist/index'
var PBL = new Pbl;
var people = new People;

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
  _previewimg: function(e) {

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
  _look_article: function(e) {

    var article_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article/article?article_id=' + article_id,
    })
  },
  /**
   * 点击关注
   */
  _attention: function(e) {
    var that = this;
    console.log(e)

    var id = e.currentTarget.dataset.id;


    PBL.addAttention(id, (res) => {
      that.setData({
        'Person.watchlist[0]': res
      })
      if (res) {
        // wx.showModal({
        //   title: '关注成功',
        //   content: '您可以在首页底部的关心收到Ta的最新动态，也可在我的关注中进行管理',
        //   showCancel: false,
        //   confirmText: '知道了'
        // })
        $wuxDialog().open({
          resetOnClose: true,
          title: '关注成功',
          content: '您可以在首页底部的关心收到Ta的最新动态，也可在我的关注中进行管理',
          buttons: [
            {
              text: '关闭',
            },{
            text: '去看关心',
            type: 'primary',
            onTap(e) {
              wx.switchTab({
                url: '/pages/attention/attention',
              })
            },
          }
          ],
        })

      } else {
        wx.showToast({
          title: '已取消',
        })
      }

    })
  },
  _goHome() {
    wx.switchTab({
      url: '/pages/pbl/pbl',
    })
  },
  /**
   * 点赞
   */
  _Praise: function(e) {

    var that = this;
    var col = e.currentTarget.dataset.col,
      col1 = that.data.col1,
      col2 = that.data.col2;
    var index = e.currentTarget.dataset.index;
    var article_id = e.currentTarget.dataset.id;

    wx.showLoading({
      title: '点点赞',
    })

    wx.request({
      url: Config.restUrl + '/article/praise?article_id=' + article_id,
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        col == 1 ? col1[index].praisepeople[0] = res.data : col2[index].praisepeople[0] = res.data

        if (res.data) {
          col == 1 ? col1[index].praise_num++ : col2[index].praise_num++
        } else {
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
  onLoad: function(options) {
    var personid = options.personid;
    var that = this;
    that.setData({
      personid: personid
    })
    people.getPerson(personid, (res) => {
      wx.setNavigationBarTitle({
        title: res.isSaler ? res.real_name : res.nickname + '的主页'
      })
      console.log(res)
      if(!res.qrcode){
        people.getQrcode(personid, (data) => {
          console.log(data)
        })
      }
      that.setData({
        Person: res,
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



  loadImages: function() {
    var that = this;
    var isLoadedAll = that.data.isLoadedAll;
    var personid = that.data.personid;
    if (that.data.isLoadedAll) {
      console.log(555)
      return 0;
    }
    people.getPersonArticles(that.data.pageIndex, personid, (res) => {
      var newArr = res.data;
      var loadimgs = [];
      if (newArr.length > 0) {
        that.setCol(newArr);
      } else {
        that.setData({
          loadimgs: [],
          isLoadedAll: true
        })
        wx.hideLoading();
      }
      that.setData({
        pageIndex: ++that.data.pageIndex,
        images: newArr,
      });
    })
  },
  /**
   * 安排col位置（已知图片宽高）
   */
  setCol(datas) {
    var that = this;
    wx.createSelectorQuery().selectAll('.img_item').boundingClientRect(function(rects) {
      console.log(rects)
      let col1 = that.data.col1;
      let col2 = that.data.col2;
      let col1H = rects[0].height;
      let col2H = rects[1].height;
      var newData = datas ? datas : [];
      let imgWidth = that.data.imgWidth; //图片设置的宽度
      for (let i in newData) {
        let opData = newData[i].mainImgUrl.split('_');
        let oImgW = opData[1] ? opData[1] : 300;
        let oImgH = opData[2] ? opData[2] : 400;
        let scale = imgWidth / oImgW; //比例计算
        let imgHeight = oImgH * scale; //自适应高度
        newData[i].height = imgHeight
        if (col1H <= col2H) {
          col1H += newData[i].height;
          col1.push(newData[i]);
        } else {
          col2H += newData[i].height;
          col2.push(newData[i]);
        }
      }
      let data = {
        col1: col1,
        col2: col2
      };
      that.setData(data);
      wx.hideLoading();
    }).exec();

  },
  /**
   * 点击播放视频
   */
  _playVideo(e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.id;
    console.log(this.videoContext)
    if (this.videoContext) {
      this.videoContext.pause();
    }
    this.videoContext = wx.createVideoContext(id);
    this.videoContext.play()
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
  _showContact() {
    var that = this;
    wx.showActionSheet({
      itemList: ['拨打电话', '复制微信号'],
      success(res) {
        if (res.tapIndex == 0) {
          if (that.data.Person.phone == '') {
            wx.showToast({
              title: '没有设置电话号',
              icon: 'none'
            })
          } else {
            wx.makePhoneCall({
              phoneNumber: that.data.Person.phone,
            })
          }
        } else if (res.tapIndex == 1) {

          if (that.data.Person.wxId == '') {
            wx.showToast({
              title: '没有设置微信号',
              icon: 'none'
            })
          } else {
            wx.setClipboardData({
              data: that.data.Person.wxId,
              success(res) {
                    wx.showToast({
                      title: '复制成功',
                    })
              }
            })
          }

        }
      }
    })
  },
  _goCompany(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: '/pages/one-building/one-building?company_id=' + id + '&type=company',
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
    if (!that.data.isLoadedAll) {
      that.loadImages();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    const that = this
    if (res.from === 'button') {
      var current = that.data.Person;
      let title = (current.real_name ? current.real_name : current.nickname) + '这有好多实地跑盘，快来看看'
      return {
        title: title,
        path: '/pages/attention-people/attention-people?personid=' + current.id,
        imageUrl: current.avatarUrl,
        success: function(res) {},
        fail: function(res) {}
      }

    }
    return {
      title: '哪儿也不去，在家看房',
      success: function(res) {},
      fail: function(res) {}
    }
  }
})