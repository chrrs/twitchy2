<script lang="ts">
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import { ChatClient } from '@twurple/chat';

    let scrollToIndex: (index: number, cfg?: ScrollToOptions) => void;
    let messages = [];

    (async () => {
        const client = new ChatClient({ channels: ['Gaules'] });
        await client.connect();

        client.onMessage(async (_channel, user, message) => {
            messages = [...messages, { user, message }];
            scrollToIndex(messages.length - 1, { behavior: 'auto' });
            console.log(user, message);
        });
    })();
</script>

<div class="h-screen max-w-5xl mx-auto">
    <VirtualList items={messages} bind:scrollToIndex let:item>
        <p><b>{item.user}: </b>{item.message}</p>
    </VirtualList>
</div>
