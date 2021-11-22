import type { Emitter, Handler } from 'mitt';
import mitt from 'mitt';
import { getApiClient } from './api';
import { join, leave } from './chat';
import type { Message } from './message';

const channels: { [key: string]: Channel } = {};

export type ChannelEvents = {
	message: Message;
};

export class Channel {
	mitt: Emitter<ChannelEvents>;

	name: string;
	id: string;

	isLive: boolean;
	refs: number;

	constructor() {
		this.refs = 1;
		this.mitt = mitt();
	}

	get internalName() {
		return this.name.toLowerCase();
	}

	on<Key extends keyof ChannelEvents>(type: Key, handler: Handler<ChannelEvents[Key]>): void {
		this.mitt.on(type, handler);
	}

	off<Key extends keyof ChannelEvents>(type: Key, handler?: Handler<ChannelEvents[Key]>): void {
		this.mitt.off(type, handler);
	}

	async joinChat() {
		await join(this.internalName);
	}

	drop() {
		this.refs--;
		if (this.refs === 0) {
			delete channels[this.internalName];
			leave(this.internalName);
		}
	}
}

export async function fetchChannel(name: string): Promise<Channel> {
	const cachedChannel = channels[name.toLowerCase()];
	if (cachedChannel) {
		cachedChannel.refs++;
		return cachedChannel;
	}

	const info = await getApiClient().users.getUserByName(name);

	const channel = new Channel();
	channels[name.toLowerCase()] = channel;

	channel.id = info.id;
	channel.name = info.displayName;
	channel.isLive = (await info.getStream()) !== null;

	return channel;
}

export function getCachedChannel(name: string): Channel | undefined {
	return channels[name.toLowerCase()];
}
