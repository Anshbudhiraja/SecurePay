import React, { useState } from "react";
import {ArrowLeftIcon} from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom";
const MOCK_FLIGHTS = [
  {
    id: 1,
    name: "IndiGo 101",
    number: "6E101",
    source: "Delhi",
    destination: "Mumbai",
    departure: "09:00",
    arrival: "11:30",
    price: 4500,
    tax: 300,
    discount: 200,
    seatsAvailable: 50,
    weekdays: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    name: "Air India 202",
    number: "AI202",
    source: "Delhi",
    destination: "Bangalore",
    departure: "14:00",
    arrival: "17:30",
    price: 5500,
    tax: 400,
    discount: 300,
    seatsAvailable: 30,
    weekdays: [1, 3, 5, 7],
  },
];

const weekdaysSymbols = ["S", "M", "T", "W", "T", "F", "S"];

const FlightComp = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate()
  const [modalFlight, setModalFlight] = useState(null);
  const [bookingStep, setBookingStep] = useState(false);

  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "" }]);
  const [numSeats, setNumSeats] = useState(1);

  const searchFlights = () => {
    const filtered = MOCK_FLIGHTS.filter(
      (flight) =>
        flight.source.toLowerCase().includes(source.toLowerCase()) &&
        flight.destination.toLowerCase().includes(destination.toLowerCase())
    );
    setResults(filtered);
  };

  const totalAmount = (flight) => numSeats * (flight.price + flight.tax - flight.discount);

  const handleConfirmBooking = () => {
    alert(
      `Flight booked for ${passengers.map((p) => p.name).join(", ")} on ${modalFlight.name} (${modalFlight.number}) from ${modalFlight.source} to ${modalFlight.destination} on ${date}. Total Paid: ₹${totalAmount(
        modalFlight
      )}`
    );
    setModalFlight(null);
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
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center flex items-center gap-2">
          <ArrowLeftIcon onClick={()=>navigate("/tickets")} className="w-5 h-5 cursor-pointer" />
          Search Flight Tickets</h1>
        <p className="text-gray-400 text-center">Find flights between your source and destination</p>
      </div>

      {/* Search Box */}
      <div className="bg-gray-800 shadow-lg border border-gray-700 rounded-xl p-6 mb-8 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <input
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={searchFlights}
            className="bg-green-600 hover:bg-green-500 transition rounded-lg font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <p className="text-gray-400 text-sm text-center">No flights found</p>
      ) : (
        <div className="space-y-4">
          {results.map((flight) => (
            <div key={flight.id} className="bg-gray-800 shadow-md border border-gray-700 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
  {/* Flight Info */}
  <div className="space-y-1">
    <h2 className="text-lg font-semibold">{flight.name}</h2>
    <p className="text-sm text-gray-400">{flight.number}</p>
    <p className="text-sm">{flight.source} → {flight.destination}</p>
    <p className="text-sm text-gray-400">{flight.departure} - {flight.arrival}</p>
  </div>

  {/* Weekdays */}
  <div className="flex gap-1 justify-center">
    {weekdaysSymbols.map((d, idx) => (
      <span
        key={idx}
        className={flight.weekdays.includes(idx) ? "text-green-400 font-bold" : "text-gray-500"}
      >
        {d}
      </span>
    ))}
  </div>

  {/* Price & Seats */}
  <div className="text-right space-y-2">
    <p className="text-xl font-bold text-green-400">₹ {flight.price + flight.tax - flight.discount}</p>
    <p className="text-sm text-gray-400">Tickets Available: {flight.seatsAvailable}</p>
    <button
      onClick={() => setModalFlight(flight)}
      className="mt-2 bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg text-sm font-medium shadow"
    >
      Book
    </button>
  </div>
</div>

          ))}
        </div>
      )}

      {/* Modal */}
      {modalFlight && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-xl w-full shadow-xl relative">
            <button
              onClick={() => {
                setModalFlight(null);
                setBookingStep(false);
                setPassengers([{ name: "", age: "", gender: "" }]);
                setNumSeats(1);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>

            {!bookingStep ? (
              <>
                <h2 className="text-2xl font-semibold mb-4">{modalFlight.name}</h2>
                <p className="mb-1">
                  <span className="font-semibold">From:</span> {modalFlight.source}{" "}
                  <span className="font-semibold">To:</span> {modalFlight.destination}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Flight No:</span> {modalFlight.number}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Weekdays:</span>{" "}
                  {weekdaysSymbols.map((d, idx) => (
                    <span
                      key={idx}
                      className={modalFlight.weekdays.includes(idx) ? "text-green-400 font-bold" : "text-gray-500"}
                    >
                      {d}{" "}
                    </span>
                  ))}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <p>
                    <span className="font-semibold">Price:</span> ₹ {modalFlight.price}
                  </p>
                  <p>
                    <span className="font-semibold">Tax:</span> ₹ {modalFlight.tax}
                  </p>
                  <p>
                    <span className="font-semibold">Discount:</span> ₹ {modalFlight.discount}
                  </p>
                  <p>
                    <span className="font-semibold">Seats Available:</span> {modalFlight.seatsAvailable}
                  </p>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold">Number of Seats:</span>
                  <input
                    type="number"
                    min={1}
                    max={modalFlight.seatsAvailable}
                    value={numSeats}
                    onChange={(e) => setNumSeats(Number(e.target.value))}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 w-16 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <p className="mt-3 font-bold text-green-400 text-lg">
                  Total: ₹ {totalAmount(modalFlight)}
                </p>

                <button
                  onClick={() => setBookingStep(true)}
                  className="mt-4 w-full bg-green-600 hover:bg-green-500 py-2 rounded-lg font-medium shadow"
                >
                  Proceed to Booking
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4">Passenger Details</h2>
                {passengers.map((p, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      placeholder="Passenger Name"
                      value={p.name}
                      onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={p.age}
                      onChange={(e) => updatePassenger(idx, "age", e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <select
                      value={p.gender}
                      onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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

export default FlightComp;
