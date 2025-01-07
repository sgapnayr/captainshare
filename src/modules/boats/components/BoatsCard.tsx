
"use client";

import React, { useEffect, useState } from "react";
import { boats } from "@prisma/client";
import axios from "axios";

export function BoatsCard() {
  const [data, setData] = useState<boats[]>([]);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/boats");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Create a new resource
  const createData = async () => {
    if (!newName.trim()) return alert("Name is required");
    try {
      const response = await axios.post("/api/boats", { name: newName });
      setData([...data, response.data]);
      setNewName("");
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  // Update a resource
  const updateData = async () => {
    if (!editId || !editName?.trim()) return alert("Name is required");
    try {
      const response = await axios.put(`/api/boats?id=${editId}`, {
        name: editName,
      });
      setData(
        data.map((item) =>
          item.id === editId ? { ...item, name: response.data.name } : item
        )
      );
      setEditId(null);
      setEditName("");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  // Delete a resource
  const deleteData = async (id: string) => {
    try {
      await axios.delete(`/api/boats?id=${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Boats</h1>

      {/* Create Section */}
      <div>
        <h2>Create Boats</h2>
        <input
          type="text"
          value={newName ?? ""}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter name"
        />
        <button onClick={createData}>Create</button>
      </div>

      {/* List Section */}
      <div>
        <h2>Boats List</h2>
        {data.map((item) => (
          <div key={item.id} style={{ marginBottom: "10px" }}>
            {editId === item.id ? (
              // Edit Mode
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter new name"
                />
                <button onClick={updateData}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              // Display Mode
              <div>
                <span>{item.name}</span>
                <button onClick={() => {
                  setEditId(item.id);
                  setEditName(item.name);
                }}>Edit</button>
                <button onClick={() => deleteData(item.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
