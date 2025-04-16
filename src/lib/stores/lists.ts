import { writable } from 'svelte/store';

export type List = {
	id: string;
	title?: string | null;
};

export const selectedList = writable<List | null>(null);
