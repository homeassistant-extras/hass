/**
 * https://github.com/home-assistant/frontend/blob/dev/src/state/more-info-mixin.ts
 */

import type { MoreInfoDialogParams } from "../dialogs/more-info/ha-more-info-dialog";

declare global {
  // for fire event
  interface HASSDomEvents {
    "hass-more-info": MoreInfoDialogParams;
  }
}
