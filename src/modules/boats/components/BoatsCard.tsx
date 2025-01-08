"use client";

import React, { useEffect, useState } from "react";
import { Boat } from "@prisma/client";
import axios from "axios";

export function BoatsCard() {
  const [data, setData] = useState<Boat[]>([]);
  const [newBoat, setNewBoat] = useState<
    Omit<Boat, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    type: "",
    capacity: 0,
    location: "",
    licenseRequired: [],
    captainShareCertificationsRequired: [],
    ownerIds: [],
    rateWillingToPay: 0,
    preferredCaptains: [],
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    hin: "",
    motorDetails: "",
    commercialUse: false,
  });
  const [editBoat, setEditBoat] = useState<Boat | null>(null);

  // Fetch all boats
  const fetchData = async () => {
    try {
      console.log("Fetching boats...");
      const response = await axios.get("/api/boats");
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching boats:", error);
    }
  };

  // Create a new boat
  const createBoat = async () => {
    try {
      console.log(newBoat, "NEW BOAT");
      const response = await axios.post("/api/boats", newBoat as Boat);
      setData([...data, response.data]);
      resetNewBoatForm();
    } catch (error) {
      console.error("Error creating boat:", error);
    }
  };

  // Update a boat
  const updateBoat = async () => {
    if (!editBoat) return;
    try {
      const response = await axios.put(
        `/api/boats?id=${editBoat.id}`,
        editBoat
      );
      setData(
        data.map((item) => (item.id === editBoat.id ? response.data : item))
      );
      setEditBoat(null);
    } catch (error) {
      console.error("Error updating boat:", error);
    }
  };

  // Delete a boat
  const deleteBoat = async (id: string) => {
    try {
      await axios.delete(`/api/boats?id=${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting boat:", error);
    }
  };

  const resetNewBoatForm = () => {
    setNewBoat({
      name: "",
      type: "",
      capacity: 0,
      location: "",
      licenseRequired: [],
      captainShareCertificationsRequired: [],
      ownerIds: [],
      rateWillingToPay: 0,
      preferredCaptains: [],
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      hin: "",
      motorDetails: "",
      commercialUse: false,
    });
  };

  useEffect(() => {
    console.log("HER");
    fetchData();
    console.log("HER");
  }, []);

  return (
    <div>
      <h1>Boats</h1>

      {/* Create Section */}
      <div>
        <h2>Create a New Boat</h2>
        <input
          type="text"
          value={newBoat.name}
          onChange={(e) => setNewBoat({ ...newBoat, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="text"
          value={newBoat.type}
          onChange={(e) => setNewBoat({ ...newBoat, type: e.target.value })}
          placeholder="Type"
        />
        <input
          type="number"
          value={newBoat.capacity}
          onChange={(e) =>
            setNewBoat({ ...newBoat, capacity: parseInt(e.target.value) || 0 })
          }
          placeholder="Capacity"
        />
        <input
          type="text"
          value={newBoat.location}
          onChange={(e) => setNewBoat({ ...newBoat, location: e.target.value })}
          placeholder="Location"
        />
        <input
          type="number"
          value={newBoat.rateWillingToPay}
          onChange={(e) =>
            setNewBoat({
              ...newBoat,
              rateWillingToPay: parseFloat(e.target.value) || 0,
            })
          }
          placeholder="Rate Willing to Pay"
        />
        <input
          type="text"
          value={newBoat.make}
          onChange={(e) => setNewBoat({ ...newBoat, make: e.target.value })}
          placeholder="Make"
        />
        <input
          type="text"
          value={newBoat.model}
          onChange={(e) => setNewBoat({ ...newBoat, model: e.target.value })}
          placeholder="Model"
        />
        <input
          type="number"
          value={newBoat.year}
          onChange={(e) =>
            setNewBoat({
              ...newBoat,
              year: parseInt(e.target.value) || new Date().getFullYear(),
            })
          }
          placeholder="Year"
        />
        <input
          type="text"
          value={newBoat.color}
          onChange={(e) => setNewBoat({ ...newBoat, color: e.target.value })}
          placeholder="Color"
        />
        <button onClick={createBoat}>Create</button>
      </div>

      {/* List Section */}
      <div>
        <h2>Boats List</h2>
        {data.map((item) => (
          <div key={item.id} style={{ marginBottom: "10px" }}>
            {editBoat && editBoat.id === item.id ? (
              <div>
                <input
                  type="text"
                  value={editBoat.name}
                  onChange={(e) =>
                    setEditBoat({ ...editBoat, name: e.target.value })
                  }
                  placeholder="Name"
                />
                <button onClick={updateBoat}>Save</button>
                <button onClick={() => setEditBoat(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>
                  {item.name} - {item.type} ({item.capacity} people)
                </span>
                <button onClick={() => setEditBoat(item)}>Edit</button>
                <button onClick={() => deleteBoat(item.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
