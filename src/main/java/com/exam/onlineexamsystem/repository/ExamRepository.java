package com.exam.onlineexamsystem.repository;

import com.exam.onlineexamsystem.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Long> {
}
