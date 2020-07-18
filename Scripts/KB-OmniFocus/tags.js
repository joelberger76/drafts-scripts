//Tags

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

var tags = "@tags(" + sel + ") ";

editor.setSelectedText(tags);
editor.setSelectedRange(selRange[0] + tags.length,0);

editor.activate();