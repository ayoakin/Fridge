import React from 'react';

interface TicketData {
    id: string;
    title: string;
    description: string;
}

interface TicketProps {
    data: TicketData;
    onMove: (ticketId: string) => void;
}

const Ticket: React.FC<TicketProps> = ({ data, onMove }) => {
    return (
        <div
            style={{ background: 'white', padding: '10px', margin: '10px 0', borderRadius: '4px', cursor: 'move' }}
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', data.id);
            }}
            onClick={() => onMove(data.id)}
        >
            <h4>{data.title}</h4>
            <p>{data.description}</p>
        </div>
    );
};

export default Ticket;