import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, passthroughImageService } from 'astro/config';

import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import type { AstroIntegration } from 'astro';
import compress from 'astro-compress';
import icon from 'astro-icon';

import astrowind from './vendor/integration';

import { lazyImagesRehypePlugin, readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
    hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({

    // site: 'https://pegasus-automation.github.io',

    output: 'static',

    integrations: [
        tailwind({
            applyBaseStyles: false,
        }),
        sitemap(),
        mdx(),
        icon({
            include: {
                tabler: ['*'],
                'flat-color-icons': ['*'],
            },
        }),

        ...whenExternalScripts(() =>
            partytown({
                config: { forward: ['dataLayer.push'] },
            })
        ),

        compress({
            CSS: true,
            HTML: {
                'html-minifier-terser': {
                    removeAttributeQuotes: false,
                },
            },
            Image: false,
            JavaScript: true,
            SVG: false,
            Logger: 1,
        }),

        astrowind({
            config: './src/config.yaml',
        }),
    ],

    image: {
        domains: ['cdn.pixabay.com'],
        service: passthroughImageService(),

    },

    markdown: {
        remarkPlugins: [readingTimeRemarkPlugin],
        rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
    },

    vite: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
            },
        },
    },
});
