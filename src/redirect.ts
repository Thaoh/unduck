import { CONSTANTS } from "./constants.ts";
import { bangs } from "./bangs/hashbang.ts";
import { storage, getCustomBangs, addToSearchHistory } from "./storage.ts";

function ensureProtocol(url: string, defaultProtocol = "https://") {
	try {
		return new URL(url).href;
	} catch {
		return `${defaultProtocol}${url}`;
	}
}

export function computeRedirectUrl(query: string): string | null {
	if (!query || query === "!" || query === "!settings") return null;

	const customBangs = getCustomBangs();
	const defaultBangKey =
		storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.DEFAULT_BANG) ?? "ddg";
	const defaultBang =
		customBangs[defaultBangKey] || bangs[defaultBangKey];

	const match = query.toLowerCase().match(/^!(\S+)|!(\S+)$/i);
	const bangShortcut = match
		? match[1] || match[2]
		: defaultBangKey;
	const selectedBang = match
		? customBangs[bangShortcut] || bangs[bangShortcut]
		: defaultBang;
	const cleanQuery = match
		? query.replace(/!\S+\s*|^(\S+!|!\S+)$/i, "").trim()
		: query;

	if (!cleanQuery && selectedBang?.d) {
		return ensureProtocol(selectedBang.ad || selectedBang.d);
	}

	let bangUrl = selectedBang?.u || "";

	if (
		selectedBang?.s?.includes("(Kagi Search)") &&
		selectedBang?.u?.match(/^\/search\?q=\{\{\{s\}\}\}\+site:/)
	) {
		const siteMatch = selectedBang.u.match(/\+site:([^\s&]+)/);
		if (siteMatch && defaultBang?.u) {
			const queryWithSite = `${cleanQuery} site:${siteMatch[1]}`;
			bangUrl = defaultBang.u.replace(
				"{{{s}}}",
				encodeURIComponent(queryWithSite).replace(/%2F/g, "/"),
			);
			return ensureProtocol(bangUrl);
		}
	}

	const redirectUrl = bangUrl.replace(
		"{{{s}}}",
		encodeURIComponent(cleanQuery).replace(/%2F/g, "/"),
	);

	setTimeout(() => {
		const count = (
			Number.parseInt(
				storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_COUNT) || "0",
			) + 1
		).toString();
		storage.set(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_COUNT, count);

		if (
			storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.HISTORY_ENABLED) === "true"
		) {
			addToSearchHistory(cleanQuery, bangShortcut);
		}
	}, 0);

	return redirectUrl;
}
