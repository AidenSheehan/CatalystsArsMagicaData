// Compatibility wrapper for older internal callers. The Edit workflow now lives
// as a tab inside the unified Sites panel.

import { SitePanel } from "./SitePanel.js";

export class SiteEditPanel {
    static show() {
        return SitePanel.showEdit();
    }

    static dismiss(options) {
        return SitePanel.dismiss(options);
    }

    static refreshIfOpen() {
        return SitePanel.refreshIfOpen();
    }
}
