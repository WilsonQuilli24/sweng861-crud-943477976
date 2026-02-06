export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const baseURL = "http://localhost:5002"; 

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${baseURL}/api${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "API Error");
    }
    return await res.json();
  } catch (err) {
    console.error("API fetch error:", err);
    throw err;
  }
}