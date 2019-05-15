import {
  Base
} from '../../utils/base.js';

class Publish extends Base {
  constructor() {
    super();
  }
  /**
   * 获得热词
   */
  GetWorldlist(callback) {
    var params = {
      url: "search/worldlist?type_id=2",
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }
  /**
   * 搜索楼盘
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
   * 上传文章
   */
  submitArticle(params, callback) {
    var allParams = {
      url: 'addarticle',
      type: 'post',
      data: params,
      sCallback: function(data) {
        callback && callback(data);
      },
      eCallback: function() {}
    };
    this.request(allParams);
  }
};

export {
  Publish
}