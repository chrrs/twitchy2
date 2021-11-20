<script lang="ts">
	import { login } from '$lib/login';

	async function tryLogin() {
		try {
			alert(JSON.stringify(await login()));
		} catch (e) {
			alert(e);
		}
	}
</script>

<div class="h-full flex justify-center items-center text-5xl">
	<span>
		Click <a
			class="text-blue-500 border-b-4 border-blue-500 hover:(text-blue-600 border-blue-600)"
			on:click={tryLogin}
			href={'javascript:void(0)'}>here</a
		> to go to chat
	</span>
</div>
