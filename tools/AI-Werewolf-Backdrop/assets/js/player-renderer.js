/* ========================================
   玩家渲染器 - 动态渲染玩家卡片
   ======================================== */

const PlayerRenderer = {
    players: [],
    background: '',
    gameInfo: {
        title: '狼人杀对局现场',
        description: 'AI智能阵营博弈 · 昼夜交替发言'
    },
    leftContainer: null,
    rightContainer: null,

    roleIcons: {
        '预言家': '🔮',
        '女巫': '🧪',
        '猎人': '🏹',
        '守卫': '🛡️',
        '骑士': '⚔️',
        '愚者': '🎭',
        '狼人': '🐺',
        '狼王': '👑',
        '平民': '👤',
        '白痴': '🤪',
        '守墓人': '⚰️',
        '摄梦人': '💤',
        '石像鬼': '🗿',
        '机械狼': '🤖',
        '魔术师': '🎩',
        '猎魔人': '🧙'
    },

    roleColors: {
        '预言家': '#8b5cf6',
        '女巫': '#a855f7',
        '猎人': '#f59e0b',
        '守卫': '#3b82f6',
        '骑士': '#6366f1',
        '愚者': '#ec4899',
        '狼人': '#ef4444',
        '狼王': '#dc2626',
        '平民': '#38bdf8',
        '白痴': '#f472b6',
        '守墓人': '#4b5563',
        '摄梦人': '#7c3aed',
        '石像鬼': '#64748b',
        '机械狼': '#0ea5e9',
        '魔术师': '#d946ef',
        '猎魔人': '#84cc16'
    },

    async init() {
        this.leftContainer = document.getElementById('leftPlayersContainer');
        this.rightContainer = document.getElementById('rightPlayersContainer');
        
        if (!this.leftContainer || !this.rightContainer) {
            console.error('玩家容器元素未找到');
            return;
        }

        const config = await ConfigManager.init();
        this.loadFromConfig(config);
        this.render();
        this.renderGameInfo();
        this.playEntryAnimation();
        return this.background;
    },

    loadFromConfig(config) {
        if (config) {
            this.background = config.background || 'https://picsum.photos/id/1048/1920/1080';
            this.gameInfo = config.gameInfo || this.gameInfo;
            this.players = config.players.map(p => ({
                ...p,
                status: p.status || 'alive',
                votes: p.votes || 0
            }));
        }
    },

    async loadGameConfig() {
        try {
            const response = await fetch('assets/data/game-config.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.background = data.background || 'https://picsum.photos/id/1048/1920/1080';
            this.gameInfo = data.gameInfo || this.gameInfo;
        } catch (error) {
            console.error('加载游戏配置失败:', error);
            this.background = 'https://picsum.photos/id/1048/1920/1080';
        }
    },

    async loadPlayers() {
        try {
            const response = await fetch('assets/data/players.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.players = data.players.map(p => ({
                ...p,
                status: 'alive',
                votes: 0
            }));
        } catch (error) {
            console.error('加载玩家配置失败:', error);
            this.players = [];
        }
    },

    render() {
        const leftPlayers = this.players.filter(p => p.id <= 6);
        const rightPlayers = this.players.filter(p => p.id >= 7);

        this.leftContainer.innerHTML = leftPlayers.map((p, index) => this.createPlayerCard(p, index)).join('');
        this.rightContainer.innerHTML = rightPlayers.map((p, index) => this.createPlayerCard(p, index + 6)).join('');
    },

    createPlayerCard(player, index) {
        const icon = this.roleIcons[player.role] || '❓';
        const color = this.roleColors[player.role] || '#94a3b8';
        const displayRole = player.role || '未知';
        const isDead = player.status === 'dead';
        
        const statusClass = isDead ? 'opacity-50 grayscale' : '';
        const deadOverlay = isDead ? `
            <div class="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <i class="fa fa-times text-red-500 text-4xl"></i>
            </div>
        ` : '';

        return `
            <div class="role-card group relative player-card rounded-xl overflow-hidden transition-all duration-300 card-glow ${statusClass} player-card-animate" 
                 style="animation-delay: ${index * 0.1}s" 
                 data-player-id="${player.id}">
                ${deadOverlay}
                <div class="flex items-center p-3 gap-3">
                    <div class="avatar-container w-16 h-16 overflow-hidden flex-shrink-0 flex items-center justify-center rounded-lg">
                        <img src="${player.avatar}" alt="${player.name}" class="w-full h-full object-cover ${isDead ? 'grayscale' : ''}">
                    </div>
                    <div class="flex-1 min-w-0 flex flex-col gap-2">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="player-name text-lg text-white font-bold truncate">
                                ${player.name}
                            </span>
                            ${player.votes > 0 ? `<span class="vote-badge bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">${player.votes}票</span>` : ''}
                            ${isDead ? '<span class="dead-badge text-red-400 text-xs font-bold">已淘汰</span>' : ''}
                        </div>
                        <div class="role-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-bold self-start" 
                             style="background: ${color}; box-shadow: 0 2px 10px ${color}70;">
                            <span class="role-icon">${icon}</span>
                            <span class="role-text">${displayRole}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="vote-btn w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center justify-center transition-all shadow-lg" 
                                onclick="PlayerRenderer.addVote(${player.id})" title="投票+1">
                            <i class="fa fa-plus"></i>
                        </button>
                        <button class="status-btn w-8 h-8 rounded-lg ${isDead ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white text-xs flex items-center justify-center transition-all shadow-lg" 
                                onclick="PlayerRenderer.toggleStatus(${player.id})" title="${isDead ? '复活' : '淘汰'}">
                            <i class="fa ${isDead ? 'fa-heart' : 'fa-times'}"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    addVote(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.votes = (player.votes || 0) + 1;
            ConfigManager.updatePlayerVotes(playerId, player.votes);
            this.render();
        }
    },

    toggleStatus(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.status = player.status === 'dead' ? 'alive' : 'dead';
            ConfigManager.updatePlayerStatus(playerId, player.status);
            this.render();
            this.updateStatsDisplay();
        }
    },

    updateStatsDisplay() {
        const aliveCount = document.getElementById('aliveCount');
        const deadCount = document.getElementById('deadCount');
        
        if (aliveCount) {
            aliveCount.textContent = ConfigManager.getAliveCount();
        }
        if (deadCount) {
            deadCount.textContent = ConfigManager.getDeadCount();
        }
    },

    renderGameInfo() {
        const titleElement = document.getElementById('gameInfoTitle');
        const descriptionElement = document.getElementById('gameInfoDescription');
        
        if (titleElement && this.gameInfo.title) {
            titleElement.textContent = this.gameInfo.title;
        }
        
        if (descriptionElement && this.gameInfo.description) {
            descriptionElement.textContent = this.gameInfo.description;
        }
    },

    playEntryAnimation() {
        const cards = document.querySelectorAll('.player-card-animate');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    },

    refresh() {
        const config = ConfigManager.getConfig();
        this.loadFromConfig(config);
        this.render();
        this.renderGameInfo();
        this.updateStatsDisplay();
    },

    resetVotes() {
        this.players.forEach(p => {
            p.votes = 0;
        });
        this.render();
    }
};
