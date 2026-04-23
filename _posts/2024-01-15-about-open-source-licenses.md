---
title: "About Open Source Licenses: Why I Only Like BSD-2-Clause and Apache 2.0"
date: 2024-01-15
tags: [open-source]
categories: [Technology]
lang: en-zh
---

## Why I Only Use BSD-2-Clause and Apache 2.0

Most open source projects use GPL or MIT. I don't like either. Let me explain.

Over time, I've stopped following trends blindly. GPL's "paternalistic control" bugs me — it protects users by restricting developers. MIT's "excessive permissiveness" also rubs me wrong — saying "do whatever you want" means abandoning all responsibility.

My principle is simple: keep only the most basic restrictions on my work, give users maximum freedom. This naturally led me to **BSD**, especially **BSD-2-Clause**.

Licenses range from restrictive to permissive. GPL and MIT sit at opposite ends. I avoid both.

GPL thinks true freedom needs legal enforcement. It uses law to ensure freedom passes on when code gets modified. Sounds noble, but it restricts developers to protect users. That conflicts with my "maximum freedom" principle. I want users free, but not at the cost of limiting what developers can do.

MIT takes the opposite approach. It's too naive. Throwing code out there saying "I don't care what you do" sounds open-minded, but it means giving up all moral claims as an author. Under MIT, people can erase your name entirely. They can use your work maliciously. They can even attack others with patents — MIT has no patent protection. And there's zero obligation to give back. This isn't freedom. It's abandoning responsibility.

**BSD-2-Clause** finds the middle ground. Also called Simplified BSD or FreeBSD License, it has only two requirements: keep copyright notices intact, include a disclaimer. That's it — no more legal fine print.

What **BSD-2-Clause** gives is remarkable. Use the code for any purpose: commercial, personal, educational. Modify it however you want. Distribute it closed-source without releasing modifications. Incorporate it into projects under completely different licenses. No patent retaliation clauses to worry about. Unlike GPL, no "viral" requirement forcing your own code open source.

Yet **BSD-2-Clause** maintains basic standards. Users must acknowledge your work through attribution — they can't pretend they wrote it. You're protected from liability: if something goes wrong when someone uses your code, that's their problem, not yours.

Why not **BSD-3-Clause**? The third clause prevents using the author's name to endorse products without permission. Reasonable in theory, but rarely violated in practice. It adds legal complexity most small projects don't need, and anyone wanting to misuse your code will find ways around it anyway. BSD-2 is cleaner, better embodying "minimal restrictions."

I use different licenses for different projects. Personal stuff — scripts, small libraries, experiments — always **BSD-2-Clause**. Simple, encourages sharing without legal complications, matches my philosophy. For larger projects, especially frameworks or anything involving patents, I prefer **Apache 2.0**. Patent protection matters in modern software, and Apache handles this well while staying permissive. Documentation and creative works get **CC BY 4.0**, designed specifically for creative works with clear attribution.

Licenses I deliberately avoid: **GPL** conflicts with "maximum freedom." **MIT** is too permissive, gives up too much. **SSPL**, **BSL** and similar "source available" licenses aren't truly open source — they restrict how you use the code even when source is visible.

For developers starting out: begin with **BSD-2**. It's straightforward, teaches basics without overwhelming clauses. State your license clearly at the top of your README, in plain language. Keep it consistent throughout your project. Think about your audience: broad adoption needs permissive licenses like BSD or Apache; community projects might prefer weak copyleft like MPL. Have strong moral convictions? Look into **Hippocratic License** variants.

License choice reflects values, not just technical needs. MIT says "I don't care, do whatever." GPL says "You can use it, but follow my rules — I define your freedom." Apache strikes a balance: "Use freely, but let's protect each other." BSD says "This is my gift. Remember who gave it, then go build something great."

**BSD-2-Clause** is simple and elegant. Sometimes the best solution really is the simplest one.

*This article is released under BSD-2-Clause. You can use, modify, and distribute it freely — just keep the original attribution and license notice.*

---

## 为什么我只用 BSD-2-Clause 和 Apache 2.0

大多数开源项目都在用 **GPL** 或 **MIT**。这两个我都不喜欢。说说是为什么。

这些年，我不再盲目追主流。GPL 的"父爱式管制"让我不舒服——它通过限制开发者来保护用户。MIT 的"毫无节制的宽容"也不对味——说"随便用"等于放弃所有责任。

我的原则很简单：只留最基本的约束，把最大的自由给用户。这自然把我引向 **BSD**，尤其是 **BSD-2-Clause**。

许可证从限制性到宽松性，像一条光谱。GPL 和 MIT 站在两端，我都避开。

GPL 认为真正的自由需要法律强制。它用法律确保代码被修改时，开源精神能一直传递。听起来高尚，可它是通过限制开发者来保护用户。这和我的"最大自由"原则冲突。我希望用户自由，但不想以牺牲开发者对代码的掌控为代价。

MIT 走向另一个极端，太天真了。把代码扔出去说"随便你怎么用"，听起来开放，实则是放弃所有作为作者的道德主张。按 MIT 的规则，别人能把你名字完全抹掉，能用你的作品干坏事，甚至能用专利攻击别人——MIT 根本没专利保护条款，而且完全没回馈义务。这不是自由，是放弃责任。

**BSD-2-Clause** 找到了中间地带。又叫简化 BSD 或 FreeBSD 许可证，就两个要求：保留版权声明，加个免责声明。就这么多——没更多法律条款要读。

**BSD-2-Clause** 给的自由很惊人。你可以把代码用在任何地方：商业、个人、教育。随便改。可以闭源分发，不用开源自己的修改。可以整合到完全不同许可证的项目里。没专利报复条款的麻烦。不像 GPL，没有"传染性"要求逼你把自己的代码也开源。

但 **BSD-2-Clause** 仍保留基本标准。用户必须通过署名承认你的工作——不能假装是他们写的。你也受责任保护：有人用你代码出问题，那是他们的事，不是你的。

为什么不用 **BSD-3-Clause**？第三条款说未经许可不能用作者名字为产品背书。理论上合理，实际中却很少被违反。它给大多数小项目添了不必要的法律复杂性，而且真想滥用你代码的人总会找到办法绕开。BSD-2 更干净，更贴合"最小约束"的原则。

我根据不同场景用不同许可证。个人项目——脚本、小库、实验代码——一律 **BSD-2-Clause**。简单，鼓励使用和分享，不用操心法律问题，符合我的理念。大项目，尤其是框架或涉及专利的代码，我更爱 **Apache 2.0**。现代软件里专利保护很重要，Apache 在这方面处理得好，同时还保持宽松。文档和创意作品用 **CC BY 4.0**，专门为创意作品设计，署名要求清楚。

刻意避开的许可证：**GPL** 和"最大自由"原则冲突。**MIT** 太宽松，放弃太多。**SSPL**、**BSL** 之类的"源码可用"许可证不是真正的开源——就算源代码可见，它们也限制你怎么用代码。

给刚起步的开发者建议：从 **BSD-2** 开始。它直截了当，不会用一堆条款把你搞晕。在 README 开头用白话把许可证说清楚。项目里保持一致。想清楚你的受众：要广泛传播就用 BSD 或 Apache 这样的宽松许可证；做社区项目可以考虑 MPL 这样的弱 copyleft。有强烈的道德立场？去研究研究 **Hippocratic License** 这类变体。

选许可证不只是技术决定，是价值观的表达。MIT 说"我不管，随便用"。GPL 说"你可以用，但得听我的——我定义你的自由"。Apache 试图平衡："自由用，但我们互相保护"。BSD 说"这是我送你的礼物。记得谁给的，然后去创造点伟大的东西"。

**BSD-2-Clause** 简洁优雅。有时候，最简单的就是最好的。

*本文采用 BSD-2-Clause 许可证发布。你可以自由使用、修改、分发，只需保留原始署名和许可证声明。*
