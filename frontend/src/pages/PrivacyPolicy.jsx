import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
            <div
                style={{
                    maxWidth: "850px",
                    margin: "0 auto",
                    background: "#ffffff",
                    padding: "35px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    border: "1px solid #e2e8f0"
                }}
            >
                <h1 style={{ color: "#0f172a", fontSize: "2rem", marginBottom: "8px", borderBottom: "2px solid #e2e8f0", paddingBottom: "12px" }}>
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