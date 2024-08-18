import React from 'react';
import Column from './Column';

export interface BoardData {
  id: string;
  name: string;
  columns: Array<{
    id: string;
    name: string;
    tickets: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  }>;
}

interface BoardProps {
  data: BoardData;
}

const Board: React.FC<BoardProps> = ({ data }) => {
  return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h2>{data.name}</h2>
        {data.columns.map(column => (
            <Column key={column.id} data={column} />
        ))}
      </div>
  );
};

export default Board;