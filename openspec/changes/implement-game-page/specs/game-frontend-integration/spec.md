# Game Frontend Integration Specification

## ADDED Requirements

### Requirement: Game Page Initialization

系统应在进入游戏页面时加载游戏状态。

#### Scenario: Load game state on page enter
- **WHEN** 用户进入 `/game/{roomCode}` 页面
- **THEN** 前端调用 `GET /api/games/{roomCode}/state`
- **THEN** 前端根据 gameType 渲染对应游戏组件

#### Scenario: Show loading state
- **WHEN** 游戏状态加载中
- **THEN** 前端显示 "加载中..." 提示

### Requirement: Render Truth or Dare Game

系统应正确渲染真心话大冒险游戏界面。

#### Scenario: Show waiting phase
- **WHEN** 游戏状态 phase=waiting 且是当前玩家回合
- **THEN** 前端显示骰子组件，可点击掷骰子
- **THEN** 前端显示 "轮到你了！点击掷骰子"

#### Scenario: Show selecting phase
- **WHEN** 游戏状态 phase=selecting
- **THEN** 前端显示骰子点数
- **THEN** 前端显示"选择真心话还是大冒险？"按钮
- **WHEN** 当前玩家是本人
- **THEN** 显示 "💬 真心话" 和 "🔥 大冒险" 两个按钮

#### Scenario: Show answering phase
- **WHEN** 游戏状态 phase=answering 且有 question
- **THEN** 前端显示题目类型标签 (真心话/大冒险)
- **THEN** 前端显示题目内容
- **WHEN** 当前玩家是本人
- **THEN** 前端显示 "✓ 完成了" 按钮

### Requirement: Handle User Actions

系统应正确处理用户游戏动作。

#### Scenario: Roll dice action
- **WHEN** 用户点击骰子
- **THEN** 前端调用 `POST /api/games/{roomCode}/action` 且 `action=roll`
- **THEN** 前端显示骰子滚动动画 (1秒)
- **THEN** 前端更新游戏状态

#### Scenario: Choose truth/dare action
- **WHEN** 用户点击 "真心话" 或 "大冒险"
- **THEN** 前端调用 `POST /api/games/{roomCode}/action` 且 `action=choose, choice=对应选择`
- **THEN** 前端更新游戏状态

#### Scenario: Complete action
- **WHEN** 用户点击 "完成了"
- **THEN** 前端调用 `POST /api/games/{roomCode}/action` 且 `action=complete`
- **THEN** 前端更新游戏状态，轮到下一位玩家

### Requirement: Poll for Updates

系统应定期轮询获取游戏状态更新。

#### Scenario: Poll game state every 3 seconds
- **WHEN** 用户在游戏页面
- **THEN** 前端每 3 秒调用 `GET /api/games/{roomCode}/state`
- **THEN** 前端更新显示的玩家回合、题目等状态
