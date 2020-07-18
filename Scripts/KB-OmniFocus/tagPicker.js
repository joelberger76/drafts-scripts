//Tag Picker

//Get tags from file in iCloud
var fmCloud = FileManager.createCloud(); // iCloud
var tagList = fmCloud.read("/OmniFocusTags.txt");
if (tagList == "undefined") {
  console.log("File not found");
  context.fail();
}

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

//Prompt to select tags
var p = Prompt.create();
p.title = "Select Tags";

var tagArray = tagList.split("\n");
//tagArray.sort();

p.addSelect("tags", "Tags", tagArray, null, true);
p.addButton("OK");

if (p.show()) { // user made a selection
   var selectedTags = "@tags(" + p.fieldValues["tags"].join(", ") + ") ";
   editor.setSelectedText(selectedTags);
   editor.setSelectedRange(selRange[0] + selectedTags.length,0);
}
else { // user cancelled prompt
   context.cancel();
}

editor.activate();