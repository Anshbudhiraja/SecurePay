import React, { useState } from "react";

const AllTicketsComp = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      type: "train",
      name: "Rajdhani Express",
      source: "Delhi",
      destination: "Mumbai",
      price: 2450,
      tax: 200,
      discount: 150,
      seatsAvailable: 20,
      date: "2024-11-20",
      timing: "06:00 AM",
    },
    {
      id: 2,
      type: "flight",
      name: "IndiGo 6E-101",
      source: "Delhi",
      destination: "Bangalore",
      price: 5200,
      tax: 350,
      discount: 250,
      seatsAvailable: 35,
      date: "2024-11-22",
      timing: "09:30 AM",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const [form, setForm] = useState({
    type: "train",
    name: "",
    source: "",
    destination: "",
    price: "",
    tax: "",
    discount: "",
    seatsAvailable: "",
    date: "",
    timing: "",
  });

  /* ------------------ Handlers ------------------ */
  const openAddModal = () => {
    setEditingTicket(null);
    setForm({
      type: "train",
      name: "",
      source: "",
      destination: "",
      price: "",
      tax: "",
      discount: "",
      seatsAvailable: "",
      date: "",
      timing: "",
    });
    setShowModal(true);
  };

  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setForm(ticket);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.source || !form.destination) return;

    if (editingTicket) {
      setTickets((prev) =>
        prev.map((t) => (t.id === editingTicket.id ? { ...form } : t))
      );
    } else {
      setTickets((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this ticket?")) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Tickets</h1>
          <p className="text-gray-400">
            Manage train & flight tickets
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg font-medium"
        >
          + Add Ticket
        </button>
      </div>

      {/* Tickets */}
      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">
                  {ticket.name}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    ticket.type === "train"
                      ? "bg-blue-900 text-blue-400"
                      : "bg-purple-900 text-purple-400"
                  }`}
                >
                  {ticket.type.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-400">
                {ticket.source} → {ticket.destination}
              </p>

              <p className="text-sm text-gray-400">
                Date: {ticket.date} | Time: {ticket.timing}
              </p>

              <p className="text-sm text-gray-400">
                Seats: {ticket.seatsAvailable}
              </p>

              <p className="text-sm text-gray-300 mt-1">
                Price: ₹{ticket.price} + Tax ₹{ticket.tax} − Discount ₹{ticket.discount}
              </p>

              <p className="text-green-400 font-bold mt-2">
                Final: ₹{ticket.price + ticket.tax - ticket.discount}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openEditModal(ticket)}
                  className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ticket.id)}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">
          No tickets available
        </p>
      )}

      {/* ================= Modal ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingTicket ? "Edit Ticket" : "Add Ticket"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="train">Train</option>
                <option value="flight">Flight</option>
              </select>

              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              <input
                placeholder="Source"
                value={form.source}
                onChange={(e) =>
                  setForm({ ...form, source: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              <input
                placeholder="Destination"
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              <input
                placeholder="Timing"
                value={form.timing}
                onChange={(e) =>
                  setForm({ ...form, timing: e.target.value })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="number"
                placeholder="Tax"
                value={form.tax}
                onChange={(e) =>
                  setForm({ ...form, tax: Number(e.target.value) })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="number"
                placeholder="Discount"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: Number(e.target.value) })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="number"
                placeholder="Seats Available"
                value={form.seatsAvailable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    seatsAvailable: Number(e.target.value),
                  })
                }
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
              >
                {editingTicket ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTicketsComp;
