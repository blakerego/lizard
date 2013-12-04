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
    this.group_switch_events = [];
    this.modify_album_links();
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
    this.groups[this.current_group.id].get_data_for_tracks(callback);
  },

  switch_group: function(group_id)
  {
    this.current_group = this.groups[group_id];
    var length = this.group_switch_events.length; 
    for(var i=0; i < length; i++)
    {
      this.group_switch_events[i].call(this, group_id);
    }
    this.modify_album_links();
  },

  bind: function(event_name, callback)
  {
    if (event_name == "group_switch")
    {
      this.group_switch_events.push(callback)
    }
  },

  modify_album_links: function()
  {
    var keys = Object.keys(this.groups);
    var length = keys.length;
    var current_index = Object.keys(this.groups).indexOf(this.current_group.id.toString());

    if (current_index > 0)
    {
      /// Draw next group link.
      var previousId = this.groups[keys[current_index - 1]].id;
      var icon = "<icon class='icon-caret-left album_btn' data-group_id='" + 
                    previousId.toString() + "'></icon>";

      $('.previous_group').html(icon);
    }
    else
    {
      /// Remove previous group link.
      $('.previous_group').html("");
    }

    if (current_index < length -1)
    {
      /// Draw next group link.
      var nextId = this.groups[keys[current_index + 1]].id;
      var icon = "<icon class='icon-caret-right album_btn' data-group_id='" + 
                    nextId.toString() + "'></icon>";
      $('.next_group').html(icon);
    }
    else 
    {
      /// Remove next group link.
      $('.next_group').html("");
    }

    var $this = this;
    $('.album_btn').on('click', function()
    {
      var group_id = $(this).data()["group_id"];
      $this.switch_group(group_id);
    });
  }

}

