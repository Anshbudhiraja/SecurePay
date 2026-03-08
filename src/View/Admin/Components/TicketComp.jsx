import React, { useState, useEffect } from "react";
import useTicketStore from "@/stores/admin/ticketStore";

const TICKET_TYPES = [
  {
    type: "train",
    title: "Train Ticket",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    link: "/tickets/train",
  },
  {
    type: "flight",
    title: "Flight Ticket",
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80",
    link: "/tickets/flight",
  },
];

const TICKETS_PER_PAGE = 4;

const TicketComp = () => {
  const { myBookings, fetchMyBookings, isLoading } = useTicketStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  // Frontend Filter and Search Logic
  const filteredTickets = myBookings.filter((booking) => {
    const ticketInfo = booking.ticketId; // Populated from backend
    if (!ticketInfo) return false;

    const matchType = filterType === "all" ? true : ticketInfo.ticketType?.toLowerCase() === filterType.toLowerCase();
    
    const matchSearch =
      ticketInfo.name?.toLowerCase().includes(search.toLowerCase()) ||
      ticketInfo.source?.toLowerCase().includes(search.toLowerCase()) ||
      ticketInfo.destination?.toLowerCase().includes(search.toLowerCase());

    return matchType && matchSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);
  const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + TICKETS_PER_PAGE);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">Book Tickets</h1>
        <p className="text-zinc-400">Choose a service or manage your booking history</p>
      </header>

      {/* Ticket Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {TICKET_TYPES.map((ticket) => (
          <a key={ticket.type} href={ticket.link} className="group rounded-xl overflow-hidden border border-zinc-800 hover:border-green-500 transition shadow-lg">
            <img src={ticket.image} alt={ticket.title} className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="p-4 bg-zinc-900">
              <h2 className="text-xl font-bold text-white">{ticket.title}</h2>
              <p className="text-sm text-zinc-500 uppercase tracking-widest">New Booking</p>
            </div>
          </a>
        ))}
      </div>

      <div className="border-t border-zinc-800 pt-10">
        <h2 className="text-2xl font-bold text-white mb-6">Booking History</h2>
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 flex-1 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All Services</option>
            <option value="train">Trains Only</option>
            <option value="flight">Flights Only</option>
          </select>
        </div>

        {/* Purchase History List */}
        {isLoading ? (
          <p className="text-center text-zinc-500">Loading history...</p>
        ) : paginatedTickets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {paginatedTickets.map((booking) => (
                <div key={booking._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-green-400">
                      {booking.ticketId?.name}
                    </h3>
                    <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 uppercase font-bold">
                      {booking.ticketId?.ticketType}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">
                    {booking.ticketId?.source} → {booking.ticketId?.destination}
                  </p>
                  <div className="mt-4 flex justify-between items-end">
                    <div className="text-xs text-zinc-500">
                      <p>Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
                      <p>Passengers: {booking.totalSeats}</p>
                    </div>
                    <p className="text-lg font-bold text-white">₹{booking.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-10">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-6 py-2 rounded-xl bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition"
                >
                  Previous
                </button>
                <span className="text-zinc-500 text-sm font-mono">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2 rounded-xl bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl">
             <p className="text-zinc-500">No bookings found in your history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketComp;