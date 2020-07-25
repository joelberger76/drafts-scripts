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
            minVoltage = keyValueObj.value;
         }
         else if (keyValueObj.key == "Max Voltage") {
            maxVoltage = keyValueObj.value;
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
p.title = "Log roast?";
p.isCancellable = false;

p.addButton("Yes");
p.addButton("No");
p.addSwitch("cleaningCycle", "Include cleaning cycle", false);
p.show();

let cleaningCycle = p.fieldValues["cleaningCycle"];

if (p.buttonPressed == "Yes") {
   let roastDateObj = new Date(roastDate); //Preserve time zone
   
   var roastObj = {
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
   
   logRoast(roastObj);

   if (cleaningCycle) {
      let adjDateObj = roastDateObj;
      adjDateObj.setSeconds(adjDateObj.getSeconds()+1);
      logRoast(adjDateObj, "Cleaning Cycle");
   }
   else {
      //Alert if a cleaning cycle is required next roast
      if (isCleaningCycleRequired()) {
         showReminder("A cleaning cycle is required after next roast");
      }
   }
   
   editor.focusModeEnabled = false;
}
else {
   console.log("User cancelled");
   context.fail();
}


//Convert time (duration) to seconds
//Parameters: Time (duration)
//Returns: Duration in seconds
function timeToSeconds(duration) {
   let splitDuration = duration.split(':');
   let seconds = (+splitDuration[0]) * 60 + (+splitDuration[1]);
   if (duration.substr(0, 1) == "-") {
      seconds = seconds * -1;
   }

   return seconds;
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

//Lookup Coffee record ID
//Parameters: Coffee name
//Returns: Coffee record ID
function getCoffeeRecord(coffeeName) {
   let authObj = getAuthInfo();
   
   //Create HTTP and make GET request to Airtable
   let http = HTTP.create();
   let response = http.request({
      "url": authObj.baseURL + "/Coffee?filterByFormula=" + encodeURIComponent("FIND(\"" + coffeeName + "\", {Coffee})") + "&" + encodeURIComponent("sort[0][field]") + "=Purchase+Date&" + encodeURIComponent("sort[0][direction]") + "=desc",
      "method": "GET",
      "headers": {"Authorization": "Bearer " + authObj.token}
      });

   // log result
   console.log(response.statusCode);
   console.log(response.responseText);

   // if not 200 OK, fail the action
   // Otherwise Airtable successfully received post
   if (response.statusCode != 200) {
	   context.fail();
   }

   //Parse JSON response - get most recently purchased instance if multiple
   let responseArray = JSON.parse(response.responseText);
   let coffeeRecord = responseArray["records"][0].id;
   
   return coffeeRecord;
}

//Write roasting log record to Airtable
//Parameters: Roast Object: { Roast date, Roasted coffee, Weight in, Weight out, Roast profile,
//                            Roast time, Min voltage, Max voltage, First crack, Second crack, 
//                            Roast level, Notes }
//Returns: True
function logRoast(roast) {
   //Ensure mandatory fields are included
   if (!roast.roastDate || !roast.roastedCoffee) {
      console.log("Roast Date and Coffee are required");
      context.fail();
   }
   
   //Convert times to seconds
   if (roast.roastTime) {
      var roastTimeSeconds = timeToSeconds(roast.roastTime);
   }
   if (roast.firstCrack) {
      var firstCrackSeconds = timeToSeconds(roast.firstCrack);
   }
   if (roast.secondCrack) {
      var secondCrackSeconds = timeToSeconds(roast.secondCrack);
   }

   //Get coffee record
   let coffeeRecord = getCoffeeRecord(roast.roastedCoffee);

   //Build roast log payload
   let fields = {
      "Date": roast.roastDate.toString(),
      "Coffee": [coffeeRecord]
   }

   //Add optional fields to payload
   if (roast.weightIn) {
      fields["Weight In (oz)"] = parseFloat(roast.weightIn);
   }
   if (roast.weightOut) {
      fields["Weight Out (oz)"] = parseFloat(roast.weightOut);
   }
   if (roast.roastProfile) {
      fields["Roast Profile"] = roast.roastProfile;
   }
   if (roast.roastTime) {
      fields["Roast Time"] = roastTimeSeconds;
   }
   if (roast.roastLevel) {
      fields["Roast"] = roast.roastLevel;
   }
   if (roast.minVoltage) {
      fields["Min Voltage"] = Number(roast.minVoltage);
   }
   if (roast.maxVoltage) {
      fields["Max Voltage"] = Number(roast.maxVoltage);
   }
   if (roast.firstCrack) {
      fields["First Crack"] = firstCrackSeconds;
   }
   if (roast.secondCrack) {
      fields["Second Crack"] = secondCrackSeconds;
   }
   if (roast.notes) {
      fields["Notes"] = roast.notes;
   }

   let authObj = getAuthInfo();

   //Submit record to Airtable
   //Create HTTP and make POST request to Airtable to insert record
   let http = HTTP.create();
   let response = http.request({
     "url": authObj.baseURL + "/Roasting%20Log",
     "method": "POST",
     "headers": {
        "Authorization": "Bearer " + authObj.token,
        "Content-type": "application/json"
     },  
     "data": {
        "fields": fields
     }
   });

   // log result
   console.log(response.statusCode);
   console.log(response.responseText);

   // if not 200 OK, fail the action
   // Otherwise Airtable successfully received post
   if (response.statusCode != 200) {
	   context.fail();
   }

   return true;
}