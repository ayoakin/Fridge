import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Board, { BoardData } from "~/components/Board";
import { getBoard, createBoard, logout } from "~/utils/api";

export default function Index() {
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        let boardId = localStorage.getItem('boardId');
        if (!boardId) {
          const newBoard = await createBoard("Default Board");
          boardId = newBoard.board_id;
          if (boardId) {
            localStorage.setItem('boardId', boardId);
          } else {
            throw new Error("Failed to create new board");
          }
        }
        if (boardId) {
          const data = await getBoard(boardId);
          setBoardData(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch board");
      }
    };

    const token = localStorage.getItem('teamToken');
    if (!token) navigate("/login");
    else fetchBoard();
  }, [navigate]);

  const handleBoardUpdate = (newData: BoardData) => setBoardData(newData);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (error) return <div>Error: {error}</div>;
  if (!boardData) return <div>Loading...</div>;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Fridge - Minimal Scrum Board</h1>
        <button onClick={handleLogout} style={{ padding: '10px', cursor: 'pointer' }}>Logout</button>
      </div>
      <Board data={boardData} onUpdate={handleBoardUpdate} />
    </div>
  );
}
