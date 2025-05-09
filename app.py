from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('index', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    # 尝试从不同目录提供静态文件
    for dir_name in ['', 'index', 'player', 'img', 'favicon', 'data', 'filmdata']:
        file_path = os.path.join(dir_name, path)
        if os.path.exists(file_path):
            return send_from_directory(dir_name, path)
    
    # 如果文件不存在，返回404页面
    return send_from_directory('', '404.html'), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5695)