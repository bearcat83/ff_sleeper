//Perform matchup only comparison based on schedule for current week
// For more details, please see the documentation at: 
// https://github.com/bearcat83/ff_sleeper/blob/main/5-matchup_only.md

function updateMatchupResults() {
  // Fetch user team names
  var config_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("config");
  var league_id = config_sheet.getRange('A2').getValue();
  var urlUsers = "https://api.sleeper.app/v1/league/" + league_id + "/users";
  var urlRosters = "https://api.sleeper.app/v1/league/" + league_id + "/rosters";

  Logger.log("Fetching user team names data from URL: " + urlUsers);
  var responseUsers = UrlFetchApp.fetch(urlUsers);
  Logger.log("API Response Code for Users: " + responseUsers.getResponseCode());

  Logger.log("Fetching roster data from URL: " + urlRosters);
  var responseRosters = UrlFetchApp.fetch(urlRosters);
  Logger.log("API Response Code for Rosters: " + responseRosters.getResponseCode());

  if (responseUsers.getResponseCode() === 200 && responseRosters.getResponseCode() === 200) {
    var userTeamNames = {};
    var usersData = JSON.parse(responseUsers);
    var rosterData = JSON.parse(responseRosters);

    for (var i = 0; i < usersData.length; i++) {
      var user = usersData[i];
      var userId = user.user_id;
      var metadata = user.metadata;

      // Check if the user has metadata and a team_name field
      if (metadata && metadata.hasOwnProperty("team_name")) {
        var teamName = metadata.team_name;
        userTeamNames[userId] = teamName;
      } else {
        // Use "helmethern" as the team_name if there's no value
        userTeamNames[userId] = "helmethern";
      }
    }

    Logger.log("User Team Names Data: " + JSON.stringify(userTeamNames));

    var data = [];

    // Loop through the roster data and add each owner, roster ID, and the associated team name
    for (var j = 0; j < rosterData.length; j++) {
      var roster = rosterData[j];
      var ownerId = roster.owner_id;
      var rosterId = roster.roster_id;
      var teamName = userTeamNames[ownerId] || "helmethern"; // Default to "helmethern" if team name not found

      data.push([teamName, rosterId]); // Store teamName and rosterId
    }

    // Sort the data based on roster_id in ascending order
    data.sort(function(a, b) {
      return a[1] - b[1];
    });
  }

  // Fetch NFL state data to get the current week
  var stateUrl = "https://api.sleeper.app/v1/state/nfl";
  var stateResponse = UrlFetchApp.fetch(stateUrl);
  var stateData = JSON.parse(stateResponse);
  var currentWeek = stateData.week;

  // Fetch matchups data for the specified week
  var matchupsUrl = "https://api.sleeper.app/v1/league/" + league_id + "/matchups/" + currentWeek;
  var matchupsResponse = UrlFetchApp.fetch(matchupsUrl);
  var matchupsData = JSON.parse(matchupsResponse);

  // Log the matchupsData to inspect its structure
  Logger.log("Matchups Data: " + JSON.stringify(matchupsData));

  // Ensure matchupsData is an array
  if (Array.isArray(matchupsData)) {
    // Output results to the spreadsheet
    var resultsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Matchups Only");
    var headers = ["teamName", "matchup_id", "points", "week", "win_or_loss"];
    var resultsData = [];

    // Iterate through matchups
    for (var i = 0; i < matchupsData.length; i++) {
      var matchup = matchupsData[i];
      var matchup_id = matchup.matchup_id;
      var team1 = matchup.roster_id;
      var points = matchup.points;

      // Check for undefined roster_id and skip
      if (!team1) {
        continue;
      }

      // Add data to resultsData
      resultsData.push([data.find(item => item[1] === team1)[0], matchup_id, points, currentWeek]);
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

    // Sort the resultsData by matchup_id in ascending order
    resultsData.sort(function(a, b) {
      return a[1] - b[1];
    });

    // Append the results to the sheet starting from the next available row
    // Get the data in columns A to E
    var dataRange = resultsSheet.getRange("A:E").getValues();

    // Find the last row with data
    var lastRow = dataRange.length;
    while (lastRow > 0 && !dataRange[lastRow - 1].some(Boolean)) {
      lastRow--;
    }

    resultsSheet.getRange(lastRow + 1, 1, resultsData.length, resultsData[0].length).setValues(resultsData);

    Logger.log("Matchup results updated.");
  } else {
    Logger.log("Matchups Data is not an array.");
  }
}
