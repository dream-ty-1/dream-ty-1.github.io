/**
 * 音乐播放器功能 
 * 支持对网易云音乐链接的处理及音乐播放
 */

function initMusicPlayer() {
    const musicPlayerContainer = document.getElementById('music-player-container');
    const musicPlayer = document.getElementById('music-player');
    const playerCover = document.getElementById('player-cover');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const closePlayerBtn = document.getElementById('close-player');
    const playButtons = document.querySelectorAll('.play-btn');
    
    // 存储当前播放的音乐信息
    let currentMusicInfo = null;
    
    // 点击播放按钮事件
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const musicUrl = this.getAttribute('data-music-url');
            const musicName = this.getAttribute('data-music-name');
            const musicArtist = this.getAttribute('data-music-artist');
            const musicCover = this.getAttribute('data-music-cover');
            
            // 处理网易云音乐链接
            const songId = extractNeteaseMusicId(musicUrl);
            if (songId) {
                // 设置播放器信息
                playerTitle.textContent = musicName;
                playerArtist.textContent = musicArtist;
                playerCover.src = musicCover;
                
                // 存储当前播放的音乐信息
                currentMusicInfo = {
                    id: songId,
                    name: musicName,
                    artist: musicArtist,
                    cover: musicCover
                };
                
                // 尝试获取音乐URL并播放
                playNeteaseMusicById(songId);
                
                // 显示播放器
                showMusicPlayer();
            }
        });
    });
    
    // 关闭播放器按钮事件
    closePlayerBtn.addEventListener('click', function() {
        // 停止播放
        musicPlayer.pause();
        musicPlayer.currentTime = 0;
        
        // 隐藏播放器
        hideMusicPlayer();
    });
    
    // 提取网易云音乐ID
    function extractNeteaseMusicId(url) {
        if (!url) return null;
        
        // 网易云音乐链接格式：https://music.163.com/#/song?id=XXXX
        const idMatch = url.match(/id=(\d+)/);
        if (idMatch && idMatch[1]) {
            return idMatch[1];
        }
        
        return null;
    }
    
    // 通过ID播放网易云音乐（使用外部API）
    function playNeteaseMusicById(songId) {
        if (!songId) return;
        
        // 这里使用一个公共的音乐API来获取音频源
        // 注意：这个API可能不稳定，实际使用时可能需要替换为其他可用的API
        const audioUrl = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
        
        // 设置音频源并播放
        musicPlayer.src = audioUrl;
        
        // 当元数据加载完成后开始播放
        musicPlayer.addEventListener('loadedmetadata', function() {
            musicPlayer.play()
                .then(() => {
                    // 播放成功
                    console.log('Music playing:', currentMusicInfo?.name);
                })
                .catch(err => {
                    // 处理播放错误
                    console.error('Play failed:', err);
                    showPlaybackError();
                });
        }, { once: true });
        
        // 处理加载错误
        musicPlayer.addEventListener('error', function() {
            console.error('Failed to load audio source');
            showPlaybackError();
        }, { once: true });
    }
    
    // 显示播放器
    function showMusicPlayer() {
        musicPlayerContainer.classList.remove('hidden');
        musicPlayerContainer.classList.add('show');
    }
    
    // 隐藏播放器
    function hideMusicPlayer() {
        musicPlayerContainer.classList.remove('show');
        musicPlayerContainer.classList.add('hidden');
    }
    
    // 显示播放错误提示
    function showPlaybackError() {
        playerTitle.innerHTML = `${currentMusicInfo?.name} <span class="error-text">(播放失败)</span>`;
        
        // 显示错误信息和原始链接
        const errorDiv = document.createElement('div');
        errorDiv.className = 'player-error';
        errorDiv.innerHTML = `<a href="${currentMusicInfo?.originalUrl}" target="_blank" rel="noopener noreferrer">
            <i class="fa-solid fa-external-link-alt fa-fw"></i> 前往原始页面收听
        </a>`;
        
        // 清空之前的错误信息
        document.querySelectorAll('.player-error').forEach(el => el.remove());
        
        // 添加错误信息
        document.querySelector('.player-details').appendChild(errorDiv);
    }
    
    // 音乐播放结束事件
    musicPlayer.addEventListener('ended', function() {
        // 可以在这里实现自动播放下一首等功能
        console.log('Music playback ended');
    });
}

// 如果是在页面加载后直接初始化
document.addEventListener('DOMContentLoaded', function() {
    // 如果不是在收藏页面，则不初始化播放器
    if (!document.getElementById('collections-container')) return;
    
    // 延迟初始化，确保页面完全加载
    setTimeout(function() {
        if (typeof initMusicPlayer === 'function' && !window.musicPlayerInitialized) {
            initMusicPlayer();
            window.musicPlayerInitialized = true;
        }
    }, 100);
}); 