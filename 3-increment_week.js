function incrementWeekNumber() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Live Standings");
    var cell = sheet.getRange("E17");
    var currentValue = cell.getValue();
    
    // Use regular expression to extract the numeric part of the string
    var numericValue = currentValue.match(/\d+/);
  
    if (numericValue) {
      // Increment the numeric part and construct the new string
      var incrementedValue = "Week " + (parseInt(numericValue[0]) + 1);
      cell.setValue(incrementedValue);
    } else {
      // If there is no numeric value, notify as an error
      cell.setValue("Error: Update Function");
    }
  }