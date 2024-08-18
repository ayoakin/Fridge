import React from 'react';
import Task from './Task';

interface ColumnData {
  id: string;
  name: string;
  tickets: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

interface ColumnProps {
  data: ColumnData;
}

const Column: React.FC<ColumnProps> = ({ data }) => {
  return (
      <div style={{ minWidth: '200px', background: '#f0f0f0', padding: '10px', margin: '10px' }}>
        <h3>{data.name}</h3>
        {data.tickets.map(ticket => (
            <Task key={ticket.id} data={ticket} />
        ))}
      </div>
  );
};

export default Column;