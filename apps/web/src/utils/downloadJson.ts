/** Download any data object as a pretty-printed JSON file. */
export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
