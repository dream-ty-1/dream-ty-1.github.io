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