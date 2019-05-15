import {
  Pbl
} from 'pbl-model.js'
import {
  Article
} from '../myarticle/myarticle-model.js';
var article = new Article;
var PBL = new Pbl;
var app = getApp();

Page({ 

  data: {
    haveTips: true,
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
    isLoadedAll: false,
    col2H: 0,
    topTow: ['关注', '广场'],
    tabIndex: 2,
    topTowIndex: '广场',
    reload: false,
    userinfo: app.userInfo

  },
  /**
   * 点击Tips
   */
  _clickTips: function(e) {
    this.setData({
      haveTips: true
    })
    wx.setStorage({
      key: 'haveTips',
      data: true,
    })
  },
  /**
   * 播放语音
   */
  _PlayRecorder: function(e) {
    var that = this;


    if (that.data.playing) {
      if (this.innerAudioContext.src == e.currentTarget.dataset.url) {

        return 0;
      } else {
        this.innerAudioContext.stop()

      }
    }

    that.setData({
      playing: true,
      soundImg: '/imgs/icon/getrecorder.gif',
      soundTips: '- 获取中 -'
    })
    this.innerAudioContext = wx.createInnerAudioContext()

    this.innerAudioContext.src = e.currentTarget.dataset.url;
    this.innerAudioContext.play();
    this.innerAudioContext.onPlay(() => {

      that.setData({
        playing: true,
        soundImg: '/imgs/icon/sound.gif',
        soundTips: '- 播放中 -'
      })

    })
    this.innerAudioContext.onCanplay((res) => {})
    this.innerAudioContext.onStop((res) => {})
    this.innerAudioContext.onError((res) => {
      switch (res.errCode) {
        case 10004:
          wx.showToast({
            title: '音频损失',
            icon: 'none'
          });
          break;
        case 10002:
          wx.showToast({
            title: '网络错误'
          });
          break;
        default:
          wx.showToast({
            title: '网络出错'
          });
      }
    })
    this.innerAudioContext.onEnded((res) => {

      that.setData({
        playing: false
      })
      wx.hideToast()
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
      complete: function(res) {

      }
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
   * 点击前往发布
   */
  _writetie: function() {
    wx.switchTab({
      url: '../publish/publish',
    })
  },
  /**
   * 切换顶部关注广场
   */
  _changeTopTow: function(e) {

    var that = this;
    var topTowIndex = e.currentTarget.dataset.toptowindex;
    that.setData({
      topTowIndex: topTowIndex,
    })
    if (topTowIndex == '关注') {
      //加载关注内容
      that.setData({
        attentionArticleList: [],
        attentionPage: 1
      })



      that.loadAttention();
    }
  },


  /**
   * 切换分类
   */
  _changeTab: function(e) {

    var that = this;
    var tabIndex = e.currentTarget.dataset.tabindex;
    wx.showLoading({
      title: '正在加载',
    })
    that.setData({
      reload: false,
      tabIndex: tabIndex,
      pageIndex: 1,
      articleArr: [],
      loadingCount: 0,
      images: [],
      col1: [],
      col2: [],
      col1H: 0,
      col2H: 0,
      isLoadedAll: false,
      loadimgs: []
    })
    that.loadImages();
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
    var AAList = that.data.attentionArticleList;
    if (col == 1 ? !col1[index].praisepeople[0] : !col2[index].praisepeople[0])
      // wx.showToast({
      //   title: '点点赞',
      //   mask: true,

      // })
      PBL.clickLove(article_id, (res) => {
        if (col) {
          col == 1 ? col1[index].praisepeople[0] = res : col2[index].praisepeople[0] = res
          if (res) {
            col == 1 ? col1[index].praise_num++ : col2[index].praise_num++
          } else {
            col == 1 ? col1[index].praise_num-- : col2[index].praise_num--
          }
        } else {
          res ? AAList[index].praise_num++ : AAList[index].praise_num--;
          AAList[index].praisepeople[0] = res
        }


        that.setData({
          col1: col1,
          col2: col2,
          attentionArticleList: AAList
        })


      })

  },

  onHide: function() {
    var that = this;
    if (that.videoContext) {
      that.videoContext.pause();
    }
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
      this.innerAudioContext.onStop((res) => {

        that.setData({
          playing: false
        })
      })
    }

  },
  aa() {
    return arguments;
  },
  onLoad: function() {
    var that = this;
    var a = [1, 22, 3, 4]
    var b = ['q', 'w', 'r']

    console.log(a.sort(function(n1, n2) {
      return n1 - n2
    }))
    app.verify().then(res => {
      if (!res) {
        return 0;
      }
      console.log(res)
      wx.getSystemInfo({
        success: (res) => {
          let ww = res.windowWidth;
          let wh = res.windowHeight;
          let imgWidth = ww * 0.48;
          let scrollH = wh * 0.9;

          that.setData({
            screenHeight: res.screenHeight,
            windowHeight: wh,
            windowWidth: ww,
            scrollH: scrollH,
            imgWidth: imgWidth,
            pageIndex: 1
          });


          wx.showLoading({
            title: '正在加载',
          })
          //获取分类
          that._getCategory();
          
          if (that.videoContext) {
            that.videoContext.pause();
          }
          if (this.innerAudioContext) {
            this.innerAudioContext.stop();
            this.innerAudioContext.onStop((res) => {

              that.setData({
                playing: false
              })
            })
          }
        }
      })
    }, res => {
      console.log(res)
    });

  },
  /**
   * 获取分类
   */
  _getCategory: function(e) {
    var that = this;
    var category = wx.getStorageSync('category')
    if (!category) {
      PBL.getCategory((res) => {
        wx.setStorageSync('category', res.slice(0, 8))
        that.setData({
          category: res.slice(0, 8),
          haveTips: wx.getStorageSync('haveTips') ? true : false
        })
        //加载首组图片
        that.loadImages();


      })
    } else {
      that.setData({
        category: category
      })
      //加载首组图片
      that.loadImages();
    }




  },
  /**
   * 点击改变分类
   */
  changeCategory: function() {
    var that = this;
    that.setData({
      showCategory: that.data.showCategory ? false : true
    })
    PBL.getCategory((res) => {

      var myCategory = that.data.category;
      var otherCategory = res;

      for (var i in otherCategory) {
        for (var j in myCategory) {
          if (myCategory[j].id == otherCategory[i].id) {
            otherCategory.splice(i, 1);
            continue;
          }
        }
      }

      that.setData({
        otherCategory: otherCategory
      })

    })

  },
  /**
   * 删除标签
   */
  _deleteMark: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;

    wx.showModal({
      title: '提示',
      content: '是否确定删除此标签',
      success: function(res) {
        if (res.confirm) {

          var otherCategory = that.data.otherCategory
          otherCategory.push(that.data.category[index])
          var category = that.data.category
          category.splice(index, 1)
          that.setData({
            otherCategory: otherCategory,
            category: category
          })
          wx.setStorageSync('category', category)
        }

      }
    })
  },
  /**
   * 增加标签
   */
  _chooseMark: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;

    wx.showModal({
      title: '提示',
      content: '是否确定添加此标签',
      success: function(res) {
        if (res.confirm) {
          var category = that.data.category
          category.push(that.data.otherCategory[index])
          var otherCategory = that.data.otherCategory
          otherCategory.splice(index, 1)
          that.setData({
            otherCategory: otherCategory,
            category: category
          })
          wx.setStorageSync('category', category)
        }

      }
    })

  },
  /**
   * 点击关注
   */
  _attention: function(e) {
    var that = this;


    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;

    PBL.addAttention(id, (res) => {
      var recommendedList = that.data.recommendedList;


      recommendedList[index].attentioned = res
      that.setData({
        recommendedList: recommendedList
      })
    })
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    var that = this;

    if ((that.data.topTowIndex == '关注')) {
      that.setData({
        attentionArticleList: [],
        recommendedList: [],
        attentionPage: 1
      })
      that.loadAttention();
    } else if (that.data.topTowIndex == '广场' && !that.data.loadingCount) {

      that.setData({
        reload: true,
        tabIndex: that.data.tabIndex,
        pageIndex: 1,
        loadingCount: 0,
        images: [],
        col1: [],
        col2: [],
        col1H: 0,
        col2H: 0,
        isLoadedAll: false
      })
      that.loadImages();
    }
    wx.stopPullDownRefresh()
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (!that.data.isLoadedAll) {
      that.loadImages();
    }
  },
  /**
   * 加载关注内容
   */
  loadAttention: function(e) {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var page = that.data.attentionPage;
    PBL.attentionlist((res) => {
      that.setData({
        attentionlist: res
      })
    })
    PBL.attentionArticles(uid, page, (res) => {

      var newArr = res.data;

      var newAttention = that.data.attentionArticleList;
      newAttention.push.apply(newAttention, newArr);

      that.setData({
        attentionArticleList: newAttention
      })

    })



    PBL.recommendedList(uid, (res) => {
      that.setData({
        recommendedList: res
      })
    })
  },
  _TTTTT: function(e) {

    let loadingCount = this.data.loadingCount - 1;
    let data = {
      loadingCount: loadingCount,
    }
    if (!loadingCount) {
      wx.hideLoading()
      data.loadimgs = [];
    }

    this.setData(data);
  },
  onImageLoad: function(e) {
    var that = this;
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度
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

  loadImages: function() {
    var that = this;
    var tabIndex = that.data.category[that.data.tabIndex].id;
    article.getAllArticles(this.data.pageIndex, tabIndex, (res) => {
      var newArr = res.data;
      var loadimgs = [];
      if (newArr.length > 0) {
        // for (var k in newArr) {
        //   loadimgs.push({ id: newArr[k].id, pic: newArr[k].mainImgUrl })
        // }
        // that.setData({
        //   loadimgs: loadimgs,
        //   loadingCount: loadimgs.length,
        // })
        that.setCol(newArr);

      } else {
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
    if (this.videoContext) {
      this.videoContext.pause();
    }
    this.videoContext = wx.createVideoContext(id);

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {

    var imageUrl = e.target.dataset.item
    return {
      title: e.target.dataset.item.content.substr(0, 16) + '...',
      path: '/pages/article/article?article_id=' + e.target.dataset.id,
      imageUrl: imageUrl ? imageUrl.mainImgUrl : '',
      success: function(res) {
        wx.showToast({
          image: '/imgs/icon/pay@success.png',
          title: '转发成功',
        })
        var param = {
          type: 'article',
          id: e.target.dataset.id
        }
        article.forward(param, (res) => {

        })

      },
      fail: function(res) {
        wx.showToast({
          image: '/imgs/icon/pay@error.png',
          title: '转发失败',
        })
      }
    }
  },
  /**
   * 转发
   */
  _Forward: function(e) {

  }


})