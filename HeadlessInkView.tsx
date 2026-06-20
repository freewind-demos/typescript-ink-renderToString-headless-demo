import React, {FC, ReactElement, useEffect, useState} from 'react';
import {renderToString, Text} from 'ink';

export type HeadlessInkViewProps = {
	children: ReactElement;
};

export const HeadlessInkView: FC<HeadlessInkViewProps> = ({children}) => {
	const [output, setOutput] = useState('');

	useEffect(() => {
		// renderToString 不能在 live render() 同一帧里同步调用，否则会破坏 yoga wasm
		const id = setTimeout(() => {
			setOutput(renderToString(children));
		}, 0);

		return () => clearTimeout(id);
	}, [children]);

	return (
		<>
			{output.split('\n').map((line, index) => (
				<Text key={index}>{line}</Text>
			))}
		</>
	);
};
