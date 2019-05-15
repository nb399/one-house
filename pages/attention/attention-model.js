import { Base } from '../../utils/base.js';

class Attention extends Base {
  constructor() {
    super();
  }
  clickLove(article_id, callback) {
    var param = {
      url: 'article/praise?article_id=' + article_id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);

  }
  addAttention(id, callback) {
    var param = {
      url: 'attention/addAttention?id=' + id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  } attentionArticles(uid, page, callback) {
    var param = {
      url: 'attention/attentionArticles?uid=' + uid + '&page=' + page,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
  recommendedList(uid, callback) {
    var param = {
      url: 'attention/recommendedList?uid=' + uid,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
  attentionlist(callback) {
    var param = {
      url: 'attention/attentionList',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
}
export {Attention}