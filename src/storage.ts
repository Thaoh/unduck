import { CONSTANTS, type RuntimeBang, type SearchHistoryEntry } from "./constants.ts";

export const storage = {
	get: (key: string) => localStorage.getItem(key),
	set: (key: string, value: string) => localStorage.setItem(key, value),
};

export function getCustomBangs(): Record<string, RuntimeBang> {
	return Object.fromEntries(
		Object.entries<RuntimeBang>(
			JSON.parse(
				storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.CUSTOM_BANGS) || "{}",
			),
		).map(([k, v]) => [k.toLowerCase(), v]),
	);
}

export function addToSearchHistory(
	query: string,
	bang: string,
) {
	const history: SearchHistoryEntry[] = JSON.parse(
		storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_HISTORY) || "[]",
	);
	history.unshift({ query, bang, timestamp: Date.now() });
	history.splice(CONSTANTS.MAX_HISTORY);
	storage.set(
		CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_HISTORY,
		JSON.stringify(history),
	);
}

export function getSearchHistory(): SearchHistoryEntry[] {
	try {
		return JSON.parse(
			storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_HISTORY) || "[]",
		);
	} catch {
		return [];
	}
}

export function clearSearchHistory() {
	storage.set(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_HISTORY, "[]");
}

export const createAudio = (src: string) => new Audio(src);
