/**
 * ===================  GENERATE CVS  ===========================
 * Application Script to Dynamically Generate CVs from JSON Applicant Responses
 * 
 * PS:
   1. For the script to run ensure that the create_CV(which is the main function) is selected
   2.any output from console.log() statements is solely intended for testing purposes and can be optionally 
    removed.
  3. Have the template CV in place with all the place holders. Check the link below for demo
    https://docs.google.com/document/d/11paC1EiuOEPh7Nm_iWDlNb50p0c3o17_zd9cW8r_BOc/edit
  4. Sample JSON format displaying how CVs are to be submitted.It should be copy and pasted in the form field.
     https://docs.google.com/document/d/1J_wQugmkcCKiqxS2QhjYWP-9iMXrrMzvpnpKRA4p6fE/edit?usp=sharing
  5. The template form to be shared to the various applicants.
      https://forms.gle/dh5d8ZyEe4PXAHgo6
 */


var List_of_jsonified_info = []  // stores all the JSON objects after being jsonified

function createGoogleDoc() {
  // this is the ID of thef folder where you specified the responses should be stored declared in JSON_to_Doc script file. All the responses would be stored here
  var cv_folder = DriveApp.getFolderById('YOUR_FOLDER_ID_CONTAINING_THE_RESPONSES') //foldercontanngsubmit resposnes
  var files = cv_folder.getFiles() // grabs all the files
  var files = cv_folder.getFilesByType(MimeType.GOOGLE_DOCS)  // grabs only Google doc files

  var file_ids = []  // list to store all the docs found
  while (files.hasNext()) {
    var file = files.next()
    console.log(file.getName())
    console.log(file.getMimeType())
    console.log(file.getId())
    var id = file.getId()
    file_ids.push(id)
  }

  // console.log(file_ids)
  for (var file_id of file_ids) {
    try {
      console.log(file_id)
      var Jsonied_info = Jsonify_doc_data(file_id)  // function to jsonify the doc text
      List_of_jsonified_info.push(Jsonied_info)
      Logger.log('added new JSON')

    } catch (e) {
      Logger.log('error Jsonifying file')
      // return null;
    }
  } var No_of_JSON_added = List_of_jsonified_info.length;
  Logger.log(No_of_JSON_added + 'data added successfully')
  return List_of_jsonified_info
}

// function to Jsonify doc text
function Jsonify_doc_data(info) {
  try {
    var doc = DocumentApp.openById(info); // Replaces the document ID
    var body = (doc.getBody())
    var doc_content = body.getText()
    console.log(doc_content)

    var json_info = JSON.parse(doc_content)  // jsonifies the content and returns a JSON
    return json_info
  } catch (e) {
    Logger.log('error opening file by id')
    return null;
  }
}

// ===== MAIN function==== ensure its selected the function to run on your script
function create_CV() {
  createGoogleDoc()
  // the ID of the your template file you created in your Google Drive folder or just use this
  var template_CV_doc = DriveApp.getFileById('111paC1EiuOEPh7Nm_iWDlNb50p0c3o17_zd9cW8r_BOc')

  for (var person of List_of_jsonified_info) {
    Logger.log('============PERSONAL DETAILS======================') // printing to test on the console
    // console.log('name: ' + person.name)
    console.log('title ' + person.title)
    console.log('phone ' + person.contact.phone)
    console.log('nationality ' + person.contact.nationality)
    console.log('executive_summary ' + person.executive_summary.background)
    // getting the executive summary achievements
    person.executive_summary.achievements.forEach(function (achievement, index) {
      console.log(index + 1 + ". " + achievement);
    });
    console.log("key_skills1 " + person.key_skills[0])
    person.key_skills.forEach(function (skill, index) {
      console.log(index + 1 + "." + skill)
    })


    console.log("professional experience " + person.professional_experience.position)
    Logger.log('==================================================')

    // make a copy of the  template for each submitted CV data
    var new_doc = template_CV_doc.makeCopy()
    var new_doc_id = new_doc.getId()
    console.log('new document id ' + new_doc_id)

    // folder to store the generated CVs. Once the CVs are generated they should be moved to the one folder for easier retrieval
    new_doc.moveTo(DriveApp.getFolderById('YOUR_FOLDER_ID')).setName(person.name + 'CV')
    var body = DocumentApp.openById(new_doc_id).getBody()

    //======== replacing the placeholders in our template ======== 
    body.replaceText("{name}", person.name)
    body.replaceText("{title}", person.title)
    body.replaceText("{phone}", person.contact.phone)
    body.replaceText("{email}", person.contact.email)
    body.replaceText("{nationality}", person.contact.nationality)
    body.replaceText("{background}", person.executive_summary.background)
    // =====  method to get the achievements and replace them dynamically
    var achieve_template_text = "{achievements}";    // Sample text with a placeholder for skills
    // Create a bulleted list of achievements
    var achievements_Text = person.executive_summary.achievements.map(function (achievement) {
      return "• " + achievement;
    }).join("\n");
    // Replace the placeholder with the bulleted list of achievements
    var updated_achievement_Text = achieve_template_text.replace("{achievements}", achievements_Text);
    // Output the updated text
    console.log(updated_achievement_Text);
    body.replaceText("{achievements}", updated_achievement_Text)

    //=== method to get the skills dynamically ======
    var templateText = "{skills}";    // Sample text with a placeholder for skills
    var skillsText = person.key_skills.join("  .  "); // Combine the skills into a comma-separated string
    // Replace the placeholder with the skills
    var updatedText = templateText.replace("{skills}", skillsText);
    // Output the updated text
    console.log(updatedText);
    body.replaceText("{skills}", updatedText)

    // ==== Professional Experience =======
    body.replaceText("{position}", person.professional_experience.position)
    body.replaceText("{period}", person.professional_experience.period)
    body.replaceText("{company}", person.professional_experience.company)
    body.replaceText("{job description}", person.professional_experience.description)

    // =====  method to get the responsibilities and replace them dynamically
    var responsibilities_template_text = "{responsibilities}"; // Sample text with a placeholder for skills
    // Create a bulleted list of achievements
    var responsibilities_Text = person.professional_experience.responsibilities.map(function (response) {
      return "• " + response;
    }).join("\n");
    // Replace the placeholder with the bulleted list of achievements
    var updated_resp_Text = responsibilities_template_text.replace("{responsibilities}", responsibilities_Text);
    // Output the updated text
    console.log(updated_resp_Text);
    body.replaceText("{responsibilities}", updated_resp_Text)

    // =====  method to get the significant achievements and replace them dynamically
    var significant_template_text = "{significant achievement}"; // 
    // Create a bulleted list of achievements
    var significance_Text = person.professional_experience.achievements.map(function (significance) {
      return "• " + significance;
    }).join("\n");
    // Replace the placeholder with the bulleted list of achievements
    var updated_significance_Text = significant_template_text.replace("{significant achievement}", significance_Text);
    // Output the updated text
    console.log(updated_significance_Text);
    body.replaceText("{significant achievement}", updated_significance_Text)

    //==== getting the education background =======
    body.replaceText("{degree}", person.education.degree)
    body.replaceText("{major}", person.education.major)
    body.replaceText("{university}", person.education.university)
    body.replaceText("{location}", person.education.location)
    body.replaceText("{year}", person.education.year)

    //=== method to get technical skills dynamically and replace in the template folder dynamically======
    var technical_skills_templateText = "{technical skills}"; // Sample text with a placeholder for skills
    var technical_skillsText = person.technical_skills.join("  .  "); // Combine the skills into a comma-separated string
    // Replace the placeholder with the skills
    var updated_technical_skills_Text = technical_skills_templateText.replace("{technical skills}", technical_skillsText);
    // Output the updated text
    console.log(updated_technical_skills_Text);
    body.replaceText("{technical skills}", updated_technical_skills_Text)

    // ==== miscellaneous activity ==========
    body.replaceText("{Nationality}", person.miscellaneous_information.nationality)
    body.replaceText("{languages}", person.miscellaneous_information.languages)
    body.replaceText("{availability}", person.miscellaneous_information.availability)
  }
}