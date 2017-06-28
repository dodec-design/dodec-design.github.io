'use strict';
//-----------------------------------------
// [wow 控制 animate.css的js]
new WOW().init();

//-----------------------------------------
// [WaitMe.js preloading 程式庫]
// $('#preloading_container').waitMe({
// effect : 'facebook',
// text : '蒔二設計',
// bg : 'rgba(255,255,255,0.7)',
// color : '#000',
// maxSize : '40',
// textPos : 'vertical',
// fontSize : '18px',
// source : ''
// });

$("body").waitMe({effect:'orbit',bg: 'linear-gradient(135deg, #fca8d9 0%,#fca8d9 53%,#48b9db 53%,#48b9db 100%)', color:['#ffffff', '#ffffff', '#ffffff'], text: langload.preloading_title });


//-----------------------------------------
//[Hamburber Menu]
//切換漢堡選單狀態等動作
function switchHamburgerStatus(){
  var tg = $(".hamburger");
  if(tg.hasClass('is-active')){
    tg.removeClass('is-active');
    $("#navigation").removeClass('is-active');
    $("body").removeClass('is-active');
  }else{
    tg.addClass('is-active');
    $("#navigation").addClass('is-active');
    $("body").addClass('is-active');
  }
}
$(function(){
  
  $(".hamburger").on('click', function(){
    switchHamburgerStatus();//切換漢堡選單狀態等動作
  });

});

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
//------------------------------------------



$(document).ready(function () {

  //[header 主輪播操作]
  //swiper
  var mySwiper = new Swiper ('.swiper-container', {
    loop: true,
    autoHeight: true,
    autoplay: 4000,
    autoplayDisableOnInteraction: false,
    nextButton: ".right_arrow",
    prevButton: ".left_arrow",
    preloadImages: false,
    lazyLoading: true,
    speed: 750,
    grabCursor: true
  });
  mySwiper.on('slideChangeStart', function (e) {
    //e.previousIndex
    //e.realIndex
    //mySwiper.slides.length-2;
    // console.log((e.previousIndex - e.activeIndex)); // 1 is left, -1 is right
    $('.srt-item').removeClass('on');
    if( (e.previousIndex - e.activeIndex) >0){
      $('.srt-item').eq(e.realIndex).stop().addClass('on').animateCss('fadeInUp');
    }else{
      $('.srt-item').eq(e.realIndex).stop().addClass('on').animateCss('flipInX');
    };
    
  });

  // $(".dedoc_switer").hover(function(){
  //   mySwiper.stopAutoplay();
  // }, function(){
  //   mySwiper.startAutoplay();
  // });

  //檢查Device 尺寸，如果是平板或手機尺寸則部啟用 swiper autoplay
  var isMobileDevice = function () {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  };
  if (isMobileDevice()) {
      mySwiper.stopAutoplay();
  }else{
    mySwiper.startAutoplay();
  }


  //Parallax UI/UX content
  $('.website_host_cdn_center_main').tilt({
      scale: 1
  });

});



//[scroll menu]
//上方固定選單顯示隱藏判斷
var topMenuFixed = 0;
var changeMenuFixCond = function(){
    var height = $(window).scrollTop();

    if(height  >= 300 && topMenuFixed==0) {
        $("#main_nav").addClass('fixed');
        $(".main_nav_option").animateCss('fadeInUp');//header nav項目動畫
        topMenuFixed = 1;
    }else if(height  <= 200 && topMenuFixed==1){
        $(".main_nav_option").removeClass('animated fadeInUp');
        $("#main_nav").removeClass('fixed');
        topMenuFixed = 0;
    }
}
changeMenuFixCond();


//切換側選單按鈕激活狀態
var switchFixSideMenuActive = function(d){
    $(".fix_side_menu_a").removeClass('on');
    $(".fix_side_menu_a").eq(d).addClass('on');
}

//將目前所在的頁範圍標示為鎖定，避免一直呼叫
var setCurrentPageToLock = function(i){
    $.each(sectionObj, function(j){
      sectionObj[j].on = 0;//判斷 1=在範圍內，0=未在範圍內
    });
    //Open Current Page Lock
    sectionObj[i].on = 1;
}

//切換側選單背景顏色狀態
var switchStatusForFixSideMenu = function(k){
  var data = sectionObj[k];
  $("#fix_side_menu").removeClass().addClass('fix_side_menu');
  $("#fix_side_menu").addClass(data.type);
}

//依據側選單狀態移動至所屬區塊
var onAnimatePage = 0;//如果1 表示頁面正在滑動，0則表示無
var startAnimate_and_switchStatus = function(k){
  if(onAnimatePage == 1){ /*console.log('鎖定ING');*/ return; }
  onAnimatePage = 1;//[開啟滑動鎖] 如果1 表示頁面正在滑動，0則表示無
    //TEST
    //console.log('鎖定');
  var data = sectionObj[k];
  switchFixSideMenuActive(k);//切換側選單按鈕激活狀態
  switchStatusForFixSideMenu(k);//切換側選單背景顏色狀態
  $('title').text(sectionObj[k].metatitle);//變更title狀態
  $("html, body").stop().animate({ scrollTop: $(data.tg).offset().top-50 }, 700 ).promise().then(function() {
    /*Called when the animation in total is complete*/
    history.replaceState(undefined, undefined, '#'+sectionObj[k].path);//這種方式會變更URL狀態，不寫入歷史紀錄
    window.location.hash = '#'+sectionObj[k].path;//透過滑動的方式，通常是有點擊或者初次載入，將會透過history push 記錄起來
      // Test History collect status
      // console.log(sectionObj[k].path+' is in history');
    setCurrentPageToLock(k);//鎖定目前所在頁面
    onAnimatePage = 0;//[解除滑動鎖] 如果1 表示頁面正在滑動，0則表示無
      //TEST
      //console.log('解鎖');
  }, function(){
      //TEST
      //console.log('error happened');
  });
}

//init action
var st_init = 0;
//偵測所有section範圍是否抵達
var s_h = 0;
var checkSectionTop = function(){
    s_h = $(window).scrollTop()+($(window).height()/2);
    $.each(sectionObj, function(i){
        if( 
            s_h-$(sectionObj[i].tg).offset().top>0 && 
            s_h-$(sectionObj[i].tg).offset().top < ($(sectionObj[i].tg).height()-sectionObj[i].param) && 
            sectionObj[i].on==0 && //判斷 1=在範圍內，0=未在範圍內
            onAnimatePage==0 //如果1 表示頁面正在滑動，0則表示無
        ){
          //備註，這裡僅會有變動menu狀態的fn。  滑動動畫是放在點擊menu(gotoSection())或初始化時(startAnimate_and_switchStatus())才會呼叫
          switchFixSideMenuActive(i);//切換側選單按鈕激活狀態
          switchStatusForFixSideMenu(i);//切換側選單背景顏色狀態
          //變更網址狀態 URL操作
            //URL TEST
            // var anchor = document.location.hash;
            // $(window).attr('url').replace(anchor, '#'+sectionObj[i].path,'_self');
            // window.location.hash = '#'+sectionObj[i].path;//會透過history push 記錄起來
          history.replaceState(undefined, undefined, '#'+sectionObj[i].path);//一般windows scroll捲動，會用這種方式會變更URL狀態，不寫入歷史紀錄
          setCurrentPageToLock(i);//鎖定目前所在頁面
        }
        //TEST
        // console.log(s_h+','+$(sectionObj[0].tg).offset().top);
    });
}

//Windows scroll過程要呼叫的相關函式
$(window).scroll(function() {
  changeMenuFixCond();//上方固定選單顯示隱藏判斷
  checkSectionTop();//偵測所有section範圍是否抵達
});


//TEST
  //[navigator] Header top menu hover 效果
  // $(".animate-btn").each(function(){
  //     $(this).on('mouseover touchstart', function(){
  //       //bounceIn
  //       console.log('hover');
  //         $(this).animateCss('flipInX');
  //     });
  // });

//===============================================================================
//VUE 區塊
//===============================================================================

//[header>dodec_design_main] 今天日期
  var dodec_today = new Vue({
    el: '#dodec_today',
    data: {
      getdate: {
        month:'00',
        day: '00',
        msg: '--' 
      }
    },
    created: function(){
      this.getdate = this.getDateFn();
      //[test > getHourMsgFn]
      // var i = 0;
      // for(i=0;i<24;i++){
      //   console.log(i+','+this.getHourMsgFn(i));
      // }
    },
    methods: {
      getDateFn: function(){
        var dateObj = new Date();
        var month = dateObj.getMonth() + 1;
        var day = dateObj.getDate();
        var hours = dateObj.getHours();
        var msg = this.getHourMsgFn(hours)+' '+langload.hello;
        var MyMonthString =('0'+month).slice(-2);
        var MyDateString =('0'+day).slice(-2);

         return {month: MyMonthString, day: MyDateString, msg: msg};
      },
      getHourMsgFn: function(hr){
        var msg = '';
        if( (hr>=0 && hr<5) || (hr>=18 && hr<24) ){
          msg = langload.good_night;
        }else if(hr>=5 && hr<11){
          msg = langload.good_morning;
        }else if(hr>=11 && hr<14){
          msg = langload.good_afternoon;
        }else if(hr>=14 && hr<18){
          msg = 'Hi';
        }else{
          msg = 'Hello';
        }
        return msg;
      }
    }
  });



  var mobile_menu = new Vue({
    el: '.nmc_list',
      methods: {
        gotoSection: function(k){
          switchHamburgerStatus();//切換漢堡選單狀態等動作
          startAnimate_and_switchStatus(k);
        }
      }
  })

  var set_container = new Vue({
    el: '.set-container',
      methods: {
        gotoSection: function(k){
          startAnimate_and_switchStatus(k);
        },
        changeEff: function(e){
          $(event.currentTarget).animateCss('flipInX');//透過 $(event.currentTarget) 來取得DOM元素
        }
      }
  });

  var sub_btn_content = new Vue({
    el: '.sub_btn_content',
      methods: {
        gotoSection: function(k){
          // console.log(data.path);
          startAnimate_and_switchStatus(k);
        }
      }
  });

  var continues_main_box = new Vue({
    el: '.continues_main_box',
      methods: {
        gotoSection: function(k){
          startAnimate_and_switchStatus(k);
        }
      }
  });


  var fix_side_menu = new Vue({
      el: '#fix_side_menu',
      data: {
          sectionData:sectionObj
      },
      methods: {
        gotoSection: function(k){
          startAnimate_and_switchStatus(k);
        }
      }
  });


  var production_list = new Vue({
      el: '.website_host_cdn_know_more',
      methods: {
        host_and_domain: function(){
          $.featherlight({
            iframe: 'host_and_domain.html'
          });
        }
      }
  });

  var production_list = new Vue({
      el: '#production_list',
      data: {
        product_items: product_obj,
        img_src:  langload.img_src
      },
      methods: {
        showCase: function(id){
          $.featherlight({
            iframe: 'product_detail.html?parent=1#/id/'+id, 
            beforeOpen: function(){
              // $("body").addClass('fixed');//LIGHTBOX顯示，鎖定頁面卷軸
              $(".featherlight-content").hide();
            },
            afterOpen: function(){
              $(".featherlight-content").fadeIn();
            },
            beforeClose: function(){
              // $("body").removeClass('fixed');//LIGHTBOX關閉，恢復頁面解軸
              $(".featherlight-content").fadeOut();
            }
          });
        }
      }
  });

  var contact_us = new Vue({
    el: '#contact_us',
    methods: {
      isMobileDevice : function(){
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
      },
      contact_us: function(){
         if (this.isMobileDevice()) {
           window.open('contact_us.html?referrer=contact','_self');
         }else{
          $.featherlight({
            iframe: 'contact_us.html', 
            beforeOpen: function(){
              // $("body").addClass('fixed');//LIGHTBOX顯示，鎖定頁面卷軸
              $(".featherlight-content").hide();
            },
            afterOpen: function(){
              $(".featherlight-content").fadeIn();
            },
            beforeClose: function(){
              // $("body").removeClass('fixed');//LIGHTBOX關閉，恢復頁面解軸
              $(".featherlight-content").fadeOut();
            }
          });

         }
      }
    }
  })

  var about_us = new Vue({
      el: '#about_us',
      data: {
          sectionData:sectionObj
      },
      methods: {
        gotoSection: function(k){
          startAnimate_and_switchStatus(k);
        }
      }
  });

//[set Rotuer]
  var router = new VueRouter({
    base: '/',
    routes: [
      { path: '/', redirect: langload.dodec_design_slogan, beforeEnter: function(to, from, next) {
          startAnimate_and_switchStatus(0);
        }
      },
      { path: '/'+langload.dodec_design_slogan, beforeEnter: function(to, from, next) {
          startAnimate_and_switchStatus(0);
        }
      },
      { path: '/rwd',  beforeEnter: function(to, from, next) {
          startAnimate_and_switchStatus(1);
        }
      },
      { path: '/design', beforeEnter: function(to, from, next) {
          startAnimate_and_switchStatus(2);
        }
      },
      { path: '/host', beforeEnter: function(to, from, next) {
          startAnimate_and_switchStatus(3);
        }
      },
      { path: '/planning', beforeEnter: function(to, from, next) {
          startAnimate_and_switchStatus(4);
        }
      },
      { path: '/case', beforeEnter: function(to, from, next) {
          startAnimate_and_switchStatus(5);
        }
      },
      { path: '/case', beforeEnter: function(to, from, next) {
          startAnimate_and_switchStatus(5);
        }
      },
      { path: '/contact', beforeEnter: function(to, from, next) {
          startAnimate_and_switchStatus(6);
        }
      },
      { 
        //if no found will redirect to home top
        //如果找不到對應的路由，會自動導到首頁最上方
        path: "*", 
        redirect: langload.dodec_design_slogan
      }

    ] // 如果是 routes: routes，則可以縮寫成 routers
  });
  var app = new Vue({
    el: '#app',
    router: router
  });
