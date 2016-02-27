/**
 * tabSlideOut v3.0
 * by Fernando Paredes García http://github.com/develCuy/tabSlideOut
 *
 * Public Domain: NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * To use you must have an image ready to go as your tab. Make sure to pass in
 * at minimum the path to the image and its dimensions.
 *
 * Example:
 * 
 *   $('.slide-out-div').tabSlideOut({
 *     tabHandle: '.handle',                     // class of the element that will be your tab -doesnt have to be an anchor
 *     pathToTabImage: 'images/contact_tab.gif', // relative path to the image for the tab *required*
 *     imageHeight: '133px',                     // height of tab image *required*
 *     imageWidth: '44px',                       // width of tab image *required*  
 *   });
 *
 * or you can leave out these options and set the image properties using CSS.
 *
 * CREDITS
 * -------
 * Originally by William Paoli: http://wpaoli.building58.com
 * Option 'tabHandleOffset' by katowulf: https://gist.github.com/katowulf/2655810 
 *
 */


(function($){
  $.fn.tabSlideOut = function(callerSettings) {
    var settings = $.extend({
      tabHandle: '.handle',
      toggleButton: '.tab-opener',
      speed: 300,
      action: 'click',
      tabLocation: 'left',
      minTopPos: null,
      topPos: '200px',
      leftPos: '20px',
      fixedPosition: false,
      positioning: 'absolute',
      pathToTabImage: null,
      imageHeight: null,
      imageWidth: null,
      tabHandleOffset: 0,
      onLoadSlideOut: false,
      onOpen: function(){},
      onClose: function(){},
      hideOnSmallerViewport: true,
      viewportH: null,
      viewportW: null,
      heightOffset: 0,
      autoHeight: true
    }, callerSettings||{});

    settings.tabHandle = $(settings.tabHandle);
    settings.toggleButton = $(settings.toggleButton);

    var obj = this;
    if (settings.fixedPosition === true) {
      settings.positioning = 'fixed';
    } else {
      settings.positioning = 'absolute';
    }

    //ie6 doesn't do well with the fixed option
    if (document.all && !window.opera && !window.XMLHttpRequest) {
      settings.positioning = 'absolute';
    }
 
    //set viewport functions
    var viewportH, viewportW;
    if (settings.viewportH != null) {
       viewportH = settings.viewportH;
    } else {
       viewportH = function () {
          return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
       }
    }
    if (settings.viewportW != null) {
       viewportW = settings.viewportW;
    } else {
       viewportW = function () {
          return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
       }
    }

    //set initial tabHandle css
    if (settings.pathToTabImage !== null) {
      settings.tabHandle.css({
        'background' : 'url(' + settings.pathToTabImage + ') no-repeat',
        'width' : settings.imageWidth,
        'height': settings.imageHeight
      });
    }

    settings.tabHandle.css({
      'display': 'block',
      'textIndent' : '-99999px',
      'outline' : 'none',
      'position' : 'absolute'
    });

    obj.css({
      'line-height' : '1',
      'position' : settings.positioning
    });

    var properties = {
      containerWidth: parseInt(obj.outerWidth(), 10) + 'px',
      containerHeight: parseInt(obj.outerHeight(), 10) + 'px',
      tabWidth: parseInt(settings.tabHandle.outerWidth(), 10) + 'px',
      tabHeight: parseInt(settings.tabHandle.outerHeight(), 10) + 'px'
    };

    //set calculated css
    if (settings.tabLocation === 'top' || settings.tabLocation === 'bottom') {
      obj.css({'left' : settings.leftPos});
      var tabRightOffset = settings.tabHandleOffset === 'center' ? Math.floor(obj.outerWidth() / 2) : settings.tabHandleOffset;
      settings.tabHandle.css({'right' : tabRightOffset});
    }

    if (settings.tabLocation === 'top') {
      obj.css({'top' : '-' + properties.containerHeight});
      settings.tabHandle.css({'bottom' : '-' + properties.tabHeight});
    }

    if (settings.tabLocation === 'bottom') {
      obj.css({'bottom' : '-' + properties.containerHeight, 'position' : 'fixed'});
      settings.tabHandle.css({'top' : '-' + properties.tabHeight});

    }

    if (settings.tabLocation === 'left' || settings.tabLocation === 'right') {
      var outerHeight = obj.outerHeight() + settings.heightOffset;
      var outerWidth = obj.outerWidth();
      var containerCSS = {};
      if (settings.hideOnSmallerViewport === true && (viewportH() < outerHeight || viewportW() < outerWidth)) {
        $(obj).hide();
        return;
      }
      if (settings.topPos == 'auto') {
        containerCSS.top = Math.max((viewportH() - outerHeight) / 2, 0);
      } else {
        containerCSS.top = settings.topPos;
      }
      if (settings.minTopPos != null && settings.minTopPos > containerCSS.top) {
        containerCSS.top = settings.minTopPos;
      }
      if (settings.autoHeight === true) {
        containerCSS.height = properties.containerHeight;
      }
      obj.css(containerCSS);
      var tabTopOffset = settings.tabHandleOffset==='center'? Math.floor(outerHeight/2)+'px' : settings.tabHandleOffset;
      settings.tabHandle.css({'top' : tabTopOffset});
    }

    if (settings.tabLocation === 'left') {
      obj.css({ 'left': '-' + properties.containerWidth});
      settings.tabHandle.css({'right' : '-' + properties.tabWidth});
    }

    if (settings.tabLocation === 'right') {
      obj.css({ 'right': '-' + properties.containerWidth});
      settings.tabHandle.css({'left' : '-' + properties.tabWidth});

      $('html').css('overflow-x', 'hidden');
    }

    //functions for animation events

    settings.tabHandle.click(function(event){
      event.preventDefault();
    });
    settings.toggleButton.click(function(event){
      event.preventDefault();
    });

    var slideIn = function() {

      if (settings.tabLocation === 'top') {
        obj.animate({top:'-' + properties.containerHeight}, settings.speed, settings.onClose()).removeClass('open');
      } else if (settings.tabLocation === 'left') {
        obj.animate({left: '-' + properties.containerWidth}, settings.speed, settings.onClose()).removeClass('open');
      } else if (settings.tabLocation === 'right') {
        obj.animate({right: '-' + properties.containerWidth}, settings.speed, settings.onClose()).removeClass('open');
      } else if (settings.tabLocation === 'bottom') {
        obj.animate({bottom: '-' + properties.containerHeight}, settings.speed, settings.onClose()).removeClass('open');
      }

    };

    var slideOut = function() {

      if (settings.tabLocation === 'top') {
        obj.animate({top:'-3px'},  settings.speed, settings.onOpen()).addClass('open');
      } else if (settings.tabLocation === 'left') {
        obj.animate({left:'-3px'},  settings.speed, settings.onOpen()).addClass('open');
      } else if (settings.tabLocation === 'right') {
        obj.animate({right:'-3px'},  settings.speed, settings.onOpen()).addClass('open');
      } else if (settings.tabLocation === 'bottom') {
        obj.animate({bottom:'-3px'},  settings.speed, settings.onOpen()).addClass('open');
      }
    };

    var clickScreenToClose = function() {
      obj.click(function(event){
        event.stopPropagation();
      });

    settings.toggleButton.click(function(event){
        event.stopPropagation();
      });
    

      $(document).click(function(){
        slideIn();
      });
    };

    var clickAction = function(){
      settings.tabHandle.click(function(event){
        if (obj.hasClass('open')) {
          slideIn();
        } else {
          slideOut();
        }
      });
      settings.toggleButton.click(function(event){
        if (obj.hasClass('open')) {
          slideIn();
        } else {
          slideOut();
        }
      });
      clickScreenToClose();
    };

    var hoverAction = function(){
      obj.hover(
        function(){
          if (!obj.hasClass('open')) {
            slideOut();
      }
        },
        
        function(){
          if (obj.hasClass('open')) {
            setTimeout(slideIn, 1000);
          }
        });
        
        settings.tabHandle.click(function(event){
          if (obj.hasClass('open')) {
            slideIn();
          }
        });

        settings.toggleButton.click(function(event){
          if (obj.hasClass('open')) {
            slideIn();
          } else {
            slideOut();
          }
        });

        clickScreenToClose();
        
    };

    var slideOutOnLoad = function(){
      slideIn();
      setTimeout(slideOut, 500);
    };

    //choose which type of action to bind
    if (settings.action === 'click') {
      clickAction();
    }

    if (settings.action === 'hover') {
      hoverAction();
    }

    if (settings.onLoadSlideOut) {
      slideOutOnLoad();
    }

  };
})(jQuery);
