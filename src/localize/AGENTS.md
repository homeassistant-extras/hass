# AGENTS.md - Localize

This folder contains the card localization engine used by custom cards.

- Cards register their JSON translations via `createLocalize()` in a thin wrapper.
- Cards keep translation JSON in their own `src/translations/` folder.
- Cards derive typed keys from English JSON via `TranslationKeysFrom<typeof en>` in `localize/types.ts`.
- Type editor `label` fields with `HaFormSchema<TranslationKey>` (or `HaFormSchemaFor<typeof en>` from `localize/ha-form.ts`). Default `HaFormSchema` keeps `label?: string` for HA core keys.
- Use `createComputeLabel(localize)` from `localize/ha-form.ts` for ha-form editors so `schema.label` is typed and no cast is needed.
- Keep localization helpers deterministic and easy to test.
- Preserve fallback behavior for missing languages or keys (user language → fallback language → key).
- Do not hard-code translated user-facing strings in card components when a localization path exists.
