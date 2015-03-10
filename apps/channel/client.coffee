Backbone = require "backbone"
_ = require 'underscore'
sd = require("sharify").data
mediator = require '../../lib/mediator.coffee'
Channel = require '../../models/channel.coffee'
ChannelBlocks = require '../../collections/channel_blocks.coffee'
Collaborators = require '../../collections/collaborators.coffee'
CurrentUser = require '../../models/current_user.coffee'
BlockCollectionView = require '../../components/block_collection/client/block_collection_view.coffee'
BlockSkeletonView = require './client/block_skeleton_view.coffee'
NewBlockView = require '../../components/new_block/client/new_block_view.coffee'
ChannelCollaborationView = require './client/channel_collaboration_view.coffee'
ChannelFileDropView = require './client/channel_file_drop_view.coffee'
ChannelVisibilityView = require '../../components/channel_visibility/client/channel_visibility_view.coffee'
ShareLinkView = require '../../components/share_link/client/share_link_view.coffee'

Bp = require('../../lib/vendor/backpusher.js')

module.exports = class ChannelView extends Backbone.View

  initialize: (options)->
    @channel = options.channel
    @blocks = options.blocks

    mediator.on 'collaborators:fetched', @checkUserAbilities, @

    @maybeSubscribe()

  maybeSubscribe: ->
    @pusher = mediator.shared.pusher.subscribe "channel-production-#{@channel.id}"
    @listener = new Bp.Backpusher @pusher, @blocks

  checkUserAbilities: (collaborators) ->
    collaborator = _.contains collaborators.pluck('id'), mediator.shared.current_user.id

    if collaborator or mediator.shared.current_user.canAddToChannel(@channel)
      @setupNewBlockView()
      @setupFileDropView()

      @$('.grid').addClass 'is-addable'

    if collaborator or mediator.shared.current_user.canEditChannel(@channel)
      @$('.grid').addClass 'is-editable'
      @$('.channel-settings').addClass 'is-editable'

      @setupVisibilityView()
      @setupShareLinkView()

      mediator.trigger 'channel:is-editable'

  setupFileDropView:->
    $.ajax
      url: "#{sd.API_URL}/uploads/policy"
      success: (policy) =>
        new ChannelFileDropView
          el: @$el
          channel: @channel
          blocks: @blocks
          policy: policy

  setupNewBlockView: ->
    should_render = if mediator.shared.current_user.canAddToChannel(@channel) then false else true

    if should_render
      new NewBlockView
        el: $ ".grid__block--new-block"
        container: $ '.grid'
        model: @channel
        blocks: @blocks
        autoRender: should_render

  setupVisibilityView: ->
    @channelVisibilityView = new ChannelVisibilityView
      el: @$ "#metadata--privacy .metadata__content"
      model: @channel
      autoSync: true

      @channel.on 'change:status', @updateTitle, @

  setupShareLinkView: ->
    @shareLinkView = new ShareLinkView
      el: @$ "#metadata--share .metadata__content"
      model: @channel

  updateTitle: =>
    $('.path__channel').removeClass (index, css) ->
      klass = css.match (/(^|\s)privacy-\S+/g) || []
      return klass.join(' ')
    $('.path__channel').addClass "privacy-#{@channel.get('status')}"

module.exports.init = ->
  current_user = mediator.shared.current_user
  channel = new Channel sd.CHANNEL
  blocks = new ChannelBlocks sd.BLOCKS,
    channel_slug: sd.CHANNEL.slug

  new ChannelView
    el: $ "body"
    channel: channel
    blocks: blocks

  new BlockCollectionView
    el: $ ".grid"
    channel: channel
    blocks: blocks

  collaborators = new Collaborators
    channel_slug: channel.get('slug')

  new ChannelCollaborationView
    collection: collaborators
    el: $("#metadata--collaborators .metadata__content")
    isCollaboration: channel.has('collaboration')
    isEditable: mediator.shared.current_user.canEditChannel channel
    channel: channel

  if not sd.FOLLOWERS

    new BlockSkeletonView
      collection: blocks
      channel: channel
      el: $ ".grid"

    if current_user.canAddToChannel channel
      new NewBlockView
        el: $ ".grid__block--new-block"
        model: channel
        blocks: blocks
