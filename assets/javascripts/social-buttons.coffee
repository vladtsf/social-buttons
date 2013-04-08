define "social-buttons", [ "social-buttons/button" ], ->
  Button = require "social-buttons/button"

  jQuery::socialButton = ( options ) ->
    for own element, idx in @
      Button.lastIndex++
      console.log "aposkdkopsa"

    @