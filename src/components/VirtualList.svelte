<!-- Largely based on https://github.com/sveltejs/svelte-virtual-list -->
<script lang="ts">
    import { createEventDispatcher, onMount, tick } from 'svelte';

    const dispatch = createEventDispatcher<{
        scroll: {
            clientHeight: number;
            scrollHeight: number;
            scrollTop: number;
        };
    }>();

    type T = $$Generic;
    export let items: Array<T>;
    export let height = '100%';
    export let itemHeight = undefined;
    export let scrollToBottom = false;

    export let start = 0;
    export let end = 0;

    let heightMap: Array<number> = [];
    let rows: HTMLCollectionOf<HTMLElement>;

    let mounted = false;
    let contents: HTMLElement;
    let viewport: HTMLElement;
    let viewportHeight = 0;

    let top = 0;
    let bottom = 0;
    let averageHeight;

    $: visible = items
        .slice(start, end)
        .map((data, i) => ({ index: i + start, data }));

    export async function scrollToIndex(index: number, cfg?: ScrollToOptions) {
        const itemDelta = index - start;

        viewport.scrollTo({
            left: 0,
            top: viewport.scrollTop + itemDelta * (itemHeight || averageHeight),
            ...cfg,
        });
    }

    async function refresh(
        items: Array<T>,
        viewportHeight: number,
        itemHeight?: number
    ): Promise<void> {
        let scrollTop = viewport.scrollTop;

        if (scrollToBottom && averageHeight) {
            scrollTop += (items.length - end) * (itemHeight || averageHeight);
        } else if (items.length < start) {
            // FIXME: Do this more elegantly
            await scrollToIndex(items.length - 1);
        }

        await tick();

        let contentHeight = top - scrollTop;
        let i = start;

        while (contentHeight < viewportHeight && i < items.length) {
            let row = rows[i - start];

            if (!row) {
                end = i + 1;
                await tick();
                row = rows[i - start];
            }

            const rowHeight = (heightMap[i] = itemHeight || row.offsetHeight);
            contentHeight += rowHeight;

            i++;
        }

        end = i;

        const remaining = items.length - end;
        averageHeight = (top + contentHeight) / end;

        bottom = remaining * averageHeight;
        heightMap.length = items.length;

        if (viewport.scrollTop != scrollTop) {
            if (scrollToBottom) {
                viewport.scrollTo({
                    top: viewport.scrollHeight - viewport.clientHeight,
                });
            } else {
                viewport.scrollTo({ top: scrollTop });
            }
        }
    }

    async function handleScroll() {
        const { scrollTop } = viewport;

        for (let v = 0; v < rows.length; v++) {
            heightMap[start + v] = itemHeight || rows[v].offsetHeight;
        }

        let i = 0;
        let y = 0;

        while (i < items.length) {
            const rowHeight = heightMap[i] || averageHeight;
            if (y + rowHeight > scrollTop) {
                start = i;
                top = y;

                break;
            }

            y += rowHeight;
            i += 1;
        }

        while (i < items.length) {
            y += heightMap[i] || averageHeight;
            i += 1;

            if (y > scrollTop + viewportHeight) {
                break;
            }
        }

        end = i;

        const remaining = items.length - end;
        averageHeight = y / end;
        bottom = remaining * averageHeight;

        while (i < items.length) {
            heightMap[i++] = averageHeight;
        }

        dispatch('scroll', {
            clientHeight: viewport.clientHeight,
            scrollHeight: viewport.scrollHeight,
            scrollTop: viewport.scrollTop,
        });
    }

    $: if (mounted) {
        refresh(items, viewportHeight, itemHeight);
    }

    onMount(() => {
        rows = contents.getElementsByTagName(
            'svelte-virtual-list-row'
        ) as HTMLCollectionOf<HTMLElement>;
        mounted = true;
    });
</script>

<svelte-virtual-list-viewport
    bind:this={viewport}
    bind:offsetHeight={viewportHeight}
    on:scroll={handleScroll}
    style="height: {height};"
>
    <svelte-virtual-list-contents
        bind:this={contents}
        style="padding-top: {top}px; padding-bottom: {bottom}px;"
    >
        {#each visible as row (row.index)}
            <svelte-virtual-list-row>
                <slot item={row.data}>Missing template</slot>
            </svelte-virtual-list-row>
        {/each}
    </svelte-virtual-list-contents>
</svelte-virtual-list-viewport>

<style>
    svelte-virtual-list-viewport {
        position: relative;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        display: block;
    }

    svelte-virtual-list-contents,
    svelte-virtual-list-row {
        display: block;
    }

    svelte-virtual-list-row {
        overflow: hidden;
    }
</style>
