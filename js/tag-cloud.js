// 标签云动态效果和权重计算
(function() {
    // 等待DOM加载完成
    function init() {
        // 处理主标签页的标签云
        handleCategoriesTags();
        
        // 处理侧边栏的标签云
        handleSidebarTags();
    }
    
    // 处理主标签页的标签云
    function handleCategoriesTags() {
        // 标签云容器
        const container = document.querySelector('.categories-tags');
        if (!container) return;

        const items = container.querySelectorAll('span');
        if (!items.length) return;
        
        // 随机缩放和淡入动画
        items.forEach(item => {
            // 随机大小，范围从0.9到1.2
            const scale = 0.9 + Math.random() * 0.3;
            item.style.transform = `scale(${scale})`;
            
            // 鼠标悬停事件
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.zIndex = '10';
                
                // 将其他标签略微淡化
                items.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.style.opacity = '0.7';
                    }
                });
            });
            
            // 鼠标离开事件
            item.addEventListener('mouseleave', function() {
                this.style.transform = `scale(${scale})`;
                this.style.zIndex = '1';
                
                // 恢复其他标签透明度
                items.forEach(otherItem => {
                    otherItem.style.opacity = '1';
                });
            });
        });
        
        // 如果标签数量超过10个，添加轻微的悬浮效果
        if (items.length > 10) {
            let timeouts = [];
            
            function animateTags() {
                items.forEach((item, index) => {
                    // 清除之前的定时器
                    if (timeouts[index]) clearTimeout(timeouts[index]);
                    
                    // 随机延迟时间
                    const delay = 2000 + Math.random() * 5000;
                    
                    // 设置新的定时器
                    timeouts[index] = setTimeout(() => {
                        // 检查元素是否存在且没有鼠标悬停
                        if (item && !item.matches(':hover')) {
                            // 添加轻微的动画
                            const y = -5 + Math.random() * 10; // -5px to 5px
                            item.style.transform = `translateY(${y}px) scale(${scale})`;
                            
                            // 过渡完成后恢复原位，创造漂浮效果
                            setTimeout(() => {
                                if (item && !item.matches(':hover')) {
                                    item.style.transform = `scale(${scale})`;
                                }
                            }, 1500);
                        }
                        
                        // 递归调用以继续动画
                        animateTags();
                    }, delay);
                });
            }
            
            // 开始动画
            animateTags();
            
            // 在页面卸载时清除所有定时器
            window.addEventListener('beforeunload', () => {
                timeouts.forEach(timeout => {
                    if (timeout) clearTimeout(timeout);
                });
            });
        }
    }
    
    // 处理侧边栏的标签云
    function handleSidebarTags() {
        const tagCloud = document.querySelector('.sidebar-box .tags-cloud');
        if (!tagCloud) return;
        
        const tagLinks = tagCloud.querySelectorAll('a');
        if (!tagLinks.length) return;
        
        // 计算权重
        calculateTagWeights(tagLinks);
        
        // 添加3D悬浮效果
        add3DHoverEffect(tagCloud);
    }
    
    // 计算并设置标签权重
    function calculateTagWeights(tagLinks) {
        // 收集所有标签的文章计数
        const tagCounts = [];
        
        tagLinks.forEach(link => {
            // 获取标签计数（如果有的话）
            let count = 1; // 默认为1
            
            // 尝试从内容中提取数字（格式通常是 "标签名 (数量)"）
            const countMatch = link.textContent.match(/\((\d+)\)$/);
            if (countMatch && countMatch[1]) {
                count = parseInt(countMatch[1], 10);
            }
            
            tagCounts.push(count);
        });
        
        // 如果没有足够的标签或者计数，则使用默认权重
        if (tagCounts.length <= 1) {
            tagLinks.forEach(link => {
                link.setAttribute('data-weight', '5');  // 默认中等权重
            });
            return;
        }
        
        // 找出最大值和最小值
        const maxCount = Math.max(...tagCounts);
        const minCount = Math.min(...tagCounts);
        
        // 计算权重范围
        const range = maxCount - minCount;
        const step = range === 0 ? 1 : range / 10;
        
        // 为每个标签设置权重
        tagLinks.forEach((link, index) => {
            const count = tagCounts[index];
            
            // 计算1-10的权重值
            let weight;
            if (range === 0) {
                weight = 5;  // 如果所有标签数量相同，则使用中等权重
            } else {
                weight = Math.min(10, Math.max(1, Math.ceil((count - minCount) / step)));
            }
            
            // 设置data-weight属性
            link.setAttribute('data-weight', weight.toString());
        });
    }
    
    // 添加3D悬浮效果
    function add3DHoverEffect(container) {
        // 跟踪鼠标位置
        let mouseX = 0, mouseY = 0;
        let centerX = container.offsetWidth / 2;
        let centerY = container.offsetHeight / 2;
        
        // 监听鼠标移动
        container.addEventListener('mousemove', e => {
            // 获取容器相对位置
            const rect = container.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            centerX = rect.width / 2;
            centerY = rect.height / 2;
            
            // 计算偏移量（从中心点）
            const offsetX = (mouseX - centerX) / 20;
            const offsetY = (mouseY - centerY) / 20;
            
            // 应用整体变换
            container.style.transform = `perspective(600px) rotateX(${-offsetY}deg) rotateY(${offsetX}deg)`;
        });
        
        // 鼠标离开时恢复正常
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})(); 