//= require vimeo_wrapper
//= require vimeo_template

/*
  This will be responsible for fetching data for a given url 
  from vimeo_wrapper by loading it in a specified div.
*/

window.VIMEO_FETCHER = function() {}

VIMEO_FETCHER.prototype = {

  url: null,

  vimeo_wrapper: null, 

  duration_callback: null,

  init: function(url, id, callback)
  {
    this.url = url;
    this.duration = null;
    this.duration_callback = callback;

    // Instead of passing in a selector, pass in an ID and create
    // a new iframe for the querying. 

    var frame = (new VIMEO_TEMPLATE).build(this.url, false, "loader-" + id);
    $('#loading_area').append(frame);

    this.vimeo_wrapper = new VIMEO_WRAPPER();
    this.vimeo_wrapper.init($('#loader-' + id));

    if (this.vimeo_wrapper.player_ready)
    {
      this.vimeo_wrapper.get_duration(this.duration_callback);
    }
    else 
    {
      this.vimeo_wrapper.add_ready_listener(this.set_duration_callback.bind(this));
    }
  },

  set_duration_callback: function(data)
  {
    var $this = this;
    this.vimeo_wrapper.get_duration(this.duration_callback);
    // this.vimeo_wrapper.get_duration(function(duration, url)
    // {
    //   if ($this.url == url)
    //   {
    //     $this.duration = duration;        
    //   }
    //   $this.vimeo_wrapper.ready_listener = null;
    // });
  },

  duration: null
}