(function($, w, d, undefined) {
    
    var ButtonConfiguration = function(params) {
	return $.extend(ButtonConfiguration.defaults, params);
    }
    
    ButtonConfiguration.defaults = {
	selectors: {
	    facebookButton: '.l-fb',
	    twitterButton: '.l-tw',
	    vkontakteButton: '.l-vk',
	    
	    count: '.l-count',
	    ico: '.l-ico'
	},
	
	classes: {
	    countVisibleClass: 'like-not-empty'
	},
	
	keys: {
	    shareLinkParam: 'href'
	}
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
	    
	    this.linkToShare
		= this.$context.attr(this.config.keys.shareLinkParam);
	    this.$context.attr(this.config.keys.shareLinkParam, '');
	    
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
	
	getShareLink: function() {},
	getCountLink: function(url) {
	    return this.countServiceUrl + encodeURIComponent(url);
	},
	openShareWindow: function(e) {},
	countLikes: function() {},
	
    
	/*@properties*/
	linkToShare: null,
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
	
	/*@properties*/
	countServiceUrl: 'http://vkontakte.ru/share.php?act=count&url='
    });
    
    
    
    
    
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
    
    // костыль для Вконтакте
    w.socialButtonCountObjects = [];
    
    if(!w.VK) {
	w.VK = {
	    Share: {
		count: function(index, count) {
		    var button = w.socialButtonCountObjects[index];
		    button.setCountValue(count);
		    w.socialButtonCountObjects.splice(index, index);
		}
	    }
	}
    } else {
	var originalVkCount = w.VK.Share.count;
	
	w.VK.Share.count = function(index, count) {
	    var button = w.socialButtonCountObjects[index];
	    button.setCountValue(count);
	    w.socialButtonCountObjects.splice(index, index);
	    
	    originalVkCount.call(w.VK.Share, index, count);
	};
    }
        
})(jQuery, window, document);