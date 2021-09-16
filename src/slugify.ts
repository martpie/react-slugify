import * as React from 'react';

/**
 * Remove all accentuated characters from a string
 */
const stripAccents = (input: string): string => {
  const accents =
    'ÀÁÂÃÄÅĄàáâãäåąÒÓÔÕÕÖØòóôõöøÈÉÊËĘèéêëðęÇĆçćÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠŚšśŸÿýŽŹŻžźżŁłŃń';
  const fixes =
    'AAAAAAAaaaaaaaOOOOOOOooooooEEEEEeeeeeeCCccDIIIIiiiiUUUUuuuuNnSSssYyyZZZzzzLlNn';
  const split = accents.split('').join('|');
  const reg = new RegExp(`(${split})`, 'g');

  function replacement(a: string) {
    return fixes[accents.indexOf(a)] || '';
  }

  return input.replace(reg, replacement);
};

/**
 * Harmonize a string by removing spaces, non-alphabetical caracters and by
 * adding delimiter
 */
const harmonize = (
  input: string,
  delimiter: string,
  ignoreInvalid = false
): string => {
  const harmonized = stripAccents(input).trim().toLowerCase();

  if (ignoreInvalid) {
    return harmonized.replace(/\s+/g, delimiter);
  }

  const safeDelimiter = delimiter.split('').map((char) => `\\${char}`);

  return harmonized
    .replace(new RegExp(`[^a-z0-9${delimiter}]\+`, 'g'), delimiter)
    .replace(new RegExp(`${safeDelimiter}+`, 'g'), delimiter);
};

interface SlugifyOptions {
  delimiter?: string;
  prefix?: string;
}

/**
 * Slugify a React node
 */
const slugify = (
  node: React.ReactNode,
  options: SlugifyOptions = { delimiter: '-', prefix: '' }
): string => {
  if (!options.delimiter) options.delimiter = '-';
  if (!options.prefix) options.prefix = '';

  if (!node || typeof node === 'boolean') {
    return '';
  }

  const { delimiter, prefix } = options;

  // string, number
  if (typeof node === 'string' || typeof node === 'number') {
    const harmonizedPrefix = harmonize(prefix, delimiter, true);
    const harmonizedNode = harmonize(String(node), delimiter);

    if (harmonizedPrefix) {
      return `${harmonizedPrefix}${delimiter}${harmonizedNode}`;
    }

    return harmonizedNode;
  }

  // empty object
  if (typeof node === 'object' && Object.keys(node).length === 0) {
    return '';
  }

  // ReactPortal
  if ('children' in node) {
    return slugify(node.children);
  }

  // ReactNodeArray
  if (node instanceof Array) {
    return slugify(
      node.map((subNode) => slugify(subNode, { delimiter })).join(delimiter),
      options
    );
  }

  // ReactElement
  if ('type' in node) return slugify(node.props.children, options);

  // unhandled case
  return '';
};

export default slugify;
