# MVP Core - Proposal

## Why

验证 SpiceLab 核心产品假设：情侣愿意通过游戏互动增进感情。需要快速上线 MVP 版本，测试用户对真心话大冒险和飞行棋游戏的接受度，验证付费意愿。

## What Changes

- 新增网页版应用框架
- 新增房间系统（创建/加入/实时同步）
- 新增真心话大冒险游戏
- 新增飞行棋游戏（完整版）
- 新增基础题库（30-50 题）
- 新增骰子组件
- 新增大转盘组件

## Capabilities

### New Capabilities

- `room-system`: 房间创建、加入、实时同步、玩家管理
- `truth-or-dare`: 真心话大冒险游戏逻辑、轮流机制、题目展示
- `ludo-game`: 飞行棋游戏逻辑、棋盘、棋子移动、撞子、跳跃、飞行规则
- `question-bank`: 题库存储、分级、随机获取
- `dice-component`: 骰子掷动动画、随机数生成
- `wheel-component`: 大转盘旋转动画、随机选择

### Modified Capabilities

(无，新项目)

## Impact

- 新项目，无现有代码影响
- 技术栈：Spring Boot + React/Vue + MySQL
- 需要实现 WebSocket 实时通信
- 需要设计数据库表结构
