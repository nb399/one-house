
import { Base } from '../../utils/base.js';

class allModel extends Base {
  constructor() {
    super();
  }
  /**
   * 点赞
   */
  Praise(id, callback) {
    var params = {

      url: 'video/praise?video_id=' + id,
      sCallback: function (res) {
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
      url: 'collection?good_id=' + id,
      sCallback: function (res) {
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
      sCallback: function (res) {
        callback && callback(res.items);
      }
    }
    this.request(params);
  }
  /**
   * 
   */
  getbuildsData(build_type_id, area_type_id,page,callback) {
    var param = {
      url: 'building/getBuildings',
      data:{
        build_type_id: build_type_id,
        area_type_id: area_type_id,
        page:page
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
  /**
   * 
   */
  getbuildCompanys(build_type_id, area_type_id, page, callback) {
    var param = {
      url: 'building/getBuildCompanys',
      data: {
        build_type_id: build_type_id,
        area_type_id: area_type_id,
        page: page
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

}

export { allModel };