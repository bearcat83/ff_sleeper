# getMatchups Function Documentation

The `getMatchups` function is part of a Google Apps Script that interacts with the Sleeper API to fetch NFL matchup data for a specified league and updates it in a Google Sheets document. This documentation explains each step of the script.

## `getPacificTime()`

This function retrieves the current time in Pacific Time (PT) zone and returns it in the 'HH:mm' format.

## `getCurrentNFLWeek()`

This function sends a request to the Sleeper API to fetch the current NFL week. It then logs the current week and returns it.

## `shouldRunCode()`

This function checks whether the script should run based on the current time and day of the week in Pacific Time (PT). It compares the current time with predefined start and end times for Sunday, Monday through Thursday, and returns `true` if the script should run at the current time, otherwise `false`.

## `clearAndReplaceLast10Rows(outputSheet, currentWeek)`

This function is responsible for clearing and replacing the last 10 rows of data in the output sheet (Google Sheets) that match the current NFL week. It iterates through the rows in reverse order, searching for matches with the current week. If it finds a match, it adds the row number to `rowsToClear` and clears the content of those rows.

## `updateStatusCell(outputSheet, status)`

This function updates a specific cell in the output sheet with the provided `status` text. It sets the value of cell 'F2' to indicate whether the script is "Updating" or "Complete."

## `getMatchups(league_id)`

This is the main function of the script, responsible for fetching NFL matchup data and updating the Google Sheets document. Here's an overview of what it does:

1. Retrieves the `league_id` from a configuration sheet.
2. Constructs the base URL for the Sleeper API based on the `league_id`.
3. Gets the output sheet where data will be written.
4. Checks if the script should run based on the current time using `shouldRunCode()`.
5. If the script should run:
   - Sets the status to "Updating" using `updateStatusCell()`.
   - Retrieves the current NFL week using `getCurrentNFLWeek()`.
   - Clears and replaces the last 10 rows for the current week using `clearAndReplaceLast10Rows()`.
   - Creates headers for the table if the sheet is empty.
   - Initializes a `currentRow` counter for writing data.
   - Constructs the API URL for fetching matchup data for the current week.
   - Fetches data from the API and parses it as JSON.
   - Iterates through the JSON response, extracting and writing data to the output sheet.
   - Updates the status to "Complete" when finished.
   - Updates the most recent run timestamp in cell 'F1' with the current date and time in CST time zone.

This script allows for automated updating of NFL matchup data in the Google Sheets document based on a predefined schedule.
