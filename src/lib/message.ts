import type { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage';
import type { BadgeDetails, BadgeProvider } from './badge';

export interface MessageEmotePart {
    type: 'emote';
    name: string;
    description: string;
    url: string;
}

export interface MessageTextPart {
    type: 'text';
    text: string;
}

export type MessagePart = MessageEmotePart | MessageTextPart;

export interface Message {
    author: Author;
    message: Array<MessagePart>;
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
    badgeProviders: Array<BadgeProvider>
): Message {
    const badges: Array<BadgeDetails> = [];

    for (const badge of msg.userInfo.badges.entries()) {
        for (const provider of badgeProviders) {
            const details = provider.get(badge[0], badge[1]);
            if (details) {
                badges.push(details);
                break;
            }
        }
    }

    return {
        author: {
            name: msg.userInfo.displayName,
            color: msg.userInfo.color || getAuthorColor(msg.userInfo.userName),
            badges,
        },
        message: msg.parseEmotes().map((part) => {
            switch (part.type) {
                case 'emote':
                    return {
                        type: 'emote',
                        name: part.name,
                        description: 'Twitch Emote',
                        url: `https://static-cdn.jtvnw.net/emoticons/v2/${part.id}/default/light/3.0`,
                    };
                case 'text':
                    return {
                        type: 'text',
                        text: part.text,
                    };
                case 'cheer':
                    return {
                        type: 'text',
                        text: part.name,
                    };
            }
        }),
    };
}
