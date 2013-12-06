

window.BUTTON_MARKUP_GENERATOR = function() {}
BUTTON_MARKUP_GENERATOR.prototype = {

  /*
    Type can be 'previous', or 'next'.
  */
  init: function(group, button_type)
  {
    this.group = group;
    this.button_type = button_type
  },

  create: function()
  {
    id = this.group.id;
    return "<icon class='album_btn " + this.button_type_lookup[this.button_type] + 
      "' data-group_id='" + id.toString() + "'></icon>";
  },

  button_type_lookup: {
    "previous" : "icon-caret-left", 
    "next" : "icon-caret-right"
  }
}

window.BUTTON_DRAWER = function() {}
BUTTON_DRAWER.prototype = {
  
  draw: function(current_index, generator, element, length)
  {
    if  ( (generator.button_type == "previous" && current_index > 0)  || 
          (generator.button_type == "next" && current_index < length -1)
        )
    {
      this.button = generator.create();
    }
    else
    {
      /// Remove group link.
      this.button = "";
    }
    element.html(this.button);    
  }
}
