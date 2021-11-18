export interface EmoteDetails {
    name: string;
    description: string;
    url: string;
}

export interface EmoteProvider {
    get(name: string): EmoteDetails | undefined;
}
