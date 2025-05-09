// 更新信息配置文件
const updateInfo = {
  version: "1.1.6",
  description: [
      "1. 新增更多视频源",
      "2. UI样式完善",
      "3. 修复iOS设备显示bug",
  ],
  downloadUrl: "https://nexoratv.trailw.com/download/NexoraTV-1.0.1.apk",
  releaseDate: "2025-05-06",
};

// 导出更新信息
if (typeof module !== 'undefined' && module.exports) {
  module.exports = updateInfo;
} else {
  window.updateInfo = updateInfo;
}
