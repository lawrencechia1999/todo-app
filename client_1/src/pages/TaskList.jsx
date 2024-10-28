// TaskList.jsx

import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LoopIcon from '@mui/icons-material/Loop';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import DateFormatter from '../components/DateFormatter';

const TaskList = ({ tasks, fetchTasks, setCurrentTask }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'New':
        return { color: 'blue', icon: <PendingActionsIcon /> };
      case 'WIP':
        return { color: 'orange', icon: <LoopIcon /> };
      case 'On hold':
        return { color: 'orange', icon: <PauseCircleIcon /> };
      case 'Cancelled':
        return { color: 'red', icon: <CancelIcon /> };
      case 'Completed':
        return { color: 'green', icon: <CheckCircleIcon /> };
      default:
        return { color: 'black', icon: null };
    }
  };

  const columns = [
    { field: 'row_number', headerName: 'No', width: 60 },
    { field: 'task_name', headerName: 'Task Name', width: 300 },
    //{ field: 'task_description', headerName: 'Task Description', width: 400 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150, 
      renderCell: (params) => {
        const { color, icon } = getStatusStyle(params.value);

        return (
          <Box
          sx={{
            color,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '12px',
            padding: '2px 8px',   // Adjusted padding for compact display
            fontWeight: 'bold',
            fontSize: '0.75rem',   // Smaller font size for compactness
            gap: '2px',            // Smaller gap between icon and text
            maxWidth: '100px',     // Restrict max width to ensure compact layout
            whiteSpace: 'nowrap',  // Prevents wrapping
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          >
            {icon}
            <span>{params.value}</span>
          </Box>
        );
      },
    },
    { 
      field: 'created_datetime', 
      headerName: 'Created Date Time', 
      width: 150,
      renderCell: (params) => (
        <DateFormatter dateString={params.row.created_datetime} /> 
      ), 
    },
    { 
      field: 'updated_datetime', 
      headerName: 'Updated Date Time', 
      width: 150, 
      renderCell: (params) => (
        <DateFormatter dateString={params.row.updated_datetime} /> 
      ), 
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <IconButton
            color="primary"
            onClick={() => {
              setCurrentTask(params.row); // Set the current task for editing
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={async () => {
              try {
                await fetch('http://localhost:5000/todoList/deleteTask', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ id: params.row.id }),
                });
                fetchTasks(); // Refresh the task list
              } catch (error) {
                console.error('Error deleting task:', error);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid rows={tasks} columns={columns} getRowId={(row) => row.id} />
    </div>
  );
};

export default TaskList;
