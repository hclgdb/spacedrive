declare global {
	var isDev: boolean;
}

if (globalThis.localStorage === undefined || globalThis.isDev === undefined)
	throw new Error('Please ensure you have patched `globalThis` before importing `@sd/client`!');

export * from './hooks';
export * from './stores';
export * from './rspc';
export * from './core';
