import React, { useState, useMemo } from 'react';
import { Users, Search, Plus, Award, Mail, Phone, Calendar, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../utils/format';

export const CustomersScreen: React.FC = () => {
  const { customers, addCustomer, settings } = useApp();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );
  }, [customers, search]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomer({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: phone || '+234 803 123 4567',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    setName('');
    setEmail('');
    setPhone('');
    setIsAddOpen(false);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Gold':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Silver':
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  return (
    <div id="customers-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
            Supermarket Shoppers Directory
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Track frequent supermarket shoppers, lifetime spend, and loyalty points
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative sm:w-60">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search shoppers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 focus:bg-white text-zinc-900 placeholder:text-zinc-400 rounded-lg border border-zinc-200 focus:outline-none focus:border-[#6D5AE6]"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shopper</span>
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Shopper</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Loyalty Tier</th>
                <th className="py-3 px-4">Points</th>
                <th className="py-3 px-4">Supermarket Orders</th>
                <th className="py-3 px-4">Lifetime Spent</th>
                <th className="py-3 px-4 text-right">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="even:bg-zinc-50/70 odd:bg-white hover:bg-zinc-100/80 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs select-none">
                        {customer.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900">{customer.name}</div>
                        <div className="text-[11px] text-zinc-400">
                          Member since {customer.joinedDate}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-zinc-600">
                    <div className="space-y-0.5 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-zinc-400" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getTierBadge(
                        customer.tier
                      )}`}
                    >
                      <Award className="w-3 h-3" />
                      {customer.tier}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-zinc-800">
                    {customer.loyaltyPoints} pts
                  </td>

                  <td className="py-3 px-4 font-mono text-zinc-700">
                    {customer.ordersCount}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                    {formatMoney(customer.totalSpent, settings.currency)}
                  </td>

                  <td className="py-3 px-4 text-right text-zinc-500 font-medium">
                    {customer.lastVisit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-zinc-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">Enroll New Shopper</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chioma Adeyemi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234 803 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="chioma.a@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors cursor-pointer"
                >
                  Save Shopper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
