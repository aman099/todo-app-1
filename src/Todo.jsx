import React, { useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import gsap from "gsap";
// import "react-tippy/dist/tippy.css";
// import { Tooltip, withTooltip } from "react-tippy";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const style = {
  li: `flex justify-between bg-slate-300 p-4 my-2 capitalize`,
  liComplete: `flex justify-between bg-gradient-to-r from-[#ccc] to-[#fff] p-4 my-2 capitalize`,
  row: `flex`,
  text: `cursor-pointer ml-2 cursor-pointer`,
  textComplete: `cursor-pointer text-gray-400 ml-2 cursor-pointer line-through`,
  button: `cursor-pointer flex items-center`,
};

const Todo = ({ todo, toggleComplete, deleteTodo }) => {
  useEffect(() => {
    let textAnimation = gsap.timeline();

    textAnimation.fromTo(
      ".fadein",
      {
        opacity: 0,
      },
      {
        opacity: 1,
      }
    );
  }, [todo]);

  return (
    <li className={`${todo.completed ? style.liComplete : style.li} fadein`}>
      <div className={style.row}>
        <Tippy content="Task Completed?">
          <input
            onChange={() => toggleComplete(todo)}
            type="checkbox"
            checked={todo.completed ? "checked" : ""}
          />
        </Tippy>
        <p
          onClick={() => toggleComplete(todo)}
          className={todo.completed ? style.textComplete : style.text}
        >
          <strong>{todo.text}</strong>
        </p>
      </div>
      <Tippy content="Delete Task?">
        <button className="deleteBtn" onClick={(e) => deleteTodo(todo.id)}>
          {<FaRegTrashAlt />}
        </button>
      </Tippy>
    </li>
  );
};

// const DeleteBtnTooltip = withTooltip(Todo, {
//   title: "Delete Task!",
// });

export default Todo;
