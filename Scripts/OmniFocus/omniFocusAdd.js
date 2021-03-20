//OmniFocus Add
//Add tasks to OmniFocus using Transport Text syntax

const macBaseURL = "kmtrigger://macro=Add%20Task%20to%20OmniFocus&value=";
const iOSBaseURL = "shortcuts://x-callback-url/run-shortcut";
var success = '';

if (device.systemName == 'iOS') {
   var cb = CallbackURL.create();
   cb.baseURL = iOSBaseURL;
   cb.addParameter("name", "Add Task to OmniFocus");
   cb.addParameter("input", "text");
}

let lines = draft.content.trim().split('\n');

for (var ix in lines) {
   task = lines[ix].trim();

   if (task.length > 0) {
      //Send Task to OmniFocus
      if (device.systemName == 'iOS') {
         cb.addParameter("text", task);
         success = cb.open();
         //success = app.openURL(iOSBaseURL + encodeURIComponent(task));
      }
      else {
         //macOS
         success = app.openURL(macBaseURL + encodeURIComponent(task));
      }
      
      if (success) {
         console.log("Task Added: " + task);
      }
      else { 
         console.log("Task: " + task);
         if (device.systemName == 'iOS') {console.log(cb.status);}
         context.fail();
      }
   }
   else {
      console.log("Blank Line: skipped");
   }
}