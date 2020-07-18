//Defer

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

var deferDate = "@defer(" + sel + ") ";

editor.setSelectedText(deferDate);
editor.setSelectedRange(selRange[0] + deferDate.length,0);

editor.activate();