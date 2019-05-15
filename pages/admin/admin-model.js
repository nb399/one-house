import {
  Base
} from '../../utils/base.js';

class Admin extends Base {
  constructor() {
    super();
  }
  /**
   * 搜索楼盘公司
   */
  searchBuildCompany(param, callback) {
    var params = {
      url: 'search/getBuildCompanyByName',
      data: param,
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  /**
 * 搜索楼盘
 */
  searchBuilding(param, callback) {
    var params = {
      url: 'search/getBuildByName',
      data: param,
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  uploadFormCompany(params, callback) {
    var allParams = {
      url: 'building/addBuildCompany',
      type: 'post',
      data: params,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () { }
    };
    this.request(allParams);
  } 
  /**
   * 上传文章
   */
  uploadForm(params, callback) {
    var allParams = {
      url: 'building/addBuild',
      type: 'post',
      data: params,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () { }
    };
    this.request(allParams);
  }
};

export {
  Admin
}