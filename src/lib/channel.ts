import { getApiClient } from './api';

const channels: { [key: string]: Channel } = {};

export class Channel {
	name: string;
	id: string;

	isLive: boolean;
}

export async function fetchChannel(name: string): Promise<Channel> {
	const cachedChannel = channels[name.toLowerCase()];
	if (cachedChannel) {
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
