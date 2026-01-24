/**
 * ShadowsocksR (SSR) protocol adapter
 */

import type { ProxyNode } from '../types';
import type { IProtocolAdapter } from './protocol-adapter';

/**
 * Base64 encode with URL-safe variant (no padding)
 */
function base64EncodeUrlSafe(str: string): string {
  const encoded = btoa(str);
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Adapter for ShadowsocksR protocol
 */
export class SSRAdapter implements IProtocolAdapter {
  readonly type = 'ssr';

  toClashJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      type: 'ssr',
      name: node.name,
      server: node.server,
      port: node.port,
      cipher: node.cipher,
      password: node.password,
      protocol: node.protocol,
      obfs: node.obfs,
    };

    if (node.protocolparam) obj.protocolparam = node.protocolparam;
    if (node.obfsparam) obj.obfsparam = node.obfsparam;
    if (node.group) obj.group = node.group;

    return obj;
  }

  toSingBoxJson(_node: ProxyNode): Record<string, any> {
    // Sing-Box doesn't support SSR, create a basic shadowsocks fallback
    return {
      tag: _node.name,
      type: 'shadowsocks',
      server: _node.server,
      server_port: _node.port,
      method: _node.cipher || 'aes-128-gcm',
      password: _node.password,
    };
  }

  toLink(node: ProxyNode): string {
    // SSR format: ssr://base64(main)/base64(params)
    const cipher = node.cipher === 'dummy' ? 'auto' : node.cipher;
    const passwordEncoded = btoa(node.password);
    const plain = `${node.server}:${node.port}:${node.protocol}:${cipher}:${node.obfs}:${passwordEncoded}/`;
    let encoded = btoa(plain);
    encoded = encoded.replace(/=+$/, '');

    // Build params string with base64 encoded VALUES
    const paramsParts: string[] = [];
    paramsParts.push(`remarks=${btoa(node.name)}`);
    if (node.group) {
      paramsParts.push(`group=${btoa(node.group)}`);
    }
    if (node['protoparam']) {
      paramsParts.push(`protoparam=${btoa(node['protoparam'])}`);
    }
    if (node['obfsparam']) {
      paramsParts.push(`obfsparam=${btoa(node['obfsparam'])}`);
    }

    const paramsStr = paramsParts.join('&');
    const encodedParams = btoa(paramsStr);

    return `ssr://${encoded}/${encodedParams}`;
  }
}
