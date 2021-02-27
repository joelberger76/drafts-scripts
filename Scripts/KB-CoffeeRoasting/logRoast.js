//Log Roast
require("KB-CoffeeRoasting/coffeeRoastingLib.js");

let roastDate = "";
let roastedCoffee = "";
let weightIn = "";
let weightOut = "";
let roastProfile = "";
let roastTime = "";
let minVoltage = "";
let maxVoltage = "";
let firstCrack = "";
let secondCrack = "";
let roastLevel = "";
let notes = "";

let lines = draft.content.trim().split('\n');
for(var ix in lines) {
   //Notes begin with *
   if (lines[ix][0] == "*" && lines[ix].trim().length > 1) {
     if(notes) {
        notes = notes + '\n' + lines[ix].trim();
     }
     else {
        notes = lines[ix].trim();
     }
   }
   else {
      let keyValueObj = splitKeyValue(lines[ix], ":");
      if (keyValueObj && keyValueObj.value) {
         if (keyValueObj.key == "Coffee") {
            roastedCoffee = keyValueObj.value;
         }
         else if (keyValueObj.key == "Weight In") {
            weightIn = keyValueObj.value.replace("oz", "").trim();
         }
         else if (keyValueObj.key == "Profile") {
            roastProfile = keyValueObj.value;
         }
         else if (keyValueObj.key == "Roast Time") {
            roastTime = keyValueObj.value;
         }
         else if (keyValueObj.key == "Date/Time") {
            roastDate = keyValueObj.value;
         }
         else if (keyValueObj.key == "Min Voltage") {
            minVoltage = keyValueObj.value.replace("v", "").trim();
         }
         else if (keyValueObj.key == "Max Voltage") {
            maxVoltage = keyValueObj.value.replace("v", "").trim();
         }
         else if (keyValueObj.key == "First Crack") {
            firstCrack = keyValueObj.value;
         }
         else if (keyValueObj.key == "Second Crack") {
            secondCrack = keyValueObj.value;
         }
         else if (keyValueObj.key == "Weight Out") {
            weightOut = keyValueObj.value.replace("oz", "").trim();
         }
         else if (keyValueObj.key == "Roast") {
            roastLevel = keyValueObj.value;
         }
      }
   }
}

let p = Prompt.create();
p.title = "Log roast";
p.addButton("OK");
p.addSwitch("cleaningCycle", "Include cleaning cycle", false);

if (p.show()) {
   let cleaningCycle = p.fieldValues["cleaningCycle"];
   let roastDateObj = new Date(roastDate); //Preserve time zone
   
   let roastObj = {
      "roastDate": roastDateObj, 
      "roastedCoffee": roastedCoffee, 
      "weightIn": weightIn, 
      "weightOut": weightOut, 
      "roastProfile": roastProfile, 
      "roastTime": roastTime,
      "minVoltage": minVoltage,
      "maxVoltage": maxVoltage,
      "firstCrack": firstCrack, 
      "secondCrack": secondCrack, 
      "roastLevel": roastLevel, 
      "notes": notes
   };
   
   let roastResult = logRoast(roastObj);
   if (roastResult) {
      if (cleaningCycle) {
         let cleaningDateObj = new Date();
         let cleaningCycleObj = {
            "roastDate": cleaningDateObj, 
            "roastedCoffee": "Cleaning Cycle"
         };
         let cleaningResult = logRoast(cleaningCycleObj);
         if (!cleaningResult) {
            console.log("Fatal error occurred logging cleaning cycle");
            context.fail();
         }
      }
      else {
         //Alert if a cleaning cycle is required next roast
         if (isCleaningCycleRequired()) {
            showReminder("A cleaning cycle is required after next roast");
         }
      }
   }
   else {   
         console.log("Fatal error occurred logging roast");
         context.fail();
   }
   
   editor.focusModeEnabled = false;
}
else {
   console.log("User cancelled");
   context.fail();
}

//Split the first instancd on the delimiter to become the key,
//remaining is the value, spaces trimmed
//If delimiter can't be found, return false
//Parameters: A string, delimiter
//Returns: Object with properties of key and value
function splitKeyValue (combinedString, delimiter) {
   let splitArray = combinedString.split(delimiter);
   if (splitArray.length > 1) {
      let key = splitArray.shift().trim();
      let value = splitArray.join(delimiter).trim();

      var keyValueObj = {
         "key": key,
         "value": value
      }
   
      return keyValueObj;
   }
   else {
      return false;
   }
}