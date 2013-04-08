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

      # naked root DOM object
      @el = @$el.get()

      @delegateEvents()


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

