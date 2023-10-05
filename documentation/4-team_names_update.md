# outputUserRosterMappingToConfigSheet Function Documentation

The `outputUserRosterMappingToConfigSheet` function is part of a Google Apps Script that fetches data about users and rosters from the Sleeper API and outputs a user-roster mapping to a Google Sheets document. This documentation explains each step of the script.

## Function Overview

The purpose of this function is to retrieve information about users and their associated team names and rosters from the Sleeper API. It then creates a user-roster mapping and outputs this mapping to a Google Sheets document, specifically to the "config" sheet. The mapping is used for various purposes, such as sorting and referencing user data.

## Function Steps

Here's a breakdown of what the `outputUserRosterMappingToConfigSheet` function does:

1. **Get "config" Sheet and League ID**
   - Retrieves a reference to the "config" sheet within the active Google Sheets document using `SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)`.
   - Retrieves the `league_id` from cell 'A2' of the "config" sheet.

2. **Construct API URLs and Fetch Data**
   - Constructs the URLs for fetching user and roster data from the Sleeper API based on the `league_id`.
   - Uses `UrlFetchApp.fetch(url)` to make API requests and fetch data.
   - Logs API response codes to check for success (`200` indicates success).

3. **Process User Data**
   - If both API requests are successful:
     - Initializes an empty object `userTeamNames` to store user-to-team name mappings.
     - Parses the JSON responses for users and rosters into `usersData` and `rosterData` arrays.
     - Iterates through `usersData` and extracts user IDs and their associated team names from user metadata.
     - If no team name is found, defaults to "helmethern" since his name is not stored in the metadata column.
     - Logs the resulting `userTeamNames` object.

4. **Create Data for Output**
   - Initializes an empty array `data` to store user-roster mapping data.
   - Iterates through `rosterData` and associates each owner with their roster ID and team name from `userTeamNames`.
   - Sorts the `data` array based on roster ID in ascending order.
   - Logs the data to be written to the "config" sheet.

5. **Output Data to "config" Sheet**
   - Specifies the starting row and column in the "config" sheet.
   - Uses `config_sheet.getRange(startRow, startColumn, numRows, numColumns).setValues(data)` to write the sorted data to the "config" sheet.

6. **Error Handling**
   - If either API request fails, logs an error message.

## Usage
To use this function, follow these steps:

1. Ensure you have a Google Sheets document with a sheet named "config."
2. Place the league ID in cell 'A2' of the "config" sheet (or adjust the cell address in the script to match your setup).
3. Call the `outputUserRosterMappingToConfigSheet` function to fetch user and roster data from the Sleeper API and output the user-roster mapping to the "config" sheet.

This script simplifies the process of associating users with their rosters and team names in your Google Sheets document, facilitating data management and reference within your project.
