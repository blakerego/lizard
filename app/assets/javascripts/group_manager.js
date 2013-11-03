window.GROUP_MANAGER = function() {}
GROUP_MANAGER.prototype = {

  current_group_id: null,

  default_group_id: null,

  albums: {},

  all_tiles: null,

  init: function(tile_data, default_group_id)
  {
    this.all_tiles = JSON.parse(tile_data);
    this.current_group_id = this.default_group_id = default_group_id;
    this.albums = this.parse_albums(this.all_tiles)

  },

  parse_albums: function(tiles)
  {
    var album_hash = {}

    $.each(this.all_tiles, function(index, tile)
    {
      if (typeof(album_hash[tile.group_id]) === 'undefined')
      {
        album_hash[ tile.group_id ] = [ tile ];
      }
      else 
      {
        album_hash[ tile.group_id ].push( tile );
      }
    });
    return album_hash;
  },

  default_album_tiles: function()
  {
    return this.albums[this.current_group_id];
  }

}

