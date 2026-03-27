# Game Controller API Specification

## ADDED Requirements

### Requirement: Start Game

系统应允许主持人开始游戏。

#### Scenario: Host starts Truth or Dare game
- **WHEN** 主持人调用 `POST /api/games/start` 且 `gameType=TRUTH_OR_DARE`
- **THEN** 系统验证房间存在且有至少 2 名玩家
- **THEN** 系统随机选择先手玩家
- **THEN** 系统创建游戏记录 (status=PLAYING)
- **THEN** 系统返回完整游戏状态

#### Scenario: Non-host attempts to start game
- **WHEN** 非主持人调用 `POST /api/games/start`
- **THEN** 系统返回 403 Forbidden

### Requirement: Perform Game Action

系统应处理玩家游戏动作。

#### Scenario: Player rolls dice
- **WHEN** 当前玩家调用 `POST /api/games/{roomCode}/action` 且 `action=roll`
- **THEN** 系统验证玩家是当前回合
- **THEN** 系统生成 1-6 随机数
- **THEN** 系统更新游戏状态 (phase=selecting)
- **THEN** 系统返回更新后的游戏状态

#### Scenario: Player chooses truth
- **WHEN** 当前玩家调用 `POST /api/games/{roomCode}/action` 且 `action=choose, choice=truth`
- **THEN** 系统根据骰子值选择题目等级 (1-2→等级1, 3-4→等级2, 5-6→等级3)
- **THEN** 系统从题库随机获取一道真心话题目
- **THEN** 系统更新游戏状态 (phase=answering, question=选中题目)
- **THEN** 系统返回更新后的游戏状态

#### Scenario: Player chooses dare
- **WHEN** 当前玩家调用 `POST /api/games/{roomCode}/action` 且 `action=choose, choice=dare`
- **THEN** 系统根据骰子值选择题目等级
- **THEN** 系统从题库随机获取一道大冒险题目
- **THEN** 系统更新游戏状态 (phase=answering, question=选中题目)
- **THEN** 系统返回更新后的游戏状态

#### Scenario: Player completes turn
- **WHEN** 当前玩家调用 `POST /api/games/{roomCode}/action` 且 `action=complete`
- **THEN** 系统切换到下一位玩家
- **THEN** 系统更新游戏状态 (phase=waiting, currentTurn=下一玩家)
- **THEN** 系统返回更新后的游戏状态

### Requirement: Get Game State

系统应提供获取当前游戏状态的接口。

#### Scenario: Get current game state
- **WHEN** 任意玩家调用 `GET /api/games/{roomCode}/state`
- **THEN** 系统返回当前游戏状态

#### Scenario: Game not started
- **WHEN** 调用 `GET /api/games/{roomCode}/state` 但游戏未开始
- **THEN** 系统返回 404 Not Found
