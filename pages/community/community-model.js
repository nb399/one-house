import {Base} from '../../utils/base.js';

class Community extends Base{
  constructor(){
  super();
}


_GetCategoryImgs(callback){
  var params={
    url:'category/community',
    sCallback:function(res){
      callback && callback(res)
    }
  }
  this.request(params)
}
}

export { Community}