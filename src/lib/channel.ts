import { getApiClient } from './api';

const channels: { [key: string]: Channel } = {};

export class Channel {
	name: string;
	id: string;

	isLive: boolean;
	refs: number;

	drop() {
		this.refs--;
		if (this.refs === 0) {
			delete channels[this.name.toLowerCase()];
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
	channel.refs = 1;

	return channel;
}
