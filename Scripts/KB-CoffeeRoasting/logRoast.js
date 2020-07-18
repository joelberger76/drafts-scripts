//Log Roast

//Authentication info
//Returns: Object with properties of token and baseURL
function getAuthInfo() {
   var credential = Credential.create("Airtable (Coffee Roasting)", "Airtable (Coffee Roasting) Key");
   credential.addTextField("endpoint", "Endpoint");
   credential.addPasswordField("apiKey", "API key");
   var endpoint = credential.getValue("endpoint")
   var token = credential.getValue("apiKey");
   var airtableURL = "https://api.airtable.com/v0/" + endpoint;
   
   var authObj = {
      "token": token,
      "baseURL": airtableURL
   }
   
   return authObj;
   
}

//Convert time (duration) to seconds
//Parameters: Time (duration)
//Returns: Duration in seconds
function timeToSeconds(duration) {
   var splitDuration = duration.split(':');
   var seconds = (+splitDuration[0]) * 60 + (+splitDuration[1]);
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
   var splitArray = combinedString.split(delimiter);
   if (splitArray.length > 1) {
      var key = splitArray.shift().trim();
      var value = splitArray.join(delimiter).trim();

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
   var authObj = getAuthInfo();
   
   //Create HTTP and make GET request to Airtable
   var http = HTTP.create();
   var response = http.request({
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
   var responseArray = JSON.parse(response.responseText);
   var coffeeRecord = responseArray["records"][0].id;
   
   return coffeeRecord;
}

//Write roasting log record to Airtable
//Parameters: Roast date, Roasted coffee, Weight in, Weight out, Roast profile,
//            Roast time, First crack, Second crack, Roast level, Notes
//Returns: True
function logRoast(roastDate, roastedCoffee, weightIn, weightOut, roastProfile, roastTime, firstCrack, secondCrack, roastLevel, notes) {
   //Ensure mandatory fields are included
   if (!roastDate || ! roastedCoffee) {
      console.log("Roast Date and Coffee are required");
      context.fail();
   }
   
   //Convert times to seconds
   if (roastTime) {
      var roastTimeSeconds = timeToSeconds(roastTime);
   }
   if (firstCrack) {
      var firstCrackSeconds = timeToSeconds(firstCrack);
   }
   if (secondCrack) {
      var secondCrackSeconds = timeToSeconds(secondCrack);
   }

   //Get coffee record
   var coffeeRecord = getCoffeeRecord(roastedCoffee);

   //Build roast log payload
   var fields = {
      "Date": roastDate.toString(),
      "Coffee": [coffeeRecord]
   }

   //Add optional fields to payload
   if (weightIn) {
      fields["Weight In (oz)"] = parseFloat(weightIn);
   }
   if (weightOut) {
      fields["Weight Out (oz)"] = parseFloat(weightOut);
   }
   if (roastProfile) {
      fields["Roast Profile"] = roastProfile;
   }
   if (roastTimeSeconds) {
      fields["Roast Time"] = roastTimeSeconds;
   }
   if (roastLevel) {
      fields["Roast"] = roastLevel;
   }
   if (firstCrack) {
      fields["First Crack"] = firstCrackSeconds;
   }
   if (secondCrack) {
      fields["Second Crack"] = secondCrackSeconds;
   }
   if (notes) {
      fields["Notes"] = notes;
   }

   var authObj = getAuthInfo();

   //Submit record to Airtable
   //Create HTTP and make POST request to Airtable to insert record
   var http = HTTP.create();
   var response = http.request({
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

//MAIN PROGRAM STARTS HERE
var roastDate = "";
var roastedCoffee = "";
var weightIn = "";
var weightOut = "";
var roastProfile = "";
var roastTime = "";
var firstCrack = "";
var secondCrack = "";
var roastLevel = "";
var notes = "";

var lines = draft.content.trim().split('\n');
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
      var keyValueObj = splitKeyValue(lines[ix], ":");
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

var p = Prompt.create();
p.title = "Log roast?";
p.isCancellable = false;

p.addButton("Yes");
p.addButton("No");
p.addSwitch("cleaningCycle", "Include cleaning cycle", false);
p.show();

var cleaningCycle = p.fieldValues["cleaningCycle"];

if (p.buttonPressed == "Yes") {
   var roastDateObj = new Date(roastDate); //Preserve time zone
   
   logRoast(roastDateObj, roastedCoffee, weightIn, weightOut, roastProfile, roastTime, firstCrack, secondCrack, roastLevel, notes);

   if (cleaningCycle) {
      var adjDateObj = roastDateObj;
      adjDateObj.setSeconds(adjDateObj.getSeconds()+1);
      logRoast(adjDateObj, "Cleaning Cycle");
   }
   
   editor.focusModeEnabled = false;
}
else {
   console.log("User cancelled");
   context.fail();
}