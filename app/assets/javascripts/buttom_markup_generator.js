

window.BUTTON_MARKUP_GENERATOR = function() {}
BUTTON_MARKUP_GENERATOR.prototype = {

  /*
    Type can be 'previous', or 'next'.
  */
  init: function(group_state, button_type)
  {
    this.group_state = group_state;
    this.button_type = button_type;
  },

  create: function()
  {
    id = this.group().id;
    return "<icon class='album_btn " + this.button_icon() + 
      "' data-group_id='" + id.toString() + "'></icon>";
  },

  button_icon: function()
  {
    if (this.button_type == "previous")
    {
      return "icon-caret-left";
    }
    else 
    {
      return "icon-caret-right";
    }
  },

  group: function()
  {
    if (this.button_type == "previous")
    {
      return this.group_state.groups[this.group_state.keys[this.group_state.current_index - 1]];
    }
    else 
    {
      return this.group_state.groups[this.group_state.keys[this.group_state.current_index + 1]];
    }
  },

  is_valid_to_create: function()
  {
    if (this.button_type == "previous")
    {
      return this.group_state.current_index > 0;
    }
    else 
    {
      return this.group_state.current_index < this.group_state.length -1
    }    
  }

}

