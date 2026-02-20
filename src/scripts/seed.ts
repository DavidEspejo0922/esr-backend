// @ts-nocheck
import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * ESR Colombia Seed Script for Medusa v2
 * Creates regions, brands, device trees, products, content blocks, and sample reviews
 */
export default async function seedData({ container }: { container: MedusaContainer; args?: string[] }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

  logger.info("Starting ESR Colombia seed process...");

  try {
    // ============================================
    // 1. CREATE REGIONS
    // ============================================
    logger.info("Creating regions...");

    const regionModuleService = container.resolve("region");

    const [colombiaRegion, ecuadorRegion] = await Promise.all([
      regionModuleService.createRegions({
        name: "Colombia",
        currency_code: "cop",
        countries: ["co"],
        is_tax_inclusive: true,
        metadata: {
          description: "Colombia region with Colombian Peso",
        },
      }),
      regionModuleService.createRegions({
        name: "Ecuador",
        currency_code: "usd",
        countries: ["ec"],
        is_tax_inclusive: false,
        metadata: {
          description: "Ecuador region with US Dollar",
        },
      }),
    ]);

    logger.info(`Created regions: ${colombiaRegion.id}, ${ecuadorRegion.id}`);

    // ============================================
    // 2. CREATE ESR BRAND
    // ============================================
    logger.info("Creating ESR brand...");

    const brandModuleService = container.resolve("brand");

    const esrBrand = await brandModuleService.createBrands({
      name: "ESR",
      slug: "esr",
      logo_url: "https://cdn.esr.com/brand/logo.png",
      metadata: {
        description: "Premium mobile accessories for everyday life",
        founded: "2009",
        website: "https://www.esr.com",
      },
    });

    logger.info(`Created ESR brand: ${esrBrand.id}`);

    // ============================================
    // 3. CREATE DEVICE TREE (Apple & Samsung)
    // ============================================
    logger.info("Creating device manufacturers and models...");

    const deviceModuleService = container.resolve("device");

    // Apple Device Tree
    const appleBrand = await deviceModuleService.createDeviceBrands({
      name: "Apple",
      slug: "apple",
      logo_url: "https://cdn.esr.com/devices/apple-logo.png",
    });

    // iPhone 16 Series
    const iphone16Series = await deviceModuleService.createDeviceSeries({
      name: "iPhone 16 Series",
      slug: "iphone-16",
      device_brand_id: appleBrand.id,
    });

    const iphone16Models = await Promise.all([
      deviceModuleService.createDeviceModels({
        name: "iPhone 16",
        slug: "iphone-16",
        image_url: "https://cdn.esr.com/devices/iphone-16.png",
        device_series_id: iphone16Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "iPhone 16 Plus",
        slug: "iphone-16-plus",
        image_url: "https://cdn.esr.com/devices/iphone-16-plus.png",
        device_series_id: iphone16Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "iPhone 16 Pro",
        slug: "iphone-16-pro",
        image_url: "https://cdn.esr.com/devices/iphone-16-pro.png",
        device_series_id: iphone16Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "iPhone 16 Pro Max",
        slug: "iphone-16-pro-max",
        image_url: "https://cdn.esr.com/devices/iphone-16-pro-max.png",
        device_series_id: iphone16Series.id,
      }),
    ]);

    // iPhone 15 Series
    const iphone15Series = await deviceModuleService.createDeviceSeries({
      name: "iPhone 15 Series",
      slug: "iphone-15",
      device_brand_id: appleBrand.id,
    });

    const iphone15Models = await Promise.all([
      deviceModuleService.createDeviceModels({
        name: "iPhone 15",
        slug: "iphone-15",
        image_url: "https://cdn.esr.com/devices/iphone-15.png",
        device_series_id: iphone15Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "iPhone 15 Plus",
        slug: "iphone-15-plus",
        image_url: "https://cdn.esr.com/devices/iphone-15-plus.png",
        device_series_id: iphone15Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        image_url: "https://cdn.esr.com/devices/iphone-15-pro.png",
        device_series_id: iphone15Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        image_url: "https://cdn.esr.com/devices/iphone-15-pro-max.png",
        device_series_id: iphone15Series.id,
      }),
    ]);

    // iPad Series
    const iPadSeries = await deviceModuleService.createDeviceSeries({
      name: "iPad",
      slug: "ipad",
      device_brand_id: appleBrand.id,
    });

    const iPadModels = await Promise.all([
      deviceModuleService.createDeviceModels({
        name: "iPad Pro 12.9",
        slug: "ipad-pro-12-9",
        image_url: "https://cdn.esr.com/devices/ipad-pro-12-9.png",
        device_series_id: iPadSeries.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "iPad Air",
        slug: "ipad-air",
        image_url: "https://cdn.esr.com/devices/ipad-air.png",
        device_series_id: iPadSeries.id,
      }),
    ]);

    logger.info(`Created Apple devices: ${appleBrand.id}`);

    // Samsung Device Tree
    const samsungBrand = await deviceModuleService.createDeviceBrands({
      name: "Samsung",
      slug: "samsung",
      logo_url: "https://cdn.esr.com/devices/samsung-logo.png",
    });

    // Galaxy S25 Series
    const galaxyS25Series = await deviceModuleService.createDeviceSeries({
      name: "Galaxy S25 Series",
      slug: "galaxy-s25",
      device_brand_id: samsungBrand.id,
    });

    const galaxyS25Models = await Promise.all([
      deviceModuleService.createDeviceModels({
        name: "Galaxy S25",
        slug: "galaxy-s25",
        image_url: "https://cdn.esr.com/devices/galaxy-s25.png",
        device_series_id: galaxyS25Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "Galaxy S25+",
        slug: "galaxy-s25-plus",
        image_url: "https://cdn.esr.com/devices/galaxy-s25-plus.png",
        device_series_id: galaxyS25Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "Galaxy S25 Ultra",
        slug: "galaxy-s25-ultra",
        image_url: "https://cdn.esr.com/devices/galaxy-s25-ultra.png",
        device_series_id: galaxyS25Series.id,
      }),
    ]);

    // Galaxy S24 Series
    const galaxyS24Series = await deviceModuleService.createDeviceSeries({
      name: "Galaxy S24 Series",
      slug: "galaxy-s24",
      device_brand_id: samsungBrand.id,
    });

    const galaxyS24Models = await Promise.all([
      deviceModuleService.createDeviceModels({
        name: "Galaxy S24",
        slug: "galaxy-s24",
        image_url: "https://cdn.esr.com/devices/galaxy-s24.png",
        device_series_id: galaxyS24Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "Galaxy S24+",
        slug: "galaxy-s24-plus",
        image_url: "https://cdn.esr.com/devices/galaxy-s24-plus.png",
        device_series_id: galaxyS24Series.id,
      }),
      deviceModuleService.createDeviceModels({
        name: "Galaxy S24 Ultra",
        slug: "galaxy-s24-ultra",
        image_url: "https://cdn.esr.com/devices/galaxy-s24-ultra.png",
        device_series_id: galaxyS24Series.id,
      }),
    ]);

    logger.info(`Created Samsung devices: ${samsungBrand.id}`);

    // ============================================
    // 4. CREATE PRODUCTS WITH VARIANTS
    // ============================================
    logger.info("Creating products...");

    const productModuleService = container.resolve("product");

    // Product 1: Classic Hybrid Case - iPhone 16 Pro
    const classicHybridCase = await productModuleService.createProducts({
      title: "Classic Hybrid Case - iPhone 16 Pro",
      handle: "classic-hybrid-case-iphone-16-pro",
      description: "Military-grade protection with a sleek design. Features reinforced corners and raised edges for camera protection.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["Clear", "Black", "Blue"] },
      ],
      variants: [
        {
          title: "Clear",
          sku: "ESR-CHC-IP16P-CLR",
          manage_inventory: true,
          inventory_quantity: 100,
          options: { Color: "Clear" },
          prices: [
            { currency_code: "cop", amount: 89900 },
            { currency_code: "usd", amount: 24.99 },
          ],
        },
        {
          title: "Black",
          sku: "ESR-CHC-IP16P-BLK",
          manage_inventory: true,
          inventory_quantity: 150,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 89900 },
            { currency_code: "usd", amount: 24.99 },
          ],
        },
        {
          title: "Blue",
          sku: "ESR-CHC-IP16P-BLU",
          manage_inventory: true,
          inventory_quantity: 80,
          options: { Color: "Blue" },
          prices: [
            { currency_code: "cop", amount: 89900 },
            { currency_code: "usd", amount: 24.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/classic-hybrid-case-1.jpg" },
        { url: "https://cdn.esr.com/products/classic-hybrid-case-2.jpg" },
      ],
    });

    // Product 2: Air Armor Case - iPhone 16 Pro Max
    const airArmorCase = await productModuleService.createProducts({
      title: "Air Armor Case - iPhone 16 Pro Max",
      handle: "air-armor-case-iphone-16-pro-max",
      description: "Ultra-thin protection without the bulk. Precisely engineered for wireless charging compatibility.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["Matte Black", "Frosted Clear"] },
      ],
      variants: [
        {
          title: "Matte Black",
          sku: "ESR-AAC-IP16PM-MBK",
          manage_inventory: true,
          inventory_quantity: 120,
          options: { Color: "Matte Black" },
          prices: [
            { currency_code: "cop", amount: 99900 },
            { currency_code: "usd", amount: 27.99 },
          ],
        },
        {
          title: "Frosted Clear",
          sku: "ESR-AAC-IP16PM-FCL",
          manage_inventory: true,
          inventory_quantity: 90,
          options: { Color: "Frosted Clear" },
          prices: [
            { currency_code: "cop", amount: 99900 },
            { currency_code: "usd", amount: 27.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/air-armor-case-1.jpg" },
      ],
    });

    // Product 3: Kickstand Case - iPhone 15 Pro
    const kickstandCase = await productModuleService.createProducts({
      title: "Kickstand Case with MagSafe - iPhone 15 Pro",
      handle: "kickstand-case-magsafe-iphone-15-pro",
      description: "Built-in metal kickstand with 360-degree rotation. Compatible with all MagSafe accessories.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["Black", "Navy Blue"] },
      ],
      variants: [
        {
          title: "Black",
          sku: "ESR-KSC-IP15P-BLK",
          manage_inventory: true,
          inventory_quantity: 110,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 119900 },
            { currency_code: "usd", amount: 32.99 },
          ],
        },
        {
          title: "Navy Blue",
          sku: "ESR-KSC-IP15P-NVY",
          manage_inventory: true,
          inventory_quantity: 75,
          options: { Color: "Navy Blue" },
          prices: [
            { currency_code: "cop", amount: 119900 },
            { currency_code: "usd", amount: 32.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/kickstand-case-1.jpg" },
        { url: "https://cdn.esr.com/products/kickstand-case-2.jpg" },
      ],
    });

    // Product 4: Tempered Glass Screen Protector - iPhone 16 Series
    const screenProtector16 = await productModuleService.createProducts({
      title: "Armorite Screen Protector - iPhone 16 Series",
      handle: "armorite-screen-protector-iphone-16",
      description: "9H hardness tempered glass with oleophobic coating. Easy installation frame included.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Model", values: ["iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"] },
        { title: "Pack", values: ["Single", "2-Pack"] },
      ],
      variants: [
        {
          title: "iPhone 16 - Single",
          sku: "ESR-SP-IP16-1PK",
          manage_inventory: true,
          inventory_quantity: 200,
          options: { Model: "iPhone 16", Pack: "Single" },
          prices: [
            { currency_code: "cop", amount: 49900 },
            { currency_code: "usd", amount: 13.99 },
          ],
        },
        {
          title: "iPhone 16 - 2-Pack",
          sku: "ESR-SP-IP16-2PK",
          manage_inventory: true,
          inventory_quantity: 150,
          options: { Model: "iPhone 16", Pack: "2-Pack" },
          prices: [
            { currency_code: "cop", amount: 79900 },
            { currency_code: "usd", amount: 21.99 },
          ],
        },
        {
          title: "iPhone 16 Pro - Single",
          sku: "ESR-SP-IP16P-1PK",
          manage_inventory: true,
          inventory_quantity: 180,
          options: { Model: "iPhone 16 Pro", Pack: "Single" },
          prices: [
            { currency_code: "cop", amount: 49900 },
            { currency_code: "usd", amount: 13.99 },
          ],
        },
        {
          title: "iPhone 16 Pro Max - 2-Pack",
          sku: "ESR-SP-IP16PM-2PK",
          manage_inventory: true,
          inventory_quantity: 160,
          options: { Model: "iPhone 16 Pro Max", Pack: "2-Pack" },
          prices: [
            { currency_code: "cop", amount: 79900 },
            { currency_code: "usd", amount: 21.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/screen-protector-1.jpg" },
      ],
    });

    // Product 5: 3-in-1 MagSafe Charger
    const magsafeCharger = await productModuleService.createProducts({
      title: "HaloLock 3-in-1 MagSafe Charging Station",
      handle: "halolock-3in1-magsafe-charger",
      description: "Simultaneous charging for iPhone, Apple Watch, and AirPods. CryoBoost fast-charging technology.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["White", "Black"] },
      ],
      variants: [
        {
          title: "White",
          sku: "ESR-3IN1-WHT",
          manage_inventory: true,
          inventory_quantity: 60,
          options: { Color: "White" },
          prices: [
            { currency_code: "cop", amount: 299900 },
            { currency_code: "usd", amount: 79.99 },
          ],
        },
        {
          title: "Black",
          sku: "ESR-3IN1-BLK",
          manage_inventory: true,
          inventory_quantity: 55,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 299900 },
            { currency_code: "usd", amount: 79.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/3in1-charger-1.jpg" },
        { url: "https://cdn.esr.com/products/3in1-charger-2.jpg" },
      ],
    });

    // Product 6: Galaxy S25 Ultra Case
    const galaxyS25Case = await productModuleService.createProducts({
      title: "Military-Grade Case - Galaxy S25 Ultra",
      handle: "military-grade-case-galaxy-s25-ultra",
      description: "Triple-layer protection with air-guard corners. Built for the toughest conditions.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["Black", "Clear", "Smoke"] },
      ],
      variants: [
        {
          title: "Black",
          sku: "ESR-MGC-S25U-BLK",
          manage_inventory: true,
          inventory_quantity: 95,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 109900 },
            { currency_code: "usd", amount: 29.99 },
          ],
        },
        {
          title: "Clear",
          sku: "ESR-MGC-S25U-CLR",
          manage_inventory: true,
          inventory_quantity: 70,
          options: { Color: "Clear" },
          prices: [
            { currency_code: "cop", amount: 109900 },
            { currency_code: "usd", amount: 29.99 },
          ],
        },
        {
          title: "Smoke",
          sku: "ESR-MGC-S25U-SMK",
          manage_inventory: true,
          inventory_quantity: 60,
          options: { Color: "Smoke" },
          prices: [
            { currency_code: "cop", amount: 109900 },
            { currency_code: "usd", amount: 29.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/galaxy-s25-case-1.jpg" },
      ],
    });

    // Product 7: Galaxy S24 Screen Protector
    const galaxyS24Screen = await productModuleService.createProducts({
      title: "Full Coverage Screen Protector - Galaxy S24 Series",
      handle: "full-coverage-screen-protector-galaxy-s24",
      description: "Edge-to-edge protection with ultra-clear transparency. Case-friendly design.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Model", values: ["Galaxy S24", "Galaxy S24+", "Galaxy S24 Ultra"] },
      ],
      variants: [
        {
          title: "Galaxy S24",
          sku: "ESR-SP-S24",
          manage_inventory: true,
          inventory_quantity: 140,
          options: { Model: "Galaxy S24" },
          prices: [
            { currency_code: "cop", amount: 45900 },
            { currency_code: "usd", amount: 12.99 },
          ],
        },
        {
          title: "Galaxy S24+",
          sku: "ESR-SP-S24P",
          manage_inventory: true,
          inventory_quantity: 130,
          options: { Model: "Galaxy S24+" },
          prices: [
            { currency_code: "cop", amount: 45900 },
            { currency_code: "usd", amount: 12.99 },
          ],
        },
        {
          title: "Galaxy S24 Ultra",
          sku: "ESR-SP-S24U",
          manage_inventory: true,
          inventory_quantity: 120,
          options: { Model: "Galaxy S24 Ultra" },
          prices: [
            { currency_code: "cop", amount: 45900 },
            { currency_code: "usd", amount: 12.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/galaxy-s24-screen-1.jpg" },
      ],
    });

    // Product 8: USB-C Fast Charger
    const usbcCharger = await productModuleService.createProducts({
      title: "100W GaN USB-C Fast Charger",
      handle: "100w-gan-usbc-fast-charger",
      description: "4-port GaN charger with intelligent power distribution. Compact design for travel.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["White", "Black"] },
      ],
      variants: [
        {
          title: "White",
          sku: "ESR-100W-WHT",
          manage_inventory: true,
          inventory_quantity: 85,
          options: { Color: "White" },
          prices: [
            { currency_code: "cop", amount: 189900 },
            { currency_code: "usd", amount: 49.99 },
          ],
        },
        {
          title: "Black",
          sku: "ESR-100W-BLK",
          manage_inventory: true,
          inventory_quantity: 75,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 189900 },
            { currency_code: "usd", amount: 49.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/100w-charger-1.jpg" },
      ],
    });

    // Product 9: iPad Pro Case with Pencil Holder
    const iPadProCase = await productModuleService.createProducts({
      title: "Rebound Magnetic Case - iPad Pro 12.9",
      handle: "rebound-magnetic-case-ipad-pro",
      description: "Auto sleep/wake magnetic cover with multiple viewing angles. Apple Pencil holder included.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["Black", "Navy", "Rose Gold"] },
      ],
      variants: [
        {
          title: "Black",
          sku: "ESR-IPAD-PRO-BLK",
          manage_inventory: true,
          inventory_quantity: 50,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 149900 },
            { currency_code: "usd", amount: 39.99 },
          ],
        },
        {
          title: "Navy",
          sku: "ESR-IPAD-PRO-NVY",
          manage_inventory: true,
          inventory_quantity: 40,
          options: { Color: "Navy" },
          prices: [
            { currency_code: "cop", amount: 149900 },
            { currency_code: "usd", amount: 39.99 },
          ],
        },
        {
          title: "Rose Gold",
          sku: "ESR-IPAD-PRO-RG",
          manage_inventory: true,
          inventory_quantity: 35,
          options: { Color: "Rose Gold" },
          prices: [
            { currency_code: "cop", amount: 149900 },
            { currency_code: "usd", amount: 39.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/ipad-case-1.jpg" },
        { url: "https://cdn.esr.com/products/ipad-case-2.jpg" },
      ],
    });

    // Product 10: Car Mount
    const carMount = await productModuleService.createProducts({
      title: "HaloLock Magnetic Car Mount",
      handle: "halolock-magnetic-car-mount",
      description: "Strong magnetic hold with 360-degree rotation. Dashboard and vent mounting options.",
      is_giftcard: false,
      status: "published",
      variants: [
        {
          title: "Default",
          sku: "ESR-CAR-MOUNT",
          manage_inventory: true,
          inventory_quantity: 100,
          prices: [
            { currency_code: "cop", amount: 79900 },
            { currency_code: "usd", amount: 21.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/car-mount-1.jpg" },
      ],
    });

    // Product 11: Wallet Stand with MagSafe
    const walletStand = await productModuleService.createProducts({
      title: "HaloLock Wallet Stand with MagSafe",
      handle: "halolock-wallet-stand-magsafe",
      description: "Holds up to 3 cards with built-in kickstand. RFID protection included.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["Black", "Brown", "Navy"] },
      ],
      variants: [
        {
          title: "Black",
          sku: "ESR-WALLET-BLK",
          manage_inventory: true,
          inventory_quantity: 90,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 69900 },
            { currency_code: "usd", amount: 18.99 },
          ],
        },
        {
          title: "Brown",
          sku: "ESR-WALLET-BRN",
          manage_inventory: true,
          inventory_quantity: 65,
          options: { Color: "Brown" },
          prices: [
            { currency_code: "cop", amount: 69900 },
            { currency_code: "usd", amount: 18.99 },
          ],
        },
        {
          title: "Navy",
          sku: "ESR-WALLET-NVY",
          manage_inventory: true,
          inventory_quantity: 55,
          options: { Color: "Navy" },
          prices: [
            { currency_code: "cop", amount: 69900 },
            { currency_code: "usd", amount: 18.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/wallet-stand-1.jpg" },
      ],
    });

    // Product 12: USB-C Cable Bundle
    const cableBundle = await productModuleService.createProducts({
      title: "Braided USB-C Cable Bundle (3-Pack)",
      handle: "braided-usbc-cable-bundle",
      description: "Durable braided cables in 3ft, 6ft, and 10ft lengths. 480Mbps data transfer speed.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["Black", "White", "Gray"] },
      ],
      variants: [
        {
          title: "Black",
          sku: "ESR-CABLE-3PK-BLK",
          manage_inventory: true,
          inventory_quantity: 120,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 59900 },
            { currency_code: "usd", amount: 15.99 },
          ],
        },
        {
          title: "White",
          sku: "ESR-CABLE-3PK-WHT",
          manage_inventory: true,
          inventory_quantity: 100,
          options: { Color: "White" },
          prices: [
            { currency_code: "cop", amount: 59900 },
            { currency_code: "usd", amount: 15.99 },
          ],
        },
        {
          title: "Gray",
          sku: "ESR-CABLE-3PK-GRY",
          manage_inventory: true,
          inventory_quantity: 80,
          options: { Color: "Gray" },
          prices: [
            { currency_code: "cop", amount: 59900 },
            { currency_code: "usd", amount: 15.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/cable-bundle-1.jpg" },
      ],
    });

    // Product 13: Privacy Screen Protector
    const privacyScreen = await productModuleService.createProducts({
      title: "Privacy Screen Protector - iPhone 16 Pro",
      handle: "privacy-screen-protector-iphone-16-pro",
      description: "Protect your privacy with 28-degree viewing angle technology. Anti-spy tempered glass.",
      is_giftcard: false,
      status: "published",
      variants: [
        {
          title: "Default",
          sku: "ESR-PRIV-IP16P",
          manage_inventory: true,
          inventory_quantity: 75,
          prices: [
            { currency_code: "cop", amount: 69900 },
            { currency_code: "usd", amount: 18.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/privacy-screen-1.jpg" },
      ],
    });

    // Product 14: Wireless Power Bank
    const powerBank = await productModuleService.createProducts({
      title: "HaloLock 10000mAh Wireless Power Bank",
      handle: "halolock-10000mah-wireless-power-bank",
      description: "MagSafe-compatible wireless charging on the go. 20W USB-C fast charging port.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["Black", "White"] },
      ],
      variants: [
        {
          title: "Black",
          sku: "ESR-PB-10K-BLK",
          manage_inventory: true,
          inventory_quantity: 65,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 179900 },
            { currency_code: "usd", amount: 47.99 },
          ],
        },
        {
          title: "White",
          sku: "ESR-PB-10K-WHT",
          manage_inventory: true,
          inventory_quantity: 50,
          options: { Color: "White" },
          prices: [
            { currency_code: "cop", amount: 179900 },
            { currency_code: "usd", amount: 47.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/power-bank-1.jpg" },
      ],
    });

    // Product 15: AirPods Pro Case
    const airpodsCase = await productModuleService.createProducts({
      title: "Cloud-Soft Case for AirPods Pro 2",
      handle: "cloud-soft-case-airpods-pro-2",
      description: "Soft-touch silicone protection with carabiner clip. Wireless charging compatible.",
      is_giftcard: false,
      status: "published",
      options: [
        { title: "Color", values: ["Black", "White", "Lavender", "Mint"] },
      ],
      variants: [
        {
          title: "Black",
          sku: "ESR-AP-PRO2-BLK",
          manage_inventory: true,
          inventory_quantity: 110,
          options: { Color: "Black" },
          prices: [
            { currency_code: "cop", amount: 39900 },
            { currency_code: "usd", amount: 10.99 },
          ],
        },
        {
          title: "White",
          sku: "ESR-AP-PRO2-WHT",
          manage_inventory: true,
          inventory_quantity: 95,
          options: { Color: "White" },
          prices: [
            { currency_code: "cop", amount: 39900 },
            { currency_code: "usd", amount: 10.99 },
          ],
        },
        {
          title: "Lavender",
          sku: "ESR-AP-PRO2-LAV",
          manage_inventory: true,
          inventory_quantity: 70,
          options: { Color: "Lavender" },
          prices: [
            { currency_code: "cop", amount: 39900 },
            { currency_code: "usd", amount: 10.99 },
          ],
        },
        {
          title: "Mint",
          sku: "ESR-AP-PRO2-MNT",
          manage_inventory: true,
          inventory_quantity: 65,
          options: { Color: "Mint" },
          prices: [
            { currency_code: "cop", amount: 39900 },
            { currency_code: "usd", amount: 10.99 },
          ],
        },
      ],
      images: [
        { url: "https://cdn.esr.com/products/airpods-case-1.jpg" },
      ],
    });

    logger.info("Created 15 products with variants");

    const products = [
      classicHybridCase,
      airArmorCase,
      kickstandCase,
      screenProtector16,
      magsafeCharger,
      galaxyS25Case,
      galaxyS24Screen,
      usbcCharger,
      iPadProCase,
      carMount,
      walletStand,
      cableBundle,
      privacyScreen,
      powerBank,
      airpodsCase,
    ];

    // ============================================
    // 5. CREATE MODULE LINKS
    // ============================================
    logger.info("Creating module links...");

    // Link products to ESR brand (batch)
    await remoteLink.create(
      products.map((product) => ({
        product: {
          product_id: product.id,
        },
        brand: {
          brand_id: esrBrand.id,
        },
      }))
    );

    // Link products to device models (batch)
    const productDeviceLinks = [
      { product: classicHybridCase, deviceModel: iphone16Models[2] }, // iPhone 16 Pro
      { product: airArmorCase, deviceModel: iphone16Models[3] }, // iPhone 16 Pro Max
      { product: kickstandCase, deviceModel: iphone15Models[2] }, // iPhone 15 Pro
      { product: galaxyS25Case, deviceModel: galaxyS25Models[2] }, // Galaxy S25 Ultra
      { product: iPadProCase, deviceModel: iPadModels[0] }, // iPad Pro 12.9
    ];

    await remoteLink.create(
      productDeviceLinks.map((link) => ({
        product: {
          product_id: link.product.id,
        },
        device: {
          device_model_id: link.deviceModel.id,
        },
      }))
    );

    logger.info("Created module links for products");

    // ============================================
    // 6. CREATE CONTENT BLOCKS FOR HOME PAGE
    // ============================================
    logger.info("Creating content blocks...");

    const contentModuleService = container.resolve("content");

    // Create Home Page
    const homePage = await contentModuleService.createContentPages({
      title: "Home",
      slug: "home",
      locale: "es-CO",
      published: true,
    });

    // Hero Block
    await contentModuleService.createContentBlocks({
      type: "HERO",
      sort_order: 1,
      data: {
        title: "Protección Premium para tu Vida Digital",
        subtitle: "Descubre la nueva colección de fundas y accesorios ESR para iPhone 16 y Galaxy S25",
        cta_text: "Comprar Ahora",
        cta_link: "/products",
        background_image: "https://cdn.esr.com/hero/home-banner.jpg",
        overlay_opacity: 0.3,
      },
      medusa_handle: "home-hero",
      page_id: homePage.id,
    });

    // Featured Products Block
    await contentModuleService.createContentBlocks({
      type: "FEATURED_PRODUCTS",
      sort_order: 2,
      data: {
        title: "Productos Destacados",
        subtitle: "Los favoritos de nuestros clientes",
        product_ids: [
          classicHybridCase.id,
          magsafeCharger.id,
          galaxyS25Case.id,
          iPadProCase.id,
        ],
        layout: "grid",
      },
      medusa_handle: "home-featured",
      page_id: homePage.id,
    });

    // Banner Block (iPhone 16 Series)
    await contentModuleService.createContentBlocks({
      type: "BANNER",
      sort_order: 3,
      data: {
        title: "Nueva Serie iPhone 16",
        description: "Fundas diseñadas específicamente para la última generación de iPhone",
        cta_text: "Ver Colección",
        cta_link: "/collections/iphone-16",
        image: "https://cdn.esr.com/banners/iphone-16-collection.jpg",
        background_color: "#1a1a1a",
        text_color: "#ffffff",
      },
      medusa_handle: "home-iphone-16-banner",
      page_id: homePage.id,
    });

    // Features Block
    await contentModuleService.createContentBlocks({
      type: "RICH_TEXT",
      sort_order: 4,
      data: {
        title: "¿Por qué elegir ESR?",
        features: [
          {
            icon: "shield",
            title: "Protección Militar",
            description: "Certificación de caída militar para máxima seguridad",
          },
          {
            icon: "magnet",
            title: "Compatible con MagSafe",
            description: "Funciona perfectamente con todos los accesorios MagSafe",
          },
          {
            icon: "eco",
            title: "Materiales Sostenibles",
            description: "Fabricado con materiales reciclados y biodegradables",
          },
          {
            icon: "warranty",
            title: "Garantía de por Vida",
            description: "Garantía limitada de por vida en todos los productos",
          },
        ],
      },
      medusa_handle: "home-features",
      page_id: homePage.id,
    });

    // CTA Block
    await contentModuleService.createContentBlocks({
      type: "CTA",
      sort_order: 5,
      data: {
        title: "Únete a millones de clientes satisfechos",
        subtitle: "Más de 100 millones de productos vendidos en todo el mundo",
        cta_text: "Explorar Todos los Productos",
        cta_link: "/products",
        background_color: "#0066ff",
        text_color: "#ffffff",
      },
      medusa_handle: "home-cta",
      page_id: homePage.id,
    });

    logger.info(`Created home page with ${5} content blocks`);

    // ============================================
    // 7. CREATE SAMPLE REVIEWS
    // ============================================
    logger.info("Creating sample reviews...");

    const reviewModuleService = container.resolve("review");

    const reviews = [
      {
        product_id: classicHybridCase.id,
        author_name: "Carlos Mendez",
        rating: 5,
        title: "Excelente protección",
        body: "La mejor funda que he tenido. Protege perfectamente mi iPhone 16 Pro y se ve increíble. Los bordes elevados protegen la cámara sin problemas.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: classicHybridCase.id,
        author_name: "Ana Sofia Rodriguez",
        rating: 5,
        title: "Muy recomendada",
        body: "Llevo 3 meses usándola y está como nueva. La transparencia no se ha amarillado y ha resistido varias caídas sin ningún daño.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: magsafeCharger.id,
        author_name: "Diego Torres",
        rating: 5,
        title: "Carga rápida y eficiente",
        body: "Increíble estación de carga. Puedo cargar mi iPhone, Apple Watch y AirPods al mismo tiempo. Muy práctica y elegante.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: magsafeCharger.id,
        author_name: "Maria Fernanda Lopez",
        rating: 4,
        title: "Muy buena pero un poco cara",
        body: "Funciona perfectamente y es muy conveniente. El único punto en contra es el precio, pero la calidad lo justifica.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: galaxyS25Case.id,
        author_name: "Juan Pablo Ramirez",
        rating: 5,
        title: "Perfecta para el S25 Ultra",
        body: "Protección de grado militar real. Mi teléfono se cayó desde 2 metros y no pasó nada. 100% recomendada.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: screenProtector16.id,
        author_name: "Valentina Gomez",
        rating: 5,
        title: "Instalación súper fácil",
        body: "El marco de instalación hace que sea imposible ponerlo mal. Quedó perfecto sin burbujas a la primera. Muy satisfecha.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: screenProtector16.id,
        author_name: "Sebastian Castro",
        rating: 4,
        title: "Buena protección",
        body: "Protege bien la pantalla y no afecta la sensibilidad táctil. La única pega es que se ven un poco las huellas dactilares.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: usbcCharger.id,
        author_name: "Carolina Herrera",
        rating: 5,
        title: "Potente y compacto",
        body: "100W distribuidos en 4 puertos. Perfecto para viajes. Puedo cargar mi laptop, teléfono, tablet y AirPods simultáneamente.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: iPadProCase.id,
        author_name: "Andres Morales",
        rating: 5,
        title: "La mejor funda para iPad Pro",
        body: "El soporte magnético funciona perfectamente para ver películas. El porta lápiz es muy seguro y práctico.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: powerBank.id,
        author_name: "Camila Suarez",
        rating: 5,
        title: "Imprescindible para viajes",
        body: "La carga inalámbrica es súper conveniente. Ya no necesito cables. La batería dura todo el día sin problemas.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: airpodsCase.id,
        author_name: "Felipe Vargas",
        rating: 5,
        title: "Suave y protectora",
        body: "Material de muy buena calidad. El mosquetón es resistente y la funda protege perfectamente mis AirPods.",
        verified_purchase: true,
        approved: true,
      },
      {
        product_id: kickstandCase.id,
        author_name: "Daniela Rojas",
        rating: 5,
        title: "El kickstand es genial",
        body: "Ver videos es mucho más cómodo ahora. El soporte es muy firme y la funda no añade mucho grosor al teléfono.",
        verified_purchase: true,
        approved: true,
      },
    ];

    for (const review of reviews) {
      await reviewModuleService.createProductReviews(review);
    }

    logger.info(`Created ${reviews.length} product reviews`);

    // ============================================
    // 8. CREATE PRODUCT CATEGORIES
    // ============================================
    logger.info("Creating product categories...");

    const fundasCategory = await productModuleService.createProductCategories({
      name: "Fundas y Estuches",
      handle: "fundas-estuches",
      description: "Fundas protectoras para smartphones y tablets",
      is_active: true,
      is_internal: false,
      rank: 0,
    });

    const protectoresCategory = await productModuleService.createProductCategories({
      name: "Protectores de Pantalla",
      handle: "protectores-pantalla",
      description: "Protectores de vidrio templado y film para tus dispositivos",
      is_active: true,
      is_internal: false,
      rank: 1,
    });

    const cargadoresCategory = await productModuleService.createProductCategories({
      name: "Cargadores",
      handle: "cargadores",
      description: "Cargadores inalambricos, USB-C y power banks",
      is_active: true,
      is_internal: false,
      rank: 2,
    });

    const accesoriosCategory = await productModuleService.createProductCategories({
      name: "Accesorios",
      handle: "accesorios",
      description: "Cables, soportes, wallets y mas accesorios para tus dispositivos",
      is_active: true,
      is_internal: false,
      rank: 3,
    });

    // Assign products to categories
    const categoryAssignments = [
      // Cases
      { productId: classicHybridCase.id, categoryId: fundasCategory.id },
      { productId: airArmorCase.id, categoryId: fundasCategory.id },
      { productId: kickstandCase.id, categoryId: fundasCategory.id },
      { productId: galaxyS25Case.id, categoryId: fundasCategory.id },
      { productId: iPadProCase.id, categoryId: fundasCategory.id },
      { productId: airpodsCase.id, categoryId: fundasCategory.id },
      // Screen protectors
      { productId: screenProtector16.id, categoryId: protectoresCategory.id },
      { productId: galaxyS24Screen.id, categoryId: protectoresCategory.id },
      { productId: privacyScreen.id, categoryId: protectoresCategory.id },
      // Chargers
      { productId: magsafeCharger.id, categoryId: cargadoresCategory.id },
      { productId: usbcCharger.id, categoryId: cargadoresCategory.id },
      { productId: powerBank.id, categoryId: cargadoresCategory.id },
      // Accessories
      { productId: carMount.id, categoryId: accesoriosCategory.id },
      { productId: walletStand.id, categoryId: accesoriosCategory.id },
      { productId: cableBundle.id, categoryId: accesoriosCategory.id },
    ];

    for (const { productId, categoryId } of categoryAssignments) {
      await productModuleService.updateProducts(productId, {
        categories: [{ id: categoryId }],
      });
    }

    logger.info("Created 4 categories and assigned 15 products");

    // ============================================
    // 9. CREATE NAVIGATION ITEMS
    // ============================================
    logger.info("Creating navigation items...");

    const navigationService = container.resolve("navigation");

    // --- HEADER navigation ---
    await navigationService.createNavItems({
      label: "Productos",
      slug: "productos",
      url: "/products",
      position: "HEADER",
      sort_order: 1,
      source_type: "CUSTOM_URL",
      is_visible: true,
    });

    await navigationService.createNavItems({
      label: "Apple",
      slug: "apple",
      url: "/apple",
      position: "HEADER",
      sort_order: 2,
      source_type: "DEVICE_BRAND",
      source_id: appleBrand.id,
      is_visible: true,
    });

    await navigationService.createNavItems({
      label: "Samsung",
      slug: "samsung",
      url: "/samsung",
      position: "HEADER",
      sort_order: 3,
      source_type: "DEVICE_BRAND",
      source_id: samsungBrand.id,
      is_visible: true,
    });

    await navigationService.createNavItems({
      label: "Accesorios",
      slug: "accesorios",
      url: "/c/accesorios",
      position: "HEADER",
      sort_order: 4,
      source_type: "PRODUCT_CATEGORY",
      source_id: accesoriosCategory.id,
      is_visible: true,
    });

    // --- FOOTER navigation ---
    const footerGroups = [
      {
        label: "Productos",
        slug: "footer-productos",
        sort_order: 1,
        children: [
          { label: "Para iPhone", url: "/apple" },
          { label: "Para iPad", url: "/apple" },
          { label: "Para Samsung", url: "/samsung" },
          { label: "Accesorios", url: "/c/accesorios" },
          { label: "Nuevos Productos", url: "/products" },
        ],
      },
      {
        label: "Soporte",
        slug: "footer-soporte",
        sort_order: 2,
        children: [
          { label: "Centro de Ayuda", url: "/soporte" },
          { label: "Seguimiento de Pedido", url: "/soporte/seguimiento" },
          { label: "Envios y Devoluciones", url: "/soporte/envios" },
          { label: "Garantia", url: "/soporte/garantia" },
          { label: "Contacto", url: "/contacto" },
        ],
      },
      {
        label: "Empresa",
        slug: "footer-empresa",
        sort_order: 3,
        children: [
          { label: "Sobre ESR", url: "/sobre-nosotros" },
          { label: "Blog", url: "/blog" },
          { label: "Carreras", url: "/carreras" },
          { label: "Sostenibilidad", url: "/sostenibilidad" },
        ],
      },
      {
        label: "Legal",
        slug: "footer-legal",
        sort_order: 4,
        children: [
          { label: "Terminos y Condiciones", url: "/legal/terminos" },
          { label: "Politica de Privacidad", url: "/legal/privacidad" },
          { label: "Politica de Cookies", url: "/legal/cookies" },
          { label: "Politica de Devoluciones", url: "/legal/devoluciones" },
        ],
      },
    ];

    for (const group of footerGroups) {
      const parent = await navigationService.createNavItems({
        label: group.label,
        slug: group.slug,
        position: "FOOTER",
        sort_order: group.sort_order,
        source_type: "CUSTOM_URL",
        is_visible: true,
      });

      for (let i = 0; i < group.children.length; i++) {
        const child = group.children[i];
        await navigationService.createNavItems({
          label: child.label,
          slug: `${group.slug}-${i}`,
          url: child.url,
          position: "FOOTER",
          sort_order: i + 1,
          parent_id: parent.id,
          source_type: "CUSTOM_URL",
          is_visible: true,
        });
      }
    }

    logger.info("Created header and footer navigation items");

    // ============================================
    // SEED COMPLETE
    // ============================================
    logger.info("ESR Colombia seed process completed successfully!");
    logger.info(`Summary:
      - Regions: 2 (Colombia COP, Ecuador USD)
      - Brand: 1 (ESR)
      - Device Brands: 2 (Apple, Samsung)
      - Device Series: 5 (iPhone 16, iPhone 15, iPad, Galaxy S25, Galaxy S24)
      - Device Models: 18
      - Products: 15 with multiple variants
      - Product Categories: 4 (Fundas, Protectores, Cargadores, Accesorios)
      - Content Pages: 1 (Home)
      - Content Blocks: 5
      - Product Reviews: ${reviews.length}
      - Navigation Items: 4 header + 4 footer groups with children
      - Module Links: Created for products ↔ brands and products ↔ devices
    `);

  } catch (error) {
    logger.error("Error during seed process:", error);
    throw error;
  }
}
