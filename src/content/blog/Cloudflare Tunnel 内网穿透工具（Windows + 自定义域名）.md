---
title: "Cloudflare Tunnel 内网穿透工具（Windows + 自定义域名）"
description: "Cloudflare Tunnel 内网穿透工具（Windows + 自定义域名）"
publishDate: 2026-02-05
updatedDate: 2026-02-05
category: "技术"
tags: ["技术", "内网穿透", "cloudflare"]
---

# [Cloudflare Tunnel 内网穿透工具（Windows + 自定义域名）](https://www.cnblogs.com/suishou/p/19050967)

适用于在 Windows 系统下，使用 Cloudflare Tunnel 将本地服务（如：http://localhost:8090）通过域名（如：web.xxxx.com）暴露到公网，无需公网 IP。

# 📁 目录结构推荐

```yaml
D:\cloudflared\
├── cloudflared.exe                      # 主程序
├── config.yml                           # 配置文件
├── cert.pem                             # 登录认证凭证
├── f1a3d2c4-xxxx-yyyy-zzzz-abcdefghijkl.json   # Tunnel 凭证文件
```

# 🧰 一、准备工作
## 1.1 注册并登录 Cloudflare

1.  访问官网：[https://dash.cloudflare.com/](https://dash.cloudflare.com/)　
2.  注册账户并登录。

## 1.2 添加域名到 Cloudflare（以 `xxxx.com` 为例）

1.  登录 Cloudflare 后点击“添加站点”
2.  输入你的域名 xxxx.com
3.  选择免费套餐（Free）
4.  Cloudflare 会提供两个 NS 服务器地址
5.  前往你域名的注册商（如阿里云、腾讯云、华为云等），修改 DNS 为上述 NS 地址
6.  等待 DNS 生效（通常几分钟到几小时）。

# 💾 二、下载并配置 cloudflared
## 2.1 下载 cloudflared.exe

1.  访问：[https://github.com/cloudflare/cloudflared/releases/](https://github.com/cloudflare/cloudflared/releases/)
2.  下载适用于 Windows 的 cloudflared-windows-amd64.exe
3.  重命名为 cloudflared.exe
4.  建议统一存放在：D:\\cloudflared\\

> 💡 所有配置文件都统一放在 D:\\cloudflared\\ 目录下，方便维护。

# 🔐 三、登录 Cloudflare 并授权
## 3.1 登录 cloudflare

```bash
D:
cd D:\cloudflared
cloudflared.exe login
```

-   浏览器会自动打开授权页面
-   选择你的域名 xxxx.com 并点击授权
-   Cloudflare 会自动下载凭证文件（默认是下载到用户目录） C:\\Users\\你的用户名.cloudflared

## 3.2 拷贝 cert.pem 到指定目录

将默认下载在：

```yaml
C:\Users\你的用户名\.cloudflared\cert.pem
```

拷贝到：

```yaml
D:\cloudflared\cert.pem
```

# 🚇 四、创建 Tunnel 隧道
## 4.1：创建隧道

在命令行中继续执行：

```yaml
cloudflared.exe tunnel create mytunnel
```

创建成功后，将生成一个 UUID 凭证文件（如：f1a3d2c4-xxxx-yyyy-zzzz-abcdefghijkl.json）

-   输出一条日志，提示 UUID，例如：

```yaml
Created tunnel mytunnel with id: f1a3d2c4-xxxx-yyyy-zzzz-abcdefghijkl
```

文件默认生成在：

```yaml
C:\Users\你的用户名\.cloudflared\
```

请手动复制或移动该文件到 D:\\cloudflared\\ 目录下，并重命名为一致的名称（如：mytunnel.json）

-   ⚠️ 如果提示 “tunnel already exists”，请：
-   使用已有 tunnel（跳过此步），或 删除 tunnel 后重新创建：

```bash
cloudflared.exe tunnel delete mytunnel
```

# 📁 五、配置 config.yml

在 D:\\cloudflared\\ 目录下创建 config.yml 文件：

```yaml
tunnel: mytunnel
credentials-file: D:\cloudflared\mytunnel.json

ingress:
- hostname: web.xxxx.com   # 在cloudflared网站添加的域名（可以是子域名或者是顶级域名）
  service: http://localhost:8090 # 本地服务的地址
- service: http_status:404
```

说明：

-   tunnel: 对应你创建的 tunnel 名称
-   credentials-file: 必须是你保存凭证文件的路径（和 cloudflared.exe 同级）
-   hostname: 你在 Cloudflare 上设置的子域名
-   service: 你本地服务的地址（根据实际情况修改）

# 🌐 六、将域名绑定到 Tunnel

使用以下命令将你的子域名绑定到 tunnel 上：：

```bash
cloudflared.exe tunnel route dns mytunnel web.xxxx.com
```

Cloudflare 会自动添加一条 DNS 记录，将 web.xxxx.com 指向 Cloudflare Tunnel。  
成功后 Cloudflare 会自动添加一条 DNS 记录，将该子域名指向该 tunnel。

# 🚀 七、运行 Tunnel
## 方式一：手动运行

```bash
cloudflared.exe tunnel --config D:\cloudflared\config.yml run
```

## 方式二：注册为系统服务（可选）

```bash
#cloudflared.exe service install --config D:\cloudflared\config.yml

#windows使用cmd命令行添加到服务
sc create CloudflareTunnelService binPath= "\"D:\\cloudflared\\cloudflared.exe\" tunnel --config D:\\cloudflared\\config.yml run"

#启动服务
sc start CloudflareTunnelService

#设置服务开机启动
sc config CloudflareTunnelService start= auto

#删除服务命令
sc delete CloudflareTunnelService

```

安装为服务后，系统启动时会自动运行 Cloudflare Tunnel。

# 🧪 八、测试访问

打开浏览器访问，若页面能正常显示本地服务内容，即配置成功 ✅

```armasm
http://web.xxxx.com
```

# 🧱 九、防火墙和本地服务排查（如遇问题）

-   ✅ 确保本地服务已正常运行（如：8090 端口）
    
-   ✅ Windows 防火墙未阻止 cloudflared.exe 出网
    
-   ✅ 检查[配置文件路径](https://so.csdn.net/so/search?q=%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E8%B7%AF%E5%BE%84&spm=1001.2101.3001.7020)是否正确
    
-   ✅ 如果你配置了其他路径，请确保一致性
    

# 🧯 十、常见问题 FAQ

| 问题 | 说明 |
| --- | --- |
| 403 Forbidden | 检查 config.yml 配置是否正确，是否执行了 tunnel route dns |
| ERR_CONNECTION_REFUSED | 本地服务未启动或监听地址不是 localhost |
| Timeout | 尝试使用 --protocol h2mux 参数启动 |
| 登录授权跳转失败 | 复制授权链接手动在浏览器打开 |
| tunnel already exists | 使用已有 tunnel 或删除后重建 |
| credentials file not found | 确保凭证文件在指定位置并路径正确 |

-   [📁 目录结构推荐](#tid-ZGRMDJ)
-   [🧰 一、准备工作](#tid-8JmGH6)
-       [1.1 注册并登录 Cloudflare](#tid-WNbw6x)
-       [1.2 添加域名到 Cloudflare（以 xxxx.com 为例）](#tid-DSwj5H)
-   [💾 二、下载并配置 cloudflared](#tid-Z4MM5J)
-       [2.1 下载 cloudflared.exe](#tid-6jrdGt)
-   [🔐 三、登录 Cloudflare 并授权](#tid-sskjcZ)
-       [3.1 登录 cloudflare](#tid-mBXaBE)
-       [3.2 拷贝 cert.pem 到指定目录](#tid-NwRBrR)
-   [🚇 四、创建 Tunnel 隧道](#tid-hJyK77)
-       [4.1：创建隧道](#tid-xpNT4d)
-   [📁 五、配置 config.yml](#tid-tcEWWj)
-   [🌐 六、将域名绑定到 Tunnel](#tid-TQi5tj)
-   [🚀 七、运行 Tunnel](#tid-zMSrXh)
-       [方式一：手动运行](#tid-ZnDeDn)
-       [方式二：注册为系统服务（可选）](#tid-Pxtwjd)
-   [🧪 八、测试访问](#tid-xrZH2F)
-   [🧱 九、防火墙和本地服务排查（如遇问题）](#tid-fPERDS)
-   [🧯 十、常见问题 FAQ](#tid-FD2hks)

# 🧯 十一、添加多个域名内网穿透（使用同一个隧道）

还是以上面创建的隧道`mytunnel`为例，如果要添加多个域名到同一个隧道，只需要在`config.yml`文件中增加对应的配置即可。
```yaml
tunnel: mytunnel
credentials-file: D:\cloudflared\mytunnel.json

ingress:
- hostname: a.xxxx.com   # 在cloudflared网站添加的域名（可以是子域名或者是顶级域名）
  service: http://localhost:8090 # 本地服务的地址
- hostname: b.xxxx.com
  service: http://localhost:3005
- service: http_status:404
```

做完这步之后，还需要在Cloudflare中将这两个域名都绑定到同一个隧道上。
打开Cloudflare的Dashboard，在domains域名管理页面，找到b域名b.xxx.com，点击进去，找到“DNS记录”，添加一条CNAME记录，填写表单：
- 类型：选择 CNAME。
- 名称：输入 b.xxx.com（或 @ 表示根域名）。
- 目标：输入 YOUR_TUNNEL_NAME.cfargotunnel.com（请替换为您创建隧道时 Cloudflare 给出的实际地址，通常是格式为 mytunnel.cfargotunnel.com），比如
  a.xxx.com的目标地址为：50558fd0-8208-4a5c-8547-1fbc341602d4.cfargotunnel.com，所以b.xxx.com的目标地址也设置为：50558fd0-8208-4a5c-8547-1fbc341602d4.cfargotunnel.com，因为它们是共用一个隧道的。
- TTL：选择 Auto。
- 代理状态：确保选择为 Proxied（橙色云朵图标）。

点击保存，等待DNS生效。

注意：记得启动服务的时候需要加参数--config D:\cloudflared\config.yml，使用你已经写好的配置文件，否则只会启动一个域名。


---

本文转载于博客园 - 随手一只风