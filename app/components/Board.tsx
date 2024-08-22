import React, { useState } from 'react';
import Column from './Column';
import { createTicket } from '~/utils/api';

interface Ticket {
    id: string;
    title: string;
    description: string;
}

interface Column {
    id: string;
    name: string;
    tickets: Ticket[];
}

interface BoardData {
    id: string;
    name: string;
    columns: Column[];
}

interface BoardProps {
    data: BoardData;
    onUpdate: (newData: BoardData) => void;
}

const Board: React.FC<BoardProps> = ({ data, onUpdate }) => {
    const [localData, setLocalData] = useState<BoardData>(data);
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketDescription, setNewTicketDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newTicket = await createTicket(localData.id, newTicketTitle, newTicketDescription);
            const updatedColumns = localData.columns.map((column: Column, index: number) =>
                index === 0 ? { ...column, tickets: [newTicket, ...column.tickets] } : column
            );
            const updatedData = {...localData, columns: updatedColumns};
            setLocalData(updatedData);
            onUpdate(updatedData);
            setNewTicketTitle('');
            setNewTicketDescription('');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>{localData.name}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    placeholder="New ticket title"
                    required
                />
                <input
                    type="text"
                    value={newTicketDescription}
                    onChange={(e) => setNewTicketDescription(e.target.value)}
                    placeholder="New ticket description"
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Ticket'}
                </button>
            </form>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {localData.columns.map(column => (
                    <Column key={column.id} data={column} />
                ))}
            </div>
        </div>
    );
};

export default Board;