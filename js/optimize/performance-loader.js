/**
 * 性能优化加载器
 * 按顺序加载各个性能优化模块，管理优化模块的依赖关系
 */
(function() {
    // 性能监控
    const performance = {
        // 记录关键指标
        metrics: {
            startTime: Date.now(),
            domContentLoaded: 0,
            windowLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            resourceLoadTime: {} // 记录各资源加载时间
        },
        
        // 初始化性能监控
        init: function() {
            // 记录DOMContentLoaded时间
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.metrics.domContentLoaded = Date.now() - this.metrics.startTime;
                    console.log('DOMContentLoaded时间:', this.metrics.domContentLoaded + 'ms');
                });
            } else {
                this.metrics.domContentLoaded = Date.now() - this.metrics.startTime;
            }
            
            // 记录window.load时间
            window.addEventListener('load', () => {
                this.metrics.windowLoaded = Date.now() - this.metrics.startTime;
                console.log('Window loaded时间:', this.metrics.windowLoaded + 'ms');
                
                // 记录首次绘制和首次内容绘制时间（如果有PerformanceObserver）
                if ('PerformanceObserver' in window) {
                    let paintObserver = new PerformanceObserver((entries) => {
                        entries.getEntries().forEach((entry) => {
                            if (entry.name === 'first-paint') {
                                this.metrics.firstPaint = entry.startTime;
                                console.log('首次绘制(FP):', Math.round(entry.startTime) + 'ms');
                            }
                            if (entry.name === 'first-contentful-paint') {
                                this.metrics.firstContentfulPaint = entry.startTime;
                                console.log('首次内容绘制(FCP):', Math.round(entry.startTime) + 'ms');
                            }
                        });
                    });
                    paintObserver.observe({ entryTypes: ['paint'] });
                }
                
                // 收集资源加载时间
                this.collectResourceTiming();
            });
        },
        
        // 收集资源加载时间
        collectResourceTiming: function() {
            if (window.performance && performance.getEntriesByType) {
                const resources = performance.getEntriesByType('resource');
                resources.forEach(resource => {
                    const url = resource.name.split('/').pop();
                    if (url) {
                        this.metrics.resourceLoadTime[url] = Math.round(resource.responseEnd);
                    }
                });
                
                // 找出加载最慢的资源
                const sortedResources = Object.entries(this.metrics.resourceLoadTime)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);
                
                console.log('加载最慢的5个资源:');
                sortedResources.forEach(([name, time]) => {
                    console.log(`${name}: ${time}ms`);
                });
            }
        },
        
        // 记录自定义计时点
        mark: function(label) {
            const time = Date.now() - this.metrics.startTime;
            console.log(`${label}: ${time}ms`);
            return time;
        }
    };
    
    // 优化模块配置
    const optimizations = [
        {
            name: 'critical-css',
            enabled: true,
            script: null, // 关键CSS已内联，无需加载脚本
            priority: 0   // 最高优先级
        },
        {
            name: 'resource-optimizer',
            enabled: true,
            script: '/js/optimize/resource-optimizer.js',
            priority: 1
        },
        {
            name: 'lazyload',
            enabled: true,
            script: '/js/optimize/lazyload.js',
            priority: 2
        },
        {
            name: 'image-optimizer',
            enabled: true,
            script: '/js/optimize/image-optimizer.js',
            priority: 3
        },
        {
            name: 'resource-preload',
            enabled: true,
            script: '/js/optimize/resource-preload.js',
            priority: 4
        },
        {
            name: 'cache-manager',
            enabled: true,
            script: '/js/optimize/cache-manager.js',
            priority: 5
        }
    ];
    
    // 创建首屏加载进度指示器
    function createLoadingIndicator() {
        const loading = document.createElement('div');
        loading.className = 'site-loading';
        loading.setAttribute('role', 'progressbar');
        loading.setAttribute('aria-label', '页面加载中');
        document.body.insertBefore(loading, document.body.firstChild);
        
        return loading;
    }
    
    // 移除加载指示器
    function removeLoadingIndicator(loadingElement) {
        if (loadingElement && loadingElement.parentNode) {
            // 添加过渡效果
            loadingElement.style.opacity = '0';
            setTimeout(() => {
                if (loadingElement.parentNode) {
                    loadingElement.parentNode.removeChild(loadingElement);
                }
            }, 300);
        }
    }
    
    // 加载脚本文件
    function loadScript(url, async = true, defer = false) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = async;
            script.defer = defer;
            
            script.onload = () => resolve(url);
            script.onerror = () => reject(new Error(`无法加载脚本: ${url}`));
            
            document.body.appendChild(script);
        });
    }
    
    // 按优先级加载优化模块
    function loadOptimizationModules() {
        // 按优先级排序
        const sortedModules = [...optimizations]
            .filter(mod => mod.enabled)
            .sort((a, b) => a.priority - b.priority);
        
        // 依次加载模块
        let chain = Promise.resolve();
        
        sortedModules.forEach(module => {
            if (module.script) {
                chain = chain.then(() => {
                    console.log(`加载优化模块: ${module.name}`);
                    return loadScript(module.script, true, true);
                }).catch(err => {
                    console.error(`加载模块 ${module.name} 失败:`, err);
                    // 继续加载其他模块
                    return Promise.resolve();
                });
            }
        });
        
        return chain;
    }
    
    // 检测页面性能
    function detectPerformanceIssues() {
        setTimeout(() => {
            // 页面加载超过3秒，可能存在性能问题
            if (window.performance && performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                if (loadTime > 3000) {
                    console.warn(`页面加载时间过长: ${Math.round(loadTime/1000)}秒`);
                }
            }
            
            // 检测DOM大小
            const domSize = document.getElementsByTagName('*').length;
            if (domSize > 1500) {
                console.warn(`DOM元素数量过多: ${domSize}个元素`);
            }
            
            // 检测大型图片
            const images = document.querySelectorAll('img');
            let largeImagesCount = 0;
            
            images.forEach(img => {
                // 对于已加载的图片，检查其尺寸
                if (img.complete && img.naturalWidth > 0) {
                    const size = img.naturalWidth * img.naturalHeight;
                    if (size > 1000000) { // 大于1百万像素
                        largeImagesCount++;
                        console.warn(`检测到大型图片: ${img.src}`);
                    }
                }
            });
            
            if (largeImagesCount > 0) {
                console.warn(`检测到${largeImagesCount}张大型图片，考虑优化`);
            }
        }, 5000); // 页面加载5秒后检测
    }
    
    // 初始化性能优化
    function init() {
        // 启动性能监控
        performance.init();
        
        // 创建加载指示器
        const loadingIndicator = createLoadingIndicator();
        
        // 标记初始化开始
        performance.mark('优化初始化开始');
        
        // 按优先级加载优化模块
        loadOptimizationModules().then(() => {
            // 标记所有模块加载完成
            performance.mark('所有优化模块加载完成');
            
            // 页面完全加载后移除加载指示器
            window.addEventListener('load', () => {
                setTimeout(() => {
                    removeLoadingIndicator(loadingIndicator);
                    
                    // 检测潜在的性能问题
                    detectPerformanceIssues();
                }, 500);
            });
        });
    }
    
    // 启动性能优化
    init();
})(); 