---
title: "ngrok 私有化部署与使用指南"
description: "ngrok 私有化部署与使用指南&实战"
publishDate: 2026-02-05
updatedDate: 2026-02-05
category: "技术"
tags: ["技术", "内网穿透"]
---

# ngrok 私有化部署与使用指南

## 一、准备工作

### 1. 域名准备
- 注册域名（示例：`ngrok.yourdomain.com`）
- 添加DNS解析记录：
  ```text
  A记录 @ → 云服务器公网IP
  A记录 *.ngrok → 云服务器公网IP
  
### 2. 服务器环境要求
- 操作系统：Ubuntu 22.04+
- 开放端口：80/tcp, 443/tcp, 4443/tcp
- 安装依赖：
```bash
  sudo apt update && sudo apt install -y git golang make openssl
```

## 二、服务端部署
### 1. 获取源码
```bash
git clone https://github.com/inconshreveable/ngrok.git
cd ngrok
```
### 2. 生成SSL证书
```bash
export NGROK_DOMAIN="ngrok.yourdomain.com"
openssl genrsa -out rootCA.key 2048
openssl req -x509 -new -nodes -key rootCA.key -subj "/CN=$NGROK_DOMAIN" -days 5000 -out rootCA.pem
openssl genrsa -out server.key 2048
openssl req -new -key server.key -subj "/CN=$NGROK_DOMAIN" -out server.csr
openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 5000
```
每一行均为一个命令

### 3. 替换证书
```bash
cp rootCA.pem assets/client/tls/ngrokroot.crt
cp server.crt assets/server/tls/snakeoil.crt
cp server.key assets/server/tls/snakeoil.key
```
### 4. 编译服务端
```bash
make release-server
```
### 5. 启动服务端
```bash
sudo ./bin/ngrokd -domain="$NGROK_DOMAIN" -httpAddr=":80" -httpsAddr=":443"
```
### 6. 配置系统服务（可选）
创建 /etc/systemd/system/ngrokd.service：
```bash
[Unit]
Description=Ngrok Server
After=network.target

[Service]
ExecStart=/path/to/ngrok/bin/ngrokd -domain=ngrok.yourdomain.com -httpAddr=:80 -httpsAddr=:443
Restart=always

[Install]
WantedBy=multi-user.target
```
启用服务：
```bash
sudo systemctl enable ngrokd
sudo systemctl start ngrokd
```

## 三、客户端使用
### 1. 获取客户端
```bash
make release-client
```
生成客户端位于 ngrok/bin/ 目录

### 2. 基本配置
创建 ngrok.cfg 配置文件：
`yaml`:
```yaml
server_addr: "ngrok.yourdomain.com:4443"
trust_host_root_certs: true
```
### 3. 启动隧道
- HTTP隧道：
```bash
./ngrok -config=ngrok.cfg -proto=http 8080
```
- TCP隧道：
```bash
./ngrok -config=ngrok.cfg -subdomain=test 80 
```

## 四、高级配置
### 1. 身份验证
服务端启动参数：
```bash
./ngrokd -auth="username:password"
```
### 2. HTTPS支持
```bash
# 服务端启动命令
./ngrokd -tlsKey=server.key -tlsCrt=server.crt

# 客户端访问地址
https://test.ngrok.yourdomain.com
```
### 3. 监控面板
访问地址：
```bash
http://ngrok.yourdomain.com:4040
```

## 五、注意事项
### 1.防火墙配置：
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 4443/tcp
```

### 2.客户端别名设置：
```bash
echo 'alias ngrok="/path/to/ngrok -config=/path/to/ngrok.cfg"' >> ~/.bashrc
```
### 3.安全建议：
- 使用强密码进行身份验证
- 定期轮换SSL证书
- 启用HTTPS强制跳转