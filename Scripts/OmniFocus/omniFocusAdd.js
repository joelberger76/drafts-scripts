//OmniFocus Add

//Add tasks to OmniFocus using modified TaskPaper syntax

//Default due time
const defaultDueTime = "23:55";

const baseURL = "omnifocus:///paste";
var cb = CallbackURL.create();
cb.baseURL = baseURL;

var sendToOmniFocus = '';

var lines = draft.content.trim().split('\n');
var linesArrayLength = lines.length - 1;
var task = '';

 //Assume project is inbox
 var target = "inbox";

for(var ix in lines) {
   task = lines[ix];

   if (task.length > 0) {
      var dueMatch = '';
      var timeMatch = '';

      //Check task for due date [@due(]
      dueMatch = task.match(/@due\([^\)]+/);
      if (dueMatch) {
         //Check for the existence of time (:, am, pm)
         var regex = new RegExp(":|am|pm", "i");
         timeMatch = dueMatch[0].match(regex);
         if (!timeMatch) {
            //Add default time
            var formattedDate = dueMatch[0] + " " + defaultDueTime;
            task = task.replace(dueMatch[0], formattedDate); 
         }
      }

      //Check for project using @project syntax
      projMatch = task.match(/@project\((.*?)\)/);
      if (projMatch) {
         target = "/task/" + projMatch[1];
         task = task.replace(projMatch[0], "");
      }

      //Peek for Action Group, otherwise send to OmniFocus
      if (ix < linesArrayLength && task.trim().substr(0, 1) == "-" && lines[parseInt(ix) + 1].trim().substr(0,1) == "-" && lines[parseInt(ix) + 1].substr(0,1) != "-") {
         sendToOmniFocus = sendToOmniFocus + '\n' + task;
      }
      else {
         //Send Task to OmniFocus
         if (sendToOmniFocus) {
            sendToOmniFocus = sendToOmniFocus + '\n' + task;
         }
         else {
            sendToOmniFocus = task;
         }
         cb.addParameter("target", target);
         cb.addParameter("content", sendToOmniFocus);

         var success = cb.open();
         if (success) {
	          console.log("TaskPaper added to OmniFocus");
         }
         else { 
            console.log(cb.status);
            console.log("Task: " + sendToOmniFocus);
            if (cb.status == "cancel") {
               context.cancel();
            }
            else {
               context.fail();
            }
         }
         //Reset for next task
         var target = "inbox";
         sendToOmniFocus = '';
      }
   }
   else {
      console.log("Blank line - skipped");
   }
}