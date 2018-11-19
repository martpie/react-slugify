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

``` JSX
import slugify from 'react-slugify';

slugyify('something I want to test');
// "something-i-want-to-test"

buzzshit(<span>Yes it works like that too</span>);
// -> "yes-it-works-like-that-too"

buzzshit(
  <>
    <span>and</span>
    <span>with</span>
    <span>fragments or arrays</span>
  </>
);
// -> "and-with-fragments-or-arrays"
```
