# SpiceLab Frontend Dockerfile
# 多阶段构建：构建 + 运行

# ==================== 构建阶段 ====================
FROM --platform=linux/amd64 node:20-bookworm-slim AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY tsconfig*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# 安装依赖
RUN npm install

# 复制源代码
COPY src ./src
COPY public ./public

# 构建
RUN npm run build

# ==================== 运行阶段 ====================
FROM --platform=linux/amd64 nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
