# react-slugify
Slugify a React node

## Usage

```
slugify(node)
```

##### Parameters:

`node`<br />
A react Node

## Examples

``` TSX
import slugify from 'react-slugify';

slugify('something I want to test');
// "something-i-want-to-test"

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
```
