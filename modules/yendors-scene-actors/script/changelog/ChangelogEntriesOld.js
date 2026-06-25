export default class ChangelogEntriesOld {

	static async init(changelog) {

		await changelog.addEntry({
			version: "1.0.0",
			title: {
				de: "Release-Version",
				en: "Release version"
			},
			body: {
				de: `\
                **Das Modul kommt mit folgenden Funktionen:**
                - Akteur-Selektor zum Hinzufügen oder Entfernen von Akteuren
                - Akteure werden auf der Spielfläche angezeigt
                - Akteure können in den Fokus gesetzt werden
                - Charakterbogen eines Akteurs kann im Selektor geöffnet werden
				`,
				en: `\
                **The module releases with the following features:**
                - Actor selector for adding or removing actors.
                - Actors are displayed on the playing surface
                - Actors can be placed in focus
                - Character sheet of an actor can be opened in the selector
                `
			}
		}).addEntry({
			version: "1.1.0",
			title: {
				de: "Spieler-Charaktere & Mehr Anzeige-Optionen",
				en: "Player characters & more display options"
			},
			body: {
				de: `\
                **Spieler-Charaktere**
                - SCs haben einen eigenen Listen-Bereich und werden für die komplette Spielwelt hinzugefügt: Für bestehende Szenen die SCs einfach entfernen und neu hinzufügen.
                - Die Anzeige des SceneActorsSelectors kann über die Icon-Toolbar nach SCs und NSCs gefiltert werden
                \n**Anzeige-Optionen über Icon-Toolbar (GM):**
                - Anzeige der Akteure für den eigenen Screen steuern
                - Anzeige der Akteure für die Spieler steuern
                - Größe der Akteur-Avatare ändern
                - Liste der SCs bzw. NSCs ein- und ausblenden
                \n**Toggle in der Figuren-Steuerung:**
                - GM: Aktivieren bzw. Deaktivieren der SceneActors für die Szene
                - Spieler: Temporäres ausblenden der Akteure. Sobald der GM einen neuen Akteuer anzeigt oder in den Fokus setzt, wird das temporäre Ausblenden deaktiviert.
                \n**Hot-Keys:**
                - ALT + SHIFT + S: Aktivieren bzw. Deaktivieren der SceneActors für die Szene (nur GM)
                - ALT + S: Akteure einblenden bzw. ausblenden
                - S: SceneActorsSelector minimieren bzw. maximieren (nur GM)
                - Die Tastenbelegung kann in den Einstellungen (Steuerung anpassen) geändert werden.
                \n**Akteure drehen & skalieren**
                - Über die Icon-Toolbar lassen sich die Akteure für eine Szene im gesamten verkleinern und vergrößern
                - Akteure auf der Spielfläche können per Klick vom Spielleiter gedreht werden
                - Dies kann nützlich sein, wenn Foudnry auf einem liegenden TV als Tabeltop verwendet wird.
                - Bugfix: Der Platz für die Kamera-Ansicht wird ab sofort reserviert und verdeckt die Akteure nicht mehr
                \n**Alternative Avatar-Ansicht:**
                - Neben dem vollflächig eingepassten Avatar kann das Bild auch komplett angezeigt werden
                - Rechtsklick auf das Anzeige-Icon im SceneActorsSelector
                - Rechtsklick auf den Avatar auf der Spielfläche
				`,
				en: `\
				**Player Characters**.
                - PCs have their own list area and are added for the entire game world: For existing scenes, simply remove the PCs and add new ones.
                - The SceneActorsSelector display can be filtered by SCs and NPCs via the icon toolbar
                \n**Display options via icon toolbar (GM):**
                - Control display of players for own screen
                - Control display of actors for the players
                - Change the size of the actor avatars
                - Show and hide the list of SCs or NPCs
                \n**Toggle in the figure control:**
                - GM: Activate or deactivate the SceneActors for the scene
                - Players: Temporarily hide the actors. As soon as the GM displays or focuses on a new actor, temporary hiding is disabled.
                \n**Hot-Keys:**
                - ALT + SHIFT + S: Activate or deactivate SceneActors for the scene (GM only)
                - ALT + S: Show or hide actors
                - S: Minimize or maximize SceneActorsSelector (GM only)
                - The key assignment can be changed in the settings (Customize control).
                \n**Rotate & scale actors**
                - Using the icon toolbar, the actors for a scene can be scaled down and up in their entirety
                - Actors on the playing surface can be rotated by the game master by clicking on them.
                - This can be useful when Foudnry is used as a tabeltop on a lying TV.
                - Bugfix: The space for the camera view is reserved from now on and does not cover the actors anymore
                \n**Alternative Avatar View:**
                - Besides the fully fitted avatar, the image can also be displayed completely
                - Right click on the display icon in the SceneActorsSelector
                - Right click on the avatar on the play area
                `
			}
		}).addEntry({
			version: '1.2.0',
			title: {
				de: 'TotM BattleActors (BETA), Akteur-Namen und Drag & Drop',
				en: 'TotM BattleActors (BETA), actor names and drag & drop'
			},
			body: {
				de: `\
                **TotM BattleActors als BETA für DSA (only) 5.1.0**
                - ACHTUNG: Um dieses Feature nutzen zu können, wird das System DSA in der Version 5.1.0 oder höher benötigt
                - Eine Battlemap kann in den Szenen-Einstellungen (Zahnrad im SceneActorsSelector) als solche gekennzeichnet werden.
                - Für eine TotM (Theatre Of The Mind)-Szene kann eine zugehörige Battlemap (ebenfalls in den Einstellungen) ausgewählt werden
                - Der Spielleiter kann für den Kampf weiterhin die Battlemap nutzen um den Überblick zu behalten und alle Akteure zu steuern
                - Die Spieler sind auf der anderen Szene und sehen z.B. ein Stimmungsbild und die Akteure, die and der Reihe sind.
                - Ein Guide für BattleActors folgt mit dem nächsten Update, wenn das Feature den BETA-Status verlässt.
                \n**Akteur-Namen**
                - Namen von Akteuren können für die Spieler ein- und ausgeblendet werden.
                \n**Drag & Drop**
                - Akteure können aus dem SceneActorsSelector auf die Spielfläche gezogen werden um einen Token zu erzeugen
                `,
				en: `\
				**TotM BattleActors as BETA for DSA (only) 5.1.0**
                - ATTENTION: To use this feature, the system DSA version 5.1.0 or higher is required.
                - A Battlemap can be marked as such in the scene settings (gear in SceneActorsSelector).
                - For a TotM (Theatre Of The Mind) scene a corresponding battlemap can be selected (also in the settings)
                - The game master can still use the battlemap for the fight to keep the overview and to control all actors
                - The players are on the other scene and see e.g. a mood picture and the actors who are on their turn.
                - A guide for BattleActors will follow with the next update when the feature leaves BETA status.
                \n**Actor Names**
                - Actor names can be shown and hidden to players.
                \n**Drag & Drop**
                - Actors can be dragged from the SceneActorsSelector onto the play area to create a token.
				`
			}
		})

		await changelog.build(true);
	}

}