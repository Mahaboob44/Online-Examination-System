package com.exam.onlineexamsystem.controller;

import com.exam.onlineexamsystem.dto.SubmitExamRequest;
import com.exam.onlineexamsystem.entity.*;
import com.exam.onlineexamsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submit")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired private UserRepository userRepository;
    @Autowired private ExamRepository examRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private ResultRepository resultRepository;

    @PostMapping
    public ResponseEntity<?> submitExam(@RequestBody SubmitExamRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElse(null);
        Exam exam = examRepository.findById(request.getExamId())
                .orElse(null);

        if (user == null || exam == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user or exam"));
        }

        List<Question> questions = questionRepository.findByExamId(exam.getId());
        int score = 0;

        for (Question q : questions) {
            String submitted = request.getAnswers() != null ? request.getAnswers().get(q.getId()) : null;
            if (submitted != null && submitted.equalsIgnoreCase(q.getCorrectOption())) {
                score++;
            }
        }

        Result result = new Result(user, exam, score, questions.size());
        Result saved = resultRepository.save(result);

        return ResponseEntity.ok(Map.of(
                "score", score,
                "total", questions.size(),
                "resultId", saved.getId()
        ));
    }
}
