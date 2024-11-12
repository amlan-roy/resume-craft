import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskProps = {
  id: Number;
  title: String;
};

const Task: React.FC<TaskProps> = ({ id, title }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({
    id: id.toString(),
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    touchAction: "none",
  };
  return (
    <div
      ref={setNodeRef}
      className="w-full p-2 border-2 border-solid border-black rounded-sm flex flex-row gap-2"
      style={style}
    >
      <div
        {...attributes}
        {...listeners}
        ref={setActivatorNodeRef}
        className="w-fit bg-slate-100"
      >
        ...
      </div>
      {title}
    </div>
  );
};
export default Task;
