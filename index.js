function doPost(e){
  var params = JSON.parse(e.postData.getDataAsString());
  // @see https://api.slack.com/events/reaction_added
  var event = JSON.parse(e.postData.getDataAsString()).event;
  if (event.type === "reaction_added" && event.reaction === "link") {
    var spreadsheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SPREDSHEET_ID"));
    var listSheet = spreadsheet.getSheetByName('list');
    var LastRow = listSheet.getRange('B:B').getValues().filter(String).length + 2;
    var menteeSheet = spreadsheet.getSheetByName('mentee');
    var channelCell = menteeSheet.createTextFinder(event.item.channel).findAll()[0].getA1Notation(); // b19
    var userCell = "A" + channelCell.slice(1);
    var userName = menteeSheet.getRange(userCell).getValue();
    var d = new Date(event.item.ts * 1000);
    var link = `https://mentasilverbirder.slack.com/archives/${event.item.channel}/p${String(event.item.ts).replace(".", "")}`
    listSheet.getRange("B" + LastRow).setValue(`${getNowYMD(d)}`);
    listSheet.getRange("C" + LastRow).setValue(link);
    listSheet.getRange("D" + LastRow).setValue(userName);
  }
  return ContentService.createTextOutput(params.challenge);
}

function getNowYMD(dt){
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth()+1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var result = y + "/" + m + "/" + d;
  return result;
}
