import React from 'react';
import {FiShoppingBag,FiUsers,FiPackage,FiDollarSign} from 'react-icons/fi';
import './AdminPages.css';
import './Overview.css';
export default function Overview(){return <div>
    <div className="admin-title">
        <div>
        <h2>Overview</h2>
        <p>Today’s store performance at a glance.</p>
        </div>
        </div>
        <div className="admin-stat-grid">{[[FiDollarSign,'Revenue','₹1,84,920'],
        [FiShoppingBag,'Orders','128'],
        [FiPackage,'Products','412'],
        [FiUsers,'Customers','2,846']].map(([I,t,v])=>
        <div className="admin-stat" key={t}>
            <I className="stat-icon"/>
            <span>{t}</span>
            <strong>{v}</strong>
            <small>↑ 12.4% vs last month</small>
            </div>)}</div>
            <div className="admin-two-col">
                <div className="admin-card">
                    <h3>Recent Orders</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                </tr>
                                </thead>,
                                <tbody>{[['#SBV10024','Aarav Sharma','₹2,499','Delivered'],
                                ['#SBV10023','Neha Verma','₹1,799','Processing'],
                                ['#SBV10022','Riya Singh','₹3,499','Shipped'],
                                ['#SBV10021','Karan Malik','₹999','Delivered']].map(r=>
                                <tr key={r[0]}>{r.map((c,i)=><td key={i}>{i===3?<span className={'admin-badge '+(c==='Processing'?'warn':'')}>{c}</span>:c}</td>)}</tr>)}</tbody></table></div><div className="admin-card"><h3>Top Categories</h3>{[['Women',82],['Men',68],['Ethnic Wear',57],['Boys',34],['Footwear',28]].map(([n,v])=><div className="bar-row" key={n}><span>{n}</span><div><i style={{width:v+'%'}}/></div><b>{v}%</b></div>)}</div></div></div>}
