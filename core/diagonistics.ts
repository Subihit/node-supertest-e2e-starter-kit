export function logDiagnostics(diag: unknown) {
  console.error('\n=== API Details ===');
  console.error(JSON.stringify(diag, null, 2));
  console.error('==============================\n');
}
