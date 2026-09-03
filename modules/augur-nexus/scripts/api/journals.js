import { JournalAssociationService } from "../features/connections/services/JournalAssociationService.js";

export async function getJournalPage(target) {
    return JournalAssociationService.getJournalPage(target);
}

export async function getOrCreateJournalPage(target) {
    return JournalAssociationService.getOrCreateJournalPage(target);
}

export async function openJournalPage(page, { edit = false } = {}) {
    return JournalAssociationService.openPage(page, { edit });
}
