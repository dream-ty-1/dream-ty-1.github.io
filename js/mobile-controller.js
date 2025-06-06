/**
 * 移动端控制器
 * 处理移动端特殊交互行为
 */

(function() {
  // 仅在移动端模式激活时运行
  document.addEventListener('mobileModeActivated', function(event) {
    const deviceInfo = event.detail;
    console.log('移动端模式已激活', deviceInfo);
    
    // 添加顶部标题栏
    addMobileHeader();
    
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
    
    // 添加页面过渡效果
    addPageTransitionEffect();
  });
  
  /**
   * 添加移动端顶部标题栏
   */
  function addMobileHeader() {
    // 创建顶部标题栏
    const mobileHeader = document.createElement('div');
    mobileHeader.className = 'mobile-header';
    
    // 获取网站标题
    let siteTitle = document.title;
    // 如果是文章页面，显示文章标题
    const articleTitle = document.querySelector('.article-title');
    if (articleTitle) {
      siteTitle = articleTitle.textContent;
    } else if (siteTitle.includes(' | ')) {
      // 如果标题包含分隔符，只取前面部分
      siteTitle = siteTitle.split(' | ')[0];
    }
    
    // 创建标题元素
    const titleElement = document.createElement('div');
    titleElement.className = 'site-title';
    titleElement.textContent = siteTitle;
    
    // 添加标题到标题栏
    mobileHeader.appendChild(titleElement);
    
    // 添加到页面
    document.body.insertBefore(mobileHeader, document.body.firstChild);
  }
  
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
      { icon: 'fa-solid fa-search', text: '搜索', link: '#', action: toggleSearch },
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
          (currentPath !== '/' && item.link !== '/' && item.link !== '#' && currentPath.startsWith(item.link))) {
        link.classList.add('active');
      }
      
      // 如果有自定义操作，添加点击事件
      if (item.action) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          item.action();
        });
      }
      
      mobileNav.appendChild(link);
    });
    
    // 添加到页面
    document.body.appendChild(mobileNav);
    
    // 创建搜索面板
    createSearchPanel();
  }
  
  /**
   * 创建搜索面板
   */
  function createSearchPanel() {
    // 创建搜索面板
    const searchPanel = document.createElement('div');
    searchPanel.className = 'mobile-search-panel';
    searchPanel.style.position = 'fixed';
    searchPanel.style.top = '0';
    searchPanel.style.left = '0';
    searchPanel.style.width = '100%';
    searchPanel.style.height = '100%';
    searchPanel.style.backgroundColor = 'rgba(25, 25, 25, 0.95)';
    searchPanel.style.zIndex = '1001';
    searchPanel.style.display = 'none';
    searchPanel.style.flexDirection = 'column';
    searchPanel.style.padding = '70px 20px 20px';
    
    // 创建搜索框
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    searchBox.style.position = 'relative';
    searchBox.style.marginBottom = '20px';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索文章...';
    searchInput.style.width = '100%';
    searchInput.style.padding = '10px 40px 10px 15px';
    searchInput.style.borderRadius = '24px';
    searchInput.style.border = 'none';
    searchInput.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    searchInput.style.color = '#fff';
    searchInput.style.fontSize = '16px';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fa-solid fa-search';
    searchIcon.style.position = 'absolute';
    searchIcon.style.right = '15px';
    searchIcon.style.top = '50%';
    searchIcon.style.transform = 'translateY(-50%)';
    searchIcon.style.color = '#aaa';
    
    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchIcon);
    
    // 创建关闭按钮
    const closeBtn = document.createElement('div');
    closeBtn.className = 'search-close-btn';
    closeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.color = '#fff';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '1002';
    
    closeBtn.addEventListener('click', function() {
      searchPanel.style.display = 'none';
      document.body.style.overflow = '';
    });
    
    // 创建搜索结果容器
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.flex = '1';
    searchResults.style.overflowY = 'auto';
    searchResults.style.color = '#fff';
    
    // 添加到搜索面板
    searchPanel.appendChild(closeBtn);
    searchPanel.appendChild(searchBox);
    searchPanel.appendChild(searchResults);
    
    // 添加到页面
    document.body.appendChild(searchPanel);
    
    // 添加搜索功能
    searchInput.addEventListener('input', debounce(function() {
      const query = this.value.trim();
      if (query.length < 2) {
        searchResults.innerHTML = '<div style="text-align:center;color:#aaa;margin-top:30px;">请输入至少2个字符</div>';
        return;
      }
      
      searchResults.innerHTML = '<div style="text-align:center;color:#aaa;margin-top:30px;">搜索中...</div>';
      
      // 这里应该调用实际的搜索API或本地搜索逻辑
      // 为了演示，我们使用一个模拟的搜索结果
      setTimeout(function() {
        performSearch(query, searchResults);
      }, 300);
    }, 300));
  }
  
  /**
   * 执行搜索
   */
  function performSearch(query, resultsContainer) {
    // 检查是否存在本地搜索数据
    if (window.searchData) {
      const results = searchLocalData(query, window.searchData);
      displaySearchResults(results, resultsContainer);
    } else {
      // 尝试加载搜索数据
      loadSearchData(function(data) {
        if (data) {
          window.searchData = data;
          const results = searchLocalData(query, data);
          displaySearchResults(results, resultsContainer);
        } else {
          resultsContainer.innerHTML = '<div style="text-align:center;color:#aaa;margin-top:30px;">搜索数据加载失败</div>';
        }
      });
    }
  }
  
  /**
   * 加载搜索数据
   */
  function loadSearchData(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/search.json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          callback(data);
        } catch (e) {
          console.error('解析搜索数据失败:', e);
          callback(null);
        }
      } else {
        console.error('加载搜索数据失败:', xhr.status);
        callback(null);
      }
    };
    xhr.onerror = function() {
      console.error('请求搜索数据失败');
      callback(null);
    };
    xhr.send();
  }
  
  /**
   * 在本地数据中搜索
   */
  function searchLocalData(query, data) {
    query = query.toLowerCase();
    const results = [];
    
    data.forEach(function(item) {
      const title = item.title.toLowerCase();
      const content = item.content ? item.content.toLowerCase() : '';
      
      if (title.includes(query) || content.includes(query)) {
        results.push(item);
      }
    });
    
    return results;
  }
  
  /**
   * 显示搜索结果
   */
  function displaySearchResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#aaa;margin-top:30px;">未找到相关结果</div>';
      return;
    }
    
    let html = '';
    results.forEach(function(item) {
      html += `
        <div class="search-result-item" style="margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,0.1);">
          <a href="${item.url}" style="color:#66afef;font-size:18px;font-weight:bold;text-decoration:none;display:block;margin-bottom:8px;">${item.title}</a>
          <div style="color:#aaa;font-size:14px;margin-bottom:5px;">
            <i class="fa-solid fa-calendar"></i> ${item.date || '未知日期'}
            ${item.categories ? `<span style="margin-left:10px;"><i class="fa-solid fa-folder"></i> ${item.categories}</span>` : ''}
          </div>
          <div style="color:#ddd;font-size:14px;line-height:1.5;">${item.content ? truncateContent(item.content, 100) : '无内容预览'}</div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // 为搜索结果添加点击事件
    const resultItems = container.querySelectorAll('.search-result-item a');
    resultItems.forEach(function(item) {
      item.addEventListener('click', function() {
        // 关闭搜索面板
        document.querySelector('.mobile-search-panel').style.display = 'none';
        document.body.style.overflow = '';
      });
    });
  }
  
  /**
   * 截断内容
   */
  function truncateContent(content, length) {
    if (content.length <= length) return content;
    return content.substr(0, length) + '...';
  }
  
  /**
   * 切换搜索面板显示
   */
  function toggleSearch() {
    const searchPanel = document.querySelector('.mobile-search-panel');
    if (searchPanel.style.display === 'none' || searchPanel.style.display === '') {
      searchPanel.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      searchPanel.querySelector('input').focus();
    } else {
      searchPanel.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  
  /**
   * 防抖函数
   */
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
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
        viewerImg.style.transition = 'transform 0.3s ease';
        
        // 添加关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.zIndex = '10000';
        
        // 关闭查看器的事件
        closeBtn.addEventListener('click', function() {
          document.body.removeChild(viewer);
          document.body.style.overflow = '';
        });
        
        // 点击背景也关闭
        viewer.addEventListener('click', function(e) {
          if (e.target === viewer) {
            document.body.removeChild(viewer);
            document.body.style.overflow = '';
          }
        });
        
        // 添加缩放功能
        let scale = 1;
        let currentScale = 1;
        
        viewerImg.addEventListener('click', function(e) {
          e.stopPropagation();
          
          if (currentScale === 1) {
            currentScale = 2;
            this.style.transform = 'scale(2)';
          } else {
            currentScale = 1;
            this.style.transform = 'scale(1)';
          }
        });
        
        // 添加到查看器并显示
        viewer.appendChild(viewerImg);
        viewer.appendChild(closeBtn);
        document.body.appendChild(viewer);
        
        // 锁定背景滚动
        document.body.style.overflow = 'hidden';
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
  
  /**
   * 添加页面过渡效果
   */
  function addPageTransitionEffect() {
    // 为主要内容区域添加过渡效果类
    const mainContent = document.querySelector('#main');
    if (mainContent) {
      mainContent.classList.add('page-transition');
    }
    
    // 为所有链接添加页面过渡效果
    document.querySelectorAll('a').forEach(link => {
      // 只处理站内链接
      if (link.hostname === window.location.hostname || !link.hostname) {
        link.addEventListener('click', function(e) {
          // 排除特殊链接
          if (this.getAttribute('target') === '_blank' || 
              this.getAttribute('rel') === 'nofollow' ||
              this.href.includes('#')) {
            return;
          }
          
          e.preventDefault();
          
          // 添加淡出效果
          document.body.style.opacity = '0';
          document.body.style.transition = 'opacity 0.3s ease';
          
          // 延迟跳转
          setTimeout(() => {
            window.location.href = this.href;
          }, 300);
        });
      }
    });
  }
})(); 