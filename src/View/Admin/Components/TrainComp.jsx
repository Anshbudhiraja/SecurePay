import React, { useState } from "react";
import {ArrowLeftIcon} from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom";
const MOCK_TRAINS = [
  {
    id: 1,
    name: "Rajdhani Express",
    number: "12951",
    source: "Delhi",
    destination: "Mumbai",
    departure: "16:30",
    arrival: "08:15",
    price: 2450,
    tax: 200,
    discount: 150,
    seatsAvailable: 50,
    weekdays: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    name: "Shatabdi Express",
    number: "12009",
    source: "Delhi",
    destination: "Chandigarh",
    departure: "07:00",
    arrival: "11:00",
    price: 980,
    tax: 50,
    discount: 50,
    seatsAvailable: 20,
    weekdays: [1, 3, 5, 7],
  },
];

const weekdaysSymbols = ["S", "M", "T", "W", "T", "F", "S"];

const TrainComp = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate()
  const [modalTrain, setModalTrain] = useState(null); // Step 1: Train info
  const [bookingStep, setBookingStep] = useState(false); // Step 2: Passenger details

  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "" }]);
  const [numSeats, setNumSeats] = useState(1);

  const searchTrains = () => {
    const filtered = MOCK_TRAINS.filter(
      (train) =>
        train.source.toLowerCase().includes(source.toLowerCase()) &&
        train.destination.toLowerCase().includes(destination.toLowerCase())
    );
    setResults(filtered);
  };

  const totalAmount = (train) =>
    numSeats * (train.price + train.tax - train.discount);

  const handleConfirmBooking = () => {
    alert(
      `Ticket booked for ${passengers
        .map((p) => p.name)
        .join(", ")} on ${modalTrain.name} (${modalTrain.number}) from ${
        modalTrain.source
      } to ${modalTrain.destination} on ${date}. Total Paid: ₹${totalAmount(
        modalTrain
      )}`
    );
    // Reset all states
    setModalTrain(null);
    setBookingStep(false);
    setPassengers([{ name: "", age: "", gender: "" }]);
    setNumSeats(1);
  };

  const addPassenger = () => {
    if (passengers.length < numSeats) {
      setPassengers([...passengers, { name: "", age: "", gender: "" }]);
    }
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ArrowLeftIcon onClick={()=>navigate("/tickets")} className="w-5 h-5 cursor-pointer" />
          Search Train Tickets</h1>
        <p className="text-gray-400">Find trains between your source and destination</p>
      </div>

      {/* Search Box */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          />
          <input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          />
          <button
            onClick={searchTrains}
            className="bg-green-600 hover:bg-green-500 transition rounded-lg font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
{results.length === 0 ? (
  <p className="text-gray-400 text-sm text-center">No trains found</p>
) : (
  <div className="space-y-4">
    {results.map((train) => (
      <div
        key={train.id}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center"
      >
        {/* Left Block: Train Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{train.name}</h2>
          <p className="text-sm text-gray-400">{train.number}</p>
          <p className="mt-2 text-sm">{train.source} → {train.destination}</p>
          <p className="text-sm text-gray-400">{train.departure} - {train.arrival}</p>
        </div>

        {/* Center Block: Weekdays & Seats */}
        <div className="flex-1 text-center">
          <div className="flex justify-center gap-1 mb-2">
            {weekdaysSymbols.map((d, idx) => (
              <span
                key={idx}
                className={train.weekdays.includes(idx) ? "text-green-400 font-bold" : "text-gray-400"}
              >
                {d}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            Seats Available: <span className="font-semibold">{train.seatsAvailable}</span>
          </p>
        </div>

        {/* Right Block: Price & Book */}
        <div className="flex-1 text-right">
          <p className="text-xl font-bold text-green-400">
            ₹ {train.price + train.tax - train.discount}
          </p>
          <button
            onClick={() => setModalTrain(train)}
            className="mt-3 bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg text-sm font-medium"
          >
            Book
          </button>
        </div>
      </div>
    ))}
  </div>
)}


      {/* Modal */}
      {modalTrain && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full relative">
            <button
              onClick={() => {
                setModalTrain(null);
                setBookingStep(false);
                setPassengers([{ name: "", age: "", gender: "" }]);
                setNumSeats(1);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {!bookingStep ? (
              // Step 1: Train Info + Seats
              <>
                <h2 className="text-xl font-semibold mb-4">{modalTrain.name}</h2>
                <p>
                  <span className="font-semibold">From:</span> {modalTrain.source}{" "}
                  <span className="font-semibold">To:</span> {modalTrain.destination}
                </p>
                <p>
                  <span className="font-semibold">Train No:</span> {modalTrain.number}
                </p>
                <p>
                  <span className="font-semibold">Weekdays:</span>{" "}
                  {weekdaysSymbols.map((d, idx) => (
                    <span
                      key={idx}
                      className={modalTrain.weekdays.includes(idx) ? "text-green-400 font-bold" : "text-gray-400"}
                    >
                      {d}{" "}
                    </span>
                  ))}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> ₹ {modalTrain.price}
                </p>
                <p>
                  <span className="font-semibold">Tax:</span> ₹ {modalTrain.tax}
                </p>
                <p>
                  <span className="font-semibold">Discount:</span> ₹ {modalTrain.discount}
                </p>
                <p>
                  <span className="font-semibold">Seats Available:</span> {modalTrain.seatsAvailable}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold">Number of Seats:</span>
                  <input
                    type="number"
                    min={1}
                    max={modalTrain.seatsAvailable}
                    value={numSeats}
                    onChange={(e) => setNumSeats(Number(e.target.value))}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 w-16 text-center"
                  />
                </div>

                <p className="mt-2 font-bold text-green-400">
                  Total: ₹ {totalAmount(modalTrain)}
                </p>

                <button
                  onClick={() => setBookingStep(true)}
                  className="mt-4 w-full bg-green-600 hover:bg-green-500 py-2 rounded-lg font-medium"
                >
                  Proceed to Booking
                </button>
              </>
            ) : (
              // Step 2: Passenger Details
              <>
                <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
                {passengers.map((p, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      placeholder="Passenger Name"
                      value={p.name}
                      onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={p.age}
                      onChange={(e) => updatePassenger(idx, "age", e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                    />
                    <select
                      value={p.gender}
                      onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                ))}

                {passengers.length < numSeats && (
                  <button
                    onClick={addPassenger}
                    className="mb-4 text-sm text-blue-400 hover:underline"
                  >
                    + Add Another Passenger
                  </button>
                )}

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setBookingStep(false)}
                    className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-medium"
                  >
                    Pay & Book
                  </button>
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
