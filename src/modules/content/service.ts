import { MedusaService } from "@medusajs/framework/utils"
import ContentPage from "./models/content-page"
import ContentBlock from "./models/content-block"

class ContentModuleService extends MedusaService({
  ContentPage,
  ContentBlock,
}) {}

export default ContentModuleService
