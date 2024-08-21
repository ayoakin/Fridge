import React, { useState } from 'react';
import Column from './Column';
import { createTicket } from '~/utils/api';

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
    onUpdate: (newData: BoardData) => void;
}

const Board: React.FC<BoardProps> = ({ data, onUpdate }) => {
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketDescription, setNewTicketDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const newTicket = await createTicket(data.id, newTicketTitle, newTicketDescription);

            // Update the board data with the new ticket
            const updatedData = {
                ...data,
                columns: data.columns.map(column =>
                    column.id === data.columns[0].id // Assuming new tickets are added to the first column
                        ? { ...column, tickets: [...column.tickets, newTicket] }
                        : column
                )
            };

            onUpdate(updatedData);
            setNewTicketTitle('');
            setNewTicketDescription('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create ticket');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>{data.name}</h2>
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {data.columns.map(column => (
                    <Column key={column.id} data={column} />
                ))}
            </div>
        </div>
    );
};

export default Board;