define "social-buttons/adapters/twitter", [ "social-buttons/button" ], ->
  Button = require "social-buttons/button"

  class Twitter extends Button
    className: "twitter"
