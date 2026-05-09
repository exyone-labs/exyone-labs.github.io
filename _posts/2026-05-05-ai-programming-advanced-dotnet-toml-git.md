---
title: "AI Programming Advanced Guide for Non-Programmers: The Ultimate Tool Combo"
date: 2026-05-05
categories: [Technology]
tags: [ai, programming, dotnet, toml, git, tutorial]
lang: en-zh
---

In the previous article, we discussed how to open the command line, how to use configuration files to manage variable parameters, and how to use version control to protect your code. Those were foundational concepts aimed at getting you running and avoiding pitfalls.

This article is an advanced "cookbook." We won't talk about broad choices—we'll give you a hard-core combo that can take you through small-to-medium projects and desktop development. This combination is by no means a random decision—it's experience I've accumulated over years of trying, not necessarily perfect for everyone, but probably the optimal solution to help you launch your first software.

Today's recommended four items are: **.NET + TOML + Git**, plus a real weapon hidden at the end of the article—**Lua**.

Below we'll break down each one, explaining why they're chosen and how you can use this tool combo to build a runnable small software skeleton within half an hour.

## 1. .NET: A Fully Equipped "Professional Factory"

If we compare the programming ecosystem to a production workshop, Python is a universal toolkit—it can do anything and is quick to get started; Node.js is a super block market with too many parts to see clearly. But .NET is a fully equipped, precisely running professional factory.

### First, Clarify a Concept: What Are "Dependencies"?

You can't write programs doing everything from scratch. For example, if you want your program to connect to a database, there's no need to write your own database communication protocol—just use code someone else has already written and tested. This act of "borrowing others' ready-made code" is called "dependency" in programming. The code package you borrow is your "dependency."

### What's Node.js's "Dependency Hell"

In the Node.js ecosystem, dependency relationships can nest very deeply. When you install a small tool, it might automatically pull down hundreds or thousands of other packages, all piled into a directory called `node_modules` in your project folder. Over time, this folder can swell to hundreds of MB or even GB.

This brings three more fatal problems beyond just taking up disk space:

1. **"Works on My Machine" Curse**: Your program runs fine on your computer, but when you send it to a friend or deploy to a server, it suddenly crashes. The reason is often that some deep dependency version is inconsistent between your two machines. This uncertainty is the number one killer of beginner confidence.

2. **"Phantom Dependencies"**: Your code might secretly use a package you didn't directly declare—it's pulled in by another package. One day if this small package is removed or updated, your entire project mysteriously collapses, and you have no idea what happened.

3. **Hard to Debug**: Facing a hundreds of MB dependency directory, when something goes wrong, you have no idea where to even start investigating.

### How .NET Solves This Problem

.NET uses a completely different dependency management approach: **centralized, project-level references**.

Your project has a file called `.csproj`, which is essentially a clearly organized list, explicitly stating which packages you need and their versions. These packages are all downloaded to a centralized system location rather than piled in your project folder to expand.

It's like renovating a house. Node.js's approach is piling building materials in every room, messy; .NET's approach gives you a warehouse list, materials stored in an external warehouse, the house stays clean, only the list remains.

Even more reassuring: the entire .NET ecosystem's core libraries are maintained and guaranteed by Microsoft officially. Quality, security, and compatibility are all backed by the official team. For beginners programming with AI, this means AI-generated code has a higher probability of running—because its runtime environment is deterministic and predictable.

### Type Safety: Making AI Write Code More Reliably

C# is the programming language used by .NET. It has a feature called "static typing"—here's what that means and why it matters to you.

In programming, data comes in different types: numbers are one type, text is another, and Boolean values (yes/no) are another. You can't add the text "hello" to a number—it doesn't make logical sense.

Some languages (like JavaScript, Python) don't check this kind of "putting a round peg in a square hole" error before running the code—programs only crash after execution. But C#'s static typing means it catches these issues before they happen. If you accidentally write text where a number is needed, the editor immediately marks it red, rather than crashing after you click the run button.

When AI generates code for you, this feature becomes a huge advantage: type mismatch errors are intercepted in advance, and AI's success rate visibly improves.

### Native Advantage for Desktop Development

If your ultimate goal is a desktop application that runs with a double-click and has a proper window, .NET is one of the best choices—especially on Windows.

.NET provides two most mature desktop frameworks: **WinForms** lets you build interfaces by drag-and-drop like building blocks, while **WPF** can create more modern, cooler visual effects. These are Microsoft's official offerings, with complete documentation, and AI has been trained on massive related code, performing extremely stably in this area. If you need cross-platform, **Avalonia UI** is an excellent choice—a community-driven cross-platform desktop application framework.

## 2. TOML: The Most Beginner-Friendly Configuration File Format

In the previous article, we discussed why use configuration files—extracting volatile values from code. But what format you use for the configuration file itself directly determines your maintenance experience going forward.

My recommendation is **TOML**. You may not have heard this name, but you just need to understand why it's better than those big-name formats.

### First, Why Other Formats Are Headaches

The configuration file AI most often outputs is **JSON**. It looks like this:

```json
{
  "name": "My App",
  "version": "1.0.0",
  "color": "#3498db"
}
```

JSON has a fatal flaw: **no comments allowed**. You can't write "this is the theme color, change to #ff0000 to make it red" as a note. Two months later when you open it yourself, facing a bunch of bare data, you might completely forget what each value means.

Then there's **YAML**, which looks cleaner than JSON, but its syntax **entirely depends on space indentation to determine hierarchy**. One extra space or one less space, and the program fails to parse. This "invisible error" is extremely unfriendly for beginners—you might stare at the file for a long time but can't see where the problem is.

And **XML**, its syntax is too verbose, full of angle brackets, poor readability, legacy from the previous generation—can skip directly.

### Where TOML Excels

TOML is specifically designed for the "configuration file" scenario,恰好 addressing all the weaknesses of the formats above:

1. **Native comment support**: You can use `#` to write explanations for each config item. This feature's value in actual work cannot be overstated.

2. **Intuitive syntax, like an upgraded INI**: If you've seen simple `.ini` files in Windows software (`key=value`), TOML is like its modern, standardized upgrade. No space sensitivity issues, no complex nesting rules—glance and you can start using.

3. **Safer than YAML**: YAML has a famous pitfall—"implicit type conversion." It might misunderstand what you wrote. For example, if you write `country: NO` (NO is Norway's country code), YAML might interpret it as Boolean `false` because "NO" means "no" in English. TOML doesn't play this concept replacement—what you write is what you get.

Here's a simple TOML config example. Without any programming background, you can understand it, even directly make changes:

```toml
# Basic information about the software
[app]
name = "My First AI Software"
version = "1.0.0"

# Color settings for the interface theme
[theme]
color = "#3498db" # A nice blue color
font_size = 14 # Font size
```

If you can use Notepad to edit TXT files, you can use TOML. Its clarity and restraint are its core advantages.

## 3. Git: Install a "Time Machine" for Your Project

After discussing config file formats, we need to talk about a tool crucial for your entire programming career: **Git**.

You might think: "I'm writing code alone for now, no collaborators—do I really need to learn this?"

**The answer: Must learn, and learn now. This has nothing to do with whether you have collaborators.**

### What Exactly Is Git

If you imagine your project folder as a novel being written, Git is this novel's "time machine." Every time you complete a chapter or make an important change, you can use Git to take a "snapshot." No matter how badly you mess up later chapters, you can instantly restore to the state of any snapshot—as if nothing happened.

This "snapshot" in Git is called a **commit**. You can think of it as a save point.

### For You, Git Solves Three Concrete Problems

**First, it lets you experiment boldly.** When collaborating with AI, it sometimes breaks your code. Without Git, you can only manually remember what you originally wrote, or simply start over. With Git, mess something up? One-click rollback to the previous save point, three seconds back to a clean state. This "always having a safety net" feeling is the soil of creativity.

**Second, it lets you see what AI changed.** AI might make dozens of changes in one file—comparing manually is extremely inefficient. Git has a command called `git diff` that highlights every change between you and AI—additions in green, deletions in red. You can review these changes line by line, deciding to accept or rollback. At this point, you're no longer just a user passively accepting AI's output—you're truly "pair programming" with AI.

**Third, it makes asking others for help easier.** When a program has a bug, if you send the entire zip file to a friend, they have no idea what you changed. But if you send the Git commit history, they can see at a glance what modifications you made at each step—the efficiency difference in locating problems is worlds apart.

### Beginners Only Need to Learn Three Commands, Done in Five Minutes

Open the command line, enter your project folder, and run these three commands in order:

1. `git init` — "Start using Git to manage this folder." This command only needs to run once when starting a new project.

2. `git add .` — "Prepare to take a snapshot, include all current file changes in this photo."

3. `git commit -m "Describe what you did"` — "Click, take a snapshot with an explanatory note."

For example, after having AI make a button and testing it with no issues, you can run:

```
git add .
git commit -m "Implemented blue theme button"
```

Later if you change something else and the program suddenly crashes, wanting to return to this save point, just run `git checkout .`, and everything restores to when the button was just finished.

Just these three commands—you don't need to learn advanced tricks like branching, merging, or remote repositories. Mastering "snapshot" and "rollback" solves 90% of your unexpected situations.

## 4. How to Quickly Develop a Small Software Using This Tool Combo

Above we discussed what .NET, TOML, and Git each are. Next I'll string them together to show you an actually actionable process. Let's say you now want to make the simplest Windows desktop tool—like a "drinking water reminder" that can set reminder times.

### Step 1: Create Project Skeleton (5 Minutes)

Open the command line and first have AI generate initial code for a .NET desktop project. You can say:

"Help me create a .NET WinForms desktop program, window title is 'Drinking Reminder', width 400 pixels, height 300 pixels. Put a label on the window with text 'Time until next drink:', then a textbox to input minutes, and finally a start button."

AI will give you a complete set of code. Save the code to your project folder, run `dotnet run` in the command line, and a window will pop up.

### Step 2: Extract Adjustable Parameters to TOML Config (3 Minutes)

Now your code might have some hardcoded values—window title, default reminder interval, font size of prompt text. You can tell AI:

"Help me extract parameters like window title, default minutes, and font size into a TOML config file, the program reads this config when starting."

AI will generate a `config.toml` file, something like:

```toml
# Config file for drinking reminder tool
[window]
title = "Drinking Reminder"
width = 400
height = 300

[reminder]
default_minutes = 30 # Default reminder interval in minutes
font_size = 14 # Font size of prompt text
```

At the same time, AI will rewrite your original code, replacing those hardcoded values with logic that reads from the config file. Later if you want to change the default minutes, just open `config.toml`, change one number, save, and rerun the program—it takes effect without touching a line of code.

### Step 3: Use Git to Save (2 Minutes)

Once the program runs, immediately protect your work:

```
git init
git add .
git commit -m "Drinking reminder tool v1: pop-up window, reads TOML config"
```

### Step 4: Iterate and Modify, Use Git to Rollback Anytime

Next have AI add new features, like a "pause reminder" toggle. After AI makes changes, don't rush to save—first run `git diff` to see exactly which files AI changed and what each line added or deleted. Once confirmed okay, then run `git add .` and `git commit -m "Added pause reminder toggle"`.

If AI makes a mess of things, just run `git checkout .` to return to the clean state of the previous step and restate your requirements.

Walk through these four steps, and you've established a controlled development loop: **write code → get it running → Git save → keep modifying → if error, rollback**. This loop is the core of professional programmers' daily work.

## 5. Bonus: The "Logic Engine" Hidden in Config—Lua

Finished with the main gear, let's talk about something you might not have heard of but will love once you use: **Lua**.

### What Is Lua, and How Is It Different from TOML

TOML's position is "pure config file"—it's good at expressing "what it is"—database address is 192.168.1.1, max connections is 100, theme color is blue. These are all static descriptions.

But sometimes your needs aren't that simple. For example, you want to write logic: "If user level is greater than 3, show advanced interface, otherwise show normal interface." This isn't a simple "value"—it's a rule that needs judgment and calculation.

TOML can't do this, because config files shouldn't contain logic—that would blur boundaries and be unsafe.

**Lua** is born for scenarios like this. It's an extremely compact programming language—a complete interpreter is only about 200KB, designed to be embedded in other programs to give the host program flexible extensibility.

Think of it this way:

- **TOML is responsible for "what it is"**: write unchanging values as config, clear and safe.

- **Lua is responsible for "what to do"**: write dynamic rules that need judgment and calculation as scripts, flexible and programmable.

### Lua's Power in Actual Projects

To give you a sense of Lua's power, here's a real example.

**The entire interface of World of Warcraft and hundreds of player-made plugins are all driven by Lua.** Blizzard embedded the Lua interpreter into the game client, allowing players to write their own interfaces, make automation prompts, and modify ability monitoring. This gave World of Warcraft unlimited customization space, making its plugin ecosystem flourish for twenty years.

In your own small projects, Lua can bring qualitative change. Suppose your drinking reminder tool is running online, and you suddenly want to change a rule: normally remind every 30 minutes, but don't remind during lunch break (12:00-13:30), and after 14:00 double the reminders. If the rules are written in C# code, you need to modify code, close program, recompile, restart. But if the rules are written in a Lua script file, you just change that `.lua` file and let the main program read it again—no downtime at all.

### Lua Lets You Think One Step Further

Lua is a "bonus" here—I'm not requiring you to learn it at the starting stage. But I want you to know there's an advanced path from "config file" to "programmable config" in the programming world. You don't need to walk it now, but knowing it exists means you have a more complete map in mind.

After your .NET + TOML + Git basic flow becomes familiar, spend a day or two learning how to embed Lua in C# programs—you'll find your project jumps from "can run" to "can flexibly adjust anytime"—that feeling is when programming truly becomes fascinating.

## Summary

This article didn't give you a long list of dazzling options, but carefully selected a group of the strongest combo for you:

- **.NET** is your core factory—stable, rigorous, not fussy, the first choice for desktop development.

- **TOML** is your config language—clear, commentable, no pitfalls, lets you bid farewell to config file pain.

- **Git** is your time machine—save, rollback, review AI changes—can't live without it even programming alone.

- **Lua** is your bonus weapon—after settling the first three, it gives your project hot-update and unlimited customization possibilities.

What you now have is a clearly structured, mutually supportive tool chain: .NET writes main logic, TOML manages constant parameters, Git manages version safety, Lua as a future expansion engine. This tool chain might not be the trendiest, but it's stable enough to let you confidently write maintainable projects for the long term.

---

## 给非程序员的 AI 编程进阶教程：一套最适合新手的"万能工具箱"

在上一篇里，我们聊了怎么打开命令行、怎么用配置文件来管理可变参数、怎么用版本控制来保护自己的代码。那些是入门基础概念，目标是让你跑起来、不踩坑。

而这一篇是进阶的"菜谱"。我们不谈宽泛的选择，只给你一套足够硬核、能伴你走遍中小项目和桌面开发的组合拳套装。这套搭配绝非胡乱搭配的决定，而是我自己尝试多年后沉淀下来的经验，未必人人适用，但可能是帮你落地第一款软件的最优解。

今天要推荐的四样东西是：**.NET + TOML + Git**，外加一个藏在文章末尾的真正利器——**Lua**。

下面我们逐个拆解，说清楚为什么是它们，以及你怎么用这套工具在半小时内搭出一个能跑的小型软件骨架。

## 一、.NET：一座设备齐全的"专业工厂"

如果把编程生态比作生产车间，Python 是一个万能工具箱，什么都能干、上手也快；Node.js 是一个超级积木市场，零件多到眼花缭乱。而 .NET，是一座设备齐全、运转精准的专业工厂。

### 先搞清楚一个概念：什么是"依赖"？

写程序不可能所有事情都从零开始。比如你想让程序连接数据库，没必要自己写一套数据库通信协议——直接用别人写好的、经过检验的代码包就行。这种"借用别人现成代码"的行为，在编程里就叫"依赖"。被你借用的那个代码包，就是你的一个"依赖项"。

### Node.js 的"依赖地狱"是怎么回事

在 Node.js 生态里，依赖关系可以嵌套得非常深。你安装一个小工具，它可能自动拉下来几百上千个其他包，全部堆在项目文件夹里一个叫 `node_modules` 的目录中。时间长了，这个文件夹能膨胀到几百 MB 甚至上 GB。

这带来的问题不光是占硬盘空间，还有三个更致命的麻烦：

1. **"在我电脑上能跑"魔咒**：你的电脑上跑得好好的程序，发给朋友或者部署到服务器上，突然就崩溃了。原因往往是某个深层依赖的版本在你俩的机器上不一致。这种不确定性是新手信心的头号杀手。

2. **"幽灵依赖"**：你的代码可能偷偷用了一个你没有直接声明安装的包——它是被某个其他包顺带拉进来的。某天这个小包被移除或更新了，你整个项目就神秘地瘫痪了，而你完全不知道发生了什么。

3. **排查困难**：面对一个几百 MB 的依赖目录，当程序出错时，你根本不知道从哪查起。

### .NET 怎么解决这个问题

.NET 采用了一种完全不同的依赖管理思路：**集中式、项目级引用**。

你的项目里有一个叫 `.csproj` 的文件，它本质上是一张条理清晰的清单，白纸黑字写着你需要哪些包、各自是什么版本。这些包会被统一下载到一个系统的集中位置，而不是堆在你的项目文件夹里膨胀。

这就像你装修房子。Node.js 的做法是每个房间都堆满建材，乱成一团；.NET 的做法是给你一个仓库清单，建材统一存放在外面的仓库里，屋子里干干净净，只留清单。

更让你安心的是，整个 .NET 生态的核心库都由微软官方维护和保障，质量、安全性和兼容性全都由官方兜底。这对借助 AI 来编程的新手来说，意味着 AI 生成的代码能跑起来的概率更高——因为它的运行环境是确定的、可预测的。

### 类型安全：让 AI 帮你写代码时更靠谱

C# 是 .NET 使用的编程语言。它有一个特性叫"静态类型"，我用人话解释一下这是什么，以及它为什么对你很重要。

在编程里，数据有不同类型：数字是一种类型，文字是另一种类型，表示"是或否"的布尔值又是另一种。你不能把文字"你好"和一个数字相加——这在逻辑上说不通。

有些语言（如 JavaScript、Python）不会在代码运行前检查这种"张冠李戴"的错误，程序跑起来之后才会崩溃。而 C# 的静态类型意味着，它会在这类错误发生之前就把问题揪出来。如果你不小心把文字写进了需要数字的地方，编辑器会立刻给你标红，而不是等你点了运行按钮之后再崩溃。

当 AI 为你生成代码时，这个特性就变成了一个巨大的优势：类型不匹配的错误会被提前拦截，AI 生成的成功率肉眼可见地提升。

### 桌面开发的原生优势

如果你最终目标是做一个双击就能运行、有正经窗口的桌面应用，.NET 是目前最好的选择之一——尤其在 Windows 上。

.NET 提供了两套最成熟的桌面框架：**WinForms** 让你像搭积木一样拖拽出界面，**WPF** 则能做出更现代、更炫酷的视觉效果。这些都是微软官方的亲儿子，文档齐全，AI 也经过海量相关代码的训练，在这个领域表现极其稳定。如果你需要跨平台，**Avalonia UI** 是绝佳选择，这是一个由社区驱动开发的跨平台桌面应用框架。

## 二、TOML：对新手最友好的配置文件格式

上一篇我们讲了为什么要用配置文件——把容易变的东西从代码里抽出来。但配置文件本身用什么格式来写，直接决定了你日后的维护体验。

我的推荐是 **TOML**。你不一定听过这个名字，但你只要明白它比那些大牌格式强在哪就行。

### 先说说其他格式为什么让人头疼

AI 最常给你输出的配置文件是 **JSON**。它长这样：

```json
{
  "name": "我的应用",
  "version": "1.0.0",
  "color": "#3498db"
}
```

JSON 有一个致命缺陷：**不支持注释**。你不能在旁边写上"这是主题色，改成 #ff0000 就变红"这样的提示。两个月后你自己打开看，面对一堆裸数据，可能完全想不起来每个值的意思。

然后是 **YAML**，它看起来比 JSON 清爽一些，但它的语法**完全靠空格缩进来决定层级关系**。多一个空格或少一个空格，程序就会解析失败。这种"看不见的错误"对新手极其不友好——你盯着文件看了半天，可能根本看不出哪里有问题。

还有 **XML**，语法太啰嗦，满眼尖括号，可读性差，是上一代的遗产，可以直接跳过。

### TOML 好在哪里

TOML 是专门为"配置文件"这个场景设计的，恰好补上了上面所有格式的短板：

1. **天生支持注释**：你可以用 `#` 给每项配置写上说明。这个功能放在实际工作中，价值怎么强调都不过分。

2. **语法直观，像升级版的 INI**：如果你见过 Windows 软件里那种简单的 `.ini` 文件（`key=value`），TOML 就像是它的现代化、标准化升级。没有空格敏感问题，没有复杂的嵌套规则，看一眼就能上手。

3. **比 YAML 更安全**：YAML 有一个出了名的坑——"隐式类型转换"。它会自作主张把你写的含义理解错。比如你写 `country: NO`（NO 是挪威的国家代码），YAML 可能把它理解成布尔值 `false`，因为"NO"在英语里就是"否"的意思。TOML 不会玩这种概念替换，你写的是什么就是什么。

下面是一个简单的 TOML 配置示例。不需要任何编程基础，你就能看懂，甚至直接上手改：

```toml
# 软件的基础信息
[app]
name = "我的第一个AI软件"
version = "1.0.0"

# 界面主题的颜色设置
[theme]
color = "#3498db" # 一种好看的蓝色
font_size = 14 # 字号
```

你会用记事本改 TXT 文件，就会用 TOML。它的清晰与克制，就是它最核心的优势。

## 三、Git：给你的项目装上"时光机"

讲完配置文件的格式，接着要讲一个对你整个编程生涯都至关重要的工具：**Git**。

你可能会想："我暂时一个人写代码，也没有合作者，真有必要学这个吗？"

**答案是：必须学，而且现在就学。这和你有没有合作者无关。**

### Git 到底是什么

如果把你的项目文件夹想象成一本正在写的小说，Git 就是这本书的"时光机"。你每完成一个章节、每做一次重要修改，都可以用 Git 拍一张"快照"。将来无论你把后面的章节改得多烂，都能一键回到某一张快照的状态，就像什么都没发生过一样。

这张"快照"，在 Git 里叫一次 **commit（提交）**。你可以把它理解成一个存档点。

### 对你来说，Git 能解决三个具体问题

**第一，让你敢大胆实验。**和 AI 协作时，它有时会改坏你的代码。如果没有 Git，你只能手动回忆原来写了什么，或者干脆从头再来。有了 Git，改坏了？一键回退到上一个存档点，三秒钟回到干净状态。这种"随时可以后悔"的底气，是创造力的土壤。

**第二，让你看得懂 AI 改了什么。**AI 可能在一个文件里改了十几处，你肉眼去对比非常低效。 Git 有一个命令叫 `git diff`，它能把你和 AI 之间的每一处改动都高亮显示出来——增加的用绿色标出，删除的用红色标出。你可以逐行审查这些变化，决定是接受还是回退。到这一步，你就不再是单方面接受 AI 输出的使用者，而是和 AI 真正"结对编程"的合作者。

**第三，方便你请教别人。**当程序出 bug 时，你把整个压缩包发给朋友，对方根本不知道你改了什么。但如果你把 Git 的提交记录发过去，对方看一眼就知道你每一步做了什么修改，定位问题的效率天差地别。

### 新手只需要学会三个命令，五分钟搞定

打开命令行，进入你的项目文件夹，按顺序敲下面三个命令：

1. `git init` —— "开始使用 Git 管理这个文件夹"。这个命令只需要在新项目开始时执行一次。

2. `git add .` —— "准备拍快照，把当前所有文件的改动都纳入这次拍照范围"。

3. `git commit -m "描述你这次做了什么"` —— "咔嚓，拍下一张快照，并附上说明文字"。

比如你让 AI 做了一个按钮，测试完发现没问题，就可以执行：

```
git add .
git commit -m "实现了蓝色主题按钮"
```

将来你改了别的东西，程序突然崩溃了，想回到这个存档点，只需要执行 `git checkout .`，一切就恢复到这个按钮刚做完时的样子。

就这三个命令，你不需要学分支、合并、远程仓库这些高阶玩法。掌握"拍快照"和"回退"两招，已经能解决你 90% 的意外状况。

## 四、如何用这套工具快速开发一个小型软件

上面我们讲了 .NET、TOML 和 Git 各自是什么。接下来我把它们串在一起，给你展示一套实际可操作的流程。假设你现在就想做一个最简单的 Windows 桌面工具——比如一个能够设置提醒时间的"喝水提醒"小程序。

### 第一步：创建项目骨架（5 分钟）

打开命令行，先让 AI 帮你生成一个 .NET 桌面项目的初始代码。你可以这样说：

"帮我用 .NET WinForms 创建一个桌面程序，窗口标题叫'喝水提醒'，宽度 400 像素、高度 300 像素。窗口上放一个标签文字'距离下次喝水还有'，再放一个文本框可以输入分钟数，最后放一个开始按钮。"

AI 会给你一套完整的代码。你把代码保存到项目文件夹里，在命令行运行 `dotnet run`，一个窗口就会弹出来。

### 第二步：把可调参数抽到 TOML 配置里（3 分钟）

现在你的代码里可能有一些写死的值，比如窗口标题、默认提醒间隔、提示文字的字体大小。你可以对 AI 说：

"帮我把窗口标题、默认分钟数、字体大小这些参数抽到一个 TOML 配置文件里，程序启动时读取这个配置。"

AI 会给你生成一个 `config.toml` 文件，大概长这样：

```toml
# 喝水提醒工具的配置文件
[window]
title = "喝水提醒"
width = 400
height = 300

[reminder]
default_minutes = 30 # 默认提醒间隔，单位分钟
font_size = 14 # 提示文字的字号
```

与此同时，AI 会把你原来的代码重写一遍，把那些写死的值替换成从配置文件读取的逻辑。以后你想改默认分钟数，只需要打开 `config.toml` 改一个数字，保存，重新运行程序就生效——一行代码都不用碰。

### 第三步：用 Git 存档（2 分钟）

程序跑通了，立刻保护劳动成果：

```
git init
git add .
git commit -m "喝水提醒工具第一版：弹出窗口，读取TOML配置"
```

### 第四步：迭代修改，利用 Git 随时回退

接下来你让 AI 帮你加新功能，比如加一个"暂停提醒"的开关。AI 改完之后，你先别急着存档，先运行 `git diff` 看看 AI 到底改了哪些文件、每一行增加了什么删除了什么。确认没问题了，再执行 `git add .` 和 `git commit -m "增加了暂停提醒开关"`。

万一 AI 改出了一堆乱七八糟的东西，直接 `git checkout .` 回到上一步的干净状态，重新提需求。

这四步走下来，你就已经建立起了一个受控的开发循环：**写代码 → 跑通 → Git存档 → 继续改 → 出错就回退**。这个循环，就是专业程序员每天工作的核心。

## 五、彩蛋：隐藏在配置里的"逻辑引擎"——Lua

讲完了主装备，最后我们来聊一个你可能没听过、但一用就会爱上的真正利器：**Lua**。

### Lua 是什么，和 TOML 有什么不同

TOML 的定位是"纯配置文件"，它擅长表达"是什么"——数据库地址是 192.168.1.1、最大连接数是 100、主题色是蓝色。这些都是静态的描述。

但有时候，你的需求没那么简单。比如你想写这样的逻辑："如果用户等级大于 3，就显示高级版界面，否则显示普通版界面。"这不是一个简单的"值"，而是一段需要判断、需要运算的规则。

TOML 做不了这个，因为配置文件本身不应该包含逻辑——那会让边界模糊、不安全。

而 **Lua** 就是为这类场景而生的。它是一门极其小巧的编程语言，一个完整的解释器只有 200KB 左右，设计初衷就是嵌入到其他程序里，让主程序获得灵活的可扩展性。

你可以这样理解：

- **TOML 负责"是什么"**：把那些不变量写成配置，清晰、安全。

- **Lua 负责"怎么办"**：把那些需要判断、计算的动态规则写成脚本，灵活、可编程。

### Lua 在实际项目中的威力

为了让你对 Lua 的威力有个概念，我举一个真实的例子。

**《魔兽世界》的整个界面和几百个玩家自制插件，全部都是用 Lua 驱动的。** 暴雪把 Lua 解释器嵌进了游戏客户端，让玩家可以自己写界面、做自动化提示、改技能监控。这给了《魔兽世界》无限的定制空间，也让它的插件生态繁荣了二十年。

放到你自己的小项目里，Lua 同样能带来质变。假设你的喝水提醒工具已经上线运行了，你突然想改一个规则：平时每 30 分钟提醒一次，但午休时段（12:00-13:30）不提醒，下午 14:00 之后加倍提醒。如果规则写在 C# 代码里，你需要改代码、关程序、重新编译、重新启动。但如果规则写在一个 Lua 脚本文件里，你只需要改那个 `.lua` 文件，让主程序重新读一下，全程不停机。

### Lua 能让你思考更进一步

Lua 在这里是"彩蛋"，我不要求你在起步阶段就学它。但我想让你知道，编程世界里有一条从"配置文件"到"可编程配置"的进阶道路。你不需要现在就走上去，但知道它的存在，意味着你心里有了一张更完整的地图。

等你的 .NET + TOML + Git 这套基本流程跑熟之后，花一两天了解一下 Lua 怎么嵌入 C# 程序，你会发现自己的项目从"能跑"跃迁到"能随时灵活调整"——那种感觉，就是编程真正迷人的时刻之一。

## 总结

这一篇没有给你一长串眼花缭乱的选项，而是为你精心挑选了一组最能打的组合：

- **.NET** 是你的核心工厂，稳定、严谨、不折腾，桌面开发的首选。

- **TOML** 是你的配置语言，清晰、可注释、没陷阱，让你告别配置文件的痛苦。

- **Git** 是你的时光机，存档、回退、审查 AI 改动，一个人编程也离不开它。

- **Lua** 是你的彩蛋武器，等你安顿好前三样之后，它会让你的项目获得热更新和无限定制的可能。

你现在拥有的是一个结构清晰、互相配合的工具链：.NET 写主体逻辑，TOML 管不变参数，Git 管版本安全，Lua 作为未来的扩展引擎。这套工具链也许不是最时髦的，但它足够稳定、足以让你安心地写出能长期维护的项目。
