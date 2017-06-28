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

  var app = new Vue({
    el: '#app',
    router: router,
    methods: {
      submitForm: function(event){
        if(this.checkForm()==false){return;};
        event.preventDefault();
        var str = $("#ss-form").serialize();
        var url = "https://docs.google.com/forms/d/e/1FAIpQLSdUzH4UyohVpgM9isnsOUx0n2vCVlRUPSaCs_2-BbyAkL4AtA/formResponse";
        $.post( url, str);
        $("#ss-form").text('');
        $(".finished").fadeIn();
      },
      checkForm: function(){
        return true;
      }
    }
  });
