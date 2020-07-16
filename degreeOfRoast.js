//Degree of Roast

//Setup Roast Degrees
const roastDegrees = ["City", "City+", "Full City", "Full City+", "Vienna"];

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

//Prompt to select a degree of roast
var p = Prompt.create();
p.title = "Select Degree of Roast";
for (var deg of roastDegrees) {
   p.addButton(deg);
}

if (p.show()) { // user made a selection
   var roast = p.buttonPressed;
   editor.setSelectedText(roast);
   // update the selected range to the end of the inserted text
   editor.setSelectedRange(selRange[0] + roast.length,0);
}
else { // user cancelled prompt
   context.cancel();
}

editor.activate();