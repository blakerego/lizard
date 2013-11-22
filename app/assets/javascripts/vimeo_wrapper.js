window.VIMEO_WRAPPER = function() {}
VIMEO_WRAPPER.prototype = {
  
  vimeo_frame: null,

  url: null,

  eventCallbacks: {},

  player_ready: false, 

  callback_queue: [],

  duration: null,

  init: function(vimeo_selector)
  {
    this.vimeo_frame = vimeo_selector;
    if (typeof(this.vimeo_frame.attr('src')) !== "undefined" )
    {
      this.url = this.vimeo_frame.attr('src').split('?')[0];
      this.player_ready = false;

      if (window.addEventListener) 
      {
        window.addEventListener('message', this.on_message_received.bind(this), false)
      }
      else 
      {
        // IE
        window.addEventListener('onmessage', this.on_message_received.bind(this));
      }
    }
  },

  post: function(action, value) 
  {
    if (this.vimeo_frame == null)
    {
      return false;
    }
    var data = { method: action }; 
    if (value) 
    {
      data.value = value;
    }

    if (this.vimeo_frame[0].contentWindow != null && this.url != null && this.url != "null")
    {
      this.vimeo_frame[0].contentWindow.postMessage(JSON.stringify(data), this.url);
    }
    return true;
  },

  pause: function()
  {
    this.post('pause');
  },

  play: function()
  {
    this.post('play');
  },

  stop: function()
  {
    this.post('stop');
  }, 

  get_duration: function(callback)
  {
    var target_id = this.url;
    if (!this.eventCallbacks[target_id]) 
    {
      this.eventCallbacks[target_id] = {};
    }
    this.eventCallbacks[target_id]['getDuration'] = callback;
    this.post( 'getDuration', null, this );
  },

  add_event_listener: function(event_name, callback)
  {
    this.add_callback(event_name, callback, this.url);
    if (this.player_ready)
    {
      this.post('addEventListener', event_name, this.vimeo_frame);
    }
    else 
    {
      this.callback_queue.push(event_name);
    }

  },

  add_play_progress_listener: function(callback)
  {
    console.log('adding play progress listener');
    this.add_event_listener('playProgress', callback);
  },

  add_play_listener: function(callback)
  {
    console.log('adding play listener');
    this.add_event_listener('play', callback);
  }, 

  add_pause_listener: function(callback)
  {
    console.log('adding pause listener');
    this.add_event_listener('pause', callback);
  },

  add_finish_listener: function(callback)
  {
    console.log('adding finish listener'); 
    this.add_event_listener('finish', callback);
  },

  add_callback: function(event_name, callback, target_id)
  {
    if (target_id) 
    {
      if (!this.eventCallbacks[target_id]) 
      {
        this.eventCallbacks[target_id] = {};
      }
      this.eventCallbacks[target_id][event_name] = callback;
    }
    else
    {
      this.eventCallbacks[event_name] = callback;
    }
  },

  remove_callback: function(event_name, target_id)
  {
    if (target_id && this.eventCallbacks[target_id]) 
    {
      if (!this.eventCallbacks[target_id][event_name]) 
      {
        return false;
      }
      this.eventCallbacks[target_id][event_name] = null;
    }
    else 
    {
      if (!this.eventCallbacks[event_name]) 
      {
        return false;
      }
      this.eventCallbacks[event_name] = null;
    }
    return true;
  },

  remove_duration_callback: function()
  {
    this.eventCallbacks[this.url]['getDuration'] = null
  },

  get_callback: function(event_name, target_id)
  {
    if (target_id && typeof this.eventCallbacks[target_id] !== "undefined") 
    {
      return this.eventCallbacks[target_id][event_name];
    }
    else 
    {
      return this.eventCallbacks[event_name];
    }  
  },

  ready_callback: null,

  add_ready_listener: function(callback)
  {
    this.ready_callback = callback;
  },


  on_message_received: function(event)
  {
    var data, method;
    data = JSON.parse(event.data);
    method = data.event || data.method;

    // console.log("Vimeo message received: " + method);

    if (method == 'ready')
    {
      this.player_ready = true; 
      while (this.callback_queue.length > 0)
      {
        /// Dequeue events
        var event_name = this.callback_queue.shift();
        this.post('addEventListener', event_name, this.vimeo_frame);
      }

      if (this.ready_callback != null)
      {
        this.ready_callback.call();
      }
    }
    else 
    {
      var value = data.value,
          eventData = data.data,
          callback = this.get_callback(method, this.url),
          params = [];

      if (!callback) 
      {
        return false;
      }

      if (value !== undefined) 
      {
        params.push(value);
      }

      if (eventData) 
      {
        params.push(eventData);
      }

      // if (method == 'getDuration')
      // {
      //   console.log('duration on ' + this.url + ' ' + value);
      // }

      if (this.url != null)
      {
        params.push(this.url)
      }
      return params.length > 0 ? callback.apply(null, params) : callback.call();
    } 
  }
}