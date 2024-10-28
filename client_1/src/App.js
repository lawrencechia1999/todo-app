import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import AddTask from './pages/AddEditTask';
import TaskList from './pages/TaskList';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null); // New state for current task being edited

    const fetchTasks = async () => {
        const response = await fetch('http://localhost:5000/todoList/tasks');
        const json = await response.json();
        if (json.errorInd === '0') {
            console.log(json.data);
            setTasks(json.data);
        } else {
            console.error(json.message);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <Container maxWidth="lg">
            <br />
            <Typography variant="h4" align="center" gutterBottom>
                To-Do List
            </Typography>
            <AddTask
                fetchTasks={fetchTasks}
                setTasks={setTasks}
                currentTask={currentTask}
                setCurrentTask={setCurrentTask} // Pass down the setter
            />
            <TaskList
                tasks={tasks}
                fetchTasks={fetchTasks}
                setCurrentTask={setCurrentTask} // Pass down the setter
            />
        </Container>
    );
};

export default App;
