import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="w-full min-h-screen bg-slate-50 px-4 py-6 sm:py-10 overflow-x-clip">
            <div className="max-w-3xl mx-auto bg-white px-5 py-6 sm:p-9 rounded-xl shadow border border-slate-200 w-full">
                <h1 className="text-2xl sm:text-3xl text-slate-900 font-bold mb-2 border-b-2 border-slate-200 pb-3">
                    Privacy Policy
                </h1>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "25px" }}>
                    Last updated: September 2026
                </p>

                <section style={{ marginBottom: "20px", color: "#334155", lineHeight: "1.7" }}>
                    <p>
                        Welcome to <strong>PrizeBond Check</strong>. This web application is a personal portfolio project developed and maintained by <strong>Mahbub Webdev</strong> to demonstrate full-stack development capabilities.
                    </p>

                    <h3 style={{ color: "#1e293b", marginTop: "20px" }}>1. Information We Collect</h3>
                    <p>We collect minimal information necessary for system features and authorization testing:</p>
                    <ul style={{ paddingLeft: "20px" }}>
                        <li>Account registration data (Username, Email, and hashed Passwords).</li>
                        <li>CSV/Excel files uploaded temporarily to execute bulk bond searches.</li>
                    </ul>

                    <h3 style={{ color: "#1e293b", marginTop: "20px" }}>2. Purpose of Application</h3>
                    <p>
                        This application is purely a <strong>Developer Showcase / Demo Project</strong>. The draw data may consist of sample numbers and should not be used as official financial advice.
                    </p>

                    <h3 style={{ color: "#1e293b", marginTop: "20px" }}>3. Cookies & Google AdSense</h3>
                    <p>
                        We may use cookies to improve browsing experience and for analytical purposes. Third-party vendors, including <strong>Google AdSense</strong>, may serve advertisements based on user interactions.
                    </p>

                    <h3 style={{ color: "#1e293b", marginTop: "20px" }}>4. Security & Data Protection</h3>
                    <p>
                        Backend routes and search APIs are fully secured with token/permission authentication to prevent unauthorized data access.
                    </p>
                </section>

                <div style={{ marginTop: "30px", pt: "20px", borderTop: "1px solid #e2e8f0" }}>
                    <Link
                        to="/"
                        style={{
                            color: "#d97706",
                            textDecoration: "none",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}