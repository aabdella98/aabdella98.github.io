

import express from "express";
import fetch from "node-fetch";

const sqlite3 = require('sqlite3').verbose(); 
const express = require('express');
const fetch = require('node-fetch');

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import writeUser from "./libraries/writeuser";


const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function processDataForFrontEnd(req, res) {
  const baseURL = "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json"; 
  fetch(baseURL)
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      res.send({ data: data }); /
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/error");
    });
}
app
  .route("/api")
  .get((req, res) => {
    // processDataForFrontEnd(req, res)
    (async () => {
      const db = await open(dbSettings);
      const result = await db.all("SELECT * FROM user");
      console.log("Expected result", result);
      res.json(result);
    })();
  })
  .post((req, res) => {
    console.log("/api post request", req.body);
    if (!req.body.name) {
      console.log(req.body);
      res.status("418").send("something went wrong, i am a teapot");
    } else {
      writeUser(req.body.name, dbSettings)
      .then((result) => {
        console.log(result);
        res.send("successful"); // simple mode
      })
      .catch((err) => {
        console.log(err);
      });
    }
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
