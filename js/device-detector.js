/**
 * 设备检测器
 * 检测用户设备类型并加载对应样式
 */

(function() {
  // 设备类型
  const DEVICE_TYPE = {
    MOBILE: 'mobile',
    TABLET: 'tablet',
    DESKTOP: 'desktop'
  };
  
  // 设备检测函数
  function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // 检测移动设备
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      // 区分平板和手机
      if (/ipad/i.test(userAgent) || 
          (window.innerWidth >= 768 && window.innerHeight >= 768)) {
        return DEVICE_TYPE.TABLET;
      }
      return DEVICE_TYPE.MOBILE;
    }
    
    // 默认为桌面设备
    return DEVICE_TYPE.DESKTOP;
  }
  
  // 根据设备类型设置类名
  function setDeviceClass(deviceType) {
    const htmlElement = document.documentElement;
    
    // 移除所有设备类名
    htmlElement.classList.remove('mobile-device', 'tablet-device', 'desktop-device');
    
    // 添加对应设备类名
    switch (deviceType) {
      case DEVICE_TYPE.MOBILE:
        htmlElement.classList.add('mobile-device');
        break;
      case DEVICE_TYPE.TABLET:
        htmlElement.classList.add('tablet-device');
        break;
      case DEVICE_TYPE.DESKTOP:
        htmlElement.classList.add('desktop-device');
        break;
    }
    
    return deviceType;
  }
  
  // 加载设备特定样式
  function loadDeviceSpecificStyles(deviceType) {
    // 检查是否已经加载
    if (document.querySelector(`link[data-device="${deviceType}"]`)) {
      return;
    }
    
    // 移动设备特定样式
    if (deviceType === DEVICE_TYPE.MOBILE) {
      // 移动设备样式
      const mobileStyleLink = document.createElement('link');
      mobileStyleLink.rel = 'stylesheet';
      mobileStyleLink.href = '/css/mobile-only.css';
      mobileStyleLink.setAttribute('data-device', DEVICE_TYPE.MOBILE);
      document.head.appendChild(mobileStyleLink);
      
      // 移动导航样式
      const mobileNavStyleLink = document.createElement('link');
      mobileNavStyleLink.rel = 'stylesheet';
      mobileNavStyleLink.href = '/css/mobile-nav.css';
      mobileNavStyleLink.setAttribute('data-device', DEVICE_TYPE.MOBILE);
      document.head.appendChild(mobileNavStyleLink);
    }
  }
  
  // 初始化移动设备特性
  function initializeMobileFeatures() {
    // 移动设备信息对象
    const mobileInfo = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      platform: navigator.platform,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
      isAndroid: /android/i.test(navigator.userAgent)
    };
    
    // 创建并触发移动模式激活事件
    const mobileModeEvent = new CustomEvent('mobileModeActivated', {
      detail: mobileInfo
    });
    document.dispatchEvent(mobileModeEvent);
    
    // 屏幕方向变化监听
    window.addEventListener('orientationchange', function() {
      // 更新方向信息
      mobileInfo.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      
      // 创建并触发方向变化事件
      const orientationEvent = new CustomEvent('mobileOrientationChanged', {
        detail: mobileInfo
      });
      document.dispatchEvent(orientationEvent);
    });
  }
  
  // 执行设备检测和初始化
  function init() {
    // 检测设备类型
    const deviceType = detectDevice();
    
    // 设置设备类名
    setDeviceClass(deviceType);
    
    // 加载设备特定样式
    loadDeviceSpecificStyles(deviceType);
    
    // 移动设备特殊处理
    if (deviceType === DEVICE_TYPE.MOBILE) {
      initializeMobileFeatures();
    }
    
    // 控制台输出设备信息
    console.log('检测到设备类型:', deviceType, 
                '屏幕尺寸:', window.innerWidth, 'x', window.innerHeight,
                '像素比:', window.devicePixelRatio || 1);
    
    // 窗口大小变化重新检测
    window.addEventListener('resize', function() {
      const newDeviceType = detectDevice();
      if (newDeviceType !== deviceType) {
        setDeviceClass(newDeviceType);
        loadDeviceSpecificStyles(newDeviceType);
        
        if (newDeviceType === DEVICE_TYPE.MOBILE) {
          initializeMobileFeatures();
        }
      }
    });
  }
  
  // 在DOM加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 