//Due

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

var dueDate = "@due(" + sel + ") ";

editor.setSelectedText(dueDate);
editor.setSelectedRange(selRange[0] + dueDate.length,0);

editor.activate();