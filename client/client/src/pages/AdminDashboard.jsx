import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [units, setUnits] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedTenants, setSelectedTenants] = useState({});
    const [newUnit, setNewUnit] = useState({ unitNumber: '', floor: '', rentAmount: '', bedrooms: 1 });

    // Payment creation state
    const [paymentForm, setPaymentForm] = useState({
        unitId: '',
        amount: '',
        dueDate: '',
        method: 'Cash',
        status: 'Paid',
        notes: 'Paid in cash to admin'
    });

    const [msg, setMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(true);

    const authHeader = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const loadAdminData = async () => {
        try {
            const [unitsRes, ticketsRes, tenantsRes, paymentsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/units', authHeader),
                axios.get('http://localhost:5000/api/tickets', authHeader),
                axios.get('http://localhost:5000/api/auth/tenants', authHeader),
                axios.get('http://localhost:5000/api/payments', authHeader)
            ]);
            setUnits(unitsRes.data.data);
            setTickets(ticketsRes.data.data);
            setTenants(tenantsRes.data.data);
            setPayments(paymentsRes.data.data);
        } catch (err) {
            setMsg({ type: 'error', text: 'Error loading admin management records.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const handleCreateUnit = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        try {
            const res = await axios.post('http://localhost:5000/api/units', newUnit, authHeader);
            setUnits([...units, res.data.data]);
            setNewUnit({ unitNumber: '', floor: '', rentAmount: '', bedrooms: 1 });
            setMsg({ type: 'success', text: `Unit ${res.data.data.unitNumber} added to your inventory!` });
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add unit.' });
        }
    };

    const handleAssignTenant = async (unitId) => {
        const tenantId = selectedTenants[unitId];
        if (!tenantId) {
            setMsg({ type: 'error', text: 'Select a tenant from the dropdown first.' });
            return;
        }

        try {
            const res = await axios.patch(
                `http://localhost:5000/api/units/${unitId}/assign`,
                { tenantId },
                authHeader
            );
            setMsg({ type: 'success', text: res.data.message });
            loadAdminData();
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to assign tenant.' });
        }
    };

    const handleVacateUnit = async (unitId) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/units/${unitId}/unassign`, {}, authHeader);
            setMsg({ type: 'success', text: res.data.message });
            loadAdminData();
        } catch (err) {
            setMsg({ type: 'error', text: 'Failed to vacate unit.' });
        }
    };

    const handleUpdateTicketStatus = async (ticketId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/tickets/${ticketId}/status`, { status: newStatus }, authHeader);
            setTickets(tickets.map(t => t._id === ticketId ? { ...t, status: newStatus } : t));
            setMsg({ type: 'success', text: 'Ticket status updated.' });
        } catch (err) {
            setMsg({ type: 'error', text: 'Failed to update ticket status.' });
        }
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });

        try {
            const res = await axios.post('http://localhost:5000/api/payments', paymentForm, authHeader);
            setPayments([res.data.data, ...payments]);
            setPaymentForm({
                unitId: '',
                amount: '',
                dueDate: '',
                method: 'Cash',
                status: 'Paid',
                notes: 'Paid in cash to admin'
            });
            setMsg({ type: 'success', text: 'Rent payment record logged successfully!' });
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to record payment.' });
        }
    };

    const handleUpdatePaymentStatus = async (paymentId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/payments/${paymentId}/status`, { status: newStatus }, authHeader);
            setPayments(payments.map(p => p._id === paymentId ? { ...p, status: newStatus } : p));
            setMsg({ type: 'success', text: 'Rent payment status updated!' });
        } catch (err) {
            setMsg({ type: 'error', text: 'Failed to update payment status.' });
        }
    };

    if (loading) return <div className="container"><p>Loading dashboard records...</p></div>;

    const totalUnits = units.length;
    const occupiedUnits = units.filter(u => u.status === 'Occupied').length;
    const pendingTickets = tickets.filter(t => t.status === 'Pending').length;
    const occupiedUnitsList = units.filter(u => u.status === 'Occupied');

    return (
        <div className="container">
            <h2>Property Manager Dashboard</h2>
            <p>Logged in as System Administrator: <strong>{user.name}</strong></p>

            {msg.text && (
                <div className={msg.type === 'success' ? 'alert-success' : 'alert-error'} style={{ marginTop: '1rem' }}>
                    {msg.text}
                </div>
            )}

            {/* KPI Cards */}
            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>My Total Units</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2b6cb0' }}>{totalUnits}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Occupancy Rate</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#22543d' }}>
                        {totalUnits ? `${Math.round((occupiedUnits / totalUnits) * 100)}%` : '0%'}
                    </p>
                    <small>{occupiedUnits} Occupied / {totalUnits - occupiedUnits} Vacant</small>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Pending Requests</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#c53030' }}>{pendingTickets}</p>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Add Unit Form */}
                <div className="card">
                    <h3>Add New Apartment Unit</h3>
                    <form onSubmit={handleCreateUnit} style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                            <label>Unit Number</label>
                            <input
                                type="text"
                                placeholder="e.g. 101, 204B"
                                value={newUnit.unitNumber}
                                onChange={(e) => setNewUnit({ ...newUnit, unitNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Floor</label>
                            <input
                                type="number"
                                placeholder="e.g. 1, 2"
                                value={newUnit.floor}
                                onChange={(e) => setNewUnit({ ...newUnit, floor: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Bedrooms</label>
                            <input
                                type="number"
                                placeholder="e.g. 1, 2, 3"
                                value={newUnit.bedrooms}
                                onChange={(e) => setNewUnit({ ...newUnit, bedrooms: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Monthly Rent ($)</label>
                            <input
                                type="number"
                                placeholder="e.g. 1200"
                                value={newUnit.rentAmount}
                                onChange={(e) => setNewUnit({ ...newUnit, rentAmount: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn">Create Unit</button>
                    </form>
                </div>

                {/* Units Directory */}
                <div className="card">
                    <h3>My Units Directory</h3>
                    <div className="table-container">
                        {units.length === 0 ? (
                            <p style={{ color: '#718096' }}>No units created under your admin profile.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Unit</th>
                                        <th>Rent</th>
                                        <th>Status</th>
                                        <th>Occupant / Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map((u) => (
                                        <tr key={u._id}>
                                            <td><strong>{u.unitNumber}</strong> (Fl {u.floor})</td>
                                            <td>${u.rentAmount}</td>
                                            <td>
                                                <span className={`badge ${u.status === 'Occupied' ? 'badge-occupied' : 'badge-vacant'}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td>
                                                {u.status === 'Occupied' ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <small>{u.currentTenant?.name || 'Assigned'}</small>
                                                        <button
                                                            onClick={() => handleVacateUnit(u._id)}
                                                            style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '0.2rem 0.4rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                        >
                                                            Vacate
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                                                        <select
                                                            value={selectedTenants[u._id] || ''}
                                                            onChange={(e) => setSelectedTenants({ ...selectedTenants, [u._id]: e.target.value })}
                                                            style={{ padding: '0.2rem', fontSize: '0.75rem', maxWidth: '120px' }}
                                                        >
                                                            <option value="">Select Tenant</option>
                                                            {tenants.map((t) => (
                                                                <option key={t._id} value={t._id}>{t.name}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleAssignTenant(u._id)}
                                                            style={{ background: '#2b6cb0', color: 'white', border: 'none', padding: '0.2rem 0.4rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                        >
                                                            Assign
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Record Rent & Cash Payment Section */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3>Record Rent Collection (Cash / Online)</h3>
                <form onSubmit={handleRecordPayment} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    <div className="form-group">
                        <label>Assigned Unit</label>
                        <select
                            value={paymentForm.unitId}
                            onChange={(e) => {
                                const selected = occupiedUnitsList.find(u => u._id === e.target.value);
                                setPaymentForm({
                                    ...paymentForm,
                                    unitId: e.target.value,
                                    amount: selected ? selected.rentAmount : paymentForm.amount
                                });
                            }}
                            required
                        >
                            <option value="">Select Occupied Unit</option>
                            {occupiedUnitsList.map(u => (
                                <option key={u._id} value={u._id}>Unit {u.unitNumber} - {u.currentTenant?.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Amount ($)</label>
                        <input
                            type="number"
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input
                            type="date"
                            value={paymentForm.dueDate}
                            onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Payment Method</label>
                        <select
                            value={paymentForm.method}
                            onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Online Card">Online Card</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            value={paymentForm.status}
                            onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
                        >
                            <option value="Paid">Paid (Cash Received)</option>
                            <option value="Pending">Pending (Invoice Sent)</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn" style={{ width: '100%' }}>Log Payment</button>
                    </div>
                </form>
            </div>

            {/* Rent Payment History Table */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3>Rent & Payment Records Ledger</h3>
                <div className="table-container">
                    {payments.length === 0 ? (
                        <p style={{ color: '#718096' }}>No rent payment records logged yet.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Tenant</th>
                                    <th>Unit</th>
                                    <th>Amount</th>
                                    <th>Due Date</th>
                                    <th>Payment Date</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Update Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p._id}>
                                        <td><strong>{p.tenant?.name}</strong></td>
                                        <td>Unit {p.unit?.unitNumber} (Fl {p.unit?.floor})</td>
                                        <td>${p.amount}</td>
                                        <td>{new Date(p.dueDate).toLocaleDateString()}</td>
                                        <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'Pending'}</td>
                                        <td><strong>{p.method}</strong></td>
                                        <td>
                                            <span className={`badge ${p.status === 'Paid' ? 'badge-resolved' : 'badge-vacant'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={p.status}
                                                onChange={(e) => handleUpdatePaymentStatus(p._id, e.target.value)}
                                                style={{ padding: '0.2rem', fontSize: '0.8rem' }}
                                            >
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Overdue">Overdue</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Maintenance Requests Queue */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3>Maintenance Requests Queue</h3>
                <div className="table-container">
                    {tickets.length === 0 ? (
                        <p style={{ color: '#718096' }}>No maintenance requests for your units.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Tenant</th>
                                    <th>Unit</th>
                                    <th>Issue</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((t) => (
                                    <tr key={t._id}>
                                        <td><strong>{t.tenant?.name}</strong></td>
                                        <td>Unit {t.unit?.unitNumber || '-'}</td>
                                        <td>
                                            <strong>{t.title}</strong> ({t.category})
                                            <br />
                                            <small>{t.description}</small>
                                        </td>
                                        <td>{t.priority}</td>
                                        <td>
                                            <span className={`badge ${t.status === 'Resolved' ? 'badge-resolved' :
                                                    t.status === 'In Progress' ? 'badge-progress' : 'badge-pending'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={t.status}
                                                onChange={(e) => handleUpdateTicketStatus(t._id, e.target.value)}
                                                style={{ padding: '0.3rem', borderRadius: '4px' }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;