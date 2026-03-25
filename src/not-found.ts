import { CONSTANTS } from "./constants.ts";
import { storage } from "./storage.ts";

export function renderNotFound() {
	const app = document.querySelector<HTMLDivElement>("#app");
	if (!app) throw new Error("App element not found");

	const count = storage.get(CONSTANTS.LOCAL_STORAGE_KEYS.SEARCH_COUNT) || "0";
	const face =
		CONSTANTS.CUTIES.NOTFOUND[
			Math.floor(Math.random() * CONSTANTS.CUTIES.NOTFOUND.length)
		];

	app.innerHTML = `
<div class="crt">
	<div class="scanlines"></div>
	<div class="terminal">
		<div class="terminal-header">
			<pre class="ascii-title" aria-label="404">
╔═══════════════════════╗
║   ERROR  ·  404       ║
╚═══════════════════════╝</pre>
		</div>
		<div class="terminal-body terminal-body--centered">
			<div class="mascot">${face}</div>
			<p class="notice">Page not found. This corridor leads nowhere.</p>
			<a href="/" class="btn">RETURN TO MAIN TERMINAL</a>
		</div>
		<div class="terminal-footer">
			<div class="footer-line">${count} ${count === "1" ? "search" : "searches"} processed</div>
		</div>
	</div>
</div>`;
}
