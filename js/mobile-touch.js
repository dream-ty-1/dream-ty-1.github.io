/**
 * 移动端触摸反馈效果
 * 为移动设备添加触摸反馈，提升用户体验
 */

document.addEventListener('DOMContentLoaded', function() {
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 为所有可点击元素添加触摸反馈效果
    addTouchFeedback('a');
    addTouchFeedback('button');
    addTouchFeedback('.post');
    addTouchFeedback('.category-item');
    addTouchFeedback('.tag');
    addTouchFeedback('.page-num');
    
    // 为文章卡片添加特殊效果
    const postItems = document.querySelectorAll('.post');
    postItems.forEach(item => {
      item.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
        this.style.opacity = '0.9';
      }, { passive: true });
      
      item.addEventListener('touchend', function() {
        this.style.transform = '';
        this.style.opacity = '';
      }, { passive: true });
    });
    
    // 禁用一些悬停效果
    disableHoverEffects();
  }
  
  // 处理移动端侧边栏折叠
  setupSidebarToggle();
});

/**
 * 为元素添加触摸反馈
 * @param {string} selector - CSS选择器
 */
function addTouchFeedback(selector) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(el => {
    el.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    }, { passive: true });
    
    el.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    }, { passive: true });
    
    el.addEventListener('touchcancel', function() {
      this.classList.remove('touch-active');
    }, { passive: true });
  });
}

/**
 * 为移动设备禁用某些悬停效果
 */
function disableHoverEffects() {
  // 添加移动端类标识
  document.body.classList.add('mobile-device');
  
  // 监听窗口大小变化，动态调整
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      document.body.classList.add('mobile-device');
    } else {
      document.body.classList.remove('mobile-device');
    }
  }, { passive: true });
}

/**
 * 设置侧边栏折叠功能
 */
function setupSidebarToggle() {
  // 仅在小屏幕下添加侧边栏折叠功能
  if (window.innerWidth <= 768) {
    const sidebarBoxes = document.querySelectorAll('.sidebar-box');
    
    sidebarBoxes.forEach(box => {
      const title = box.querySelector('.sidebar-title');
      const content = box.querySelector('.sidebar-content');
      
      if (title && content) {
        // 默认折叠除第一个之外的所有侧边栏盒子
        if (box !== sidebarBoxes[0]) {
          content.style.display = 'none';
        }
        
        // 添加折叠图标
        const toggleIcon = document.createElement('i');
        toggleIcon.className = 'fa-solid fa-chevron-down';
        toggleIcon.style.marginLeft = 'auto';
        title.appendChild(toggleIcon);
        
        // 添加点击事件
        title.style.cursor = 'pointer';
        title.addEventListener('click', function() {
          if (content.style.display === 'none') {
            content.style.display = 'block';
            toggleIcon.className = 'fa-solid fa-chevron-up';
          } else {
            content.style.display = 'none';
            toggleIcon.className = 'fa-solid fa-chevron-down';
          }
        });
      }
    });
  }
} 