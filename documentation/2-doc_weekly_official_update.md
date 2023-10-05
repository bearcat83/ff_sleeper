# copyValuesToOfficialStandings Function Documentation

The `copyValuesToOfficialStandings` function is part of a Google Apps Script that copies a specified range of values from one sheet to another within a Google Sheets document. This documentation explains each step of the script.

## Function Overview

The purpose of this function is to copy values from a source sheet (named "Live Standings") to a target sheet (named "Official Standings") in the same Google Sheets document. It also updates a timestamp in the target sheet to indicate when the copy operation was last performed.

## Function Steps

Here's a breakdown of what the `copyValuesToOfficialStandings` function does:

1. **Get Source and Target Sheets**
   - Retrieves references to the source and target sheets within the active Google Sheets document using `SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)`.

2. **Define Source and Target Ranges**
   - Defines the source and target ranges using `getRange()`. The source range is set to "G7:K16" in the "Live Standings" sheet, and the target range is set to "A3:E12" in the "Official Standings" sheet.

3. **Copy Values**
   - Retrieves the values from the source range using `sourceRange.getValues()`.
   - Sets the values in the target range to the values obtained from the source using `targetRange.setValues(valuesToCopy)`. This effectively copies the data from the source sheet to the target sheet.

4. **Update Timestamp**
   - Retrieves the current date and time in the CST time zone using `Utilities.formatDate(new Date(), timeZone, 'MM/dd/yyyy hh:mm a')`.
   - Sets the value of the cell 'G2:I3' in the target sheet to display the timestamp as "Auto-refreshed: [timestamp] CST".

## Usage
To use this function, follow these steps:

1. Ensure you have a Google Sheets document with two sheets named "Live Standings" and "Official Standings."
2. Place the values you want to copy in the specified range "G7:K16" of the "Live Standings" sheet.
3. Call the `copyValuesToOfficialStandings` function to copy these values to the "Official Standings" sheet.

This script simplifies the process of keeping the "Official Standings" sheet up-to-date with the latest data from the "Live Standings" sheet, while also providing a timestamp to track when the last copy operation occurred. This occurs after current week has ended.
