---
title: Migrating from Cloud Server to Home Server, Configuring Intranet Penetration to Map Site to Public Network
date: 2026-01-02
tags: [server, tutorial, self-hosting]
categories: [Technology]
lang: en-zh
---

> _Modified using Grok AI. Content accuracy and device compatibility are not guaranteed. Please verify and adjust according to your actual situation._
{: .prompt-warning }

Hi everyone, I'm back! As the title says, I've finally completely migrated my site from a cloud server to a home server (also known as a self-hosted home server). After going through all this, I feel like I've gained a lot and learned from many mistakes, so I wrote this down to share with everyone, hoping to save you from making the same detours.

First, I bought a small Linux box on Taobao. It has an ARM architecture with 4 cores and 4GB of RAM, supports adding TF cards and USB hard drives, and comes with 64GB of onboard eMMC. It offers great value for money with low power consumption, making it perfect for running 24/7 at home without any issues.

For the control panel, I chose aaPanel (international version) instead of continuing with 1Panel that I had been using before. The main reason is that I might deploy some small tools I write locally in the future, and pure containerization is sometimes not convenient enough. aaPanel's graphical management interface is more intuitive.

## 1. Install ARM Version of aaPanel

**Important reminder:**

- The domestic version of aaPanel currently does not officially support ARM architecture. Do not install it directly, as it will likely fail.
- It is recommended to use the international version of aaPanel. The installation script sometimes misjudges the architecture. If you encounter errors, you can manually install dependencies or switch directly to the Docker version.

The installation command is super simple:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install aaPanel international version
wget -O install.sh http://www.aapanel.com/script/install-ubuntu_6.0_en.sh
sudo bash install.sh aapanel
```

After installation, open your browser and enter your device's LAN IP address at port 7800 (the default port) to see the login interface. The first login will prompt you to set an administrator account and password. It is recommended to set a strong password. Once logged in, you can use the panel to one-click install Nginx, MariaDB, PHP, and more — extremely convenient.

## 2. Install Docker

My system is Armbian, and the official recommendation is to use the stable version directly from the system repositories, which is the most reliable approach.

```bash
# Update repositories
sudo apt update

# Install docker.io
sudo apt install -y docker.io

# Start and enable on boot
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
sudo docker run hello-world

# Allow ordinary users to run docker (recommended)
sudo usermod -aG docker $USER
# Log out from SSH and log back in for this to take effect
```

After installing Docker, deploying Java services or other containers becomes much more convenient.

## 3. Install Basic Runtime Environment (JRE + MariaDB)

Now that the system is set up, let's start installing specific software. First, install JRE because both OneDev and Halo are Java programs.

```bash
# Install OpenJDK (recommended for Halo and OneDev)
sudo apt install -y openjdk-17-jre-headless

# Verify
java -version
```

You should see output like "openjdk version '17.x'" or "21.x".

I installed MariaDB through the apt package manager (recommended) because the MariaDB installation script provided by aaPanel is designed for RedHat-based systems, and using aaPanel's installation script directly will cause errors:

```bash
sudo apt install -y mariadb-server
sudo mysql_secure_installation   # Set root password as prompted
```

## 4. Install OneDev (DevOps Tool)

I originally wanted to continue using Gitea, but kept failing to create a systemd service for it. After struggling with it for a long time, I gave up and switched to OneDev, which has a much better user experience.

OneDev requires Java 11+ (which we have already installed), and the official supports bare-metal deployment:

- **Download the latest version** (go to [https://docs.onedev.io/](https://docs.onedev.io/) to find the latest link):

```bash
wget https://code.onedev.io/onedev/server/~site/onedev-latest.tar.gz
tar -xzf onedev-latest.tar.gz
sudo mv onedev /opt/onedev
sudo chown -R $USER:$USER /opt/onedev
```

- **Test in foreground first:**

```bash
cd /opt/onedev
bin/server.sh console
```

Open your browser and visit http://your-LAN-IP:6610 to access the setup wizard. Follow the prompts to complete the setup (set administrator account, database, etc. I used the built-in H2 database first, which can be changed later).

- **Create systemd service for auto-start on boot** (highly recommended):

See the systemd service configuration below (Section 4.1).

### 4.1 Systemd Service Configuration (OneDev)

Create a service file at `/etc/systemd/system/onedev.service`:

```ini
[Unit]
Description=OneDev Server
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/opt/onedev
ExecStart=/opt/onedev/bin/server.sh start
ExecStop=/opt/onedev/bin/server.sh stop
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now onedev
sudo systemctl status onedev   # Check status
```

To view logs, run `journalctl -u onedev -f`.

## 5. Install Halo Blog (JAR Package Deployment)

The Halo migration process was the most troublesome part! I did not use Docker at first and deployed directly with JAR packages. As a result, I could not connect to MariaDB and struggled for several days before finally solving it with the help of DeepSeek.

Complete installation steps:

- **Download the latest Halo JAR** (download from the official website [https://halo.run](https://halo.run)):

```bash
sudo mkdir -p /opt/halo
cd /opt/halo
wget https://dl.halo.run/release/halo-latest.jar -O halo.jar
```

- **Create a directory for configuration files:**

```bash
mkdir -p ~/.halo2
cp application.yaml ~/.halo2/   # Download template from official website and modify database configuration
```

Modify `~/.halo2/application.yaml` to configure your MariaDB database.

- **Create systemd service:**

See the systemd service configuration below (Section 5.1).

### 5.1 Systemd Service Configuration (Halo)

Create a service file at `/etc/systemd/system/halo.service`:

```ini
[Unit]
Description=halo
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/java -jar /opt/halo/halo.jar --spring.config.additional-location=optional:file:/root/.halo2/
WorkingDirectory=/opt/halo
Restart=always

[Install]
WantedBy=multi-user.target
```

- **Start and solve database connection problems** (important!):

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now halo
```

If you still cannot connect to MariaDB (a common issue), it is because systemd is not reading the configuration file. Solution (this is the pit I fell into):

Edit the service file and change ExecStart to the command shown in Section 5.1 above, then run:

```bash
sudo systemctl daemon-reload
sudo systemctl restart halo
```

Verify the logs:

```bash
journalctl -u halo -n 100 | grep -i "r2dbc\|database"
```

Once you see that it has connected to MariaDB, you are successful! I strongly recommend that everyone deploy Halo using Docker and directly use PostgreSQL in the orchestration to avoid these troubles.

## 6. Install OpenList Cloud Drive

I did not use Zfile for OpenList because it has an official one-click installation script that automatically recognizes ARM64, making installation extremely convenient.

First, configure acceleration (GitHub mirror source, otherwise downloads will be slow):

I used proxies like [https://github.makkle.com/](https://github.makkle.com/).

One-click installation:

```bash
curl -fsSL https://res.oplist.org/script/v4.sh > install-openlist-v4.sh && sudo bash install-openlist-v4.sh
```

The script will enter an interactive menu. Enter 1 to install and follow the prompts to complete the process. After installation, it will directly provide you with the initial password and access address (usually http://IP:port).

If you cannot open it, remember to allow the port through the firewall:

```bash
sudo ufw allow port-number
sudo ufw reload
```

For mounting local directories or cloud drives, follow the official documentation. The backup feature is also very useful — you can directly import the backup file when switching machines.

## 7. Configure Intranet Penetration to Map to Public Network

With the site set up, the biggest problem is the lack of a public IP address. I first tried IPv6, but the addresses provided by mainstream domestic operators are basically neutered versions that do not have public network capabilities (some areas can enable this by calling customer service, but I did not succeed in my case).

In the end, I chose the free intranet penetration tool chmlfrp ([https://www.chmlfrp.net/](https://www.chmlfrp.net/)), selected the Japanese node, and the penetration address is jp.5.frp.one:15200, which has excellent speed.

Detailed steps:

1. Go to the official website to register an account and log in (real-name verification is recommended for more free nodes).
2. Create a tunnel: select TCP/HTTP mode, fill in the local service port (such as Halo 8090, OneDev 6610, etc.), select the Japanese node, and save to obtain Token and tunnel ID.
3. Download the corresponding ARM64 frpc client (download link available on the official website).
4. After decompression, edit the configuration file (frpc.toml or ini, depending on the version) to fill in your Token and tunnel information, or start it using command-line parameters.
5. Run the client:

```bash
./frpc -s jp.5.frp.one:port -t your-token   # Specific parameters refer to the official website
```

It is also recommended to create a systemd service for it to start automatically on boot.

The www.exyone.me you are accessing now is reverse proxied through Cloudflare Worker (thanks to the Cyber Father Cloudflare). The code is as follows for your reference (it is recommended to change TARGET_URL to an environment variable):

```javascript
// ==================== Configuration area (recommended to use environment variables) ====================
const DEFAULT_TARGET_URL = 'http://jp.5.frp.one:15200';

const HOP_BY_HOP_HEADERS = [
  'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
  'te', 'trailers', 'transfer-encoding', 'upgrade'
];

const SENSITIVE_RESPONSE_HEADERS = [
  'server', 'x-powered-by', 'x-aspnet-version'
];

export default {
  async fetch(request, env, ctx) {
    const TARGET_URL = env.TARGET_URL || DEFAULT_TARGET_URL;

    try {
      const url = new URL(request.url);
      const targetUrl = TARGET_URL + url.pathname + url.search;

      const proxyRequestInit = {
        method: request.method,
        headers: sanitizeRequestHeaders(request.headers),
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      proxyRequestInit.signal = controller.signal;

      const proxyRequest = new Request(targetUrl, proxyRequestInit);

      // Set proxy headers
      proxyRequest.headers.set('X-Forwarded-For', request.headers.get('cf-connecting-ip') || '');
      proxyRequest.headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
      proxyRequest.headers.set('X-Forwarded-Host', url.host);
      proxyRequest.headers.set('X-Real-IP', request.headers.get('cf-connecting-ip') || '');

      const targetUrlObj = new URL(TARGET_URL);
      proxyRequest.headers.set('Host', targetUrlObj.host);

      let response = await fetch(proxyRequest);
      clearTimeout(timeoutId);

      response = new Response(response.body, response);
      sanitizeResponseHeaders(response.headers);

      // Handle redirects
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location) {
          try {
            const locationUrl = new URL(location, TARGET_URL);
            const newLocation = url.protocol + '//' + url.host + locationUrl.pathname + locationUrl.search;
            response.headers.set('location', newLocation);
          } catch (e) {}
        }
      }

      return response;

    } catch (error) {
      // Error handling...
      let status = 500;
      let message = 'Internal Server Error';
      if (error.name === 'AbortError') {
        status = 504;
        message = 'Upstream timeout';
      }
      return new Response(JSON.stringify({ error: message }), { status, headers: { 'Content-Type': 'application/json' } });
    }
  }
};

function sanitizeRequestHeaders(headers) {
  const sanitized = new Headers(headers);
  HOP_BY_HOP_HEADERS.forEach(h => sanitized.delete(h));
  return sanitized;
}

function sanitizeResponseHeaders(headers) {
  HOP_BY_HOP_HEADERS.forEach(h => headers.delete(h));
  SENSITIVE_RESPONSE_HEADERS.forEach(h => headers.delete(h));
}
```

After deploying to Cloudflare Worker, just point your domain name to the Worker.

The entire migration process took me about a weekend, costing less than 200 yuan (box + hard drive), and the electricity bills in the future will be much cheaper than cloud servers. If you have any questions, feel free to leave a comment, and I will try my best to reply.

By the way, I have to say that our ASP.NET (or .NET as a whole) ecosystem is quite disappointing. It remains firmly rooted in the enterprise/commercial side, and the open-source software ecosystem for self-hosting/personal use is practically non-existent, haha.

If you want to find a self-hosted tool that you can use comfortably (blog, cloud drive, DevOps, knowledge base, etc.), it is basically dominated by Go, Node, Python, Rust, or Java. .NET choices are extremely scarce, and the occasional ones that appear are mostly old projects with inactive maintenance, or lacking in features. Using them, I cannot help but sigh: friends, when will .NET stand up in the "toy-level self-deployment" field?

I hope this sharing is helpful to friends who are considering building a home server! See you next time~

(End)

---

> _使用Grok AI进行过修改，不保证内容完全准确或适用于您的设备，请根据实际情况自行验证并调整。_
{: .prompt-warning }

嗨，大家好，我回来了！正如标题所说，我终于把站点从云服务器彻底迁移到了家庭服务器上。这次折腾下来，感觉收获满满，也踩了不少坑，特意写下来分享给大家，省得你们再走弯路。

首先我在淘宝上淘了个 Linux 小盒子，ARM 架构，4核4G 配置，支持加装 TF 卡和 USB 硬盘，板载 64GB eMMC，性价比很高，功耗也低，放在家里 24 小时跑着完全没压力。

面板我选了 aaPanel（国际版），没继续用之前一直用的 1Panel。主要是考虑到以后可能会在本地部署一些自己写的小工具，纯容器化有时候不太方便，aaPanel 的图形化管理更直观。

## 1. 安装 ARM 版 aaPanel

**重要提醒：**

- aaPanel 国内版目前官方没明确支持 ARM，千万别直接装，容易失败。
- 推荐用 aaPanel 国际版，脚本有时候会误判架构，如果报错可以手动装依赖或者直接切 Docker 版。

安装命令超级简单（代码段见英文版 Section 1）。

安装完后，浏览器输入你的盒子内网 IP:7800（默认端口）就能看到登录界面。第一次登录会让你设置管理员账号和密码，建议设置强密码。登录后就能用面板一键装 Nginx、MariaDB、PHP 等了，超级省心。

## 2. 安装 Docker

我的系统是 Armbian，官方推荐直接用系统源里的稳定版，最稳。

代码段见英文版 Section 2。

装完 Docker 后，后面部署 Java 服务或者其他容器就方便多了。

## 3. 安装基础运行环境（JRE + MariaDB）

系统该装的都装好了，接下来开始装具体软件。先装 JRE，因为 OneDev 和 Halo 都是 Java 程序。

代码段见英文版 Section 3。

MariaDB 我是通过 apt 包管理器安装的（推荐），因为 aaPanel 提供的 MariaDB 安装脚本是用于 RedHat 系的，直接用 aaPanel 的安装脚本会报错：

代码段见英文版 Section 3。

## 4. 安装 OneDev（DevOps 工具）

本来想继续用 Gitea，结果创建 systemd 服务老是失败，折腾半天放弃了，改用 OneDev，体验好多了。

OneDev 需要 Java 11+（我们已经装好），官方支持裸金属部署：

- **下载最新版**（去 [https://docs.onedev.io/](https://docs.onedev.io/) 找最新链接）：

代码段见英文版 Section 4。

- **先前台测试：**

代码段见英文版 Section 4。

浏览器访问 http://你的内网IP:6610 进入初始化向导，按提示走完（设置管理员账号、数据库等，我用了自带的 H2 先，后面可以换）。

- **做成 systemd 服务开机自启**（超级推荐）：

见下文 4.1 节 systemd 服务配置。

### 4.1 Systemd 服务配置（OneDev）

在 `/etc/systemd/system/onedev.service` 创建服务文件：

代码段见英文版 Section 4.1。

启用服务：

代码段见英文版 Section 4.1。

日志看 `journalctl -u onedev -f` 就行。

## 5. 安装 Halo 博客（jar 包部署）

Halo 迁移过程让我最头疼！我一开始没用 Docker，而是直接 jar 部署，结果连 MariaDB 连不上，折腾了好几天。最后在 DeepSeek 帮助下才解决。

完整安装步骤：

- **下载最新 Halo jar**（去官网 [https://halo.run](https://halo.run) 下载）：

代码段见英文版 Section 5。

- **创建目录放配置文件：**

代码段见英文版 Section 5。

修改 `~/.halo2/application.yaml` 把数据库改成你的 MariaDB。

- **创建 systemd 服务：**

见下文 5.1 节 systemd 服务配置。

### 5.1 Systemd 服务配置（Halo）

在 `/etc/systemd/system/halo.service` 创建服务文件：

代码段见英文版 Section 5.1。

- **启动并解决数据库问题**（重点！）：

代码段见英文版 Section 5.1。

如果还是连不上 MariaDB（常见问题），就是 systemd 没读到配置文件。解决方案（我踩过的坑）：

编辑服务文件，把 ExecStart 改成上文 5.1 节所示的命令，然后：

代码段见英文版 Section 5.1。

验证日志：

代码段见英文版 Section 5.1。

看到连上 MariaDB 就成功啦！强烈推荐大家用 Docker 部署 Halo，直接用编排里的 PostgreSQL，省得这些麻烦。

## 6. 安装 OpenList 网盘

OpenList 我没用 Zfile，因为它有官方一键安装脚本，自动识别 ARM64，装起来贼方便。

先配置加速（GitHub 镜像源，不然下载慢）：

我用了 [https://github.makkle.com/](https://github.makkle.com/) 之类的代理。

一键安装：

代码段见英文版 Section 6。

脚本会进入交互菜单，输入 1 安装，按提示走完。装好后会直接给你初始密码和访问地址（一般是 http://IP:端口）。

如果打不开，记得放行防火墙：

代码段见英文版 Section 6。

挂载本地目录或者云盘按照官方文档操作就行，备份功能也超实用，换机器直接导入备份文件。

## 7. 配置内网穿透映射到公网

有了站点，最大的问题是没公网 IP。我先试了 IPv6，但国内主流运营商给的基本都是阉割版，不具备公网能力（有些地区打客服电话能开，我这儿没试成）。

最后我选了免费内网穿透工具 chmlfrp（[https://www.chmlfrp.net/](https://www.chmlfrp.net/)），选了日本节点，穿透地址是 jp.5.frp.one:15200，速度很不错。

详细步骤：

1. 去官网注册账号并登录（建议实名，免费节点更多）。
2. 创建隧道：选择 TCP/HTTP 模式，填本地服务端口（比如 Halo 8090、OneDev 6610 等），选日本节点，保存后获得 Token 和隧道 ID。
3. 下载对应 ARM64 的 frpc 客户端（官网有下载链接）。
4. 解压后编辑配置文件（frpc.toml 或 ini，根据版本）填入你的 Token 和隧道信息，或者用命令行参数启动。
5. 运行客户端：

代码段见英文版 Section 7。

推荐也做成 systemd 服务，开机自动启动。

你现在访问的 www.exyone.me 是通过 Cloudflare Worker 反向代理的（感谢赛博义父 Cloudflare），代码如下，供大家参考（建议把 TARGET_URL 改成环境变量）：

代码段见英文版 Section 7。

部署到 Cloudflare Worker 后，域名解析到 Worker 就完事了。

整个迁移过程大概花了我一个周末，成本不到 200 块钱（盒子+硬盘），以后电费都比云服务器便宜多了。有什么问题欢迎评论区交流，我看到会尽量回复。

顺便说一句，也不得不吐槽一下咱们 ASP.NET（或者说 .NET 整体）的生态吧，主要还是牢牢扎根在企业/商业那一头，自建/个人用的开源软件生态真的是几乎一片空白啊哈哈。

想随便找个自己用着顺手的、自托管的工具（博客、网盘、DevOps、知识库啥的），基本全是 Go、Node、Python、Rust 或者 Java 的天下，.NET 的选择少得可怜，偶尔冒出来一两个也大多是老项目、维护不活跃，或者功能上总差口气。用着用着就忍不住感慨：朋友们，咱 .NET 啥时候也能在"玩具级自部署"这块儿支棱起来啊～

希望这篇分享对正在考虑自建家庭服务器的朋友有帮助！我们下次见～

（完）
