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