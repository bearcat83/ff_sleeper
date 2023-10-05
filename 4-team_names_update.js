function outputUserRosterMappingToConfigSheet() {
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
  
      // Loop through the roster data and add each owner and roster ID along with the associated team name (used later for sort)
      for (var j = 0; j < rosterData.length; j++) {
        var roster = rosterData[j];
        var ownerId = roster.owner_id;
        var rosterId = roster.roster_id;
        var teamName = userTeamNames[ownerId] || "helmethern"; // Default to "helmethern" if team name not found (this essentially grabs the owner_id that matches user_id)
  
        data.push([rosterId, teamName]); //This creates a data object with key pairs for id and team name based on the last step
      }
  
      // Sort the data based on roster_id in ascending order
      data.sort(function(a, b) {
        return a[0] - b[0];
      });
  
      Logger.log("Data to be written to the 'config' sheet: " + JSON.stringify(data));
  
      // Output the sorted data to the "config" sheet
      var startRow = 2; // Starting row in the "config" sheet
      var startColumn = 2; // Starting column (column B)
      config_sheet.getRange(startRow, startColumn, data.length, data[0].length).setValues(data);
    } else {
      Logger.log("Error fetching data");
    }
  }
  