package com.exam.onlineexamsystem.controller;

import com.exam.onlineexamsystem.entity.Result;
import com.exam.onlineexamsystem.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    @Autowired
    private ResultRepository resultRepository;

    @GetMapping("/user/{userId}")
    public List<Result> getResultsByUser(@PathVariable Long userId) {
        return resultRepository.findByUserId(userId);
    }

    @GetMapping("/exam/{examId}")
    public List<Result> getResultsByExam(@PathVariable Long examId) {
        return resultRepository.findByExamId(examId);
    }

    @GetMapping
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }
}
