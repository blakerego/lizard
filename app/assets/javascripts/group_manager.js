window.GROUP_MANAGER = function() {}
GROUP_MANAGER.prototype = {

  default_group_id: null,

  albums: {},

  all_tiles: null,

  init: function(tile_data, default_group_id)
  {
    this.all_tiles = JSON.parse(tile_data);
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
        album_hash[ tile.group_id ] = [ tile ];
      }
      else 
      {
        album_hash[ tile.group_id ].push( tile );
      }
    });
    return album_hash;
  },

  default_group_tiles: function()
  {
    return this.albums[this.default_group_id];
  },

  tiles_for_group: function(group_id)
  {
    return this.albums[group_id];
  }

}

