//Roast Log Template

//Create template
const template = `## Roasting Log
#### Pre-Roast
Coffee: 
Weight In: 
Profile: 
Roast Time: 

#### Roast  
Date/Time: 
First Crack: 
Second Crack: 

#### Post-Roast
Weight Out: 
Roast: 

#### Notes
* `;

//Create the draft
var d = Draft.create();
d.content = template;
d.update()

//Load in editor and focus for editing
editor.load(d);
//Set cursor to first field for quick entry
editor.setSelectedRange(39,0);
editor.activate();