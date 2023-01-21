import * as React from "react";

/**
 * Remove all accentuated characters from a string
 */
const stripAccents = (input: string): string => {
  const accents =
    "ÀÁÂÃÄÅĄàáâãäåąÒÓÔÕÕÖØòóôõöøÈÉÊËĘèéêëðęÇĆçćÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠŚšśŸÿýŽŹŻžźżŁłŃńàáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîüûñçýỳỹỵỷğışĞİŞ";
  const fixes =
    "AAAAAAAaaaaaaaOOOOOOOooooooEEEEEeeeeeeCCccDIIIIiiiiUUUUuuuuNnSSssYyyZZZzzzLlNnaaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiuuncyyyyygisGIS";
  const split = accents.split("").join("|");
  const reg = new RegExp(`(${split})`, "g");

  function replacement(a: string) {
    return fixes[accents.indexOf(a)] || "";
  }

  return input.replace(reg, replacement);
};

const getSafeRegexpString = (input: string): string =>
  input
    .split("")
    .map((char) => `\\${char}`)
    .join("");

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
  const safeDelimiter = getSafeRegexpString(delimiter);

  if (ignoreInvalid) {
    return harmonized.replace(/\s+/g, delimiter);
  }

  return harmonized
    .replace(new RegExp(`[^a-z0-9${safeDelimiter}]+`, "g"), delimiter) // Replace all non-valid caracters by delimiter
    .replace(new RegExp(`${safeDelimiter}+`, "g"), delimiter) // Remove multiple delimiters repetition
    .replace(new RegExp(`^${safeDelimiter}`, "g"), "") // remove delimiter at the beginning
    .replace(new RegExp(`${safeDelimiter}$`, "g"), ""); // remove delimiter at the end
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
  options: SlugifyOptions = { delimiter: "-", prefix: "" }
): string => {
  if (!options.delimiter) options.delimiter = "-";
  if (!options.prefix) options.prefix = "";

  if (!node || typeof node === "boolean") {
    return "";
  }

  const { delimiter, prefix } = options;

  // boolean
  if (typeof node === "boolean") {
    return ""; // not much we can do here
  }

  // string, number
  if (typeof node === "string" || typeof node === "number") {
    const harmonizedPrefix = harmonize(prefix, delimiter, true);
    const harmonizedNode = harmonize(String(node), delimiter);

    if (harmonizedPrefix) {
      return `${harmonizedPrefix}${delimiter}${harmonizedNode}`;
    }

    return harmonizedNode;
  }

  // ReactPortal
  if ("children" in node) {
    return slugify(node.children);
  }

  // ReactElement
  if ("type" in node) return slugify(node.props.children, options);

  // ReactFragment (including array of nodes)
  if (Symbol.iterator in node) {
    return slugify(
      Array.from(node)
        .map((subNode) => slugify(subNode, { delimiter }))
        .join(delimiter),
      options
    );
  }

  // unhandled case
  return "";
};

export default slugify;
