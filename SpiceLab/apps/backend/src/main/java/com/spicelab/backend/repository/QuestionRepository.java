package com.spicelab.backend.repository;

import com.spicelab.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {
    List<Question> findByTypeAndIsActiveTrue(Question.QuestionType type);
    
    @Query("SELECT q FROM Question q WHERE q.type = :type AND q.isActive = true")
    List<Question> findAllByType(Question.QuestionType type);
    
    @Query("SELECT q FROM Question q WHERE q.type = :type AND q.level = :level AND q.isActive = true")
    List<Question> findAllByTypeAndLevel(Question.QuestionType type, int level);
}
