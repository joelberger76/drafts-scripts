// Cycle between bullet and task states
const bullet = "- ";
const off = "- [ ] ";
const on = "- [x] ";

// grab state
let [lnStart, lnLen] = editor.getSelectedLineRange();
let lnText = editor.getTextInRange(lnStart, lnLen);
let [selStart, selLen] = editor.getSelectedRange();

let bulletRegex = new RegExp("^\\s*" + bullet);
let offRegex = new RegExp("^\\s*- \\[ \\] ");
let onRegex = new RegExp("^\\s*- \\[x\\] ");
if (lnText.match(bulletRegex)) {
   if (lnText.match(offRegex)) {
      // Off to On
      editor.setTextInRange(lnStart, lnLen, lnText.replace(off, on));
      editor.setSelectedRange(selStart, selLen);
   }
   else if (lnText.match(onRegex)) {
      // On to Bullet
      editor.setTextInRange(lnStart, lnLen, lnText.replace(on, bullet));
      editor.setSelectedRange(selStart+bullet.length-on.length, selLen);
   }
   else {
      // Bullet to Off
      editor.setTextInRange(lnStart, lnLen, lnText.replace(bullet, off));
      editor.setSelectedRange(selStart+off.length-bullet.length, selLen);
   }
}
else {
   // Add bullet between whitespace and content
   let findWSRegex = new RegExp("^(\\s*)(.*)");
   let lnMatched = lnText.match(findWSRegex);
   let lnUpdated = lnMatched[1] + bullet + lnMatched[2];
   // Reclaim the newline if the regex lost it
   if (lnText.endsWith("\n")) {
      lnUpdated = lnUpdated + "\n";
   }
   editor.setTextInRange(lnStart, lnLen, lnUpdated);
   editor.setSelectedRange(selStart+bullet.length, selLen);
}