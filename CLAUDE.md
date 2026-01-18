# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ClashConverter** is a client-side proxy configuration converter built with Next.js 16. It transforms various proxy protocols (SS, SSR, Vmess, Trojan, Hysteria, VLESS, HTTP, SOCKS5) into Clash YAML format.

**Key Design Principle**: Pure frontend static service - user inputs are never stored on backend servers for privacy. All processing happens client-side.

## Development Commands

```bash
pnpm dev      # Start development server on port 3000
pnpm build    # Build for production
pnpm start    # Start production server
pnpm run lint # Run ESLint
npx tsc --noEmit # TypeScript type check
```

## Technology Stack

- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript 5.6+ (strict mode)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Icons**: Lucide React
- **Internationalization**: next-intl v4
- **Notifications**: Sonner (toast)
- **Theme**: next-themes

## Architecture

### Project Structure
```
app/                      # Next.js App Router directory
├── [locale]/             # Localized routes (en, zh)
│   └── page.tsx          # Main converter page
├── layout.tsx            # Root layout with Geist Sans/Mono fonts
├── globals.css           # Tailwind v4 + dark mode CSS variables
└── favicon.ico

components/               # React components
├── converter.tsx         # Main converter component with state management
├── language-toggle.tsx   # Language selector (Select component)
├── theme-toggle.tsx      # Theme switcher (dark/light mode)
├── theme-provider.tsx    # Theme context provider
├── google-analytics.tsx  # Google Analytics integration
├── google-adsense.tsx    # Google AdSense integration
└── ui/                   # shadcn/ui components
    ├── button.tsx
    ├── textarea.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── select.tsx
    └── hover-card.tsx

lib/                      # Core utilities
├── parsers/              # Protocol parsing logic
│   ├── index.ts          # Main parser entry with validation
│   └── protocol-parsers.ts  # Individual protocol parsers (SS, SSR, VMess, etc.)
├── types.ts              # TypeScript interfaces (ProxyNode, ParsedProxy, etc.)
├── yaml-parser.ts        # Parse YAML to proxy links
├── yaml-generator.ts     # Generate YAML from proxy nodes
├── rules-content.ts      # Clash routing rules
└── utils.ts              # Utility functions (cn, base64Decode, etc.)

messages/                 # next-intl translation files
├── en.json               # English translations
└── zh.json               # Simplified Chinese translations

proxy.ts             # Locale detection and routing (Next.js 16 proxy pattern)
i18n.ts                   # next-intl configuration
```

### Path Aliases (configured in tsconfig.json and components.json)
- `@/*` → `./` (root directory)
- `@/components` → Components directory (for shadcn/ui)
- `@/lib` → Library directory

### Component System
- Uses shadcn/ui with RSC (React Server Components) enabled
- Style: "new-york" with "stone" base color
- CSS variables enabled for theming (supports dark/light mode)
- When adding shadcn components: use `npx shadcn@latest add <component>`

## Core Features

### Protocol Support
The app supports 9 proxy protocols:
1. **SS** (Shadowsocks) - `ss://base64#name`
2. **SSR** (ShadowsocksR) - `ssr://base64#name`
3. **VMess** - `vmess://base64(json)#name`
4. **VLESS** - `vless://uuid@server:port?params#name`
5. **Trojan** - `trojan://password@server:port#name`
6. **Hysteria** - `hysteria://server:port?params#name`
7. **Hysteria2** - `hysteria2://password@server:port/?params#name`
8. **HTTP** - `http://user:pass@server:port#name`
9. **SOCKS5** - `socks5://server:port#name`

### Key Implementation Details

#### Parser Logic (`lib/parsers/index.ts`)
- `parseProxyLink()`: Attempts to parse a single link using all protocol parsers
- `parseMultipleProxies()`: Parses multiple lines, returns `{ proxies, unsupported }`
- Protocol case handling: Only the protocol prefix is lowercased; base64 content preserves original casing
- Unsupported protocols trigger error toasts via Sonner

#### YAML Generator (`lib/yaml-generator.ts`)
- `generateSimpleYaml()`: Main function that generates complete Clash YAML
- Includes DNS configuration with fake-ip mode
- Includes multiple proxy groups (select, url-test)
- Uses single-line JSON format for proxy nodes
- Clash rules from `rules-content.ts`

#### YAML Parser (`lib/yaml-parser.ts`)
- `parseYamlToProxies()`: Parses Clash YAML to extract proxy nodes
- `proxiesToLinks()`: Converts proxy nodes back to shareable links
- `proxyToLink()`: Routes to appropriate link generator based on type
- Distinguishes hysteria v1 (has `auth`) vs v2 (has `password`)

#### Type System (`lib/types.ts`)
```typescript
type ProxyType = 'ss' | 'ssr' | 'vmess' | 'trojan' | 'hysteria' | 'hysteria2' | 'vless' | 'http' | 'socks5';

interface ProxyNode {
  name: string;
  type: ProxyType;
  server: string;
  port: number;
  [key: string]: any; // Protocol-specific fields
}
```

### Locale Detection
- Uses `proxy.ts` (Next.js 16 proxy pattern) instead of deprecated proxy
- Detects user country from Cloudflare/Vercel headers: `cf-ipcountry`, `x-vercel-ip-country`
- Redirects Chinese regions (CN, HK, TW, MO, SG) to `/zh`, others to `/en`
- Stores preference in `NEXT_LOCALE` cookie (1 year expiry)

### Kernel Type Selection
Users can choose between:
- **Clash Meta (Mihomo)**: Supports all protocols including VLESS, Hysteria, Hysteria2
- **Clash Premium**: Does NOT support VLESS, Hysteria, Hysteria2 (shows warning toast)

When Clash Premium is selected, unsupported protocols are filtered out with a toast notification.

## Important Notes for Development

### Adding New Protocol Support
1. Add parser function in `lib/parsers/protocol-parsers.ts`
2. Add to parsers array in `lib/parsers/index.ts`
3. Add link generator in `lib/yaml-parser.ts`
4. Update `ProxyType` in `lib/types.ts`
5. Add format example in `messages/en.json` and `messages/zh.json`

### Common Issues
- **Protocol case sensitivity**: Only lowercase the protocol prefix, preserve base64 casing
- **Hash fragment names**: Always extract `#name` from links for node naming
- **Hysteria types**: Both hysteria and hysteria2 output as `type: hysteria` in YAML

### Testing
Run TypeScript check before committing:
```bash
npx tsc --noEmit
```

## SEO Domain

Primary domain: clashconverter.com

## Environment Variables

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX         # Google Analytics
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXX  # Google AdSense
```
