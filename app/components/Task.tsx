import React from 'react';

interface TaskProps {
    data: {
        id: string;
        title: string;
        description: string;
    };
}

const Task: React.FC<TaskProps> = ({ data }) => {
    return (
        <div style={{ background: 'white', margin: '10px 0', padding: '10px', borderRadius: '4px' }}>
            <h4>{data.title}</h4>
            <p>{data.description}</p>
        </div>
    );
};

export default Task;
