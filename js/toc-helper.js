// 文章目录功能交互

document.addEventListener('DOMContentLoaded', function() {
    // 获取目录元素
    const toc = document.querySelector('.article-toc');
    if (!toc) return; // 如果没有目录，则返回
    
    // 添加折叠按钮
    const tocTitle = toc.querySelector('.toc-title');
    const toggleButton = document.createElement('span');
    toggleButton.className = 'toc-toggle';
    toggleButton.innerHTML = '<i class="fa-solid fa-angle-up fa-fw"></i>';
    tocTitle.appendChild(toggleButton);
    
    // 折叠功能
    toggleButton.addEventListener('click', function() {
        toc.classList.toggle('collapsed');
        const icon = toggleButton.querySelector('i');
        
        if (toc.classList.contains('collapsed')) {
            icon.className = 'fa-solid fa-angle-down fa-fw';
        } else {
            icon.className = 'fa-solid fa-angle-up fa-fw';
        }
    });
    
    // 获取所有标题和对应的目录链接
    const headings = Array.from(document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6'));
    const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
    
    if (!headings.length || !tocLinks.length) return; // 如果没有标题或链接，则返回
    
    // 设置目录初始位置
    const sidebar = document.getElementById('sidebar');
    const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;
    let tocWidth = sidebarRect ? sidebarRect.width : 280;
    let tocInitialTop = 0;
    
    if (toc) {
        tocInitialTop = toc.offsetTop;
    }
    
    // 修复目录链接的点击行为，平滑滚动到对应标题
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标标题的ID
            const targetId = this.getAttribute('href').substring(1);
            const targetHeading = document.getElementById(targetId);
            
            if (targetHeading) {
                // 平滑滚动到标题位置
                window.scrollTo({
                    top: targetHeading.offsetTop - 80, // 减去导航栏高度
                    behavior: 'smooth'
                });
                
                // 高亮当前目录项
                tocLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        // 固定目录
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (toc) {
            if (scrollTop > tocInitialTop) {
                toc.classList.add('fixed');
                toc.style.width = tocWidth + 'px';
            } else {
                toc.classList.remove('fixed');
                toc.style.width = '';
            }
        }
        
        // 更新当前阅读位置
        let currentHeadingIndex = -1;
        
        // 寻找当前可见的标题
        headings.forEach((heading, index) => {
            const rect = heading.getBoundingClientRect();
            // 如果标题在视窗的顶部附近，就认为这是当前阅读的部分
            if (rect.top <= 100) {
                currentHeadingIndex = index;
            }
        });
        
        // 如果找到当前标题，更新目录高亮
        if (currentHeadingIndex >= 0) {
            const currentHeadingId = headings[currentHeadingIndex].id;
            
            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentHeadingId) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    // 初始触发一次滚动事件，以设置初始状态
    window.dispatchEvent(new Event('scroll'));
    
    // 监听窗口大小变化，更新目录宽度
    window.addEventListener('resize', function() {
        if (sidebar) {
            const newRect = sidebar.getBoundingClientRect();
            tocWidth = newRect.width;
            
            if (toc.classList.contains('fixed')) {
                toc.style.width = tocWidth + 'px';
            }
        }
    });
});

// 目录辅助功能：平滑滚动和高亮当前阅读位置
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否存在目录元素
    const tocElement = document.querySelector('.article-toc');
    if (!tocElement) return;
    
    const tocLinks = tocElement.querySelectorAll('a');
    const headings = document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6');
    const headerHeight = 60; // 顶部导航栏高度，根据实际情况调整
    
    // 为目录链接添加平滑滚动效果
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标标题的ID
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 计算目标位置，考虑顶部导航栏的高度
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新URL，但不触发页面跳转
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
    
    // 监听滚动事件，高亮当前阅读位置
    let activeLink = null;
    
    function highlightTocLink() {
        // 获取当前滚动位置
        const scrollPosition = window.scrollY + headerHeight + 100; // 添加一些偏移量以提前高亮
        
        // 找到当前可见的最上面的标题
        let currentHeading = null;
        
        for (const heading of headings) {
            const headingPosition = heading.offsetTop;
            
            if (headingPosition <= scrollPosition) {
                currentHeading = heading;
            } else {
                break;
            }
        }
        
        if (currentHeading) {
            // 找到对应的目录链接
            const headingId = currentHeading.id;
            const correspondingLink = document.querySelector(`.article-toc a[href="#${headingId}"]`);
            
            if (correspondingLink && activeLink !== correspondingLink) {
                // 移除之前的活动状态
                if (activeLink) {
                    activeLink.classList.remove('active');
                }
                
                // 添加新的活动状态
                correspondingLink.classList.add('active');
                activeLink = correspondingLink;
                
                // 确保当前活动链接在目录可视区域内
                const tocContent = document.querySelector('.toc-content');
                if (tocContent) {
                    const linkRect = correspondingLink.getBoundingClientRect();
                    const tocRect = tocContent.getBoundingClientRect();
                    
                    if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
                        correspondingLink.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            }
        }
    }
    
    // 页面加载时和滚动时都执行高亮
    highlightTocLink();
    window.addEventListener('scroll', highlightTocLink);
    
    // 添加目录固定效果
    const articleContainer = document.querySelector('.article-container');
    const article = document.querySelector('.article');
    
    if (articleContainer && article) {
        // 计算目录的初始位置
        const articleRect = article.getBoundingClientRect();
        const tocRect = tocElement.getBoundingClientRect();
        
        // 设置目录的固定位置
        tocElement.style.position = 'sticky';
        tocElement.style.top = `${headerHeight + 20}px`; // 顶部导航栏高度 + 一些间距
    }
    
    // 添加目录样式
    const style = document.createElement('style');
    style.textContent = `
        .article-toc {
            background: rgba(30, 30, 30, 0.6);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
            max-height: calc(100vh - 120px);
            overflow-y: auto;
        }
        
        .article-toc .toc-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 10px;
            color: #66afef;
            display: flex;
            align-items: center;
        }
        
        .article-toc .toc-title i {
            margin-right: 8px;
        }
        
        .article-toc .toc-content {
            font-size: 0.9rem;
        }
        
        .article-toc .toc-content ol {
            padding-left: 20px;
            margin: 5px 0;
        }
        
        .article-toc .toc-content a {
            color: #e0e0e0;
            text-decoration: none;
            transition: all 0.3s ease;
            display: block;
            padding: 3px 0;
            border-left: 2px solid transparent;
            padding-left: 10px;
            margin-left: -10px;
        }
        
        .article-toc .toc-content a:hover {
            color: #66afef;
        }
        
        .article-toc .toc-content a.active {
            color: #66afef;
            border-left: 2px solid #66afef;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}); 