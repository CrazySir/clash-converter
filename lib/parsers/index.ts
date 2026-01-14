import { ParsedProxy, ProxyNode } from '../types';
import { parseSS, parseSSR, parseVmess, parseTrojan, parseHysteria, parseHysteria2, parseVless, parseHttp, parseSocks5, parseTelegramLink } from './protocol-parsers';

export function parseProxyLink(link: string): ParsedProxy | null {
  link = link.trim();
  if (!link) return null;

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

export function parseMultipleProxies(input: string): ProxyNode[] {
  const lines = input.split(/[\r\n]+/).filter(line => line.trim());
  const proxies: ProxyNode[] = [];

  for (const line of lines) {
    const result = parseProxyLink(line);
    if (result) {
      proxies.push(result.config);
    }
  }

  return proxies;
}
