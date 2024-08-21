import { useLoaderData } from "@remix-run/react";
import { json, redirect, LoaderFunction } from "@remix-run/node";
import Board  from "~/components/Board";
import { sessionStorage } from "~/utils/session.server";
import { getBoard, createBoard, createTicket } from "~/utils/api";

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
      const boardData = await createBoard(request, "Default Board");
      boardId = boardData.board_id;
      session.set("boardId", boardId);
      await sessionStorage.commitSession(session);
    } catch (error) {
      console.error("Failed to create board:", error);
      return json({ error: "Failed to create board" }, { status: 500 });
    }
  }

  try {
    const boardData = await getBoard(request, boardId);
    return json({ boardData });
  } catch (error) {
    console.error("Failed to fetch board:", error);
    return json({ error: "Failed to fetch board" }, { status: 500 });
  }
};


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "createTicket") {
    const boardId = formData.get("boardId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    await createTicket(request, boardId, title, description);
    return json({ success: true });
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function Index() {
  const { boardData, error } = useLoaderData<typeof loader>();

  if (error) return <div>Error: {error}</div>;
  if (!boardData) return <div>Loading...</div>;

  return (
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
        <h1>Fridge - Minimal Scrum Board</h1>
        <Board data={boardData} />
      </div>
  );
}