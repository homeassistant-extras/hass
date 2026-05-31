import { getDevice } from "../../../src/delegates/retrievers/device";
import type { HomeAssistant } from "../../../src/types";
import { expect } from "chai";

describe("device.ts", () => {
  let mockHass: HomeAssistant;

  beforeEach(() => {
    mockHass = {
      devices: {
        "device-123": {
          id: "device-123",
          identifiers: [["litterrobot", "device-123"]],
          name: "Living Room Light",
          model: "LR5",
          serial_number: "LR5-12345",
          area_id: "area-123",
          manufacturer: "Whisker",
        } as HomeAssistant["devices"][string] & {
          area_id: string;
          manufacturer: string;
        },
      },
      entities: {},
      states: {},
      localize: () => "",
      connection: {} as HomeAssistant["connection"],
    };
  });

  describe("getDevice", () => {
    it("returns only DeviceRegistryEntry fields", () => {
      expect(getDevice(mockHass, "device-123")).to.deep.equal({
        id: "device-123",
        identifiers: [["litterrobot", "device-123"]],
        name: "Living Room Light",
        model: "LR5",
        serial_number: "LR5-12345",
      });
    });

    it("strips extra runtime properties from hass.devices", () => {
      const result = getDevice(mockHass, "device-123");
      expect(result).to.not.have.property("area_id");
      expect(result).to.not.have.property("manufacturer");
    });

    it("returns undefined when not found", () => {
      expect(getDevice(mockHass, "missing")).to.be.undefined;
    });
  });
});
