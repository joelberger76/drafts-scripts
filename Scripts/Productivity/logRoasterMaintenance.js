//Log Roaster Maintenance
require("KB-CoffeeRoasting/coffeeRoastingLib.js");

let maintenanceTypes = ["Full Maintenance", "Cleaning Cycle"];

let p = Prompt.create();
p.title = "Log roaster maintenance";

p.addButton("OK");
p.addPicker("maintenanceType", "Type:", [maintenanceTypes]);
if (p.show()) {
   let maintenanceDateObj = new Date();
   
   var roastObj = {
      "roastDate": maintenanceDateObj, 
      "roastedCoffee": maintenanceTypes[p.fieldValues["maintenanceType"]]
   };
   
   let maintenanceResult = logRoast(roastObj);
   if (!maintenanceResult) {  
         console.log("Fatal error occurred logging roaster maintenance");
         context.fail();
   }
   
   editor.focusModeEnabled = false;
}
else {
   console.log("User cancelled");
   context.fail();
}