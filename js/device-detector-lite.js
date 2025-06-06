/**
 * 轻量级设备检测脚本
 * 只检测设备类型，不添加额外功能
 */

(function() {
  // 检测设备类型
  function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|tablet|Nexus 7|Nexus 10/i.test(navigator.userAgent) || 
                     (window.innerWidth >= 768 && window.innerWidth <= 1024);
    
    // 添加设备类型标识到HTML元素
    const htmlElement = document.documentElement;
    
    if (isMobile || (isTablet && window.innerWidth < 768)) {
      htmlElement.classList.add('mobile-device');
      
      // 触发移动设备事件，供其他脚本使用
      const event = new CustomEvent('mobileModeActivated');
      document.dispatchEvent(event);
    } else if (isTablet) {
      htmlElement.classList.add('tablet-device');
    } else {
      htmlElement.classList.add('desktop-device');
    }
  }
  
  // 页面加载时执行检测
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectDevice);
  } else {
    detectDevice();
  }
})(); 