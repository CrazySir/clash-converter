/**
 * VMess protocol adapter
 */

import type { ProxyNode } from '../types';
import type { IProtocolAdapter } from './protocol-adapter';

/**
 * Adapter for VMess protocol
 */
export class VMessAdapter implements IProtocolAdapter {
  readonly type = 'vmess';

  toClashJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      type: 'vmess',
      name: node.name,
      server: node.server,
      port: node.port,
      uuid: node.uuid,
      alterId: node.alterId || 0,
      cipher: node.cipher || 'auto',
      network: node.network || 'tcp',
      udp: true,
    };

    if (node.tls !== undefined) obj.tls = node.tls;
    if (node['skip-cert-verify'] !== undefined) obj['skip-cert-verify'] = node['skip-cert-verify'];
    if (node.servername) obj.servername = node.servername;

    return obj;
  }

  toSingBoxJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      tag: node.name,
      type: 'vmess',
      server: node.server,
      server_port: node.port,
      uuid: node.uuid,
      packet_encoding: 'xudp',
      security: node.cipher || 'auto',
      alter_id: 0,
    };

    if (node.network === 'ws') {
      obj.transport = { type: 'ws' };
    }

    if (node.tls || node.servername) {
      obj.tls = {
        enabled: true,
        ...(node.servername && { server_name: node.servername }),
      };
    }

    if (node['skip-cert-verify']) {
      if (!obj.tls) obj.tls = { enabled: true };
      obj.tls.insecure = node['skip-cert-verify'];
    }

    return obj;
  }

  toLink(node: ProxyNode): string {
    const jsonStr = `{"v":"2","ps":"${node.name}","add":"${node.server}","port":${node.port},"id":"${node.uuid}","aid":${node.alterId || 0},"scy":"${node.cipher || 'auto'}","net":"${node.network || 'tcp'}","tls":"${node.tls ? 'tls' : ''}"}`;
    const encoded = btoa(jsonStr);
    return `vmess://${encoded}`;
  }
}
