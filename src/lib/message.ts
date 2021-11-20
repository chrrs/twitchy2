import type { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import type { BadgeDetails, BadgeProvider } from './badge';
import type { EmoteDetails, EmoteProvider } from './emote';

export interface MessageEmotePart extends EmoteDetails {
	type: 'emote';
}

export interface MessageTextPart {
	type: 'text';
	text: string;
}

export type MessagePart = MessageEmotePart | MessageTextPart;

export interface Message {
	author: Author;
	message: Array<MessagePart>;
	old?: boolean;
}

export interface Author {
	name: string;
	color: string;
	badges: Array<BadgeDetails>;
}

export function getAuthorColor(name: string) {
	const colors = [
		'#FF0000',
		'#0000FF',
		'#00FF00',
		'#B22222',
		'#FF7F50',
		'#9ACD32',
		'#FF4500',
		'#2E8B57',
		'#DAA520',
		'#D2691E',
		'#5F9EA0',
		'#1E90FF',
		'#FF69B4',
		'#8A2BE2',
		'#00FF7F',
	];

	const n = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
	return colors[n % colors.length];
}

export function parseMessage(
	msg: TwitchPrivateMessage,
	badgeProviders: Array<BadgeProvider>,
	emoteProviders: Array<EmoteProvider>
): Message {
	const badges: Array<BadgeDetails> = [];

	for (const badge of msg.userInfo.badges.entries()) {
		let details: BadgeDetails;
		for (const provider of badgeProviders) {
			details = provider.get(badge[0], badge[1]);
			if (details) {
				break;
			}
		}

		if (!details) {
			details = {
				name: `${badge[0]}/${badge[1]} (missing badge)`,
			};
		}

		if (badge[0] === 'subscriber') {
			const months = msg.userInfo.badgeInfo.get('subscriber');
			details = {
				...details,
				name: `${details.name} (${months} month${months === '1' ? '' : 's'})`,
			};
		}

		badges.push(details);
	}

	const parts = [];

	for (const part of msg.parseEmotes()) {
		switch (part.type) {
			case 'emote':
				parts.push({
					type: 'emote',
					name: part.name,
					description: 'Twitch Emote',
					url: `https://static-cdn.jtvnw.net/emoticons/v2/${part.id}/default/light/3.0`,
				});

				break;
			case 'text': {
				let text = '';
				const words = part.text.split(' ');

				for (const word of words) {
					let emote: EmoteDetails | undefined;
					for (const provider of emoteProviders) {
						const details = provider.get(word);
						if (details) {
							emote = details;
							break;
						}
					}

					if (emote) {
						if (text.length !== 0) {
							parts.push({
								type: 'text',
								text,
							});
						}

						text = ' ';

						parts.push({
							type: 'emote',
							...emote,
						});
					} else {
						text += word + ' ';
					}
				}

				if (text.length !== 0 && text !== ' ') {
					parts.push({
						type: 'text',
						text,
					});
				}

				break;
			}
			case 'cheer':
				parts.push({
					type: 'text',
					text: part.name,
				});

				break;
		}
	}

	return {
		author: {
			name: msg.userInfo.displayName,
			color: msg.userInfo.color || getAuthorColor(msg.userInfo.userName),
			badges,
		},
		message: parts,
	};
}
