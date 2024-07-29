import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';

interface ColumnProps {
  status: "todo" | "doing" | "done";
  tasks: {
    id: string;
    title: string;
    status: string;
    comments: string[];
  }[];
  moveTask: (id: string, status: "todo" | "doing" | "done") => void;
  onTaskClick: (task: any) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, moveTask, onTaskClick }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string }) => moveTask(item.id, status),
  });

  return (
    <div ref={drop} style={{ width: '30%', minHeight: '300px', border: '1px solid #ccc', padding: '10px' }}>
      <h2 style={{ textTransform: 'capitalize' }}>{status}</h2>
      {tasks.map((task) => (
        <Task key={task.id} task={task} onClick={() => onTaskClick(task)} />
      ))}
    </div>
  );
};

export default Column;
