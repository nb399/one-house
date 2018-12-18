import { Base } from '../../utils/base.js'

class Order extends Base{


  constructor() {
    super();
    this._storageKeyName = 'newOrder';
  }

/*删订单 */
  deleteOrder(param, callback){
    var that = this;
    var allParams = {
      url: 'order/delete_order?OrderId='+param,
   
    
      sCallback: function (data) {
        that.execSetStorageSync(true);
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    this.request(allParams);
  }
  /*下订单*/
  doOrder(param, remarks, callback) {
    var that = this;
    var allParams = {
      url: 'order',
      type: 'post',
      data: { products: param, remarks: remarks },
      sCallback: function (data) {
        that.execSetStorageSync(true);
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    this.request(allParams);
  }


    /*
    * 拉起微信支付
    * params:
    * norderNumber - {int} 订单id
    * return：
    * callback - {obj} 回调方法 ，返回参数 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付成功；
    * */
  execPay(orderNumber, callback) {
    var allParams = {
      url: 'pay/pre_order',
      type: 'post',
      data: { id: orderNumber },
      sCallback: function (data) {
        console.log(data);
        var timeStamp = data.timeStamp;
        if (timeStamp) { //可以支付
          wx.requestPayment({
            'timeStamp': timeStamp.toString(),
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            success: function () {
              callback && callback(2);
              console.log(8)
            },
            fail: function () {
              callback && callback(1);
              console.log(88)
            }
          });
        } 
        else {
          callback && callback(0);
        }
      }
    };
    this.request(allParams);
  }

  /*获得订单的具体内容*/
  getOrderInfoById(id, callback) {
    var that = this;
    var allParams = {
      url: 'order/' + id,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {

      }
    };
    this.request(allParams);
  }

  /*获得所有订单,pageIndex 从1开始*/
  getOrders(pageIndex, callback){

    var allParams = {
      url: 'order/by_user',
      data: { page: pageIndex },
      type: 'get',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(allParams);
    
  }

  /*本地缓存 保存／更新*/
  execSetStorageSync(data) {
    console.log(data);
    wx.setStorageSync(this._storageKeyName, data);
  };

   /*是否有新的订单*/
  hasNewOrder() {
    var flag = wx.getStorageSync(this._storageKeyName);
    return flag == true;
  }

}

export {Order};