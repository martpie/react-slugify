import * as React from 'react';

const stripAccents = (str: string): string => {
  const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  const fixes = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
  const split = accents.split('').join('|');
  const reg = new RegExp(`(${split})`, 'g');

  function replacement(a: string) {
    return fixes[accents.indexOf(a)] || '';
  }

  return str.replace(reg, replacement);
};

const harmonize = (text: string, delimiter: string): string => {
  return stripAccents(text)
    .toLowerCase()
    .replace(/\s+/g, delimiter)
    .replace(new RegExp(`/[^a-z${delimiter}]/g`), '');
};

const slugify = (node: React.ReactNode, delimiter = '-'): string => {
  // undefined, null, boolean
  if (!node || typeof node === 'boolean') {
    return '';
  }

  // string, number
  if (typeof node === 'string') return harmonize(node, delimiter);
  if (typeof node === 'number') return String(node);

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
    return node.map(n => slugify(n, delimiter)).join(delimiter);
  }


  // ReactElement
  if ('type' in node) return slugify(node.props.children, delimiter);

  // unhandled case
  return '';
};

export default slugify;
