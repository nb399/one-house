import {
  Base
} from '../../utils/base.js';

class Home extends Base {
  constructor() {
    super();
  }


  //获取视频
  getVideoData(callback) {
    var params = {
      url: 'video/videolist',
      sCallback: function(res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }
  /**
   * 点赞
   */
  Praise(id, callback) {
    var params = {

      url: 'video/praise?video_id=' + id,
      sCallback: function(res) {
        callback(res);
      }
    }
    this.request(params);
  }
  /**
   * 收藏
   */
  DoCollecte(id, callback) {
    var params = {
      url: 'collection?company_id=' + id,
      sCallback: function(res) {
        callback(res);
      }
    }
    this.request(params);
  }
  /**
   * 获取轮播图
   */
  getBannerData(id, callback) {
    var params = {
      url: 'banner/' + id,
      sCallback: function(res) {
        callback && callback(res.items);
      }
    }
    this.request(params);
  }
  /**
   * 获取分类图
   */
  getcategory(callback) {
    var param = {
      url: 'category',
      sCallback: function(data) {
        callback && callback(data);
      }
    }
    this.request(param);
  }
  /*首页主题*/
  getThemeData(callback) {
    var param = {
      url: 'theme?ids=1,2,3',
      sCallback: function(data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
  /**
   * 获取最近楼盘
   */
  getRecentBuild(callback) {
    var param = {
      url: 'building/getRecentCompany',
      sCallback: function(data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }


}

export {
  Home
};