const FilePicker = foundry.applications.apps.FilePicker.implementation;

const DEFAULT_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];

export class CustomImageFolderBrowser {
    static async browse({ source = "data", rootPath = "", currentPath = "", extensions = DEFAULT_IMAGE_EXTENSIONS } = {}) {
        const root = this.normalizePath(rootPath);
        if (!root) return this.#empty(root);

        const requested = this.normalizePath(currentPath || root);
        const current = this.isWithinRoot(requested, root) ? requested : root;

        try {
            const result = await FilePicker.browse(source || "data", current, { extensions });
            const folders = (result.dirs || [])
                .map(path => this.normalizePath(path))
                .filter(path => path && this.isWithinRoot(path, root))
                .sort((a, b) => this.labelFromPath(a).localeCompare(this.labelFromPath(b)))
                .map(path => ({
                    id: path,
                    path,
                    label: this.labelFromPath(path)
                }));

            const images = (result.files || [])
                .map(src => String(src || "").trim())
                .filter(Boolean)
                .sort((a, b) => this.labelFromPath(a).localeCompare(this.labelFromPath(b)))
                .map(src => ({
                    id: src,
                    src,
                    imageSrc: src,
                    label: this.labelFromPath(src)
                }));

            return {
                rootPath: root,
                currentPath: current,
                parentPath: this.parentPath(current, root),
                canGoUp: current !== root,
                folders,
                images
            };
        } catch (err) {
            console.warn("Augur: Nexus | Failed to browse custom image folder.", err);
            return this.#empty(root, current);
        }
    }

    static normalizePath(path = "") {
        return String(path || "")
            .replace(/\\/g, "/")
            .replace(/\/+/g, "/")
            .replace(/\/$/, "")
            .trim();
    }

    static isWithinRoot(path = "", rootPath = "") {
        const normalizedPath = this.normalizePath(path);
        const root = this.normalizePath(rootPath);
        return !!root && (normalizedPath === root || normalizedPath.startsWith(`${root}/`));
    }

    static parentPath(path = "", rootPath = "") {
        const normalizedPath = this.normalizePath(path);
        const root = this.normalizePath(rootPath);
        if (!this.isWithinRoot(normalizedPath, root) || normalizedPath === root) return root;
        const parent = normalizedPath.split("/").slice(0, -1).join("/");
        return this.isWithinRoot(parent, root) ? parent : root;
    }

    static labelFromPath(path = "") {
        return this.decode(String(path || "")
            .split(/[\\/]/)
            .pop()
            ?.replace(/\.[^.]+$/, "") || "Image");
    }

    static displayPath(path = "") {
        return this.decode(this.normalizePath(path));
    }

    static decode(value = "") {
        const normalized = String(value || "").replace(/\+/g, " ");
        try {
            return decodeURIComponent(normalized);
        } catch (_err) {
            return normalized;
        }
    }

    static #empty(rootPath = "", currentPath = "") {
        const root = this.normalizePath(rootPath);
        const current = this.normalizePath(currentPath || root);
        return {
            rootPath: root,
            currentPath: current,
            parentPath: root,
            canGoUp: false,
            folders: [],
            images: []
        };
    }
}
