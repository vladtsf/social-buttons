define "social-buttons/adapters/facebook", [ "social-buttons/button" ], ->
  Button = require "social-buttons/button"

  class Facebook extends Button
    className: "facebook"


    # getCountLink: (url) ->
    #   fql = "SELECT share_count FROM link_stat WHERE url=\"" + url + "\""
    #   @countServiceUrl + encodeURIComponent(fql)

    # getShareLink: ->
    #   images = ""
    #   for i of @images
    #     images += ("&p[images][" + i + "]=" + encodeURIComponent(@images[i]))
    #   "http://www.facebook.com/sharer/sharer.php?" + "s=" + 100 + "&p[url]=" + encodeURIComponent(@linkToShare) + ((if @summary then "&p[summary]=" + encodeURIComponent(@summary) else "")) + "&p[title]=" + encodeURIComponent(@title) + ((if images then images else ""))

    # countServiceUrl: "https://api.facebook.com/method/fql.query?format=json&query="


    # Link to shares count service
    #
    countUrl: -> "https://api.facebook.com/method/fql.query?format=json&query=#{ encodeURIComponent "SELECT share_count FROM link_stat WHERE url=\"#{ @getShareLink() }\"" }"


    # Link to share service
    #
    shareUrl: ""
