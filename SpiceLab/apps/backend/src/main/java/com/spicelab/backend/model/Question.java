package com.spicelab.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false)
    private int level;
    
    @Column(nullable = false)
    private boolean isActive;
    
    public Question() {}
    
    public Question(String id, QuestionType type, String content, int level, boolean isActive) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.level = level;
        this.isActive = isActive;
    }
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public QuestionType getType() { return type; }
    public void setType(QuestionType type) { this.type = type; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    
    public enum QuestionType {
        TRUTH,
        DARE
    }
    
    public static QuestionBuilder builder() { return new QuestionBuilder(); }
    
    public static class QuestionBuilder {
        private String id;
        private QuestionType type;
        private String content;
        private int level;
        private boolean isActive = true;
        
        public QuestionBuilder id(String id) { this.id = id; return this; }
        public QuestionBuilder type(QuestionType type) { this.type = type; return this; }
        public QuestionBuilder content(String content) { this.content = content; return this; }
        public QuestionBuilder level(int level) { this.level = level; return this; }
        public QuestionBuilder isActive(boolean isActive) { this.isActive = isActive; return this; }
        
        public Question build() { return new Question(id, type, content, level, isActive); }
    }
}
