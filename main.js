// 主应用程序类
class RevolutionHistoryApp {
    constructor() {
        this.currentQuizQuestion = 0;
        this.quizScore = 0;
        this.userAnswers = [];
        this.compatibilityManager = null;
        this.init();
    }

    // 初始化应用
    init() {
        // 等待兼容性管理器初始化
        if (window.CompatibilityManager) {
            this.compatibilityManager = new CompatibilityManager();
            console.log('兼容性管理器已初始化');
        } else {
            console.warn('兼容性管理器未找到，将在500ms后重试');
            setTimeout(() => this.init(), 500);
            return;
        }

        this.setupEventListeners();
        this.setupQuiz();
        this.createKnowledgeGraph();
        this.setupTimelineFilter();
        this.setupSmoothScrolling();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 导航菜单点击事件
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // 时间筛选器事件
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterTimeline(btn.dataset.period);
                this.updateFilterButtons(btn);
            });
        });

        // 知识图谱控制按钮事件
        document.getElementById('resetGraph')?.addEventListener('click', () => {
            this.resetGraph();
        });

        document.getElementById('expandAll')?.addEventListener('click', () => {
            this.expandGraph();
        });
    }

    // 平滑滚动到指定区域
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const filterHeight = document.querySelector('.timeline-filter')?.offsetHeight || 0;
            const offset = headerHeight + filterHeight + 20;
            
            const targetPosition = element.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // 设置平滑滚动
    setupSmoothScrolling() {
        // 为所有内部链接添加平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    // 时间轴筛选功能
    setupTimelineFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const period = btn.dataset.period;
                this.filterTimeline(period);
                
                // 更新按钮状态
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    filterTimeline(period) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            if (period === 'all' || item.dataset.period === period) {
                item.style.display = 'flex';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });

        // 添加动画效果
        setTimeout(() => {
            timelineItems.forEach(item => {
                if (item.style.display !== 'none') {
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, 50);
    }

    updateFilterButtons(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // 重置知识图谱布局
    resetGraph() {
        console.log('重置知识图谱布局');
        
        // 检查是否在降级模式
        if (this.compatibilityManager && this.compatibilityManager.shouldUseFallbackMode()) {
            // 降级模式下的重置逻辑
            const fallbackGraph = document.querySelector('.fallback-graph');
            if (fallbackGraph) {
                fallbackGraph.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        // 正常模式下的重置逻辑
        const svg = d3.select('#graphSvg');
        const simulation = d3.forceSimulation();
        
        if (svg && svg.node()) {
            // 重置缩放
            svg.transition().duration(750).call(
                d3.zoom().transform,
                d3.zoomIdentity
            );
            
            // 重置力导向图布局
            if (window.knowledgeGraphData) {
                // 重新创建力导向图模拟
                const container = document.getElementById('knowledgeGraph');
                const width = container.clientWidth;
                const height = Math.max(600, window.innerHeight * 0.6);
                
                const newSimulation = d3.forceSimulation(knowledgeGraphData.nodes)
                    .force('link', d3.forceLink(knowledgeGraphData.links).id(d => d.id).distance(150))
                    .force('charge', d3.forceManyBody().strength(-400))
                    .force('center', d3.forceCenter(width / 2, height / 2))
                    .force('collision', d3.forceCollide().radius(60))
                    .alphaDecay(0.02);
                
                // 重新启动模拟
                newSimulation.alpha(1).restart();
            }
        }
    }

    // 展开知识图谱
    expandGraph() {
        console.log('展开知识图谱');
        
        // 检查是否在降级模式
        if (this.compatibilityManager && this.compatibilityManager.shouldUseFallbackMode()) {
            // 降级模式下的展开逻辑
            const nodesList = document.querySelector('.nodes-list');
            const connectionsList = document.querySelector('.connections-list');
            
            if (nodesList) {
                nodesList.style.maxHeight = 'none';
            }
            if (connectionsList) {
                connectionsList.style.maxHeight = 'none';
            }
            return;
        }

        // 正常模式下的展开逻辑
        const simulation = d3.forceSimulation();
        
        if (simulation && window.knowledgeGraphData) {
            // 减少节点间的排斥力，让图谱更展开
            simulation.force('charge', d3.forceManyBody().strength(-200));
            simulation.alpha(1).restart();
            
            // 增加连接距离，让节点更分散
            simulation.force('link', d3.forceLink(knowledgeGraphData.links).id(d => d.id).distance(200));
        }
    }

    // 创建知识图谱
    createKnowledgeGraph() {
        console.log('开始创建知识图谱...');
        
        const container = document.getElementById('knowledgeGraph');
        if (!container) {
            console.error('知识图谱容器未找到！请检查HTML中是否有id为"knowledgeGraph"的元素');
            
            // 如果兼容性管理器存在，报告错误
            if (this.compatibilityManager) {
                this.compatibilityManager.reportError('知识图谱容器未找到');
            }
            return;
        }
        
        console.log('知识图谱容器找到，尺寸:', container.clientWidth, 'x', container.clientHeight);
        
        // 检查D3.js是否加载完成
        if (!window.d3) {
            console.warn('D3.js库尚未加载完成，将在500ms后重试');
            
            // 如果兼容性管理器存在，尝试备用CDN
            if (this.compatibilityManager) {
                this.compatibilityManager.loadD3Fallback();
            }
            
            setTimeout(() => this.createKnowledgeGraph(), 500);
            return;
        }

        // 检查知识图谱数据是否加载完成
        if (!window.knowledgeGraphData) {
            console.warn('知识图谱数据尚未加载完成，将在500ms后重试');
            
            // 如果兼容性管理器存在，尝试备用数据源
            if (this.compatibilityManager) {
                this.compatibilityManager.loadDataFallback();
            }
            
            setTimeout(() => this.createKnowledgeGraph(), 500);
            return;
        }

        console.log('D3.js和数据都已加载，开始渲染知识图谱');
        console.log('节点数量:', knowledgeGraphData.nodes.length);
        console.log('链接数量:', knowledgeGraphData.links.length);

        // 如果兼容性管理器存在，检查是否需要降级模式
        if (this.compatibilityManager && this.compatibilityManager.shouldUseFallbackMode()) {
            console.log('使用降级模式渲染知识图谱');
            this.createFallbackKnowledgeGraph();
            return;
        }

        const width = container.clientWidth;
        const height = Math.max(600, window.innerHeight * 0.6); // 自适应高度

        const svg = d3.select('#graphSvg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // 清空现有内容
        svg.selectAll('*').remove();

        // 添加缩放功能
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                svg.selectAll('g').attr('transform', event.transform);
            });

        svg.call(zoom);

        // 创建主分组用于缩放
        const g = svg.append('g');

        // 优化力导向图参数
        const simulation = d3.forceSimulation(knowledgeGraphData.nodes)
            .force('link', d3.forceLink(knowledgeGraphData.links).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-400))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(60))
            .alphaDecay(0.02); // 减慢衰减速度，让布局更稳定

        // 创建连线
        const link = g.append('g')
            .selectAll('line')
            .data(knowledgeGraphData.links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2);

        // 创建节点
        const node = g.append('g')
            .selectAll('circle')
            .data(knowledgeGraphData.nodes)
            .enter().append('circle')
            .attr('r', 10)
            .attr('fill', d => d.type === 'event' ? '#C7000B' : '#D4AF37')
            .attr('cursor', 'pointer')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))
            .on('click', (event, d) => {
                this.showNodeDescription(d);
            })
            .on('mouseover', function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr('r', 15);
            })
            .on('mouseout', function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr('r', 10);
            });

        // 添加节点标签
        const label = g.append('g')
            .selectAll('text')
            .data(knowledgeGraphData.nodes)
            .enter().append('text')
            .text(d => d.id)
            .attr('font-size', 12)
            .attr('dx', 15)
            .attr('dy', 4)
            .attr('pointer-events', 'none')
            .style('user-select', 'none');

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }


        // 初始适应屏幕
        setTimeout(() => {
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity.translate(width/2, height/2).scale(0.8)
            );
        }, 1000);
    }

    // 设置测验功能
    setupQuiz() {
        const startBtn = document.getElementById('startQuiz');
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const retryBtn = document.getElementById('retryQuiz');
        const reviewBtn = document.getElementById('reviewAnswers');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startQuiz());
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevQuestion());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.retryQuiz());
        }
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => this.reviewAnswers());
        }
    }

    startQuiz() {
        this.currentQuizQuestion = 0;
        this.quizScore = 0;
        this.userAnswers = [];
        
        document.getElementById('quizStart').style.display = 'none';
        document.getElementById('quizQuestions').style.display = 'block';
        document.getElementById('quizResult').style.display = 'none';
        
        this.displayQuestion();
    }

    displayQuestion() {
        const question = quizQuestions[this.currentQuizQuestion];
        const questionContainer = document.getElementById('questionContainer');
        const progressFill = document.getElementById('progressFill');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        
        if (!question || !questionContainer) return;

        questionContainer.innerHTML = `
            <div class="question">
                <h3>${question.question}</h3>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <label class="option">
                            <input type="radio" name="answer" value="${index}">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        // 更新进度
        const progress = ((this.currentQuizQuestion + 1) / quizQuestions.length) * 100;
        progressFill.style.width = `${progress}%`;
        currentQuestionSpan.textContent = this.currentQuizQuestion + 1;

        // 更新导航按钮状态
        this.updateQuizNavButtons();

        // 添加选项选择事件
        document.querySelectorAll('input[name="answer"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.userAnswers[this.currentQuizQuestion] = parseInt(e.target.value);
            });
        });

        // 恢复之前的选择（如果有）
        if (this.userAnswers[this.currentQuizQuestion] !== undefined) {
            const previousAnswer = this.userAnswers[this.currentQuizQuestion];
            document.querySelector(`input[value="${previousAnswer}"]`).checked = true;
        }
    }

    updateQuizNavButtons() {
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuizQuestion === 0;
        }
        
        if (nextBtn) {
            if (this.currentQuizQuestion === quizQuestions.length - 1) {
                nextBtn.textContent = '完成测验';
            } else {
                nextBtn.textContent = '下一题';
            }
        }
    }

    prevQuestion() {
        if (this.currentQuizQuestion > 0) {
            this.currentQuizQuestion--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuizQuestion < quizQuestions.length - 1) {
            this.currentQuizQuestion++;
            this.displayQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        // 计算得分
        this.quizScore = 0;
        quizQuestions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                this.quizScore += 10;
            }
        });

        // 显示结果
        document.getElementById('quizQuestions').style.display = 'none';
        document.getElementById('quizResult').style.display = 'block';
        
        const finalScore = document.getElementById('finalScore');
        const resultMessage = document.getElementById('resultMessage');
        
        if (finalScore) finalScore.textContent = this.quizScore;
        
        if (resultMessage) {
            if (this.quizScore >= 80) {
                resultMessage.textContent = '优秀！您对中国革命历史有深入的了解。';
            } else if (this.quizScore >= 60) {
                resultMessage.textContent = '良好！您对中国革命历史有较好的了解。';
            } else {
                resultMessage.textContent = '加油！建议您多学习中国革命历史知识。';
            }
        }
    }

    retryQuiz() {
        this.startQuiz();
    }

    reviewAnswers() {
        // 这里可以实现查看详细解析的功能
        alert('查看解析功能将在后续版本中实现');
    }

    // 显示节点描述信息
    showNodeDescription(node) {
        // 创建或获取模态框
        let modal = document.getElementById('nodeDescriptionModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'nodeDescriptionModal';
            modal.className = 'node-description-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle"></h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="modalDescription"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // 添加关闭事件
            modal.querySelector('.close-btn').addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // 点击模态框外部关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        // 填充内容
        const title = document.getElementById('modalTitle');
        const description = document.getElementById('modalDescription');
        
        title.textContent = node.id;
        
        let descriptionHTML = '';
        if (node.description) {
            descriptionHTML += `<p class="node-description">${node.description}</p>`;
        }
        
        if (node.type === 'event') {
            descriptionHTML += `<div class="node-info">
                <span class="info-label">类型：</span>历史事件
            </div>`;
        } else if (node.type === 'person') {
            descriptionHTML += `<div class="node-info">
                <span class="info-label">类型：</span>重要人物
            </div>`;
        }

        // 查找相关链接
        const relatedLinks = knowledgeGraphData.links.filter(link => 
            link.source.id === node.id || link.target.id === node.id
        );

        if (relatedLinks.length > 0) {
            descriptionHTML += `<div class="related-connections">
                <h4>相关联系：</h4>
                <ul>`;
            
            relatedLinks.forEach(link => {
                const relatedNode = link.source.id === node.id ? link.target : link.source;
                const relationType = link.type || '相关';
                descriptionHTML += `<li>
                    <strong>${relationType}</strong>：${relatedNode.id}
                    ${link.description ? `<br><em>${link.description}</em>` : ''}
                </li>`;
            });
            
            descriptionHTML += `</ul></div>`;
        }

        description.innerHTML = descriptionHTML;
        modal.style.display = 'flex';
    }

    // 降级模式知识图谱渲染
    createFallbackKnowledgeGraph() {
        console.log('使用降级模式创建知识图谱');
        
        const container = document.getElementById('knowledgeGraph');
        if (!container) {
            console.error('知识图谱容器未找到');
            return;
        }

        // 清空现有内容
        container.innerHTML = '';

        // 创建简单的列表视图
        const fallbackContainer = document.createElement('div');
        fallbackContainer.className = 'fallback-graph';
        fallbackContainer.innerHTML = `
            <div class="fallback-header">
                <h3>知识图谱（降级模式）</h3>
                <p>由于兼容性问题，使用列表视图显示知识图谱</p>
            </div>
            <div class="fallback-content">
                <div class="nodes-section">
                    <h4>节点列表</h4>
                    <div class="nodes-list"></div>
                </div>
                <div class="connections-section">
                    <h4>连接关系</h4>
                    <div class="connections-list"></div>
                </div>
            </div>
        `;

        container.appendChild(fallbackContainer);

        // 填充节点列表
        const nodesList = fallbackContainer.querySelector('.nodes-list');
        if (window.knowledgeGraphData && knowledgeGraphData.nodes) {
            knowledgeGraphData.nodes.forEach(node => {
                const nodeElement = document.createElement('div');
                nodeElement.className = `node-item ${node.type}`;
                nodeElement.innerHTML = `
                    <div class="node-color ${node.type}"></div>
                    <div class="node-info">
                        <strong>${node.id}</strong>
                        <span class="node-type">${node.type === 'event' ? '历史事件' : '重要人物'}</span>
                    </div>
                `;
                nodeElement.addEventListener('click', () => {
                    this.showNodeDescription(node);
                });
                nodesList.appendChild(nodeElement);
            });
        }

        // 填充连接关系
        const connectionsList = fallbackContainer.querySelector('.connections-list');
        if (window.knowledgeGraphData && knowledgeGraphData.links) {
            knowledgeGraphData.links.forEach(link => {
                const connectionElement = document.createElement('div');
                connectionElement.className = 'connection-item';
                connectionElement.innerHTML = `
                    <div class="connection-line"></div>
                    <div class="connection-info">
                        <strong>${link.source.id}</strong>
                        <span class="connection-type">${link.type || '相关'}</span>
                        <strong>${link.target.id}</strong>
                        ${link.description ? `<p class="connection-desc">${link.description}</p>` : ''}
                    </div>
                `;
                connectionsList.appendChild(connectionElement);
            });
        }

        // 添加降级模式样式
        if (!document.querySelector('#fallback-styles')) {
            const fallbackStyles = document.createElement('style');
            fallbackStyles.id = 'fallback-styles';
            fallbackStyles.textContent = `
                .fallback-graph {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }
                .fallback-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .fallback-header h3 {
                    color: #333;
                    margin-bottom: 5px;
                }
                .fallback-header p {
                    color: #666;
                    font-size: 14px;
                }
                .fallback-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .nodes-section, .connections-section {
                    background: white;
                    border-radius: 6px;
                    padding: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .nodes-section h4, .connections-section h4 {
                    margin-bottom: 15px;
                    color: #333;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 8px;
                }
                .node-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .node-item:hover {
                    background-color: #f8f9fa;
                }
                .node-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    margin-right: 10px;
                }
                .node-color.event {
                    background-color: #C7000B;
                }
                .node-color.person {
                    background-color: #D4AF37;
                }
                .node-info strong {
                    display: block;
                    font-size: 14px;
                }
                .node-type {
                    font-size: 12px;
                    color: #666;
                }
                .connection-item {
                    padding: 10px;
                    margin-bottom: 10px;
                    border-left: 3px solid #007bff;
                    background: #f8f9fa;
                    border-radius: 4px;
                }
                .connection-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .connection-type {
                    background: #007bff;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 12px;
                    font-size: 12px;
                }
                .connection-desc {
                    width: 100%;
                    margin-top: 5px;
                    font-size: 12px;
                    color: #666;
                    font-style: italic;
                }
                @media (max-width: 768px) {
                    .fallback-content {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(fallbackStyles);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new RevolutionHistoryApp();
});
