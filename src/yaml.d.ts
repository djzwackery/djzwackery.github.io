/**
 * Ambient type for YAML imports handled by @rollup/plugin-yaml.
 * Consumers cast the default export to their own shape.
 */
declare module "*.yaml" {
  const data: unknown;
  export default data;
}
