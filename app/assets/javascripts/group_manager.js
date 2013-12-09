//= require group
//= require button_drawer
//= require group_state

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

    var group_state = new GROUP_STATE(); 
    group_state.init(this.groups, this.current_group);

    /// Create the generators, pass the generator into the drawer for rendering. 
    var previous_button_generator = new BUTTON_MARKUP_GENERATOR();
    previous_button_generator.init(group_state, "previous");
    (new BUTTON_DRAWER()).draw(previous_button_generator, $('.previous_group'));

    var next_button_generator = new BUTTON_MARKUP_GENERATOR(); 
    next_button_generator.init(group_state, "next");
    (new BUTTON_DRAWER()).draw(next_button_generator, $('.next_group'));


    var $this = this;
    $('.album_btn').on('click', function()
    {
      var group_id = $(this).data()["group_id"];
      $this.switch_group(group_id);
    });
  }

}

