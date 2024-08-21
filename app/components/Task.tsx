import React from 'react';

interface TaskData {
    id: string;
    title: string;
    description: string;
}

interface TaskProps {
    data: TaskData;
}

const Task: React.FC<TaskProps> = ({ data }) => {
    return (
        <div style={{ background: 'white', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
            <h4>{data.title}</h4>
            <p>{data.description}</p>
        </div>
    );
};

export default Task;