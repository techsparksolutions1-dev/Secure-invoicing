export function GenerateClientId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `cl${timestamp}${random}`;
}
