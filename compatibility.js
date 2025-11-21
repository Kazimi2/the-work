/**
 * 兼容性改进模块
 * 为GitHub Pages部署提供更好的兼容性和错误处理
 */

class CompatibilityManager {
    constructor() {
        this.retryCount = 0;
        this.maxRetries = 3;
        this.init();
    }

    init() {
        this.setupErrorHandling();
        this.setupLoadingStates();
        this.setupNetworkMonitoring();
        this.setupFallbackStrategies();
    }

    // 设置全局错误处理
    setupErrorHandling() {
        // 捕获未处理的Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            console.error('未处理的Promise拒绝:', event.reason);
            this.handleError('脚本执行错误', event.reason);
        });

        // 捕获全局错误
        window.addEventListener('error', (event) => {
            console.error('全局错误:', event.error);
            this.handleError('页面加载错误', event.error);
        });

        // 捕获资源加载失败
        window.addEventListener('error', (event) => {
            if (event.target && event.target.tagName) {
                const tagName = event.target.tagName.toLowerCase();
                if (['script', 'link', 'img'].includes(tagName)) {
                    console.error(`资源加载失败: ${event.target.src || event.target.href}`);
                    this.handleResourceError(event.target);
                }
            }
        }, true);
    }

    // 设置加载状态
    setupLoadingStates() {
        // 添加全局加载指示器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'globalLoading';
        loadingIndicator.innerHTML = `
            <div class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>正在加载革命历史知识...</p>
            </div>
        `;
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        
        const overlayStyle = document.createElement('style');
        overlayStyle.textContent = `
            .loading-overlay {
                text-align: center;
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #C7000B;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(overlayStyle);
        document.body.appendChild(loadingIndicator);

        // 显示加载状态
        this.showLoading = () => {
            document.getElementById('globalLoading').style.display = 'flex';
        };

        // 隐藏加载状态
        this.hideLoading = () => {
            document.getElementById('globalLoading').style.display = 'none';
        };
    }

    // 设置网络监控
    setupNetworkMonitoring() {
        // 监听网络状态变化
        window.addEventListener('online', () => {
            console.log('网络连接恢复');
            this.showNotification('网络连接已恢复', 'success');
        });

        window.addEventListener('offline', () => {
            console.log('网络连接断开');
            this.showNotification('网络连接已断开，部分功能可能无法使用', 'warning');
        });

        // 检查初始网络状态
        if (!navigator.onLine) {
            this.showNotification('当前处于离线状态，部分功能可能无法使用', 'warning');
        }
    }

    // 设置备用策略
    setupFallbackStrategies() {
        // D3.js备用加载策略
        this.setupD3Fallback();
        
        // 数据备用策略
        this.setupDataFallback();
        
        // 功能降级策略
        this.setupGracefulDegradation();
    }

    // D3.js备用加载策略
    setupD3Fallback() {
        // 如果CDN加载失败，尝试备用CDN
        const originalD3Script = document.querySelector('script[src*="d3js.org"]');
        if (originalD3Script) {
            originalD3Script.onerror = () => {
                console.warn('D3.js CDN加载失败，尝试备用CDN...');
                
                // 移除失败的脚本
                originalD3Script.remove();
                
                // 添加备用CDN
                const fallbackScript = document.createElement('script');
                fallbackScript.src = 'https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js';
                fallbackScript.onload = () => {
                    console.log('D3.js备用CDN加载成功');
                    this.retryKnowledgeGraph();
                };
                fallbackScript.onerror = () => {
                    console.error('所有D3.js CDN都加载失败');
                    this.showNotification('可视化库加载失败，知识图谱功能不可用', 'error');
                };
                document.head.appendChild(fallbackScript);
            };
        }
    }

    // 数据备用策略
    setupDataFallback() {
        // 如果data.js加载失败，使用内置的简化数据
        window.addEventListener('error', (event) => {
            if (event.target && event.target.src && event.target.src.includes('data.js')) {
                console.warn('data.js加载失败，使用内置简化数据');
                this.loadFallbackData();
            }
        });
    }

    // 加载备用数据
    loadFallbackData() {
        // 简化的知识图谱数据
        window.knowledgeGraphData = {
            nodes: [
                { id: "鸦片战争", type: "event", description: "中国近代史的开端" },
                { id: "辛亥革命", type: "event", description: "推翻封建帝制" },
                { id: "五四运动", type: "event", description: "新民主主义革命开端" },
                { id: "中国共产党成立", type: "event", description: "中国革命新起点" },
                { id: "抗日战争", type: "event", description: "民族解放战争" },
                { id: "解放战争", type: "event", description: "建立新中国" },
                { id: "林则徐", type: "person", description: "民族英雄" },
                { id: "孙中山", type: "person", description: "革命先驱" },
                { id: "毛泽东", type: "person", description: "革命领袖" }
            ],
            links: [
                { source: "鸦片战争", target: "辛亥革命", type: "inspiration" },
                { source: "辛亥革命", target: "五四运动", type: "inspiration" },
                { source: "五四运动", target: "中国共产党成立", type: "foundation" },
                { source: "中国共产党成立", target: "抗日战争", type: "leadership" },
                { source: "抗日战争", target: "解放战争", type: "continuation" },
                { source: "林则徐", target: "鸦片战争", type: "participation" },
                { source: "孙中山", target: "辛亥革命", type: "leadership" },
                { source: "毛泽东", target: "解放战争", type: "leadership" }
            ]
        };

        // 简化的测验数据
        window.quizQuestions = [
            {
                question: "标志着中国近代史开端的历史事件是？",
                options: ["鸦片战争", "辛亥革命", "五四运动", "中国共产党成立"],
                correctAnswer: 0
            },
            {
                question: "中华人民共和国成立于哪一年？",
                options: ["1945年", "1949年", "1950年", "1951年"],
                correctAnswer: 1
            }
        ];

        console.log('备用数据加载完成');
    }

    // 功能降级策略
    setupGracefulDegradation() {
        // 如果D3.js完全不可用，提供降级方案
        const checkD3Availability = setInterval(() => {
            if (document.readyState === 'complete') {
                clearInterval(checkD3Availability);
                
                setTimeout(() => {
                    if (!window.d3) {
                        console.warn('D3.js不可用，启用降级模式');
                        this.enableFallbackMode();
                    }
                }, 5000); // 5秒后检查
            }
        }, 100);
    }

    // 启用降级模式
    enableFallbackMode() {
        const knowledgeSection = document.getElementById('knowledge');
        if (knowledgeSection) {
            const graphContainer = document.getElementById('knowledgeGraph');
            if (graphContainer) {
                graphContainer.innerHTML = `
                    <div class="fallback-content" style="text-align: center; padding: 2rem;">
                        <h3>知识图谱功能暂时不可用</h3>
                        <p>由于网络或浏览器兼容性问题，知识图谱无法正常显示。</p>
                        <p>您可以：</p>
                        <ul style="text-align: left; display: inline-block;">
                            <li>刷新页面重试</li>
                            <li>检查网络连接</li>
                            <li>使用现代浏览器访问</li>
                            <li>查看下方的时间轴了解历史事件</li>
                        </ul>
                        <button onclick="location.reload()" style="
                            background: #C7000B;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 4px;
                            cursor: pointer;
                            margin-top: 1rem;
                        ">刷新页面</button>
                    </div>
                `;
            }
        }
    }

    // 重试知识图谱创建
    retryKnowledgeGraph() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`重试创建知识图谱 (${this.retryCount}/${this.maxRetries})`);
            
            setTimeout(() => {
                if (window.RevolutionHistoryApp && window.RevolutionHistoryApp.instance) {
                    window.RevolutionHistoryApp.instance.createKnowledgeGraph();
                }
            }, 1000 * this.retryCount);
        }
    }

    // 错误处理
    handleError(type, error) {
        console.error(`${type}:`, error);
        
        // 在生产环境中可以发送错误报告
        if (window.location.hostname !== 'localhost') {
            this.reportError(type, error);
        }

        // 显示用户友好的错误信息
        if (type.includes('D3') || type.includes('知识图谱')) {
            this.showNotification('知识图谱加载遇到问题，正在尝试修复...', 'warning');
        }
    }

    // 资源错误处理
    handleResourceError(resource) {
        const resourceType = resource.tagName.toLowerCase();
        console.warn(`${resourceType}资源加载失败:`, resource.src || resource.href);
        
        // 可以根据资源类型采取不同的处理策略
        if (resourceType === 'script' && resource.src.includes('d3')) {
            this.setupD3Fallback();
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `compatibility-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // 添加样式
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .compatibility-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-left: 4px solid #007bff;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-radius: 4px;
                    padding: 1rem;
                    max-width: 400px;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                }
                .compatibility-notification.success {
                    border-left-color: #28a745;
                }
                .compatibility-notification.warning {
                    border-left-color: #ffc107;
                }
                .compatibility-notification.error {
                    border-left-color: #dc3545;
                }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .notification-message {
                    flex: 1;
                    margin-right: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #666;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // 添加关闭事件
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // 自动关闭
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // 错误报告（简化版）
    reportError(type, error) {
        // 在实际项目中，这里可以发送错误报告到服务器
        console.log('错误报告:', { type, error: error?.message, timestamp: new Date().toISOString() });
    }
}

// 页面加载完成后初始化兼容性管理器
document.addEventListener('DOMContentLoaded', () => {
    window.CompatibilityManager = new CompatibilityManager();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompatibilityManager;
}
