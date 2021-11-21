import { getApiClient } from './api';

export class Channel {
	name: string;
	id: string;

	isLive: boolean;
}

export async function fetchChannel(name: string): Promise<Channel> {
	const info = await getApiClient().users.getUserByName(name);

	const channel = new Channel();

	channel.id = info.id;
	channel.name = info.displayName;
	channel.isLive = (await info.getStream()) !== null;

	return channel;
}
