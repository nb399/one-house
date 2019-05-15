import { Base } from '../../utils/base.js';

class oneModel extends Base {
  constructor() {
    super();
  }
  /**
 * 收藏
 */
  DoCollecte(id, callback) {
    var params = {
      url: 'collection?company_id=' + id,
      sCallback: function (res) {
        callback(res);
      }
    }
    this.request(params);
  }
  /**
   * 点赞或取消
   */
  clickLove(article_id, callback) {
    var param = {
      url: 'article/praise?article_id=' + article_id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);

  }
  /**
   * 获取跑盘
   */
  getArticleByCompany(company_id,page,callback){
    var param = {
      url: 'building/getArticleByCompany',
      data: {
        company_id: company_id,     //楼盘公司id
        page:page
      },
      sCallback: function (data) {
        console.log(data)
        callback && callback(data);
      }
    };
    this.request(param);
  }
  /**
   * 获取开盘记录
   */
  getBuildEver(company_id, callback){
    var param = {
      url: 'building/getBuildEver',
      data: {
        company_id: company_id     //推盘id
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
  /**
   * 获取置业顾问
   */
  getSalersByCompany(company_id,callback){
    var param = {
      url: 'building/getSalersByCompany',
      data: {
        company_id: company_id     //推盘id
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
  /**
   * 获取楼盘详情
   */
  getOneDetail(build_id, callback) {
    var param = {
      url: 'building/getBuildDetail',
      data: {
        build_id: build_id
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
  /**
   * 获取楼盘详情
   */
getOneCompany(company_id,callback){
  var param = {
    url: 'building/getOneCompany',
    data: {
      company_id: company_id
    },
    sCallback: function (data) {
      callback && callback(data);
    }
  };
  this.request(param);
}
}
export { oneModel }