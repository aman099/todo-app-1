import { useEffect, useState } from "react";
import "./index.css";
import { AiOutlinePlus } from "react-icons/ai";
import Todo from "./Todo";
import { useRef } from "react";
import gsap from "gsap";
import Popup from "reactjs-popup";
import PopupExample from "./Popup";

// React Tippy Library
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[600px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-purple-500 text-slate-100`,
  count: `text-center p-2`,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [id, setId] = useState("");
  // const [text, setText] = useState("");

  // Create todo

  const postData = async () => {
    function addIdText() {
      return {
        text: input,
        completed: false,
      };
    }

    const dataToSubmit = addIdText();

    console.log(dataToSubmit);

    try {
      await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      })
        .then((res) => res.json())
        .then((data) => setTodos([...todos, data]));
    } catch (error) {
      console.log(error);
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();

    if (input === "" || input.length < 5) {
      alert("Please Enter a valid Todo!");
      return;
    }

    postData();

    setInput("");
  };

  // READ Todo (GET-METHOD)

  const getData = async () => {
    try {
      await fetch("http://localhost:3000/tasks")
        .then((res) => res.json())
        .then((data) => setTodos(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Update todo

  const toggleComplete = async (todo) => {
    const { text, id, completed } = todo;

    // console.log(text);
    // console.log(!completed);
    // console.log(id);

    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ text, completed: !completed }),
      })
        .then((res) => res.json())
        .then((data) => setTodos([...todos].fill(data, id - 1, id)));
    } catch (error) {
      console.log(error);
    }

    // console.log(todo);
    // console.log([...todos]);
  };

  // Delete Todo

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong!");
        }
      });
    } catch (error) {
      console.log(error);
    }
    // setTodos([todos[id - 1]]);
    setTodos([todos.filter((todo) => todo.id !== id)][0]);
  };

  // GSAP Animations
  useEffect(() => {
    gsap.set(".cta5", { display: "inline-block" });
    gsap.set(".cta6", { display: "inline-block" });

    let textAnimation = gsap.timeline();

    textAnimation.fromTo(
      ".popin",
      { scale: 1.3, borderRadius: "0rem", opacity: 0 },
      {
        scale: 1,
        borderRadius: "2rem",
        delay: 0.35,
        duration: 2.5,
        opacity: 1,
        ease: "elastic.out(1.5,1)",
      }
    );

    textAnimation.fromTo(
      ".cta5",
      {
        y: "-100%",
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
      },
      "<40%"
    );
    textAnimation.fromTo(
      ".cta6",
      {
        y: "100%",
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
      },
      "<40%"
    );
  }, []);

  return (
    <div className={style.bg}>
      <div className={`${style.container} popin`}>
        <h3 className={style.heading}>
          <span className="cta5">Todo</span> <span className="cta6">App</span>
        </h3>
        <form method="post" onSubmit={createTodo} className={style.form}>
          <Tippy content="Enter a Task">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Add Todo.."
              className={style.input}
            />
          </Tippy>
          <Tippy content="Add the task to the list">
            <button className={style.button}>
              <AiOutlinePlus size={30} />
            </button>
          </Tippy>
        </form>

        <ul>
          {todos.map((todo, idx) => (
            <Todo
              key={idx}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
        {todos.length < 1 ? null : (
          <p className={style.count}>{` You have ${
            todos.length === 1
              ? `${todos.length} todo`
              : `${todos.length} todos`
          }`}</p>
        )}
      </div>
    </div>
  );
}

export default App;
