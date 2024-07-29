import React from 'react';
import { useDrag } from 'react-dnd';

interface TaskProps {
  task: {
    id: string;
    title: string;
    status: string;
    comments: string[];
  };
  onClick: () => void;
}

const Task: React.FC<TaskProps> = ({ task, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        border: '1px solid #ccc',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: 'white',
      }}
      onClick={onClick}
    >
      <h3>{task.title}</h3>
      <p>Comments: {task.comments.length}</p>
    </div>
  );
};

export default Task;