const express = require('express')
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { isCelebrate } = require('celebrate');

const app = express()
const port = 3000
require('dotenv').config()

app.get('/sheet',async (req,res,next) => {

  try {
      // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(process.env.SHEET_URL);

  //Auth Way 1
  // const creds = require('../tokyo-mind-234115-a82cfd9b9c7e.json');
  // await doc.useServiceAccountAuth(creds);
  //Auth Way 2 (or)
  await doc.useServiceAccountAuth({
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
  });
  await doc.loadInfo(); // loads document properties and worksheets
//   console.log(doc);
  await doc.updateProperties({ title: 'User Info , 2021' });
  // create a sheet and set the header row
const sheet = await doc.addSheet({ headerValues: ['name', 'email'] });
// append rows
const row1 = await sheet.addRow({ name: 'Hasan Rothi', email: 'hasantechnologist@gmail.com' });
const row2 = await sheet.addRows([
  { name: 'Sahaj Uddin', email: 'sahajuddinkhan100@gmail.com' },
  { name: 'Nirab', email: 'nirab@gmail.com' },
]);

// Also add rows based on req.body

const rows = await sheet.getRows();
// console.log("Rows",rows)
  res.json({
      "message": "Google SpreadSheet is joss."
  })
  } catch (error) {
      next(error)
  }
})

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Not Found!');
    err.status = 404;
    next(err);
  });
  
// Global Error handler 
  app.use((err, req, res, next) => {
    const status = err.status ? 400 : err.status || 500;
    const message =
      process.env.NODE_ENV === 'production' && err.status === 500
        ? 'Something Went Wrong!'
        : err.message;
  
    if (status === 500) console.log(err.stack);
  
    res.status(status).json({
      status: status >= 500 ? 'error' : 'fail',
      message,
    });
  });


app.listen(port, () => {
  console.log(`Excel app listening at http://localhost:${port}`)
})