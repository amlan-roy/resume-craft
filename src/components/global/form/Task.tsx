import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskProps = {
  id: Number;
  title: String;
};

const Task: React.FC<TaskProps> = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id.toString(),
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      className="w-full p-2 border-2 border-solid border-black rounded-sm"
      {...attributes}
      {...listeners}
      style={style}
    >
      {title}
    </div>
  );
};
export default Task;
