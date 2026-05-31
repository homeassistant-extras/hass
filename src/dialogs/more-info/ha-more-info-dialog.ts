/**
 * https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/ha-more-info-dialog.ts
 */

export interface MoreInfoDialogParams {
  entityId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- upstream HA
  data?: Record<string, any>;
}
