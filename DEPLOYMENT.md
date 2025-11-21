# GitHub Pages 部署指南

## 项目概述
这是一个关于中国革命历史（1840-1949）的响应式网页项目，包含时间轴、知识图谱和趣味测验功能。

## 文件结构
```
.
├── index.html          # 主页面文件
├── style.css           # 样式文件
├── main.js             # JavaScript逻辑文件
├── data.js             # 数据文件（测验题目和知识图谱数据）
├── README.md           # 项目说明文档
├── test_mobile.html    # 移动端测试页面
└── DEPLOYMENT.md       # 部署指南（本文件）
```

## 部署到 GitHub Pages

### 步骤 1：创建 GitHub 仓库
1. 登录 GitHub 账户
2. 点击右上角 "+" 号，选择 "New repository"
3. 填写仓库名称（例如：`chinese-revolution-history`）
4. 选择公开（Public）仓库
5. 勾选 "Add a README file"
6. 点击 "Create repository"

### 步骤 2：上传文件到 GitHub
1. 在仓库页面，点击 "Add file" → "Upload files"
2. 将以下文件拖拽到上传区域：
   - `index.html`
   - `style.css`
   - `main.js`
   - `data.js`
   - `README.md`
3. 点击 "Commit changes"

### 步骤 3：启用 GitHub Pages
1. 在仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分，选择 "Deploy from a branch"
4. 在 "Branch" 下拉菜单中，选择 "main" 分支
5. 选择根目录 "/ (root)"
6. 点击 "Save"

### 步骤 4：访问网站
1. 等待几分钟让 GitHub Pages 部署完成
2. 访问网址：`https://[你的用户名].github.io/[仓库名]`
3. 例如：`https://yourusername.github.io/chinese-revolution-history`

## 移动端兼容性

### 已修复的问题
- ✅ 知识图谱在移动端可见
- ✅ 测验功能在移动端正常工作
- ✅ 时间轴在移动端显示正常
- ✅ 所有样式在移动端正确加载

### 响应式设计特性
- **768px 断点**：平板设备优化
- **480px 断点**：手机设备优化
- **垂直布局**：移动端单列显示
- **触摸友好**：按钮和链接易于点击

## 功能验证

### 在部署前测试
1. 使用 `test_mobile.html` 文件测试移动端显示
2. 在浏览器开发者工具中模拟不同设备
3. 验证以下功能：
   - 知识图谱显示和交互
   - 测验功能完整流程
   - 时间轴筛选和滚动
   - 导航菜单点击

### 部署后验证
1. 在真实移动设备上访问网站
2. 测试所有交互功能
3. 检查样式是否正确加载

## 故障排除

### 常见问题
1. **样式不显示**
   - 检查文件路径是否正确
   - 确保所有文件在同一目录
   - 验证 GitHub Pages 设置

2. **JavaScript 功能不工作**
   - 检查浏览器控制台错误
   - 验证 D3.js 库是否加载
   - 确保所有脚本文件上传

3. **移动端显示异常**
   - 检查 viewport meta 标签
   - 验证 CSS 媒体查询
   - 测试不同屏幕尺寸

### 技术支持
如果遇到问题，请检查：
- GitHub Pages 部署状态
- 浏览器控制台错误信息
- 网络连接和文件加载状态

## 更新网站
要更新网站内容：
1. 修改本地文件
2. 重新上传到 GitHub 仓库
3. GitHub Pages 会自动重新部署
4. 等待几分钟后刷新页面查看更新

---

**注意**：本项目使用相对路径，所有文件应在同一目录下才能正常工作。
