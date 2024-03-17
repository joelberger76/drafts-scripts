//Project Picker

//Get projects from file in iCloud
var fmCloud = FileManager.createCloud(); // iCloud
var projectList = fmCloud.read("/OmniFocusProjects.txt");
if (projectList == "undefined") {
  console.log("File not found");
  context.fail();
}

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

//Prompt to select project
var p = Prompt.create();
p.title = "Select Project";

var projectArray = projectList.split("\n");
projectArray.sort();

p.addSelect("project", "Projects", projectArray, [projectArray[0]], false);
p.addButton("OK");

if (p.show()) { // user made a selection
   var selectedProject = "@project(" + p.fieldValues["project"] + ") ";
   editor.setSelectedText(selectedProject);
   editor.setSelectedRange(selRange[0] + selectedProject.length,0);
}
else { // user cancelled prompt
   context.cancel();
}

editor.activate();