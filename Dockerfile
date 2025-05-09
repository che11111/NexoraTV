# 官方Python基础镜像
FROM python:3.9-slim

# 工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装Flask和依赖
RUN pip install flask gunicorn

# 暴露端口
EXPOSE 5695

# 启动命令
CMD ["gunicorn", "-b", "0.0.0.0:5695", "app:app"]