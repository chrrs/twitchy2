<script lang="ts">
    import VirtualList from './components/VirtualList.svelte';
    import { ChatClient } from '@twurple/chat';
    import { Message, parseMessage } from './lib/message';
    import tooltip from './lib/tooltip';

    let scrollToIndex: (index: number, cfg?: ScrollToOptions) => Promise<void>;
    let messages: Array<Message> = [];

    let pauseAutoScroll = false;

    (async () => {
        const client = new ChatClient({ channels: ['auronplay'] });
        await client.connect();

        client.onMessage(async (_channel, _user, _message, msg) => {
            messages = [...messages, parseMessage(msg)];
            messages.length = Math.min(1000, messages.length);
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
        <p class="min-h-6 mb-1">
            <b class="font-semibold" style={`color: ${item.author.color}`}>
                {item.author.name}:
            </b>
            {#each item.message as part}
                {#if part.type === 'text'}
                    {part.text}
                {:else if part.type === 'emote'}
                    <img
                        class="inline-block h-6 object-contain align-bottom"
                        src={part.url}
                        alt={part.name}
                        use:tooltip={{ content: part.name }}
                    />
                {/if}
            {/each}
        </p>
    </VirtualList>
</div>

<style>
    .autoscroll {
        @apply border-b-4 border-red-500;
    }
</style>
