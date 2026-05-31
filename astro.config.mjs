import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// --- Мини-плагин: превращает ```mermaid блоки в <pre class="mermaid">,
// чтобы их не трогал подсветчик кода и отрисовал mermaid.js на клиенте.
// Никаких внешних зависимостей — работает на этапе сборки.
function remarkMermaid() {
  return (tree) => {
    walk(tree);
    function walk(node) {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'code' && child.lang === 'mermaid') {
          const escaped = child.value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          return { type: 'html', value: `<pre class="mermaid">${escaped}</pre>` };
        }
        walk(child);
        return child;
      });
    }
  };
}

export default defineConfig({
  // ВАЖНO: поменяй на свой адрес.
  // - Собственный домен:           site: 'https://имя.dev'        (base оставь '/')
  // - GitHub Pages project-страница: site: 'https://USER.github.io', base: '/REPO'
  site: 'https://example.com',
  // base: '/blog',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMermaid],
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
