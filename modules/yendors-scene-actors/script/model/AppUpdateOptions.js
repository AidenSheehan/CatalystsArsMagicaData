export default class AppUpdateOptions {

	/**
	 * Soll das Update auch auf Clients ausgeführt werden?
	 * @type {boolean}
	 */
	emitClients = true;

	/**
	 * Sollen ausgeblendete CanvasLayer wieder eingeblendet werden?
	 * @type {boolean}
	 */
	forceShowCanvas = false;

	/**
	 * Sollen alle Akteure neu initialisiert werden?
	 * @type {boolean}
	 */
	initActors = true;

	/**
	 * Soll nur das UI updated werden?
	 * @type {boolean}
	 */
	onlyUI = false;
}