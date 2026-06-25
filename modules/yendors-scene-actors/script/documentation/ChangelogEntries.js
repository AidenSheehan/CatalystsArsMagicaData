export const ChangelogEntries = [
	{
		version: '1.3.0',
		title: {
			de: "Akteure als Ziel & Items",
			en: "Actors as target & items"
		}
	},
	{
		version: '1.2.0',
		title: {
			de: "TotM BattleActors (BETA), Akteur-Namen und Drag & Drop",
			en: "TotM BattleActors (BETA), actor names and drag & drop"
		}
	},
	{
		version: '1.1.0',
		title: {
			de: "Spieler-Charaktere & Mehr Anzeige-Optionen",
			en: "Player characters & more display options"
		}
	},
	{
		version: '1.0.0',
		title: {
			de: "Release-Version",
			en: "Release version"
		}
	}
]

export const MinorChangesEntry = (version) => {
	return {
		version,
		content: {
			de: `Dieser Release beinhaltet kleinere Verbesserungen oder Bugfixes. Genauere Informationen finden sich im <a href="https://gitlab.com/yendors-vtt/yendors-scene-actors/-/releases/v${version}" target="_blank">GitLab-Changelog</a>.`,
			en: `This release contains minor improvements and bug fixes. More detailed information can be found in the <a href="https://gitlab.com/yendors-vtt/yendors-scene-actors/-/releases/v${version}" target="_blank">GitLabg changelog</a>.`,
		}
	}
}