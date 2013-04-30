define "social-buttons/button", ->

  # Button base class
  #
  class Button

    # Construct a new instance of Button
    #
    # @param [jQuery] @$el root element
    # @param [Object] @passedOptions hash of params passed into the plugin
    #
    constructor: ( @$el, @passedOptions ) ->
      # button unique identifier
      @cid = "button#{ Button.lastIndex }"

      # increment buttons last cid
      Button.lastIndex++

      @initEl()

      @count()

      # naked root DOM object
      @el = @$el.get()

      @delegateEvents()

    # Initializes root DOM element
    #
    initEl: ->
      # add class to root element
      @$el.addClass @className if @className?

      # render content
      @$el.html @template()

      @

    # Count shares/likes
    count: ->
      console.log @getUrl "count"


    # Uses jQuery.on to delegate events
    #
    delegateEvents: ->
      for own event, handler of jQuery.extend {}, Button::events, @events
        type = event.split( /\s/ )[ 0 ]
        selector = event.split( /\s/ )[ 1... ].join " "

        if typeof handler isnt "function"
          if @[ handler ]?
            handler = @[ handler ]
          else
            throw new Error "Method '#{ handler }' is not defined"

        @$el.on "#{ event }.button#{ @cid }", selector, => handler.apply @, arguments

      @


    # Uses jQuery.off to undelegate events
    #
    undelegateEvents: ->
      @$el.off ".button#{ @cid }"

      @

    # Used to determine url for share
    #
    getShareLink: ->
      parts = URI.parse @$el.attr "href"
      loc = new URI()

      for own part, value of parts
        unless loc[ part ]()
          loc = loc[ part ] value

      loc.toString()

        # fragment: "12312"
        # hostname: "ya.ru"
        # password: "bar"
        # path: "/foo/bar/"
        # port: null
        # protocol: "http"
        # query: "baz=a&a=bas"
        # username: "foo"

      # href = @$el.attr "href"
      # console.log href
      # # share link
      # link = if ( href = @$el.attr( "href" ) ).length is 0 then new URI( ) else new URI href
      # # link.fragment {foo:"bar"}
      # console.log  link.toString()
      # console.log "foo", link.toString(), "aop[sdop"
      # link.toString()

    # Used to determine url
    #
    # @param [String] type url type (count or share)
    #
    getUrl: ( type = "count" ) ->
      return null unless type in [ "count", "share" ]

      if typeof @[ "#{ type }Url" ] is "function"
        return String @[ "#{ type }Url" ]()
      else
        return String @[ "#{ type }Url" ]


    # Link to shares count service
    #
    countUrl: ""


    # Link to share service
    #
    shareUrl: ""


    # Load configuration hash
    #
    options: ->
      attrs =
        link: @$el.prop "href"

      jQuery.extend attrs, @defaults, @passedOptions, @$el.data()


    # Hash of events
    events: {}
      # "click .b-share-button__icon": "share"


    # Last used cid
    @lastIndex = 0

    # Button markup
    template: ->
      $.trim """
        <i class="b-share-button__icon"></i>
        <span class="b-share-button__count js-share-button__count"></span>
      """

