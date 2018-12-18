import { Base } from '../../utils/base.js';

class oneModel extends Base {
  constructor() {
    super();
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
  getArticleByCompany(company_id, callback){
    var param = {
      url: 'building/getArticleByCompany',
      data: {
        company_id: company_id     //楼盘公司id
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
  getSalersByBuild(build_id,callback){
    var param = {
      url: 'building/getSalersByBuild',
      data: {
        build_id: build_id     //推盘id
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
  getOneDetail(build_id, callback){
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
}
export { oneModel }