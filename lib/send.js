"use strict";

// Not used. Compat only
global.spt = 31; // text notice
global.spg = 42; // green message
global.spb = 43; // blue message
global.spr = 44; // red message
global.spi = 66; // blue info message
global.spn = 49; // left side notice

/**
 * @typedef {import("../index").deps} deps
 */

class Send {
	/**
	 * Creates an instance of Send.
	 * @param {deps} deps
	 * @memberof Send
	 */
	constructor(deps) {
		this.__deps = deps;
	}

	/**
	 * Basic message.
	 * @param {string} message Message text to send.
	 * @return {void}
	 * @memberof Send
	 */
	message(message) {
		// If streamer mode is enabled send message to the proxy-channel
		if (this.__deps.mod.settings.stream)
			return this.__deps.mod.command.message(this.__deps.mod.settings.cc + this.__deps.functions.formatMessage(message));

		const sending_event = {
			"message": this.__deps.mod.settings.cc + this.__deps.functions.formatMessage(message)
		};

		if (this.__deps.params.chat_name)
			Object.assign(sending_event, { "name": this.__deps.params.chat_name });

		// Send message as a Team leader notification
		this.__deps.mod.send(...this.__deps.proto.getData("S_CHAT"), { ...sending_event, "channel": 21 });

		// Send message to party chat if gNotice is enabled
		if (this.__deps.mod.settings.gNotice)
			this.__deps.mod.send(...this.__deps.proto.getData("S_CHAT"), { ...sending_event, "channel": 1 });
	}

	/**
	 * Notification message.
	 * @param {string} message Message text to send.
	 * @return {void}
	 * @memberof Send
	 */
	notification(message) {
		// If streamer mode is enabled send message to the proxy-channel
		if (this.__deps.mod.settings.stream)
			return this.__deps.mod.command.message(`${clb}[Notice] ${this.__deps.mod.settings.cc}${this.__deps.functions.formatMessage(message)}`);

		const sending_event = {
			"message": this.__deps.functions.formatMessage(message)
		};

		if (this.__deps.params.chat_name)
			Object.assign(sending_event, { "name": this.__deps.params.chat_name });

		// Send message as a Raid leader notification
		this.__deps.mod.send(...this.__deps.proto.getData("S_CHAT"), { ...sending_event, "channel": 25 });

		// Send message to party chat if gNotice is enabled
		if (this.__deps.mod.settings.gNotice)
			this.__deps.mod.send(...this.__deps.proto.getData("S_CHAT"), { ...sending_event, "channel": 1 });
	}

	/**
	 * Alert message.
	 * @param {string} message Message text to send.
	 * @param {string} cc Color tag for colorize the message text.
	 * @return {void}
	 * @memberof Send
	 */
	alert(message, cc) {
		// If streamer mode is enabled send message to the proxy-channel
		if (this.__deps.mod.settings.stream)
			return this.__deps.mod.command.message(`${cc}[Alert] ${this.__deps.mod.settings.cc}${this.__deps.functions.formatMessage(message)}`);

		const sending_event = {
			"message": this.__deps.functions.formatMessage(message)
		};

		if (this.__deps.params.chat_name)
			Object.assign(sending_event, { "name": this.__deps.params.chat_name });

		// Send message as a Raid leader notification
		this.__deps.mod.send(...this.__deps.proto.getData("S_CHAT"), { ...sending_event, "channel": 25 });

		// Send message to party if gNotice or gAlert is enabled
		if (this.__deps.mod.settings.gNotice) {
			this.__deps.mod.send(...this.__deps.proto.getData("S_CHAT"), { ...sending_event, "channel": 1 });
		}
	}

	/**
	 * Proxy message.
	 * @param {string} message Message text to send.
	 * @param {string} type Type of message to send.
	 * @return {void}
	 * @memberof Send
	 */
	proxy(message, type) {
		// Get color code from type string
		const color_code = type.toLowerCase().replace(/msg$/, "");

		// Color-specified proxy-channel messages
		if (global[color_code])
			return this.__deps.mod.command.message(global[color_code] + message);

		switch (type.toLowerCase()) {
			// Debug or test message to the proxy-channel and log console
			case "msg":
				this.__deps.mod.command.message(cp + message);
				console.log(cp + message);
				break;

			// Default color proxy-channel message
			case "prmsg":
			default:
				this.__deps.mod.command.message(this.__deps.mod.settings.cc + message);
		}
	}

	/**
	 * Debug message.
	 * @param {boolean} enabled Enable sending.
	 * @param {*[]} args Arguments to string.
	 * @memberof Send
	 */
	debug(enabled, ...args) {
		if (!enabled && !this.__deps.mod.settings.debug.all) return;

		if (this.__deps.mod.settings.debug.chat)
			this.__deps.mod.command.message(cgr + args.toString());

		console.log(`[Guide]${this.__deps.zone.loaded ? ` [${this.__deps.zone.id}]` : ""}`,
			...args.map(s =>
				this.__deps.functions.stripTags(s)
			)
		);
	}

	/**
	 * Play voice message.
	 * @param {string} message Message text to generate and play speech.
	 * @param {boolean} [enabled=false] Force enable speech playing.
	 * @memberof Send
	 */
	voice(message, enabled = false) {
		if (!this.__deps.mod.settings.speech.enabled && !this.__deps.mod.settings.speaks && !enabled) return;

		this.__deps.speech.play(this.__deps.functions.stripTags(this.__deps.functions.formatTags(message)));
	}

	/**
	 * Send welvome message.
	 * @param {boolean} [debugEnabled=false] Force enable debug messages.
	 * @memberof Send
	 */
	welcomeMessage(debugEnabled = false) {
		// Return if the player is not in dungeon
		if (!this.__deps.mod.game.me.inDungeon && !debugEnabled) return;

		this.__deps.mod.setTimeout(() => {
			if (this.__deps.zone.settings.name)
				this.__deps.mod.command.message(`${cy}${this.__deps.lang.strings.enterdg}: ${clb}${this.__deps.zone.settings.name} ${cw}[${this.__deps.zone.guide.id}]`);

			this.__deps.mod.command.message(
				`${cg}${this.__deps.lang.strings.helpheader}\n` +
				`${cg}${this.__deps.lang.strings.stream}: ${cy}${this.__deps.mod.settings.stream ? this.__deps.lang.strings.enabled : this.__deps.lang.strings.disabled}\n` +
				`${cg}${this.__deps.lang.strings.speaks}: ${cy}${this.__deps.mod.settings.speech.enabled ? this.__deps.lang.strings.enabled : this.__deps.lang.strings.disabled}`
			);
		}, debugEnabled ? 0 : 5000);
	}
}

module.exports = Send;