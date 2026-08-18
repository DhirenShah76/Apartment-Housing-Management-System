import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TenantDashboard = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [payments, setPayments] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: 'General',
        priority: 'Medium',
        description: ''
    });
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(true);

    const authHeader = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const fetchData = async () => {
        try {
            const [profileRes, ticketsRes, paymentsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/auth/me', authHeader),
                axios.get('http://localhost:5000/api/tickets', authHeader),
                axios.get('http://localhost:5000/api/payments', authHeader)
            ]);

            setProfile(profileRes.data.data);
            setTickets(ticketsRes.data.data);
            setPayments(paymentsRes.data.data);
        } catch (err) {
            setMsg({ type: 'error', text: 'Failed to load tenant records.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });

        try {
            const res = await axios.post('http://localhost:5000/api/tickets', formData, authHeader);
            setTickets([res.data.data, ...tickets]);
            setFormData({ title: '', category: 'General', priority: 'Medium', description: '' });
            setMsg({ type: 'success', text: 'Maintenance ticket submitted successfully!' });
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to submit ticket.' });
        }
    };

    if (loading) return <div className="container"><p>Loading portal data...</p></div>;

    return (
        <div className="container">
            <h2>Tenant Resident Portal</h2>
            <p>Welcome back, <strong>{profile?.name}</strong></p>

            {msg.text && (
                <div className={msg.type === 'success' ? 'alert-success' : 'alert-error'} style={{ marginTop: '1rem' }}>
                    {msg.text}
                </div>
            )}

            {/* Unit Overview Card */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3>Apartment Information</h3>
                {profile?.unitId ? (
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                        <p><strong>Unit:</strong> {profile.unitId.unitNumber}</p>
                        <p><strong>Floor:</strong> {profile.unitId.floor}</p>
                        <p><strong>Monthly Rent:</strong> ${profile.unitId.rentAmount}</p>
                        <p><strong>Status:</strong> <span className="badge badge-occupied">Assigned</span></p>
                    </div>
                ) : (
                    <p style={{ color: '#e53e3e', marginTop: '0.5rem' }}>
                        No apartment unit currently assigned to your account. Contact Property Management.
                    </p>
                )}
            </div>

            <div className="dashboard-grid">
                {/* Ticket Submission Form */}
                <div className="card">
                    <h3>Submit Maintenance Request</h3>
                    <form onSubmit={handleTicketSubmit} style={{ marginTop: '1rem' }}>
                        <div className="form-group">
                            <label>Issue Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Leaking bathroom sink"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="General">General</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Appliance">Appliance</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the issue in detail..."
                                required
                            />
                        </div>
                        <button type="submit" className="btn">Submit Ticket</button>
                    </form>
                </div>

                {/* Maintenance History */}
                <div className="card">
                    <h3>My Maintenance Tickets</h3>
                    <div className="table-container">
                        {tickets.length === 0 ? (
                            <p style={{ color: '#718096' }}>No maintenance tickets logged yet.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Issue</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((t) => (
                                        <tr key={t._id}>
                                            <td>
                                                <strong>{t.title}</strong>
                                                <br />
                                                <small style={{ color: '#718096' }}>{t.category}</small>
                                            </td>
                                            <td>{t.priority}</td>
                                            <td>
                                                <span className={`badge ${t.status === 'Resolved' ? 'badge-resolved' :
                                                        t.status === 'In Progress' ? 'badge-progress' : 'badge-pending'
                                                    }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Rent & Payments Section */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3>Rent & Payment History</h3>
                <div className="table-container">
                    {payments.length === 0 ? (
                        <p style={{ color: '#718096' }}>No active payment records found.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>Due Date</th>
                                    <th>Payment Date</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p._id}>
                                        <td>${p.amount}</td>
                                        <td>{new Date(p.dueDate).toLocaleDateString()}</td>
                                        <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}</td>
                                        <td>{p.method}</td>
                                        <td>
                                            <span className={`badge ${p.status === 'Paid' ? 'badge-resolved' : 'badge-vacant'}`}>
                                                {p.status}
                                            </span>
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

export default TenantDashboard;