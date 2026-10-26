export type DatePickerMessages = { chooseDate: string; previousMonth: string; nextMonth: string; today: string; clear: string; close: string; unavailable: string; keyboardHelp: string };
const en: DatePickerMessages = { chooseDate: "Choose date", previousMonth: "Previous month", nextMonth: "Next month", today: "Today", clear: "Clear", close: "Close", unavailable: "No dates available", keyboardHelp: "Arrows move by day/week. Page Up/Down changes month; Shift changes year. Enter selects; Escape closes." };
const translations: Record<string, DatePickerMessages> = {
  en,
  it: { chooseDate: "Scegli una data", previousMonth: "Mese precedente", nextMonth: "Mese successivo", today: "Oggi", clear: "Cancella", close: "Chiudi", unavailable: "Nessuna data disponibile", keyboardHelp: "Le frecce cambiano giorno/settimana. Pagina su/giù cambia mese; Maiusc cambia anno. Invio seleziona; Esc chiude." },
  fr: { chooseDate: "Choisir une date", previousMonth: "Mois précédent", nextMonth: "Mois suivant", today: "Aujourd’hui", clear: "Effacer", close: "Fermer", unavailable: "Aucune date disponible", keyboardHelp: "Les flèches changent le jour/semaine. Page précédente/suivante change le mois ; Maj l’année. Entrée sélectionne ; Échap ferme." },
  de: { chooseDate: "Datum wählen", previousMonth: "Vorheriger Monat", nextMonth: "Nächster Monat", today: "Heute", clear: "Löschen", close: "Schließen", unavailable: "Keine Daten verfügbar", keyboardHelp: "Pfeiltasten wechseln Tag/Woche. Bild auf/ab wechselt den Monat; Umschalt das Jahr. Eingabe wählt; Escape schließt." },
  es: { chooseDate: "Elegir fecha", previousMonth: "Mes anterior", nextMonth: "Mes siguiente", today: "Hoy", clear: "Borrar", close: "Cerrar", unavailable: "No hay fechas disponibles", keyboardHelp: "Las flechas cambian día/semana. Re Pág/Av Pág cambia el mes; Mayús el año. Intro selecciona; Escape cierra." },
  ar: { chooseDate: "اختر تاريخًا", previousMonth: "الشهر السابق", nextMonth: "الشهر التالي", today: "اليوم", clear: "مسح", close: "إغلاق", unavailable: "لا توجد تواريخ متاحة", keyboardHelp: "الأسهم تغيّر اليوم أو الأسبوع. Page Up/Down يغيّران الشهر، ومع Shift السنة. Enter للاختيار وEscape للإغلاق." },
  ja: { chooseDate: "日付を選択", previousMonth: "前の月", nextMonth: "次の月", today: "今日", clear: "クリア", close: "閉じる", unavailable: "選択できる日付はありません", keyboardHelp: "矢印キーで日や週を移動。Page Up/Downで月、Shiftで年を変更。Enterで選択、Escapeで閉じます。" },
};
export function resolveDateLocale(preferences: readonly string[], fallback = "en-US") {
  for (const candidate of [...preferences, fallback, "en-US"]) {
    try { const supported = Intl.DateTimeFormat.supportedLocalesOf(candidate); if (supported.length) return new Intl.DateTimeFormat(supported[0]).resolvedOptions().locale; } catch { /* Try next preference. */ }
  }
  return "en-US";
}
export function dateLocaleInfo(locale: string) {
  const language = new Intl.Locale(locale);
  const info = language as Intl.Locale & { getWeekInfo?: () => { firstDay: number }; weekInfo?: { firstDay: number }; getTextInfo?: () => { direction: "ltr" | "rtl" }; textInfo?: { direction: "ltr" | "rtl" } };
  const region = language.maximize().region;
  const firstDay = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay ?? (region && ["US", "CA", "JP", "PH", "TW"].includes(region) ? 7 : region && ["AF", "IR"].includes(region) ? 6 : 1);
  return { weekStartsOn: (firstDay % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6, direction: info.getTextInfo?.().direction ?? info.textInfo?.direction ?? (["ar", "fa", "he", "ur", "ps", "dv"].includes(language.language) ? "rtl" : "ltr"), messages: translations[language.language] ?? en };
}
