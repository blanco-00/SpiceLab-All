# Question Bank Specification

## Overview

题库系统管理所有真心话和大冒险题目，支持分级和随机获取。

## ADDED Requirements

### Requirement: Question Storage

系统应存储所有题目数据。

#### Scenario: Question data structure
- **WHEN** 存储题目
- **THEN** 包含以下字段：
  - id: 唯一标识
  - type: 真心话或大冒险
  - content: 题目内容
  - level: 难度等级 (1-6)
  - category: 分类标签
  - is_premium: 是否付费内容

### Requirement: Question Levels

系统应支持题目难度分级。

#### Scenario: Level 1-2 questions
- **WHEN** 请求等级 1-2 的题目
- **THEN** 返回轻松/入门级题目

#### Scenario: Level 3-4 questions
- **WHEN** 请求等级 3-4 的题目
- **THEN** 返回亲密/进阶级题目

#### Scenario: Level 5-6 questions
- **WHEN** 请求等级 5-6 的题目
- **THEN** 返回深入/火热级题目

### Requirement: Random Selection

系统应随机选择题目。

#### Scenario: Random question selection
- **WHEN** 请求随机题目
- **THEN** 系统从符合条件的题目中随机选择
- **THEN** 返回题目内容

### Requirement: No Repeat in Same Game

系统应避免在单局游戏中重复题目。

#### Scenario: Question already used in game
- **WHEN** 题目在本局游戏中已被使用
- **THEN** 系统从候选池中移除该题目
- **THEN** 从剩余题目中随机选择

### Requirement: Premium Questions

系统应区分免费和付费题目。

#### Scenario: Free user requests question
- **WHEN** 免费用户请求题目
- **THEN** 只返回 is_premium=false 的题目

#### Scenario: Premium user requests question
- **WHEN** 付费用户请求题目
- **THEN** 可返回所有题目（包括付费题目）

### Requirement: Question Categories

系统应支持题目分类。

#### Scenario: Filter by category
- **WHEN** 请求特定分类的题目
- **THEN** 只返回该分类的题目

### Requirement: Question Count

系统应支持统计题目数量。

#### Scenario: Count questions by type and level
- **WHEN** 查询题目数量
- **THEN** 返回各类型各等级的题目数量统计
