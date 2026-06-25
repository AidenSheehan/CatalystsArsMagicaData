export default class CombatState {

	static _STATE = {
		START: 'start',
		DEFENDER: 'defender',
		ATTACK_FAILED: 'attackFailed',
		ATTACK_SUCCEEDED: 'attackSucceeded',
		ATTACK_PARRIED: 'attackParried',
		IS_CONCENTRATING: 'isConcentrating',
	}

	_attackerId = null;
	_defenderId =  null;
	_isDefendable = null;
	_attackType = null;
	_weaponName = null;
	_attackSuccess = null;
	_opposedMsgId = null;
	_state = CombatState._STATE.START;

	get attackerId() {
		return this._attackerId;
	}

	set attackerId(value) {
		this._attackerId = value;
	}

	get defenderId() {
		return this._defenderId;
	}

	set defenderId(value) {
		this._defenderId = value;
	}

	get isDefendable() {
		return this._isDefendable;
	}

	set isDefendable(value) {
		this._isDefendable = value;
	}

	get attackType() {
		return this._attackType;
	}

	set attackType(value) {
		this._attackType = value;
	}

	get weaponName() {
		return this._weaponName;
	}

	set weaponName(value) {
		this._weaponName = value;
	}

	get attackSuccess() {
		return this._attackSuccess;
	}

	set attackSuccess(value) {
		this._attackSuccess = value;
	}

	static get STATE() {
		return this._STATE;
	}

	static set STATE(value) {
		this._STATE = value;
	}

	get opposedMsgId() {
		return this._opposedMsgId;
	}

	set opposedMsgId(value) {
		this._opposedMsgId = value;
	}

	get state() {
		return this._state;
	}

	set state(value) {
		this._state = value;
	}

	toJson() {
		return {
			attackerId: this.attackerId,
			defenderId: this.defenderId,
			isDefendable: this.isDefendable,
			attackType: this.attackType,
			weaponName: this.weaponName,
			attackSuccess: this.attackSuccess,
			opposedMsgId: this.opposedMsgId,
			state: this.state,
		}
	}
}