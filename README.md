# tabSlideOut

jQuery ‘Tab Slide Out’ Plugin

Public Domain: NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

To use you must have an image ready to go as your tab. Make sure to pass in
at minimum the path to the image and its dimensions.

Example:

    $('.slide-out-div').tabSlideOut({
      tabHandle: '.handle',                     // class of the element that will be your tab -doesnt have to be an anchor
      pathToTabImage: 'images/contact_tab.gif', // relative path to the image for the tab *required*
      imageHeight: '133px',                     // height of tab image *required*
      imageWidth: '44px',                       // width of tab image *required*  
    });

or you can leave out these options and set the image properties using CSS.

##CREDITS

- Originally by William Paoli: http://wpaoli.building58.com
- Option 'tabHandleOffset' developed by katowulf: https://gist.github.com/katowulf/2655810 
