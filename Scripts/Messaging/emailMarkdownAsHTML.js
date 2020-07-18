//Email draft as markdown to Home, Work, or Other
//Use first line as subject

//Seperate subject from body
var splitBody = draft.content.split('\n');
var subject = splitBody.shift();
var body = draft.content;

//Remove leading #s from title
var regex = new RegExp("^#+\\s*");
subject = subject.replace(regex, "");

//Convert body to markdown
var mmd =  MultiMarkdown.create();
mmd.completeDocument = true;
var mdBody = mmd.render(body);

//Prompt for recipient
var p = Prompt.create();
p.title = "Select Recipient";
p.addButton("Home");
p.addButton("Work");
p.addButton("Other");
//Email Markdown as HTML

if (p.show()) {
   var recipient = p.buttonPressed;

   //Send email, background for Home/Work, Airmail for Other
   if (recipient != "Other" ) {
      var credential = "";
      var mail = Mail.create();
      mail.isBodyHTML = true;

      if (recipient == "Home") {
         credential = Credential.create("Home Email", "Home Email Address");
         credential.addTextField("email", "Home Email Address");
      }
      else { //Recipient == Work
         credential = Credential.create("Work Email", "Work Email Address");
         credential.addTextField("email", "Work Email Address");
      }

      credential.authorize();
      mail.toRecipients = [credential.getValue("email")];
      mail.sendInBackground = true;
      mail.subject = subject;
      mail.body = mdBody;

      var success = mail.send();
      if (success) {
         console.log("Emailed to: " + recipient);
      }
      else {
         console.log(mail.status);
         context.fail();
      }
   }
   else {
      //Send with Airmail
      //var url = "airmail://compose?subject=" + encodeURIComponent(subject) + "&htmlBody=" + encodeURIComponent(mdBody);
      //Send with Spark
      var url = "readdle-spark://compose?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(mdBody);
      var result = app.openURL(url);
      if (result) {
         //console.log("Sent with Airmail");
         console.log("Sent with Spark");
      }

      else {
         context.fail();
      }
   }
}
else {
   context.cancel();
}

editor.activate();