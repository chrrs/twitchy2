import { ApiClient } from '@twurple/api';
import { StaticAuthProvider } from '@twurple/auth';

const CLIENT_ID = '8wbcbo159yeu8nuuws5ibzcfvfwuaa';

export interface TwitchLogin {
	clientId: string;
	accessToken: string;
	name: string;
	id: string;
	expiry: string;
}

export function login(): Promise<TwitchLogin> {
	return new Promise((resolve, reject) => {
		(async () => {
			const { WebviewWindow } = await import('@tauri-apps/api/window');

			const window = new WebviewWindow('login', {
				title: 'Log in with Twitch',
				url: '/twitch.html#' + CLIENT_ID,
				width: 500,
				height: 600,
			});

			const unlistenToken = await window.once<string>('token', async (event) => {
				unlistenCancel();
				window.close();

				const accessToken = event.payload;

				const client = new ApiClient({
					authProvider: new StaticAuthProvider(CLIENT_ID, accessToken),
				});

				try {
					const tokenInfo = await client.getTokenInfo();

					// Subtract 5 days from expiry date to (hopefully) prevent
					// access tokens expiring while using the application.
					const expiry = tokenInfo.expiryDate;
					expiry.setDate(expiry.getDate() - 5);

					resolve({
						clientId: CLIENT_ID,
						accessToken,
						name: tokenInfo.userName,
						id: tokenInfo.userId,
						expiry: expiry.toISOString(),
					});
				} catch (e) {
					reject(e);
				}
			});

			const unlistenCancel = await window.once<void>('login-cancelled', () => {
				unlistenToken();
				reject('user closed window');
			});
		})();
	});
}
