//Roast Log Template
require("KB-CoffeeRoasting/coffeeRoastingLib.js");

//Create template
const template = `## Roasting Log
#### Pre-Roast
Coffee: 
Weight In: 
Profile: 
Roast Time: 

#### Roast  
Date/Time: 
Min Voltage: 
Max Voltage: 
First Crack: 
Second Crack: 

#### Post-Roast
Weight Out: 
Roast: 

#### Notes
* `;

//Create the draft
let d = Draft.create();
d.content = template;
d.update()

//Load in editor and focus for editing
editor.load(d);

//Alert if a cleaning cycle is required
if (isCleaningCycleRequired()) {
   showReminder("A cleaning cycle is required after this roast");
}

//Set cursor to first field for quick entry
editor.setSelectedRange(39,0);
editor.activate();