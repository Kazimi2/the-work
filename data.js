
// 测验题目数据
const quizQuestions = [
    {
        id: 1,
        question: "标志着中国近代史开端的历史事件是？",
        options: [
            "鸦片战争",
            "辛亥革命", 
            "五四运动",
            "中国共产党成立"
        ],
        correctAnswer: 0,
        explanation: "1840年鸦片战争是中国近代史的开端，标志着中国开始沦为半殖民地半封建社会。"
    },
    {
        id: 2,
        question: "辛亥革命的主要领导人是谁？",
        options: [
            "毛泽东",
            "孙中山",
            "周恩来", 
            "李大钊"
        ],
        correctAnswer: 1,
        explanation: "孙中山是辛亥革命的领导人和中国民主革命的伟大先驱。"
    },
    {
        id: 3,
        question: "中国共产党成立于哪一年？",
        options: [
            "1919年",
            "1921年",
            "1927年",
            "1931年"
        ],
        correctAnswer: 1,
        explanation: "中国共产党第一次全国代表大会于1921年7月23日在上海召开。"
    },
    {
        id: 4,
        question: "打响了武装反抗国民党反动派第一枪的事件是？",
        options: [
            "秋收起义",
            "南昌起义",
            "广州起义",
            "平江起义"
        ],
        correctAnswer: 1,
        explanation: "1927年8月1日的南昌起义，标志着中国共产党独立领导革命战争和创建革命军队的开始。"
    },
    {
        id: 5,
        question: "红军长征的起止时间是？",
        options: [
            "1933年-1935年",
            "1934年-1936年", 
            "1935年-1937年",
            "1936年-1938年"
        ],
        correctAnswer: 1,
        explanation: "红军长征从1934年10月开始，到1936年10月三大主力红军会师结束。"
    },
    {
        id: 6,
        question: "抗日战争全面爆发的标志是？",
        options: [
            "九一八事变",
            "一二八事变",
            "七七事变",
            "八一三事变"
        ],
        correctAnswer: 2,
        explanation: "1937年7月7日的卢沟桥事变（七七事变）标志着中国全面抗战的开始。"
    },
    {
        id: 7,
        question: "中华人民共和国成立于哪一天？",
        options: [
            "1949年9月1日",
            "1949年10月1日",
            "1949年12月1日", 
            "1950年1月1日"
        ],
        correctAnswer: 1,
        explanation: "1949年10月1日，毛泽东在天安门城楼庄严宣告中华人民共和国成立。"
    },
    {
        id: 8,
        question: "下列哪项不是三大战役？",
        options: [
            "辽沈战役",
            "淮海战役", 
            "平津战役",
            "渡江战役"
        ],
        correctAnswer: 3,
        explanation: "三大战役包括辽沈战役、淮海战役和平津战役，渡江战役是之后的战役。"
    },
    {
        id: 9,
        question: "五四运动爆发的直接原因是？",
        options: [
            "清政府腐败",
            "巴黎和会外交失败",
            "日本侵华",
            "经济危机"
        ],
        correctAnswer: 1,
        explanation: "五四运动的直接导火索是1919年巴黎和会上中国外交的失败。"
    },
    {
        id: 10,
        question: "毛泽东思想在哪一时期形成和发展？",
        options: [
            "大革命时期",
            "土地革命时期",
            "延安时期",
            "解放战争时期"
        ],
        correctAnswer: 2,
        explanation: "毛泽东思想在延安时期（1938年-1947年）得到系统总结和多方面展开而达到成熟。"
    }
];


// 知识图谱数据 - 丰富版本
const knowledgeGraphData = {
    nodes: [
        // 主要历史事件
        { id: "鸦片战争", type: "event", year: 1840, description: "中国近代史的开端，标志着中国开始沦为半殖民地半封建社会。" },
        { id: "太平天国运动", type: "event", year: 1851, description: "中国历史上规模最大的农民起义，沉重打击了清朝统治。" },
        { id: "洋务运动", type: "event", year: 1861, description: "清朝统治阶级的自救运动，推动了中国近代化进程。" },
        { id: "甲午战争", type: "event", year: 1894, description: "中国在甲午战争中战败，签订《马关条约》，民族危机加深。" },
        { id: "戊戌变法", type: "event", year: 1898, description: "资产阶级改良运动，推动政治改革，但最终失败。" },
        { id: "义和团运动", type: "event", year: 1900, description: "反帝爱国运动，打击了帝国主义侵略势力。" },
        { id: "辛亥革命", type: "event", year: 1911, description: "推翻了中国两千多年的封建帝制，建立了亚洲第一个共和国。" },
        { id: "新文化运动", type: "event", year: 1915, description: "思想启蒙运动，提倡民主与科学，为五四运动奠定基础。" },
        { id: "五四运动", type: "event", year: 1919, description: "中国新民主主义革命的开端，标志着中国工人阶级登上政治舞台。" },
        { id: "中国共产党成立", type: "event", year: 1921, description: "中国历史上开天辟地的大事变，中国革命的面貌从此焕然一新。" },
        { id: "第一次国共合作", type: "event", year: 1924, description: "国共两党合作开展国民革命，推动北伐战争。" },
        { id: "北伐战争", type: "event", year: 1926, description: "国民革命军北伐，基本推翻了北洋军阀统治。" },
        { id: "南昌起义", type: "event", year: 1927, description: "打响了武装反抗国民党反动派的第一枪，创建了人民军队。" },
        { id: "秋收起义", type: "event", year: 1927, description: "毛泽东领导的武装起义，创建了井冈山革命根据地。" },
        { id: "井冈山会师", type: "event", year: 1928, description: "毛泽东与朱德会师，壮大了革命力量。" },
        { id: "长征", type: "event", year: 1934, description: "中国工农红军进行的战略转移，是人类历史上的伟大奇迹。" },
        { id: "遵义会议", type: "event", year: 1935, description: "确立了毛泽东在党和红军中的领导地位，是党的历史上生死攸关的转折点。" },
        { id: "西安事变", type: "event", year: 1936, description: "促成了国共第二次合作，为全民族抗战奠定了基础。" },
        { id: "抗日战争", type: "event", year: 1937, description: "中国人民反抗日本帝国主义侵略的民族解放战争。" },
        { id: "解放战争", type: "event", year: 1945, description: "中国共产党领导中国人民推翻国民党统治、建立新中国的伟大革命战争。" },
        { id: "中华人民共和国成立", type: "event", year: 1949, description: "中国人民站起来了，开启了中华民族伟大复兴的新征程。" },
        
        // 重要人物
        { id: "林则徐", type: "person", category: "思想先驱", description: "民族英雄，主持虎门销烟，被誉为近代中国开眼看世界的第一人。" },
        { id: "洪秀全", type: "person", category: "农民领袖", description: "太平天国运动的领导人，建立了与清政府对峙的农民政权。" },
        { id: "李鸿章", type: "person", category: "洋务派", description: "洋务运动的主要领导人，推动了中国近代军事和工业发展。" },
        { id: "康有为", type: "person", category: "维新派", description: "戊戌变法的领导人，主张君主立宪，推动政治改革。" },
        { id: "梁启超", type: "person", category: "维新派", description: "维新派代表人物，近代著名思想家、教育家。" },
        { id: "孙中山", type: "person", category: "革命领袖", description: "中国民主革命的伟大先驱，中华民国和中国国民党的缔造者。" },
        { id: "黄兴", type: "person", category: "革命家", description: "辛亥革命的重要领导人，与孙中山并称'孙黄'。" },
        { id: "陈独秀", type: "person", category: "思想先驱", description: "新文化运动的倡导者，中国共产党的主要创始人。" },
        { id: "李大钊", type: "person", category: "思想先驱", description: "中国共产主义的先驱，伟大的马克思主义者。" },
        { id: "胡适", type: "person", category: "思想家", description: "新文化运动的重要人物，提倡白话文运动。" },
        { id: "毛泽东", type: "person", category: "革命领袖", description: "伟大的无产阶级革命家、战略家和理论家，中国共产党、中国人民解放军和中华人民共和国的主要创立者。" },
        { id: "周恩来", type: "person", category: "革命领袖", description: "伟大的无产阶级革命家、政治家、军事家、外交家。" },
        { id: "朱德", type: "person", category: "军事将领", description: "伟大的无产阶级革命家、政治家和军事家，中国人民解放军主要创建人之一。" },
        { id: "刘少奇", type: "person", category: "革命领袖", description: "伟大的无产阶级革命家、政治家、理论家。" },
        { id: "邓小平", type: "person", category: "革命领袖", description: "伟大的无产阶级革命家、政治家、军事家、外交家，中国改革开放的总设计师。" }
    ],
    links: [
        // 事件之间的因果关系
        { source: "鸦片战争", target: "太平天国运动", type: "inspiration", description: "鸦片战争后社会矛盾激化，引发农民起义" },
        { source: "太平天国运动", target: "洋务运动", type: "inspiration", description: "太平天国运动促使清政府进行自救改革" },
        { source: "洋务运动", target: "甲午战争", type: "preparation", description: "洋务运动为甲午战争提供了军事基础" },
        { source: "甲午战争", target: "戊戌变法", type: "inspiration", description: "甲午战败激发了维新变法的要求" },
        { source: "戊戌变法", target: "义和团运动", type: "inspiration", description: "变法失败后，民众转向更激进的斗争方式" },
        { source: "义和团运动", target: "辛亥革命", type: "inspiration", description: "反帝斗争为革命创造了条件" },
        { source: "辛亥革命", target: "新文化运动", type: "inspiration", description: "辛亥革命为思想解放创造了条件" },
        { source: "新文化运动", target: "五四运动", type: "foundation", description: "新文化运动为五四运动奠定了思想基础" },
        { source: "五四运动", target: "中国共产党成立", type: "foundation", description: "五四运动促进了马克思主义传播和党的建立" },
        { source: "中国共产党成立", target: "第一次国共合作", type: "leadership", description: "党推动并参与了国共合作" },
        { source: "第一次国共合作", target: "北伐战争", type: "foundation", description: "国共合作为北伐战争奠定了基础" },
        { source: "北伐战争", target: "南昌起义", type: "inspiration", description: "北伐战争为武装斗争积累了经验" },
        { source: "南昌起义", target: "秋收起义", type: "inspiration", description: "南昌起义开创了武装斗争的新局面" },
        { source: "秋收起义", target: "井冈山会师", type: "continuation", description: "秋收起义部队与朱德部队会师" },
        { source: "井冈山会师", target: "长征", type: "preparation", description: "革命力量壮大为长征奠定了基础" },
        { source: "长征", target: "遵义会议", type: "necessity", description: "长征途中的危机促成了遵义会议的召开" },
        { source: "遵义会议", target: "西安事变", type: "influence", description: "党的正确领导影响了全国局势" },
        { source: "西安事变", target: "抗日战争", type: "foundation", description: "西安事变为全民族抗战创造了条件" },
        { source: "抗日战争", target: "解放战争", type: "preparation", description: "抗战胜利为解放战争奠定了基础" },
        { source: "解放战争", target: "中华人民共和国成立", type: "result", description: "解放战争的胜利直接导致了新中国的成立" },
        
        // 人物与事件的关系
        { source: "林则徐", target: "鸦片战争", type: "leadership", description: "林则徐是鸦片战争中的重要人物" },
        { source: "洪秀全", target: "太平天国运动", type: "leadership", description: "洪秀全是太平天国运动的领导人" },
        { source: "李鸿章", target: "洋务运动", type: "leadership", description: "李鸿章是洋务运动的主要领导人" },
        { source: "康有为", target: "戊戌变法", type: "leadership", description: "康有为是戊戌变法的领导人" },
        { source: "梁启超", target: "戊戌变法", type: "participation", description: "梁启超是戊戌变法的重要参与者" },
        { source: "孙中山", target: "辛亥革命", type: "leadership", description: "孙中山是辛亥革命的领导人" },
        { source: "黄兴", target: "辛亥革命", type: "leadership", description: "黄兴是辛亥革命的重要领导人" },
        { source: "陈独秀", target: "新文化运动", type: "leadership", description: "陈独秀是新文化运动的倡导者" },
        { source: "李大钊", target: "五四运动", type: "leadership", description: "李大钊是五四运动的重要领导人" },
        { source: "胡适", target: "新文化运动", type: "participation", description: "胡适是新文化运动的重要人物" },
        { source: "毛泽东", target: "秋收起义", type: "leadership", description: "毛泽东领导了秋收起义" },
        { source: "毛泽东", target: "井冈山会师", type: "leadership", description: "毛泽东参与领导了井冈山会师" },
        { source: "毛泽东", target: "遵义会议", type: "leadership", description: "毛泽东在遵义会议上确立了领导地位" },
        { source: "毛泽东", target: "长征", type: "leadership", description: "毛泽东领导了长征" },
        { source: "毛泽东", target: "抗日战争", type: "leadership", description: "毛泽东领导了抗日战争" },
        { source: "毛泽东", target: "解放战争", type: "leadership", description: "毛泽东领导了解放战争" },
        { source: "毛泽东", target: "中华人民共和国成立", type: "leadership", description: "毛泽东宣告了中华人民共和国成立" },
        { source: "周恩来", target: "南昌起义", type: "leadership", description: "周恩来领导了南昌起义" },
        { source: "周恩来", target: "长征", type: "participation", description: "周恩来参与了长征的领导工作" },
        { source: "周恩来", target: "西安事变", type: "mediation", description: "周恩来参与调解西安事变" },
        { source: "朱德", target: "南昌起义", type: "participation", description: "朱德参与了南昌起义" },
        { source: "朱德", target: "井冈山会师", type: "leadership", description: "朱德领导了井冈山会师" },
        { source: "朱德", target: "长征", type: "leadership", description: "朱德领导了长征" },
        { source: "刘少奇", target: "抗日战争", type: "leadership", description: "刘少奇在抗日战争中发挥了重要作用" },
        { source: "邓小平", target: "解放战争", type: "leadership", description: "邓小平在解放战争中发挥了重要作用" }
    ]
};

// 导出数据供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        quizQuestions,
        knowledgeGraphData
    };
}
