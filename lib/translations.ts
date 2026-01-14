export type Language = 'en' | 'zh';

export const translations = {
  en: {
    title: 'Clash Converter',
    subtitle: {
      'proxies-to-yaml': 'Convert proxy links to Clash YAML format',
      'yaml-to-proxies': 'Extract proxy links from Clash YAML',
    },
    inputLabel: {
      'proxies-to-yaml': 'Proxy Links',
      'yaml-to-proxies': 'YAML Config',
    },
    outputLabel: {
      'proxies-to-yaml': 'Clash YAML',
      'yaml-to-proxies': 'Proxy Links',
    },
    inputDescription: {
      'proxies-to-yaml': 'Paste your proxy links - one per line',
      'yaml-to-proxies': 'Paste your Clash YAML configuration',
    },
    outputDescription: {
      'proxies-to-yaml': 'Preview and download your Clash configuration',
      'yaml-to-proxies': 'Preview and download your proxy links',
    },
    inputPlaceholder: {
      'proxies-to-yaml': `ss://...
vmess://...
trojan://...
vless://...
hysteria2://...
socks5://...
ssr://...
http://...`,
      'yaml-to-proxies': `proxies:
  - {"type":"ss","name":"...","server":"...","port":...}
  - {"type":"vmess",...}

proxy-groups:
  - name: 🚀 节点选择
    type: select
    proxies: ...`,
    },
    itemsFound: '{count} item(s) found',
    clear: 'Clear',
    download: 'Download',
    copy: 'Copy',
    copied: 'Copied!',
    swapDirection: 'Swap Direction',
    supportedProtocols: 'Supported Protocols',
    outputPlaceholder: {
      'proxies-to-yaml': '# Your Clash config will appear here',
      'yaml-to-proxies': '# Your proxy links will appear here',
    },
    downloadFilename: {
      'proxies-to-yaml': 'clash-config.yaml',
      'yaml-to-proxies': 'proxies.txt',
    },
  },
  zh: {
    title: 'Clash 转换器',
    subtitle: {
      'proxies-to-yaml': '将代理链接转换为 Clash YAML 格式',
      'yaml-to-proxies': '从 Clash YAML 中提取代理链接',
    },
    inputLabel: {
      'proxies-to-yaml': '代理链接',
      'yaml-to-proxies': 'YAML 配置',
    },
    outputLabel: {
      'proxies-to-yaml': 'Clash YAML',
      'yaml-to-proxies': '代理链接',
    },
    inputDescription: {
      'proxies-to-yaml': '粘贴您的代理链接，每行一个',
      'yaml-to-proxies': '粘贴您的 Clash YAML 配置',
    },
    outputDescription: {
      'proxies-to-yaml': '预览并下载您的 Clash 配置',
      'yaml-to-proxies': '预览并下载您的代理链接',
    },
    inputPlaceholder: {
      'proxies-to-yaml': `ss://...
vmess://...
trojan://...
vless://...
hysteria2://...
socks5://...
ssr://...
http://...`,
      'yaml-to-proxies': `proxies:
  - {"type":"ss","name":"...","server":"...","port":...}
  - {"type":"vmess",...}

proxy-groups:
  - name: 🚀 节点选择
    type: select
    proxies: ...`,
    },
    itemsFound: '找到 {count} 个项目',
    clear: '清除',
    download: '下载',
    copy: '复制',
    copied: '已复制！',
    swapDirection: '切换方向',
    supportedProtocols: '支持的协议',
    outputPlaceholder: {
      'proxies-to-yaml': '# 您的 Clash 配置将显示在这里',
      'yaml-to-proxies': '# 您的代理链接将显示在这里',
    },
    downloadFilename: {
      'proxies-to-yaml': 'clash-config.yaml',
      'yaml-to-proxies': 'proxies.txt',
    },
  },
};
