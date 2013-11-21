//= require vimeo_wrapper

/*
  This will be responsible for fetching data for a given url 
  from vimeo_wrapper by loading it in a specified div.
*/

window.VIMEO_FETCHER = function() {}

VIMEO_FETCHER.prototype = {

  url: null,

  vimeo_wrapper: null, 

  selector: null,

  init: function(url, selector)
  {
    this.url = url;     


    if (selector !== typeof(undefined) && selector.length > 0)
    {
      this.selector = selector;
      this.selector.attr('src', url);
    }

    this.vimeo_wrapper = new VIMEO_WRAPPER();
    this.vimeo_wrapper.init(selector)

    if (this.vimeo_wrapper.player_ready)
    {
      this.vimeo_wrapper.get_duration(this.set_duration_callback.bind(this));
    }
    else 
    {
      this.vimeo_wrapper.add_ready_listener(this.set_duration_callback.bind(this));
    }
  },

  set_duration_callback: function(data)
  {
    var $this = this;
    this.vimeo_wrapper.get_duration(function(duration)
    {
      $this.duration = duration;
    });
  },

  duration: null
}