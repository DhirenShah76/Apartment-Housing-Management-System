import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [units, setUnits] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [newUnit, setNewUnit] = useState({ unitNumber: '', floor: '', rentAmount: '', bedrooms: 1 });
    const [assignData, setAssignData] = useState({ unitId: '', tenantEmail: '' });
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(true);

    const authHeader = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const loadAdminData = async () => {
        try {
            const [unitsRes, ticketsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/units', authHeader),
                axios.get('http://localhost:5000/api/tickets', authHeader)
            ]);
            setUnits(unitsRes.data.data);
            setTickets(ticketsRes.data.data);
        } catch (err) {
            setMsg({ type: 'error', text: 'Error loading management records.' });
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
            setMsg({ type: 'success', text: `Unit ${res.data.data.unitNumber} added successfully!` });
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add unit.' });
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

    const handleVacateUnit = async (unitId) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/units/${unitId}/unassign`, {}, authHeader);
            setUnits(units.map(u => u._id === unitId ? res.data.data : u));
            setMsg({ type: 'success', text: 'Unit marked as vacant.' });
        } catch (err) {
            setMsg({ type: 'error', text: 'Failed to vacate unit.' });
        }
    };

    if (loading) return <div className="container"><p>Loading dashboard records...</p></div>;

    const totalUnits = units.length;
    const occupiedUnits = units.filter(u => u.status === 'Occupied').length;
    const pendingTickets = tickets.filter(t => t.status === 'Pending').length;

    return (
        <div className="container">
            <h2>Property Manager Dashboard</h2>
            <p>Logged in as System Administrator: <strong>{user.name}</strong></p>

            {msg.text && (
                <div className={msg.type === 'success' ? 'alert-success' : 'alert-error'} style={{ marginTop: '1rem' }}>
                    {msg.text}
                </div>
            )}

            {/* Summary KPI Cards */}
            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Units</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: '#2b6cb0' }}>{totalUnits}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Occupancy</h3>
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

                {/* Units Inventory Table */}
                <div className="card">
                    <h3>Apartment Units Directory</h3>
                    <div className="table-container">
                        {units.length === 0 ? (
                            <p style={{ color: '#718096' }}>No units registered in database.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Unit</th>
                                        <th>Floor</th>
                                        <th>Rent</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map((u) => (
                                        <tr key={u._id}>
                                            <td><strong>{u.unitNumber}</strong></td>
                                            <td>{u.floor}</td>
                                            <td>${u.rentAmount}</td>
                                            <td>
                                                <span className={`badge ${u.status === 'Occupied' ? 'badge-occupied' : 'badge-vacant'}`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td>
                                                {u.status === 'Occupied' && (
                                                    <button
                                                        onClick={() => handleVacateUnit(u._id)}
                                                        style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        Vacate
                                                    </button>
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

            {/* Maintenance Tickets Queue */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3>Maintenance Requests Queue</h3>
                <div className="table-container">
                    {tickets.length === 0 ? (
                        <p style={{ color: '#718096' }}>No maintenance requests submitted.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Tenant</th>
                                    <th>Issue Details</th>
                                    <th>Priority</th>
                                    <th>Current Status</th>
                                    <th>Update Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((t) => (
                                    <tr key={t._id}>
                                        <td>
                                            <strong>{t.tenant?.name || 'Resident'}</strong>
                                            <br />
                                            <small style={{ color: '#718096' }}>{t.tenant?.email}</small>
                                        </td>
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