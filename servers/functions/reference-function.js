const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const express = require('express');
const cors = require("cors")

const app = express()
app.use(cors({ origin: true }))
app.post('*', (req, res)=> {
  let name;
  switch (req.get('content-type')) {
    case 'multipart/form-data':
      name = req.body.name;
      break;
  }
  res.status(200).send({message: `Hello ${name || 'World'}!`});
})

exports.function = functions.https.onRequest(app)
