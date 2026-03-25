export const CONSTANTS = {
	MAX_HISTORY: 500,
	ANIMATION_DURATION: 375,
	LOCAL_STORAGE_KEYS: {
		SEARCH_HISTORY: "search-history",
		SEARCH_COUNT: "search-count",
		AUDIO_ENABLED: "audio-enabled",
		HISTORY_ENABLED: "history-enabled",
		DEFAULT_BANG: "default-bang",
		CUSTOM_BANGS: "custom-bangs",
	},
	CUTIES: {
		NOTFOUND: [
			"(╯︵╰,)",
			"(｡•́︿•̀｡)",
			"(⊙_☉)",
			"(╯°□°）╯︵ ┻━┻",
			"(ಥ﹏ಥ)",
			"(✿◕‿◕✿)",
			"(╥﹏╥)",
			"(✧ω✧)",
			"(•́_•̀)",
		],
		LEFT: ["╰（°□°╰）", "(◕‿◕´)", "(・ω・´)"],
		RIGHT: ["(╯°□°）╯", "(｀◕‿◕)", "(｀・ω・)"],
		UP: ["(↑°□°)↑", "(´◕‿◕)↑", "↑(´・ω・)↑"],
		DOWN: ["(↓°□°)↓", "(´◕‿◕)↓", "↓(´・ω・)↓"],
	},
} as const;

export type SearchHistoryEntry = {
	query: string;
	bang: string;
	timestamp: number;
};

export type RuntimeBang = {
	d: string;
	ad?: string;
	s: string;
	u: string;
};
