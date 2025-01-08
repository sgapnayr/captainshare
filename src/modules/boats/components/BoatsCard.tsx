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
    type: "Pontoon",
    capacity: 0,
    location: "Lake Austin",
    licenseRequired: ["Foundation"],
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
  const [editBoat, setEditBoat] = useState<Omit<
    Boat,
    "createdAt" | "updatedAt"
  > | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/boats");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching boats:", error);
    }
  };

  const createBoat = async () => {
    try {
      const response = await axios.post("/api/boats", newBoat);
      setData([...data, response.data]);
      resetNewBoatForm();
    } catch (error) {
      console.error("Error creating boat:", error);
    }
  };

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
      type: "Pontoon",
      capacity: 0,
      location: "Lake Austin",
      licenseRequired: ["Foundation"],
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
    fetchData();
  }, []);

  const boatTypes = ["Pontoon", "Wakeboat", "Fishing Boat", "Yacht", "Other"];
  const locations = ["Lake Austin", "Lake Travis"];
  const licenseOptions = ["Foundation", "PBO", "USCG"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Boats</h1>

      {/* Create Section */}
      <div className="p-4 bg-white shadow-lg rounded-lg mb-6 text-black">
        <h2 className="text-2xl font-semibold mb-4">Create a New Boat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              value={newBoat.name}
              onChange={(e) => setNewBoat({ ...newBoat, name: e.target.value })}
              placeholder="Name"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Type</label>
            <select
              value={newBoat.type}
              onChange={(e) => setNewBoat({ ...newBoat, type: e.target.value })}
              className="p-2 border rounded w-full"
            >
              {boatTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold">Capacity</label>
            <input
              type="number"
              value={newBoat.capacity}
              onChange={(e) =>
                setNewBoat({
                  ...newBoat,
                  capacity: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Capacity"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Location</label>
            <select
              value={newBoat.location}
              onChange={(e) =>
                setNewBoat({ ...newBoat, location: e.target.value })
              }
              className="p-2 border rounded w-full"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold">
              Minimum License Required
            </label>
            <select
              value={newBoat.licenseRequired[0]}
              onChange={(e) =>
                setNewBoat({ ...newBoat, licenseRequired: [e.target.value] })
              }
              className="p-2 border rounded w-full"
            >
              {licenseOptions.map((license) => (
                <option key={license} value={license}>
                  {license}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold">Rate Willing to Pay</label>
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
              className="p-2 border rounded w-full"
            />
          </div>
        </div>
        <button
          onClick={createBoat}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          Create
        </button>
      </div>

      {/* List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
        {data.map((item) => (
          <div key={item.id} className="p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p>Type: {item.type}</p>
            <p>Capacity: {item.capacity}</p>
            <p>Location: {item.location}</p>
            <p>Minimum License: {item.licenseRequired[0]}</p>
            <p>Rate: ${item.rateWillingToPay}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditBoat(item)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBoat(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
