import React, { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import './DataPages.css';
import './Inquiries.css';
export default function Inquiries() {
    const [selected, setSelected] = useState(null);
    const rows = [['I-1001', 'Priya Kapoor', 'priya@example.com',
        'Interested in bulk wedding orders', '26 Sep 2026',
        'New'], ['I-1002', 'Rahul Mehta', 'rahul@example.com',
        'Asked about size availability', '25 Sep 2026', 'Read'],
    ['I-1003', 'Sneha Jain', 'sneha@example.com', 'Collaboration request', '24 Sep 2026', 'New']];
    return <div>
        <div className="admin-title">
            <div>
                <h2>Inquiries</h2>
                <p>All website contact and product inquiries.</p>
            </div>
        </div>
        <div className="admin-card">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>{rows.map(r => <tr key={r[0]}>{r.map((c, i) =>
                    <td key={i}>{i === 5 ? <span className={'admin-badge ' + (c === 'New' ? 'warn' : '')}>{c}</span> : c}</td>)}
                    <td><button className="icon-btn" onClick={() => setSelected(r)}><FiEye /></button></td></tr>)}</tbody></table>
        </div>{selected && <div className="modal-backdrop">
            <div className="admin-modal small">
                <div className="modal-head">
                    <h3>Inquiry</h3><button onClick={() => setSelected(null)}>×</button>
                </div><p><b>Name:</b> {selected[1]}</p><p><b>Email:</b> {selected[2]}</p>
                <p><b>Date:</b> {selected[4]}</p><div className="message-box">{selected[3]}</div>
                <button className="btn btn-primary" onClick={() => setSelected(null)}>Close</button></div></div>}</div>
}
