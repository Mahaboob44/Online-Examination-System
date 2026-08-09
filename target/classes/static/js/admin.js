const API_BASE = "/api";
const user = JSON.parse(localStorage.getItem("examUser") || "null");

if (!user || user.role !== "ADMIN") {
    window.location.href = "index.html";
}

let selectedExamId = null;

function logout() {
    localStorage.removeItem("examUser");
    window.location.href = "index.html";
}

async function createExam() {
    const title = document.getElementById("examTitle").value.trim();
    const description = document.getElementById("examDescription").value.trim();
    const durationMinutes = Number(document.getElementById("examDuration").value);

    if (!title || !durationMinutes) {
        alert("Please enter a title and duration");
        return;
    }

    await fetch(`${API_BASE}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, durationMinutes })
    });

    document.getElementById("examTitle").value = "";
    document.getElementById("examDescription").value = "";
    document.getElementById("examDuration").value = "";
    loadExams();
}

async function loadExams() {
    const res = await fetch(`${API_BASE}/exams`);
    const exams = await res.json();

    const container = document.getElementById("examList");
    if (exams.length === 0) {
        container.innerHTML = "<p>No exams created yet.</p>";
        return;
    }

    container.innerHTML = exams.map(exam => `
        <div class="exam-list-item">
            <div>
                <strong>${exam.title}</strong><br>
                <small>${exam.description || ""} &middot; ${exam.durationMinutes} min</small>
            </div>
            <div>
                <button onclick="manageQuestions(${exam.id}, '${exam.title.replace(/'/g, "\\'")}')">Manage Questions</button>
                <button class="danger" onclick="deleteExam(${exam.id})">Delete</button>
            </div>
        </div>
    `).join("");
}

async function deleteExam(examId) {
    if (!confirm("Delete this exam and all its questions?")) return;
    await fetch(`${API_BASE}/exams/${examId}`, { method: "DELETE" });
    loadExams();
    if (selectedExamId === examId) {
        document.getElementById("questionFormCard").style.display = "none";
    }
}

function manageQuestions(examId, title) {
    selectedExamId = examId;
    document.getElementById("selectedExamTitle").textContent = title;
    document.getElementById("questionFormCard").style.display = "block";
    loadQuestions(examId);
}

async function addQuestion() {
    const questionText = document.getElementById("qText").value.trim();
    const optionA = document.getElementById("qOptionA").value.trim();
    const optionB = document.getElementById("qOptionB").value.trim();
    const optionC = document.getElementById("qOptionC").value.trim();
    const optionD = document.getElementById("qOptionD").value.trim();
    const correctOption = document.getElementById("qCorrect").value;

    if (!questionText || !optionA || !optionB || !optionC || !optionD) {
        alert("Please fill in the question and all four options");
        return;
    }

    await fetch(`${API_BASE}/exams/${selectedExamId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText, optionA, optionB, optionC, optionD, correctOption })
    });

    document.getElementById("qText").value = "";
    document.getElementById("qOptionA").value = "";
    document.getElementById("qOptionB").value = "";
    document.getElementById("qOptionC").value = "";
    document.getElementById("qOptionD").value = "";

    loadQuestions(selectedExamId);
}

async function loadQuestions(examId) {
    const res = await fetch(`${API_BASE}/exams/${examId}?includeAnswers=true`);
    const data = await res.json();

    const container = document.getElementById("questionList");
    if (data.questions.length === 0) {
        container.innerHTML = "<p>No questions added yet.</p>";
        return;
    }

    container.innerHTML = data.questions.map((q, idx) => `
        <div class="question-item">
            <div>
                <strong>Q${idx + 1}.</strong> ${q.questionText}
                <br><small>A) ${q.optionA} &nbsp; B) ${q.optionB} &nbsp; C) ${q.optionC} &nbsp; D) ${q.optionD}</small>
                <br><small>Correct: ${q.correctOption}</small>
            </div>
            <button class="danger" onclick="deleteQuestion(${q.id})">Delete</button>
        </div>
    `).join("");
}

async function deleteQuestion(questionId) {
    await fetch(`${API_BASE}/exams/questions/${questionId}`, { method: "DELETE" });
    loadQuestions(selectedExamId);
}

loadExams();
