//Insert Current Date and Time

var now = new Date();
var dd = now.getDate();
var mm = now.getMonth()+1;
var yyyy = now.getFullYear();
var time = function(){
   var d = new Date();
   var HH = now.getHours();
   var MM = d.getMinutes();
   var ampm = HH >= 12 ? 'PM' : 'AM';

   if(HH<10) {
       HH='0'+HH
   } else if (HH>12) {
       HH=HH-12
   }

   var hh = HH.toString().replace(/^0+/, '');

   if(MM<10) {
       MM='0'+MM
   }
   return hh + ':' + MM + ' ' + ampm;
};

var today = mm+'/'+dd+'/'+yyyy+' '+time();
var selRange = editor.getSelectedRange();
editor.setSelectedText(today);
editor.setSelectedRange(selRange[0]+today.length,0);