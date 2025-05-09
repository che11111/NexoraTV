// 主题管理
const ThemeManager = {
    init() {
        // 从localStorage加载设置
        this.loadSettings();
        // 应用当前设置
        this.applyTheme();
        this.applyFontSize();
        // 设置事件监听
        this.setupEventListeners();
    },

    loadSettings() {
        const storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode !== null) {
            this.darkMode = storedDarkMode === 'true';
        } else {
            // 如果 localStorage 中没有设置，则回退到系统偏好
            // 确保 SystemThemeDetector 已加载
            if (typeof SystemThemeDetector !== 'undefined') {
                this.darkMode = SystemThemeDetector.isDarkMode();
            } else {
                console.error('SystemThemeDetector 未加载。请确保 theme-detect.js 在 theme.js 之前引入。');
                this.darkMode = false; // 默认回退到浅色模式
            }
        }
        this.fontSize = localStorage.getItem('fontSize') || 'medium';
    },

    saveSettings() {
        localStorage.setItem('darkMode', this.darkMode);
        localStorage.setItem('fontSize', this.fontSize);
    },

    applyTheme() {
        document.documentElement.setAttribute('data-theme', 
            this.darkMode ? 'dark' : 'light');
    },

    applyFontSize() {
        document.documentElement.style.setProperty('--font-size', 
            this.getFontSizeValue(this.fontSize));
    },

    getFontSizeValue(size) {
        const sizes = {
            'small': '14px',
            'medium': '16px',
            'large': '18px'
        };
        return sizes[size] || sizes.medium;
    },

    setupEventListeners() {
        // 深色模式切换
        const darkModeToggle = document.querySelector('.switch input[type="checkbox"]');
        if (darkModeToggle) {
            darkModeToggle.checked = this.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.darkMode = e.target.checked;
                this.saveSettings();
                this.applyTheme();
            });
        }

        // 字体大小选择
        const fontSizeSelect = document.querySelector('.font-select');
        if (fontSizeSelect) {
            fontSizeSelect.value = this.fontSize;
            fontSizeSelect.addEventListener('change', (e) => {
                this.fontSize = e.target.value;
                this.saveSettings();
                this.applyFontSize();
            });
        }
    }
};

// 模态框功能
function showModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.style.display = 'block';
        // 点击模态框外部关闭
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal(type);
            }
        }
    }
}

function closeModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 在DOM加载前设置主题,防止闪白或闪黑
(function() {
    // 确保 SystemThemeDetector 可用 (需要在此脚本之前加载 theme-detect.js)
    let darkMode;
    const storedDarkMode = localStorage.getItem('darkMode');

    if (storedDarkMode !== null) {
        // 如果 localStorage 中有设置，则使用该设置
        darkMode = storedDarkMode === 'true';
    } else if (typeof SystemThemeDetector !== 'undefined') {
        // 否则，如果检测器可用，则使用系统偏好
        darkMode = SystemThemeDetector.isDarkMode();
    } else {
        // 如果检测器不可用且没有存储设置，则默认为浅色模式
        console.error('SystemThemeDetector 未加载，无法检测系统主题。将使用默认主题（浅色）。');
        darkMode = false; 
    }

    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
})();

// 初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    
    // 初始化所有模态框为隐藏状态
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
});
