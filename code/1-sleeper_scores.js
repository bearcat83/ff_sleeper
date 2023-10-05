/////////getMatchups function will only run between specified time defined in first two functions/////////

// For more details, please see the documentation at: https://github.com/bearcat83/ff_sleeper/blob/main/documentation/1-doc_sleeper_scores.md

function getPacificTime() {
    // Set the time zone to Pacific Time (PT)
    var timeZone = 'America/Los_Angeles';
  
    // Get the current date and time in the specified time zone
    var pacificTime = Utilities.formatDate(new Date(), timeZone, 'HH:mm');
  
    return pacificTime;
  }
  
  function getCurrentNFLWeek() {
    var nflStateUrl = "https://api.sleeper.app/v1/state/nfl";
    var response = UrlFetchApp.fetch(nflStateUrl);
    var json_response = JSON.parse(response);
  
    if (json_response && json_response.hasOwnProperty("week")) {
      var currentWeek = json_response.week;
  
      // Log the current week
      Logger.log("Current NFL Week: " + currentWeek);
  
      return currentWeek;
    }
  
    return null;
  }
  
  function shouldRunCode() {
    var currentTime = getPacificTime();
  
    // Define the start and end times in Pacific Time
    var startTimeSunday = '06:00'; // 6:00 AM PT
    var endTime = '22:00';   // 10:00 PM PT
    var startTimeMondayThursday = '16:00'; // 4:00 PM PT
  
    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    var currentDayOfWeek = new Date().getDay();
  
    // Check if the current day is Sunday (0)
    if (currentDayOfWeek === 0) {
      return currentTime >= startTimeSunday && currentTime <= endTime;
    }
  
    // Check if the current day is Monday (1) or Thursday (4)
    if (currentDayOfWeek === 1 || currentDayOfWeek === 4) {
      return currentTime >= startTimeMondayThursday && currentTime <= endTime;
    }
  
    return false;
  }
  
  function clearAndReplaceLast10Rows(outputSheet, currentWeek) {
    var data = outputSheet.getDataRange().getValues();
    var foundMatch = false;
    var rowsToClear = [];
  
    for (var i = data.length - 1; i >= 0; i--) {
      var weekValue = data[i][1]; // Assuming week values are in column B (index 1)
  
      if (weekValue == currentWeek) {
        foundMatch = true;
        rowsToClear.push(i + 1); // Adding 1 to convert from 0-based index to 1-based row number
  
        // If we found the first match, add the subsequent rows
        if (rowsToClear.length == 10) {
          break;
        }
      } else {
        // If we found a row that doesn't match, stop searching for matches
        break;
      }
    }
  
    // If we found a match for the current week, clear the content of the rows
    if (foundMatch) {
      rowsToClear.forEach(function (row) {
        outputSheet.getRange(row, 1, 1, data[row - 1].length).clearContent();
      });
    }
  }
  
  // function clearAndReplaceLast10Rows(outputSheet, currentWeek) {
  //   var lastRow = outputSheet.getLastRow();
  
  //   // Clear the last 10 rows with data, but only if they match the current week
  //   for (var i = lastRow; i > lastRow - 10; i--) {
  //     var weekValue = outputSheet.getRange(i, 2).getValue();
  //     if (weekValue == currentWeek) {
  //       outputSheet.deleteRow(i);
  //     }
  //   }
  // }
  
  function updateStatusCell(outputSheet, status) {
    outputSheet.getRange('F2').setValue(status);
  }
  
  function getMatchups(league_id) {
    var config_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("config");
    var league_id = config_sheet.getRange('A2').getValue();
    var url_base = "https://api.sleeper.app/v1/league/"+league_id+"/matchups/";
  
    // Get the sheet where you want to output the data
    var outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("output_apps_script");
  
    // Check if the current time allows the code to run
    if (shouldRunCode()) {
      // Set the status to "Updating"
      updateStatusCell(outputSheet, "Updating");
  
      // Get the current NFL week
      var currentWeek = getCurrentNFLWeek();
  
      // Clear and replace the last 10 rows for the current week
      clearAndReplaceLast10Rows(outputSheet, currentWeek);
  
      // Create headers for the table if the sheet is empty
      if (outputSheet.getLastRow() == 0) {
        outputSheet.getRange(1, 1).setValue("Team ID");
        outputSheet.getRange(1, 2).setValue("Week");
        outputSheet.getRange(1, 3).setValue("ID-Week");
        outputSheet.getRange(1, 4).setValue("Points");
      }
  
      // Initialize row counter
      var currentRow = outputSheet.getLastRow() + 1;
      
      // Construct the API URL with the current week
      var url = url_base + currentWeek;
      var response = UrlFetchApp.fetch(url);
      var json_response = JSON.parse(response);
  
      // Assuming your JSON response is an array of objects
      if (Array.isArray(json_response)) {
        // Loop through the JSON response and extract the data
        for (var i = 0; i < json_response.length; i++) {
          var matchup = json_response[i];
          var combined_id = matchup.roster_id + "-" + currentWeek;
          var rowData = [matchup.roster_id, currentWeek, combined_id, matchup.points]; // Adjust as per JSON structure
          outputSheet.getRange(currentRow, 1, 1, rowData.length).setValues([rowData]);
          currentRow++;
        }
      }
  
      // Update the status to "Complete" when finished
      updateStatusCell(outputSheet, "Complete");
  
      // Update the most recent run timestamp
      var timeZone = 'America/Chicago'; // CST time zone
      var date = Utilities.formatDate(new Date(), timeZone, 'MM/dd/yyyy hh:mm a');
      outputSheet.getRange('F1').setValue("Auto-refreshed: " + date + " CST");
    }
  }