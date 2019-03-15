# react-slugify

![build status](https://img.shields.io/circleci/project/github/martpie/react-slugify/master.svg?style=flat-square)

Slugify a React node

## Usage

```
slugify(node[, delimiter])
```

##### Parameters:

`node`<br />
A react Node

`delimiter`<br />
The slug delimiter, default to `'-'`

## Examples

```jsx
import slugify from 'react-slugify';

slugify('something I want to test');
// -> "something-i-want-to-test"

slugify(<span>Yes it works like that too</span>);
// -> "yes-it-works-like-that-too"

slugify(
  <>
    <span>and</span>
    <span>with</span>
    <span>fragments or arrays</span>
  </>
);
// -> "and-with-fragments-or-arrays"

slugify(<h3>Crème brulée receipe</h3>, '_');
// -> creme_brulee_receipe
```
