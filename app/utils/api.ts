import axios from 'axios';

const BASE_URL = "https://api.justdecision.com";

// Use localStorage for token storage
const getToken = () => localStorage.getItem('teamToken');
const setToken = (token: string) => localStorage.setItem('teamToken', token);
const removeToken = () => localStorage.removeItem('teamToken');

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const sendLoginEmail = async (email: string) => {
    const response = await api.post('/v1/user/email_simple_login', { email });
    return response.data;
};

export const login = async (email: string, code: string) => {
    const response = await api.post('/v1/user/extension_login', { email, token: code });
    if (response.data.team_token) {
        setToken(response.data.team_token);
        localStorage.setItem('userEmail', email);
    }
    return response.data;
};

export const logout = () => {
    removeToken();
    localStorage.removeItem('userEmail');
};

export const createBoard = async (boardName: string) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        throw new Error('User email not found. Please log in again.');
    }
    const response = await api.post('/scrum/create-board', {
        board_name: boardName,
        user_email: userEmail
    });
    return response.data;
};

export const getBoard = async (boardId: string) => {
    const response = await api.get(`/scrum/get-board/${boardId}`);
    return response.data;
};

export const createTicket = async (boardId: string, title: string, description: string) => {
    const response = await api.post('/scrum/create-ticket', {
        board_id: boardId,
        title,
        description,
        assignee_email: localStorage.getItem('userEmail'),
        user_email: localStorage.getItem('userEmail')
    });
    return response.data;
};

export const moveTicket = async (ticketId: string, newColumnId: string) => {
    const response = await api.patch('/scrum/move-ticket', { ticket_id: ticketId, new_column_id: newColumnId });
    return response.data;
};

export const addComment = async (ticketId: string, content: string) => {
    const response = await api.post('/scrum/add-comment', {
        ticket_id: ticketId,
        content,
        user_email: localStorage.getItem('userEmail')
    });
    return response.data;
};

export const archiveBoard = async (boardId: string) => {
    const response = await api.patch(`/scrum/archive-board/${boardId}`, {
        user_email: localStorage.getItem('userEmail')
    });
    return response.data;
};