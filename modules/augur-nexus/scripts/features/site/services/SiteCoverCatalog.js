const ABSTRACT_COVERS = [
    {
        id: "world-1",
        name: "World 1",
        src: "modules/augur-nexus/assets/site_abstracts/World (1).webp"
    },
    {
        id: "world-2",
        name: "World 2",
        src: "modules/augur-nexus/assets/site_abstracts/World (2).webp"
    },
    {
        id: "world-3",
        name: "World 3",
        src: "modules/augur-nexus/assets/site_abstracts/World (3).webp"
    },
    {
        id: "world-4",
        name: "World 4",
        src: "modules/augur-nexus/assets/site_abstracts/World (4).webp"
    },
    {
        id: "world-5",
        name: "World 5",
        src: "modules/augur-nexus/assets/site_abstracts/World (5).webp"
    },
    {
        id: "world-6",
        name: "World 6",
        src: "modules/augur-nexus/assets/site_abstracts/World (6).webp"
    },
    {
        id: "world-7",
        name: "World 7",
        src: "modules/augur-nexus/assets/site_abstracts/World (7).webp"
    },
    {
        id: "world-8",
        name: "World 8",
        src: "modules/augur-nexus/assets/site_abstracts/World (8).webp"
    },
    {
        id: "world-9",
        name: "World 9",
        src: "modules/augur-nexus/assets/site_abstracts/World (9).webp"
    },
    {
        id: "world-10",
        name: "World 10",
        src: "modules/augur-nexus/assets/site_abstracts/World (10).webp"
    },
    {
        id: "world-11",
        name: "World 11",
        src: "modules/augur-nexus/assets/site_abstracts/World (11).webp"
    }
];

export class SiteCoverCatalog {
    static getIncludedCovers() {
        return ABSTRACT_COVERS.map(cover => ({ ...cover, thumb: cover.src }));
    }

    static getAbstractCover(seedValue = "site") {
        const covers = this.getIncludedCovers();
        const key = String(seedValue || "site");
        const seed = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return covers[seed % covers.length]?.src || covers[0]?.src || "";
    }

    static includes(src = "") {
        return this.getIncludedCovers().some(cover => cover.src === src);
    }
}
