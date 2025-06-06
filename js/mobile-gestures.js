/**
 * 移动端手势控制器
 * 实现滑动、缩放等手势
 */

(function() {
  // 仅在移动端模式激活时运行
  document.addEventListener('mobileModeActivated', function() {
    console.log('移动端手势控制器已激活');
    
    // 初始化手势控制
    initGestureControl();
  });
  
  /**
   * 初始化手势控制
   */
  function initGestureControl() {
    // 滑动导航
    initSwipeNavigation();
    
    // 下拉刷新
    initPullToRefresh();
    
    // 双击返回顶部
    initDoubleTapToTop();
    
    // 长按菜单
    initLongPressMenu();
    
    // 添加触摸反馈
    addTouchFeedback();
    
    // 添加滚动指示器
    addScrollIndicator();
  }
  
  /**
   * 初始化滑动导航
   * 在文章页面左右滑动切换文章
   */
  function initSwipeNavigation() {
    // 检查是否在文章页面
    if (!document.querySelector('.article')) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      
      // 计算水平和垂直滑动距离
      const horizontalDistance = touchEndX - touchStartX;
      const verticalDistance = touchEndY - touchStartY;
      
      // 如果垂直滑动距离大于水平滑动距离，则不处理
      if (Math.abs(verticalDistance) > Math.abs(horizontalDistance)) {
        return;
      }
      
      handleSwipeGesture(horizontalDistance);
    }, { passive: true });
  }
  
  /**
   * 处理滑动手势
   */
  function handleSwipeGesture(swipeDistance) {
    // 滑动阈值
    const swipeThreshold = 100;
    
    // 检查是否在文章页，且有前后文章链接
    const prevLink = document.querySelector('.article-nav-prev a');
    const nextLink = document.querySelector('.article-nav-next a');
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      // 显示滑动指示器
      showSwipeIndicator(swipeDistance > 0 ? 'prev' : 'next');
      
      // 延迟跳转，让用户看到滑动指示器
      setTimeout(() => {
        if (swipeDistance > 0 && prevLink) {
          // 右滑 -> 前一篇文章
          window.location.href = prevLink.href;
        } else if (swipeDistance < 0 && nextLink) {
          // 左滑 -> 后一篇文章
          window.location.href = nextLink.href;
        }
      }, 200);
    }
  }
  
  /**
   * 显示滑动指示器
   */
  function showSwipeIndicator(direction) {
    // 移除旧的指示器
    const oldIndicator = document.querySelector('.swipe-indicator');
    if (oldIndicator) {
      document.body.removeChild(oldIndicator);
    }
    
    // 创建滑动指示器
    const indicator = document.createElement('div');
    indicator.className = 'swipe-indicator';
    indicator.style.position = 'fixed';
    indicator.style.top = '50%';
    indicator.style.transform = 'translateY(-50%)';
    indicator.style.backgroundColor = 'rgba(100, 181, 246, 0.8)';
    indicator.style.borderRadius = '50%';
    indicator.style.width = '50px';
    indicator.style.height = '50px';
    indicator.style.display = 'flex';
    indicator.style.justifyContent = 'center';
    indicator.style.alignItems = 'center';
    indicator.style.zIndex = '9999';
    indicator.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    indicator.style.animation = 'fadeIn 0.2s ease-out';
    
    // 设置方向图标
    if (direction === 'prev') {
      indicator.style.left = '20px';
      indicator.innerHTML = '<i class="fa-solid fa-chevron-left" style="font-size:20px;color:white;"></i>';
    } else {
      indicator.style.right = '20px';
      indicator.innerHTML = '<i class="fa-solid fa-chevron-right" style="font-size:20px;color:white;"></i>';
    }
    
    // 添加到页面
    document.body.appendChild(indicator);
    
    // 自动移除
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => {
          if (indicator.parentNode) {
            document.body.removeChild(indicator);
          }
        }, 200);
      }
    }, 1000);
  }
  
  /**
   * 初始化下拉刷新
   */
  function initPullToRefresh() {
    // 仅在首页启用下拉刷新
    if (!document.querySelector('#home-head')) return;
    
    let touchStartY = 0;
    let touchEndY = 0;
    let isPulling = false;
    let refreshIndicator = null;
    
    document.addEventListener('touchstart', function(e) {
      // 如果已经在顶部，则记录起始位置
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        isPulling = true;
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
      if (!isPulling) return;
      
      touchEndY = e.touches[0].clientY;
      const pullDistance = touchEndY - touchStartY;
      
      // 如果是下拉操作
      if (pullDistance > 0) {
        // 创建或更新下拉刷新指示器
        if (!refreshIndicator) {
          refreshIndicator = createRefreshIndicator();
          document.body.appendChild(refreshIndicator);
        }
        
        // 根据下拉距离更新指示器
        const maxPullDistance = 100;
        const progress = Math.min(pullDistance / maxPullDistance, 1);
        updateRefreshIndicator(refreshIndicator, progress);
        
        // 阻止默认滚动
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    });
    
    document.addEventListener('touchend', function() {
      if (!isPulling || !refreshIndicator) return;
      
      const pullDistance = touchEndY - touchStartY;
      
      // 如果下拉距离足够，触发刷新
      if (pullDistance > 60) {
        triggerRefresh(refreshIndicator);
      } else {
        // 否则移除指示器
        removeRefreshIndicator(refreshIndicator);
      }
      
      isPulling = false;
      refreshIndicator = null;
    });
  }
  
  /**
   * 创建刷新指示器
   */
  function createRefreshIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'refresh-indicator';
    indicator.style.position = 'fixed';
    indicator.style.top = '20px';
    indicator.style.left = '50%';
    indicator.style.transform = 'translateX(-50%)';
    indicator.style.width = '40px';
    indicator.style.height = '40px';
    indicator.style.borderRadius = '50%';
    indicator.style.backgroundColor = 'rgba(100, 181, 246, 0.8)';
    indicator.style.display = 'flex';
    indicator.style.justifyContent = 'center';
    indicator.style.alignItems = 'center';
    indicator.style.zIndex = '9999';
    indicator.style.opacity = '0';
    indicator.style.transition = 'all 0.2s ease-out';
    
    // 添加加载图标
    indicator.innerHTML = '<i class="fa-solid fa-sync" style="color:white;font-size:20px;"></i>';
    
    return indicator;
  }
  
  /**
   * 更新刷新指示器
   */
  function updateRefreshIndicator(indicator, progress) {
    indicator.style.opacity = progress.toString();
    indicator.style.transform = `translateX(-50%) scale(${progress})`;
    indicator.querySelector('i').style.transform = `rotate(${progress * 360}deg)`;
  }
  
  /**
   * 触发刷新操作
   */
  function triggerRefresh(indicator) {
    // 显示加载动画
    indicator.style.opacity = '1';
    indicator.querySelector('i').style.animation = 'rotate 1s linear infinite';
    
    // 刷新页面
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  
  /**
   * 移除刷新指示器
   */
  function removeRefreshIndicator(indicator) {
    indicator.style.opacity = '0';
    indicator.style.transform = 'translateX(-50%) scale(0)';
    
    setTimeout(() => {
      if (indicator.parentNode) {
        document.body.removeChild(indicator);
      }
    }, 200);
  }
  
  /**
   * 初始化双击返回顶部
   */
  function initDoubleTapToTop() {
    let lastTap = 0;
    const doubleTapDelay = 300;
    
    document.addEventListener('touchend', function(e) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      // 检查是否是双击
      if (tapLength < doubleTapDelay && tapLength > 0) {
        // 双击，返回顶部
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // 显示返回顶部动画
        showScrollTopAnimation();
        
        e.preventDefault();
      }
      
      lastTap = currentTime;
    });
  }
  
  /**
   * 显示返回顶部动画
   */
  function showScrollTopAnimation() {
    const animation = document.createElement('div');
    animation.className = 'scroll-top-animation';
    animation.style.position = 'fixed';
    animation.style.top = '50%';
    animation.style.left = '50%';
    animation.style.transform = 'translate(-50%, -50%)';
    animation.style.width = '60px';
    animation.style.height = '60px';
    animation.style.borderRadius = '50%';
    animation.style.backgroundColor = 'rgba(100, 181, 246, 0.8)';
    animation.style.display = 'flex';
    animation.style.justifyContent = 'center';
    animation.style.alignItems = 'center';
    animation.style.zIndex = '9999';
    animation.style.animation = 'pulse 0.5s ease-out';
    
    animation.innerHTML = '<i class="fa-solid fa-arrow-up" style="color:white;font-size:24px;"></i>';
    
    document.body.appendChild(animation);
    
    setTimeout(() => {
      animation.style.opacity = '0';
      setTimeout(() => {
        if (animation.parentNode) {
          document.body.removeChild(animation);
        }
      }, 300);
    }, 500);
  }
  
  /**
   * 初始化长按菜单
   */
  function initLongPressMenu() {
    const longPressDelay = 500;
    let pressTimer = null;
    let isLongPress = false;
    let targetElement = null;
    
    // 长按开始
    document.addEventListener('touchstart', function(e) {
      // 检查是否是文章内容或图片
      targetElement = e.target;
      
      if (targetElement.tagName === 'IMG' || 
          targetElement.closest('.article .content')) {
        
        pressTimer = setTimeout(function() {
          isLongPress = true;
          showContextMenu(e, targetElement);
        }, longPressDelay);
      }
    }, { passive: false });
    
    // 触摸移动，取消长按
    document.addEventListener('touchmove', function() {
      cancelLongPress();
    });
    
    // 触摸结束
    document.addEventListener('touchend', function() {
      cancelLongPress();
    });
    
    // 触摸取消
    document.addEventListener('touchcancel', function() {
      cancelLongPress();
    });
    
    // 取消长按
    function cancelLongPress() {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
      isLongPress = false;
    }
  }
  
  /**
   * 显示上下文菜单
   */
  function showContextMenu(event, target) {
    // 阻止默认行为
    event.preventDefault();
    
    // 创建上下文菜单
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.position = 'fixed';
    menu.style.zIndex = '9999';
    menu.style.backgroundColor = 'var(--card-background-color)';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 4px 12px var(--shadow-color)';
    menu.style.padding = '8px 0';
    menu.style.minWidth = '150px';
    menu.style.animation = 'fadeIn 0.2s ease-out';
    
    // 根据目标元素类型添加菜单项
    if (target.tagName === 'IMG') {
      addMenuItem(menu, '查看图片', function() {
        window.open(target.src, '_blank');
      });
      
      addMenuItem(menu, '保存图片', function() {
        const link = document.createElement('a');
        link.href = target.src;
        link.download = target.alt || 'image';
        link.click();
      });
    } else {
      // 文本内容
      const selection = window.getSelection();
      const text = selection.toString() || target.textContent;
      
      addMenuItem(menu, '复制文本', function() {
        navigator.clipboard.writeText(text)
          .then(() => showToast('已复制到剪贴板'))
          .catch(() => showToast('复制失败'));
      });
      
      addMenuItem(menu, '分享', function() {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            text: text,
            url: window.location.href
          })
          .catch(() => showToast('分享失败'));
        } else {
          showToast('您的浏览器不支持分享功能');
        }
      });
    }
    
    // 添加取消按钮
    addMenuItem(menu, '取消', function() {
      closeContextMenu();
    });
    
    // 定位菜单
    const touch = event.touches[0];
    menu.style.left = touch.clientX + 'px';
    menu.style.top = touch.clientY + 'px';
    
    // 确保菜单在视口内
    document.body.appendChild(menu);
    const menuRect = menu.getBoundingClientRect();
    
    if (menuRect.right > window.innerWidth) {
      menu.style.left = (window.innerWidth - menuRect.width - 10) + 'px';
    }
    
    if (menuRect.bottom > window.innerHeight) {
      menu.style.top = (window.innerHeight - menuRect.height - 10) + 'px';
    }
    
    // 添加背景遮罩
    const overlay = document.createElement('div');
    overlay.className = 'context-menu-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    overlay.style.zIndex = '9998';
    
    overlay.addEventListener('click', closeContextMenu);
    
    document.body.appendChild(overlay);
    
    // 关闭上下文菜单
    function closeContextMenu() {
      if (menu.parentNode) {
        menu.style.animation = 'fadeOut 0.2s ease-out';
        overlay.style.opacity = '0';
        
        setTimeout(() => {
          if (menu.parentNode) document.body.removeChild(menu);
          if (overlay.parentNode) document.body.removeChild(overlay);
        }, 200);
      }
    }
  }
  
  /**
   * 添加菜单项
   */
  function addMenuItem(menu, text, callback) {
    const item = document.createElement('div');
    item.className = 'context-menu-item';
    item.textContent = text;
    item.style.padding = '10px 15px';
    item.style.cursor = 'pointer';
    item.style.transition = 'background-color 0.2s ease';
    
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      callback();
    });
    
    item.addEventListener('touchstart', function() {
      this.style.backgroundColor = 'var(--hover-color)';
    });
    
    item.addEventListener('touchend', function() {
      this.style.backgroundColor = '';
    });
    
    menu.appendChild(item);
  }
  
  /**
   * 显示提示消息
   */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toast.style.color = 'white';
    toast.style.padding = '10px 15px';
    toast.style.borderRadius = '4px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '10000';
    toast.style.animation = 'fadeIn 0.2s ease-out';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.2s ease-out';
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 200);
    }, 2000);
  }
  
  /**
   * 添加触摸反馈
   */
  function addTouchFeedback() {
    // 获取所有可点击元素
    const clickableElements = document.querySelectorAll('a, button, .post, .category-item, .tag');
    
    clickableElements.forEach(element => {
      // 添加触摸反馈类
      element.classList.add('touch-feedback');
    });
  }
  
  /**
   * 添加滚动指示器
   */
  function addScrollIndicator() {
    // 仅在首页添加滚动指示器
    if (!document.querySelector('#home-head')) return;
    
    // 创建滚动指示器
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.style.position = 'absolute';
    indicator.style.bottom = '20px';
    indicator.style.left = '50%';
    indicator.style.transform = 'translateX(-50%)';
    indicator.style.color = 'white';
    indicator.style.fontSize = '24px';
    indicator.style.opacity = '0.8';
    indicator.style.zIndex = '100';
    indicator.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    
    // 添加到首页头部
    const homeHead = document.querySelector('#home-head');
    homeHead.style.position = 'relative';
    homeHead.appendChild(indicator);
    
    // 监听滚动，隐藏指示器
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        indicator.style.opacity = '0';
      } else {
        indicator.style.opacity = '0.8';
      }
    });
  }
})(); 