//Defer Picker

//Default defer time
const defaultDeferTime = "00:00";

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

var p = Prompt.create();
p.title = "Defer Date";
p.addDatePicker("myDate", "Defer date", new Date(), {
  "mode": "date"
});
p.addButton("OK");

p.show();

var deferDate = p.fieldValues["myDate"];
var formattedDefer = "@defer(" + deferDate.toString("MM/dd/yyyy") + " " + defaultDeferTime + ") ";

if (p.buttonPressed == "OK") {
   editor.setSelectedText(formattedDefer);
   editor.setSelectedRange(selRange[0] + formattedDefer.length,0);
} 
else {
   context.cancel();
}

editor.activate();