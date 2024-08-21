import React, { useState } from 'react';
import { Form } from '@remix-run/react';
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
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketDescription, setNewTicketDescription] = useState('');

    return (
        <div>
            <h2>{data.name}</h2>
            <Form method="post">
                <input
                    type="text"
                    name="title"
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    placeholder="New ticket title"
                />
                <input
                    type="text"
                    name="description"
                    value={newTicketDescription}
                    onChange={(e) => setNewTicketDescription(e.target.value)}
                    placeholder="New ticket description"
                />
                <input type="hidden" name="action" value="createTicket" />
                <input type="hidden" name="boardId" value={data.id} />
                <button type="submit">Create Ticket</button>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {data.columns.map(column => (
                    <Column key={column.id} data={column} />
                ))}
            </div>
        </div>
    );
};

export default Board;