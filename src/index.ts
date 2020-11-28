import { Node } from 'posthtml';

export type Options = {
  exclude?: string | string[],
  noreferrer?: boolean
};

type CacheApplyFunc = () => boolean;

export function posthtmlExternalLink(
  config?: Options
): (tree: Node) => void {
  return function postHtmlExternalLinkPlugin(tree: Node): Node {
    if (!config) return tree;

    tree.walk((node: Node): Node => {
      if (
        node.tag
        && node.tag === 'a'
        && node.attrs
        && node.attrs.href
      ) {
        if (config) {
          const exclude = Array.isArray(config.exclude) ? config.exclude : [config.exclude];

          if (!isExternalLink(node.attrs.href, exclude)) {
            return node;
          }
        }

        if (node.attrs.rel) {
          const rels = new Set(node.attrs.rel.split(/\s+/));
          rels.add('noopener');
          rels.add('nofollow');
          rels.add('external');
          if (config.noreferrer) {
            rels.add('noreferrer');
          }

          node.attrs.rel = Array.from(rels).join(' ');
        } else {
          node.attrs.rel = 'noopener nofollow external';
        }

        node.attrs.target = '_blank';
      }

      return node;
    });

    return tree;
  };
}

const cache: Map<string, boolean> = new Map();
function cacheApply(key: string, value: boolean | CacheApplyFunc): boolean {
  if (cache.has(key)) return cache.get(key) ?? false;

  if (typeof value === 'function') value = value();
  cache.set(key, value);

  return value;
}

function isExternalLink(input: string, exclude?: (string | undefined)[]): boolean {
  return cacheApply(input, () => {
    if (
      !input.startsWith('//')
      && !input.startsWith('http://')
      && !input.startsWith('https://')
    ) {
      return false;
    }

    let urlObj: URL | undefined;
    try {
      urlObj = new URL(input);
    } catch { }

    // urlObj will be undefined if "input" is an invalid URL
    if (!(urlObj instanceof URL)) {
      return false;
    }

    // handle mailto: javascript: vbscript: etc.
    if (urlObj.origin === 'null') {
      return false;
    }

    if (exclude) {
      for (const i of exclude) {
        if (urlObj.hostname === i) {
          return false;
        }
      }
    }

    if (urlObj.hostname !== input) {
      return true;
    }

    return false;
  });
}
