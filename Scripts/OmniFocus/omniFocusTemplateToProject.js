//OmniFocus Template to Project

//Build a project from an OmniFocus template using TaskPaper syntax, «placeholders» are prompted for population
//[OmniFocus TaskPaper Reference Guide](https://support.omnigroup.com/omnifocus-taskpaper-reference/)

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

var projectDraft = draft.content.trim();
var promptSelection = true;

//Find unique placeholders and prompt for replacement
var placeholderArray = projectDraft.match(/«(.*?)»/g);
if (placeholderArray) {
   var uniquePlaceholderArray = placeholderArray.filter(onlyUnique);

   for(var ix in uniquePlaceholderArray) {
      var p = Prompt.create();
      p.title = "Populate Placeholder";
      p.addButton("OK");
      p.addTextField("placeholderValue", uniquePlaceholderArray[ix], "", {"wantsFocus": true});

      if (p.show()) { // user made a selection
         var regex = new RegExp(uniquePlaceholderArray[ix], "g");
         projectDraft = projectDraft.replace(regex, p.fieldValues["placeholderValue"]);
      }
      else { // user cancelled prompt
         context.cancel();
         console.log("Prompt canceled");
         promptSelection = false;
         break;
      }
   }
}

//Prompts weren't cancelled, send to OmniFocus
if (promptSelection) {
   const baseURL = "omnifocus:///paste";
   var cb = CallbackURL.create();
   cb.baseURL = baseURL;
   cb.addParameter("target", "projects");
   cb.addParameter("content", projectDraft);
   var success = cb.open();
   if (success) {
	    console.log("Project added to OmniFocus");
   }
   else { 
      console.log(cb.status);
      if (cb.status == "cancel") {
         context.cancel();
      }
      else {
         context.fail();
      }
   }
}