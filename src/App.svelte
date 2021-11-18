<script lang="ts">
    import VirtualList from './components/VirtualList.svelte';
    import ChatMessage from './components/ChatMessage.svelte';
    import { ChatClient } from '@twurple/chat';
    import { Message, parseMessage } from './lib/message';
    import { globalBadgeProvider } from './lib/badge';
    import { bttvGlobalEmoteProvider } from './lib/bttv';
    import { ffzGlobalEmoteProvider } from './lib/ffz';

    let scrollToIndex: (index: number, cfg?: ScrollToOptions) => Promise<void>;
    let messages: Array<Message> = [];

    let pauseAutoScroll = false;

    (async () => {
        const client = new ChatClient({ channels: ['auronplay'] });
        await client.connect();

        client.onMessage(async (_channel, _user, _message, msg) => {
            messages = [
                ...messages,
                parseMessage(
                    msg,
                    [globalBadgeProvider],
                    [bttvGlobalEmoteProvider, ffzGlobalEmoteProvider]
                ),
            ];
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
        <ChatMessage message={item} />
    </VirtualList>
</div>

<style>
    .autoscroll {
        @apply border-b-4 border-red-500;
    }
</style>
