# 2clash
convert code to clash yaml

1. clashconverter.com     - 最佳 SEO + 清晰功能
2. convert-to-clash.com   - 搜索意图明确
3. proxy-to-clash.com     - 覆盖范围广
4. clashconfig.com        - 简洁专业
5. clashify.io           - 品牌化 + 科技感
5. clashify.vip           
5. clashify.cloud          
5. clashify.club          
5. clashify.icu          


这是项目能够实现将各种类型协议的代理 转化为 `clash yaml` 格式

- 使用 [shadcn component](https://ui.shadcn.com/docs/components) 构建纯前端静态服务，保证用户输入的内容不被保存到后端数据库
- 参考实现：https://v1.v2rayse.com/en/v2ray-clash
- 支持多语言：`简体中文/english/繁体中文`
- 支持预览功能；生成的 `yaml` 后，提供下载功能
- 支持昼夜主题切换，默认跟随系统主题
- 丰富的 `SEO` 配置能力，能偶帮助我快速获取 `google` 的自然流量
- 支持 `google adsence` 和 `google analytics` 环境变量接入
 
---

`example`: 将如下协议内容转化为 `clash yaml` 配置文件: `target.yaml`

```text
ss://YWVzLTI1Ni1nY206ZzVNZUQ2RnQzQ1dsSklkQDE5OC41Ny4yNy4yMTg6NTAwNA==#v2rayse_test
vmess://eyJhZGQiOiIxNTQuMjMuMTkwLjE2MiIsInYiOjIsInBzIjoidjJyYXlzZV90ZXN0IiwicG9ydCI6NDQzLCJpZCI6ImI5OTg0Njc0LWY3NzEtNGU2Ny1hMTk4LWM3ZTYwNzIwYmEyYyIsImFpZCI6IjAiLCJzY3kiOiJhdXRvIiwibmV0Ijoid3MiLCJ0eXBlIjoiIiwidGxzIjoiIn0=
ssr://MjAuMjM5LjQ5LjQ0OjU5ODE0Om9yaWdpbjpub25lOnBsYWluOk0yUm1OVGN5TnpZdE1ETmxaaTAwTldObUxXSmtaRFF0TkdWa1lqWmtabUZoTUdWbS8/Z3JvdXA9YUhSMGNITTZMeTkyTW5KaGVYTmxMbU52YlE9PSZyZW1hcms9ZGpKeVlYbHpaVjkwWlhOMA==
trojan://bc7593fe-0604-4fbe-a70bYWVzLTI1Ni1nY206Q1VuZFNabllzUEtjdTaclWNFc1RmRBNk5NQU5KSnga3fa58ac5a3ef0-b4ab-11eb-b65e-1239d0255272@ca-trojan.bonds.id:443#v2rayse_test
http://username:password@124.15.12.24:251
socks5://124.15.12.24:2312
hysteria://1.2.3.4:12854?protocol=udp&auth=pekopeko&peer=wechat.com&insecure=1&upmbps=50&downmbps=250&alpn=h3#Hys-1.2.3.4
vless://abc-def-ghi-fge-zsx@1.2.3.4:7777?encryption=none&security=tls&type=tcp&headerType=none#test
https://t.me/socks?server=1.2.3.4&port=123&user=username&pass=password
```


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





