"use strict";

/**
 * @typedef {import("../../hooks").deps} deps
 * @typedef {import("../../guide")} guide
 */

module.exports.debug = Object.freeze({
	"name": "Health",
	"color": cr
});

/**
 * @param {deps} deps
 * @param {guide} guide
 * @param {Object} event
 */
module.exports.callback = (deps, guide, event) => {

	const { entity } = deps.mod.require.library;

	// Get mob ent
	const ent = entity.mobs[event.target.toString()];

	if (ent) {
		// Calculate hp number
		const hp = Math.floor(Number(event.curHp) / Number(event.maxHp) * 100);

		// Check mob's hp of existing value for single call the event
		if (guide.data.mobsHp[event.target] == hp) return;

		// Add mob hp to list
		guide.data.mobsHp[event.target] = hp;

		// Call event
		return guide.handleEvent(["h", ent.huntingZoneId, ent.templateId, hp], ent, module.exports.debug);
	}
};