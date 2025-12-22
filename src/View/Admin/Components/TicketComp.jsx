import React, { useState } from "react";

// Ticket types
const TICKET_TYPES = [
  {
    type: "train",
    title: "Train Ticket",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    link: "/tickets/train",
  },
  {
    type: "flight",
    title: "Flight Ticket",
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80",
    link: "/tickets/flight",
  },
];

// Mock ticket data
const MOCK_TICKETS = [
  {
    id: 1,
    type: "train",
    name: "Rajdhani Express",
    number: "12951",
    source: "Delhi",
    destination: "Mumbai",
    price: 2450,
    tax: 200,
    discount: 150,
    seatsAvailable: 20,
    bookedSeats: 2,
  },
  {
    id: 2,
    type: "train",
    name: "Shatabdi Express",
    number: "12009",
    source: "Delhi",
    destination: "Chandigarh",
    price: 980,
    tax: 50,
    discount: 50,
    seatsAvailable: 15,
    bookedSeats: 1,
  },
  {
    id: 3,
    type: "flight",
    name: "IndiGo 101",
    number: "6E101",
    source: "Delhi",
    destination: "Mumbai",
    price: 4500,
    tax: 300,
    discount: 200,
    seatsAvailable: 50,
    bookedSeats: 3,
  },
  {
    id: 4,
    type: "flight",
    name: "Air India 203",
    number: "AI203",
    source: "Delhi",
    destination: "Bangalore",
    price: 5200,
    tax: 350,
    discount: 250,
    seatsAvailable: 30,
    bookedSeats: 1,
  },
  // Add more mock tickets if needed for pagination testing
];

const TICKETS_PER_PAGE = 2; // Number of tickets to show per page

const TicketComp = () => {
  const [bookedTickets, setBookedTickets] = useState(MOCK_TICKETS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search tickets
  const filteredTickets = bookedTickets.filter((ticket) => {
    const matchType = filterType === "all" ? true : ticket.type === filterType;
    const matchSearch =
      ticket.name.toLowerCase().includes(search.toLowerCase()) ||
      ticket.source.toLowerCase().includes(search.toLowerCase()) ||
      ticket.destination.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);
  const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + TICKETS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset to first page when search/filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Book Tickets</h1>
        <p className="text-gray-400">
          Choose ticket type and view purchased tickets
        </p>
      </div>

      {/* Ticket Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {TICKET_TYPES.map((ticket) => (
          <a
            key={ticket.type}
            href={ticket.link}
            className="cursor-pointer rounded-xl overflow-hidden border border-gray-800 hover:border-green-500 transition shadow-lg hover:shadow-xl"
          >
            <img
              src={ticket.image}
              alt={ticket.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 bg-gray-900">
              <h2 className="text-xl font-semibold">{ticket.title}</h2>
              <p className="text-sm text-gray-400">Click to select</p>
            </div>
          </a>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by name, source, destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All</option>
          <option value="train">Train</option>
          <option value="flight">Flight</option>
        </select>
      </div>

      {/* Purchased Tickets */}
      {paginatedTickets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {paginatedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg text-green-400">
                  {ticket.name} ({ticket.type})
                </h3>
                <p className="text-sm text-gray-300">
                  {ticket.source} → {ticket.destination}
                </p>
                <p className="text-sm text-gray-400">
                  Seats: {ticket.bookedSeats} | Total Paid: ₹
                  {ticket.bookedSeats *
                    (ticket.price + ticket.tax - ticket.discount)}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500"
              } text-white font-semibold`}
            >
              Previous
            </button>
            <span className="text-gray-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500"
              } text-white font-semibold`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-center mt-6">No tickets found</p>
      )}
    </div>
  );
};

export default TicketComp;
