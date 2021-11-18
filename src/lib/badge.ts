export interface BadgeDetails {
    name: string;
    url?: string;
}

export interface BadgeProvider {
    get(name: string, detail: string): BadgeDetails | undefined;
}

class GlobalBadgeProvider implements BadgeProvider {
    badges: { [key: string]: { [key: string]: BadgeDetails } } = {};

    constructor() {
        fetch('https://badges.twitch.tv/v1/badges/global/display')
            .then((res) => res.json())
            .then((res) => {
                const sets = res['badge_sets'];
                Object.keys(sets).map((name) => {
                    this.badges[name] = {};
                    Object.keys(sets[name]['versions']).map((detail) => {
                        const info = sets[name]['versions'][detail];
                        this.badges[name][detail] = {
                            name: info['title'],
                            url: info['image_url_4x'],
                        };
                    });
                });
            });
    }

    get(name: string, detail: string): BadgeDetails | undefined {
        return this.badges[name]?.[detail];
    }
}

export const globalBadgeProvider = new GlobalBadgeProvider();
