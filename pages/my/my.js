
import { Address } from '../../utils/address.js';

import { My } from '../my/my-model.js';

var address = new Address();

var my = new My();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
  },

  onShow:function(){
    
  },



  _getAddressInfo: function () {

    address.getAddress((addressInfo) => {
      this._bindAddressInfo(addressInfo);
    });

  },

  /*绑定地址信息*/
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  _loadData: function () {

    my.getUserInfo((data) => {
      this.setData({
        userInfo: data
      });
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

  editAddress: function (event) {
    console.log(event)
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res);
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }

        that._bindAddressInfo(addressInfo);

        //保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败！');
          }
        });
      },
      fail:function(res){
        console.log(res)
      }
    })
  }




})