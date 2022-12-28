import YAML from 'yaml';

export type QueryResult = {
  (): YAML.Node | undefined;
  [key: string | number | symbol]: QueryResult;
};

export function query(document: YAML.Document): QueryResult {
  return process(document.contents, document);
}

export class RangeError extends Error {
  range?: YAML.Range;

  constructor(message: string, range?: YAML.Range) {
    super(message);
    this.range = range;
    Object.setPrototypeOf(this, RangeError.prototype);
  }
}

function isValidIndexType(v: unknown): v is string | number | symbol {
  return ['string', 'number', 'symbol'].includes(typeof v);
}

function process(node: YAML.Node | null | undefined, document: YAML.Document): any {
  if (YAML.isAlias(node)) {
    node = node.resolve(document);
  }

  return new Proxy(
    () => {
      if (!node) {
        return undefined;
      }

      return node;
    },
    {
      get(_, prop): any {
        if (YAML.isMap<YAML.Node, YAML.Node>(node)) {
          const match = node.items.find(({ key }) => {
            if (!YAML.isScalar(key)) {
              throw new RangeError(`Unexpected ${key.constructor.name}`, key.range || undefined);
            }

            if (!isValidIndexType(key.value)) {
              throw new RangeError(`Unexpected ${typeof key.value}`, key.range || undefined);
            }

            return (typeof key.value === 'number' ? String(key.value) : key.value) === prop;
          });

          return process(match?.value, document);
        }

        if (YAML.isSeq<YAML.Node>(node)) {
          return process(node.items[prop as any], document);
        }

        if (!node) {
          return process(node, document);
        }
      },
    },
  );
}
