# Ludo Game Specification

## Overview

飞行棋是 SpiceLab 的核心游戏之一，支持 2 人对战的经典飞行棋规则。

## ADDED Requirements

### Requirement: Game Initialization

系统应正确初始化飞行棋游戏。

#### Scenario: Game starts with 2 players
- **WHEN** 主持人开始飞行棋游戏
- **THEN** 每位玩家获得 4 个棋子
- **THEN** 所有棋子放置在各自基地
- **THEN** 系统随机选择先手玩家
- **THEN** 游戏进入"掷骰子"阶段

### Requirement: Take Off

系统应要求玩家掷出 6 点才能起飞棋子。

#### Scenario: Player rolls 6 with pieces in base
- **WHEN** 玩家掷出 6 点
- **AND** 基地内有棋子
- **THEN** 玩家可选择起飞一个棋子
- **THEN** 棋子移动到起点位置
- **THEN** 玩家可再掷一次

#### Scenario: Player rolls non-6 with no pieces on board
- **WHEN** 玩家掷出 1-5 点
- **AND** 基地内所有棋子都未起飞
- **THEN** 回合结束
- **THEN** 轮换到下一位玩家

### Requirement: Move Pieces

系统应允许玩家移动场上的棋子。

#### Scenario: Player moves piece
- **WHEN** 玩家掷出 1-6 点
- **AND** 场上有己方棋子
- **THEN** 玩家选择移动哪个棋子
- **THEN** 棋子向前移动对应步数

### Requirement: Roll Again on Six

系统应允许掷出 6 点后再掷一次。

#### Scenario: Player rolls 6
- **WHEN** 玩家掷出 6 点
- **THEN** 玩家完成当前操作后
- **THEN** 可再掷一次骰子

#### Scenario: Player rolls 6 three times consecutively
- **WHEN** 玩家连续掷出 3 次 6 点
- **THEN** 最后一个移动的棋子返回基地

### Requirement: Capture Opponent

系统应支持撞子规则。

#### Scenario: Player lands on opponent's piece
- **WHEN** 玩家棋子落在对方棋子位置
- **THEN** 对方棋子被打回基地
- **THEN** 玩家可再掷一次

### Requirement: Jump on Same Color

系统应支持跳跃规则。

#### Scenario: Player lands on same color square
- **WHEN** 玩家棋子落在己方颜色格子
- **THEN** 棋子可跳跃到下一个同色格子
- **THEN** 跳跃算作额外移动

### Requirement: Fly on Flying Point

系统应支持飞行规则。

#### Scenario: Player lands on flying point
- **WHEN** 玩家棋子落在飞行点
- **THEN** 棋子可直接飞到对角位置
- **THEN** 飞行后检查是否触发其他规则

### Requirement: Enter Home Stretch

系统应支持进入终点通道。

#### Scenario: Piece completes outer loop
- **WHEN** 玩家棋子完成外圈路径
- **THEN** 棋子进入己方终点通道

### Requirement: Reach Finish

系统应支持到达终点。

#### Scenario: Piece reaches finish with exact roll
- **WHEN** 玩家掷出精确到达终点的点数
- **THEN** 棋子到达终点
- **THEN** 该棋子不再参与游戏

#### Scenario: Roll exceeds remaining steps
- **WHEN** 玩家掷出超过剩余步数的点数
- **THEN** 棋子原地不动或后退（根据规则配置）

### Requirement: Win Condition

系统应正确判定胜负。

#### Scenario: Player gets all 4 pieces to finish
- **WHEN** 玩家所有 4 个棋子都到达终点
- **THEN** 该玩家获胜
- **THEN** 游戏结束
- **THEN** 显示胜负结果

### Requirement: Turn Timeout

系统应处理玩家超时。

#### Scenario: Player does not act within time limit
- **WHEN** 玩家在规定时间内未操作
- **THEN** 系统自动执行默认操作（如自动选择棋子移动）
- **THEN** 轮换到下一位玩家
