#
# Collection for a group of Blocks for a user
#

SearchBlocks = require("./search_blocks.coffee")
sd = require("sharify").data
_ = require 'underscore'
Block = require("../models/block.coffee")
params = require 'query-params'

module.exports = class UserBlocks extends SearchBlocks
  url: -> "#{sd.API_URL}/user/#{@slug}/search?#{params.encode(@options)}"

  initialize: (models, options) ->
    super
    @slug = options.user_slug

  parse: (data) ->
    @total_pages = data.total_pages

    channel_ids = _.pluck data.channels, 'id'

    existing_channel_ids = _.pluck @getAllWithClass('Channel'), 'id'

    channel_ids = channel_ids.concat(existing_channel_ids)

    grouped_blocks = _.groupBy data.blocks, (block) ->
      ids = _.intersection channel_ids, block.channel_ids
      return (if ids? then ids[0] else 'undefined')

    for id in _.keys grouped_blocks
      if grouped_blocks[id]
        channel = _.findWhere data.channels, id: id
        channel = @findWhere({class: 'Channel', id: id})?.attributes if !channel
        grouped_blocks[id].unshift channel if channel

    collection = _.flatten _.values grouped_blocks

    collection.concat(grouped_blocks['undefined']) if grouped_blocks['undefined']

    collection

