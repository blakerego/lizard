//= require group

window.GROUP_MANAGER = function() {}
GROUP_MANAGER.prototype = {

  default_group_id: null,

  albums: {},

  album_length: {},

  all_tiles: null,

  init: function(tile_data, default_group_id)
  {
    this.all_tiles = tile_data;
    this.default_group_id = default_group_id;
    this.albums = this.generate_album_hash(this.all_tiles)

  },

  generate_album_hash: function(tiles)
  {
    var album_hash = {}

    $.each(this.all_tiles, function(index, tile)
    {
      if (typeof(album_hash[tile.group_id]) === 'undefined')
      {
        var group = new GROUP();
        group.init( tile.group_id );
        album_hash[ tile.group_id ] = group;
      }
      album_hash[ tile.group_id ].add_track_for_tile(tile)

    });
    return album_hash;
  },

  default_group_tiles: function()
  {
    return this.albums[this.default_group_id]
          .tracks.map(function(track)
          {
            return track.tile;
          });
  },

  tiles_for_group: function(group_id)
  {
    return this.albums[group_id]
          .tracks.map(function(track)
          {
            return track.tile;
          });
  }

}

