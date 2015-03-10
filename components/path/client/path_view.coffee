_ = require 'underscore'
sd = require('sharify').data
Backbone = require 'backbone'
Backbone.$ = $
mediator = require '../../../lib/mediator.coffee'
Block = require '../../../models/block.coffee'
FollowButtonView = require '../../follow_button/client/follow_button_view.coffee'

module.exports = class PathView extends Backbone.View

  events:
    'click .toggle-settings-trigger' : 'toggleSettings'
    'click .toggle-expand-trigger' : 'toggleExpand'

  initialize: (options) ->
    super

    if (sd.USER or sd.CHANNEL) and sd.CURRENT_USER

      model = if sd.USER then sd.USER else sd.CHANNEL
      @model = new Block model

      new FollowButtonView
        el: @$('.follow_button')
        model: @model
        showTitle: no

  toggleSettings: (e)->
    @$('.metadata--container').toggleClass 'settings-is-active'
    if !$('.metadata__column').hasClass 'is-expanded'
      @$('.metadata__column').toggleClass 'is-expanded'

  toggleExpand: (e)->
    @$('.metadata__column').toggleClass 'is-expanded'
    @$('.metadata--container').removeClass 'settings-is-active'