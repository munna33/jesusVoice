const express = require("express");

//googleapis
const { google } = require("googleapis");
const cors = require("cors");

//initilize express
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
const auth = new google.auth.GoogleAuth({
  keyFile: "config.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/drive",
  ],
});
const authClientObject = auth.getClient();
const googleSheetsInstance = google.sheets({
  version: "v4",
  auth: authClientObject,
});
const googleFormInstance = google.forms({
  version: "v1",
  auth: authClientObject,
});
const googleDriveInstance = google.drive({
  version: "v3",
  auth: authClientObject,
});

app.get("/sheet/:spreasheetId/:id", async (req, res) => {
  //Read front the spreadsheet
  const readData = await googleSheetsInstance.spreadsheets.values.get({
    auth, //auth object
    spreadsheetId: req.params.spreasheetId, // spreadsheet id
    range: req.params.id, //range of cells to read from.
  });

  //send the data reae with the response
  const result = formatRowData(readData.data.values[0], readData.data.values);
  res.send(result);
});
app.get("/doc/:id", async (req, res) => {
  try {
    const readDocResponse = await googleFormInstance.forms.get({
      auth,
      formId: req.params.id,
    });
    const responseData = readDocResponse.data;
    const result = {
      formTitle: responseData.info.title,
      formID: responseData.formId,
      items: responseData.items[2],
      linkedSheetId: responseData.linkedSheetId,
      formUrl: responseData.responderUri,
    };
    res.send(result);
  } catch (err) {
    res.send({});
  }
});

app.get("/sheets/:id", async (req, res) => {
  const spreadsheets = await googleSheetsInstance.spreadsheets.get({
    auth, //auth object
    spreadsheetId: req.params.id,
  });

  const result = spreadsheets.data.sheets.map((item) => {
    return {
      title: item.properties.title,
      sheetId: item.properties.sheetId,
      index: item.properties.index,
    };
  });
  res.send(result);
});
// retrieves google forms from drive
app.get("/forms", async (req, res) => {
  const driveFiles = await googleDriveInstance.files.list({
    auth,
    fields: "nextPageToken, files(id, name)",
  });
  res.send(driveFiles.data.files);
});
app.put("/sheet/score", async (req, res) => {
  const updateSheet = await googleSheetsInstance.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: "Day1!B2",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[2]],
    },
  });
  res.send(updateSheet);
});
// app.get('/score/id', async(req,res) => {

// })
app.get("/score/:id", async (req, res) => {
  const spreadsheets = await googleSheetsInstance.spreadsheets.get({
    auth, //auth object
    spreadsheetId: req.params.id,
  });
  let response = { data: [] };
  // res.send(spreadsheets)
  const result = spreadsheets.data.sheets.map((item) => {
    return {
      title: item.properties.title,
      sheetId: item.properties.sheetId,
      index: item.properties.index,
    };
  });
  let respData = [];
  respData = await getAllSpreadsheetData(result, req).then((data) => {
    const formatData = formatAllSheetData(data);
    res.json(formatData);
  });
});
async function getAllSpreadsheetData(result, req) {
  let responseData = {};
  //   return await new Promise((resolve, reject) => {
  await Promise.all(
    result.map(async (item) => {
      if (item.title !== "Registrations" && item.title !== "Results") {
        const allSpreadSheetData =
          await googleSheetsInstance.spreadsheets.values.get({
            auth, //auth object
            spreadsheetId: req.params.id,
            range: item.title,
          });
        //   console.log(formatRowData(['Data','Score','FullName','RegID','Answer','Reference'], allSpreadSheetData.data.values))
        responseData[item.title] = formatRowData(
          ["Date", "Score", "FullName", "RegID", "Answer", "Reference"],
          allSpreadSheetData.data.values
        );
        // responseData[item.title] = allSpreadSheetData.data.values;
      }
    })
  );
  return responseData;
}
function formatRowData(keys, data) {
  let result = [];
  if (data) {
    for (let i = 1; i < data.length; i++) {
      if (data[i].length > 0) {
        let obj = {};
        data[i].forEach((element, index) => {
          obj[keys[index]] = element;
        });
        result.push(obj);
      }
    }
  }

  return result;
}
function formatAllSheetData(data) {
  const groupedData = {};
  for (const day in data) {
    const entries = data[day];
    if (entries && entries.length > 0) {
      Object.entries(entries).forEach((entry) => {
        const [key, value] = entry;
        if (value && value['RegID']) {
          if (entry.length >= 0) {
            // Make sure the entry has at least Registration ID
            const registrationId = value["RegID"].trim(); // Assuming Registration ID is at index 2
            if (!groupedData[registrationId.toUpperCase()]) {
              groupedData[registrationId.toUpperCase()] = { data: [value] };
            } else {
              groupedData[registrationId.toUpperCase()].data.push(value);
            }
            groupedData[registrationId.toUpperCase()]["score"] = getTotalScore(
              groupedData[registrationId.toUpperCase()].data
            );
            groupedData[registrationId.toUpperCase()]["fullName"] =
              value["FullName"];
            groupedData[registrationId.toUpperCase()]["registrationID"] =
              value["RegID"];
            groupedData[registrationId.toUpperCase()]["noOfDays"] =
              groupedData[registrationId.toUpperCase()].data.length;
          }
        }
      });
    }
  }
  return groupedData;
}
function getTotalScore(data) {
  let result = 0;
  data.forEach((item) => {
    result = result + parseInt(item["Score"].split("/")[0].trim());
  });
  return result;
}
let port = process.env.PORT || 5001
app.listen(port, () => {
  console.log("server is running on 3000 port", port);
});
