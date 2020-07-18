//Grams to Ounces

var sel = editor.getSelectedText(); // retrieve selected text
var selRange = editor.getSelectedRange(); // retrieve range of that selection

var grams = 0;
var convert = true;

if (sel.length == 0) {
   var p = Prompt.create();
   p.title = "Grams to Ounces";
   p.addButton("OK");
   p.addTextField("grams", "Grams", "", {"keyboard": "decimalPad", "wantsFocus": true});

   if (p.show()) { // user made a selection
      grams = p.fieldValues["grams"];
   }
   else { // user cancelled prompt
      context.cancel();
      convert = false;
   }
}
else {
   var regex = new RegExp("[0-9]+(\.[0-9][0-9]?)?");
   grams = sel.match(regex)[0];

   //Add leading 0 if not included
   if (sel.includes(".") &&
       !grams.includes(".")) {
      grams = Number("0." + grams);
   }
}

//Convert and round to 2 decimal places
if (convert) {
   var ounces = Number(Math.round(grams * 0.03527396195+'e2')+'e-2');
   var ouncesFormatted = ounces + " oz";

   editor.setSelectedText(ouncesFormatted);

   // update the selected range to the end of the inserted text
   editor.setSelectedRange(selRange[0]+ ouncesFormatted.length,0);
}

editor.activate();