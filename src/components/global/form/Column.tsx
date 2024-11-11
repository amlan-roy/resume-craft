import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Task from "./Task";

type ColumnProps = {
  tasks: { id: Number; title: String }[];
};

const Column: React.FC<ColumnProps> = ({ tasks }) => {
  return (
    <div className="bg-gray-200 rounded-sm w-4/5 max-w-lg flex flex-col gap-4 p-6">
      <SortableContext
        items={tasks.map((task) => ({ ...task, id: task.id.toString() }))}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <Task id={task.id} title={task.title} key={task.id.toString()}></Task>
        ))}
      </SortableContext>
    </div>
  );
};
export default Column;
