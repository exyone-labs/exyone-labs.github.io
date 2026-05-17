/* ========================================
   配置管理器 - 导入/导出/本地存储
   ======================================== */

const ConfigManager = {
    STORAGE_KEY: 'ai-werewolf-config',
    STATS_KEY: 'ai-werewolf-stats',
    
    defaultConfig: null,
    currentConfig: null,
    stats: {
        goodWins: 0,
        wolfWins: 0,
        currentRound: 1,
        phaseHistory: []
    },

    async init() {
        await this.loadDefaultConfig();
        this.loadStats();
        this.loadFromStorage();
        return this.currentConfig;
    },

    async loadDefaultConfig() {
        try {
            const [gameConfigRes, playersRes] = await Promise.all([
                fetch('assets/data/game-config.json'),
                fetch('assets/data/players.json')
            ]);
            
            const gameConfig = await gameConfigRes.json();
            const playersData = await playersRes.json();
            
            this.defaultConfig = {
                background: gameConfig.background || 'https://picsum.photos/id/1048/1920/1080',
                gameInfo: gameConfig.gameInfo || {
                    title: 'AI狼人杀 - 第1局',
                    description: '预女猎白12人经典版型'
                },
                font: gameConfig.font || {
                    family: 'Source Han Sans VF',
                    cdn: 'https://hanzi.itedev.com/fonts/Source+Han+Sans+VF/result.css'
                },
                players: playersData.players || [],
                currentRound: 1,
                currentPhase: 'day',
                phaseDay: 1
            };
            
            this.currentConfig = JSON.parse(JSON.stringify(this.defaultConfig));
        } catch (error) {
            console.error('加载默认配置失败:', error);
            this.defaultConfig = this.getFallbackConfig();
            this.currentConfig = JSON.parse(JSON.stringify(this.defaultConfig));
        }
    },

    getFallbackConfig() {
        return {
            background: 'https://picsum.photos/id/1048/1920/1080',
            gameInfo: {
                title: 'AI狼人杀 - 第1局',
                description: '预女猎白12人经典版型'
            },
            font: {
                family: 'Noto Sans SC',
                cdn: 'https://hanzi.itedev.com/fonts/Noto+Sans+SC/result.css'
            },
            players: [],
            currentRound: 1,
            currentPhase: 'day',
            phaseDay: 1,
            currentStyle: 'minimal'
        };
    },

    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.currentConfig = { ...this.defaultConfig, ...parsed };
            }
        } catch (error) {
            console.error('加载本地存储失败:', error);
        }
    },

    saveToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentConfig));
        } catch (error) {
            console.error('保存到本地存储失败:', error);
        }
    },

    loadStats() {
        try {
            const saved = localStorage.getItem(this.STATS_KEY);
            if (saved) {
                this.stats = JSON.parse(saved);
            }
        } catch (error) {
            console.error('加载统计数据失败:', error);
        }
    },

    saveStats() {
        try {
            localStorage.setItem(this.STATS_KEY, JSON.stringify(this.stats));
        } catch (error) {
            console.error('保存统计数据失败:', error);
        }
    },

    getConfig() {
        return this.currentConfig;
    },

    updateConfig(newConfig) {
        this.currentConfig = { ...this.currentConfig, ...newConfig };
        this.saveToStorage();
    },

    updatePlayers(players) {
        this.currentConfig.players = players;
        this.saveToStorage();
    },

    updatePlayerStatus(playerId, status) {
        const player = this.currentConfig.players.find(p => p.id === playerId);
        if (player) {
            player.status = status;
            this.saveToStorage();
        }
    },

    updatePlayerVotes(playerId, votes) {
        const player = this.currentConfig.players.find(p => p.id === playerId);
        if (player) {
            player.votes = votes;
            this.saveToStorage();
        }
    },

    updateFont(fontConfig) {
        this.currentConfig.font = fontConfig;
        this.saveToStorage();
    },

    getFont() {
        return this.currentConfig.font || {
            family: 'Noto Sans SC',
            cdn: 'https://hanzi.itedev.com/fonts/Noto+Sans+SC/result.css'
        };
    },

    resetToDefault() {
        this.currentConfig = JSON.parse(JSON.stringify(this.defaultConfig));
        localStorage.removeItem(this.STORAGE_KEY);
        return this.currentConfig;
    },

    clearStorage() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.STATS_KEY);
        this.stats = {
            goodWins: 0,
            wolfWins: 0,
            currentRound: 1,
            phaseHistory: []
        };
    },

    exportConfig() {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            config: this.currentConfig,
            stats: this.stats
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-werewolf-config-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    async importConfig(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (imported.config) {
                        this.currentConfig = { ...this.defaultConfig, ...imported.config };
                        this.saveToStorage();
                    }
                    if (imported.stats) {
                        this.stats = { ...this.stats, ...imported.stats };
                        this.saveStats();
                    }
                    resolve(this.currentConfig);
                } catch (error) {
                    reject(new Error('无效的配置文件格式'));
                }
            };
            reader.onerror = () => reject(new Error('读取文件失败'));
            reader.readAsText(file);
        });
    },

    recordWin(faction) {
        if (faction === 'good') {
            this.stats.goodWins++;
        } else if (faction === 'wolf') {
            this.stats.wolfWins++;
        }
        this.saveStats();
    },

    resetCurrentGame() {
        this.currentConfig.players.forEach(p => {
            p.status = 'alive';
            p.votes = 0;
        });
        this.currentConfig.phaseDay = 1;
        this.saveToStorage();
    },

    nextPhase() {
        const current = this.currentConfig.currentPhase;
        if (current === 'day') {
            this.currentConfig.currentPhase = 'night';
        } else {
            this.currentConfig.currentPhase = 'day';
            this.currentConfig.phaseDay++;
        }
        this.saveToStorage();
        return {
            phase: this.currentConfig.currentPhase,
            day: this.currentConfig.phaseDay
        };
    },

    getAliveCount() {
        return this.currentConfig.players.filter(p => p.status !== 'dead').length;
    },

    getDeadCount() {
        return this.currentConfig.players.filter(p => p.status === 'dead').length;
    },

    getStats() {
        return this.stats;
    }
};
