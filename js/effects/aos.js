// 滚动动画效果
(function() {
    // 加载AOS CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css';
    document.head.appendChild(css);
    
    // 加载AOS JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js';
    document.head.appendChild(script);
    
    // 等待脚本加载完成后初始化
    script.onload = function() {
        // 确保DOM已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAOS);
        } else {
            initAOS();
        }
    };
    
    function initAOS() {
        // 为文章卡片添加动画属性
        const cards = document.querySelectorAll('#home-posts .post');
        cards.forEach((card, index) => {
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());
            card.setAttribute('data-aos-duration', '800');
        });
        
        // 为侧边栏卡片添加动画
        const sideCard = document.querySelector('#home-card #card-style');
        if (sideCard) {
            sideCard.setAttribute('data-aos', 'fade-left');
            sideCard.setAttribute('data-aos-duration', '800');
        }
        
        // 为文章内容添加动画
        const contentBlocks = document.querySelectorAll('.article .content > *');
        contentBlocks.forEach((block, index) => {
            block.setAttribute('data-aos', 'fade-up');
            block.setAttribute('data-aos-delay', (index * 50).toString());
            block.setAttribute('data-aos-duration', '600');
        });
        
        // 初始化AOS
        AOS.init({
            offset: 120,
            delay: 0,
            duration: 800,
            easing: 'ease',
            once: true
        });
    }
})();