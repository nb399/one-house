// pages/myorder/myorder.js
import { Order } from '../order/order-model.js';
import { My } from '../my/my-model.js';
var order = new Order();
var my = new My();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData: function () {

    // my.getUserInfo((data) => {
    //   this.setData({
    //     userInfo: data
    //   });
    // });

    this._getOrders();
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
    var newOrderFlag = order.hasNewOrder();
    if (newOrderFlag) {
      console.log('onshow');
      this.refresh();
    } 
  },

  refresh: function () {
    var that = this;
    this.data.orderArr = [];  //订单初始化
    that.setData({
      isLoadedAll: false,
      pageIndex: 1
    })
    this._getOrders();

    order.execSetStorageSync(false);  //更新标志位
    ;
  },

  /**
 * 删除未付款订单
 */
  _delete_order: function (e) {
    console.log(e)
    var that = this;
    wx.showModal({
      title: '删除订单',
      content: '确定要删除这个订单吗？？',
      success: function (res) {
        console.log(e.currentTarget.dataset.id);

        if (res.confirm) {
          console.log('用户点击确定')
          var id = e.currentTarget.dataset.id;


          order.deleteOrder(id, (res) => {
            console.log(res)
            that.refresh();
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  _getOrders: function (callback) {
    order.getOrders(this.data.pageIndex, (res) => {
      var data = res.data;
      console.log(res)
      if (data.length > 0) {
        this.data.orderArr.push.apply(this.data.orderArr, data);
        this.setData({
          orderArr: this.data.orderArr
        });
      }
      else {
        this.data.isLoadedAll = true;
      }
      callback && callback();
    })

  },

  onReachBottom: function () {
    console.log(this.data.pageIndex);
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._getOrders();
      //scroll-view
    }
  },

  /*显示订单的具体信息*/
  showOrderDetailInfo: function (event) {

    var id = order.getDataSet(event, 'id');
    console.log(id);
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    });
  },

  rePay: function (event) {
    var id = order.getDataSet(event, 'id'),
      index = order.getDataSet(event, 'index');
    this._execPay(id, index);
  },

  _execPay: function (id, index) {
    var that = this;

    order.execPay(id, (statusCode) => {

      if (statusCode > 0) {
        var flag = statusCode == 2;

        //更新订单显示状态
        if (flag) {
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          });
        }

        //跳转到 成功页面
        wx.reLaunch({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
        });
      }

      else {
        that.showTips('支付失败', '商品已下架或库存不足');
      }

    });
  },

  /*
 * 提示窗口
 * params:
 * title - {string}标题
 * content - {string}内容
 * flag - {bool}是否跳转到 "我的页面"
 */
  showTips: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {

      }
    });
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