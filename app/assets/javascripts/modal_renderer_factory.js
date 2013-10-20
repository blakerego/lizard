//= require video_modal_renderer
//= require audio_modal_renderer

window.MODAL_RENDERER_FACTORY = function() {}
MODAL_RENDERER_FACTORY.prototype = {
  get: function(type)
  {
    if (type =='video')
    {
      return new VIDEO_MODAL_RENDERER();
    } 
    else 
    {
      return new AUDIO_MODAL_RENDERER();
    }   
  }
}
