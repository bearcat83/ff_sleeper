# updateMatchupResults Function Documentation

The `updateMatchupResults` function is part of a Google Apps Script that performs a matchup-only comparison based on the schedule for the current NFL week. This documentation explains each step of the script.

## Function Overview

The purpose of this function is to fetch user team names and matchup data from the Sleeper API, calculate win or loss for each matchup, and update the data in a Google Sheets document. This script is typically used to track fantasy football matchups and outcomes.

**For more details, please see the [documentation](https://github.com/bearcat83/ff_sleeper/blob/main/documentation/5-matchup_only.md).**

## Function Steps

Here's a breakdown of what the `updateMatchupResults` function does:

1. **Fetch User Team Names**
   - Retrieves the `league_id` from the "config" sheet within the active Google Sheets document.
   - Makes API requests to fetch user team names and roster data from the Sleeper API.
   - Parses the JSON responses and creates a mapping of user IDs to team names.

2. **Fetch NFL State Data**
   - Makes an API request to fetch NFL state data from the Sleeper API to determine the current Sleeper "Display" week. display_week is used to avoid the matchup function from pulling back data for a week that hasn't begun since this script is scheduled to run some time on Mondays between 9-10pm PT.
   - Parses the JSON response to obtain the `currentWeek`.

3. **Fetch Matchups Data**
   - Constructs the URL for fetching matchup data for the current week using the `league_id` and `currentWeek`.
   - Makes an API request to fetch matchup data for the specified week.
   - Parses the JSON response into an array named `matchupsData`.
   - Logs the retrieved matchup data for inspection.

4. **Process User Team Names**
   - Combines user team names with roster data to create a list of team names and roster IDs.
   - Sorts the data based on roster ID in ascending order.

5. **Process Matchups Data**
   - Checks if `matchupsData` is an array.
   - Initializes variables for outputting matchup results to the "Matchups Only" sheet, including headers.
   - Iterates through `matchupsData`, extracting matchup information, roster IDs, and points.
   - Skips matchups with undefined roster IDs.
   - Calculates win or loss based on points for each matchup and adds this information to `resultsData`.

6. **Output Results to "Matchups Only" Sheet**
   - Checks if headers are already present in the "Matchups Only" sheet, and if not, adds them.
   - Appends the calculated matchup results to the sheet starting from the next available row.

7. **Error Handling**
   - Catches and logs any errors that may occur during the execution of the function.

## Usage
To use this function, follow these steps:

1. Ensure you have a Google Sheets document with a sheet named "config" that contains the `league_id` in cell 'A2'.
2. Call the `updateMatchupResults` function to fetch and update the current week's NFL matchup data in the "Matchups Only" sheet.
3. Use the resulting data to analyze and track the outcomes of fantasy football matchups.

This script simplifies the process of updating matchup results for your fantasy football league, providing valuable information for league management and analysis.

**For a more detailed explanation and usage guide, please refer to the [documentation](https://github.com/bearcat83/ff_sleeper/blob/main/5-matchup_only.md).**
