import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./config/supabase-config";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTask = async (id, isCompleted) => {
    try {
      const { error } = await supabase
        .from("todolist")
        .update({
          isCompleted: !isCompleted,
        })
        .eq("id", id);
      if (error) console.log("Error while updating", error);
      else {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, isCompleted: !isCompleted } : task
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.from("todolist").select("*");
      if (error) {
        console.log("Error, while fetching", error);
      } else {
        setTasks(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async () => {
    try {
      const taskToInsert = {
        task: task,
        isCompleted: false,
      };
      const { error } = await supabase
        .from("todolist")
        .insert([taskToInsert])
        .single();
      if (error) console.log("Error occured, while inserting", error);
      else {
        setTasks([...tasks, taskToInsert]);
        setTask("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase.from("todolist").delete().eq("id", id);
      if (error) console.log("Error while deleting", error);
      else {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <h2>TodoList Using React and SupaBase</h2>
      </div>
      <div>
        <div>
          <input
            type="text"
            placeholder="Enter task to do: "
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <div>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <p>{task.task}</p>
                <button onClick={() => updateTask(task.id, task.isCompleted)}>
                  {task.isCompleted ? "Undo" : "Complete"}
                </button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
