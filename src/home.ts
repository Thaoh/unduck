import { CONSTANTS, type RuntimeBang } from "./constants.ts";
import { bangs } from "./bangs/hashbang.ts";
import {
	storage,
	getCustomBangs,
	getSearchHistory,
	clearSearchHistory,
	createAudio,
} from "./storage.ts";

function randomCutie(
	arr: readonly string[],
): string {
	return arr[Math.floor(Math.random() * arr.length)];
}

function padCount(n: number, digits = 6): string {
	return String(n).padStart(digits, "0");
}

function buildTemplate(data: {
	searchCount: number;
	audioEnabled: boolean;
	historyEnabled: boolean;
	searchHistory: ReturnType<typeof getSearchHistory>;
	defaultBangKey: string;
	customBangs: Record<string, RuntimeBang>;
}) {
	const bangName =
		(data.customBangs[data.defaultBangKey] || bangs[data.defaultBangKey])
			?.s || "Unknown";

	const historyHtml = data.historyEnabled
		? `<div class="dispatch-section">
				<div class="section-rule">─── RECENT DISPATCHES ───</div>
				<div class="dispatch-log">
					${
						data.searchHistory.length === 0
							? '<div class="dispatch-empty">No dispatches logged.</div>'
							: data.searchHistory
									.map(
										(entry) => `
								<a href="?q=!${entry.bang} ${entry.query}" class="dispatch-entry">
									<span class="dispatch-bang">!${entry.bang}</span>
									<span class="dispatch-query">${entry.query}</span>
									<span class="dispatch-time">${new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
								</a>`,
									)
									.join("")
					}
				</div>
			</div>`
		: "";

	const customBangListHtml =
		Object.keys(data.customBangs).length > 0
			? `<div class="section-rule">YOUR CUSTOM BANGS</div>
				<div class="custom-bangs-list">
					${Object.entries(data.customBangs)
						.map(
							([shortcut, bang]) => `
						<div class="custom-bang-item">
							<div class="custom-bang-row">
								<code>!${shortcut}</code>
								<span class="custom-bang-name">${bang.s}</span>
								<span class="custom-bang-domain">${bang.d}</span>
							</div>
							<div class="custom-bang-url">${bang.u}</div>
							<button class="btn btn-danger remove-bang" data-shortcut="${shortcut}">REMOVE</button>
						</div>`,
						)
						.join("")}
				</div>`
			: "";

	return `
<div class="crt">
	<div class="scanlines"></div>
	<div class="terminal">
		<div class="terminal-header">
			<pre class="ascii-title" aria-label="Bangin' Search">
 ╔╗  ╔═╗ ╔╗╔ ╔═╗ ╦ ╔╗╔ ╦
 ╠╩╗ ╠═╣ ║║║ ║ ╦ ║ ║║║ ║
 ╚═╝ ╩ ╩ ╝╚╝ ╚═╝ ╩ ╝╚╝ o
═══ SEARCH ENGINE WORKS™ ═══</pre>
			<div class="counter-row">
				<span class="counter-label">SEARCHES:</span>
				<span class="odometer">${padCount(data.searchCount)}</span>
				<button class="gear-btn settings-button" aria-label="Open control panel" title="Control Panel">⚙</button>
			</div>
		</div>

		<div class="terminal-body">
			<div class="mascot" id="cutie">┐( ˘_˘ )┌</div>

			<p class="notice">
				<span class="blink">►</span> DuckDuckGo's bang redirects are too slow.
				This here machine does it faster. Add the URL below as a custom search engine in your browser.
				Supports <a href="https://duckduckgo.com/bang.html" target="_blank">DuckDuckGo</a>
				and <a href="https://kagi.com/bang" target="_blank">Kagi</a> bangs.
			</p>

			<div class="url-box">
				<div class="section-rule">═══ COPY THIS ADDRESS ═══</div>
				<div class="url-row">
					<input type="text" class="url-input" value="https://unduck.link?q=%s" readonly />
					<button class="btn copy-button">
						<span class="copy-label">COPY</span>
						<span class="copy-check" hidden>OK ✓</span>
					</button>
				</div>
			</div>

			${historyHtml}
		</div>

		<div class="terminal-footer">
			<div class="footer-line">
				Stoked &amp; maintained by <a href="https://github.com/thaoh" target="_blank">Thaoh</a>
				 · <a href="https://github.com/Thaoh/unduck" target="_blank">Blueprints</a>
				 · <button class="lineage-btn" aria-label="Project lineage" title="Project lineage">⚒</button>
			</div>
			<div class="footer-meta">Powered by coal &amp; curiosity · Est. 2024</div>
		</div>
	</div>

	<dialog class="control-panel" id="lineage-modal">
		<div class="panel-frame">
			<div class="panel-titlebar">
				<span>⚒ LINEAGE</span>
				<button class="panel-close close-lineage" aria-label="Close">[×]</button>
			</div>
			<div class="panel-body">
				<p class="lineage-intro">This machine was forged from open-source steel. Thaoh forked the original engine, then tempered it with improvements from Kieran's workshop — including a GitHub action that sources Kagi bangs and processes them into the hashbang file that powers this site.</p>
				<svg class="lineage-svg" viewBox="0 0 380 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Project lineage diagram">
					<defs>
						<filter id="node-glow">
							<feGaussianBlur stdDeviation="3" result="blur"/>
							<feMerge>
								<feMergeNode in="blur"/>
								<feMergeNode in="SourceGraphic"/>
							</feMerge>
						</filter>
					</defs>

					<line x1="95" y1="68" x2="160" y2="120" stroke="#4a4440" stroke-width="1.5" stroke-dasharray="4 3"/>
					<line x1="285" y1="68" x2="220" y2="120" stroke="#4a4440" stroke-width="1.5" stroke-dasharray="4 3"/>

					<text x="110" y="102" fill="#6b6358" font-size="9" font-family="'VT323',monospace" transform="rotate(-32 110 102)">forked</text>
					<text x="258" y="100" fill="#6b6358" font-size="9" font-family="'VT323',monospace" transform="rotate(32 258 100)">merged</text>

					<a href="https://github.com/T3-Content/unduck" target="_blank">
						<rect x="10" y="18" width="170" height="50" rx="2" stroke="#d4920c" stroke-width="1" fill="rgba(13,11,8,0.9)"/>
						<text x="95" y="40" fill="#c4b590" text-anchor="middle" font-size="11.5" font-family="'IBM Plex Mono',monospace">T3-Content/unduck</text>
						<text x="95" y="56" fill="#6b6358" text-anchor="middle" font-size="10" font-family="'IBM Plex Mono',monospace">by Theo</text>
					</a>

					<a href="https://github.com/taciturnaxolotl/unduckified" target="_blank">
						<rect x="200" y="18" width="170" height="50" rx="2" stroke="#d4920c" stroke-width="1" fill="rgba(13,11,8,0.9)"/>
						<text x="285" y="40" fill="#c4b590" text-anchor="middle" font-size="11.5" font-family="'IBM Plex Mono',monospace">unduckified</text>
						<text x="285" y="56" fill="#6b6358" text-anchor="middle" font-size="10" font-family="'IBM Plex Mono',monospace">by Kieran Klukas</text>
					</a>

					<a href="https://github.com/Thaoh/unduck" target="_blank">
						<rect x="105" y="120" width="170" height="50" rx="2" stroke="#f0b429" stroke-width="1.5" fill="rgba(212,146,12,0.06)" filter="url(#node-glow)"/>
						<text x="190" y="143" fill="#f0b429" text-anchor="middle" font-size="12" font-family="'IBM Plex Mono',monospace" font-weight="600">Thaoh/unduck</text>
						<text x="190" y="159" fill="#d4920c" text-anchor="middle" font-size="10" font-family="'IBM Plex Mono',monospace">this project</text>
					</a>
				</svg>
				<p class="lineage-thanks">Built on MIT-licensed code. All upstream contributors are appreciated.</p>
			</div>
		</div>
	</dialog>

	<dialog class="control-panel" id="settings-modal">
		<div class="panel-frame">
			<div class="panel-titlebar">
				<span>⚙ CONTROL PANEL</span>
				<button class="panel-close close-modal" aria-label="Close">[×]</button>
			</div>
			<div class="panel-body">
				<fieldset class="panel-section">
					<legend>BANG CONFIGURATION</legend>
					<label for="default-bang" id="bang-description">Default: ${bangName}</label>
					<div class="input-group">
						<input type="text" id="default-bang" class="panel-input" value="${data.defaultBangKey}" />
						<span class="input-suffix">↵</span>
					</div>
					<p class="help-text">Submit new bangs on <a href="https://duckduckgo.com/newbang" target="_blank">DuckDuckGo</a>, or add your own below.</p>

					<div class="subsection">
						<div class="section-rule">SEARCH BANGS</div>
						<input type="text" placeholder="Search by name or shortcut..." id="bang-search" class="panel-input" />
						<div id="bang-search-results" class="search-results"></div>
					</div>

					<div class="subsection">
						<div class="section-rule">ADD CUSTOM BANG</div>
						<input type="text" placeholder="Name" id="bang-name" class="panel-input" />
						<input type="text" placeholder="Shortcut (e.g. ddg)" id="bang-shortcut" class="panel-input" />
						<input type="text" placeholder="Search URL with {{{s}}}" id="bang-search-url" class="panel-input" />
						<input type="text" placeholder="Base domain" id="bang-base-url" class="panel-input" />
						<button class="btn add-bang">ADD BANG</button>
					</div>

					${customBangListHtml}
				</fieldset>

				<fieldset class="panel-section">
					<legend>AUDIO SYSTEMS</legend>
					<label class="toggle-row">
						<span>Enable Sound Effects</span>
						<input type="checkbox" id="audio-toggle" ${data.audioEnabled ? "checked" : ""} />
						<span class="toggle-switch"></span>
					</label>
				</fieldset>

				<fieldset class="panel-section">
					<legend>SEARCH LOG (${data.searchHistory.length}/${CONSTANTS.MAX_HISTORY})</legend>
					<label class="toggle-row">
						<span>Enable Search History</span>
						<input type="checkbox" id="history-toggle" ${data.historyEnabled ? "checked" : ""} />
						<span class="toggle-switch"></span>
					</label>
					<button class="btn btn-danger clear-history">CLEAR LOG</button>
				</fieldset>

				<fieldset class="panel-section">
					<legend>DATA TRANSFER</legend>
					<p class="help-text">Export or import your configuration.</p>
					<div class="btn-row">
						<button class="btn export-settings">EXPORT</button>
						<button class="btn import-settings">IMPORT</button>
						<input type="file" id="import-file" accept=".json" hidden />
					</div>
				</fieldset>
			</div>
		</div>
	</dialog>
</div>`;
}

function bindEvents(
	app: HTMLDivElement,
	customBangs: Record<string, RuntimeBang>,
	defaultBangKey: string,
	historyEnabled: boolean,
) {
	const $ = <T extends Element>(sel: string) => {
		const el = app.querySelector<T>(sel);
		if (!el) throw new Error(`Element not found: ${sel}`);
		return el;
	};
	const $$ = <T extends Element>(sel: string) =>
		app.querySelectorAll<T>(sel);

	const cutie = $<HTMLElement>("#cutie");
	const lineageBtn = $<HTMLButtonElement>(".lineage-btn");
	const lineageModal = $<HTMLDialogElement>("#lineage-modal");
	const closeLineage = $<HTMLButtonElement>(".close-lineage");
	const urlInput = $<HTMLInputElement>(".url-input");
	const copyBtn = $<HTMLButtonElement>(".copy-button");
	const copyLabel = $<HTMLSpanElement>(".copy-label");
	const copyCheck = $<HTMLSpanElement>(".copy-check");
	const settingsBtn = $<HTMLButtonElement>(".settings-button");
	const modal = $<HTMLDialogElement>("#settings-modal");
	const closeBtn = $<HTMLButtonElement>(".close-modal");
	const defaultBangInput = $<HTMLInputElement>("#default-bang");
	const bangDesc = $<HTMLElement>("#bang-description");
	const audioToggle = $<HTMLInputElement>("#audio-toggle");
	const historyToggle = $<HTMLInputElement>("#history-toggle");
	const clearHistoryBtn = $<HTMLButtonElement>(".clear-history");
	const bangSearch = $<HTMLInputElement>("#bang-search");
	const bangResults = $<HTMLDivElement>("#bang-search-results");
	const bangName = $<HTMLInputElement>("#bang-name");
	const bangShortcut = $<HTMLInputElement>("#bang-shortcut");
	const bangSearchUrl = $<HTMLInputElement>("#bang-search-url");
	const bangBaseUrl = $<HTMLInputElement>("#bang-base-url");
	const addBangBtn = $<HTMLButtonElement>(".add-bang");
	const exportBtn = $<HTMLButtonElement>(".export-settings");
	const importBtn = $<HTMLButtonElement>(".import-settings");
	const importFile = $<HTMLInputElement>("#import-file");

	urlInput.value = `${window.location.protocol}//${window.location.host}?q=%s`;

	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const isAudioEnabled = () =>
		storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.AUDIO_ENABLED) === "true";
	const playIf = (a: HTMLAudioElement | undefined) => {
		if (!a || !isAudioEnabled()) return;
		a.play();
	};

	function reloadAfterDelay() {
		if (!prefersReducedMotion)
			setTimeout(() => window.location.reload(), CONSTANTS.ANIMATION_DURATION);
		else window.location.reload();
	}

	// --- Mascot click tracking ---
	if (!prefersReducedMotion) {
		document.addEventListener("click", (e) => {
			const dx = e.clientX - window.innerWidth / 2;
			const dy = e.clientY - window.innerHeight / 2;
			if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 100) {
				cutie.textContent = randomCutie(
					dx < 0 ? CONSTANTS.CUTIES.LEFT : CONSTANTS.CUTIES.RIGHT,
				);
			} else if (Math.abs(dy) > 100) {
				cutie.textContent = randomCutie(
					dy < 0 ? CONSTANTS.CUTIES.UP : CONSTANTS.CUTIES.DOWN,
				);
			}
		});
	}

	// --- Audio setup ---
	const audio = prefersReducedMotion
		? undefined
		: {
				spin: createAudio("/assets/audio/heavier-tick-sprite.opus"),
				toggleOff: createAudio("/assets/audio/toggle-button-off.opus"),
				toggleOn: createAudio("/assets/audio/toggle-button-on.opus"),
				click: createAudio("/assets/audio/click-button.opus"),
				warning: createAudio("/assets/audio/double-button.opus"),
				copy: createAudio("/assets/audio/foot-switch.opus"),
			};

	// --- Copy URL ---
	copyBtn.addEventListener("click", async () => {
		await navigator.clipboard.writeText(urlInput.value);
		if (audio) {
			audio.copy.currentTime = 0;
			playIf(audio.copy);
		}
		copyLabel.hidden = true;
		copyCheck.hidden = false;
		if (!prefersReducedMotion) urlInput.classList.add("flash-white");
		setTimeout(() => {
			urlInput.classList.remove("flash-white");
			copyLabel.hidden = false;
			copyCheck.hidden = true;
		}, CONSTANTS.ANIMATION_DURATION);
	});

	// --- Settings button ---
	if (audio) {
		settingsBtn.addEventListener("mouseenter", () => playIf(audio.spin));
		settingsBtn.addEventListener("mouseleave", () => {
			playIf(audio.spin);
			audio.spin.currentTime = 0;
		});
	}
	settingsBtn.addEventListener("click", () => {
		settingsBtn.classList.add("rotate");
		modal.showModal();
	});

	// --- Lineage dialog ---
	lineageBtn.addEventListener("click", () => lineageModal.showModal());
	closeLineage.addEventListener("click", () => lineageModal.close());
	lineageModal.addEventListener("mousedown", (e) => {
		if (e.target === lineageModal) lineageModal.close();
	});

	// --- Modal backdrop close ---
	let backdropDown = false;
	modal.addEventListener("mousedown", (e) => {
		backdropDown = e.target === modal;
		if (backdropDown)
			document.addEventListener(
				"mouseup",
				() => {
					backdropDown = false;
				},
				{ once: true },
			);
	});
	modal.addEventListener("mouseup", (e) => {
		if (backdropDown && e.target === modal) modal.close();
		backdropDown = false;
	});
	modal.addEventListener("mouseleave", () => {
		backdropDown = false;
	});
	closeBtn.addEventListener("click", () => modal.close());

	modal.addEventListener("close", () => {
		settingsBtn.classList.remove("rotate");
		if (audio) {
			audio.spin.playbackRate = 0.7;
			audio.spin.currentTime = 0;
			playIf(audio.spin);
			audio.spin.onended = () => {
				audio.spin.playbackRate = 1;
			};
		}
		if (historyToggle.checked !== historyEnabled) reloadAfterDelay();
	});

	// --- Default bang ---
	defaultBangInput.addEventListener("change", (e) => {
		const val = (e.target as HTMLInputElement).value.replace(/^!+/, "");
		const bang = customBangs[val] || bangs[val];
		if (!bang) {
			defaultBangInput.value = defaultBangKey;
			defaultBangInput.classList.add("shake", "flash-red");
			if (audio) {
				audio.warning.currentTime = 0;
				playIf(audio.warning);
			}
			setTimeout(
				() => defaultBangInput.classList.remove("shake", "flash-red"),
				300,
			);
			return;
		}
		if (audio) {
			audio.click.currentTime = 0;
			playIf(audio.click);
		}
		storage.set(CONSTANTS.LOCAL_STORAGE_KEYS.DEFAULT_BANG, val);
		bangDesc.textContent = `Default: ${bang.s}`;
	});

	// --- Toggles ---
	audioToggle.addEventListener("change", (e) => {
		const on = (e.target as HTMLInputElement).checked;
		storage.set(CONSTANTS.LOCAL_STORAGE_KEYS.AUDIO_ENABLED, on.toString());
		if (audio) {
			if (on) {
				audio.toggleOff.pause();
				audio.toggleOff.currentTime = 0;
				audio.toggleOn.currentTime = 0;
				playIf(audio.toggleOn);
			} else {
				audio.toggleOn.pause();
				audio.toggleOn.currentTime = 0;
				audio.toggleOff.currentTime = 0;
				playIf(audio.toggleOff);
			}
		}
	});

	historyToggle.addEventListener("change", (e) => {
		storage.set(
			CONSTANTS.LOCAL_STORAGE_KEYS.HISTORY_ENABLED,
			(e.target as HTMLInputElement).checked.toString(),
		);
	});

	clearHistoryBtn.addEventListener("click", () => {
		clearSearchHistory();
		if (audio) playIf(audio.warning);
		reloadAfterDelay();
	});

	// --- Add custom bang ---
	addBangBtn.addEventListener("click", () => {
		const name = bangName.value.trim();
		const shortcut = bangShortcut.value.trim().replace(/^!+/, "").toLowerCase();
		const searchUrl = bangSearchUrl.value.trim();
		const baseUrl = bangBaseUrl.value.trim();
		if (!name || !searchUrl || !baseUrl) return;

		customBangs[shortcut] = { s: name, u: searchUrl, d: baseUrl };
		storage.set(
			CONSTANTS.LOCAL_STORAGE_KEYS.CUSTOM_BANGS,
			JSON.stringify(customBangs),
		);
		if (audio) {
			audio.click.currentTime = 0.1;
			audio.click.playbackRate = 2;
			playIf(audio.click);
		}
		reloadAfterDelay();
	});

	// --- Remove custom bangs ---
	for (const btn of $$<HTMLButtonElement>(".remove-bang")) {
		btn.addEventListener("click", (e) => {
			const shortcut = (e.target as HTMLButtonElement).dataset.shortcut!;
			delete customBangs[shortcut];
			storage.set(
				CONSTANTS.LOCAL_STORAGE_KEYS.CUSTOM_BANGS,
				JSON.stringify(customBangs),
			);
			if (audio) {
				audio.warning.currentTime = 0;
				playIf(audio.warning);
			}
			reloadAfterDelay();
		});
	}

	// --- Bang search ---
	let debounceTimer: ReturnType<typeof setTimeout>;
	bangSearch.addEventListener("input", (e) => {
		clearTimeout(debounceTimer);
		const query = (e.target as HTMLInputElement).value.trim().toLowerCase();
		if (!query) {
			bangResults.innerHTML = "";
			return;
		}
		debounceTimer = setTimeout(() => {
			const allBangs = { ...bangs, ...customBangs };
			const results = Object.entries(allBangs)
				.filter(([shortcut, bang]) =>
					`${shortcut} ${bang.s} ${bang.d}`.toLowerCase().includes(query),
				)
				.sort((a, b) => {
					const aStarts =
						a[0].startsWith(query) ||
						a[1].s.toLowerCase().startsWith(query);
					const bStarts =
						b[0].startsWith(query) ||
						b[1].s.toLowerCase().startsWith(query);
					if (aStarts && !bStarts) return -1;
					if (!aStarts && bStarts) return 1;
					return a[0].length - b[0].length;
				})
				.slice(0, 20);

			if (results.length === 0) {
				bangResults.innerHTML =
					'<div class="search-empty">No bangs found.</div>';
				return;
			}
			bangResults.innerHTML = results
				.map(([shortcut, bang]) => {
					const name = bang.s
						.replace(/\s*\(Kagi Search\)\s*$/i, " (default search)")
					return `<div class="search-result-item">
						<code>!${shortcut}</code>
						<span class="result-name">${name}</span>
						<span class="result-domain">${bang.d}</span>
					</div>`;
				})
				.join("");
		}, 150);
	});

	// --- Export / Import ---
	exportBtn.addEventListener("click", () => {
		const data = {
			defaultBang: storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.DEFAULT_BANG),
			customBangs: storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.CUSTOM_BANGS),
			historyEnabled: storage.get(
				CONSTANTS.LOCAL_STORAGE_KEYS.HISTORY_ENABLED,
			),
			exportDate: new Date().toISOString(),
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `bangin-search-settings-${new Date().toISOString().split("T")[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	});

	importBtn.addEventListener("click", () => importFile.click());
	importFile.addEventListener("change", async (e) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		try {
			const data = JSON.parse(await file.text());
			if (data.defaultBang)
				storage.set(CONSTANTS.LOCAL_STORAGE_KEYS.DEFAULT_BANG, data.defaultBang);
			if (data.customBangs)
				storage.set(
					CONSTANTS.LOCAL_STORAGE_KEYS.CUSTOM_BANGS,
					data.customBangs,
				);
			if (data.historyEnabled !== undefined)
				storage.set(
					CONSTANTS.LOCAL_STORAGE_KEYS.HISTORY_ENABLED,
					data.historyEnabled,
				);
			alert("Settings imported successfully!");
			reloadAfterDelay();
		} catch (err) {
			alert("Failed to import settings. Check the file format.");
			console.error("Import error:", err);
		}
	});
}

export function renderHome() {
	const app = document.querySelector<HTMLDivElement>("#app");
	if (!app) throw new Error("App element not found");

	const customBangs = getCustomBangs();
	const defaultBangKey =
		storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.DEFAULT_BANG) ?? "ddg";
	const historyEnabled =
		storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.HISTORY_ENABLED) === "true";

	app.innerHTML = buildTemplate({
		searchCount: Number.parseInt(
			storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_COUNT) || "0",
		),
		audioEnabled:
			storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.AUDIO_ENABLED) === "true",
		historyEnabled,
		searchHistory: getSearchHistory(),
		defaultBangKey,
		customBangs,
	});

	bindEvents(app, customBangs, defaultBangKey, historyEnabled);
}
