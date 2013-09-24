CKEDITOR.editorConfig = function( config )
{
  config.toolbar = 'MyToolbar';
  config.toolbar_MyToolbar =
    [
      { name: 'basicstyles', items : [ 'Bold','Italic'] },
      { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Blockquote' ] },
      { name: 'insert', items : [ 'Image'] },
      { name: 'clipboard', items : [ 'Undo','Redo' ] },
      { name: 'links', items : [ 'Link','Unlink'] }
    ];

  // The default plugins included in the basic setup define some buttons that
  // we don't want too have in a basic editor. We remove them here.
  config.removeButtons = 'Anchor,Underline,Strike,Subscript,Superscript';

  // Considering that the basic setup doesn't provide pasting cleanup features,
  // it's recommended to force everything to be plain text.
  config.forcePasteAsPlainText = false;

  // Let's have it basic on dialogs as well.
  //config.removeDialogTabs = 'link:advanced';
  config.extraPlugins = 'image';
  config.removePlugins = 'elementspath';
};
