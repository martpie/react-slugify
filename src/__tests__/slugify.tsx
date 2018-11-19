// import { ReactNode } from 'react';
import * as React from 'react';

import slugify from '../slugify';

describe ('slugify', () => {
  it ('should handle strings correctly', () => {
    expect (slugify('something')).toBe('something');
    expect (slugify('this is a test')).toBe('this-is-a-test');
    expect (slugify('And another one')).toBe('and-another-one');
    expect (slugify('crème brulée')).toBe('creme-brulee');
  });

  it ('should handle numbers correctly', () => {
    expect (slugify(9876)).toBe('9876');
  });

  it ('should handle simple node correctly', () => {
    expect(slugify(<span>this IS a NoDe</span>)).toBe('this-is-a-node');
    expect(slugify(<span>{576}</span>)).toBe('576');
  });

  it ('should handle fragments correctly', () => {
    expect(slugify(<>this IS a NoDe</>)).toBe('this-is-a-node');
    expect(slugify(
      <>
        <span>here</span>
        <span>are</span>
        <span>multiple spans in a fragment</span>
      </>
    )).toBe('here-are-multiple-spans-in-a-fragment');
  });

  it ('should handle arrays correctly', () => {
    expect(slugify([
      <span>here</span>,
      <span>are</span>,
      <span>multiple spans</span>,
    ])).toBe('here-are-multiple-spans');
  });
});
