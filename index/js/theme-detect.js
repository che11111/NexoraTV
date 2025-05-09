// 系统主题检测
const SystemThemeDetector = {
    isDarkMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        return false;
    },

    getPreferredTheme() {
        return this.isDarkMode() ? 'dark' : 'light';
    }
};