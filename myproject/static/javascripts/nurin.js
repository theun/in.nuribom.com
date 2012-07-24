String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (match, number) {
        return typeof args[number] !== 'undefined' 
            ? args[number]
            : match;
    });
};

jQuery(function($){
    $.datepicker.regional['ko'] = {
        closeText: '닫기',
        prevText: '이전달',
        nextText: '다음달',
        currentText: '오늘',
        monthNames: ['1월','2월','3월','4월','5월','6월',
        '7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월',
        '7월','8월','9월','10월','11월','12월'],
        dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        dayNamesMin: ['일','월','화','수','목','금','토'],
        weekHeader: 'Wk',
        dateFormat: 'yy-mm-dd',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '년'};
    $.datepicker.setDefaults($.datepicker.regional['ko']);
});

function adjust_height(target, source) {
	var $target = target,
		$source = source;
	
	if (typeof target === "string")
		$target = $(target);
	if (typeof source === "string")
		$source = $(source);
	
    if ($target.outerHeight() < $source.outerHeight()) {
        $target.css("height", $source.outerHeight());
    }
}

(function($) {

SearchField = function(type) {
	/* type: 'keyword', 'user' */
	this.type = type;
}

SearchField.prototype = {
    init: function() {
    	if (!SearchField.inited) {
    		SearchField.inited = true;
	    	$("body").append("<div style='position: absolute; text-align: left; display: none; z-index: 100;' id='auto-completer'></div>");
    	}
        this.cancel();
    },
    exec: function(prefix) {
        this.prefix = prefix;
        if (prefix) {
            var url = "/search/prefix?" + this.type + "=" + prefix;
            $.post(url, function(result) {
                var $box = $("#auto-completer")
                var $focus = $("*:focus");
                var offset = $focus.offset();
                
                $box.html("");
                for (var i = 0, len = result.length; i < len && i < 10; i++) { 
                    $box.append( 
                        "<li>" + 
                        result[i] +
                        "</li>" );
                }
                $box.css("width", $focus.outerWidth()); 
                $box.show();
                $box.offset( {top: offset.top + $focus.outerHeight() + 2, left: offset.left} );
                $("#auto-completer li").click(function(){
                    var $search = $("#global-search-field");  
                    $search.val($(this).html());
                    $search.focus();
                    $box.hide();
                });
                $("#auto-completer li").mouseenter(function(){
                    $(this).addClass('cursor');
                });
                $("#auto-completer li").mouseleave(function(){
                    $(this).removeClass('cursor');
                });
            }, "json");
        }
        else {
            $("#auto-completer").hide();
        }
    },
    setup: function(prefix) {
		this.init();
        if (this.prefix != prefix) {
            var self = this;
            this.timeoutID = window.setTimeout(function(key) {self.exec(key);}, 500, prefix);
        }
    },
    cancel: function() {
        if (typeof this.timeoutID == "number") {
            window.clearTimeout(this.timeoutID);
            delete this.timeoutID;
        }
    },
};

$.fn.extend({
	SearchField: function(type) {
		var self = this;
		
		this.search = new SearchField(type);
		this.keyup(function(event) {
	        var $box = $("#auto-completer");
	        var $focus = $("*:focus");
	        
	        if ($box.is(":visible")) {
	            if (event.which == 27) { // ESC
	                $box.hide();
	                return true;
	            }
	            else if (event.which == 40) { // Down
	                var $cursor = $box.find('.cursor');
	                if ($cursor.length == 0) {
	                    $cursor = $box.find("li").eq(0).addClass('cursor');
	                    $focus.val($cursor.html());
	                } else {
	                    $cursor.removeClass('cursor');
	                    if ($cursor.next().length) {
	                        $cursor = $cursor.next().addClass('cursor');
	                        $focus.val($cursor.html());
	                    }
	                }
	                return true;
	            }
	            else if (event.which == 38) { // Up
	                var $cursor = $box.find('.cursor');
	                if ($cursor.length == 0) {
	                    $cursor = $box.find("li").eq(-1).addClass('cursor');
	                    $focus.val($cursor.html());
	                } else {
	                    $cursor.removeClass('cursor');
	                    if ($cursor.prev().length) {
	                        $cursor = $cursor.prev().addClass('cursor');
	                        $focus.val($cursor.html());
	                    }
	                }
	                return true;
	            }
	        }
	        self.search.setup(self.val().trim());
		});
	},
	PopupMenu: function(menu, activate_cb, deactivate_cb) {
		/* this: popup menu
		 * button_selector: button to activate or deactivate popup menu
		 * activate_cb: callback function which is called when popup menu is active
		 * deactivate_cb: callback function which is called when popup menu is deactivate 
		 */  
		var self = this;
		var $menu = $(menu)
		$(window).bind("popup.hide", function() {
			$menu.hide();
		});
		$("html").click(function(e) {
			$menu.hide();
		});
		this.click(function(e) {
		    e.stopPropagation();
		    if ($menu.is(":visible")) {
				if (typeof deactivate_cb === "function") 
					if (!deactivate_cb($menu)) return;
		    	$menu.hide();
		    } else {
		    	if (typeof activate_cb === "function")
		    		if (!activate_cb($menu)) return;
		    	$menu.show();
		    }
		});
	},
});

}) (jQuery);