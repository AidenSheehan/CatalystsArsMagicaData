import { getTopLeftAnchorVisualPosition } from "../../../api/tiles.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";
import { SiteEditor } from "./SiteEditor.js";

const HIGHLIGHT_NAME = "augur-nexus-site-selection-highlight";
const ACCENT_COLOR = 0x55dfff;
const GLOW_COLOR = 0x1f8cff;
const WARNING_COLOR = 0xffd35a;

export class SiteSelectionHighlighter {
    static #graphics = null;
    static #registered = false;

    static registerHooks() {
        if (this.#registered) return;
        this.#registered = true;

        Hooks.on("augurNexusSiteEditorSelectionChanged", () => this.refresh());
        Hooks.on("canvasReady", () => this.refresh());
        Hooks.on("canvasTearDown", () => this.clear());
        Hooks.on("deleteTile", () => this.refresh());
        Hooks.on("updateTile", () => this.refresh());
        Hooks.on("deleteNote", () => this.refresh());
        Hooks.on("updateNote", () => this.refresh());
    }

    static refresh() {
        if (!SiteEditor.isEditMode) {
            this.clear();
            return;
        }

        const placeable = NexusMarkerService.getSelectedPlaceable();
        const shape = this.#resolveShape(placeable);
        if (!shape) {
            this.clear();
            return;
        }

        const graphics = this.#ensureGraphics();
        if (!graphics) return;

        graphics.clear();
        this.#drawGlow(graphics, shape);
        this.#drawCorners(graphics, shape);
    }

    static clear() {
        if (!this.#graphics) return;
        this.#graphics.parent?.removeChild(this.#graphics);
        this.#graphics.destroy();
        this.#graphics = null;
    }

    static #ensureGraphics() {
        const layer = canvas?.interface || canvas?.controls || canvas?.stage || canvas?.augur;
        if (!layer) return null;
        if (this.#graphics && this.#graphics.parent === layer) return this.#graphics;

        this.clear();
        this.#graphics = new PIXI.Graphics();
        this.#graphics.name = HIGHLIGHT_NAME;
        this.#graphics.eventMode = "none";
        this.#graphics.interactive = false;
        this.#graphics.zIndex = 1000000;
        layer.sortableChildren = true;
        layer.addChild(this.#graphics);
        return this.#graphics;
    }

    static #resolveShape(placeable) {
        const doc = placeable?.document || placeable || null;
        if (!doc) return null;
        if (doc.documentName === "Tile") return this.#resolveTileShape(doc);
        if (doc.documentName === "Note") return this.#resolveNoteShape(doc);

        const bounds = placeable?.bounds;
        if (!bounds) return null;
        return this.#resolveRectangleShape(bounds.x, bounds.y, bounds.width, bounds.height, 0);
    }

    static #resolveTileShape(doc) {
        const width = Math.max(Number(doc.width) || 0, 1);
        const height = Math.max(Number(doc.height) || 0, 1);
        const rotation = Number(doc.rotation) || 0;
        const visual = getTopLeftAnchorVisualPosition({
            x: Number(doc.x) || 0,
            y: Number(doc.y) || 0,
            width,
            height,
            rotation
        });
        return this.#resolveRectangleShape(visual.x, visual.y, width, height, rotation, { hidden: !!doc.hidden });
    }

    static #resolveNoteShape(doc) {
        const flags = doc.flags?.["augur-nexus"] || {};
        const size = Math.max(Number(doc.iconSize || flags.iconSize) || 80, 24);
        return this.#resolveRectangleShape(
            (Number(doc.x) || 0) - (size / 2),
            (Number(doc.y) || 0) - (size / 2),
            size,
            size,
            0,
            { hidden: !!doc.hidden }
        );
    }

    static #resolveRectangleShape(x, y, width, height, rotation = 0, { hidden = false } = {}) {
        const padding = Math.max(6, Math.min(14, Math.min(width, height) * 0.08));
        const expandedWidth = width + (padding * 2);
        const expandedHeight = height + (padding * 2);
        const center = { x: x + (width / 2), y: y + (height / 2) };
        const corners = this.#getRotatedCorners(center, expandedWidth, expandedHeight, rotation);
        const segmentLength = Math.max(10, Math.min(28, Math.min(expandedWidth, expandedHeight) * 0.24));

        return {
            corners,
            center,
            segmentLength,
            hidden
        };
    }

    static #getRotatedCorners(center, width, height, rotation = 0) {
        const radians = Math.toRadians ? Math.toRadians(Number(rotation) || 0) : ((Number(rotation) || 0) * Math.PI) / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        return [
            { x: -halfWidth, y: -halfHeight },
            { x: halfWidth, y: -halfHeight },
            { x: halfWidth, y: halfHeight },
            { x: -halfWidth, y: halfHeight }
        ].map(point => ({
            x: center.x + (point.x * cos) - (point.y * sin),
            y: center.y + (point.x * sin) + (point.y * cos)
        }));
    }

    static #drawGlow(graphics, shape) {
        graphics.lineStyle(5, GLOW_COLOR, 0.22);
        this.#drawPolygon(graphics, shape.corners);
        graphics.lineStyle(1, shape.hidden ? WARNING_COLOR : ACCENT_COLOR, 0.4);
        this.#drawPolygon(graphics, shape.corners);
    }

    static #drawCorners(graphics, shape) {
        const color = shape.hidden ? WARNING_COLOR : ACCENT_COLOR;
        graphics.lineStyle(2, color, 0.95);

        for (let index = 0; index < shape.corners.length; index += 1) {
            const corner = shape.corners[index];
            const previous = shape.corners[(index + shape.corners.length - 1) % shape.corners.length];
            const next = shape.corners[(index + 1) % shape.corners.length];
            this.#drawCornerSegment(graphics, corner, previous, shape.segmentLength);
            this.#drawCornerSegment(graphics, corner, next, shape.segmentLength);
        }
    }

    static #drawCornerSegment(graphics, corner, target, length) {
        const dx = target.x - corner.x;
        const dy = target.y - corner.y;
        const distance = Math.hypot(dx, dy);
        if (!distance) return;

        const ratio = Math.min(length / distance, 0.45);
        graphics.moveTo(corner.x, corner.y);
        graphics.lineTo(corner.x + (dx * ratio), corner.y + (dy * ratio));
    }

    static #drawPolygon(graphics, corners) {
        if (!corners.length) return;
        graphics.moveTo(corners[0].x, corners[0].y);
        for (const corner of corners.slice(1)) graphics.lineTo(corner.x, corner.y);
        graphics.lineTo(corners[0].x, corners[0].y);
    }
}
