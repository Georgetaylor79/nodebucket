"use strict";

const express = require("express");
const { mongo } = require("../utils/mongo"); // require teh mongo module from the utils folder
const createError = require("http-errors");
const Ajv = require('ajv');
const { ObjectId } = require('mongo');



const router = express.Router();

// Base: http://localhost:3000/api/employees/:empId
// Valid: http://localhost:3000/api/employees/1007
//
// Invalid: http://localhost:3000/api/employees/foo
// Invalid: http://localhost:3000/api/employee/9999

const ajv = new Ajv(); // create a new instance of the Ajv object from the npm package


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


/**
 *  Create Task API;
 */

const taskSchema = {
  type: 'object',
  properties: {
    text: { type: 'string' }
  },
  required: ['text'],
  additionalProperties: false
};


router.post('/:empId/tasks', (req, res, next) => {
  try {

    // Check if the empId from the req params is a number
    let{ empId } = req.params;
    empId = parseInt(empId, 10);

    // Check to see if the parseInt function returns a number of NaN; if NaN it means the empId  is not a number,
    if (isNaN(empId)) {
      return next (createError(400, 'Employee ID must be a number'));
    }

    mongo(async db => {

      const employee = await db.collection('employees').findOne( { empId: empId} );

      // if the employee is not found return a 404 error
      if (!employee) {
        return next(createError(404, 'Employee not found with empId', empId));
      }



      const validator = ajv.compile(taskSchema);
      const valid = validator(req.body )


      if (!valid) {
        return next(createError(400, 'Invalid task payload', validator.errors))
      }

      const newTask = {
        _id: new ObjectId(),
        text: req.body.text
      }

      //call the mongo module and update the employee collection with the new task in the todo column
      const result = await db.collection('employees').updateOne(
        {empId: empId },
        { $push: { todo: newTask }
      })

      // check to see if the modified count is updated; if so then the task was added to the employee field.
      if (!result.modifiedCount) {
        return next(createError(400, 'Unable to create task'));
      }

      res.status(201).send({ id: newTask._id});

    },next);

  } catch (err) {
    console.error('err', err);
    next(err);
  }
});


    module.exports = router; // end module.exports = router