/**
 * ==== AUTOMATED GOOGLE FORMS TO GOOGLE DOCS CONVERTER =====
 * Script to automatically convert received form reponses in JSON from Google forms to Google docs.
 * Usage:
    1. Configure Google Forms to store reeceived repsonses as Google Docs for easier manipulation
    2. Run this script, and it will automatically fetch the latest responses from the Sheets.
    3. It will create a new Google Docs document for each set of responses, ensuring that your data is   well-organized.
 *   
 *  @param {YOUR_FOLDER_ID} replace with your Folder Id
 */


function CV(e) {
    var text = e.values[1]  // the reponse of the CV of a user from google forms
    var name = e.values[2]   // the response of the name of the user from google forms

    var doc = DocumentApp.create(name + 'CV')  // creates the filename
    var body = doc.getBody();
    body.appendParagraph(text)  // appends the text of the response as a paragraph in the specified document
    doc.saveAndClose()

    var doc_file = DriveApp.getFileById(doc.getId())   // get the id of the document saved

    // specify the folder to move all the submitted responses from Google forms should be submitted
    doc_file.moveTo(DriveApp.getFolderById('YOUR_FOLDER_ID_CONTAINING_THE_RESPONSES'))
    console.log(doc_file.getName())
    console.log(doc_file.getId())


}

