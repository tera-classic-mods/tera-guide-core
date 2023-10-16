"use strict";

/**
 * @typedef {import("../../hooks").deps} deps
 * @typedef {import("../../guide")} guide
 */

module.exports.debug = Object.freeze({
	"name": "Skill",
	"color": cy
});

/**
 * @param {deps} deps
 * @param {guide} guide
 * @param {Object} event
 */
module.exports.callback = (deps, guide, event) => {

	const { library, entity } = deps.mod.require.library;

	// Return if skill of not NPC
	if (!event.skill.npc) return;

	// Get mob ent
	const ent = entity.mobs[event.gameId.toString()];

	if (ent) {
		let skillid = 0;

		// Get range for skill ids of zone type
		if (guide.type === SP)
			// Skill id range 1000-3000 (SP)
			skillid = event.skill.id;
		else if (guide.type === ES)
			// Skill id range 100-200-3000 (ES)
			skillid = event.skill.id > 3000 ? event.skill.id : event.skill.id % 1000;
		else
			// Skill id range 100-200 (not set)
			skillid = event.skill.id % 1000;

		// Due to a bug for some bizare reason we do hooks ugly hack
		event.loc.w = event.w;

		// Compat
		event.dest = event.loc;

		// Correct distance by animation sequence
		if (event.animSeq.length !== 0) {
			let distance = 0;

			event.animSeq.forEach(sequence => distance += sequence.distance);
			library.applyDistance(event.loc, distance);
		}

		// Call event
		return guide.handleEvent(["s", ent.huntingZoneId, ent.templateId, skillid, event.stage], { ...ent, ...event }, module.exports.debug);
	}
};