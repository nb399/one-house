
import { Base } from '../../utils/base.js';

class CoWrite extends Base {
  constructor() {
    super();
  }


  //获取视频
  getRichData(article_id,callback) {
    console.log(666)
    var params = {
      url: 'video/onevideo?video_id='+article_id,
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }
}

export { CoWrite };