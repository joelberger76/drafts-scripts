//Coffee Roasting Library
//Shared library of coffee roasting functions

//Authentication info
//Returns: Object with properties of token and baseURL
function getAuthInfo() {
   let credential = Credential.create("Airtable (Coffee Roasting)", "Airtable (Coffee Roasting) Key");
   credential.addTextField("endpoint", "Endpoint");
   credential.addPasswordField("apiKey", "API key");
   credential.authorize();
   let endpoint = credential.getValue("endpoint")
   let token = credential.getValue("apiKey");
   let airtableURL = "https://api.airtable.com/v0/" + endpoint;
   
   let authObj = {
      "token": token,
      "baseURL": airtableURL
   }
   
   return authObj;  
}

//Check if a cleaning cycle is required
//(Cleaning within the last 4 roasts does not require a cleaning)
//Returns: Boolean
function isCleaningCycleRequired() {
   let authObj = getAuthInfo();
   
   let queryURL = authObj.baseURL + "/" +
                  encodeURIComponent("Roasting Log") + "?" +
                  "maxRecords=4&sortField=Date&sortDirection=desc";
   
   //Create HTTP and make GET request to Airtable
   let http = HTTP.create();
   let response = http.request({
      "url": queryURL,
      "method": "GET",
      "headers": {"Authorization": "Bearer " + authObj.token}
      });

   //Log result
   console.log(response.statusCode);
   console.log(response.responseText);

   //If not 200 OK, fail the action
   //Otherwise Airtable successfully received post
   if (response.statusCode != 200) {
      context.fail();
   }

   //Parse JSON response and search for cleaning cycle
   let roastArray = JSON.parse(response.responseText).records;
   let cleaningCycle = roastArray.filter(r => r.fields.Name.startsWith("Cleaning Cycle (1900-01-01):"));
   
   return !cleaningCycle.length;
}

//Show warning message using prompt object
//Parameters: Reminder message to display
function showReminder(message) {
   let p = Prompt.create();
   p.title = "Reminder";
   p.message = message;
   p.addButton("OK");
   p.isCancellable = false;
   
   console.log(p.title + ": " + p.message);
   p.show();
}

//Write roasting log record to Airtable
//Parameters: Roast Object: { Roast date, Roasted coffee, Weight in, Weight out, Roast profile,
//                            Roast time, Min voltage, Max voltage, First crack, Second crack, 
//                            Roast level, Notes }
//Returns: True
function logRoast(roast) {
   //Ensure mandatory fields are included
   if (!roast.roastDate || roast.roastDate.toString() == "Invalid Date" ||
       !roast.roastedCoffee) {
      console.log("Roast Date and Coffee are required");
      context.fail();
      return false;
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