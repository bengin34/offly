const devMode = typeof __DEV__ !== 'undefined' ? __DEV__ : false;
let active = devMode && true;

export function setMockActive(flag: boolean): void {
  if (!devMode) {
    return;
  }

  active = Boolean(flag);
}

export function isMockActive(): boolean {
  return devMode && active;
}

export function isDevMockingEnabled(): boolean {
  return devMode;
}
