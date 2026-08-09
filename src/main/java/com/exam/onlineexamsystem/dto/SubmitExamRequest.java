package com.exam.onlineexamsystem.dto;

import java.util.Map;

public class SubmitExamRequest {
    private Long userId;
    private Long examId;
    // key = questionId, value = selected option ("A"/"B"/"C"/"D")
    private Map<Long, String> answers;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }

    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}
