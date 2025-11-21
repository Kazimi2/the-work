// 主应用程序类
class RevolutionHistoryApp {
    constructor() {
        this.currentQuizQuestion = 0;
        this.quizScore = 0;
        this.userAnswers = [];
        this.init();
    }

    // 初始化应用
    init() {
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

    // 创建知识图谱
    createKnowledgeGraph() {
        const container = document.getElementById('knowledgeGraph');
        if (!container || !window.d3) return;

        const width = container.clientWidth;
        const height = 600;

        const svg = d3.select('#graphSvg')
            .attr('width', width)
            .attr('height', height);

        // 清空现有内容
        svg.selectAll('*').remove();

        const simulation = d3.forceSimulation(knowledgeGraphData.nodes)
            .force('link', d3.forceLink(knowledgeGraphData.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // 创建连线
        const link = svg.append('g')
            .selectAll('line')
            .data(knowledgeGraphData.links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2);

        // 创建节点
        const node = svg.append('g')
            .selectAll('circle')
            .data(knowledgeGraphData.nodes)
            .enter().append('circle')
            .attr('r', 8)
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
                    .attr('r', 12);
            })
            .on('mouseout', function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr('r', 8);
            });

        // 添加节点标签
        const label = svg.append('g')
            .selectAll('text')
            .data(knowledgeGraphData.nodes)
            .enter().append('text')
            .text(d => d.id)
            .attr('font-size', 12)
            .attr('dx', 12)
            .attr('dy', 4);

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

        // 添加图谱控制功能
        document.getElementById('resetGraph')?.addEventListener('click', () => {
            simulation.alpha(1).restart();
        });

        document.getElementById('expandAll')?.addEventListener('click', () => {
            simulation.force('charge', d3.forceManyBody().strength(-100));
            simulation.alpha(1).restart();
        });
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
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new RevolutionHistoryApp();
});
