//= require group_manager

window.GROUP_PROGRESS_BAR = function() {}
GROUP_PROGRESS_BAR.prototype = {

  selector: null,

  group_manager: null,

  tracks: null,

  init: function(selector, group_manager, tile_layout)
  {
    this.selector = selector;
    this.group_manager = group_manager;
    this.tile_layout = tile_layout;
    this.current_track_index = -1;
    this.track_progress_percentage = 0;
    this.track_progress_seconds = 0;
    this.group_duration_sum = -1;

    /// Load the necessary progress data and bind to callback.
    this.group_manager.get_duration_data_for_groups(this.progress_data_ready.bind(this));

    /// Bind to layout events.
    this.tile_layout.bind('tile_selected', this.handle_tile_selected.bind(this));
    this.tile_layout.bind('track_progress', this.handle_track_progress.bind(this));
    this.group_manager.bind('group_switch', this.handle_group_switch.bind(this));
  },

  progress_data_ready: function(tracks)
  {
    /// This signals that the data necessary is ready to go.
    this.tracks = tracks;
    this.selector.css('width', 0);
    $('.progress_bar_container').fadeIn(500);

    this.duration_array = this.tracks
            .map(function(track) { return track.duration; } );

    this.group_duration_sum = this.duration_array
            .reduce(function(previousValue, currentValue, index, array) 
              { return previousValue + currentValue; }, 0);
    this.handle_tile_selected(this.tile_layout.current_tile)
  },

  handle_tile_selected: function(tile)
  {
    if (this.tracks != null && tile != null)
    {
      this.current_track_index = this.tracks
                .map(function(track) { return track.id; } )
                .indexOf(tile.data()['id']);
      this.track_progress_percentage = 0;
      this.update_progress_bar();
    }
  },

  handle_track_progress: function(data)
  {
    this.track_progress_percentage = data['percentage'];
    this.track_progress_seconds = data['seconds'];
    this.update_progress_bar();
  },

  handle_group_switch: function(group_id)
  {
    this.group_manager.get_duration_data_for_groups(this.progress_data_ready.bind(this));
  },

  sum_prev_track_duration: function()
  {
    var sum = 0;

    for (var i=0; i< this.current_track_index; i++)
    {
      sum += this.duration_array[i];
    }
    return sum;
  },

  calculate_current_progress: function()
  {
    return 100*(this.sum_prev_track_duration() + this.track_progress_seconds) / 
      this.group_duration_sum;
  },

  update_progress_bar: function()
  {
    var current_percentage = parseFloat(this.selector[0].style['width']);
    var new_percentage = this.calculate_current_progress();
    var diff = Math.abs(new_percentage - current_percentage);
    var perc_string = new_percentage.toString() + "%";
    if (diff > 5)
    {
      this.selector.animate({
        width: perc_string
      });
    }
    else
    {
      this.selector.css('width', perc_string);
    }
  }
}