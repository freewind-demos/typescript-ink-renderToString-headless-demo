import React, {FC, useEffect, useState} from 'react';
import {Box, Newline, render, renderToString, Text, useInput} from 'ink';

const tabDescriptions = {
	overview: '总览页，放 CLI 当前状态。',
	deploy: '发布页，放发布目标与步骤。',
	logs: '日志页，放错误与输出。',
};

const tabLabels = {
	overview: 'Overview',
	deploy: 'Deploy',
	logs: 'Logs',
} as const;

type TabName = keyof typeof tabDescriptions;

const tabNames = Object.keys(tabLabels) as TabName[];

function TabSnapshotPanel({activeTabName}: {activeTabName: TabName}) {
	return (
		<Box flexDirection="column">
			<Text color="cyan">ink-tab demo</Text>
			<Newline />
			<Box>
				{tabNames.map((name, index) => (
					<Box key={name} marginRight={1}>
						<Text
							bold={name === activeTabName}
							color={name === activeTabName ? 'green' : undefined}
							dimColor={name !== activeTabName}
						>
							{index + 1}. {tabLabels[name]}
							{name !== tabNames[tabNames.length - 1] ? ' |' : ''}
						</Text>
					</Box>
				))}
			</Box>
			<Newline />
			<Text>当前页签：{activeTabName}</Text>
			<Text>{tabDescriptions[activeTabName]}</Text>
		</Box>
	);
}

const App: FC = () => {
	const [activeTabName, setActiveTabName] = useState<TabName>('overview');
	const [toStringOutput, setToStringOutput] = useState('');

	const moveTab = (offset: number) => {
		setActiveTabName(prev => {
			const index = tabNames.indexOf(prev);
			return tabNames[
				(index + offset + tabNames.length) % tabNames.length
			]!;
		});
	};

	useInput((input, key) => {
		if (key.leftArrow) {
			moveTab(-1);
		}

		if (key.rightArrow) {
			moveTab(1);
		}

		if (key.tab) {
			moveTab(key.shift ? -1 : 1);
		}

		const tabIndex = Number(input) - 1;
		if (tabIndex >= 0 && tabIndex < tabNames.length) {
			setActiveTabName(tabNames[tabIndex]!);
		}
	});

	useEffect(() => {
		// renderToString 不能在 live render() 同一帧里同步调用，否则会破坏 yoga wasm
		const id = setTimeout(() => {
			setToStringOutput(
				renderToString(
					<TabSnapshotPanel activeTabName={activeTabName} />,
				),
			);
		}, 0);

		return () => clearTimeout(id);
	}, [activeTabName]);

	return (
		<Box flexDirection="column">
			<Text color="gray">
				方向键 / Tab / 数字切换页签，ctrl+c 退出
			</Text>
			<Newline />
			{toStringOutput.split('\n').map((line, index) => (
				<Text key={index}>{line}</Text>
			))}
		</Box>
	);
};

render(<App />);
