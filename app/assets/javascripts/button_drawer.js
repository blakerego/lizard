//= require buttom_markup_generator

window.BUTTON_DRAWER = function() {}
BUTTON_DRAWER.prototype = {
  
  draw: function(generator, element)
  {
    if  ( generator.is_valid_to_create() )
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
