const API_BASE = "/api";

function toggleForm() {
    const login = document.getElementById("loginForm");
    const reg = document.getElementById("registerForm");
    login.style.display = login.style.display === "none" ? "block" : "none";
    reg.style.display = reg.style.display === "none" ? "block" : "none";
    document.getElementById("msg").innerHTML = "";
}

function showMessage(text, isError) {
    document.getElementById("msg").innerHTML =
        `<p class="${isError ? 'error' : 'success'}">${text}</p>`;
}

async function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
        showMessage("Please enter username and password", true);
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showMessage(data.error || "Login failed", true);
            return;
        }

        localStorage.setItem("examUser", JSON.stringify(data));

        if (data.role === "ADMIN") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "student.html";
        }
    } catch (err) {
        showMessage("Could not connect to server", true);
    }
}

async function register() {
    const fullName = document.getElementById("regFullName").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;
    const role = document.getElementById("regRole").value;

    if (!fullName || !username || !password) {
        showMessage("All fields are required", true);
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, username, password, role })
        });
        const data = await res.json();

        if (!res.ok) {
            showMessage(data.error || "Registration failed", true);
            return;
        }

        showMessage("Registered successfully. Please login.", false);
        toggleForm();
    } catch (err) {
        showMessage("Could not connect to server", true);
    }
}
