/**
 * Shadowsocks (SS) protocol adapter
 */

import type { ProxyNode } from '../types';
import type { IProtocolAdapter } from './protocol-adapter';
import { base64Encode } from '../utils';

/**
 * Adapter for Shadowsocks protocol
 */
export class SSAdapter implements IProtocolAdapter {
  readonly type = 'ss';

  toClashJson(node: ProxyNode): Record<string, any> {
    return {
      type: 'ss',
      name: node.name,
      server: node.server,
      port: node.port,
      cipher: node.cipher || 'aes-256-gcm',
      password: node.password,
      udp: true,
    };
  }

  toSingBoxJson(node: ProxyNode): Record<string, any> {
    return {
      tag: node.name,
      type: 'shadowsocks',
      server: node.server,
      server_port: node.port,
      method: node.cipher || 'aes-128-gcm',
      password: node.password,
    };
  }

  toLink(node: ProxyNode): string {
    const userInfo = `${node.cipher}:${node.password}`;
    const encoded = base64Encode(userInfo);
    return `ss://${encoded}@${node.server}:${node.port}#${encodeURIComponent(node.name)}`;
  }
}
