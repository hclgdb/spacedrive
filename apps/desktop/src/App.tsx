import { loggerLink } from '@rspc/client';
import { tauriLink } from '@rspc/tauri';
import { getDebugState, hooks, queryClient } from '@sd/client';
import SpacedriveInterface, { OperatingSystem, Platform, PlatformProvider } from '@sd/interface';
import { KeybindEvent } from '@sd/interface';
import { dialog, invoke, os, shell } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';

import '@sd/ui/style';

const client = hooks.createClient({
	links: [
		loggerLink({
			enabled: () => getDebugState().rspcLogger
		}),
		tauriLink()
	]
});

async function getOs(): Promise<OperatingSystem> {
	switch (await os.type()) {
		case 'Linux':
			return 'linux';
		case 'Windows_NT':
			return 'windows';
		case 'Darwin':
			return 'macOS';
		default:
			return 'unknown';
	}
}

const platform: Platform = {
	platform: 'tauri',
	getThumbnailUrlById: (casId) => `spacedrive://thumbnail/${encodeURIComponent(casId)}`,
	openLink: shell.open,
	getOs,
	openFilePickerDialog: () => dialog.open({ directory: true }),
	showDevtools: () => invoke('show_devtools'),
	openPath: (path) => shell.open(path)
};

export default function App() {
	useEffect(() => {
		// This tells Tauri to show the current window because it's finished loading
		invoke('app_ready');
	}, []);

	useEffect(() => {
		const keybindListener = listen('keybind', (input) => {
			document.dispatchEvent(new KeybindEvent(input.payload as string));
		});

		return () => {
			keybindListener.then((unlisten) => unlisten());
		};
	}, []);

	return (
		<hooks.Provider client={client} queryClient={queryClient}>
			<PlatformProvider platform={platform}>
				<SpacedriveInterface />
			</PlatformProvider>
		</hooks.Provider>
	);
}
