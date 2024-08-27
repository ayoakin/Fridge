import React, { useState, useEffect } from 'react';
import Column from './Column';
import { getBoard, createTicket } from '~/utils/api';

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

export type BoardData = {
    id: string;
    name: string;
    columns: ColumnData[];
};

interface BoardProps {
    data: BoardData;
    onUpdate: (newData: BoardData) => void;
}

const Board: React.FC<BoardProps> = ({ data, onUpdate }) => {
    const [boardData, setBoardData] = useState<BoardData>(data);
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketDescription, setNewTicketDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBoardLoading, setIsBoardLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const boardId = localStorage.getItem('boardId');
        console.log('Board component mounted. boardId from localStorage:', boardId);

        const loadBoardData = async () => {
            setIsBoardLoading(true);
            setError(null);
            if (!boardId) {
                setError('Board ID is missing from localStorage');
                setIsBoardLoading(false);
                return;
            }
            try {
                console.log('Fetching board data for boardId:', boardId);
                const data = await getBoard(boardId);
                console.log('Received board data:', data);
                setBoardData(data);
            } catch (error) {
                console.error('Failed to fetch board data:', error);
                setError('Failed to fetch board data. Please try again later.');
            } finally {
                setIsBoardLoading(false);
            }
        };
        loadBoardData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!boardData) return;

        const boardId = localStorage.getItem('boardId');
        if (!boardId) {
            setError('Board ID is missing from localStorage');
            return;
        }

        setIsLoading(true);
        try {
            const newTicket = await createTicket(boardId, newTicketTitle, newTicketDescription);
            setBoardData(prevData => {
                const updatedColumns = [...prevData.columns];
                if (updatedColumns.length > 0) {
                    updatedColumns[0] = {
                        ...updatedColumns[0],
                        tickets: [newTicket, ...updatedColumns[0].tickets]
                    };
                }
                return { ...prevData, columns: updatedColumns };
            });
            setNewTicketTitle('');
            setNewTicketDescription('');
        } catch (err) {
            console.error('Failed to create ticket:', err);
            setError('Failed to create ticket. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isBoardLoading) {
        return <div>Loading board data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!boardData) {
        return <div>No board data available. Please try again later.</div>;
    }

    return (
        <div>
            <h2>{boardData.name}</h2>
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
                    {isLoading ? 'Creating...' : 'Create Tdddicket'}
                </button>
            </form>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {boardData.columns.map(column => (
                    <Column key={column.id} data={column} />
                ))}
            </div>
        </div>
    );
};

export default Board;
