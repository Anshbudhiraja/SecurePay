import React, { useState, useEffect } from "react";
import useTicketStore from "@/stores/superadmin/ticketStore";
import toast from "react-hot-toast";

const AllTicketsComp = () => {
  const { tickets, fetchTickets, addTicket, updateTicket, deleteTicket, isLoading } = useTicketStore();

  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const [form, setForm] = useState({
    ticketType: "Train", 
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

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const openAddModal = () => {
    setEditingTicket(null);
    setForm({
      ticketType: "Train",
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
    const formattedDate = ticket.date ? new Date(ticket.date).toISOString().split('T')[0] : "";
    setForm({ ...ticket, date: formattedDate });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.source || !form.destination || !form.price) {
      toast.error("Please fill required fields");
      return;
    }

    const action = editingTicket ? updateTicket(editingTicket._id, form) : addTicket(form);

    toast.promise(action, {
      loading: editingTicket ? 'Updating...' : 'Adding...',
      success: (res) => {
        if (res.success) {
          setShowModal(false);
          return editingTicket ? 'Ticket Updated' : 'Ticket Added';
        }
        throw new Error(res.error);
      },
      error: (err) => err.message,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this ticket permanently?")) {
      toast.promise(deleteTicket(id), {
        loading: 'Deleting...',
        success: 'Ticket deleted',
        error: 'Error deleting ticket',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Ticket Management</h1>
          <p className="text-gray-400">Inventory control for all transport modes</p>
        </div>
        <button onClick={openAddModal} className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg font-medium">
          + Add Ticket
        </button>
      </div>

      {/* Tickets List */}
      {isLoading && tickets.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Fetching ticket inventory...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white">{ticket.name}</h3>
                <span className={`text-xs px-3 py-1 rounded-full ${ticket.ticketType === "Train" ? "bg-blue-900/40 text-blue-400" : "bg-purple-900/40 text-purple-400"}`}>
                  {ticket.ticketType.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1 text-sm text-zinc-400">
                <p><strong className="text-zinc-300">Route:</strong> {ticket.source} → {ticket.destination}</p>
                <p><strong className="text-zinc-300">Schedule:</strong> {new Date(ticket.date).toLocaleDateString("en-GB",{day:"2-digit",month:"long","year":"numeric"})} | {ticket.timing}</p>
                <p><strong className="text-zinc-300">Availability:</strong> {ticket.seatsAvailable} seats left</p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-green-400 font-bold">₹{ticket.price} <span className="text-zinc-500 text-xs font-normal">+ {ticket.tax || 0}% Tax</span></p>
                   {ticket.discount > 0 && <span className="text-xs bg-green-900/30 text-green-500 px-2 py-0.5 rounded">₹{ticket.discount} OFF</span>}
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEditModal(ticket)} className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs">Edit</button>
                  <button onClick={() => handleDelete(ticket._id)} className="flex-1 py-1.5 bg-red-900/20 text-red-500 hover:bg-red-900/40 rounded-lg text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-white">{editingTicket ? "Modify Ticket" : "Add New Ticket"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 uppercase">Transport Type</label>
                <select value={form.ticketType} onChange={(e) => setForm({ ...form, ticketType: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                  <option value="Train">Train</option>
                  <option value="Flight">Flight</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-500 uppercase">Vehicle/Flight Name</label>
                <input placeholder="e.g. Rajdhani Exp" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
              </div>

              <input placeholder="Source City" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
              
              <input placeholder="Destination City" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />

              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />

              <input placeholder="Timing (e.g. 10:00 PM)" value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />

              <input type="number" placeholder="Base Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />

              <input type="number" placeholder="Seats Available" value={form.seatsAvailable} onChange={(e) => setForm({ ...form, seatsAvailable: Number(e.target.value) })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
              
              <input type="number" placeholder="Tax (Optional)" value={form.tax} onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />

              <input type="number" placeholder="Discount (Optional)" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold">
                {editingTicket ? "Update Ticket" : "Create Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTicketsComp;