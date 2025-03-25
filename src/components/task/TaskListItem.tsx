import React, { useState } from "react";
import { useRouter } from "next/router";

const TaskListItem = ({
  list,
  userRole,
  isShared,
  onDelete,
  onUpdate,
  onClickList = () => {}, // Default to an empty function if not provided
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.name);
  const router = useRouter();

  const handleSave = () => {
    if (!listName.trim()) {
      alert("List name cannot be empty!");
      return;
    }
    onUpdate(listName);
    setIsEditing(false);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    if (typeof onClickList === "function") {
      onClickList(); // Call onClickList only if it's a function
    } else {
      console.warn("onClickList is not a function, navigating directly...");
      router.push(`/taskList/${list.id}`); // Fallback navigation
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg flex items-center justify-between mb-4 w-full">
      <div className="flex items-center space-x-3">
        {isEditing && userRole === "Admin" ? (
          <input
            className="border p-2 rounded mr-4 flex-grow"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Edit list name"
          />
        ) : (
          <span
            className="font-semibold text-xl text-gray-800 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onClickList === "function") {
                onClickList();
              } else {
                router.push(`/taskList/${list.id}`);
              }
            }}
          >
            {list.name}
          </span>
        )}
        {isShared && (
          <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
            Shared
          </span>
        )}
      </div>

      <div className="flex space-x-4">
        {userRole === "Admin" && (
          <>
            {isEditing ? (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
              >
                Save
              </button>
            ) : (
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                Edit
              </button>
            )}
            <button
              className="bg-red-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="mr-2"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5z"
                />
              </svg>
              Delete
            </button>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md"
              onClick={handleViewClick} // Use the new handler
            >
              View
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskListItem;
