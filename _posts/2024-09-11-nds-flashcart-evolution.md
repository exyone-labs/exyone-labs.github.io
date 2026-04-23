---
title: "The History of NDS Flashcarts"
date: 2024-09-11
categories: [Lifestyle]
tags: [gaming, NDS]
lang: en-zh
---

> The evolution of NDS flashcarts is a legend of continuous strategic interaction and iteration between hardware architecture, kernel firmware, and anti-piracy technology under Nintendo's ongoing blockade. The Nintendo DS console features a dual-cartridge design: the bottom SLOT-2 (GBA-compatible slot) and the top SLOT-1 (native DS slot). Early flashcarts mostly relied on SLOT-2, and due to their large, brick-like appearance, they were nicknamed "big bricks" by players. After the NDSL was released in 2006, flashcarts fully transitioned to SLOT-1, with hardware solutions evolving from simple NOR/NAND flash memory mapping to complex embedded systems supporting FAT file systems and dynamic patch loading, thus initiating the "three no's" era: no firmware mod, no boot file, no ROM conversion. This shift not only lowered the barrier to entry but also sparked an explosive development of the subsequent kernel ecosystem.
{: .prompt-info }

### Part I: The Foundation Era — R4's Revolutionary Breakthrough and the Rise of Hardware Divergence (2007-2008)

In early 2007, the **R4 Revolution For DS** burst onto the scene with its revolutionary SLOT-1 "three no's" design: no console modification, no boot file, no ROM format conversion required — games could be loaded directly from a microSD card. The core of this solution lay in hardware-level address mapping and direct FAT32 file system parsing, greatly simplifying the operation process. With its affordable price, it quickly became the most widely used flashcart globally. According to market records from that period, its sales boom in Tokyo's Akihabara even caught the attention of Nintendo's legal department. However, around 2008, under legal pressure from Nintendo, the official R4 Team effectively stopped kernel updates. Afterward, fake R4s and knockoffs proliferated, and the term "R4" gradually evolved from a single product into a chaotic catch-all term. Old players still feel a hint of nostalgia for that pure era of "one person, one cart, plug and play."

Contemporary competitors quickly followed, forming the first wave of hardware divergence:

- **DSTT (aka TT)**: In 2008, it challenged R4's dominance with exceptional cost-performance and a "fool-proof" interface. Its TTMenu kernel used a simple file list design, and the deluxe version came with an Ewin GBA expansion card. However, limited by early TF card read/write speeds, game loading times were relatively long, and knockoff versions also flooded the market.
- **Acekard (AK) Series**: Adopting a hardware-level authentic cartridge timing simulation approach, it closely matched the signal characteristics of original DS cartridges, supporting Clean ROMs (runnable without any patches). Early on, it was praised as "never losing save data." Its kernel ran directly on the FAT file system, bypassing most anti-piracy checks through hardware address mapping, with extremely low power consumption. However, on later AK2/AK2i models, save type detection relied on external list files, causing compatibility issues with some Chinese patched games.
- **M3 Series (GBalpha)**: Inheriting the legacy of early "movie cards," the M3 DS Real and G6 DS Real stood out in the high-end market, supporting CLEAN ROMs, PDA expansion, and media playback, with highly versatile kernels. They also released sakura-themed skins and dual-boot modes.
- **iTouchDS**: In June 2008, it broke through at the low price of 135 yuan, focusing on in-game save functionality, quickly becoming a benchmark for cost-performance.

These early products together laid the hardware foundation for SLOT-1 flashcarts: evolving from simple ROM loaders to embedded devices with file system management and DLDI dynamic patch interfaces.

### Part II: The Pinnacle — SuperCard DSONE and DSTWO: The Ultimate Hardware-Kernel Fusion

The SuperCard (SC) team was exemplary in functional innovation. Their **SC DSONE / DSONEi** pioneered three core features: real-time save, real-time guide, and real-time cheats, ranking first in functionality stability alongside iTouchDS2 in the 2009 NDSi horizontal review. The subsequent **DSTWO** was the pinnacle of the DS platform's technology pyramid: featuring an Ingenic JZ4732 MIPS coprocessor and 32MB independent RAM, using advanced hardware anti-piracy technology that could perfectly simulate authentic cartridge timing without applying any patches to ROMs. Its kernel was named **EOS (Evolution OS)**, not only supporting independent GBA and SNES emulators but also featuring DS Ranger memory editor, hardware-level slow motion, cheat database, and BMP image guide systems. The 32MB large memory effectively solved crash issues caused by TF card read/write bottlenecks (such as Dragon Quest 9 Chinese versions, Castlevania: Portrait of Ruin). EOS also supported up to 16 plugins, divided into Chinese and English kernel versions. The birth of DSTWO marked a technological leap from "simple loader" to "portable gaming console." Old players who first ran GBA emulators smoothly on DSTWO still recall that moment as the golden age of flashcarts in miniature.

### Part III: The NDSi Era — Technical Responses to Enhanced Anti-Piracy Mechanisms (from late 2008)

After the NDSi strengthened SLOT-1 anti-piracy detection in late 2008, manufacturers quickly launched corresponding solutions:

- **AK2i**: Acekard was the first to adapt to the NDSi, continuing its hardware simulation architecture, supporting Clean ROMs, and maintaining backward compatibility with NDS/NDSL, becoming the benchmark for early NDSi flashcarts.
- **EZ5i**: The veteran EZFlash inherited technical expertise from the GBA era, launching the EZ5i series supporting real-time saves and guides, though early versions had many known bugs.
- During the same period, products like Gold R4i, SUPER R4i, and DSTTi flooded the market, entering a brief chaotic period for NDSi flashcarts.

### Part IV: The Kernel Revolution — Wood and YSMenu: Community Redemption of Self-Made Ecosystems

After R4 official updates ceased, community developers took up the torch, giving birth to two major cross-platform custom kernels that completely changed the fate of flashcarts.

**Wood R4 Kernel**, developed by Yellow Wood Goblin, was forked from Acekart R.P.G. firmware. It provided continuous update support for original R4, R4i Gold (r4ids.cn), R4iDSN, and Acekart RPG hardware. Through dozens of version iterations (like v1.62), it greatly improved ROM compatibility and new game support, remaining active until after 2013. It's regarded as a classic example of custom kernels.

**YSMenu Kernel** was tailor-made for DSTT by Japanese developer Yasu, later ported by community developers like Xenon++ and Toro, gradually adapting to M3 DS Real and other carts. Its core technology "borrows the shell" to call the DSTT official kernel database, achieving efficient support for new games with loading speeds faster than the original menu and interface style close to R4. After RetroGameFan took over maintenance in 2019, it further expanded the compatibility range. On some Chinese-patched games that Wood kernel struggled with, YSMenu often ran stably, affectionately called "R4's demon king heart" by old R4 players. The coexistence of these two kernels broke the barrier of "one hardware, one kernel," forming a unique ecosystem of "same kernel, multiple carts universal."

### Part V: In-Depth Analysis of Kernel Technology

Flashcart kernels are essentially embedded operating systems running on ARM7/ARM9 coprocessors, with core responsibilities including: FAT file system parsing, ROM loading, save management (.sav/.savx), DLDI patch dynamic linking, and anti-piracy timing deception. The Acekart series adheres to hardware simulation philosophy, with kernels directly mapping authentic cartridge address spaces, power consumption and timing close to original, but requiring external save list updates; DSTWO's EOS achieves deep hardware-software fusion through additional coprocessors and large memory; EZFlash kernels span from the GBA era, undergoing multiple rewrites (like EZ5 2.00 RC4's complete restructuring), with the community also contributing beautified fixes forcing GBABios calls to improve GBA compatibility. New R4 knockoff cards (HK version/COM version) frequently suffer "brick upon wrong flash" issues due to inconsistent kernels, which paradoxically spawned numerous firmware organization sites and "kernel complete collection" resources.

### Conclusion: Kernel is Life — The Afterglow of Technical Romance

Looking back at over twenty years of NDS flashcart technological evolution, from SLOT-2 "big bricks" to SLOT-1 "three no's" era, from official kernel discontinuation to community redemption by Wood, YSMenu, and EOS custom kernels, the kernel has always been the core determining a flashcart's fate. R4 gained a second life through Wood, DSTT extended vitality through YSMenu, and DSTWO created legend through ultimate hardware fusion. Under Nintendo's continuous suppression and market chaos with knockoffs, it was precisely the relentless research and persistence of developers and global player communities that allowed this technical romance to survive.

Today, when we open those dust-laden TF cards and kernel images, we can still feel the passion of that era: no cloud saves, no digital stores, only pure gaming experience intertwined with hardware, kernel, and ROM. NDS flashcarts are not just history, but a technical nostalgia and spiritual heritage belonging to old players.

---

> NDS烧录卡的演进史，是一部硬件架构、内核固件与反烧录技术在任天堂持续封锁下不断博弈、迭代的传奇。Nintendo DS主机自带双卡槽设计：底部SLOT-2（GBA兼容卡槽）和顶部SLOT-1（DS原生卡槽）。早期烧录卡多依托SLOT-2端，因卡带体积庞大、形状近似"砖头"而被玩家戏称为"大砖头"。2006年NDSL推出后，烧录卡全面转向SLOT-1，硬件方案从单纯的NOR/NAND闪存映射演进为支持FAT文件系统、动态补丁加载的复杂嵌入式系统，彻底开启了"免刷机、免引导、免转换"的"三免"时代。这一转变，不仅降低了玩家门槛，更催生了后续内核生态的爆炸式发展。
{: .prompt-info }

### 一、奠基时代：R4的革命性突破与群雄并起的硬件分化（2007-2008）

2007年初，**R4 Revolution For DS** 以其革命性的SLOT-1"三免"设计横空出世：无需任何主机修改、无需引导文件、无需ROM格式转换，即可直接从microSD卡加载游戏。这一方案的核心在于硬件层面的地址映射与FAT32文件系统直接解析，极大简化了操作流程，定价亲民，迅速成为全球普及率最高的烧录卡。据同期市场记录，其在东京秋叶原的销售热潮甚至惊动了任天堂法务部门。然而，2008年左右，受任天堂法律压力影响，R4官方团队（R4 Team）实质性停止内核更新。此后，伪R4、山寨R4泛滥，"R4"一词逐渐从单一产品演变为混乱的泛称，老玩家们至今仍对那个"一人一卡、即插即玩"的纯真年代怀有淡淡的 nostalgia。

同期竞品迅速跟进，形成硬件方案的第一次分化：

- **DSTT（简称TT）**：2008年以极致性价比和"傻瓜式"界面挑战R4霸权。其内核TTMenu采用简洁的文件列表设计，豪华版标配Ewin GBA扩展卡，但受限于早期TF卡读写速度，游戏加载时间偏长，市场山寨版本同样泛滥。
- **Acekard（AK）系列**：采用硬件级正版卡带时序模拟方案，接近原厂DS卡带的信号特征，支持Clean ROM（无需任何补丁即可运行），早期被誉为"永不掉档"。其内核直接运行于FAT文件系统之上，通过硬件地址映射绕过多数反烧录检测，功耗极低，但在后期AK2/AK2i型号上，因存档类型检测依赖外部列表文件，在部分汉化补丁游戏上兼容性有所下滑。
- **M3系列（GBalpha）**：继承早期"电影卡"血统，M3 DS Real与G6 DS Real在高端市场独树一帜，支持CLEAN ROM、PDA扩展及影音播放，内核通用性强，还推出樱花版皮肤与双引导模式。
- **iTouchDS**：2008年6月以135元低价突围，主打即时存档（in-game save）功能，短期内成为性价比标杆。

这些早期产品共同奠定了SLOT-1烧录卡的硬件基础：从单纯的ROM加载器，逐步演进为具备文件系统管理、DLDI动态补丁接口的嵌入式设备。

### 二、登峰造极：SuperCard DSONE与DSTWO的硬件-内核极致融合

SuperCard（SC）小组在功能创新上堪称典范。其**SC DSONE / DSONEi**率先集成即时存档、即时攻略、即时金手指三大核心特性，在2009年NDSi横向评测中与iTouchDS2并列功能稳定性之首。随后的**DSTWO**则是DS平台技术金字塔的巅峰之作：内置Ingenic JZ4732 MIPS协处理器与32MB独立RAM，采用先进的硬件反烧录技术，无需对ROM施加任何补丁即可完美模拟原卡时序。其内核命名为**EOS（Evolution OS）**，不仅支持独立运行GBA与SNES模拟器，还内置DS游侠内存修改器、硬件级慢动作，金手指数据库及BMP图片攻略系统。32MB大内存有效解决了TF卡读写瓶颈导致的死机问题（如《勇者斗恶龙9》汉化版、《恶魔城：废墟的肖像》），EOS还支持多达16款插件扩展，分为中文版与英文版内核。DSTWO的诞生，标志着烧录卡从"单纯加载器"向"便携游戏主机"的技术跃迁，老玩家回想起当年第一次在DSTWO上流畅运行GBA模拟器的时刻，仍会感慨那是烧录卡黄金时代的缩影。

### 三、NDSi时代：防烧录机制升级下的技术应对（2008年底起）

2008年底NDSi主机强化了SLOT-1防烧录检测后，各厂商迅速推出应对方案：

- **AK2i**：Acekard率先适配NDSi，延续硬件模拟架构，支持Clean ROM，向下兼容NDS/NDSL，成为早期NDSi烧录卡的标杆。
- **EZ5i**：老牌EZFlash继承GBA时代技术积累，推出支持即时存档与攻略的EZ5i系列，但早期版本在功能完善度上存在较多已知Bug。
- 同期，金版R4i、SUPER R4i、DSTTi等产品涌入市场，NDSi烧录卡进入短暂的混战期。

### 四、内核革命：Wood与YSMenu的自制生态救赎

R4官方停更后，社区开发者接过了火炬，催生了两大跨平台自制内核，彻底改变了烧录卡的命运。

**Wood R4内核**由Yellow Wood Goblin开发，代码基于Acekard R.P.G.固件分叉而成。它为原版R4、R4i Gold（r4ids.cn）、R4iDSN及Acekard RPG等硬件提供了持续更新支持，历经数十个版本迭代（如v1.62），大幅提升了ROM兼容性与新游戏支持能力，直至2013年后仍保持活跃，被视为自制内核的经典范例。

**YSMenu内核**则由日本开发者Yasu为DSTT量身打造，后经Xenon++、Toro等社区移植，逐步适配M3 DS Real等卡种。其核心技术在于"借壳"调用DSTT官方内核数据库，实现对新游戏的高效支持，加载速度优于原始菜单，界面风格接近R4。RetroGameFan于2019年接手维护后，进一步扩展了兼容范围。在Wood内核难以处理的某些汉化游戏上，YSMenu往往能稳定运行，被R4老玩家亲切称为"R4的魔族心脏"。两种内核的并存，打破了"一种硬件一种内核"的壁垒，形成了"同一内核、多卡通用"的独特生态。

### 五、内核技术纵深考据

烧录卡内核本质上是运行于ARM7/ARM9协处理器之上的嵌入式操作系统，核心职责包括：FAT文件系统解析、ROM加载、存档管理（.sav/.savx）、DLDI补丁动态链接以及反烧录时序欺骗。Acekard系列坚持硬件模拟哲学，内核直接映射正版卡带地址空间，功耗与时序接近原厂，但需依赖外部存档列表持续更新；DSTWO的EOS则依托额外协处理器与大内存，实现硬件-软件深度融合；EZFlash内核从GBA时代延续，经历多次重写（如EZ5 2.00 RC4彻底重构），社区还贡献了强制调用GBABios的美化修正版以提升GBA兼容性。新R4山寨卡（HK版/COM版）则因内核不统一而频发"刷错即砖"问题，反而催生了大量固件整理站点与"内核大全"资源。

### 结语：内核即生命，技术浪漫的余晖

回溯NDS烧录卡二十余年的技术演进，从SLOT-2"大砖头"到SLOT-1三免时代，从官方内核停更到Wood、YSMenu、EOS等自制内核的社区救赎，内核始终是决定一款烧录卡命运的核心。R4凭借Wood获得第二生命，DSTT借助YSMenu延续活力，DSTWO以硬件极致融合铸就传奇。在任天堂持续打压与市场山寨乱象中，正是开发者与全球玩家社区的不懈考据与坚持，才让这段技术浪漫得以留存。

如今，当我们翻开那些尘封的TF卡与内核镜像时，仍能感受到那个年代的热血：没有云存档、没有数字商店，只有硬件、内核与ROM交织出的纯粹游戏体验。NDS烧录卡，不仅仅是一段历史，更是一份属于老玩家的技术怀旧与精神遗产。
