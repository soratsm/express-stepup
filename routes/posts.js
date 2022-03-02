import express from "express";
import { MongoClient } from "mongodb"

import config from "../config/mongodb.config.js";
const { CONNECTION_URL, OPTIONS, DATABSE } = config;
const router = express.Router();

router.get("/*", (req, res) => {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    var db = client.db(DATABSE);
    db.collection("posts").findOne({
      url: req.url
    }).then((doc) => {
      res.render("./posts/index.ejs", doc);
    }).catch((error) => {
      throw error;
    }).then(() => {
      client.close();
    });
  });
});

export default router;
