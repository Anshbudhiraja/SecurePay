import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useTicketStore from "@/stores/admin/ticketStore";
import toast from "react-hot-toast";


const TrainComp = () => {
  const navigate = useNavigate();
  const { tickets, searchTickets, bookTicket, isLoading, clearTickets } = useTicketStore();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [name, setName] = useState("");
  
  const [modalTrain, setModalTrain] = useState(null);
  const [bookingStep, setBookingStep] = useState(false);
  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "" }]);
  const [numSeats, setNumSeats] = useState(1);

  const handleSearch = () => {
    searchTickets({ source, destination, name, ticketType: "Train" });
  };
  useEffect(()=>{
    searchTickets({ source, destination, name, ticketType: "Train" });
  },[searchTickets])

  const handleReset = () => {
    setSource("");
    setDestination("");
    setName("");
    clearTickets();
  };


  const handleConfirmBooking = async () => {
    const payload = {
      ticketId: modalTrain._id,
      passengers: passengers.slice(0, numSeats)
    };

    toast.promise(bookTicket(payload), {
      loading: 'Processing your booking...',
      success: (res) => {
        if (res.success) {
          setModalTrain(null);
          setBookingStep(false);
          setPassengers([{ name: "", age: "", gender: "" }]);
          setNumSeats(1);
          handleSearch(); // Refresh list to show updated seats
          return "Ticket Booked Successfully!";
        }
        throw new Error(res.error);
      },
      error: (err) => err.message,
    });
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-white">
          <ArrowLeftIcon onClick={() => navigate("/tickets")} className="w-5 h-5 cursor-pointer" />
          Train Reservations
        </h1>
        <p className="text-zinc-400">Search for available trains across the network</p>
      </div>

      {/* Search Box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
          <input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
          <input placeholder="Train Name/No." value={name} onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
          
          <button onClick={handleSearch} disabled={isLoading} className="bg-green-600 hover:bg-green-500 rounded-lg font-bold text-white transition">
            {isLoading ? "Searching..." : "Search"}
          </button>
          
          <button onClick={handleReset} className="bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center gap-2 text-zinc-300">
            <ArrowPathIcon className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">No trains found. Try changing your search filters.</p>
        ) : (
          tickets.map((train) => (
            <div key={train._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:border-zinc-700 transition">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">{train.name}</h2>
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">{train.source} → {train.destination}</p>
                <p className="text-sm text-zinc-300 font-mono">{train.timing}</p>
              </div>
              <div className="flex-1 text-left sm:text-center">
                <p className="text-sm text-zinc-400">Seats Available</p>
                <p className="text-xl font-bold text-white">{train.seatsAvailable}</p>
              </div>
              <div className="flex-1 sm:text-right">
                <p className="text-xl font-bold text-green-400">₹{train.price + (train.tax || 0) - (train.discount || 0)}</p>
                <button onClick={() => setModalTrain(train)} className="mt-2 bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg text-sm font-bold text-white">Book</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal (Simplified logic similar to Flight) */}
      {modalTrain && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full relative">
            <button onClick={() => { setModalTrain(null); setBookingStep(false); }} className="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>

            {!bookingStep ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-white">{modalTrain.name}</h2>
                <div className="space-y-2 text-sm text-zinc-400 mb-6">
                  <p>Route: {modalTrain.source} to {modalTrain.destination}</p>
                  <p>Timing: {modalTrain.timing}</p>
                  <p className="text-green-500 font-bold">Price per seat: ₹{modalTrain.price + (modalTrain.tax || 0) - (modalTrain.discount || 0)}</p>
                </div>
                <div className="mb-6">
                  <label className="text-xs text-zinc-500 uppercase block mb-1">Seats to Book</label>
                  <input type="number" min={1} max={modalTrain.seatsAvailable} value={numSeats} onChange={(e) => setNumSeats(Number(e.target.value))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <button onClick={() => {
                  setPassengers(Array.from({ length: numSeats }, () => ({ name: "", age: "", gender: "" })));
                  setBookingStep(true);
                }} className="w-full bg-green-600 py-3 rounded-xl font-bold text-white">Continue to Passengers</button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4 text-white">Passenger Information</h2>
                <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                  {passengers.map((p, idx) => (
                    <div key={idx} className="p-3 border border-zinc-800 rounded-lg bg-zinc-800/20">
                      <p className="text-[10px] text-zinc-500 mb-2 uppercase">Passenger {idx + 1}</p>
                      <input placeholder="Name" value={p.name} onChange={(e) => updatePassenger(idx, "name", e.target.value)} className="w-full bg-zinc-800 mb-2 rounded-lg px-3 py-2 text-sm text-white" />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input type="number" placeholder="Age" value={p.age} onChange={(e) => updatePassenger(idx, "age", e.target.value)} className="w-full sm:w-1/3 bg-zinc-800 rounded-lg px-3 py-2 text-sm text-white" />
                        <select value={p.gender} onChange={(e) => updatePassenger(idx, "gender", e.target.value)} className="w-full sm:w-2/3 bg-zinc-800 rounded-lg px-3 py-2 text-sm text-white">
                          <option value="">Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setBookingStep(false)} className="flex-1 py-2 bg-zinc-800 text-zinc-400 rounded-lg">Back</button>
                  <button onClick={handleConfirmBooking} className="flex-1 py-2 bg-green-600 text-white font-bold rounded-lg">Pay & Confirm</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainComp;