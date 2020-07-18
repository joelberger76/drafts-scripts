//Project

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

var project = "@project(" + sel + ") ";

editor.setSelectedText(project);
editor.setSelectedRange(selRange[0] + project.length,0);

editor.activate();