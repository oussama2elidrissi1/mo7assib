(function () {
	"use strict";

	function bootMo7assibHome(root) {
		if (!root || root.dataset.mo7assibReady === "true") {
			return;
		}

		root.dataset.mo7assibReady = "true";

		var dashboard = root.querySelector(".mo7assib-home__dashboard");
		var cards = root.querySelectorAll(".mo7assib-home__dashboard-card");

		if (dashboard) {
			dashboard.setAttribute("data-enhanced", "true");
		}

		cards.forEach(function (card, index) {
			card.style.transitionDelay = index * 80 + "ms";
			card.classList.add("mo7assib-home__dashboard-card--live");
		});

		if (window.mo7assibCore) {
			window.dispatchEvent(
				new CustomEvent("mo7assib:boot", {
					detail: window.mo7assibCore,
				})
			);
		}
	}

	document.addEventListener("DOMContentLoaded", function () {
		var roots = document.querySelectorAll(".mo7assib-home");

		if (!roots.length) {
			return;
		}

		roots.forEach(bootMo7assibHome);
	});
})();
