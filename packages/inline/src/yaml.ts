import YAML from 'yaml';

/**
 * A utility for the [yaml](https://github.com/eemeli/yaml) to inline YAML documents.
 */
export const yaml = (strings: TemplateStringsArray): YAML.Document => YAML.parseDocument(strings.join());
