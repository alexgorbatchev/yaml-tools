import { yaml } from '../yaml.js';

test('yaml', () => {
  const doc = yaml`
    hello: world
  `;

  expect(doc).toMatchInlineSnapshot(`
    {
      "hello": "world",
    }
  `);
});
