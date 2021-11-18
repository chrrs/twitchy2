import type { EmoteDetails, EmoteProvider } from './emote';

class BetterTTVGlobalEmoteProvider implements EmoteProvider {
    emotes: { [key: string]: EmoteDetails } = {};

    constructor() {
        fetch('https://api.betterttv.net/3/cached/emotes/global')
            .then((res) => res.json())
            .then((res) => {
                for (const emote of res) {
                    this.emotes[emote.code] = {
                        name: emote.code,
                        description: 'BetterTTV Emote',
                        url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
                    };
                }
            });
    }

    get(name: string): EmoteDetails | undefined {
        return this.emotes[name];
    }
}

export const bttvGlobalEmoteProvider = new BetterTTVGlobalEmoteProvider();
