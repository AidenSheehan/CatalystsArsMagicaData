const MODULE_ID = "augur-nexus";

export class NexusPlayerSceneAccess {
    static FLAG_KEY = "playerAccess";
    static SETTING_KEY = "playerSceneViewing";
    static NEXUS_VISIBILITY_SETTING_KEY = "playerNexusVisibility";

    static VIEW_VALUES = new Set(["inherit", "allow", "block"]);
    static NEXUS_VISIBILITY_VALUES = new Set(["inherit", "show", "hide"]);

    static getGlobalViewPolicy() {
        const policy = game.settings.get(MODULE_ID, this.SETTING_KEY) || "all";
        return ["all", "explicit"].includes(policy) ? policy : "all";
    }

    static getSceneViewOverride(scene) {
        const value = scene?.getFlag(MODULE_ID, this.FLAG_KEY)?.view || "inherit";
        return this.VIEW_VALUES.has(value) ? value : "inherit";
    }

    static getSceneViewLabel(scene) {
        const value = this.getSceneViewOverride(scene);
        if (value === "allow") return "Allowed";
        if (value === "block") return "Blocked";
        return "Global";
    }

    static getGlobalViewPolicyLabel(policy = this.getGlobalViewPolicy()) {
        if (policy === "explicit") return "Explicit Only";
        return "All Nexus Scenes";
    }

    static getGlobalNexusVisibilityPolicy() {
        const policy = game.settings.get(MODULE_ID, this.NEXUS_VISIBILITY_SETTING_KEY) || "all";
        return ["all", "explicit"].includes(policy) ? policy : "all";
    }

    static getGlobalNexusVisibilityPolicyLabel(policy = this.getGlobalNexusVisibilityPolicy()) {
        if (policy === "explicit") return "Explicit Only";
        return "All Nexus Scenes";
    }

    static getSceneNexusVisibilityOverride(scene) {
        return this.normalizeNexusVisibilityOverride(scene?.getFlag(MODULE_ID, this.FLAG_KEY)?.nexus);
    }

    static getSceneNexusVisibilityLabel(scene) {
        return this.getNexusVisibilityLabel(this.getSceneNexusVisibilityOverride(scene));
    }

    static normalizeNexusVisibilityOverride(value = "inherit") {
        return this.NEXUS_VISIBILITY_VALUES.has(value) ? value : "inherit";
    }

    static getNexusVisibilityLabel(value = "inherit") {
        const normalized = this.normalizeNexusVisibilityOverride(value);
        if (normalized === "show") return "Yes";
        if (normalized === "hide") return "No";
        return "Global";
    }

    static isNexusVisibilityVisible(value = "inherit") {
        const normalized = this.normalizeNexusVisibilityOverride(value);
        if (normalized === "show") return true;
        if (normalized === "hide") return false;

        return this.getGlobalNexusVisibilityPolicy() === "all";
    }

    static canUserSeeNexusVisibility(value = "inherit", user = game.user) {
        if (user?.isGM) return true;
        return this.isNexusVisibilityVisible(value);
    }

    static getNexusVisibilityIcon(value = "inherit") {
        const normalized = this.normalizeNexusVisibilityOverride(value);
        if (normalized === "show") return "fas fa-eye";
        if (normalized === "hide") return "fas fa-eye-slash";
        return "fas fa-layer-group";
    }

    static async setGlobalViewPolicy(policy = "all") {
        if (!game.user.isGM) return this.getGlobalViewPolicy();
        const normalized = ["explicit", "all"].includes(policy) ? policy : "all";
        await game.settings.set(MODULE_ID, this.SETTING_KEY, normalized);
        Hooks.callAll("augurNexusPlayerSceneAccessChanged");
        return normalized;
    }

    static async setGlobalNexusVisibilityPolicy(policy = "all") {
        if (!game.user.isGM) return this.getGlobalNexusVisibilityPolicy();
        const normalized = ["explicit", "all"].includes(policy) ? policy : "all";
        await game.settings.set(MODULE_ID, this.NEXUS_VISIBILITY_SETTING_KEY, normalized);
        Hooks.callAll("augurNexusPlayerSceneAccessChanged");
        return normalized;
    }

    static canUserViewScene(scene, user = game.user) {
        if (!scene || !user) return false;
        if (user.isGM) return true;

        const override = this.getSceneViewOverride(scene);
        if (override === "allow") return true;
        if (override === "block") return false;

        const policy = this.getGlobalViewPolicy();
        if (policy === "all") return true;
        return false;
    }

    static canUserSeeSceneInNexus(scene, user = game.user) {
        if (!scene || !user) return false;
        if (user.isGM) return true;

        return this.canUserSeeNexusVisibility(this.getSceneNexusVisibilityOverride(scene), user);
    }

    static async setSceneViewOverride(scene, value = "inherit") {
        if (!game.user.isGM || !scene) return scene;
        const normalized = this.VIEW_VALUES.has(value) ? value : "inherit";
        const current = foundry.utils.deepClone(scene.getFlag(MODULE_ID, this.FLAG_KEY) || {});

        if (normalized === "inherit") {
            delete current.view;
        } else {
            current.view = normalized;
        }

        if (Object.keys(current).length) await scene.setFlag(MODULE_ID, this.FLAG_KEY, current);
        else await scene.unsetFlag(MODULE_ID, this.FLAG_KEY);
        Hooks.callAll("augurNexusPlayerSceneAccessChanged", scene);
        return scene;
    }

    static async setSceneNexusVisibilityOverride(scene, value = "inherit") {
        if (!game.user.isGM || !scene) return scene;
        const normalized = this.NEXUS_VISIBILITY_VALUES.has(value) ? value : "inherit";
        const current = foundry.utils.deepClone(scene.getFlag(MODULE_ID, this.FLAG_KEY) || {});

        if (normalized === "inherit") {
            delete current.nexus;
        } else {
            current.nexus = normalized;
        }

        if (Object.keys(current).length) await scene.setFlag(MODULE_ID, this.FLAG_KEY, current);
        else await scene.unsetFlag(MODULE_ID, this.FLAG_KEY);
        Hooks.callAll("augurNexusPlayerSceneAccessChanged", scene);
        return scene;
    }
}
