import "./global.css";
import { computeRedirectUrl } from "./redirect.ts";
import { renderHome } from "./home.ts";
import { renderNotFound } from "./not-found.ts";

const url = new URL(window.location.href);
const path = url.pathname.replace(/\/$/, "");
const query = url.searchParams.get("q")?.trim() ?? "";

switch (path) {
	case "":
	case "/search": {
		if (query && query !== "!" && query !== "!settings") {
			const redirectUrl = computeRedirectUrl(query);
			if (redirectUrl) {
				window.location.replace(redirectUrl);
				break;
			}
		}
		renderHome();
		break;
	}
	default:
		renderNotFound();
}
