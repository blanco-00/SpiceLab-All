# SpiceLab / 暧昧实验室

> 私密情侣互动游戏平台

## 特性

- 多种游戏模式：飞行棋、大转盘、真心话大冒险
- 双模式切换：基础版（随机）+ 高级版（自定义）
- 隐私优先：支持自部署，数据在自己手里

## 项目结构

```
SpiceLab-All/
├── SpiceLab/              # 开源部分 (MIT)
│   ├── packages/
│   │   ├── core/          # 游戏核心引擎
│   │   ├── ui/            # UI 组件库
│   │   └── templates/     # 题库格式定义
│   └── apps/
│       └── web/           # Web 应用
│
├── SpiceLab-Private/      # 私有部分 (不开源)
│   ├── packages/
│   │   ├── official-content/   # 官方付费题库
│   │   └── cloud-service/      # 云服务后端
│   └── apps/
│       └── admin/              # 管理后台
│
├── openspec/              # OpenSpec 变更管理
└── scripts/               # 工具脚本
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务
pnpm dev
```

## 开源协议

- SpiceLab: MIT
- SpiceLab-Private: 私有，不开源
