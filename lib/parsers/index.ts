import { ParsedProxy, ProxyNode } from '../types';
import { parseSS, parseSSR, parseVmess, parseTrojan, parseHysteria, parseHysteria2, parseVless, parseHttp, parseSocks5, parseTelegramLink } from './protocol-parsers';

export function parseProxyLink(link: string): ParsedProxy | null {
  link = link.trim();
  if (!link) return null;

  // Check protocol prefix (case-insensitive) but keep original casing for base64 content
  const protocol = link.split(':')[0].toLowerCase();
  const hasKnownProtocol = ['ss', 'ssr', 'vmess', 'trojan', 'hysteria', 'hysteria2', 'vless', 'http', 'https', 'socks', 'socks5'].includes(protocol);

  // If it has a known protocol, only lowercase the protocol part
  if (hasKnownProtocol && link.includes('://')) {
    const protocolEnd = link.indexOf('://');
    link = link.substring(0, protocolEnd).toLowerCase() + link.substring(protocolEnd);
  }

  // Try each parser
  const parsers = [
    parseSS,
    parseSSR,
    parseVmess,
    parseTrojan,
    parseHysteria2,
    parseHysteria,
    parseVless,
    parseHttp,
    parseSocks5,
    parseTelegramLink,
  ];

  for (const parser of parsers) {
    const result = parser(link);
    if (result) return result;
  }

  return null;
}

export function parseMultipleProxies(input: string): { proxies: ProxyNode[]; unsupported: string[] } {
  const lines = input.split(/[\r\n]+/).filter(line => line.trim());
  const proxies: ProxyNode[] = [];
  const unsupported: string[] = [];

  // Supported protocol types
  const supportedProtocols = ['ss', 'ssr', 'vmess', 'trojan', 'hysteria', 'hysteria2', 'vless', 'http', 'https', 'socks', 'socks5'];

  for (const line of lines) {
    const result = parseProxyLink(line);
    if (result) {
      proxies.push(result.config);
    } else {
      // Check if it looks like a proxy link (has ://) but failed to parse
      if (line.includes('://')) {
        const protocol = line.split(':')[0].toLowerCase().trim();
        // Only report if it has a protocol prefix that's not in our supported list
        if (protocol && !supportedProtocols.includes(protocol)) {
          unsupported.push(protocol);
        }
      }
    }
  }

  return { proxies, unsupported };
}
