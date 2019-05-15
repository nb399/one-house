import { Base } from '../../utils/base.js';

class People extends Base {
  constructor() {
    super();
  }
  getQrcode(personid, callback) {
    var param = {
      url: 'person/getQrcode?personid=' + personid,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  getPerson(personid,callback){
    var param = {
      url: 'person/getPerson?personid=' + personid,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  getPersonArticles(pageIndex,personid, callback) {
    var param = {
      url: 'person/getPersonArticles?personid=' + personid+'&page='+pageIndex,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }


};

export { People }