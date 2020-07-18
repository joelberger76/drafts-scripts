//Due Picker

//Default due time
const defaultDueTime = "23:55";

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

var p = Prompt.create();
p.title = "Due Date";
p.addDatePicker("myDate", "Due date", new Date(), {
  "mode": "date"
});
p.addButton("OK");

p.show();

var dueDate = p.fieldValues["myDate"];
var formattedDue = "@due(" + dueDate.toString("MM/dd/yyyy") + " " + defaultDueTime + ") ";

if (p.buttonPressed == "OK") {
   editor.setSelectedText(formattedDue);
   editor.setSelectedRange(selRange[0] + formattedDue.length,0);
} 
else {
   context.cancel();
}

editor.activate();