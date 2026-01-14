import { ProxyNode } from './types';

// Parse Clash YAML to extract proxy nodes
export function parseYamlToProxies(yaml: string): ProxyNode[] {
  const lines = yaml.split('\n');
  const proxies: ProxyNode[] = [];
  let inProxiesSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if we're entering the proxies section
    if (line === 'proxies:') {
      inProxiesSection = true;
      continue;
    }

    // Exit proxies section when we hit another section
    if (inProxiesSection && (line.startsWith('proxy-groups:') || line.startsWith('rules:'))) {
      break;
    }

    // Parse proxy lines in JSON format: - {"type":"ss",...}
    if (inProxiesSection && line.startsWith('- {') && line.endsWith('}')) {
      try {
        const jsonStr = line.substring(2).trim();
        const proxyConfig = JSON.parse(jsonStr);
        if (proxyConfig.type && proxyConfig.name) {
          proxies.push(proxyConfig as ProxyNode);
        }
      } catch {
        // Try YAML format parsing
        const proxy = parseYamlProxyLine(lines, i);
        if (proxy) {
          proxies.push(proxy);
        }
      }
    }
  }

  return proxies;
}

// Parse proxy from YAML multiline format
function parseYamlProxyLine(lines: string[], startIndex: number): ProxyNode | null {
  const firstLine = lines[startIndex].trim();

  // Check if it's a proxy entry starting with '- name:'
  if (!firstLine.startsWith('- name:')) {
    return null;
  }

  // Extract name from first line
  const nameMatch = firstLine.match(/- name:\s*"?([^"\n]+)"?/);
  if (!nameMatch) return null;

  const name = nameMatch[1];
  let type = '';
  const config: any = { name };

  // Parse subsequent lines
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Stop if we hit another proxy or section
    if (line.startsWith('- name:') || line.startsWith('proxy-groups:') || line.startsWith('rules:') || !line.startsWith('-') && !line.startsWith('name:')) {
      break;
    }

    // Parse key-value pairs
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Handle quoted strings
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if (!isNaN(Number(value))) {
      value = Number(value);
    }

    if (key === 'type') {
      type = value as string;
    }
    config[key] = value;
  }

  if (!type) return null;
  return config as ProxyNode;
}

// Convert proxies back to proxy links (for export)
export function proxiesToLinks(proxies: ProxyNode[]): string[] {
  const links: string[] = [];

  for (const proxy of proxies) {
    const link = proxyToLink(proxy);
    if (link) {
      links.push(link);
    }
  }

  return links;
}

// Convert a single proxy to its link format
function proxyToLink(proxy: ProxyNode): string | null {
  switch (proxy.type) {
    case 'ss':
      return ssToLink(proxy);
    case 'ssr':
      return ssrToLink(proxy);
    case 'vmess':
      return vmessToLink(proxy);
    case 'trojan':
      return trojanToLink(proxy);
    case 'vless':
      return vlessToLink(proxy);
    case 'hysteria2':
      return hysteria2ToLink(proxy);
    case 'socks5':
      return socks5ToLink(proxy);
    case 'http':
      return httpToLink(proxy);
    default:
      return null;
  }
}

// Helper functions to convert proxy config to link
function ssToLink(proxy: ProxyNode): string {
  const userInfo = `${proxy.cipher}:${proxy.password}`;
  const encoded = btoa(userInfo);
  return `ss://${encoded}@${proxy.server}:${proxy.port}#${encodeURIComponent(proxy.name)}`;
}

function ssrToLink(proxy: ProxyNode): string {
  // SSR format: server:port:protocol:method:obfs:passwordbase64
  const passwordEncoded = btoa(proxy.password);
  const plain = `${proxy.server}:${proxy.port}:${proxy.protocol}:${proxy.cipher}:${proxy.obfs}:${passwordEncoded}`;
  const encoded = btoa(plain);
  return `ssr://${encoded}/?remarks=${encodeURIComponent(proxy.name)}`;
}

function vmessToLink(proxy: ProxyNode): string {
  const config = {
    v: '2',
    ps: proxy.name,
    add: proxy.server,
    port: String(proxy.port),
    id: proxy.uuid,
    aid: String(proxy.alterId || 0),
    scy: proxy.cipher || 'auto',
    net: proxy.network || 'tcp',
    type: '',
    tls: proxy.tls ? 'tls' : '',
  };
  const jsonStr = JSON.stringify(config);
  const encoded = btoa(jsonStr);
  return `vmess://${encoded}`;
}

function trojanToLink(proxy: ProxyNode): string {
  let link = `trojan://${proxy.password}@${proxy.server}:${proxy.port}`;
  const params: string[] = [];
  if (proxy.sni) params.push(`sni=${encodeURIComponent(proxy.sni)}`);
  if (proxy['skip-cert-verify']) params.push('allowInsecure=1');
  if (params.length) link += `?${params.join('&')}`;
  link += `#${encodeURIComponent(proxy.name)}`;
  return link;
}

function vlessToLink(proxy: ProxyNode): string {
  let link = `vless://${proxy.uuid}@${proxy.server}:${proxy.port}`;
  const params: string[] = [];
  params.push(`encryption=none`);
  params.push(`security=${proxy.tls ? 'tls' : 'none'}`);
  params.push(`type=${proxy.network || 'tcp'}`);
  if (proxy.sni) params.push(`sni=${encodeURIComponent(proxy.sni)}`);
  if (proxy['skip-cert-verify']) params.push('allowInsecure=1');
  if (params.length) link += `?${params.join('&')}`;
  link += `#${encodeURIComponent(proxy.name)}`;
  return link;
}

function hysteria2ToLink(proxy: ProxyNode): string {
  let link = `hysteria2://${proxy.password}@${proxy.server}:${proxy.port}`;
  const params: string[] = [];
  if (proxy.sni) params.push(`sni=${encodeURIComponent(proxy.sni)}`);
  if (proxy['skip-cert-verify']) params.push('insecure=1');
  if (params.length) link += `/?${params.join('&')}`;
  link += `#${encodeURIComponent(proxy.name)}`;
  return link;
}

function socks5ToLink(proxy: ProxyNode): string {
  let link = `socks5://`;
  if (proxy.username && proxy.password) {
    link += `${encodeURIComponent(proxy.username)}:${encodeURIComponent(proxy.password)}@`;
  }
  link += `${proxy.server}:${proxy.port}#${encodeURIComponent(proxy.name)}`;
  return link;
}

function httpToLink(proxy: ProxyNode): string {
  let link = `http://`;
  if (proxy.username && proxy.password) {
    link += `${encodeURIComponent(proxy.username)}:${encodeURIComponent(proxy.password)}@`;
  }
  link += `${proxy.server}:${proxy.port}#${encodeURIComponent(proxy.name)}`;
  return link;
}
