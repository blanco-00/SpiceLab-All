# Truth or Dare Specification

## Overview

真心话大冒险是 SpiceLab 的核心游戏之一，玩家轮流选择真心话或大冒险并完成相应任务。

## ADDED Requirements

### Requirement: Game Initialization

系统应正确初始化真心话大冒险游戏。

#### Scenario: Game starts with 2 players
- **WHEN** 主持人开始游戏
- **THEN** 系统随机选择先手玩家
- **THEN** 游戏进入"掷骰子"阶段
- **THEN** 显示当前玩家轮次

### Requirement: Dice Roll

系统应允许当前玩家掷骰子。

#### Scenario: Player rolls dice
- **WHEN** 当前玩家点击"掷骰子"
- **THEN** 系统生成 1-6 的随机数
- **THEN** 显示骰子动画
- **THEN** 游戏进入"选择"阶段

### Requirement: Choose Truth or Dare

系统应允许玩家选择真心话或大冒险。

#### Scenario: Player chooses truth
- **WHEN** 玩家点击"真心话"
- **THEN** 系统从题库随机选择一道真心话题目
- **THEN** 显示题目内容
- **THEN** 游戏进入"确认"阶段

#### Scenario: Player chooses dare
- **WHEN** 玩家点击"大冒险"
- **THEN** 系统从题库随机选择一道大冒险题目
- **THEN** 显示题目内容
- **THEN** 游戏进入"确认"阶段

### Requirement: Question Levels

系统应根据骰子点数选择不同难度的题目。

#### Scenario: Dice shows 1-2
- **WHEN** 骰子点数为 1 或 2
- **THEN** 系统选择难度等级 1 的题目（轻松）

#### Scenario: Dice shows 3-4
- **WHEN** 骰子点数为 3 或 4
- **THEN** 系统选择难度等级 2 的题目（亲密）

#### Scenario: Dice shows 5-6
- **WHEN** 骰子点数为 5 或 6
- **THEN** 系统选择难度等级 3 的题目（深入/火热）

### Requirement: Confirm Completion

系统应允许玩家确认任务完成。

#### Scenario: Player confirms completion
- **WHEN** 玩家点击"已完成"
- **THEN** 系统记录完成状态
- **THEN** 轮换到下一位玩家
- **THEN** 游戏进入"掷骰子"阶段

#### Scenario: Player skips task
- **WHEN** 玩家点击"跳过"
- **THEN** 系统记录跳过状态
- **THEN** 轮换到下一位玩家

### Requirement: Turn Rotation

系统应正确轮换玩家回合。

#### Scenario: Turn switches to next player
- **WHEN** 当前玩家完成或跳过任务
- **THEN** 系统切换到下一位玩家
- **THEN** 更新当前玩家指示
- **THEN** 游戏进入"掷骰子"阶段

### Requirement: Game End

系统应允许玩家结束游戏。

#### Scenario: Players agree to end game
- **WHEN** 主持人点击"结束游戏"
- **THEN** 游戏结束
- **THEN** 显示游戏统计（可选）
- **THEN** 返回房间页面
