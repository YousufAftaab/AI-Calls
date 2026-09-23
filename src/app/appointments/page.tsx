'use client';

import React, { useEffect, useState } from 'react';
import { CalendarCheck, Plus, Clock, Search, Filter, XCircle, RotateCcw, Check, Sparkles, X, PhoneCall } from 'lucide-react';
import { Appointment } from '@/lib/types';
import { SALON_SERVICES } from '@/lib/salon-data';
import Link from 'next/link';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [rescheduleItem, setRescheduleItem] = useState<Appointment | null>(null);

  // New Appointment Form state
  const [newCustomer, setNewCustomer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newService, setNewService] = useState(SALON_SERVICES[0].name);
  const [newDate, setNewDate] = useState('Sunday');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newNotes, setNewNotes] = useState('');

  // Reschedule Form state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (e) {
      console.error('Failed to load appointments:', e);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newCustomer || 'Walk-in Guest',
          phone: newPhone || '+91 90000 00000',
          serviceName: newService,
          date: newDate,
          time: newTime,
          status: 'Confirmed',
          notes: newNotes,
        }),
      });
      if (res.ok) {
        setIsNewModalOpen(false);
        setNewCustomer('');
        setNewPhone('');
        setNewNotes('');
        fetchAppointments();
      }
    } catch (e) {
      console.error('Error creating appointment:', e);
    }
  };

  const handleUpdateStatus = async (id: string, status: Appointment['status']) => {
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchAppointments();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleItem) return;
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rescheduleItem.id,
          date: rescheduleDate || rescheduleItem.date,
          time: rescheduleTime || rescheduleItem.time,
        }),
      });
      setRescheduleItem(null);
      fetchAppointments();
    } catch (e) {
      console.error('Failed to reschedule:', e);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-salon-50/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-roseGold-100 text-roseGold-800 border border-roseGold-300">
                Salon Schedule
              </span>
              <span className="text-xs text-salon-500">• In-Memory & Local State</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-salon-950 tracking-tight">
              Annu Beauty Salon — Appointments
            </h1>
            <p className="text-xs sm:text-sm text-salon-600">
              Manage client bookings, reschedule dates, and review AI-confirmed appointments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ai-receptionist"
              className="px-3.5 py-2.5 rounded-xl border border-roseGold-200 bg-white hover:bg-salon-50 text-salon-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-roseGold-600" />
              <span>Book via AI Voice</span>
            </Link>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-roseGold-600 hover:bg-roseGold-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-roseGold-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-salon-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, service or phone..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500 bg-salon-50/40"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs text-salon-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {['ALL', 'Confirmed', 'Rescheduled', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-roseGold-600 text-white'
                    : 'bg-salon-50 text-salon-700 hover:bg-salon-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Table Card */}
        <div className="bg-white rounded-3xl border border-roseGold-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-salon-50/80 border-b border-roseGold-200/60 text-salon-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Notes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-roseGold-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-salon-500">
                      No appointments matching your criteria. Try calling the AI Voice receptionist to book one!
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-salon-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-salon-950 text-sm">{apt.customerName}</div>
                        <div className="text-salon-500 font-mono text-[11px]">{apt.phone}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-salon-800">
                        {apt.serviceName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-roseGold-800">{apt.date}</div>
                        <div className="text-salon-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{apt.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : apt.status === 'Rescheduled'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-salon-600 max-w-xs">
                        <p className="line-clamp-2 italic text-[11px]">
                          {apt.notes || 'Booked via AI Receptionist'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status !== 'Cancelled' && (
                            <>
                              <button
                                onClick={() => {
                                  setRescheduleItem(apt);
                                  setRescheduleDate(apt.date);
                                  setRescheduleTime(apt.time);
                                }}
                                className="p-1.5 rounded-lg border border-salon-200 text-salon-700 hover:bg-salon-100 transition-colors"
                                title="Reschedule"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                title="Cancel"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          {apt.status === 'Cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                              className="px-2 py-1 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-[10px] font-bold"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create Appointment */}
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-roseGold-200 relative">
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-salon-400 hover:text-salon-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-salon-950 mb-1">Create Demo Appointment</h3>
              <p className="text-xs text-salon-600 mb-4">Manual front desk entry</p>

              <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-salon-800 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    placeholder="e.g. Maya Devi"
                    className="w-full px-3.5 py-2 rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-salon-800 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98000 12345"
                    className="w-full px-3.5 py-2 rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-salon-800 mb-1">Service</label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500"
                  >
                    {SALON_SERVICES.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.demoPrice})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-salon-800 mb-1">Date</label>
                    <input
                      type="text"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      placeholder="e.g. Sunday, Oct 25"
                      className="w-full px-3.5 py-2 rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-salon-800 mb-1">Time</label>
                    <input
                      type="text"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 11:00 AM"
                      className="w-full px-3.5 py-2 rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-salon-800 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Optional notes or stylist assignment..."
                    className="w-full px-3.5 py-2 rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-salon-200 hover:bg-salon-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-roseGold-600 hover:bg-roseGold-700 text-white font-bold"
                  >
                    Save Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Reschedule */}
        {rescheduleItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-roseGold-200 relative">
              <button
                onClick={() => setRescheduleItem(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-salon-400 hover:text-salon-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-salon-950 mb-1">Reschedule Appointment</h3>
              <p className="text-xs text-salon-600 mb-4">
                Updating {rescheduleItem.customerName}&apos;s appointment for {rescheduleItem.serviceName}
              </p>

              <form onSubmit={handleRescheduleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-salon-800 mb-1">New Date</label>
                  <input
                    type="text"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    placeholder="e.g. Next Tuesday"
                    className="w-full px-3.5 py-2 rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-salon-800 mb-1">New Time Slot</label>
                  <input
                    type="text"
                    required
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    placeholder="e.g. 03:00 PM"
                    className="w-full px-3.5 py-2 rounded-xl border border-roseGold-200 focus:outline-none focus:ring-2 focus:ring-roseGold-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleItem(null)}
                    className="px-4 py-2 rounded-xl border border-salon-200 hover:bg-salon-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-roseGold-600 hover:bg-roseGold-700 text-white font-bold"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
