<script lang="ts">
    import VirtualList from './components/VirtualList.svelte';
    import { ChatClient } from '@twurple/chat';
    import { Message, parseMessage } from './lib/message';
    import tooltip from './lib/tooltip';
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
        <p class="min-h-6 mb-1">
            <span>
                {#each item.author.badges as badge}
                    <img
                        class:bg-red-500={!badge.url}
                        class:text-transparent={!badge.url}
                        class="inline-block w-5 h-5 not-last:mr-1 object-contain align-text-bottom"
                        src={badge.url}
                        alt={badge.name}
                        use:tooltip={{
                            // FIXME: Potential XSS
                            content: `<b>${badge.name}</b>`,
                            allowHTML: true,
                        }}
                    />
                {/each}
            </span>
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
                        use:tooltip={{
                            // FIXME: Potential XSS
                            content: `<b>${part.name}</b><br/>${part.description}`,
                            allowHTML: true,
                        }}
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
