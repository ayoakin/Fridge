import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import Board, { BoardData } from "~/components/Board";
import { sessionStorage } from "~/utils/session.server";
import { getBoard, createBoard } from "~/utils/api";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userEmail = session.get("userEmail");
  const teamToken = session.get("teamToken");
  let boardId = session.get("boardId");

  if (!userEmail || !teamToken) {
    return redirect("/login");
  }

  if (!boardId) {
    try {
      const boardData = await createBoard("Default Board", teamToken);
      boardId = boardData.board_id;
      session.set("boardId", boardId);
      await sessionStorage.commitSession(session);
    } catch (error) {
      console.error("Failed to create board:", error);
      return json({ error: "Failed to create board" }, { status: 500 });
    }
  }

  try {
    const boardData = await getBoard(boardId, teamToken);
    return json({ boardData, teamToken });
  } catch (error) {
    console.error("Failed to fetch board:", error);
    return json({ error: "Failed to fetch board" }, { status: 500 });
  }
};

export default function Index() {
  const { boardData, teamToken, error } = useLoaderData<typeof loader>();
  const [board, setBoard] = useState<BoardData | null>(boardData || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (boardData) {
      setBoard(boardData);
    }
  }, [boardData]);

  const handleLogout = async () => {
    const response = await fetch("/logout", { method: "POST" });
    if (response.ok) {
      navigate("/login");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
        <h1>Fridge - Minimal Scrum Board</h1>
        <button onClick={handleLogout}>Logout</button>
        <Board data={board} />
      </div>
  );
}