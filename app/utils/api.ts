import { json } from "@remix-run/node";
import { sessionStorage } from "~/utils/session.server";

const BASE_URL = "https://api.justdecision.com"
// const BASE_URL = "http://localhost:8080";

async function getSessionData(request: Request) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    return {
        token: session.get("teamToken"),
        userEmail: session.get("userEmail")
    };
}

async function apiCall(request: Request, endpoint: string, method: string, data?: any) {
    let { token, userEmail } = await getSessionData(request);
    // token = 'cc43e54b-bc3f-4333-9f90-20b2d84a1c32'
    console.log("API call", endpoint, method, data);
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
        console.error("API call failed", response.status, response.statusText);
        throw json({ error: "API call failed" }, { status: response.status });
    }
    return response.json();
}

export async function createTicket(request: Request, boardId: string, title: string, description: string) {
    const { userEmail } = await getSessionData(request);
    return apiCall(request, "/scrum/create-ticket", "POST", {
        board_id: boardId,
        title,
        description,
        assignee_email: userEmail,
        user_email: userEmail
    });
}

export async function sendLoginEmail(email: string) {
    return apiCall({} as Request, "/v1/user/email_simple_login", "POST", { email });
}

export async function login(email: string, code: string) {
    return apiCall({} as Request, "/v1/user/extension_login", "POST", { email, token: code });
}

export async function createBoard(request: Request, boardName: string) {
    return apiCall(request, "/scrum/create-board", "POST", { board_name: boardName });
}

export async function getBoard(request: Request, boardId: string) {
    return apiCall(request, `/scrum/get-board/${boardId}`, "GET");
}

export async function moveTicket(request: Request, ticketId: string, newColumnId: string) {
    return apiCall(request, "/scrum/move-ticket", "PATCH", { ticket_id: ticketId, new_column_id: newColumnId });
}

export async function addComment(request: Request, ticketId: string, content: string) {
    const { userEmail } = await getSessionData(request);
    return apiCall(request, "/scrum/add-comment", "POST", { ticket_id: ticketId, content, user_email: userEmail });
}

export async function archiveBoard(request: Request, boardId: string) {
    const { userEmail } = await getSessionData(request);
    return apiCall(request, `/scrum/archive-board/${boardId}`, "PATCH", { user_email: userEmail });
}