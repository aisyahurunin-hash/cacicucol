export function downloadSourceZip(): void {
  const a = document.createElement('a');
  a.href = '/api/download-source';
  a.download = 'cacicocol-source.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
