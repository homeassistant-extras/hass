import { HassEntity } from '../src/ws/types';

/** Build {@link EntityState} from a full `entity_id` (e.g. `sensor.foo_bar`). */
export const createState = (
  entityId: string,
  state: string,
  attributes: Record<string, any> = {},
): HassEntity => {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: '0',
    last_updated: '0',
  };
};
