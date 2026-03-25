# Room System Specification

## Overview

房间系统是 SpiceLab 的核心功能，支持创建、加入和管理游戏房间。

## ADDED Requirements

### Requirement: Create Room

系统应允许用户创建新的游戏房间。

#### Scenario: User creates a new room
- **WHEN** 用户点击"创建房间"按钮
- **THEN** 系统生成唯一的 6 位房间码
- **THEN** 系统创建房间记录
- **THEN** 用户成为房间主持人
- **THEN** 返回房间信息和分享链接

### Requirement: Join Room

系统应允许用户通过房间码加入现有房间。

#### Scenario: User joins with valid room code
- **WHEN** 用户输入有效的房间码
- **THEN** 系统验证房间存在
- **THEN** 系统验证房间未满
- **THEN** 用户加入房间
- **THEN** 通知房间内其他玩家

#### Scenario: User joins with invalid room code
- **WHEN** 用户输入无效的房间码
- **THEN** 系统返回"房间不存在"错误

#### Scenario: Room is full
- **WHEN** 房间已达到最大玩家数
- **THEN** 系统返回"房间已满"错误

### Requirement: Real-time Sync

系统应实时同步房间状态给所有玩家。

#### Scenario: Player joins room
- **WHEN** 新玩家加入房间
- **THEN** 所有在线玩家收到玩家加入通知
- **THEN** 所有在线玩家看到更新后的玩家列表

#### Scenario: Player leaves room
- **WHEN** 玩家离开房间
- **THEN** 所有在线玩家收到玩家离开通知
- **THEN** 所有在线玩家看到更新后的玩家列表

### Requirement: Room Expiration

系统应自动清理过期房间。

#### Scenario: Room expires after 24 hours of inactivity
- **WHEN** 房间 24 小时内无任何活动
- **THEN** 系统标记房间为已过期
- **THEN** 系统清理房间数据

### Requirement: Host Privileges

系统应赋予房间主持人特定权限。

#### Scenario: Host can start game
- **WHEN** 房间内有至少 2 名玩家
- **AND** 主持人点击"开始游戏"
- **THEN** 游戏开始

#### Scenario: Non-host cannot start game
- **WHEN** 非主持人点击"开始游戏"
- **THEN** 系统提示"只有主持人可以开始游戏"
