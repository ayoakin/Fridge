import { json } from "@remix-run/node";

const BASE_URL = "https://api.justdecision.com"

async function apiCall(endpoint: string, method: string, data?: any, token?: string) {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
        throw json({ error: "API call failed" }, { status: response.status });
    }

    return response.json();
}

export async function sendLoginEmail(email: string) {
    return apiCall("/v1/user/email_simple_login", "POST", { email });
}

export async function login(email: string, code: string) {
    return apiCall("/v1/user/extension_login", "POST", { email, token: code });
}

export async function createBoard(boardName: string, token: string) {
    return apiCall("/scrum/create-board", "POST", { board_name: boardName }, token);
}

export async function getBoard(boardId: string, token: string) {
    return apiCall(`/scrum/get-board/${boardId}`, "GET", null, token);
}

export async function createTicket(boardId: string, title: string, description: string, assigneeEmail: string, userEmail: string, token: string) {
    return apiCall("/scrum/create-ticket", "POST", { board_id: boardId, title, description, assignee_email: assigneeEmail, user_email: userEmail }, token);
}

export async function moveTicket(ticketId: string, newColumnId: string, token: string) {
    return apiCall("/scrum/move-ticket", "PATCH", { ticket_id: ticketId, new_column_id: newColumnId }, token);
}

export async function addComment(ticketId: string, content: string, userEmail: string, token: string) {
    return apiCall("/scrum/add-comment", "POST", { ticket_id: ticketId, content, user_email: userEmail }, token);
}

export async function archiveBoard(boardId: string, userEmail: string, token: string) {
    return apiCall(`/scrum/archive-board/${boardId}`, "PATCH", { user_email: userEmail }, token);
}