import { MedusaService } from "@medusajs/framework/utils"
import NavItem from "./models/nav-item"

class NavigationModuleService extends MedusaService({
  NavItem,
}) {}

export default NavigationModuleService
