/**
 * Compares two version strings (e.g., "1.2.3" and "1.2.4").
 * 
 * @param version1 - The first version string.
 * @param version2 - The second version string.
 * @returns -1 if version1 < version2, 1 if version1 > version2, 0 if they are equal.
 */
export function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  const length = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < length; i++) {
    const v1 = v1Parts[i] || 0;
    const v2 = v2Parts[i] || 0;

    if (v1 < v2) {
      return -1;
    }
    if (v1 > v2) {
      return 1;
    }
  }

  return 0;
}