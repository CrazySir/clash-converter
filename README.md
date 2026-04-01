# Clash Converter

A client-side proxy configuration converter that transforms various proxy protocols into Clash YAML or Sing-Box JSON formats.

[![Clash Converter](https://img.shields.io/badge/Clash-Converter-blue)](https://clashconverter.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

- **Client-side Processing**: All conversions happen in your browser - no server involved
- **9 Proxy Protocols**: SS, SSR, VMess, VLESS, Trojan, Hysteria, Hysteria2, HTTP, SOCKS5
- **Multiple Output Formats**: Clash Meta, Clash Premium, Sing-Box, Loon
- **Bidirectional Conversion**: Proxy links ↔ Clash YAML ↔ Sing-Box JSON
- **Multi-Language**: English & 简体中文
- **Dark/Light Theme**: System preference detection with Neo-Technical Minimalism design

## Quick Start

```bash
# Clone and install
git clone https://github.com/sunway910/clashconverter.git
cd clashconverter
pnpm install

# Development
pnpm dev

# Production build
pnpm build

# Cloudflare Workers
pnpm build:cf && pnpm deploy:cf
```

## Environment Variables

Create `.env.local`:

```bash
# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXX

# Optional: Contact email
NEXT_PUBLIC_CONTACT_EMAIL=your-email@gmail.com

# Feature flags (default: true)
NEXT_PUBLIC_ENABLE_CLASH_META_TRANSFER=true
NEXT_PUBLIC_ENABLE_CLASH_PREMIUM_TRANSFER=true
NEXT_PUBLIC_ENABLE_SINGBOX_TRANSFER=true
NEXT_PUBLIC_ENABLE_LOON_TRANSFER=true
```

## Project Structure

```
clashconverter/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── dialogs/     # Dialog components
│   ├── seo/         # SEO components
│   └── ...
├── lib/              # Core utilities
│   ├── core/         # Factory & Registry patterns
│   ├── adapters/     # Protocol adapters
│   ├── generators/   # Output generators
│   ├── parsers/      # Input parsers
│   ├── types/        # Type definitions
│   └── errors/       # Custom error classes
├── messages/         # i18n translations
└── public/           # Static assets
```

## Architecture

- **Factory Pattern**: `FormatFactory` creates parsers/generators
- **Adapter Pattern**: Clean protocol-specific logic abstraction
- **Type Safety**: Discriminated union types + Zod runtime validation
- **Error Handling**: Custom error classes with structured codes

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.5 (App Router) |
| Language | TypeScript 5.6+ |
| Styling | Tailwind CSS v3 |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Code Editor | CodeMirror 6 |
| i18n | next-intl v4 |
| Theme | next-themes |
| Notifications | Sonner |
| Validation | Zod v4 |
| YAML | yaml library |
| Deployment | Cloudflare Workers |

## Testing

```bash
# Run all tests
pnpm test

# Run with UI
pnpm test:ui

# Run with coverage
pnpm test:coverage
```

## Design System

**Neo-Technical Minimalism** - A refined, technical aesthetic with:

- **Colors**: Warm neutral canvas (`#F5F3EE` / `#0A0A0C` dark)
- **Accent**: Electric cyan (`#00D9FF`)
- **Typography**: Inter (body), Space Grotesk (headings), JetBrains Mono (labels)
- **Features**: Structural grid backgrounds, subtle shadows, smooth animations

## Supported Protocols

| Protocol | Format | Input | Output |
|----------|--------|-------|--------|
| Shadowsocks | `ss://` | ✓ | ✓ |
| ShadowsocksR | `ssr://` | ✓ | ✓ |
| VMess | `vmess://` | ✓ | ✓ |
| VLESS | `vless://` | ✓ | ✓ |
| Trojan | `trojan://` | ✓ | ✓ |
| Hysteria | `hysteria://` | ✓ | ✓ |
| Hysteria2 | `hysteria2://` | ✓ | ✓ |
| HTTP | `http://` | ✓ | ✓ |
| SOCKS5 | `socks5://` | ✓ | ✓ |

## Output Format Compatibility

| Format | SS | SSR | VMess | VLESS | Trojan | Hysteria | Hysteria2 | HTTP | SOCKS5 |
|--------|----|-----|-------|-------|--------|----------|-----------|------|--------|
| Clash Meta | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Clash Premium | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ |
| Sing-Box | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Loon | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

Domain: [clashconverter.com](https://clashconverter.com)
