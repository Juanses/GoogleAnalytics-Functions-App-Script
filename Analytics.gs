function getReportDataForMobileProfile(){//firstProfile) {
  var profileId = "25813269";
  var tableId = 'ga:' + profileId;
  var startDate = getLastNdays(30);   // 2 weeks (a fortnight) ago.
  var endDate = getLastNdays(0);      // Today.
  
  var optArgs = {
    'dimensions': 'ga:keyword',              // Comma separated list of dimensions.
    'sort': '-ga:sessions,ga:keyword',       // Sort by sessions descending, then keyword.
    'segment': 'dynamic::ga:isMobile==Yes',  // Process only mobile traffic.
    'filters': 'ga:source==google',          // Display only google traffic.
    'start-index': '1',
    'max-results': '250'                     // Display the first 250 results.
  };
  
  // Make a request to the API.
  var results = Analytics.Data.Ga.get(
    tableId,                    // Table id (format ga:xxxxxx).
    startDate,                  // Start-date (format yyyy-MM-dd).
    endDate,                    // End-date (format yyyy-MM-dd).
    'ga:sessions,ga:pageviews', // Comma seperated list of metrics.
    optArgs);
  
  if (results.getRows()) {
    //outputToSpreadsheet(results)
    
    //function that goes trough the result array and sums the userviews for a specific page
    Logger.log(results.getRows());
    return results;
    
  } else {
    throw new Error('No views (profiles) found');
  }
}

function getLastNdays(nDaysAgo) {
  var today = new Date();
  var before = new Date();
  before.setDate(today.getDate() - nDaysAgo);
  return Utilities.formatDate(before, 'GMT', 'yyyy-MM-dd');
}

function outputToSpreadsheet(results) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
  
  // Print the headers.
  var headerNames = [];
  for (var i = 0, header; header = results.getColumnHeaders()[i]; ++i) {
    headerNames.push(header.getName());
  }
  sheet.getRange(1, 1, 1, headerNames.length)
  .setValues([headerNames]);
  
  // Print the rows of data.
  sheet.getRange(2, 1, results.getRows().length, headerNames.length)
  .setValues(results.getRows());
}