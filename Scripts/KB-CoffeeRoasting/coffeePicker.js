//Coffee Picker

var credential = Credential.create("Airtable (Coffee Roasting)", "Airtable (Coffee Roasting) Key");
credential.addTextField("endpoint", "Endpoint");
credential.addPasswordField("apiKey", "API key");
var endpoint = credential.getValue("endpoint")
var token = credential.getValue("apiKey");
var airtableURL = "https://api.airtable.com/v0/" + endpoint;

// create HTTP and make GET request to Airtable
var http = HTTP.create();
var response = http.request({
   "url": airtableURL + "/Coffee?view=Active",
   "method": "GET",
   "headers": {"Authorization": "Bearer " + token}
   });

// log result
console.log(response.statusCode);
console.log(response.responseText);

// if not 200 OK, fail the action
// Otherwise Airtable successfully received post
if (response.statusCode != 200) {
	context.fail();
}

//Parse JSON response and build sorted project list
var responseArray = JSON.parse(response.responseText);
var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

//Prompt to select a coffee
var p = Prompt.create();
p.title = "Select Coffee";

for(var ix in responseArray["records"]) {
   p.addButton(responseArray["records"][ix].fields.Coffee);
}

if (p.show()) { // user made a selection
   var greenCoffee = p.buttonPressed;
   editor.setSelectedText(greenCoffee);
   editor.setSelectedRange(selRange[0] + greenCoffee.length,0);
}
else { // user cancelled prompt
   context.cancel();
}

editor.activate();