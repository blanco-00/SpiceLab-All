# SpiceLab Backend Dockerfile
# 多阶段构建：构建 + 运行

# ==================== 构建阶段 ====================
FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app

# 安装 Maven
RUN apt-get update && apt-get install -y wget && \
    wget https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz -O /tmp/maven.tar.gz && \
    tar -xzf /tmp/maven.tar.gz -C /opt && \
    ln -s /opt/apache-maven-3.9.6/bin/mvn /usr/bin/mvn && \
    rm /tmp/maven.tar.gz && \
    apt-get clean

# 复制项目文件
COPY pom.xml .
COPY src ./src

# 构建（跳过测试）
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# ==================== 运行阶段 ====================
FROM eclipse-temurin:17-jre

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 启动脚本 - 等待 MySQL 就绪
COPY <<'EOF' /startup.sh
#!/bin/bash
echo "Waiting for MySQL at mysql:3306..."
max_attempts=60
attempt=1
while [ $attempt -le $max_attempts ]; do
  if timeout 1 bash -c "cat < /dev/null > /dev/tcp/mysql/3306" 2>/dev/null; then
    echo "Port open, waiting for MySQL to initialize..."
    sleep 10
    echo "MySQL is ready!"
    exec java -jar app.jar
    exit $?
  fi
  echo "Attempt $attempt/$max_attempts - waiting..."
  sleep 2
  attempt=$((attempt + 1))
done
echo "Timeout waiting for MySQL"
exit 1
EOF
RUN chmod +x /startup.sh

ENTRYPOINT ["/startup.sh"]
