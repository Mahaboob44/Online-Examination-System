package com.exam.onlineexamsystem.controller;

import com.exam.onlineexamsystem.entity.Exam;
import com.exam.onlineexamsystem.entity.Question;
import com.exam.onlineexamsystem.repository.ExamRepository;
import com.exam.onlineexamsystem.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    // List all exams (for students to pick from, and admin to manage)
    @GetMapping
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    // Get a single exam with its questions (correct answers stripped for students)
    @GetMapping("/{id}")
    public ResponseEntity<?> getExam(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean includeAnswers) {
        return examRepository.findById(id)
                .<ResponseEntity<?>>map(exam -> {
                    List<Question> questions = questionRepository.findByExamId(id);
                    if (!includeAnswers) {
                        questions.forEach(q -> q.setCorrectOption(null));
                    }
                    return ResponseEntity.ok(Map.of(
                            "exam", exam,
                            "questions", questions
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: create exam
    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        return examRepository.save(exam);
    }

    // Admin: delete exam
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        examRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Exam deleted"));
    }

    // Admin: add a question to an exam
    @PostMapping("/{examId}/questions")
    public ResponseEntity<?> addQuestion(@PathVariable Long examId, @RequestBody Question question) {
        return examRepository.findById(examId)
                .<ResponseEntity<?>>map(exam -> {
                    question.setExam(exam);
                    Question saved = questionRepository.save(question);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: delete a question
    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        questionRepository.deleteById(questionId);
        return ResponseEntity.ok(Map.of("message", "Question deleted"));
    }
}
