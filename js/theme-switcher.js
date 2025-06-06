/**
 * 主题切换器
 * 实现深色/浅色模式切换
 */

(function() {
  // 主题类型
  const THEME_MODES = {
    DARK: 'dark',
    LIGHT: 'light',
    AUTO: 'auto'
  };
  
  // 默认主题
  const DEFAULT_THEME = THEME_MODES.AUTO;
  
  // 主题颜色变量映射
  const THEME_COLORS = {
    [THEME_MODES.DARK]: {
      '--background-color': '#121212',
      '--card-background-color': '#1e1e1e',
      '--text-color': '#e0e0e0',
      '--secondary-text-color': '#aaaaaa',
      '--border-color': 'rgba(255, 255, 255, 0.1)',
      '--shadow-color': 'rgba(0, 0, 0, 0.3)',
      '--primary-color': '#64b5f6',
      '--accent-color': '#4285f4',
      '--hover-color': 'rgba(255, 255, 255, 0.05)',
      '--loading-background-color': '#121212',
      '--loading-color': '#64b5f6',
      '--code-background': '#2d2d2d',
      '--blockquote-color': '#424242'
    },
    [THEME_MODES.LIGHT]: {
      '--background-color': '#f5f5f5',
      '--card-background-color': '#ffffff',
      '--text-color': '#333333',
      '--secondary-text-color': '#666666',
      '--border-color': 'rgba(0, 0, 0, 0.1)',
      '--shadow-color': 'rgba(0, 0, 0, 0.1)',
      '--primary-color': '#1976d2',
      '--accent-color': '#2196f3',
      '--hover-color': 'rgba(0, 0, 0, 0.05)',
      '--loading-background-color': '#ffffff',
      '--loading-color': '#1976d2',
      '--code-background': '#f0f0f0',
      '--blockquote-color': '#e0e0e0'
    }
  };
  
  // 获取当前主题
  function getCurrentTheme() {
    return localStorage.getItem('theme-mode') || DEFAULT_THEME;
  }
  
  // 设置主题
  function setTheme(mode) {
    const htmlElement = document.documentElement;
    
    // 移除所有主题类
    htmlElement.classList.remove(THEME_MODES.DARK, THEME_MODES.LIGHT);
    
    // 根据模式设置主题
    if (mode === THEME_MODES.AUTO) {
      // 自动模式：根据系统偏好设置
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.classList.add(THEME_MODES.DARK);
        applyThemeColors(THEME_MODES.DARK);
      } else {
        htmlElement.classList.add(THEME_MODES.LIGHT);
        applyThemeColors(THEME_MODES.LIGHT);
      }
    } else {
      // 手动模式：根据用户选择
      htmlElement.classList.add(mode);
      applyThemeColors(mode);
    }
    
    // 保存到本地存储
    localStorage.setItem('theme-mode', mode);
    
    // 触发主题变更事件
    const event = new CustomEvent('themeChanged', {
      detail: { mode: mode }
    });
    document.dispatchEvent(event);
  }
  
  // 应用主题颜色
  function applyThemeColors(mode) {
    const colors = THEME_COLORS[mode === THEME_MODES.AUTO ? 
                               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 
                                THEME_MODES.DARK : THEME_MODES.LIGHT) : 
                               mode];
    
    // 应用颜色变量
    for (const [key, value] of Object.entries(colors)) {
      document.documentElement.style.setProperty(key, value);
    }
  }
  
  // 切换主题
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    
    // 切换顺序：自动 -> 亮色 -> 暗色 -> 自动
    let newTheme;
    if (currentTheme === THEME_MODES.AUTO) {
      newTheme = THEME_MODES.LIGHT;
    } else if (currentTheme === THEME_MODES.LIGHT) {
      newTheme = THEME_MODES.DARK;
    } else {
      newTheme = THEME_MODES.AUTO;
    }
    
    setTheme(newTheme);
    return newTheme;
  }
  
  // 添加主题切换按钮
  function addThemeSwitcher() {
    // 仅在移动设备上添加
    if (!document.documentElement.classList.contains('mobile-device')) {
      return;
    }
    
    // 创建主题切换按钮
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.style.position = 'fixed';
    themeSwitcher.style.top = '60px';
    themeSwitcher.style.right = '20px';
    themeSwitcher.style.width = '40px';
    themeSwitcher.style.height = '40px';
    themeSwitcher.style.borderRadius = '50%';
    themeSwitcher.style.backgroundColor = 'var(--card-background-color)';
    themeSwitcher.style.boxShadow = '0 2px 10px var(--shadow-color)';
    themeSwitcher.style.display = 'flex';
    themeSwitcher.style.justifyContent = 'center';
    themeSwitcher.style.alignItems = 'center';
    themeSwitcher.style.zIndex = '999';
    themeSwitcher.style.transition = 'all 0.3s ease';
    
    // 设置图标
    updateThemeSwitcherIcon(themeSwitcher, getCurrentTheme());
    
    // 添加点击事件
    themeSwitcher.addEventListener('click', function() {
      const newTheme = toggleTheme();
      updateThemeSwitcherIcon(themeSwitcher, newTheme);
    });
    
    // 添加触摸反馈
    themeSwitcher.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.9)';
    }, { passive: true });
    
    themeSwitcher.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    }, { passive: true });
    
    // 添加到页面
    document.body.appendChild(themeSwitcher);
  }
  
  // 更新主题切换按钮图标
  function updateThemeSwitcherIcon(button, theme) {
    let iconClass, iconColor;
    
    switch (theme) {
      case THEME_MODES.LIGHT:
        iconClass = 'fa-solid fa-sun';
        iconColor = '#ffb74d';
        break;
      case THEME_MODES.DARK:
        iconClass = 'fa-solid fa-moon';
        iconColor = '#5c6bc0';
        break;
      default: // AUTO
        iconClass = 'fa-solid fa-circle-half-stroke';
        iconColor = '#9e9e9e';
    }
    
    button.innerHTML = `<i class="${iconClass}" style="color:${iconColor};font-size:20px;"></i>`;
  }
  
  // 监听系统主题变化
  function listenForSystemThemeChanges() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        const currentTheme = getCurrentTheme();
        if (currentTheme === THEME_MODES.AUTO) {
          setTheme(THEME_MODES.AUTO);
        }
      });
    }
  }
  
  // 初始化主题
  function init() {
    // 设置初始主题
    setTheme(getCurrentTheme());
    
    // 监听系统主题变化
    listenForSystemThemeChanges();
    
    // 添加主题切换按钮
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addThemeSwitcher);
    } else {
      addThemeSwitcher();
    }
    
    // 监听移动设备模式激活事件
    document.addEventListener('mobileModeActivated', function() {
      addThemeSwitcher();
    });
  }
  
  // 导出API
  window.ThemeSwitcher = {
    getCurrentTheme,
    setTheme,
    toggleTheme
  };
  
  // 初始化
  init();
})(); 