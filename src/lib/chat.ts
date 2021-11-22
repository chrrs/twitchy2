import { accounts } from '$store/accounts';
import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { getCachedChannel } from './channel';
import { parseMessage } from './message';

let channels: Array<string> = [];
let client: ChatClient = null;

accounts.subscribe(async ($accounts) => {
	if ($accounts.length === 0) {
		client = null;
		return;
	}

	const account = $accounts[0];
	client = new ChatClient({
		authProvider: new StaticAuthProvider(account.clientId, account.accessToken),
		channels,
	});

	client.onMessage(async (channel, _user, _message, msg) => {
		getCachedChannel(channel.substr(1))?.mitt?.emit('message', parseMessage(msg, [], []));
	});

	await client.connect();
});

export async function join(channel: string) {
	channels.push(channel);
	await client?.join(channel);
}

export async function leave(channel: string) {
	channels = channels.splice(channels.indexOf(channel));
	await client?.part(channel);
}
