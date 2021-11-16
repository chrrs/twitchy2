<script lang="ts">
    import VirtualList from './components/VirtualList.svelte';
    import { ChatClient } from '@twurple/chat';

    let scrollToIndex: (index: number, cfg?: ScrollToOptions) => Promise<void>;
    let messages = [];

    let pauseAutoScroll = false;

    (async () => {
        const client = new ChatClient({ channels: ['auronplay'] });
        await client.connect();

        client.onMessage(async (_channel, user, message) => {
            messages = [...messages, { user, message }];
        });
    })();

    function handleScroll(offsetFromBottom: number) {
        pauseAutoScroll = offsetFromBottom > 10;
    }
</script>

<div class="h-screen max-w-5xl mx-auto" class:autoscroll={pauseAutoScroll}>
    <VirtualList
        items={messages}
        on:scroll={(e) =>
            handleScroll(
                e.detail.scrollHeight -
                    e.detail.scrollTop -
                    e.detail.clientHeight
            )}
        bind:scrollToIndex
        scrollToBottom={!pauseAutoScroll}
        let:item
    >
        <p><b>{item.user}: </b>{item.message}</p>
    </VirtualList>
</div>

<style>
    .autoscroll {
        @apply border-b-4 border-red-500;
    }
</style>
