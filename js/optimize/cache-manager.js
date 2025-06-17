/**
 * 缓存管理器
 * 使用localStorage和ServiceWorker来缓存资源，提高重复访问速度
 */
(function() {
    // 常量定义
    const CACHE_VERSION = '1.0.0';
    const CACHE_NAME = `blog-cache-${CACHE_VERSION}`;
    const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7天
    
    // 本地存储管理
    const localCache = {
        // 设置缓存，带过期时间
        set: function(key, value, ttl = MAX_CACHE_AGE) {
            try {
                const item = {
                    value: value,
                    expiry: Date.now() + ttl,
                    version: CACHE_VERSION
                };
                localStorage.setItem(key, JSON.stringify(item));
                return true;
            } catch (e) {
                console.error('Error setting localStorage cache:', e);
                return false;
            }
        },
        
        // 获取缓存，自动检查过期
        get: function(key) {
            try {
                const itemStr = localStorage.getItem(key);
                if (!itemStr) return null;
                
                const item = JSON.parse(itemStr);
                
                // 检查版本
                if (item.version !== CACHE_VERSION) {
                    localStorage.removeItem(key);
                    return null;
                }
                
                // 检查是否过期
                if (Date.now() > item.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }
                
                return item.value;
            } catch (e) {
                console.error('Error getting localStorage cache:', e);
                return null;
            }
        },
        
        // 移除指定缓存
        remove: function(key) {
            localStorage.removeItem(key);
        },
        
        // 清理所有过期的缓存
        cleanExpired: function() {
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('blog-')) {
                        this.get(key); // 会自动检查并清理过期项
                    }
                }
            } catch (e) {
                console.error('Error cleaning expired cache:', e);
            }
        }
    };
    
    // 注册ServiceWorker，用于缓存静态资源
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }
    }
    
    // 缓存页面内容
    function cachePageContent() {
        // 只缓存文章内容
        if (document.querySelector('.post-content')) {
            const postId = window.location.pathname;
            const postContent = document.querySelector('.post-content').innerHTML;
            const postTitle = document.querySelector('.post-title').innerText;
            
            // 缓存文章内容
            localCache.set(`blog-post-${postId}`, {
                title: postTitle,
                content: postContent,
                url: window.location.href
            });
            
            // 缓存最近访问的5篇文章ID
            const recentPosts = localCache.get('blog-recent-posts') || [];
            if (!recentPosts.includes(postId)) {
                recentPosts.unshift(postId);
                if (recentPosts.length > 5) {
                    recentPosts.pop();
                }
                localCache.set('blog-recent-posts', recentPosts);
            }
        }
    }
    
    // 预填充表单数据
    function prefillForms() {
        // 如果存在评论表单，预填充用户信息
        const commentForm = document.querySelector('.comment-form');
        if (commentForm) {
            const nameInput = commentForm.querySelector('input[name="author"]');
            const emailInput = commentForm.querySelector('input[name="email"]');
            
            // 获取缓存的用户信息
            const cachedAuthor = localCache.get('blog-comment-author');
            const cachedEmail = localCache.get('blog-comment-email');
            
            // 预填充表单
            if (cachedAuthor && nameInput) nameInput.value = cachedAuthor;
            if (cachedEmail && emailInput) emailInput.value = cachedEmail;
            
            // 保存用户输入的信息
            commentForm.addEventListener('submit', function() {
                if (nameInput && nameInput.value) {
                    localCache.set('blog-comment-author', nameInput.value);
                }
                if (emailInput && emailInput.value) {
                    localCache.set('blog-comment-email', emailInput.value);
                }
            });
        }
    }
    
    // 离线浏览支持
    function setupOfflineBrowsing() {
        // 检测是否离线
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        function updateOnlineStatus() {
            const offlineNotice = document.getElementById('offline-notice');
            
            if (!navigator.onLine) {
                // 创建离线通知
                if (!offlineNotice) {
                    const notice = document.createElement('div');
                    notice.id = 'offline-notice';
                    notice.className = 'offline-notice';
                    notice.innerHTML = '您当前处于离线状态，正在显示缓存内容';
                    document.body.insertBefore(notice, document.body.firstChild);
                    
                    // 显示近期浏览的文章列表
                    showRecentPosts();
                }
            } else {
                // 移除离线通知
                if (offlineNotice) {
                    offlineNotice.remove();
                }
            }
        }
        
        // 显示最近访问的文章列表（离线时）
        function showRecentPosts() {
            const recentPosts = localCache.get('blog-recent-posts');
            if (recentPosts && recentPosts.length > 0) {
                let recentPostsHtml = '<div class="recent-posts-offline"><h3>最近浏览的文章</h3><ul>';
                
                recentPosts.forEach(postId => {
                    const post = localCache.get(`blog-post-${postId}`);
                    if (post) {
                        recentPostsHtml += `<li><a href="${post.url}">${post.title}</a></li>`;
                    }
                });
                
                recentPostsHtml += '</ul></div>';
                
                const container = document.querySelector('.container') || document.body;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = recentPostsHtml;
                container.insertBefore(tempDiv.firstChild, container.firstChild);
            }
        }
        
        // 初始检查
        updateOnlineStatus();
    }
    
    // 初始化函数
    function init() {
        // 清理过期缓存
        localCache.cleanExpired();
        
        // 注册ServiceWorker
        registerServiceWorker();
        
        // 缓存当前页面内容
        if (document.readyState === 'complete') {
            cachePageContent();
            prefillForms();
            setupOfflineBrowsing();
        } else {
            window.addEventListener('load', function() {
                cachePageContent();
                prefillForms();
                setupOfflineBrowsing();
            });
        }
    }
    
    // 启动缓存管理
    init();
})(); 