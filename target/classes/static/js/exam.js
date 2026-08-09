const API_BASE = "/api";
const user = JSON.parse(localStorage.getItem("examUser") || "null");

if (!user || user.role !== "STUDENT") {
    window.location.href = "index.html";
}

const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get("examId");

let timerInterval;
let secondsLeft = 0;
let submitted = false;
const answers = {}; // questionId -> "A"/"B"/"C"/"D"

async function loadExam() {
    const res = await fetch(`${API_BASE}/exams/${examId}`);
    if (!res.ok) {
        document.getElementById("examTitle").textContent = "Exam not found.";
        return;
    }
    const data = await res.json();
    const exam = data.exam;
    const questions = data.questions;

    document.getElementById("examTitle").textContent = exam.title;

    const container = document.getElementById("questionContainer");
    container.innerHTML = questions.map((q, idx) => `
        <div class="question-block">
            <p><strong>Q${idx + 1}.</strong> ${q.questionText}</p>
            ${["A", "B", "C", "D"].map(opt => `
                <div class="option-row">
                    <input type="radio" name="q${q.id}" id="q${q.id}${opt}"
                           onclick="answers[${q.id}] = '${opt}'">
                    <label for="q${q.id}${opt}">${q["option" + opt]}</label>
                </div>
            `).join("")}
        </div>
    `).join("");

    secondsLeft = exam.durationMinutes * 60;
    startTimer();
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        secondsLeft--;
        updateTimerDisplay();
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            submitExam(true); // auto-submit when time is up
        }
    }, 1000);
}

function updateTimerDisplay() {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const s = (secondsLeft % 60).toString().padStart(2, "0");
    document.getElementById("timerDisplay").textContent = `Time Left: ${m}:${s}`;
}

async function submitExam(autoSubmitted) {
    if (submitted) return;
    submitted = true;
    clearInterval(timerInterval);

    if (!autoSubmitted) {
        const confirmSubmit = confirm("Are you sure you want to submit the exam?");
        if (!confirmSubmit) {
            submitted = false;
            startTimer();
            return;
        }
    }

    const res = await fetch(`${API_BASE}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: user.id,
            examId: Number(examId),
            answers: answers
        })
    });

    const result = await res.json();
    alert(`Exam submitted!\nScore: ${result.score} / ${result.total}`);
    window.location.href = "student.html";
}

loadExam();
