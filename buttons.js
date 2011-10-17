(function($, w, d, undefined) {
    
    function getParam(key) {
	if(key) {
	    var pairs
		= top.location.search.replace(/^\?/, '').split('&');

	    for(var i in pairs) {
		var current = pairs[i];

		var match = current.match(/([^=]*)=(\w*)/);

		if(match[1] === key) {
		    return decodeURIComponent(match[2]);
		}
	    }
	}
	
	return false;
    }
    
    
    var ButtonConfiguration = function(params) {
	return $.extend(ButtonConfiguration.defaults, params);
    }
    
    ButtonConfiguration.defaults = {
	selectors: {
	    facebookButton: '.l-fb',
	    twitterButton: '.l-tw',
	    vkontakteButton: '.l-vk',
	    
	    count: '.l-count',
	    ico: '.l-ico',
	    
	    shareTitle: 'h2:eq(0)',
	    shareSumary: 'p:eq(0)',
	    shareImages: 'img[src]'
	},
	
	buttonDepth: 2,
	alternativeImage: '',
	
	classes: {
	    countVisibleClass: 'like-not-empty'
	},
	
	keys: {
	    shareLinkParam: 'href'
	},
	
	popupWindowOptions: [
	    'left=0',
	    'top=0',
	    'width=500',
	    'height=250',
	    'personalbar=0',
	    'toolbar=0',
	    'scrollbars=1',
	    'resizable=1'
	]
    };
    
    
    
    var Button = function() {};
    
    Button.prototype = {
	/*@methods*/
	init: function($context, conf, index) {
	    this.config = conf;
	    this.index = index;
	    
	    this.$context = $context;
	    this.$count = $(this.config.selectors.count, this.$context);
	    this.$ico = $(this.config.selectors.ico, this.$context);
	    
	    this.collectShareInfo();
	    this.bindEvents();
	    this.countLikes();
	},
	
	bindEvents: function() {
	    this
		.$context
		.bind('click', Button.returnFalse);

	    this
		.$ico
		.bind('click', this, this.openShareWindow);
	    
	},
	
	setCountValue: function(count) {
	    this
		.$context
		.addClass(this.config.classes.countVisibleClass);
		
	    this
		.$count
		.text(count);
	},
	
	getCountLink: function(url) {
	    return this.countServiceUrl + encodeURIComponent(url);
	},
	
	collectShareInfo: function() {
	    var
		$parent = this.$context,
		button = this;
	    
	    for(var i = 0; i < this.config.buttonDepth; i++) {
			$parent = $parent.parent();
	    }
	    
	    var href = this.$context.attr(this.config.keys.shareLinkParam);
	    
	    this.linkToShare = href;
	    if(!href) {
	    	href = w.location.origin + w.location.pathname;
	    } else if(href.indexOf('http://') == -1 & href.indexOf('https://') == -1) {
		this.linkToShare
		    = (href[0] == '/' ? w.location.origin + href : w.location.origin + w.location.pathname + href);
	    }
	    
	    var 
		$title = $(this.config.selectors.shareTitle, $parent),
		$summary = $(this.config.selectors.shareSumary, $parent),
		$images = $(this.config.selectors.shareImages, $parent);
		
	    if($title.length > 0) {
		this.title = $title.text();
	    }
	    
	    if($summary.length > 0) {
		this.summary = $summary.text();
	    }
	    
	    this.images = [];
	    if($images.length > 0) {
			$images.each(function(index, element) {
				button.images[index] = element.src;
			});
	    } else {
			this.images[0] = this.config.alternativeImage ? this.config.alternativeImage : undefined;
		}
	},
	
	getPopupOptions: function() {
	    return this.config.popupWindowOptions.join(',');
	},
	
	openShareWindow: function(e) {
	    var
		button = e.data,
		shareUri = button.getShareLink(),
		windowOptions = button.getPopupOptions();
	    
	    var 
		newWindow = w.open(shareUri, '', windowOptions);

	    if(w.focus) {
		newWindow.focus()
	    }
	},
	
	/*@properties*/
	linkToShare: null,
	title: d.title,
	summary: null,
	images: [],
	
	countServiceUrl: null,
	$context: null,
	$count: null,
	$ico: null
    };
    
    Button = $.extend(Button, {
	/*@methods*/
	returnFalse: function(e) {
	    return false;
	}
	
	/*@properties*/
	
    });
    
    
    
    var FacebookButton = function($context, conf, index) {
	this.init($context, conf, index);
    };
    FacebookButton.prototype = new Button;
    FacebookButton.prototype
	= $.extend(FacebookButton.prototype,
    {
	/*@methods*/
	countLikes: function() {
	    var
		serviceURI = this.getCountLink(this.linkToShare),
		execContext = this;
	    
	    $.ajax({
		url: serviceURI,
		dataType: 'jsonp',
		success: function(data, status, jqXHR) {
		    if(status == 'success' && data[0]) {
			if(data[0].share_count > 0) {
			    execContext.setCountValue(data[0].share_count)
			}
		    }
		}
	    });
	},
	
	getCountLink: function(url) {
	    var fql = 'SELECT share_count FROM link_stat WHERE url="' + url + '"';
	    return this.countServiceUrl + encodeURIComponent(fql);
	},
	
	getShareLink: function() {
	    var images = '';
	    
	    for(var i in this.images) {
		images += ('&p[images][' + i +']=' + encodeURIComponent(this.images[i]));
	    }
	    
	    return 'http://www.facebook.com/sharer/sharer.php?'
		+ 's=' + 100
		+ '&p[url]=' + encodeURIComponent(this.linkToShare)
		+ (this.summary ? '&p[summary]=' + encodeURIComponent(this.summary) : '')
		+ '&p[title]=' + encodeURIComponent(this.title)
		+ (images ? images : '');
	},
	
	/*@properties*/
	countServiceUrl: 'https://api.facebook.com/method/fql.query?format=json&query='
    });
    
    
    
    var TwitterButton = function($context, conf, index) {
	this.init($context, conf, index);
    };
    TwitterButton.prototype = new Button;
    TwitterButton.prototype
	= $.extend(TwitterButton.prototype,
    {
	/*@methods*/
	countLikes: function() {
	    var
		serviceURI = this.getCountLink(this.linkToShare),
		execContext = this;
	    
	    $.ajax({
		url: serviceURI,
		dataType: 'jsonp',
		success: function(data, status, jqXHR) {
		    if(status == 'success' & data.count > 0) {
			execContext.setCountValue(data.count)
		    }
		}
	    });
	},
	
	getShareLink: function() { 
	    return 'https://twitter.com/share'
		    + '?url=' + encodeURIComponent(this.linkToShare)
		    + (this.title ? '&text=' + encodeURIComponent(this.title) : '');
	},
	
	/*@properties*/
	countServiceUrl: 'http://urls.api.twitter.com/1/urls/count.json?url='
    });
    
    
    
    var VkontakteButton = function($context, conf, index) {
	this.init($context, conf, index);
    };
    VkontakteButton.prototype = new Button;
    VkontakteButton.prototype
	= $.extend(VkontakteButton.prototype,
    {
	/*@methods*/
	countLikes: function() {
	    var	serviceURI = this.getCountLink(this.linkToShare) + '&index=' + this.index;
	    
	    w.socialButtonCountObjects[this.index] = this;
	    
	    $.ajax({
		url: serviceURI,
		dataType: 'jsonp'
	    });
	},
	
	getShareLink: function() { 
	    return 'http://vkontakte.ru/share.php?'
		    + 'url=' + encodeURIComponent(this.linkToShare)
		    + (this.summary ? '&description=' + encodeURIComponent(this.summary) : '')
		    + '&title=' + encodeURIComponent(this.title)
		    + '&image=' + encodeURIComponent(this.images[0]);
	},
	
	/*@properties*/
	countServiceUrl: 'http://vkontakte.ru/share.php?act=count&url='
    });
    
    
    
    
    // костыль для Вконтакте
    w.socialButtonCountObjects = {};
    
    function vkShare(index, count) {
	var button = w.socialButtonCountObjects[index];
	if(count > 0) {
	    button.setCountValue(count);
	}
	delete w.socialButtonCountObjects[index];
    }
    
    if(!w.VK) {
	w.VK = {
	    Share: {
		count: function(index, count) {
		    vkShare(index, count);
		}
	    }
	}
    } else {
	var originalVkCount = w.VK.Share.count;
	
	w.VK.Share.count = function(index, count) {
	    vkShare(index, count);
	    originalVkCount.call(w.VK.Share, index, count);
	};
    }
    
    
    
    
    $.fn.socialButton = function(config) {
	this.each(function(index, element) {
	    var
		$element = $(element),
		conf = new ButtonConfiguration(config),
		b = false;

	    if($element.is(conf.selectors.facebookButton)) {
		b = new FacebookButton($element, conf, index);
	    } else if($element.is(conf.selectors.twitterButton)) {
		b = new TwitterButton($element, conf, index);
	    } else if($element.is(conf.selectors.vkontakteButton)) {
		b = new VkontakteButton($element, conf, index);
	    }

	});
	
	return this;
    };
    
    $.scrollToButton = function(hashParam, duration) {	
		if(!w.location.hash) {
			if(w.location.search) {
				var currentHash = getParam(hashParam);
				if(currentHash) {
					var $to = $('#' + currentHash);
					if($to.length > 0) {
						$('html,body')
							.animate({
							scrollTop: $to.offset().top,
							scrollLeft: $to.offset().left
						}, duration || 1000);
					}
				}
			}
		}
		
		return this;
    };
        
})(jQuery, window, document);