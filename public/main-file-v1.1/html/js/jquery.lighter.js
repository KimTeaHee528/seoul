// Generated by CoffeeScript 1.9.3

/*
jQuery Lighter
Copyright 2015 Kevin Sylvestre
1.3.4
 */
(function() {
  "use strict";
  var $, Animation, Lighter, Slide,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  Animation = (function() {
    function Animation() {}

    Animation.transitions = {
      "webkitTransition": "webkitTransitionEnd",
      "mozTransition": "mozTransitionEnd",
      "oTransition": "oTransitionEnd",
      "transition": "transitionend"
    };

    Animation.transition = function($el) {
      var el, i, len, ref, result, type;
      for (i = 0, len = $el.length; i < len; i++) {
        el = $el[i];
        ref = this.transitions;
        for (type in ref) {
          result = ref[type];
          if (el.style[type] != null) {
            return result;
          }
        }
      }
    };

    Animation.execute = function($el, callback) {
      var transition;
      transition = this.transition($el);
      if (transition != null) {
        return $el.one(transition, callback);
      } else {
        return callback();
      }
    };

    return Animation;

  })();

  Slide = (function() {
    function Slide(url) {
      this.url = url;
    }

    Slide.prototype.type = function() {
      switch (false) {
        case !this.url.match(/\.(webp|jpeg|jpg|jpe|gif|png|bmp)$/i):
          return 'image';
        default:
          return 'unknown';
      }
    };

    Slide.prototype.preload = function(callback) {
      var image;
      image = new Image();
      image.src = this.url;
      return image.onload = (function(_this) {
        return function() {
          _this.dimensions = {
            width: image.width,
            height: image.height
          };
          return callback(_this);
        };
      })(this);
    };

    Slide.prototype.$content = function() {
      return $("<img />").attr({
        src: this.url
      });
    };

    return Slide;

  })();

  Lighter = (function() {
    Lighter.namespace = "lighter";

    Lighter.prototype.defaults = {
      loading: '#{Lighter.namespace}-loading',
      fetched: '#{Lighter.namespace}-fetched',
      padding: 40,
      dimensions: {
        width: 480,
        height: 480
      },
      template: "<div class='" + Lighter.namespace + " " + Lighter.namespace + "-fade'>\n  <div class='" + Lighter.namespace + "-container'>\n    <span class='" + Lighter.namespace + "-content'></span>\n    <a class='" + Lighter.namespace + "-close'>&times;</a>\n    <a class='" + Lighter.namespace + "-prev'>&lsaquo;</a>\n    <a class='" + Lighter.namespace + "-next'>&rsaquo;</a>\n  </div>\n  <div class='" + Lighter.namespace + "-spinner'>\n    <div class='" + Lighter.namespace + "-dot'></div>\n    <div class='" + Lighter.namespace + "-dot'></div>\n    <div class='" + Lighter.namespace + "-dot'></div>\n  </div>\n  <div class='" + Lighter.namespace + "-overlay'></div>\n</div>"
    };

    Lighter.lighter = function($target, options) {
      var data;
      if (options == null) {
        options = {};
      }
      data = $target.data('_lighter');
      if (!data) {
        $target.data('_lighter', data = new Lighter($target, options));
      }
      return data;
    };

    Lighter.prototype.$ = function(selector) {
      return this.$el.find(selector);
    };

    function Lighter($target, settings) {
      if (settings == null) {
        settings = {};
      }
      this.show = bind(this.show, this);
      this.hide = bind(this.hide, this);
      this.observe = bind(this.observe, this);
      this.keyup = bind(this.keyup, this);
      this.size = bind(this.size, this);
      this.align = bind(this.align, this);
      this.process = bind(this.process, this);
      this.resize = bind(this.resize, this);
      this.type = bind(this.type, this);
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.close = bind(this.close, this);
      this.$ = bind(this.$, this);
      this.$target = $target;
      this.settings = $.extend({}, this.defaults, settings);
      this.$el = $(this.settings.template);
      this.$overlay = this.$("." + Lighter.namespace + "-overlay");
      this.$content = this.$("." + Lighter.namespace + "-content");
      this.$container = this.$("." + Lighter.namespace + "-container");
      this.$close = this.$("." + Lighter.namespace + "-close");
      this.$prev = this.$("." + Lighter.namespace + "-prev");
      this.$next = this.$("." + Lighter.namespace + "-next");
      this.$body = this.$("." + Lighter.namespace + "-body");
      this.dimensions = this.settings.dimensions;
      this.process();
    }

    Lighter.prototype.close = function(event) {
      if (event != null) {
        event.preventDefault();
      }
      if (event != null) {
        event.stopPropagation();
      }
      return this.hide();
    };

    Lighter.prototype.next = function(event) {
      if (event != null) {
        event.preventDefault();
      }
      return event != null ? event.stopPropagation() : void 0;
    };

    Lighter.prototype.prev = function() {
      if (typeof event !== "undefined" && event !== null) {
        event.preventDefault();
      }
      return typeof event !== "undefined" && event !== null ? event.stopPropagation() : void 0;
    };

    Lighter.prototype.type = function(href) {
      if (href == null) {
        href = this.href();
      }
      return this.settings.type || (this.href().match(/\.(webp|jpeg|jpg|jpe|gif|png|bmp)$/i) ? "image" : void 0);
    };

    Lighter.prototype.resize = function(dimensions) {
      this.dimensions = dimensions;
      return this.align();
    };

    Lighter.prototype.process = function() {
      var fetched, loading;
      fetched = (function(_this) {
        return function() {
          return _this.$el.removeClass(Lighter.namespace + "-loading").addClass(Lighter.namespace + "-fetched");
        };
      })(this);
      loading = (function(_this) {
        return function() {
          return _this.$el.removeClass(Lighter.namespace + "-fetched").addClass(Lighter.namespace + "-loading");
        };
      })(this);
      this.slide = new Slide(this.$target.attr("href"));
      loading();
      return this.slide.preload((function(_this) {
        return function(slide) {
          _this.resize(slide.dimensions);
          _this.$content.html(_this.slide.$content());
          return fetched();
        };
      })(this));
    };

    Lighter.prototype.align = function() {
      var size;
      size = this.size();
      return this.$container.css({
        width: size.width,
        height: size.height,
        margin: "-" + (size.height / 2) + "px -" + (size.width / 2) + "px"
      });
    };

    Lighter.prototype.size = function() {
      var ratio;
      ratio = Math.max(this.dimensions.height / ($(window).height() - this.settings.padding), this.dimensions.width / ($(window).width() - this.settings.padding));
      return {
        width: ratio > 1.0 ? Math.round(this.dimensions.width / ratio) : this.dimensions.width,
        height: ratio > 1.0 ? Math.round(this.dimensions.height / ratio) : this.dimensions.height
      };
    };

    Lighter.prototype.keyup = function(event) {
      if (event.target.form != null) {
        return;
      }
      if (event.which === 27) {
        this.close();
      }
      if (event.which === 37) {
        this.prev();
      }
      if (event.which === 39) {
        return this.next();
      }
    };

    Lighter.prototype.observe = function(method) {
      if (method == null) {
        method = 'on';
      }
      $(window)[method]("resize", this.align);
      $(document)[method]("keyup", this.keyup);
      this.$overlay[method]("click", this.close);
      this.$close[method]("click", this.close);
      this.$next[method]("click", this.next);
      return this.$prev[method]("click", this.prev);
    };

    Lighter.prototype.hide = function() {
      var alpha, omega;
      alpha = (function(_this) {
        return function() {
          return _this.observe('off');
        };
      })(this);
      omega = (function(_this) {
        return function() {
          return _this.$el.remove();
        };
      })(this);
      alpha();
      this.$el.position();
      this.$el.addClass(Lighter.namespace + "-fade");
      return Animation.execute(this.$el, omega);
    };

    Lighter.prototype.show = function() {
      var alpha, omega;
      omega = (function(_this) {
        return function() {
          return _this.observe('on');
        };
      })(this);
      alpha = (function(_this) {
        return function() {
          return $(document.body).append(_this.$el);
        };
      })(this);
      alpha();
      this.$el.position();
      this.$el.removeClass(Lighter.namespace + "-fade");
      return Animation.execute(this.$el, omega);
    };

    return Lighter;

  })();
  
  
//=========이메일 추가===========
$(function(){
$("#email-box").hide();
$("#email-box2").show();
$("#email-sel").change(function() {
//직접입력을 누를 때 나타남
		if($("#email-sel").val() == "type") {
			$("#email-box").show();
            $("#email-box2").hide();
		}  else {
			$("#email-box").hide();
			$("#email-box2").show();
		}
	}) 
});
//=======쿠폰 항목 추가 삭제============
$(function(){
var noc = 1;
  $("#cupon_add").click(function(){
     var html = '<div>'
     +'<input type="text" id="cupon_num_6" value="" placeholder="쿠폰입력">'
     +'<button type="submit" id="cupon_del_6" class="btn btn-small btn-dark">삭제 -</button>'
     +'</div>'; //tr, td를 열고 + 문자열로 바꾸고 +td 닫기
     $("#cupon_reg").append(html);
     noc +=1;
  });
  $("#cupon_reg").on("click", ".btn", function() {
	if(noc>1){
	    $(this).parent().remove();
	     noc -=1;
	}else {
		$(this).parent().remove();
	     var html = '<div>'
	     +'<input type="text" id="cupon_num_6" value="" placeholder="쿠폰입력">'
	     +'<button type="submit" id="cupon_del_6" class="btn btn-small btn-dark">삭제 -</button>'
	     +'</div>'; //tr, td를 열고 + 문자열로 바꾸고 +td 닫기
	     $("#cupon_reg").append(html);
	}
  });  
})
//==========비밀번호 일치 확인===========
 $('.pw').keyup(function () {
    var pwd1 = $("#pw").val();
    var pwd2 = $("#pw_re").val();
    if ( pwd1 == '' || pwd2 == '' ) {
			$(".pwl").css("color","black");
			$(".pw").css("border-color","black");
			$('#pwchid').text("*비밀번호");
			$('#pwchid').text("*비밀번호 확인");
    } else if (pwd1 != "" && pwd2 != "") {
        if (pwd1 == pwd2) {
			$(".pw").css("border-color","black");
			$(".pwl").css("color","black");
			$('#pwchid').text("*비밀번호 일치");
        } else {
			$(".pw").css("border-color","red");
			$(".pwl").css("color","red");
			$('#pwchid').text("*비밀번호 불일치");
        }
    }
 });
 $('.pw').focusout(function () {
    var pwd1 = $("#pw").val();
    var pwd2 = $("#pw_re").val();
    if ( pwd1 == '' || pwd2 == '' ) {
			$(".pwl").css("color","black");
			$(".pw").css("border-color","black");
			$('#pwchid').text("*비밀번호");
			$('#pwchid').text("*비밀번호 확인");
    } else if (pwd1 != "" && pwd2 != "") {
        if (pwd1 == pwd2) {
			$(".pw").css("border-color","black");
			$(".pwl").css("color","black");
			$('#pwchid').text("*비밀번호 일치");
        } else {
			$(".pw").css("border-color","red");
			$(".pwl").css("color","red");
			$('#pwchid').text("*비밀번호 불일치");
        }
    }
 });
 
// ==================가입완료 누를때==================
 $("#submit_btn").click(function () {
	
    var v1 = $("#user_name").val();
    var v2 = $("#user_id").val();
    var v3 = $("#email_id").val();
    var v4 = $("#email-sel").val();
    var v5 = $("#pw").val();
    var v6 = $("#pw_re").val();
    var v7 = $("#tell").val();
    var v8 = $("#gender").val();
    var v9 = $("#zip").val();
    var v10 = $("#add").val();
    var v11 = $("#add_detail").val();
    var v12 = $("#dob").val();
//    if ( v1 == '' || v2 == '' || v3 == '' || v4 == '' || v5 == '' || v6 == '' || v7 == '' || v8 == '' || v9 == '' || v10 == '' || v11 == '' || v12 == '' || v5 == v6) {
    if ( v1 == '' || v2 == '' || v3 == '' || v4 == '' || v5 == '' || v6 == '' || v7 == '' || v8 == '' || v9 == '' || v10 == '' || v11 == '' || v12 == '' || v5 != v6) {
			alert('잘보세요 \n v1 : ' + v1 + '\n v2 : ' + v2 + '\n v3 : ' + v3 + '\n v4 : ' + v4 + '\n v5 : ' + v5 + '\n v6 : ' + v6 + '\n v7 : ' + v7 + '\n v8 : ' + v8 + '\n v9 : ' + v9 + '\n v10 : ' + v10 + '\n v11 : ' + v11 + '\n v12 : ' + v12);                             
			}
    else {
			alert('잘했어요');
        }
    }
    
 );




  $.fn.extend({
    lighter: function(option) {
      if (option == null) {
        option = {};
      }
      return this.each(function() {
        var $this, action, options;
        $this = $(this);
        options = $.extend({}, $.fn.lighter.defaults, typeof option === "object" && option);
        action = typeof option === "string" ? option : option.action;
        if (action == null) {
          action = "show";
        }
        return Lighter.lighter($this, options)[action]();
      });
    }
  });

  $(document).on("click", "[data-lighter]", function(event) {
    event.preventDefault();
    event.stopPropagation();
    return $(this).lighter();
  });

}).call(this);
