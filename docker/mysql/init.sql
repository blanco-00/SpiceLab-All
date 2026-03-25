-- SpiceLab Database Initialization
-- 创建数据库
CREATE DATABASE IF NOT EXISTS spicelab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE spicelab;

-- 房间表
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(6) UNIQUE NOT NULL,
    status ENUM('WAITING', 'PLAYING', 'FINISHED') DEFAULT 'WAITING',
    game_type VARCHAR(20),
    current_state JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 玩家表
CREATE TABLE IF NOT EXISTS players (
    id VARCHAR(36) PRIMARY KEY,
    room_id VARCHAR(36) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    is_host BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_room (room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 题目表
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(36) PRIMARY KEY,
    type ENUM('truth', 'dare') NOT NULL,
    content TEXT NOT NULL,
    level INT DEFAULT 1,
    category VARCHAR(50),
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type_level (type, level),
    INDEX idx_premium (is_premium)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 游戏记录表 (可选)
CREATE TABLE IF NOT EXISTS game_records (
    id VARCHAR(36) PRIMARY KEY,
    room_id VARCHAR(36),
    game_type VARCHAR(20),
    player_count INT,
    duration_seconds INT,
    actions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入基础题目数据
INSERT INTO questions (id, type, content, level, category, is_premium) VALUES
-- 真心话 - 等级 1 (轻松)
(UUID(), 'truth', '你最喜欢对方什么？', 1, 'couple', FALSE),
(UUID(), 'truth', '你是什么时候开始喜欢我的？', 1, 'couple', FALSE),
(UUID(), 'truth', '你最喜欢和我一起做什么？', 1, 'couple', FALSE),
(UUID(), 'truth', '你觉得我最大的优点是什么？', 1, 'couple', FALSE),
(UUID(), 'truth', '你最近一次哭是什么时候？', 1, 'personal', FALSE),

-- 真心话 - 等级 2 (亲密)
(UUID(), 'truth', '你有什么小秘密没告诉过我？', 2, 'couple', FALSE),
(UUID(), 'truth', '你对我们的未来有什么期待？', 2, 'couple', FALSE),
(UUID(), 'truth', '你最想和我去哪里旅行？', 2, 'couple', FALSE),
(UUID(), 'truth', '你觉得我们之间最浪漫的时刻是什么？', 2, 'couple', FALSE),
(UUID(), 'truth', '你最近做过最开心的梦是什么？', 2, 'personal', FALSE),

-- 真心话 - 等级 3 (深入)
(UUID(), 'truth', '你最害怕失去什么？', 3, 'personal', FALSE),
(UUID(), 'truth', '你有什么愿望一直没实现？', 3, 'personal', FALSE),
(UUID(), 'truth', '你觉得我还需要改进什么？', 3, 'couple', FALSE),
(UUID(), 'truth', '你最想和对方尝试的浪漫场景是什么？', 3, 'couple', FALSE),
(UUID(), 'truth', '你小时候最难忘的回忆是什么？', 3, 'personal', FALSE),

-- 大冒险 - 等级 1 (轻松)
(UUID(), 'dare', '对对方说三句甜言蜜语', 1, 'couple', FALSE),
(UUID(), 'dare', '给对方一个拥抱，持续 10 秒', 1, 'couple', FALSE),
(UUID(), 'dare', '模仿一个动物叫', 1, 'funny', FALSE),
(UUID(), 'dare', '做一个鬼脸并拍照', 1, 'funny', FALSE),
(UUID(), 'dare', '唱一首歌的副歌部分', 1, 'funny', FALSE),

-- 大冒险 - 等级 2 (亲密)
(UUID(), 'dare', '深情注视对方 30 秒', 2, 'couple', FALSE),
(UUID(), 'dare', '给对方按摩 1 分钟', 2, 'couple', FALSE),
(UUID(), 'dare', '为对方编一首小诗', 2, 'creative', FALSE),
(UUID(), 'dare', '用 5 个词形容我们的关系', 2, 'couple', FALSE),
(UUID(), 'dare', '模仿对方的一个习惯动作', 2, 'funny', FALSE),

-- 大冒险 - 等级 3 (火热)
(UUID(), 'dare', '喂对方吃一口东西', 3, 'couple', FALSE),
(UUID(), 'dare', '给对方一个惊喜的亲吻', 3, 'couple', FALSE),
(UUID(), 'dare', '说出对方的 10 个优点', 3, 'couple', FALSE),
(UUID(), 'dare', '为对方做一件事（对方指定）', 3, 'couple', FALSE),
(UUID(), 'dare', '用最浪漫的方式说"我爱你"', 3, 'couple', FALSE);
