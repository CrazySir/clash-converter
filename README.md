# Clash Converter

A client-side proxy configuration converter that transforms various proxy protocols into Clash YAML format. Built with Next.js 16, featuring real-time preview, multi-language support, and comprehensive SEO optimization.

[![Clash Converter](https://img.shields.io/badge/Clash-Converter-blue)](https://clashconverter.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

- **Client-side Processing**: All conversions happen in your browser - your proxy configurations are never sent to any server
- **Multi-Protocol Support**: Supports 9 proxy protocols
  - Shadowsocks (SS)
  - ShadowsocksR (SSR)
  - VMess
  - VLESS
  - Trojan
  - Hysteria / Hysteria2
  - HTTP / HTTPS
  - SOCKS5
  - Telegram SOCKS links
- **Bidirectional Conversion**: Convert proxy links to Clash YAML and vice versa
- **Kernel Selection**: Generate configs for Clash Meta (Mihomo) or Clash Premium
- **DNS Configuration**: Includes comprehensive DNS settings with fake-ip mode
- **IP-Based Locale Detection**: Automatically detects user location and redirects to appropriate language
- **Multi-Language**: English and Simplified Chinese (简体中文)
- **Theme Support**: Dark/Light mode with system preference detection
- **Live Preview**: Real-time preview of generated YAML
- **Download Support**: One-click download of generated configuration files

## Supported Protocols

| Protocol | Format Example |
|----------|----------------|
| SS | `ss://base64(method:password@server:port)#name` |
| SSR | `ssr://base64#name` |
| VMess | `vmess://base64(json)#name` |
| VLESS | `vless://uuid@server:port?params#name` |
| Trojan | `trojan://password@server:port#name` |
| Hysteria | `hysteria://server:port?params#name` |
| Hysteria2 | `hysteria2://password@server:port/?params#name` |
| HTTP | `http://user:pass@server:port#name` |
| SOCKS5 | `socks5://server:port#name` |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/clashconverter.git
cd clashconverter

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
clashconverter/
├── app/                      # Next.js App Router
│   ├── [locale]/             # Localized routes
│   │   └── page.tsx          # Main converter page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── converter.tsx         # Main converter component
│   ├── language-toggle.tsx   # Language selector
│   ├── theme-toggle.tsx      # Theme switcher
│   ├── google-analytics.tsx  # GA integration
│   └── ui/                   # shadcn/ui components
├── lib/                      # Core utilities
│   ├── parsers/              # Protocol parsers
│   │   ├── index.ts          # Parser orchestration
│   │   └── protocol-parsers.ts  # Individual protocol parsers
│   ├── types.ts              # TypeScript type definitions
│   ├── yaml-parser.ts        # YAML to proxy links
│   ├── yaml-generator.ts     # Proxy links to YAML
│   ├── rules-content.ts      # Clash rules
│   └── utils.ts              # Utility functions
├── messages/                 # next-intl translations
│   ├── en.json               # English translations
│   └── zh.json               # Chinese translations
├── proxy.ts             # Next.js proxy for routing
└── public/                   # Static assets
```

## Technology Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5.6+ (strict mode)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (New York style, Stone color scheme)
- **Icons**: Lucide React
- **Internationalization**: next-intl v4
- **Notifications**: Sonner
- **Theme**: next-themes

## Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google AdSense (optional)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### Kernel Compatibility

| Feature | Clash Meta (Mihomo) | Clash Premium |
|---------|---------------------|---------------|
| VLESS | ✅ | ❌ |
| Hysteria | ✅ | ❌ |
| Hysteria2 | ✅ | ❌ |
| VMess | ✅ | ✅ |
| Trojan | ✅ | ✅ |
| SS | ✅ | ✅ |
| SSR | ✅ | ✅ |

## SEO

The application is optimized for search engines with:
- Meta tags for social sharing (Open Graph, Twitter Card)
- Structured data markup
- Sitemap generation
- Robots.txt configuration
- Optimized page titles and descriptions

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

---

**Domain**: [clashconverter.com](https://clashconverter.com)
