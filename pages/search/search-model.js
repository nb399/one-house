
import { Base } from '../../utils/base.js';

class Search extends Base {
  constructor() {
    super();
  }

  GetWorldlist(callback){
    var params={
      url:"search/worldlist?type_id=0",
      sCallback:function(res){
        callback && callback(res);
      }
    }
    this.request(params);
  }
 
  GoToSearch(page,searchType,keyword, callback) {
    var params = {
      url: "search/all?keyword=" + keyword + "&searchType=" + searchType + "&page=" + page,
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }
}



export { Search };