import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import { DLocalProviderService } from "./service";

export default ModuleProvider(Modules.PAYMENT, {
  services: [DLocalProviderService],
});
