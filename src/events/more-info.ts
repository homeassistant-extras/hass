import '@homeassistant-extras/hass/state/more-info-mixin';
import { fireEvent } from '../common/dom/fire_event';

/**
 * Opens the Home Assistant more-info dialog for an entity.
 */
export function moreInfo(
  target: HTMLElement,
  entityId: string | null | undefined,
): void {
  if (!entityId) {
    return;
  }

  fireEvent(target, 'hass-more-info', { entityId });
}
