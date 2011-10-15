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
	init: function($context, conf) {
	    this.config = conf;
	    
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
		.$count
		.text(count);
		
	    this
		.$context
		.addClass(this.config.classes.countVisibleClass);
	},
	
	getShareLink: function() {},
	getCountLink: function() {},
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
    
    
    
    var FacebookButton = function($context, conf) {
	this.init($context, conf);
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
    
    
    
    var TwitterButton = function($context, conf) {
	this.init($context, conf);
    };
    TwitterButton.prototype = new Button;
    TwitterButton.prototype
	= $.extend(TwitterButton.prototype,
    {
	/*@methods*/
	
	/*@properties*/
    });
    
    
    
    var VkontakteButton = function($context, conf) {
	this.init($context, conf);
    };
    VkontakteButton.prototype = new Button;
    VkontakteButton.prototype
	= $.extend(VkontakteButton.prototype,
    {
	/*@methods*/
	
	/*@properties*/
    });
    
    
    
    
    
    
    $.fn.socialButton = function(config) {
	this.each(function(index, element) {
	    var
		$element = $(element),
		conf = new ButtonConfiguration(config),
		b = false;

	    if($element.is(conf.selectors.facebookButton)) {
		b = new FacebookButton($element, conf);
	    } else if($element.is(conf.selectors.twitterButton)) {
		b = new TwitterButton($element, conf);
	    } else if($element.is(conf.selectors.vkontakteButton)) {
		b = new VkontakteButton($element, conf);
	    }

	});
	
	return this;
    };
    
})(jQuery, window, document);