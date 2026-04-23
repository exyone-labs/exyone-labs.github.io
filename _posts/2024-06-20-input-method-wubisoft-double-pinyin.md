---
title: "Input Method Evolution: From Wubi to Shuangpin, A Farewell We Had to Make"
date: 2024-06-20
categories: [Technology]
tags: [productivity, tutorial]
lang: en-zh
---

> *The best input method is the one that suits you.*
> {: .prompt-tip }

I was once a die-hard fan of the **1986 version of Wubi** (Five-Stroke). Names like Wubi Jiajia, Xiaoye Wubi, Jidian Wubi... they were like old friends. The rhythm of typing on the keyboard was as familiar as breathing.

The origins of Wubi Zhixing (Five-Stroke Input Method) date back to 1978. Wang Yongmin began researching Chinese character input technology in Nanyang. After five years of experimentation, he finally broke down Chinese characters into over 130 basic radicals, distributed across 25 letter keys on a standard English keyboard (the Z key was used as a learning key). On August 28, 1983, this scheme was approved. After another two years of improvement, it was finalized and officially promoted in 1986, hence the name "1986 version of Wubi". Strictly speaking, the original version launched in the autumn of 1986 was called "86-4.5", and later there was an improved version WB-18030 (released in 2000) that standardized coding, but it had very few users. In 1998, Wang Yongmin launched the second generation, Wubi 98, adding whole-character radicals like 甫, 未, 甘, 母. In 2008, the third generation, the New Century version, was released, establishing a new radical key layout system that could handle 27,533 simplified and traditional Chinese characters, claiming to be the "ultimate version" of Wubi.

The total number of Wubi users is estimated to be around 20 to 30 million, with an extremely unbalanced distribution — the 1986 version dominates due to its first-mover advantage, while the 98 version and New Century version have never been able to challenge it. The "version war" within the Wubi community has become a long-standing topic.

Later, I tried **Cangjie**. Cangjie was created by Chu Bong-Foo in 1976, originally named "Shape-Meaning Character Indexing Method". Its original intention was to solve the problem of computer processing of Chinese characters — at that time, English technology monopolized the computer world, and Chu Bong-Foo tried to break this situation. In 1978, Chiang Wei-kuo renamed it "Cangjie Input Method" in memory of the ancient Cangjie's spirit of creating characters. Chu Bong-Foo deeply studied the structure and composition principles of Chinese characters, combined with the needs of computer logic processing, and sorted out 24 Cangjie letters, each associated with multiple auxiliary glyphs, resulting in a very low collision rate. However, its character splitting logic was designed for traditional characters, so simplified characters always seemed fragmented when split. In 1982, Chu Bong-Foo publicly gave up the patent for the Cangjie Input Method through a newspaper, promoting the sinicization of computers. This "open spirit" is unique in the history of input methods, but openness aside, simplified Chinese users still felt a barrier when using it.

The turning point came on Baidu Tieba. In an old post, someone said: "When writing originally, shape-based input methods are actually less efficient than sound-based ones. Their real advantage is copying manuscripts — looking at paper manuscripts and blind typing, almost no need to select characters. When creating, the brain has to translate the 'voice in the mind' into radicals, which actually slows down thinking." This was like a wake-up call, knocking me out of my Wubi obsession. Psychological research also supports this — a study using eye-tracking technology to examine the input process of primary and secondary school students found that although shape-based input is generally faster than sound-based input, the amount of information in the candidate character box is the main factor affecting speed. In other words, the "speed" of shape-based input is more reflected in fewer character selections and no need to interrupt visual focus, while in scenarios where thinking and output are synchronized, shape-based input has an extra "shape translation" step, and its advantage is not obvious.

So I began to face Pinyin squarely. Full Pinyin requires too many keystrokes — the character "装" (zhuāng) requires six keystrokes, with an average of four to six keystrokes per character. By the time my brain finished three sentences, my hands were still typing the first one. **Shuangpin** (Double Pinyin) became the natural choice.

The core of Shuangpin is simple: compress the initial and final sounds into one key each, two keys per syllable. However, when the same principle is implemented in different schemes, differences in key layout result in completely different feels and cross-platform experiences. Initially, I used **Pinyin Jiajia Shuangpin**. This scheme has strong regularity, with initials and finals arranged symmetrically according to the Pinyin table, and a low learning threshold. Its origin can be traced back to the Shuangpin design of Stone typewriters. But I soon found that some combinations were uncomfortable to type, such as the character "追" (zhuī), where "v+ui" are both on the left hand, making the left hand too busy when typing quickly. More fatally, cross-platform support was poor — although mainstream input methods like Sogou Input and Microsoft Pinyin mostly have Pinyin Jiajia pre-installed, mobile support is inconsistent, requiring reconfiguration when switching devices.

Later, I switched to **Microsoft Shuangpin**. Its biggest advantage is native Windows support. The key layout is a revision of Natural Code, with the biggest controversy being putting "ing" on the semicolon key, which is easily pressed by the right pinky, resulting in comfortable left-right hand division. The semicolon key controversy has always been significant — frequent extension of the right pinky to the semicolon, some people think this distribution does not conform to keyboard norms, while others believe that an extra key position actually expands the vowel distribution space. Another feature of the Microsoft scheme is excellent cross-platform coverage — mainstream input methods on Windows, macOS, iOS, and Android almost all have this layout built-in, so no re-learning is needed when switching devices.

**Xiaohe Shuangpin** is many people's "go-to choice after trying others" (literally "fever reducer" — a metaphor for settling on the best option after experimentation). Its key layout is relatively balanced, with reasonable left-right hand load distribution, and it supports the advanced "Xiaohe Sound-Shape" scheme — adding shape-based assistance on top of Shuangpin, allowing for higher typing limits. But perhaps due to my personal habits, I always felt that my right pinky was underutilized, dragging down the rhythm.

In the history of Shuangpin schemes, there's one name that can't be avoided — **Natural Code**. Its vowel distribution is relatively reasonable, with balanced left-right hand usage. Developed by Zhou Zhinong, it was once very popular. Unfortunately, the author of Natural Code spent a lot of energy on anti-piracy, making commercial strategy mistakes, and ultimately failed to become a standard feature of major operating systems. Most current Shuangpin schemes (including Microsoft Shuangpin and Sogou Shuangpin) are actually revisions of Natural Code.

From practice, the migration cost between Shuangpin schemes is not high; just pick one that feels comfortable and stick with it. My final choice is Microsoft Shuangpin — not the best, but the most worry-free across platforms.

As for Wubi's current situation, **RIME (Rime Input Method Engine)** is almost the only way to continue the Wubi experience on Windows. RIME is open source and free, highly customizable. The Windows version is called "Xiao Lang Hao" (Little Wolf Brush), the macOS version is "Shu Xu Guan" (Mouse Whisker Tube), the Android version is "Tong Wen" (Same Text), and the iOS version is "Cang Input Method". It supports almost all Chinese input schemes including Wubi, Shuangpin, Cangjie, and Zhuyin. Theoretically, it can be tailored to perfectly match personal habits. Configuring RIME's word libraries, writing YAML configuration files, and customizing skins all have significant thresholds. RIME supports custom phrases and extended word libraries — you can set common sentences as short codes, or import Sogou word libraries to expand vocabulary. But to do these well, you need to be familiar with YAML format and RIME's configuration logic. For example, to adjust the number of candidate characters or the Chinese-English switching key, you need to create a `.custom.yaml` file, and after modification, you need to redeploy it to take effect. Some users joke: "RIME takes a week to configure, but a lifetime to type." I don't want to spend this energy.

From Wubi to Shuangpin, it's more like a compromise and reconciliation from shape to sound. I sacrificed the extreme precision of single-character blind typing for a fluency that better matches the rhythm of thinking — silently reciting a sentence in my mind, my fingers following the syllables, no longer needing to go through the "shape → radical" translation. Wubi has an extra translation step in creative scenarios, while it's most efficient in manuscript transcription. That Baidu Tieba comment really hit the nail on the head. It also brought the peace of mind of not always having to tinker with software: no fear of system updates, no fear of changing computers, seamless switching between phone and computer.

The best input method is the one that suits you. I still occasionally miss Wubi's "typing like writing" precision, but I can't go back. And I don't plan to.

---

> *适合自己的，才是最好的输入法。*
> {: .prompt-tip }

我曾是**86版五笔**的死忠。五笔加加、小鸭五笔、极点五笔……这些名字像老朋友。敲键盘的节奏，熟悉得像呼吸。

五笔字型的源头，要追溯到1978年。王永民在南阳开始研究汉字输入技术，历经五年实验，最终将汉字拆分为130多个基本字根，分布在标准英文键盘的25个字母键上（Z键用作学习键）。1983年8月28日，这个方案通过鉴定，之后又经过两年改进，于1986年定稿并正式推广，史称"86版五笔"。严格说来，1986年秋推出的原始版本叫"86-4.5版"，后来还有个取码规范化的改进版WB-18030（2000年推出），不过用的人寥寥无几。1998年王永民又推出了第二代98版五笔，增补了甫、未、甘、母等整字字根，2008年第三代新世纪版问世，建立新的字根键位体系，可处理27533个简繁汉字，号称五笔的"终极版本"。

五笔输入法的用户总数约2000万至3000万量级，分布极不平衡——86版凭借先发优势占据了绝对主导地位，98版和新世纪版始终未能撼动，五笔社区内部的"版本之争"倒成了一个长期话题。

后来试了**仓颉**。仓颉由朱邦复于1976年创制，原名"形意检字法"，本意是解决电脑处理汉字的问题——当时英文科技垄断计算机世界，朱邦复试图打破这一局面。1978年，蒋纬国为纪念上古仓颉造字的精神，将其重新定名为"仓颉输入法"。朱邦复深入研究中文字的结构和构成原理，结合电脑逻辑处理的需要，整理出24个仓颉字母，每个字母又关联多个辅助字形，重码率很低。但它的拆字逻辑是为繁体设计的，简体字拆起来总显得支离破碎。1982年，朱邦复登报公开放弃仓颉输入法专利权，推动电脑中文化，这种"开放精神"在输入法史上堪称独一份，但开放归开放，简体用户用它始终隔了一层。

转机出现在百度贴吧。一个老帖子里，有人说了这么一段话："形码输入法原创写作时，效率其实不如声码。它真正的优势是抄稿子——看着纸稿盲打，几乎不用选字。创作时，大脑要把'心里的声音'翻译成字根，反而拖慢思路。"这话像当头一棒，把我从五笔的执念里敲了出来。有心理学研究也佐证了这一点——有研究利用眼动技术考察中小学生的输入过程，发现形码输入的整体速度虽然快于音码，但选字框的信息量是影响速度的主要因素。换句话说，形码的"快"更多体现在选字少、无需中断视觉焦点上，而在思考与输出同步的场景中，形码多了一道"字形翻译"环节，优势并不明显。

于是我开始正视拼音。全拼按键太多，一个"装"字要按六个键，平均每个字四到六下。脑子想完三句，手还在打第一句。**双拼**就成了自然之选。

双拼的核心很简单：把声母和韵母各压到一个键，两个键一个音节。但同一原理落实到不同方案上，键位分布的差异带来截然不同的手感和跨平台体验。最初我用**拼音加加双拼**，这个方案规律性强，声韵母按拼音表对称排列，学习门槛很低，来源可以追溯到四通打字机的双拼设计。但我很快发现有些组合指法不顺，比如"追"字的"v+ui"两个键都在左手，打快了左手忙不过来。更致命的是跨平台支持差——搜狗输入法、微软拼音等主流输入法虽然大多预置了拼音加加方案，但手机端支持参差不齐，换台设备就得重新配置。

后来换**微软双拼**。Windows 原生支持是其最大优势，键位设计来自自然码的改版，最大的争议是把ing放在分号键上，右手小指一压就出来，左右手分工很舒服。分号键的争议一直不小——右手小指频繁伸向分号，有人觉得这样的分布不符合键盘规范，另一些人则觉得多一个键位反而拓宽了韵母分布空间。微软方案的另一特点是跨平台覆盖极好，Windows、macOS、iOS、Android 的主流输入法几乎都内置了这一布局，换任何设备都不用重新学习。

**小鹤双拼**是很多人的"退烧方案"。它的键位设计比较均衡，左右手负荷分配合理，且支持进阶的"小鹤音形"方案——在双拼基础上附加形码辅助，打字上限更高。但可能是我个人习惯问题，用着总觉得右手小指被架空，节奏上有点拖。

在双拼方案的历史上，还有一个名字绕不过去——**自然码**。它韵母分配比较合理，左右手相对平衡，由周志农开发，一度非常流行。可惜自然码的作者把大量精力花在防破解上，商业策略失误，最终没能成为各大操作系统的标配。目前市面上大多数双拼方案（包括微软双拼、搜狗双拼）其实都是自然码的改版。

从实践来看，双拼方案之间的迁移成本并不高，挑一个顺手的坚持下去即可。我的最终选择是微软双拼——谈不上最好，但跨平台最省心。

至于五笔在当下的处境，**RIME（中州韵输入法引擎）** 几乎是唯一在Windows上延续五笔体验的出路。RIME开源免费，高度可定制，Windows版叫"小狼毫"，macOS版叫"鼠须管"，Android叫"同文"，iOS叫"仓输入法"。它支持五笔、双拼、仓颉、注音等几乎所有中文输入方案，理论上可以打磨成完全符合个人习惯的形状。RIME的词库配置、YAML配置文件编写、皮肤自定义，每一步都有不小的门槛。RIME支持自定义短语和扩展词库——你可以把常用句子设定为短码，也可以导入搜狗词库扩充词汇量。但要做好这些，得熟悉YAML格式和RIME的配置逻辑。比如要调整候选词个数或中英文切换键，需要新建一个`.custom.yaml`文件，修改后还要重新部署才能生效。有用户调侃："RIME 用一周配置，用一辈子打字。"我不想花这个精力。

从五笔到双拼，更像一场从形到声的妥协与和解。我牺牲了极致的单字盲打精度，换来了更贴思考节奏的流畅——心里默念一句话，手指跟着音节走，不用再经过"字形→字根"的翻译。五笔在创作场景中多一道翻译工序，而在照稿录入时效率最高，这一点贴吧那番话确实说到了根上。也换来了不用总折腾软件的安心：系统更新不怕，换电脑不怕，手机电脑无缝切换。

适合自己的，才是最好的输入法。我偶尔还会怀念五笔那种"打字如写字"的精确度，但回不去了。也不打算回去。
