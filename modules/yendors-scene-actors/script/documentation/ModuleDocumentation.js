import Documentation from "../../packages/documentation/Documentation.js";
import {ChangelogEntries} from "./ChangelogEntries.js";

export default class ModuleDocumentation extends Documentation {

	static changelogEntries = ChangelogEntries;

	static wrapperClass = 'scene-actors-selector-documentation';
}