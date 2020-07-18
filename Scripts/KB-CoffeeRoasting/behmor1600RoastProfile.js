//Behmor 1600 Roast Profile

//Setup Roast Profiles
const roastProfiles = ["P1", "P2", "P3", "P4", "P5"];
const roastRegions = `
P1-2: All centrals, Peruvian and Colombians
P3: Brazilians, Africans, SE Asians, Malabar, 
Jamaican Blue Mtn and Yauco Selecto (Puerto Rican)
P4-5: Kona and other low grown island coffees
`;

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

//Prompt to select a roast profile
var p = Prompt.create();
p.title = "Select Roast Profile";
p.message = roastRegions;
for (var pro of roastProfiles) {
   p.addButton(pro);
}

if (p.show()) { // user made a selection
   var profile = p.buttonPressed;
   editor.setSelectedText(profile);
   // update the selected range to the end of the inserted text
   editor.setSelectedRange(selRange[0] + profile.length,0);
}
else { // user cancelled prompt
   context.cancel();
}

editor.activate();