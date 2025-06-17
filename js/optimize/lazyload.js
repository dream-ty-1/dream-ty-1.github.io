/**
 * 图片和资源懒加载实现
 * 通过延迟加载非可视区域的图片和资源，减少初始加载时间和带宽消耗
 */
document.addEventListener("DOMContentLoaded", function() {
    // 获取所有图片和需要懒加载的元素
    const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    const lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));
    const lazyIframes = [].slice.call(document.querySelectorAll("iframe.lazy"));
    
    // 如果支持IntersectionObserver API，则使用该API实现懒加载
    if ("IntersectionObserver" in window) {
        // 图片懒加载
        let imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.removeAttribute("data-src");
                    }
                    if (lazyImage.dataset.srcset) {
                        lazyImage.srcset = lazyImage.dataset.srcset;
                        lazyImage.removeAttribute("data-srcset");
                    }
                    lazyImage.classList.remove("lazy");
                    imageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            imageObserver.observe(lazyImage);
        });
        
        // 背景图片懒加载
        let bgObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyBg = entry.target;
                    if (lazyBg.dataset.bg) {
                        lazyBg.style.backgroundImage = `url(${lazyBg.dataset.bg})`;
                        lazyBg.classList.remove("lazy-background");
                        lazyBg.removeAttribute("data-bg");
                        bgObserver.unobserve(lazyBg);
                    }
                }
            });
        });
        
        lazyBackgrounds.forEach(function(lazyBg) {
            bgObserver.observe(lazyBg);
        });
        
        // iframe懒加载
        let iframeObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyIframe = entry.target;
                    if (lazyIframe.dataset.src) {
                        lazyIframe.src = lazyIframe.dataset.src;
                        lazyIframe.removeAttribute("data-src");
                        lazyIframe.classList.remove("lazy");
                        iframeObserver.unobserve(lazyIframe);
                    }
                }
            });
        });
        
        lazyIframes.forEach(function(lazyIframe) {
            iframeObserver.observe(lazyIframe);
        });
    } else {
        // 回退方案：使用滚动事件监听（针对不支持IntersectionObserver的浏览器）
        let lazyLoad = function() {
            let scrollTop = window.pageYOffset;
            
            // 处理图片
            lazyImages.forEach(function(lazyImage) {
                if (lazyImage.offsetTop < window.innerHeight + scrollTop) {
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.removeAttribute("data-src");
                    }
                    if (lazyImage.dataset.srcset) {
                        lazyImage.srcset = lazyImage.dataset.srcset;
                        lazyImage.removeAttribute("data-srcset");
                    }
                    lazyImage.classList.remove("lazy");
                }
            });
            
            // 处理背景图
            lazyBackgrounds.forEach(function(lazyBg) {
                if (lazyBg.offsetTop < window.innerHeight + scrollTop) {
                    if (lazyBg.dataset.bg) {
                        lazyBg.style.backgroundImage = `url(${lazyBg.dataset.bg})`;
                        lazyBg.classList.remove("lazy-background");
                        lazyBg.removeAttribute("data-bg");
                    }
                }
            });
            
            // 处理iframe
            lazyIframes.forEach(function(lazyIframe) {
                if (lazyIframe.offsetTop < window.innerHeight + scrollTop) {
                    if (lazyIframe.dataset.src) {
                        lazyIframe.src = lazyIframe.dataset.src;
                        lazyIframe.removeAttribute("data-src");
                        lazyIframe.classList.remove("lazy");
                    }
                }
            });
            
            // 如果所有元素都已处理，移除滚动事件监听
            if (lazyImages.length === 0 && lazyBackgrounds.length === 0 && lazyIframes.length === 0) { 
                document.removeEventListener("scroll", lazyLoad);
                window.removeEventListener("resize", lazyLoad);
                window.removeEventListener("orientationChange", lazyLoad);
            }
        };
        
        // 添加事件监听
        document.addEventListener("scroll", lazyLoad);
        window.addEventListener("resize", lazyLoad);
        window.addEventListener("orientationChange", lazyLoad);
        
        // 初始加载
        lazyLoad();
    }
}); 