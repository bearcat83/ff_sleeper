// Script to update official standings
// For more details, please see the documentation at: https://github.com/bearcat83/ff_sleeper/blob/main/documentation/2-doc_weekly_official_update.md

function copyValuesToOfficialStandings() {
    var sourceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Live Standings");
    var targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Official Standings");
    
    var sourceRange = sourceSheet.getRange("G7:K16");
    var targetRange = targetSheet.getRange("A3:E12");
    
    var valuesToCopy = sourceRange.getValues();
    targetRange.setValues(valuesToCopy);
  
    // Update the most recent run timestamp
    var timeZone = 'America/Chicago'; // CST time zone
    var date = Utilities.formatDate(new Date(), timeZone, 'MM/dd/yyyy hh:mm a');
    targetSheet.getRange('G2:I3').setValue("Auto-refreshed: " + date + " CST");
  }