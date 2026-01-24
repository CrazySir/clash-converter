/**
 * Trojan protocol adapter
 */

import type { ProxyNode } from '../types';
import type { IProtocolAdapter } from './protocol-adapter';

/**
 * Adapter for Trojan protocol
 */
export class TrojanAdapter implements IProtocolAdapter {
  readonly type = 'trojan';

  toClashJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      type: 'trojan',
      name: node.name,
      server: node.server,
      port: node.port,
      password: node.password,
      udp: node.udp ?? true,
    };

    if (node['skip-cert-verify']) obj['skip-cert-verify'] = node['skip-cert-verify'];
    if (node.sni) obj.sni = node.sni;

    return obj;
  }

  toSingBoxJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      tag: node.name,
      type: 'trojan',
      server: node.server,
      server_port: node.port,
      password: node.password,
      tls: {
        enabled: true,
        ...(node['skip-cert-verify'] !== undefined && { insecure: node['skip-cert-verify'] }),
        ...(node.sni && { server_name: node.sni }),
      },
    };

    return obj;
  }

  toLink(node: ProxyNode): string {
    let link = `trojan://${node.password}@${node.server}:${node.port}`;
    const params: string[] = [];
    params.push(`type=${node.network || 'tcp'}`);
    if (node['skip-cert-verify']) {
      params.push('security=tls');
      params.push('allowInsecure=1');
    }
    if (node.sni) params.push(`sni=${encodeURIComponent(node.sni)}`);
    if (params.length) link += `?${params.join('&')}`;
    link += `#${encodeURIComponent(node.name)}`;
    return link;
  }
}
