define "social-buttons", [
  "social-buttons/adapters/facebook"
  "social-buttons/adapters/vkontakte"
  "social-buttons/adapters/twitter"
], ->


  class SocialButtons
    @adapters =
      facebook: require "social-buttons/adapters/facebook"
      vkontakte: require "social-buttons/adapters/vkontakte"
      twitter: require "social-buttons/adapters/twitter"

  jQuery::socialButton = ( options = {} ) ->
    for own element, idx in @
      $el = $( element )
      network = $el.data "network"

      if SocialButtons.adapters[ network ]?
        new SocialButtons.adapters[ network ] $el, options

    @