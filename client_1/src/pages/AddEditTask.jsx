import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, MenuItem, Grid } from '@mui/material';
import DateFormatter from '../components/DateFormatter';
import AlertMessage from '../components/Alert';

const AddTask = ({ fetchTasks, setTasks, currentTask, setCurrentTask }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [status, setStatus] = useState('New');
    const [created_datetime, setCreated_datetime] = useState('');
    const [updated_datetime, setUpdated_datetime] = useState('');

    // Snackbar state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success'); // or 'error'

    const resetFields = useCallback(() => {
        // Reset all fields
        setTaskName('');
        setTaskDescription('');
        setStatus('New');
        setCreated_datetime('');
        setUpdated_datetime('');
        setCurrentTask(null);
    }, [setCurrentTask]); // Add setCurrentTask to dependencies
    
    useEffect(() => {
        if (currentTask) {
            setTaskName(currentTask.task_name);
            setTaskDescription(currentTask.task_description);
            setStatus(currentTask.status);
            setCreated_datetime(currentTask.created_datetime);
            setUpdated_datetime(currentTask.updated_datetime);
        } else {
            resetFields();
        }
    }, [currentTask, resetFields]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = currentTask ? 'http://localhost:5000/todoList/editTask' : 'http://localhost:5000/todoList/addTask';
        const method = currentTask ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: currentTask ? currentTask.id : undefined,
                    task_name: taskName,
                    task_description: taskDescription,
                    created_datetime: currentTask ? currentTask.created_datetime : undefined,
                    updated_datetime: currentTask ? new Date().toISOString() : undefined,
                    status: status 
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Error response:', text);
                throw new Error('Network response was not ok.');
            }

            const json = await response.json();

            if (json.errorInd === '0') {
                const newTask = json.data;

                if (newTask && newTask.id) {
                    if (currentTask) {
                        setTasks((prevTasks) => 
                            prevTasks.map((task) => (task.id === newTask.id ? newTask : task))
                        );
                    } else {
                        setTasks((prevTasks) => [...prevTasks, newTask]);
                    }
                    await fetchTasks();
                    setAlertMessage(json.message);
                    setAlertSeverity('success');
                    setAlertOpen(true);
                    resetFields();
                } else {
                    console.error('New task does not have an id:', newTask);
                    setAlertMessage(json.message || 'New task does not have an id.');
                    setAlertSeverity('error');
                    setAlertOpen(true);
                }
            } else {
                console.error(json.message);
                setAlertMessage('Error: ' + json.message);
                setAlertSeverity('error');
                setAlertOpen(true);
            }

            if (!currentTask) {
                resetFields();
            }
        } catch (error) {
            console.error('Error during submission:', error);
        }
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleDescriptionChange = (e) => {
        setTaskDescription(e.target.value);
        const textArea = e.target;
        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px',
                margin: '16px 0',
                bgcolor: 'background.paper',
                borderRadius: '8px',
                boxShadow: 3,
            }}
        >
            <Grid container spacing={3} alignItems="center">
            
                <Grid item xs={12} md={5}>
                    <TextField
                        variant="outlined"
                        label="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={7}>
                    <TextField
                        variant="outlined"
                        label="Task Description"
                        value={taskDescription}
                        onChange={handleDescriptionChange}
                        multiline
                        rows={1}
                        fullWidth
                        style={{ resize: 'none' }}
                    />
                </Grid>

                {currentTask && (
                    <>
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                variant="outlined"
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="New">New</MenuItem>
                                <MenuItem value="WIP">WIP</MenuItem>
                                <MenuItem value="On hold">On hold</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <span>
                                <b>Created Date Time: </b><DateFormatter dateString={created_datetime} />
                            </span>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <span>
                                <b>Updated Date Time: </b><DateFormatter dateString={updated_datetime} />
                            </span>
                        </Grid>
                    </>
                )}

                <Grid item xs={12} md={2}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {currentTask ? 'Save' : 'Add Task'}
                    </Button>
                    {currentTask && (
                        <Button 
                            variant="outlined" 
                            color="error" 
                            onClick={resetFields}
                            sx={{ mt: 1 }}
                            fullWidth
                        >
                            Cancel
                        </Button>
                    )}
                </Grid>
            </Grid>

            {/* Add AlertMessage component */}
            <AlertMessage 
                open={alertOpen} 
                handleClose={handleCloseAlert} 
                severity={alertSeverity} 
                message={alertMessage} 
            />
        </Box>
    );
};

export default AddTask;
