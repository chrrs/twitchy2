<script lang="ts">
    import VirtualList from './components/VirtualList.svelte';
    import { ChatClient } from '@twurple/chat';

    let scrollToIndex: (index: number, cfg?: ScrollToOptions) => Promise<void>;
    let messages = [];

    (async () => {
        const client = new ChatClient({ channels: ['Gaules'] });
        await client.connect();

        client.onMessage(async (_channel, user, message) => {
            messages = [...messages, { user, message }];
            scrollToIndex(messages.length - 1);
            console.log(user, message);
        });
    })();
</script>

<div class="h-screen max-w-5xl mx-auto">
    <VirtualList items={messages} bind:scrollToIndex let:item>
        <p><b>{item.user}: </b>{item.message}</p>
    </VirtualList>
</div>
