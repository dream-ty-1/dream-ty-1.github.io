/**
 * 轻量级移动端脚本
 * 只包含必要的功能
 */

(function() {
  // 仅在移动设备上执行
  if (!document.documentElement.classList.contains('mobile-device')) {
    return;
  }
  
  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    // 创建移动端导航
    createMobileNav();
    
    // 创建移动端标题栏
    createMobileHeader();
    
    // 初始化返回顶部按钮
    initBackToTop();
    
    // 优化图片加载
    lazyLoadImages();
    
    // 移除加载动画
    removeLoadingAnimation();
  });
  
  /**
   * 创建移动端导航
   */
  function createMobileNav() {
    // 检查是否已存在
    if (document.querySelector('.mobile-nav')) {
      return;
    }
    
    // 获取主菜单项
    const menuItems = [
      { name: 'Home', icon: 'fa-house', link: '/' },
      { name: 'Archives', icon: 'fa-box-archive', link: '/archives/' },
      { name: 'Categories', icon: 'fa-bookmark', link: '/categories/' },
      { name: 'Tags', icon: 'fa-tags', link: '/tags/' },
      { name: 'About', icon: 'fa-id-card', link: '/about/' }
    ];
    
    // 创建导航元素
    const nav = document.createElement('div');
    nav.className = 'mobile-nav';
    
    // 添加菜单项
    menuItems.forEach(item => {
      const link = document.createElement('a');
      link.href = item.link;
      link.innerHTML = `<i class="fa-solid ${item.icon}"></i><span>${item.name}</span>`;
      
      // 检查是否为当前页面
      if (window.location.pathname === item.link || 
          (item.link !== '/' && window.location.pathname.startsWith(item.link))) {
        link.classList.add('active');
      }
      
      nav.appendChild(link);
    });
    
    // 添加到页面
    document.body.appendChild(nav);
  }
  
  /**
   * 创建移动端标题栏
   */
  function createMobileHeader() {
    // 检查是否已存在
    if (document.querySelector('.mobile-header')) {
      return;
    }
    
    // 获取网站标题
    const siteTitle = document.querySelector('title').textContent.split(' | ')[1] || 'Blog';
    
    // 创建标题栏
    const header = document.createElement('div');
    header.className = 'mobile-header';
    header.innerHTML = `<div class="site-title">${siteTitle}</div>`;
    
    // 添加到页面
    document.body.insertBefore(header, document.body.firstChild);
    
    // 添加页面顶部内边距
    document.body.style.paddingTop = '50px';
  }
  
  /**
   * 初始化返回顶部按钮
   */
  function initBackToTop() {
    // 创建按钮
    const button = document.createElement('a');
    button.className = 'back-to-top';
    button.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    button.href = 'javascript:void(0)';
    
    // 添加点击事件
    button.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // 添加到页面
    document.body.appendChild(button);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        button.classList.add('show');
      } else {
        button.classList.remove('show');
      }
    });
  }
  
  /**
   * 优化图片加载
   */
  function lazyLoadImages() {
    // 检查浏览器是否支持 IntersectionObserver
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            
            imageObserver.unobserve(img);
          }
        });
      });
      
      // 获取所有图片
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // 回退方案，直接加载所有图片
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
    }
  }
  
  /**
   * 移除加载动画
   */
  function removeLoadingAnimation() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }
})(); 