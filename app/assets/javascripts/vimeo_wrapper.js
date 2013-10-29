//= require froogaloop

window.VIMEO_WRAPPER = function() {}
VIMEO_WRAPPER.prototype = {
  
  vimeo_frame: null,

  url: null,

  status: 'uninitiated',

  eventCallbacks: {},

  init: function()
  {
    this.vimeo_frame = $('iframe');
    this.url = this.vimeo_frame.attr('src').split('?')[0];
    this.status = 'initiated';

    if (window.addEventListener) 
    {
      window.addEventListener('message', this.on_message_received.bind(this), false)
    }
    else 
    {
      // IE
      window.addEventListener('onmessage', this.on_message_received.bind(this));
    }

    $f(this.vimeo_frame).addEvent('ready', this.ready.bind(this));
  },

  froogaloop: null,

  ready: function()
  {
    console.log('ready!');

    this.froogaloop = $f($('iframe'));

    this.onPlay();
    this.onFinish();

  },

  onPlay: function()
  {
    this.froogaloop.addEvent('play', function(data) {
        console.log('play');
    });
  },

  onFinish: function()
  {
    this.froogaloop.addEvent('finish', function(data) {
        console.log('finish');
    });    
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

    if (this.vimeo_frame[0].contentWindow != null)
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

  add_event_listener: function(event_name, callback)
  {
    this.add_callback(event_name, callback, this.url);
    // this.post('addEventListener', [event_name, callback.name]);    
    // this.post('addEventListener', event_name, callback.name);
    // this.post('addEventListener', event_name, this.vimeo_frame);

    var data = { method: 'addEventListener', value: event_name }; 
    this.vimeo_frame[0].contentWindow.postMessage(JSON.stringify(data), this.vimeo_frame);

  },

  add_play_progress_listener: function(callback)
  {
    this.add_event_listener('playProgress', callback);
  },

  add_play_listener: function(callback)
  {
    this.add_event_listener('play', callback);
  }, 

  add_pause_listener: function(callback)
  {
    this.add_event_listener('pause', callback);
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

  get_callback: function(event_name, target_id)
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

  on_message_received: function(event)
  {
    var data, method;
    console.log('received');
    try 
    {
      data = JSON.parse(event.data);
      method = data.event || data.method;
    }
    catch(e)  
    {
      console.log('Vimeo message received, but an error occurred trying to parse the event data.' + e.message);
    }

    console.log("Vimeo message received: " + method);
    debugger;
    var value = data.value,
        eventData = data.data,
        target_id = target_id === '' ? null : data.player_id,

        callback = this.get_callback(method, target_id),
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

    if (target_id) 
    {
      params.push(target_id);
    }
    return params.length > 0 ? callback.apply(null, params) : callback.call();
  }
}