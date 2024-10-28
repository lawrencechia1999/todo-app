const express = require('express');
const client =require("../db");
const router = express.Router();

// Get ALL Task List
router.get('/tasks', async (req, res) => {
    try {
    
        const response = await client.query(`
            SELECT 
                ROW_NUMBER() OVER (ORDER BY created_datetime DESC) AS row_number,
                id, 
                task_name, 
                status, 
                task_description, 
                created_datetime, 
                updated_datetime
            FROM public.task
            ORDER BY created_datetime DESC;
        `);
    
        if (response.rows[0] != '') {
            res.json({errorInd: '0', message: "Task Data Retrieve Successfully", data: response.rows});
        } else {
            res.json({errorInd: '1', message: "No record Found"});
        }
    } catch (err) {
        res.json({errorInd: '1', message: "server side occur errors"});
        console.log(err.message);
    }
})

// Get a Task Details
router.get('/taskDetails', async (req, res) => {
    try {
    
        const response = await client.query(`
            SELECT id, task_name, task_description, status, created_datetime, updated_datetime
            FROM public.task;
            WHERE id = ${req.body.id}
        `);
    
        if (response.rows[0] != '') {
            res.json({errorInd: '0', message: "Task Details Retrieve Successfully", data: response.rows});
        } else {
            res.json({errorInd: '1', message: "No record Found"});
        }
    } catch (err) {
        res.json({errorInd: '1', message: "server side occur errors"});
        console.log(err.message);
    }
})

// Add a task
router.post('/addTask', async (req,res) => {
    try {
        console.log("check in addTask");

        // Check existance of data input
        console.log(req.body);

        const newRecord = await client.query(`
            INSERT INTO public.task (task_name, task_description, status, created_datetime) 
            VALUES('${req.body.task_name}','${req.body.task_description}', 'New',current_timestamp)
            RETURNING *;
        `);

        res.json({errorInd: '0', message: "Task record created Successfully.", data: newRecord.rows[0]});

    } catch (err) {
        res.json({errorInd: '1', message: err.message});
        console.error(err.message);
    }
})

// Edit Task
router.put('/editTask', async (req, res) => {
    try {
        console.log("check in editTask");

        // Check existence of data input
        console.log(req.body);

        const { task_name, task_description, status, id} = req.body;

        // Perform the update
        const updatedRecord = await client.query(`
            UPDATE public.task
            SET 
                task_name = $1,
                task_description = $2,
                status = $3,
                updated_datetime = current_timestamp
            WHERE id = $4
            RETURNING *;
        `, [task_name, task_description, status, id]);

        // Return the updated task
        res.json({ errorInd: '0',  data: updatedRecord.rows[0], message: "Task updated Successfully." });

    } catch (err) {
        res.json({ errorInd: '1', message: err.message });
        console.error(err.message);
    }
});

// Delete Task
router.post('/deleteTask', async (req,res) => {
    try {
        console.log("check in deleteTask");

        // Check existance of data input
        console.log(req.body);

        const newRecord = await client.query(`
            DELETE FROM public.task
            WHERE id = ${req.body.id}
        `);

        res.json({errorInd: '0', message: "Task has deleted Successfully."});

    } catch (err) {
        res.json({errorInd: '1', message: err.message});
        console.error(err.message);
    }
})

module.exports = router;