import { useState, useEffect } from "react";

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error("Error parsing tasks from local storage:", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      if (value !== defaultValue) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Error saving tasks to local storage:", error);
    }
  }, [value, key, defaultValue]);

  return [value, setValue];
};

function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [priority, setPriority] = useState("low");
  const [sortByPriority, setSortByPriority] = useState(false);
  const [theme, setTheme] = useState("light");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, completed: false, priority }]);
      setNewTask("");
      setPriority("low");
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const saveEdit = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editingText } : task
    );
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditingText("");
  };

  const sortTasksByPriority = () => {
    setSortByPriority(!sortByPriority);
    const sortedTasks = tasks.sort((a, b) => {
      if (sortByPriority) {
        // Ascending order (low to high)
        if (a.priority === "high" && b.priority !== "high") return -1;
        if (a.priority !== "high" && b.priority === "high") return 1;
        if (a.priority === "medium" && b.priority === "low") return -1;
        if (a.priority === "low" && b.priority === "medium") return 1;
        return 0;
      } else {
        // Descending order (high to low)
        if (a.priority === "high" && b.priority !== "high") return 1;
        if (a.priority !== "high" && b.priority === "high") return -1;
        if (a.priority === "medium" && b.priority === "low") return 1;
        if (a.priority === "low" && b.priority === "medium") return -1;
        return 0;
      }
    });
    setTasks(sortedTasks);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
      } flex items-center justify-center p-4`}
    >
      <div
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-lg rounded-lg p-6 w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl`}
      >
        <h1
          className={`text-3xl font-bold mb-6 text-center ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          To-Do List
        </h1>
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            className={`flex-grow p-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === "dark" ? "bg-gray-700 text-white" : "bg-white"
            }`}
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <select
            className={`p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === "dark" ? "bg-gray-700 text-white" : "bg-white"
            }`}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={addTask}
            >
              Add
            </button>
            <button
              className="bg-yellow-500 text-white p-3 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onClick={sortTasksByPriority}
            >
              Sort
            </button>
            <button
              className="bg-green-500 text-white p-3 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={toggleTheme}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex flex-col md:flex-row items-center justify-between p-3 rounded-lg shadow ${
                task.completed
                  ? theme === "dark"
                    ? "bg-gray-700"
                    : "bg-green-100"
                  : task.priority === "high"
                  ? theme === "dark"
                    ? "bg-red-900"
                    : "bg-red-200"
                  : task.priority === "medium"
                  ? theme === "dark"
                    ? "bg-orange-900"
                    : "bg-orange-200"
                  : theme === "dark"
                  ? "bg-blue-900"
                  : "bg-blue-200"
              }`}
            >
              {editingIndex === index ? (
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    className={`flex-grow p-2 border border-gray-300 rounded ${
                      theme === "dark" ? "bg-gray-700 text-white" : "bg-white"
                    }`}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => saveEdit(index)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row w-full items-center justify-between gap-2">
                  <span
                    className={`flex items-center gap-2 ${
                      task.completed ? "line-through" : ""
                    } ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                    onClick={() => toggleTaskCompletion(index)}
                  >
                    {task.text}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        task.priority === "high"
                          ? "bg-red-500 text-white"
                          : task.priority === "medium"
                          ? "bg-orange-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      onClick={() => startEditing(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={() => deleteTask(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
