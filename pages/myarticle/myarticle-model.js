import { Base } from '../../utils/base.js'

class Article extends Base {
  constructor() {
    super();
  }
/**
 * 获的相关推荐
 */
  relationlist(articleType,callback){
    var params = {
      url: "article/relationlist?type=" + articleType,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(params)
  }
  /**
   * 获取评论
   */
  getCommentlist(article_id, callback) {
      var params = {
        url: "commentlist/" + article_id,
        sCallback: function (data) {
          callback && callback(data);
        }
      };
      this.request(params)
  }
/**
 * 获取文章
 */
  getArticle(article_id, callback) {
    var params = {
      url: "article/all?article_id=" + article_id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(params)
  }
  /**
   * 获取视频
   */
  getVideo(article_id,callback){
    var params={
      url: "video/onevideo?video_id=" + article_id,     
      sCallback:function(data){
        callback&&callback(data);
      }
    };
    this.request(params)
  }
  /**
 * 获取文章列表
 */
  getAllArticles(pageIndex, tabIndex,callback) {

    var allParams = {
      url: 'article/all',
      data: { page: pageIndex, article_id: 'list', tabIndex: tabIndex},
      type: 'get',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(allParams);

  }
/**
 * 获取用户文章列表
 */
  getArticles(pageIndex, callback) {

    var allParams = {
      url: 'article/by_user',
      data: { page: pageIndex },
      type: 'get',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(allParams);

  }

  deleteArticle(id, callback){
    var allParams = {
      url: 'article/delete_article',
      data: { id:id },
      type: 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(allParams);

  }
}
export { Article };
