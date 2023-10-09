# updateMatchupResults Function Documentation

The `updateMatchupResults` function is part of a Google Apps Script that performs a matchup-only comparison based on the schedule for the current NFL week. This documentation explains each step of the script.

## Function Overview

The purpose of this function is to fetch NFL matchup data for the current week from the Sleeper API, calculate win or loss for each matchup, and update the data in a Google Sheets document. This script is typically used to track fantasy football matchups and outcomes.

## Function Steps

Here's a breakdown of what the `updateMatchupResults` function does:

1. **Get "config" Sheet and League ID**
   - Retrieves a reference to the "config" sheet within the active Google Sheets document using `SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)`.
   - Retrieves the `league_id` from cell 'A2' of the "config" sheet.

2. **Fetch Current NFL Week**
   - Makes an API request to fetch NFL state data from the Sleeper API using the `stateUrl` to determine the current NFL week.
   - Parses the JSON response to obtain the `currentWeek`.

3. **Fetch Matchups Data**
   - Constructs the URL for fetching matchup data for the current week using the `league_id` and `currentWeek`.
   - Makes an API request to fetch matchup data for the specified week.
   - Parses the JSON response into an array named `matchupsData`.
   - Logs the retrieved matchup data for inspection.

4. **Process Matchups Data**
   - Checks if `matchupsData` is an array.
   - Initializes variables for outputting matchup results to the "Matchups Only" sheet, including headers.
   - Iterates through `matchupsData`, extracting matchup information, roster IDs, and points.
   - Skips matchups with undefined roster IDs.
   - Calculates win or loss based on points for each matchup and adds this information to `resultsData`.

5. **Output Results to "Matchups Only" Sheet**
   - Checks if headers are already present in the "Matchups Only" sheet, and if not, adds them.
   - Appends the calculated matchup results to the sheet starting from the next available row.

6. **Error Handling**
   - Catches and logs any errors that may occur during the execution of the function.

## Usage
To use this function, follow these steps:

1. Ensure you have a Google Sheets document with a sheet named "config" that contains the `league_id` in cell 'A2'.
2. Call the `updateMatchupResults` function to fetch and update the current week's NFL matchup data in the "Matchups Only" sheet.
3. Use the resulting data to analyze and track the outcomes of fantasy football matchups.

This script simplifies the process of updating matchup results for your fantasy football league, providing valuable information for league management and analysis.
