import rawBangs from "./bangs.json" with { type: "json" };

type RuntimeBang = {
	d: string;
	ad?: string;
	s: string;
	u: string;
};

const hashbang: Record<string, RuntimeBang> = {
	t3: {
		d: "www.t3.chat",
		s: "T3 Chat",
		u: "https://www.t3.chat/new?q={{{s}}}",
	},
	t3b: {
		d: "beta.t3.chat",
		s: "T3 Chat Beta",
		u: "https://beta.t3.chat/new?q={{{s}}}",
	},
	m2: {
		d: "meta.dunkirk.sh",
		s: "metasearch2",
		u: "https://meta.dunkirk.sh/search?q={{{s}}}",
	},
	tiktok: {
		d: "www.tiktok.com",
		s: "TikTok",
		u: "https://www.tiktok.com/search?q={{{s}}}",
	},
	image: {
		d: "duckduckgo.com",
		s: "Duckduckgo images",
		u: "https://duckduckgo.com/?q={{{s}}}&ia=images&iax=images&atb=v375-1",
	},
	k: {
		d: "kagi.com",
		s: "Kagi Search",
		u: "https://kagi.com/search?q={{{s}}}",
	},
	kagi: {
		d: "kagi.com",
		s: "Kagi Search",
		u: "https://kagi.com/search?q={{{s}}}",
	},
	ki: {
		d: "kagi.com",
		s: "Kagi Images",
		u: "https://kagi.com/images?q={{{s}}}",
	},
	kagii: {
		d: "kagi.com",
		s: "Kagi Images",
		u: "https://kagi.com/images?q={{{s}}}",
	},
	kv: {
		d: "kagi.com",
		s: "Kagi Videos",
		u: "https://kagi.com/videos?q={{{s}}}",
	},
	kagiv: {
		d: "kagi.com",
		s: "Kagi Videos",
		u: "https://kagi.com/videos?q={{{s}}}",
	},
	kn: {
		d: "kagi.com",
		s: "Kagi News",
		u: "https://kagi.com/news?q={{{s}}}",
	},
	kagin: {
		d: "kagi.com",
		s: "Kagi News",
		u: "https://kagi.com/news?q={{{s}}}",
	},
	km: {
		d: "kagi.com",
		s: "Kagi Maps",
		u: "https://kagi.com/maps?q={{{s}}}",
	},
	kagim: {
		d: "kagi.com",
		s: "Kagi Maps",
		u: "https://kagi.com/maps?q={{{s}}}",
	},
	kp: {
		d: "kagi.com",
		s: "Kagi Podcasts",
		u: "https://kagi.com/podcasts?q={{{s}}}",
	},
	kagip: {
		d: "kagi.com",
		s: "Kagi Podcasts",
		u: "https://kagi.com/podcasts?q={{{s}}}",
	},
	kf: {
		d: "kagi.com",
		s: "Kagi FastGPT",
		u: "https://kagi.com/fastgpt?q={{{s}}}",
	},
	fastgpt: {
		d: "kagi.com",
		s: "Kagi FastGPT",
		u: "https://kagi.com/fastgpt?q={{{s}}}",
	},
	ka: {
		d: "kagi.com",
		s: "Kagi Assistant",
		u: "https://kagi.com/assistant?q={{{s}}}",
	},
	assistant: {
		d: "kagi.com",
		s: "Kagi Assistant",
		u: "https://kagi.com/assistant?q={{{s}}}",
	},
};

for (const bang of rawBangs as any[]) {
	if (!bang.t || !bang.u || !bang.s || !bang.d) {
		console.warn(`Skipping invalid bang: ${JSON.stringify(bang)}`);
		continue;
	}

	const entry: RuntimeBang = { d: bang.d, s: bang.s, u: bang.u };
	if (bang.ad) entry.ad = bang.ad;

	hashbang[bang.t] = entry;

	if (bang.ts) {
		for (const trigger of bang.ts as string[]) {
			hashbang[trigger] = entry;
		}
	}
}

// Deduplicate: entries with identical data become aliases to the first occurrence
const seen = new Map<string, string>();
const primaries: Record<string, RuntimeBang> = {};
const aliases: Record<string, string> = {};

for (const [key, value] of Object.entries(hashbang)) {
	const json = JSON.stringify(value);
	const existing = seen.get(json);
	if (existing) {
		aliases[key] = existing;
	} else {
		seen.set(json, key);
		primaries[key] = value;
	}
}

const uniqueCount = Object.keys(primaries).length;
const aliasCount = Object.keys(aliases).length;
console.log(`${uniqueCount} unique entries, ${aliasCount} aliases, ${uniqueCount + aliasCount} total`);

const type = "Record<string, {d:string;ad?:string;s:string;u:string}>";
const output = `const _d:${type}=${JSON.stringify(primaries)};const _a:Record<string,string>=${JSON.stringify(aliases)};for(const k in _a)_d[k]=_d[_a[k]];export const bangs=_d;`;

Bun.write("./src/bangs/hashbang.ts", output);
