// 图标悬停动画效果
(function() {
    // 确保DOM已加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIconAnimations);
    } else {
        initIconAnimations();
    }
    
    function initIconAnimations() {
        // 为侧边栏社交图标添加悬停动画
        const socialIcons = document.querySelectorAll('#home-card #card-div .icon-links a');
        
        socialIcons.forEach(icon => {
            // 添加过渡效果
            icon.style.transition = 'transform 0.3s ease, color 0.3s ease';
            
            // 添加鼠标悬停事件监听器
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.2)';
                this.style.color = '#66afef';
            });
            
            // 添加鼠标离开事件监听器
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.color = '';
            });
        });
        
        // 为菜单项添加悬停效果
        const menuItems = document.querySelectorAll('#menu #desktop-menu a, #menu #mobile-menu a');
        
        menuItems.forEach(item => {
            // 添加过渡效果
            item.style.transition = 'transform 0.3s ease, text-shadow 0.3s ease';
            
            // 添加鼠标悬停事件监听器
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.textShadow = '0 0 8px rgba(102, 175, 239, 0.8)';
            });
            
            // 添加鼠标离开事件监听器
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.textShadow = 'none';
            });
        });
    }
})(); 