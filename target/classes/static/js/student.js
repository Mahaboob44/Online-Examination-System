const API_BASE = "/api";
const user = JSON.parse(localStorage.getItem("examUser") || "null");

if (!user || user.role !== "STUDENT") {
    window.location.href = "index.html";
}

document.getElementById("studentName").textContent = user.fullName;

function logout() {
    localStorage.removeItem("examUser");
    window.location.href = "index.html";
}

async function loadExams() {
    const res = await fetch(`${API_BASE}/exams`);
    const exams = await res.json();

    const container = document.getElementById("examList");
    if (exams.length === 0) {
        container.innerHTML = "<p>No exams available yet.</p>";
        return;
    }

    container.innerHTML = exams.map(exam => `
        <div class="exam-list-item">
            <div>
                <strong>${exam.title}</strong><br>
                <small>${exam.description || ""} &middot; ${exam.durationMinutes} min</small>
            </div>
            <button onclick="startExam(${exam.id})">Start Exam</button>
        </div>
    `).join("");
}

function startExam(examId) {
    window.location.href = `exam.html?examId=${examId}`;
}

async function loadResults() {
    const res = await fetch(`${API_BASE}/results/user/${user.id}`);
    const results = await res.json();

    const container = document.getElementById("resultList");
    if (results.length === 0) {
        container.innerHTML = "<p>You haven't attempted any exams yet.</p>";
        return;
    }

    container.innerHTML = results.map(r => `
        <div class="exam-list-item">
            <div>
                <strong>${r.exam.title}</strong><br>
                <small>Submitted: ${new Date(r.submittedAt).toLocaleString()}</small>
            </div>
            <span class="badge">${r.score} / ${r.totalQuestions}</span>
        </div>
    `).join("");
}

loadExams();
loadResults();
