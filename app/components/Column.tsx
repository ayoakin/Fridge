import React from 'react';
import Task from './Task';

interface Ticket {
  id: string;
  title: string;
  description: string;
}

interface ColumnData {
  id: string;
  name: string;
  tickets: Ticket[];
}

interface ColumnProps {
  data: ColumnData;
}

const Column: React.FC<ColumnProps> = ({ data }) => {
  return (
      <div style={{ minWidth: '200px', background: '#f0f0f0', padding: '10px', margin: '10px' }}>
        <h3>{data.name}</h3>
        {[...data.tickets].reverse().map(ticket => (
            <Task key={ticket.id} data={ticket} />
        ))}
      </div>
  );
};

export default Column;
