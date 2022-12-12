import videoSvg from '@sd/assets/svgs/video.svg';
import zipSvg from '@sd/assets/svgs/zip.svg';
import { ExplorerItem } from '@sd/client';
import clsx from 'clsx';
import { Suspense, lazy, useMemo } from 'react';

import { usePlatform } from '../../util/Platform';
import { useExplorerStore } from '../../util/explorerStore';
import { Folder } from '../icons/Folder';
import { isObject, isPath } from './utils';

interface Props {
	data: ExplorerItem;
	size: number;
	className?: string;
	style?: React.CSSProperties;
	iconClassNames?: string;
	kind?: 'video' | 'image' | 'audio' | 'zip' | 'other';
}

const icons = import.meta.glob('../../../../assets/icons/*.svg');

export default function FileThumb({ data, ...props }: Props) {
	const platform = usePlatform();
	const store = useExplorerStore();

	const Icon = useMemo(() => {
		const icon = icons[`../../../../assets/icons/${data.extension as any}.svg`];

		const Icon = icon
			? lazy(() => icon().then((v) => ({ default: (v as any).ReactComponent })))
			: undefined;
		return Icon;
	}, [data.extension]);

	if (isPath(data) && data.is_dir) return <Folder size={props.size * 0.7} />;

	const cas_id = isObject(data) ? data.cas_id : data.object?.cas_id;

	if (!cas_id) return <div></div>;

	const has_thumbnail = isObject(data)
		? data.has_thumbnail
		: isPath(data)
		? data.object?.has_thumbnail
		: !!store.newThumbnails[cas_id];

	const url = platform.getThumbnailUrlById(cas_id);

	if (has_thumbnail && url)
		return (
			<img
				style={props.style}
				decoding="async"
				// width={props.size}
				className={clsx('pointer-events-none z-90', props.className)}
				src={url}
			/>
		);

	// Hacky (and temporary) way to integrate thumbnails
	if (props.kind === 'video') {
		return (
			<img src={videoSvg} className={clsx('w-full overflow-hidden h-full', props.iconClassNames)} />
		);
	}
	if (props.kind === 'zip') {
		return <img src={zipSvg} className={clsx('w-full overflow-hidden h-full')} />;
	}

	// return default file icon
	return (
		<div
			style={{ width: props.size * 0.8, height: props.size * 0.8 }}
			className="relative m-auto transition duration-200 "
		>
			<svg
				// BACKGROUND
				className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2 fill-app-box"
				width="100%"
				height="100%"
				viewBox="0 0 65 81"
				style={{ filter: 'drop-shadow(0px 2px 1px rgb(0 0 0 / 0.15))' }}
			>
				<path d="M0 8C0 3.58172 3.58172 0 8 0H39.6863C41.808 0 43.8429 0.842855 45.3431 2.34315L53.5 10.5L62.6569 19.6569C64.1571 21.1571 65 23.192 65 25.3137V73C65 77.4183 61.4183 81 57 81H8C3.58172 81 0 77.4183 0 73V8Z" />
			</svg>
			{Icon && (
				<div className="absolute flex flex-col items-center justify-center w-full h-full mt-0.5 ">
					<Suspense fallback={<></>}>
						<Icon
							className={clsx('w-full h-full ')}
							style={{ width: props.size * 0.45, height: props.size * 0.45 }}
						/>
					</Suspense>
					<span className="text-xs font-bold text-center uppercase cursor-default text-gray-450">
						{data.extension}
					</span>
				</div>
			)}
			<svg
				// PEEL
				width="28%"
				height="28%"
				className="absolute top-0 right-0 -translate-x-[40%] z-0 pointer-events-none fill-app-selected"
				viewBox="0 0 40 40"
				style={{ filter: 'drop-shadow(-3px 1px 1px rgb(0 0 0 / 0.05))' }}
			>
				<path d="M41.4116 40.5577H11.234C5.02962 40.5577 0 35.5281 0 29.3238V0L41.4116 40.5577Z" />
			</svg>
		</div>
	);
}
