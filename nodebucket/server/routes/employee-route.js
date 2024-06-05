"use strict";

const express = require("express");
const { mongo } = require("../utils/mongo");

const router = express.Router();


router.get("/:empId", (req, res, next) => {
  try{
    let { empId } = req.params;
    empId
  }
} )