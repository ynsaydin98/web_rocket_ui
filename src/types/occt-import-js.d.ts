declare module "occt-import-js" {
  type OcctMesh = {
    name: string;
    color?: number[];
    attributes: {
      position: { array: number[] };
      normal?: { array: number[] };
    };
    index: { array: number[] };
  };

  type OcctModule = {
    ReadStepFile: (
      content: Uint8Array,
      params: null,
    ) => { success: boolean; meshes: OcctMesh[] };
  };

  type OcctOptions = {
    locateFile?: (path: string) => string;
  };

  export default function initializeOcct(
    options?: OcctOptions,
  ): Promise<OcctModule>;
}
