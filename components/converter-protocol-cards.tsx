import { memo } from 'react';

const PROTOCOL_CARDS = [
  { name: 'Shadowsocks' },
  { name: 'ShadowsocksR' },
  { name: 'Vmess' },
  { name: 'VLESS' },
  { name: 'Trojan' },
  { name: 'Hysteria' },
  { name: 'HTTP' },
  { name: 'SOCKS5' },
] as const;

export const ProtocolCards = memo(() => (
  <div className="grid grid-cols-2 gap-3 text-sm">
    {PROTOCOL_CARDS.map((protocol) => (
      <div key={protocol.name} className="flex items-center gap-2 p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
        <span className="font-mono text-xs bg-stone-200 dark:bg-stone-700 px-2 py-1 rounded">
          {protocol.name}
        </span>
      </div>
    ))}
  </div>
));

ProtocolCards.displayName = 'ProtocolCards';
