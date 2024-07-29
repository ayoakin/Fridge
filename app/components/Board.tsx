import React from 'react';
import Column from './Column';

interface BoardProps {
  tasks: {
    id: string;
    title: string;
    status: string;
    comments: string[];
  }[];
  moveTask: (id: string, status: "todo" | "doing" | "done") => void;
  onTaskClick: (task: any) => void;
}

const Board: React.FC<BoardProps> = ({ tasks, moveTask, onTaskClick }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {['todo', 'doing', 'done'].map((status) => (
        <Column
          key={status}
          status={status as "todo" | "doing" | "done"}
          tasks={tasks.filter(task => task.status === status)}
          moveTask={moveTask}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
};

export default Board;
