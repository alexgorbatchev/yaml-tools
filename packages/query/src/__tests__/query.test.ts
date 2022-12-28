import yaml from '@yaml-tools/inline';

import { query } from '../query.js';

describe('query', () => {
  it('provides root values', () => {
    expect(query(yaml`string`)()).toMatchInlineSnapshot(`"string"`);
  });

  it('provides multi line values', () => {
    const doc = yaml`
      key:
        - value
        - value2
    `;
    expect(query(doc)()).toMatchInlineSnapshot(`
      {
        "key": [
          "value",
          "value2",
        ],
      }
    `);
  });

  it('gets nested elements', () => {
    const doc = yaml`
      one:
        - _
        - _
        - three: 3
    `;
    const selector = query(doc);

    expect(selector.one[2].three()).toMatchInlineSnapshot(`3`);
    expect(selector.one[0]()).toMatchInlineSnapshot(`"_"`);
    expect(selector.two[2].three()).toEqual(undefined);
  });

  it('handles aliases', () => {
    const doc = yaml`[ &x { X: 42 }, Y, *x ]`;
    expect(query(doc)[2].X()).toMatchInlineSnapshot(`42`);
  });

  it('handles aliases leaves', () => {
    const doc = yaml`[ &x { X: 42 }, Y, *x ]`;
    expect(query(doc)[2]()).toMatchInlineSnapshot(`
      {
        "X": 42,
      }
    `);
  });
});
