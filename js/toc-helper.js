// 文章目录功能交互

document.addEventListener('DOMContentLoaded', function() {
    // 获取目录元素
    const tocElement = document.querySelector('.article-toc');
    if (!tocElement) return; // 如果没有目录，则返回
    
    // 添加折叠按钮
    const tocTitle = tocElement.querySelector('.toc-title');
    const toggleButton = document.createElement('span');
    toggleButton.className = 'toc-toggle';
    toggleButton.innerHTML = '<i class="fa-solid fa-angle-up fa-fw"></i>';
    toggleButton.style.marginLeft = 'auto';
    toggleButton.style.cursor = 'pointer';
    tocTitle.appendChild(toggleButton);
    
    // 折叠功能
    toggleButton.addEventListener('click', function() {
        const tocContent = tocElement.querySelector('.toc-content');
        if (tocContent) {
            if (tocContent.style.display === 'none') {
                tocContent.style.display = 'block';
                toggleButton.querySelector('i').className = 'fa-solid fa-angle-up fa-fw';
            } else {
                tocContent.style.display = 'none';
                toggleButton.querySelector('i').className = 'fa-solid fa-angle-down fa-fw';
            }
        }
    });
    
    // 获取所有标题和对应的目录链接
    const headings = Array.from(document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6'));
    const tocLinks = Array.from(tocElement.querySelectorAll('a'));
    
    if (!headings.length || !tocLinks.length) return; // 如果没有标题或链接，则返回
    
    // 确保所有标题都有ID
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
    });
    
    // 记录标题ID和实际DOM元素的映射关系
    const headingMap = {};
    headings.forEach(heading => {
        headingMap[heading.id] = heading;
    });
    
    // 修复目录链接的点击行为，平滑滚动到对应标题
    tocLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标标题的ID
            const href = this.getAttribute('href');
            
            if (!href) return;
            
            let targetId = href;
            if (href.startsWith('#')) {
                targetId = href.substring(1);
            }
            
            // 尝试直接通过ID查找元素
            let targetHeading = document.getElementById(targetId);
            
            // 如果没找到，尝试通过映射表查找
            if (!targetHeading && headingMap[targetId]) {
                targetHeading = headingMap[targetId];
            }
            
            // 如果还没找到，尝试通过索引查找
            if (!targetHeading && index < headings.length) {
                targetHeading = headings[index];
            }
            
            if (targetHeading) {
                console.log(`正在滚动到 ${targetId}，实际元素:`, targetHeading);
                
                // 计算目标位置，考虑顶部导航栏的高度
                const headerHeight = 60; // 根据您的导航栏高度调整
                const targetPosition = targetHeading.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                // 平滑滚动到标题位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新URL，但不触发页面跳转
                history.pushState(null, null, `#${targetId}`);
                
                // 高亮当前目录项
                tocLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            } else {
                console.error(`未找到ID为 ${targetId} 的标题元素`);
            }
        });
    });
    
    // 监听滚动事件，高亮当前阅读位置
    let activeLink = null;
    
    function highlightTocLink() {
        // 获取当前滚动位置
        const headerHeight = 60; // 根据您的导航栏高度调整
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
            const correspondingLink = tocElement.querySelector(`a[href="#${headingId}"]`);
            
            if (correspondingLink && activeLink !== correspondingLink) {
                // 移除之前的活动状态
                if (activeLink) {
                    activeLink.classList.remove('active');
                }
                
                // 添加新的活动状态
                correspondingLink.classList.add('active');
                activeLink = correspondingLink;
                
                // 确保当前活动链接在目录可视区域内
                const tocContent = tocElement.querySelector('.toc-content');
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
    window.addEventListener('scroll', highlightTocLink);
    setTimeout(highlightTocLink, 500); // 页面加载后延迟执行一次
    
    // 添加目录固定效果
    tocElement.style.position = 'sticky';
    tocElement.style.top = '80px'; // 顶部导航栏高度 + 一些间距
    
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
            justify-content: space-between;
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