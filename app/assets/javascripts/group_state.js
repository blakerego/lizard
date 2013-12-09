window.GROUP_STATE = function() {}

GROUP_STATE.prototype = {
  init: function(groups, current_group)
  {
    this.groups = groups;
    this.current_group = current_group;
    this.keys = Object.keys(this.groups);
    this.length = this.keys.length;
    this.current_index = this.keys.indexOf(this.current_group.id.toString());
  }
}