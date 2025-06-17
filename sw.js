/**
 * 博客ServiceWorker
 * 用于缓存静态资源，提供离线访问能力
 */

// 缓存版本号，更改此值会使旧缓存失效
const CACHE_VERSION = '1.0.0';
const CACHE_NAME = `blog-cache-${CACHE_VERSION}`;

// 需要缓存的静态资源列表
const STATIC_CACHE_URLS = [
  '/',
  '/css/main.css',
  '/css/optimize/critical.css',
  '/js/main.js',
  '/js/optimize/lazyload.js',
  '/js/optimize/resource-optimizer.js',
  '/js/optimize/cache-manager.js',
  '/images/avatar.webp',
  '/404.html'
];

// 安装事件 - 预缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: 预缓存静态资源');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // 立即激活，不等待旧的ServiceWorker终止
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            // 清理不是当前版本的缓存
            return cacheName.startsWith('blog-cache-') && cacheName !== CACHE_NAME;
          }).map(cacheName => {
            console.log('Service Worker: 清理旧缓存', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        // 确保新的ServiceWorker立即接管所有客户端
        return self.clients.claim();
      })
  );
});

// 缓存优先，网络回退策略
async function cacheFirstStrategy(request) {
  // 尝试从缓存中获取
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // 缓存命中
    return cachedResponse;
  }

  // 缓存未命中，从网络获取
  try {
    const networkResponse = await fetch(request);
    
    // 检查是否是有效的响应
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
      return networkResponse;
    }
    
    // 复制响应，因为响应是流，只能使用一次
    const responseToCache = networkResponse.clone();
    
    // 判断请求类型，选择是否缓存
    if (isAssetRequest(request.url) || isHtmlRequest(request.url)) {
      caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(request, responseToCache);
        });
    }
    
    return networkResponse;
  } catch (error) {
    // 网络请求失败，返回通用错误页面
    console.error('Service Worker: 网络请求失败', error);
    
    // 如果是HTML请求，可以返回离线页面
    if (isHtmlRequest(request.url)) {
      return caches.match('/404.html');
    }
    
    // 否则返回失败
    throw error;
  }
}

// 判断是否是资源请求
function isAssetRequest(url) {
  return /\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|ico)$/.test(url);
}

// 判断是否是HTML请求
function isHtmlRequest(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname === '/' || 
         parsedUrl.pathname.endsWith('/') || 
         parsedUrl.pathname.endsWith('.html');
}

// 网络优先，缓存回退策略
async function networkFirstStrategy(request) {
  try {
    // 尝试从网络获取
    const networkResponse = await fetch(request);
    
    // 检查是否是有效的响应
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
      return networkResponse;
    }
    
    // 复制响应，因为响应是流，只能使用一次
    const responseToCache = networkResponse.clone();
    
    // 更新缓存
    caches.open(CACHE_NAME)
      .then(cache => {
        cache.put(request, responseToCache);
      });
    
    return networkResponse;
  } catch (error) {
    // 网络请求失败，尝试从缓存获取
    console.log('Service Worker: 网络请求失败，尝试从缓存获取', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果是HTML请求，可以返回离线页面
    if (isHtmlRequest(request.url)) {
      return caches.match('/404.html');
    }
    
    // 否则返回失败
    throw error;
  }
}

// 根据请求类型选择缓存策略
function determineStrategy(request) {
  const url = new URL(request.url);
  
  // API请求使用网络优先
  if (url.pathname.startsWith('/api/')) {
    return networkFirstStrategy(request);
  }
  
  // HTML页面使用网络优先
  if (isHtmlRequest(request.url)) {
    return networkFirstStrategy(request);
  }
  
  // 静态资源使用缓存优先
  if (isAssetRequest(request.url)) {
    return cacheFirstStrategy(request);
  }
  
  // 默认使用缓存优先
  return cacheFirstStrategy(request);
}

// 拦截fetch请求
self.addEventListener('fetch', event => {
  // 只处理GET请求
  if (event.request.method !== 'GET') return;
  
  // 跳过非同源请求
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  
  // 响应请求
  event.respondWith(determineStrategy(event.request));
}); 