/**
 * Created by slemesle on 26/07/2018.
 */



+function ($) {
    'use strict';

    $.fn.randomize = function(selector){
        (selector ? this.find(selector) : this).parent().each(function(){
            $(this).children(selector).sort(function(){
                return Math.random() - 0.5;
            }).detach().appendTo(this);
        });

        return this;
    };

    var Gallery = function (elem, options) {
        this.$element    = $(elem);
        this.options = $.extend({}, this.DEFAULTS, options);
        this.current_opened_box = -1;
        this.current_opened_box_id = -1;
        this.nbRow = options.nbRow;
        this.elemPerRow = options.elemPerRow;
        this.randomize = options.randomize;
        this.containerClass = options.containerClass;
        this.anchor = decodeURIComponent(window.location.hash);

        this.init();
    };

    Gallery.DEFAULTS = {
        nbRow: 2,
        elemPerRow: 4,
        elemPerRowMd: 2,
        randomize: true,
        containerClass: '.rolldown-gallery'
    };

    Gallery.prototype.init = function (){
        if(this.randomize){
            $(this.containerClass+' div.portfolio-item').randomize();
        }
        $(this.containerClass+' div.portfolio-item').each(function (id) {
            $(this).attr('data-id', id + 1);
        });

        $(this.containerClass+' div.portfolio-item').click(this, this.click);

        if (this.anchor != "") {
            $(this.anchor + '.portfolio-item ').triggerHandler('click');
        }
    }

    Gallery.prototype.click = function(evt){
            var targetId = $(this).attr('data-content');
            var boxId = $(this).attr('data-id');
            var $this = $(this);
            var self  = evt.data;

            var id = $(targetId);
            var openThumb = 0;
            if (self.current_opened_box == targetId)
            { // if user click a opened box div again you close the box and return back
                openThumb = $(self.containerClass+' .gridder-content').height();
                $(self.containerClass+' .gridder-content').slideUp('fast');
                self.current_opened_box = -1;
                self.current_opened_box_id = -1;
                return false;
            } else if (self.current_opened_box != -1) {
                // Just close the old opened box
                openThumb = $(self.containerClass+' .gridder-content').height();
                $(self.containerClass+' .gridder-content').slideUp('fast');
                if (boxId > self.elemPerRow && self.current_opened_box_id > self.elemPerRow) {
                    openThumb = 0;
                }
                self.current_opened_box = -1;
                self.current_opened_box_id = -1;
            }
            if (boxId < self.elemPerRow + 1) {
                openThumb = 0;
            }
            // save this id. so if user click a opened box li again you close the box.
            self.current_opened_box = targetId;
            self.current_opened_box_id = boxId;

            var targetOffset = 0;

            targetOffset = $(this).offset().top - 80 - openThumb;

            var itemId = $this.attr('data-id');
            // Fix ME handle different elemPerRow of 4 - 2 - 1
            // Handle new 3 - 3 - 1
            if ($(window).width() > 992) { // 4 per row
                if (parseInt(itemId) % self.elemPerRow == 0) {
                    $('[data-id="' + Math.floor((parseInt(itemId) / self.elemPerRow)) * self.elemPerRow + '"]').after($(targetId));
                } else {
                    $('[data-id="' + Math.floor((parseInt(itemId) / self.elemPerRow) + 1) * self.elemPerRow + '"]').after($(targetId));
                }

            } else if ($(window).width() > 768) {
                if (parseInt(itemId) % self.elemPerRowMd == 0) {
                    $('[data-id="' + Math.floor((parseInt(itemId) / self.elemPerRowMd)) * self.elemPerRowMd + '"]').after($(targetId));
                } else {
                    $('[data-id="' + Math.floor((parseInt(itemId) / self.elemPerRowMd) + 1) * self.elemPerRowMd + '"]').after($(targetId));
                }
            } else {
                $('[data-id="' + itemId + '"]').after($(targetId));
            }


            $("html:not(:animated),body:not(:animated)").animate({scrollTop: targetOffset}, 500, function () {

                $(targetId).slideDown(500);
                return false;
            });

    }



  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('gallery')
      var options = $.extend({}, Gallery.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('gallery', (data = new Gallery(this, options)))
    })
  }

  var old = $.fn.wsGallery

  $.fn.wsGallery             = Plugin
  $.fn.wsGallery.Constructor = Gallery

}(jQuery);
