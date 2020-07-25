//Coffee Picker
require("KB-CoffeeRoasting/coffeeRoastingLib.js");

let authObj = getAuthInfo();
let token = authObj.token;
let airtableURL = authObj.baseURL;

// create HTTP and make GET request to Airtable
let http = HTTP.create();
let response = http.request({
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
let responseArray = JSON.parse(response.responseText);
let sel = editor.getSelectedText(); // retrieve selected text
let selRange = editor.getSelectedRange(); // retrieve range of that selection

//Prompt to select a coffee
let p = Prompt.create();
p.title = "Select Coffee";

for(var ix in responseArray["records"]) {
   p.addButton(responseArray["records"][ix].fields.Coffee);
}

if (p.show()) { // user made a selection
   let greenCoffee = p.buttonPressed;
   editor.setSelectedText(greenCoffee);
   editor.setSelectedRange(selRange[0] + greenCoffee.length,0);
}
else { // user cancelled prompt
   context.cancel();
}

editor.activate();