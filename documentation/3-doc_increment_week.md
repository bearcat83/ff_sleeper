# incrementWeekNumber Function Documentation

The `incrementWeekNumber` function is part of a Google Apps Script that increments a week number displayed in a specific cell of a Google Sheets document. This documentation explains each step of the script. The week number displayed, controls dynamic index match/lookups in the Google sheet itself, so we update this value on Tuesday mornings, after the previous week has completed.

## Function Overview

The purpose of this function is to find the current week number displayed in a specified cell, increment it by one, and update the cell's value to reflect the incremented week number. If the current value does not contain a week number, the function sets an error message.

## Function Steps

Here's a breakdown of what the `incrementWeekNumber` function does:

1. **Get Sheet and Cell**
   - Retrieves references to the active Google Sheets document's "Live Standings" sheet using `SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)`.
   - Obtains a reference to the cell where the week number is displayed using `sheet.getRange(cellAddress)`.

2. **Get Current Value**
   - Retrieves the current value of the specified cell using `cell.getValue()`.

3. **Extract Numeric Value**
   - Uses a regular expression (`/\d+/`) to extract the numeric part of the current value. This is assumed to be the week number.

4. **Increment and Update Value**
   - If a numeric value is found:
     - Increments the numeric part by one.
     - Constructs the new string with the incremented week number and the text "Week ".
     - Sets the value of the cell to the new incremented value.
   - If no numeric value is found:
     - Sets the value of the cell to "Error: Update Function" to indicate an error.

## Usage
To use this function, follow these steps:

1. Ensure you have a Google Sheets document with a sheet named "Live Standings."
2. Place the week number that you want to increment in the cell with the address "E17" (or adjust the cell address in the script to match your setup).
3. Call the `incrementWeekNumber` function to increment the week number.

This script simplifies the task of updating a week number in your Google Sheets document, ensuring it reflects the correct week in a user-friendly format or handles errors gracefully if the format is not as expected.
