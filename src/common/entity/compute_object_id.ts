/**
 * https://github.com/home-assistant/frontend/blob/dev/src/common/entity/compute_object_id.ts
 */

/** Compute the object ID of a state. */
export const computeObjectId = (entityId: string): string =>
  entityId.slice(entityId.indexOf(".") + 1);
