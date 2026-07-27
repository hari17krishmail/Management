// `typeof FileList` (rather than a bare reference) avoids a ReferenceError if this
// module is ever evaluated outside a browser, since ambient Zod schemas can be
// imported transitively into server-rendered files.
export function isFileList(value: unknown): value is FileList {
  return typeof FileList !== "undefined" && value instanceof FileList;
}
