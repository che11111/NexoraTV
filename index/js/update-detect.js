// 更新检测功能
document.addEventListener('DOMContentLoaded', function() {
    const updateSection = document.getElementById('update-section');
    if (!updateSection) return;

    // 当前版本号（从settings.html中获取）
    const versionItem = Array.from(document.querySelectorAll('.setting-item'))
                      .find(item => item.querySelector('label').textContent.includes('版本'));
    const currentVersion = versionItem.querySelector('.setting-value').textContent.trim();
    
    // 创建更新检测UI
    updateSection.innerHTML = `
        <div class="settings-group">
            <h2 class="settings-title">更新检测</h2>
            <div id="update-status" class="setting-item">
                <label>检查更新中...</label>
            </div>
        </div>
    `;

    // 检查更新
    checkForUpdates(currentVersion);
});

async function checkForUpdates(currentVersion) {
    const updateStatus = document.getElementById('update-status');
    
    try {
        // 动态加载远程update.js（添加时间戳防止缓存）
        const script = document.createElement('script');
        script.src = './filmdata/update/update-desktop.js?t=' + Date.now();
        document.head.appendChild(script);
        
        // 等待远程脚本加载
        script.onload = function() {
            if (!window.updateInfo) {
                updateStatus.innerHTML = '<label>更新检查失败</label><span class="setting-value">无法获取更新信息</span>';
                return;
            }

            const latestVersion = window.updateInfo.version;
            console.log('当前版本:', currentVersion, '最新版本:', latestVersion);
            const versionComparison = compareVersions(latestVersion, currentVersion);
            console.log('比较结果:', versionComparison);
            
            if (versionComparison > 0) {
                // 有新版本可用
                const updateItems = window.updateInfo.description.map(item => `• ${item}`).join('<br>');
                updateStatus.innerHTML = `
                    <label>有新版本可用</label>
                    <div class="update-details">
                        <p><strong>最新版本:</strong> ${latestVersion}</p>
                        <p><strong>更新内容:</strong><br>${updateItems}</p>
                        <button id="update-btn" class="btn-primary">立即更新</button>
                    </div>
                `;
                
                document.getElementById('update-btn').addEventListener('click', function() {
                    window.open(window.updateInfo.downloadUrl, '_blank');
                });
            } else {
                updateStatus.innerHTML = '<label>当前已是最新版本</label>';
            }
        };
        
        script.onerror = function() {
            updateStatus.innerHTML = '<label>更新检查失败</label><span class="setting-value">无法连接更新服务器</span>';
        };
    } catch (error) {
        updateStatus.innerHTML = '<label>更新检查失败</label><span class="setting-value">发生错误</span>';
        console.error('更新检查错误:', error);
    }
}

// 版本号比较函数（将版本号转换为数字比较，如1.1.0→110）
function compareVersions(v1, v2) {
    const toNumber = (version) => {
        const parts = version.split('.');
        let num = 0;
        // 每部分权重：第一位*100，第二位*10，第三位*1
        for (let i = 0; i < Math.min(parts.length, 3); i++) {
            num += Number(parts[i]) * Math.pow(10, 2 - i);
        }
        return num;
    };
    
    const num1 = toNumber(v1);
    const num2 = toNumber(v2);
    
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
    return 0;
}
