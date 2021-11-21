import { accounts } from '$store/accounts';
import { ApiClient } from '@twurple/api';
import { StaticAuthProvider } from '@twurple/auth';

let apiClient: ApiClient | null;

accounts.subscribe(($accounts) => {
	if ($accounts.length === 0) {
		apiClient = null;
		return;
	}

	const account = $accounts[0];
	apiClient = new ApiClient({
		authProvider: new StaticAuthProvider(account.clientId, account.accessToken),
	});
});

export function getApiClient() {
	return apiClient;
}
