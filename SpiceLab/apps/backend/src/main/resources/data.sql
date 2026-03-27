-- Seed data for Truth or Dare questions
-- Loaded automatically by Spring Boot on startup

INSERT INTO questions (id, type, content, level, is_active) VALUES
-- Level 1 (Easy) - Truth
(UUID(), 'TRUTH', '你最喜欢伴侣的哪一点？', 1, true),
(UUID(), 'TRUTH', '你第一次约会在哪里？', 1, true),
(UUID(), 'TRUTH', '你最浪漫的记忆是什么？', 1, true),
(UUID(), 'TRUTH', '你最喜欢的约会活动是什么？', 1, true),
(UUID(), 'TRUTH', '你什么时候第一次意识到喜欢对方？', 1, true),
(UUID(), 'TRUTH', '你最喜欢和伴侣一起做什么？', 1, true),
(UUID(), 'TRUTH', '你最想和伴侣一起去哪里旅行？', 1, true),
(UUID(), 'TRUTH', '你最喜欢的亲密时刻是什么？', 1, true),

-- Level 1 (Easy) - Dare
(UUID(), 'DARE', '给伴侣一个甜蜜的吻', 1, true),
(UUID(), 'DARE', '说一件你做过的最浪漫的事', 1, true),
(UUID(), 'DARE', '给伴侣一个大大的拥抱并说"我爱你"', 1, true),
(UUID(), 'DARE', '用手比心发送给伴侣', 1, true),
(UUID(), 'DARE', '说一句让伴侣脸红的情话', 1, true),
(UUID(), 'DARE', '模仿伴侣最可爱的表情', 1, true),
(UUID(), 'DARE', '做一个夸张的求婚姿势', 1, true),
(UUID(), 'DARE', '用三个词形容你的伴侣', 1, true),

-- Level 2 (Medium) - Truth
(UUID(), 'TRUTH', '你有没有偷偷嫉妒过伴侣的朋友？', 2, true),
(UUID(), 'TRUTH', '你曾经对伴侣说过最大的谎言是什么？', 2, true),
(UUID(), 'TRUTH', '如果可以，你想和伴侣交换身份一天吗？', 2, true),
(UUID(), 'TRUTH', '你最尴尬的一次约会经历是什么？', 2, true),
(UUID(), 'TRUTH', '你有没有偷偷查看过伴侣的手机？', 2, true),
(UUID(), 'TRUTH', '你最不喜欢伴侣的习惯是什么？', 2, true),
(UUID(), 'TRUTH', '如果只能选一个，你会选颜值还是性格？', 2, true),
(UUID(), 'TRUTH', '你曾经因为伴侣说过什么话而感动落泪？', 2, true),

-- Level 2 (Medium) - Dare
(UUID(), 'DARE', '让伴侣在你脸上画一个表情', 2, true),
(UUID(), 'DARE', '用撒娇的声音说"亲爱的"', 2, true),
(UUID(), 'DARE', '发一条甜蜜消息给伴侣，不许删改直接发', 2, true),
(UUID(), 'DARE', '模仿伴侣走路的样子', 2, true),
(UUID(), 'DARE', '给伴侣做一个按摩，持续30秒', 2, true),
(UUID(), 'DARE', '说一件你觉得自己做得不够好的事', 2, true),
(UUID(), 'DARE', '让伴侣在你手心写一个词', 2, true),
(UUID(), 'DARE', '用别扭的姿势拍一张自拍', 2, true),

-- Level 3 (Hot) - Truth
(UUID(), 'TRUTH', '你觉得伴侣最吸引你的身体部位是哪里？', 3, true),
(UUID(), 'TRUTH', '你曾经幻想过和伴侣做什么？', 3, true),
(UUID(), 'TRUTH', '你认为完美的亲密时刻是什么样的？', 3, true),
(UUID(), 'TRUTH', '你最想尝试但还没做过的事是什么？', 3, true),
(UUID(), 'TRUTH', '你觉得情侣之间最重要的信任是什么？', 3, true),
(UUID(), 'TRUTH', '你曾经对伴侣有过什么特别的小心思？', 3, true),
(UUID(), 'TRUTH', '你最想和伴侣一起尝试什么新鲜事？', 3, true),
(UUID(), 'TRUTH', '你认为维持长久关系最重要的是什么？', 3, true),

-- Level 3 (Hot) - Dare
(UUID(), 'DARE', '给伴侣一个意味深长的眼神', 3, true),
(UUID(), 'DARE', '慢慢靠近伴侣的脸，保持3秒', 3, true),
(UUID(), 'DARE', '对伴侣说一件你最想一起尝试的事', 3, true),
(UUID(), 'DARE', '用嘴撕开伴侣手中零食的包装', 3, true),
(UUID(), 'DARE', '说一句让伴侣心跳加速的话', 3, true),
(UUID(), 'DARE', '轻吻伴侣的手背', 3, true),
(UUID(), 'DARE', '抱住伴侣，保持10秒不说话', 3, true),
(UUID(), 'DARE', '看着伴侣的眼睛说"你真好看"', 3, true);
