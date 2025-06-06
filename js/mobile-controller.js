/**
 * 移动端控制器
 * 处理移动端特殊交互行为
 */

(function() {
  // 仅在移动端模式激活时运行
  document.addEventListener('mobileModeActivated', function(event) {
    const deviceInfo = event.detail;
    console.log('移动端模式已激活', deviceInfo);
    
    // 初始化移动端导航
    initMobileNavigation();
    
    // 初始化侧边栏折叠
    initSidebarCollapse();
    
    // 初始化触摸交互
    initTouchInteractions();
    
    // 初始化移动端图片查看器
    initMobileImageViewer();
    
    // 为长页面添加返回顶部按钮
    addBackToTopButton();
  });
  
  /**
   * 初始化移动端底部导航
   */
  function initMobileNavigation() {
    // 创建底部导航元素
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    
    // 添加导航链接
    const navItems = [
      { icon: 'fa-solid fa-home', text: '首页', link: '/' },
      { icon: 'fa-solid fa-list', text: '文章', link: '/archives/' },
      { icon: 'fa-solid fa-tags', text: '标签', link: '/tags/' },
      { icon: 'fa-solid fa-user', text: '关于', link: '/about/' }
    ];
    
    // 获取当前路径，用于高亮当前菜单项
    const currentPath = window.location.pathname;
    
    // 生成导航菜单
    navItems.forEach(item => {
      const link = document.createElement('a');
      link.href = item.link;
      link.innerHTML = `<i class="${item.icon}"></i><span>${item.text}</span>`;
      
      // 检查是否为当前页面
      if (currentPath === item.link || 
          (currentPath !== '/' && item.link !== '/' && currentPath.startsWith(item.link))) {
        link.classList.add('active');
      }
      
      mobileNav.appendChild(link);
    });
    
    // 添加到页面
    document.body.appendChild(mobileNav);
  }
  
  /**
   * 初始化侧边栏折叠功能
   */
  function initSidebarCollapse() {
    // 获取所有侧边栏盒子
    const sidebarBoxes = document.querySelectorAll('.sidebar-box');
    
    if (sidebarBoxes.length === 0) return;
    
    sidebarBoxes.forEach((box, index) => {
      const title = box.querySelector('.sidebar-title');
      const content = box.querySelector('.sidebar-content');
      
      if (title && content) {
        // 默认折叠除第一个之外的所有侧边栏盒子
        if (index > 0) {
          content.style.display = 'none';
        }
        
        // 添加折叠指示图标
        const toggleIcon = document.createElement('i');
        toggleIcon.className = index > 0 ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';
        toggleIcon.style.marginLeft = 'auto';
        title.appendChild(toggleIcon);
        
        // 添加点击事件
        title.style.cursor = 'pointer';
        title.addEventListener('click', function() {
          if (content.style.display === 'none') {
            // 展开
            content.style.display = 'block';
            toggleIcon.className = 'fa-solid fa-chevron-up';
          } else {
            // 折叠
            content.style.display = 'none';
            toggleIcon.className = 'fa-solid fa-chevron-down';
          }
        });
      }
    });
  }
  
  /**
   * 初始化触摸交互
   */
  function initTouchInteractions() {
    // 获取所有可点击元素
    const clickableElements = document.querySelectorAll('a, button, .post, .category-item, .tag');
    
    // 添加触摸反馈
    clickableElements.forEach(element => {
      // 触摸开始
      element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });
      
      // 触摸结束
      element.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
      
      // 触摸取消
      element.addEventListener('touchcancel', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
    });
    
    // 在文章页面添加滑动导航
    if (document.querySelector('.article')) {
      let touchStartX = 0;
      let touchEndX = 0;
      
      document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
      }, { passive: true });
      
      function handleSwipeGesture() {
        // 检测水平滑动
        const swipeThreshold = 100; // 滑动阈值
        const swipeDistance = touchEndX - touchStartX;
        
        // 检查是否在文章页，且有前后文章链接
        const prevLink = document.querySelector('.article-nav-prev a');
        const nextLink = document.querySelector('.article-nav-next a');
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
          if (swipeDistance > 0 && prevLink) {
            // 右滑 -> 前一篇文章
            window.location.href = prevLink.href;
          } else if (swipeDistance < 0 && nextLink) {
            // 左滑 -> 后一篇文章
            window.location.href = nextLink.href;
          }
        }
      }
    }
  }
  
  /**
   * 初始化移动端图片查看器
   */
  function initMobileImageViewer() {
    // 获取文章内所有图片
    const contentImages = document.querySelectorAll('.article .content img');
    
    if (contentImages.length === 0) return;
    
    contentImages.forEach(img => {
      // 为图片添加点击事件
      img.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 创建全屏查看器
        const viewer = document.createElement('div');
        viewer.className = 'mobile-image-viewer';
        viewer.style.position = 'fixed';
        viewer.style.top = '0';
        viewer.style.left = '0';
        viewer.style.width = '100vw';
        viewer.style.height = '100vh';
        viewer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        viewer.style.display = 'flex';
        viewer.style.justifyContent = 'center';
        viewer.style.alignItems = 'center';
        viewer.style.zIndex = '9999';
        
        // 创建图片元素
        const viewerImg = document.createElement('img');
        viewerImg.src = this.src;
        viewerImg.style.maxWidth = '90vw';
        viewerImg.style.maxHeight = '80vh';
        viewerImg.style.objectFit = 'contain';
        
        // 添加关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.cursor = 'pointer';
        
        // 关闭查看器的事件
        closeBtn.addEventListener('click', function() {
          document.body.removeChild(viewer);
        });
        
        // 点击背景也关闭
        viewer.addEventListener('click', function(e) {
          if (e.target === viewer) {
            document.body.removeChild(viewer);
          }
        });
        
        // 添加到查看器并显示
        viewer.appendChild(viewerImg);
        viewer.appendChild(closeBtn);
        document.body.appendChild(viewer);
      });
    });
  }
  
  /**
   * 为长页面添加返回顶部按钮
   */
  function addBackToTopButton() {
    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'mobile-back-to-top';
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTopBtn.style.position = 'fixed';
    backToTopBtn.style.bottom = '70px'; // 位于底部导航上方
    backToTopBtn.style.right = '20px';
    backToTopBtn.style.width = '40px';
    backToTopBtn.style.height = '40px';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.backgroundColor = 'rgba(100, 181, 246, 0.8)';
    backToTopBtn.style.color = 'white';
    backToTopBtn.style.display = 'flex';
    backToTopBtn.style.justifyContent = 'center';
    backToTopBtn.style.alignItems = 'center';
    backToTopBtn.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.transform = 'translateY(20px)';
    backToTopBtn.style.transition = 'all 0.3s ease';
    backToTopBtn.style.zIndex = '999';
    
    // 点击事件 - 平滑滚动到顶部
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // 监听滚动事件 - 控制按钮显示/隐藏
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.transform = 'translateY(0)';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transform = 'translateY(20px)';
      }
    });
    
    // 添加到页面
    document.body.appendChild(backToTopBtn);
  }
})(); 