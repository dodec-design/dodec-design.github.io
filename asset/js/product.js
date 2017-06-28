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
// $.urlParam = function(name){
//     var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
//     if (results==null){
//        return null;
//     }
//     else{
//        return decodeURI(results[1]) || 0;
//     }
// }
// var urlp = $.urlParam('parent');



//===============================================================================
//VUE 區塊
//===============================================================================


var PageNotFound = {
    template: "\
    <div>\
      <div class='main' style='background-image:url(asset/img/website_ux_ui_bg.jpg)'>\
        <h1>{{langload.not_found.title}}</h1>\
        <div class='description'>\
          <p>{{langload.not_found.descript}}</p>\
        </div>\
        <div class='cta' >\
            <a @click='header.closeThis()'>{{langload.link_txt}} ></a>\
        </div>\
      </div>\
      <div class='main_img'>\
        <img :src='\"asset/img/404.png\"' />\
      </div>\
    </div>\
    "};

//[product_info]
var product_info = { template: "\
    <div v-if='product_obj[this.$route.params.id]!=undefined'>\
      <div class='main' :style='{backgroundImage : \"url(asset/img/product/\"+product_obj[$route.params.id].img_fil+product_obj[$route.params.id].detail_img_bg+\")\"}'>\
        <h1>{{ product_obj[$route.params.id].title }}</h1>\
        <div class='description'>\
          <p>{{ product_obj[$route.params.id].detail_intro }}</p>\
        </div>\
        <div class='cta' >\
            <a v-show='product_obj[$route.params.id].website' :href='product_obj[$route.params.id].website' target='_blank'>{{langload.link_txt}} ></a>\
        </div>\
      </div>\
      <div class='main_img'>\
        <img :src='\"asset/img/product/\"+product_obj[$route.params.id].img_fil+product_obj[$route.params.id].detail_img_case' />\
      </div>\
    </div>\
    <div v-else>\
      <div class='main' style='background-image:url(asset/img/website_ux_ui_bg.jpg)'>\
        <h1>{{langload.not_found.title}}</h1>\
        <div class='description'>\
          <p>{{langload.not_found.descript}}</p>\
        </div>\
        <div class='cta' >\
            <a  @click='header.closeThis()'>{{langload.link_txt}} ></a>\
        </div>\
      </div>\
      <div class='main_img'>\
        <img :src='\"asset/img/404.png\"' />\
      </div>\
    </div>\
    ",
    watch: {
    //watch router change, will recreate service list and meta title
    //這裡會監聽router param改變時的狀態，並且重新建立服務項目及meta title
       $route: function(to, from){
         app.createServiceList(to.params.id);
      }
    }
  };
var p_id = '';

//[服務項目 service content]
var Service_content = new Vue({
  el: '.service_content',
  data: {
      service_list_item: '',
      service_option: langload.service_option,
  },
  methods: {
    service_list: function(id){
      this.service_list_item = product_obj[id].service;
    }
  },
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


//[set Rotuer]
  var router = new VueRouter({
    base: '/',
    routes: [
      { path: '/',
        component: PageNotFound
      },
      { 
        path: '/id/:id', 
        component: product_info
      },
      { 
        path: "*", 
        component: PageNotFound
      }

    ] // 如果是 routes: routes，則可以縮寫成 routers
  });

  var header = new Vue({
    el: 'header',
    methods: {
      closeThis: function(){
        //檢查是否在iframe中
        var isInIFrame = (window.location != window.parent.location);
        if(isInIFrame){
          $(window.parent.document).find('.featherlight-close').click();
        }else{
          window.open('./','_self');
        }
      }
    }
  });

  var app = new Vue({
    el: '#app',
    router: router,
    created: function () {
      this.createServiceList(this.$route.params.id);
    },
    methods: {
      createServiceList: function(i){
        if(product_obj[i]!==undefined){
          $("title").text(langload.product_introduction+product_obj[i].title+' | '+langload.dodec_design_slogan);
          Service_content.service_list(i);
        }
      }
    }
  });
