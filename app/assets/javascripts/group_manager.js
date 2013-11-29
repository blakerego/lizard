//= require group

/*
  This class is responsible for switching between active groups.
*/
window.GROUP_MANAGER = function() {}
GROUP_MANAGER.prototype = {

  default_group_id: null,

  groups: {},

  all_tiles: null,

  init: function(tile_data, default_group_id)
  {
    this.all_tiles = tile_data;
    this.default_group_id = default_group_id;
    this.groups = this.generate_album_hash(this.all_tiles);
    this.current_group = this.groups[this.default_group_id];
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

  get_duration_data_for_groups: function(callback)
  {
    this.groups[this.default_group_id].get_data_for_tracks(callback);
  }

}

