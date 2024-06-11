"use strict";

const express = require("express");
const { mongo } = require("../utils/mongo");
const createError = require("http-errors");

const router = express.Router();

// Base: http://localhost:3000/api/employees/:empId
// Valid: http://localhost:3000/api/employees/1007
//
// Invalid: http://localhost:3000/api/employees/foo
// Invalid: http://localhost:3000/api/employee/9999

router.get("/:empId", (req, res, next) => {
  try {
    console.log (req.params.empId);
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // early return - design pattern
    if (isNaN(empId)) {
      console.error("Input must be a number");
      return next(createError(400, "Input must be a number"));
    }


    // database query is handled
    mongo(async db => {
      const employee = await db.collection("employees").findOne({ empId }); // find the  employee by empId

      if (!employee) {
        // If the employee is not found
        console.error("Employee not found", empId);
        return next(createError(404, "Employee not found"));
      }
      res.send(employee); // return the employee object
    }, next)
  } catch (err) {
    console.error("Error:", err);
    next(err); // forward the error to the error handler
  }
})

/**
 * findAllTask API
 * @returns JSON array of all tasks
 * @throws { 500 error } - if there is a server error
 * @throws { 400 error } - if the employee id is not a number
 * @throws { 404 error } - if no task are found
 */
router.get('/:empId/tasks', (req, res, next) => {
  try{

    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // Check to determine if the returned value from parseInt is Nan
    if (isNaN(empId)) {
      return next(createError(400, 'Employee ID must be a number'));
    }

    //Call our mongo mongo module and return a list of tasks by employee ID
    mongo(async db => {

      const tasks = await db.collection('employee').findOne( { empId: empId}, { projection: { empId: 1, todo: 1, done: 1} } );

      console.log('task', task);

      // If there are no tasks found for the employee Id; return a 404 error object to our middleware error handler
      if(!tasks) {
        return next(createError(404, `Tasks not found for employee ID ${empId}`));
      }

        res.send(tasks);
    }, next);

  } catch(err) {
    console.error('err',err);
    next(err);
  }
});
    module.exports = router; // end module.exports = router