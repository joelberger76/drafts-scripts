//Placeholder

// See online documentation for examples
// http://getdrafts.com/scripting

editor.setSelectedText("«" + editor.getSelectedText() + "»");

var selected = editor.getSelectedRange();
selected = selected[0] + selected[1] - 1;
editor.setSelectedRange(selected, 0);