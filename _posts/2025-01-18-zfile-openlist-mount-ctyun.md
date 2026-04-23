---
title: "Practical Methods for Mounting China Telecom Cloud Drive on Zfile / OpenList"
date: 2025-01-18
categories: [Technology]
tags: [tutorial, self-hosting]
lang: en-zh
---

> *This article does not guarantee timeliness. Please verify the effectiveness of the methods yourself.*
{: .prompt-warning }

With cloud storage aggregators like **OpenList** or **Zfile**, Lanzou Cloud basically just requires entering a password, but China Telecom Cloud Drive always gets stuck at the device lock step. Most online tutorials tell you to go to e.dlife.cn to scan a code to turn it off, but the problem is that page keeps loading and the QR code never appears.

After asking customer service, I found out that the real place to turn off the device lock is [e.189.cn/user/index.do](https://e.189.cn/user/index.do). But you need to log in to China Telecom Cloud Drive in your browser first. If you're not logged in, go to [cloud.189.cn](https://cloud.189.cn) to log in normally, then open the link above, and you'll be directly taken to the personal center.

Once inside, look for the device lock switch in account security or device management and turn it off. You may need SMS verification. After completing this, go back to **OpenList** or **Zfile** and add China Telecom Cloud Drive again; it should mount normally.

If it still prompts you're not logged in, repeat the steps: first log in to [cloud.189.cn](https://cloud.189.cn), then open [e.189.cn/user/index.do](https://e.189.cn/user/index.do). Also, China Telecom Cloud Drive sometimes turns the device lock back on secretly, so just turn it off again when that happens. Additionally, after turning it off, don't log in frequently in untrusted network environments, as this can trigger risk control.

Most errors about device ID not existing or requiring secondary verification can be resolved with this method.

---

> *本文不保证时效性，方法是否有效请自行验证。*
{: .prompt-warning }

用 **OpenList** 或 **Zfile** 这类网盘聚合工具，蓝奏云基本输个密码就行，可天翼云盘总卡在设备锁这一步。网上教程大多让去 e.dlife.cn 扫码关，问题是那页面老转圈圈，二维码根本刷不出来。

问客服才知道，真正能关设备锁的地方是 [e.189.cn/user/index.do](https://e.189.cn/user/index.do)。但得先在浏览器里登录天翼云盘。没登的话，先去 [cloud.189.cn](https://cloud.189.cn) 正常登录，再开上面那个链接，就能直接进个人中心。

进去后在账号安全或设备管理里找设备锁开关，关掉就行，可能要短信验证。完成之后回到 **OpenList** 或 **Zfile** 重新加天翼云盘，一般就能正常挂载。

要是还提示未登录，就再按刚才的步骤来一遍：先登 [cloud.189.cn](https://cloud.189.cn)，再开 [e.189.cn/user/index.do](https://e.189.cn/user/index.do)。另外天翼云盘有时候会偷偷把设备锁打开，到时候再关一次就行。还有，关了之后别在不靠谱的网络环境下老登录，容易触发风控。

大部分设备ID不存在或需要二次校验的报错，按这方法都能解决。
