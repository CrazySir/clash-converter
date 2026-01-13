// Proxy node types for Clash configuration
export interface ProxyNode {
  name: string;
  type: 'ss' | 'ssr' | 'vmess' | 'trojan' | 'hysteria' | 'vless' | 'http' | 'socks5';
  server: string;
  port: number;
  [key: string]: any;
}

export interface ClashConfig {
  proxies: ProxyNode[];
  proxyNames: string[];
}

export interface ParsedProxy {
  name: string;
  config: ProxyNode;
}
