# Clash Converter

## 需求文档

convert config to clash yaml

1. 域名: clashconverter.com     - 最佳 SEO + 清晰功能 


这是项目能够实现将各种类型协议的代理 转化为 `clash yaml` 格式

- 使用 [shadcn component](https://ui.shadcn.com/docs/components) 构建纯前端静态服务，保证用户输入的内容不被保存到后端数据库
- 支持多语言：`简体中文/English`
- 支持预览功能；生成的 `yaml` 后，用户能直接下载该文件
- 支持昼夜主题切换，默认跟随系统主题
- 丰富的 `SEO` 配置能力，能偶帮助我快速获取 `google` 的自然流量
- 支持 `google adsence` 和 `google analytics` 环境变量接入
 
---

`example`: 将如下协议内容转化为 `clash yaml` 配置文件: `target.yaml`

```text
ss://YWVzLTI1Ni1nY206ZzVNZUQ2RnQzQ1dsSklkQDE5OC41Ny4yNy4yMTg6NTAwNA==#SS-HongKongNode1
vmess://eyJhZGQiOiIxNTQuMjMuMTkwLjE2MiIsInYiOjIsInBzIjoidjJyYXlzZV90ZXN0IiwicG9ydCI6NDQzLCJpZCI6ImI5OTg0Njc0LWY3NzEtNGU2Ny1hMTk4LWM3ZTYwNzIwYmEyYyIsImFpZCI6IjAiLCJzY3kiOiJhdXRvIiwibmV0Ijoid3MiLCJ0eXBlIjoiIiwidGxzIjoiIn0=#Vmess-HongKongNode1
ssr://MjAuMjM5LjQ5LjQ0OjU5ODE0Om9yaWdpbjpub25lOnBsYWluOk0yUm1OVGN5TnpZdE1ETmxaaTAwTldObUxXSmtaRFF0TkdWa1lqWmtabUZoTUdWbS8/Z3JvdXA9YUhSMGNITTZMeTkyTW5KaGVYTmxMbU52YlE9PSZyZW1hcms9ZGpKeVlYbHpaVjkwWlhOMA==#SSRHongKongNode1
trojan://bc7593fe-0604-4fbe-a70bYWVzLTI1Ni1nY206Q1VuZFNabllzUEtjdTaclWNFc1RmRBNk5NQU5KSnga3fa58ac5a3ef0-b4ab-11eb-b65e-1239d0255272@ca-trojan.bonds.id:443#Torjan-HongKongNode1
http://username:password@1.1.1.1:9999#Http-HongKongNode1
socks5://1.1.1.1:52443#Sock5-HongKongNode1
hysteria://1.1.1.1:51443?protocol=udp&auth=pekopeko&peer=wechat.com&insecure=1&upmbps=50&downmbps=250&alpn=h3#hyV1-HongKongNode1
hysteria://1.1.1.1:55443?protocol=udp&auth=pekopeko&peer=wechat.com&insecure=1&upmbps=50&downmbps=250&alpn=h3#hyV2-HongKongNode1
vless://aaa-bbb-ccc-ddd-eee@1.1.1.1:60443?encryption=none&security=tls&type=tcp&headerType=none#Vless-HongKongNode1
https://t.me/socks?server=1.1.1.1&port=61443&user=username&pass=password#Https-HongKongNode1
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```




