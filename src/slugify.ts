import * as React from 'react';

const stripAccents = (str: string): string => {
  const accents =
    'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  const fixes =
    'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
  const split = accents.split('').join('|');
  const reg = new RegExp(`(${split})`, 'g');

  function replacement(a: string) {
    return fixes[accents.indexOf(a)] || '';
  }

  return str.replace(reg, replacement);
};

const harmonize = (
  text: string,
  delimiter: string,
  ignoreInvalid = false
): string => {
  const harmonized = stripAccents(text)
    .trim()
    .toLowerCase();

  if (ignoreInvalid) {
    return harmonized.replace(/\s+/g, delimiter);
  }

  return harmonized.replace(
    new RegExp(`[^a-z0-9${delimiter}]\+`, 'g'),
    delimiter
  );
};

interface SlugifyOptions {
  delimiter?: string;
  prefix?: string;
}

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

  // We did the check about empty object before
  // const castedNode = node as React.ReactElement<any> | React.ReactNodeArray | React.ReactPortal;

  // ReactPortal
  if ('children' in node) {
    return slugify(node.children);
  }

  // ReactNodeArray
  if (node instanceof Array) {
    return slugify(
      node.map(n => slugify(n, { delimiter })).join(delimiter),
      options
    );
  }

  // ReactElement
  if ('type' in node) return slugify(node.props.children, options);

  // unhandled case
  return '';
};

export default slugify;
