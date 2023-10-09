//Perform matchup only comparison based on schedule for current week
// For more details, please see the documentation at: 
// https://github.com/bearcat83/ff_sleeper/blob/main/5-matchup_only.md

function updateMatchupResults() {
    var config_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("config");
    var league_id = config_sheet.getRange('A2').getValue();
    // Fetch NFL state data to get the current week
    var stateUrl = "https://api.sleeper.app/v1/state/nfl";
    var stateResponse = UrlFetchApp.fetch(stateUrl);
    var stateData = JSON.parse(stateResponse);
    var currentWeek = stateData.week;
  
    var matchupsUrl = "https://api.sleeper.app/v1/league/"+league_id+"/matchups/"+currentWeek;
  
    try {
      // Fetch matchups data for the specified week
      var matchupsResponse = UrlFetchApp.fetch(matchupsUrl);
      var matchupsData = JSON.parse(matchupsResponse);
  
      // Log the matchupsData to inspect its structure
      Logger.log("Matchups Data: " + JSON.stringify(matchupsData));
  
      // Ensure matchupsData is an array
      if (Array.isArray(matchupsData)) {
  
        // Output results to the spreadsheet
        var resultsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Matchups Only");
        var headers = ["roster_id", "matchup_id", "points", "week", "win_or_loss"];
        var resultsData = [];
  
        // Iterate through matchups
        for (var i = 0; i < matchupsData.length; i++) {
          var matchup = matchupsData[i];
          var matchup_id = matchup.matchup_id;
          var roster1 = matchup.roster_id;
          var points = matchup.points;
  
          // Check for undefined roster_id and skip
          if (!roster1) {
            continue;
          }
  
          // Add data to resultsData
          resultsData.push([roster1, matchup_id, points, currentWeek]);
        }
  
        // Check if headers are already present, and if not, add them
        var existingHeaders = resultsSheet.getRange(1, 1, 1, headers.length).getValues()[0];
        var headersExist = true;
  
        for (var i = 0; i < headers.length; i++) {
          if (headers[i] !== existingHeaders[i]) {
            headersExist = false;
            break;
          }
        }
  
        if (!headersExist) {
          resultsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        }
  
        // Calculate win or loss based on points
        for (var i = 0; i < resultsData.length; i++) {
          var rowData = resultsData[i];
          var matchup_id = rowData[1];
          var points = rowData[2];
          
          // Find the opposing team's points in the same matchup
          var opposingPoints = resultsData.find(row => row[1] === matchup_id && row[2] !== points)[2];
  
          // Determine win or loss (1 for win, 0 for loss)
          var win_or_loss = points > opposingPoints ? 1 : 0;
          rowData.push(win_or_loss);
        }
  
        // Append the results to the sheet starting from the next available row
        var lastRow = resultsSheet.getLastRow();
        resultsSheet.getRange(lastRow + 1, 1, resultsData.length, resultsData[0].length).setValues(resultsData);
  
        Logger.log("Matchup results updated.");
      } else {
        Logger.log("Matchups Data is not an array.");
      }
  
      // ... Rest of your code ...
  
    } catch (error) {
      Logger.log("Error: " + error.toString());
    }
  }
  