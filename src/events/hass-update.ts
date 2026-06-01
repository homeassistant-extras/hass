import type { HassUpdateEvent } from '../mixins/hass-update-mixin';

declare global {
  interface HASSDomEvents {
    'hass-update': HassUpdateEvent;
  }
}
