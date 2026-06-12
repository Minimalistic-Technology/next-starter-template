"use client";

import { useState } from "react";

export default function Home() {
	const [backendUrl, setBackendUrl] = useState("https://testbackend-n68f.onrender.com");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const sendRequest = async () => {
		setLoading(true);
		setResult(null);

		try {
			const res = await fetch("/api/proxy", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ targetUrl: backendUrl.trim(), method: "GET" }),
			});

			const data = (await res.json()) as {
				error?: string;
				details?: string;
				status?: number;
				body?: any;
				responseTime?: number;
			};

			if (data.error) {
				setSuccess(false);
				setResult(`❌ Error: ${data.error}`);
			} else {
				setSuccess(true);
				setResult(
					`✅ Status: ${data.status} | Time: ${data.responseTime}ms\n\n${typeof data.body === "object" ? JSON.stringify(data.body, null, 2) : data.body}`
				);
			}
		} catch (err: any) {
			setSuccess(false);
			setResult(`❌ ${err.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{
			minHeight: "100vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			fontFamily: "system-ui, sans-serif",
			background: "#0a0a0a",
			color: "#fff",
			padding: "20px",
		}}>
			<h1 style={{ fontSize: "1.5rem", marginBottom: "24px", fontWeight: 600 }}>
				Backend Connection Tester.
			</h1>

			<div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "600px" }}>
				<input
					type="url"
					value={backendUrl}
					onChange={(e) => setBackendUrl(e.target.value)}
					placeholder="https://your-backend-url.com"
					style={{
						flex: 1,
						padding: "12px 16px",
						borderRadius: "8px",
						border: "1px solid #333",
						background: "#111",
						color: "#fff",
						fontSize: "14px",
						outline: "none",
					}}
				/>
				<button
					onClick={sendRequest}
					disabled={loading}
					style={{
						padding: "12px 24px",
						borderRadius: "8px",
						border: "none",
						background: loading ? "#333" : "#4f46e5",
						color: "#fff",
						fontWeight: 600,
						fontSize: "14px",
						cursor: loading ? "not-allowed" : "pointer",
					}}
				>
					{loading ? "Sending..." : "Test"}
				</button>
			</div>

			{result && (
				<pre style={{
					marginTop: "24px",
					padding: "16px",
					borderRadius: "8px",
					background: "#111",
					border: `1px solid ${success ? "#22c55e33" : "#ef444433"}`,
					color: success ? "#4ade80" : "#f87171",
					width: "100%",
					maxWidth: "600px",
					whiteSpace: "pre-wrap",
					wordBreak: "break-word",
					fontSize: "13px",
					fontFamily: "monospace",
				}}>
					{result}
				</pre>
			)}
		</div>
	);
}
