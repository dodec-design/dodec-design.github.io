'use strict';


//------------------------------------------

//[Animate.css 擴充]
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

//---------------------------------------------------------------
//[url request query string]
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}
var urlp = $.urlParam('referrer');



//===============================================================================
//VUE 區塊
//===============================================================================
//[contact_us_info]
var Nothing = { template: '<div>Not Founded</div>' };

//[set Rotuer]
  var router = new VueRouter({
    base: '/',
    routes: [
      { path: '/',
      }

    ] // 如果是 routes: routes，則可以縮寫成 routers
  });

  //[TEST]
    // console.log(window.parent);
    // alert(document.referrer);
    // alert(window.location.origin);

  var header = new Vue({
    el: 'header',
    methods: {
      closeThis: function(){
        //檢查是否在iframe中
        var isInIFrame = (window.location != window.parent.location);
        if(isInIFrame){
          $(window.parent.document).find('.featherlight-close').click();
        }else{
          //檢查是否從首頁>聯絡我們連結過來(連結過來 urlp會帶 referrer 參數)
          if(urlp){
            window.open('./#'+urlp,'_self');
          }else{
            window.open('./','_self');
          }
        }
      }
    }
  });

//[歡迎洽詢]
var StartContact = new Vue({
  el: '.contact_service',
  methods: {
    isMobileDevice : function(){
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    },
    contact_us: function(){
      if (this.isMobileDevice()) {
        window.open('contact_us.html?referrer=contact','_blank');
      }else{
        window.open('contact_us.html?referrer=contact','_self');
      }
    }
  }
});

//[HOST DATA]
var StartContact = new Vue({
  el: '#host',
  data: {
    host_info: []
  },
  methods: {
    getData: function(){
      var self = this;
      var spreadsheets_path = 'https://spreadsheets.google.com/feeds/list/1rwBVJnKtXsyieDTm6GamklwRO3ACc1FP_FMPnmsF5D4/1/public/values?alt=json';
      var host_json = $.getJSON(spreadsheets_path,{
        format: "json"
      }).done(function(data){
        var usable_data = [];
        $.each(data.feed.entry,function(i, item){
          usable_data[i] = {
            type: item.gsx$type.$t,
            pricesofyear: (langload.host_unit.money)+item.gsx$pricesofyear.$t,
            pricesofmon: (langload.host_unit.money)+item.gsx$pricesofmon.$t,
            businessemail: item.gsx$businessemail.$t+(langload.host_unit.s),
            diskspace: item.gsx$diskspace.$t,
            datatraffic: item.gsx$datatraffic.$t,
            databasesspace: (item.gsx$databasesspace.$t)==0?(langload.host_unit.no):(item.gsx$databasesspace.$t),
            ftpuser: item.gsx$ftpuser.$t,
            domainlimit: item.gsx$domainlimit.$t,
            firstyearfreedomain: (item.gsx$firstyearfreedomain.$t)==0?(langload.host_unit.no):(item.gsx$firstyearfreedomain.$t),
            withdatabase: (item.gsx$withdatabase.$t)==0?(langload.host_unit.no):(item.gsx$withdatabase.$t),
            application: (item.gsx$application.$t)==0?(langload.host_unit.no):(item.gsx$application.$t)
          };
        });

        //反轉資料結構
        var rerange_data = [];
        var s = 0;
        $.each(langload.host_info_title, function(i, item){
          rerange_data[s] = new Array(usable_data.length);//這裡要用new Array先把物件空間定義出來，後面在一個一個補進
          rerange_data[s][0] = item;//每一個物件，第一個位置都放置標題
          for(var y=0; y<usable_data.length; y++) {
              rerange_data[s][y+1] = usable_data[y][i];
          }
          s++;
        });
        self.host_info = rerange_data;
      });
    }
  }
});


StartContact.getData();