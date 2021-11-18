import type { EmoteDetails, EmoteProvider } from './emote';

class FrankerFaceZGlobalEmoteProvider implements EmoteProvider {
    emotes: { [key: string]: EmoteDetails } = {};

    constructor() {
        fetch('https://api.frankerfacez.com/v1/set/global')
            .then((res) => res.json())
            .then((res) => {
                for (const set of Object.values(res['sets'] || {}) || []) {
                    for (const emote of set['emoticons'] || []) {
                        this.emotes[emote.name] = {
                            name: emote.name,
                            description: 'FrankerFaceZ Emote',
                            url: `https://cdn.frankerfacez.com/emote/${emote.id}/2`,
                        };
                    }
                }
            });
    }

    get(name: string): EmoteDetails | undefined {
        return this.emotes[name];
    }
}

export const ffzGlobalEmoteProvider = new FrankerFaceZGlobalEmoteProvider();
