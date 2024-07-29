import { useState } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from "~/components/Board";

interface Task {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  comments: string[];
}

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newComment, setNewComment] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const addTask = () => {
    if (newTaskTitle.trim() !== "") {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: "todo",
        comments: []
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    }
  };

  const addComment = (taskId: string) => {
    if (newComment.trim() !== "") {
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, newComment] }
          : task
      ));
      setNewComment("");
    }
  };

  const moveTask = (taskId: string, newStatus: "todo" | "doing" | "done") => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
        <h1>Fridge - Minimal Scrum Board</h1>
        <div>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter new task title"
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <Board tasks={tasks} moveTask={moveTask} onTaskClick={setSelectedTask} />
        {selectedTask && (
          <div style={{ marginTop: "20px" }}>
            <h2>{selectedTask.title}</h2>
            <h3>Comments:</h3>
            <ul>
              {selectedTask.comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button onClick={() => addComment(selectedTask.id)}>Add Comment</button>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
