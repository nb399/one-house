
import { Base } from '../../utils/base.js';

class Search extends Base {
  constructor() {
    super();
  }

  GetWorldlist(callback){
    var params={
      url:"search/worldlist",
      sCallback:function(res){
        callback && callback(res);
      }
    }
    this.request(params);
  }
 
  GoToSearch(keyword, callback) {
    var params = {
      url: "search/all?keyword=" + keyword,
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }
}



export { Search };