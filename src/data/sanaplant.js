// Klient: Sanaplant — dáta extrahované z mesačných reportov 2/2025 – 6/2026.
// Hodnoty null = metrika v danom mesiaci nebola v reporte dostupná
// (napr. Google Ads bežali až od apríla 2025, v decembri 2025 boli vypnuté).

const sanaplant = {
  id: 'sanaplant',
  name: 'Sanaplant',
  businessType: 'ecommerce',
  currency: '€',
  metaBreakdown: 'ads',
  googleConversionKeys: ['add_to_cart', 'begin_checkout', 'purchase'],
  metaAdsProfile: 'eshop',
  eshopTab: 'woocommerce',
  notes: [
    'Google Ads kampane bežali od apríla 2025 (produktové PMax od 14. júla 2025). V decembri 2025 boli Google Ads vypnuté.',
    'Za február 2025 nie sú v reporte dostupné celkové tržby e-shopu.',
    'Hodnoty nákupov za október – december 2025 sú mierne podhodnotené: pre technickú chybu sa nezaznamenala plná hodnota niektorých objednávok Encyklopédie.',
    'Od roku 2026 je boosting súčasťou Meta Ads kampaní (v prehľade Meta je už započítaný), samostatná metrika boostingu sa preto od 1/2026 nevykazuje.',
    'Vo februári 2026 report vykazuje extrémnu platenú návštevnosť (242 tis. relácií s mierou interakcie 2 %) — pravdepodobne nekvalitná/bot návštevnosť z kampaní.',
    'Od 2026 Mailchimp tržby nezahŕňajú publikum Blumeria Consulting (Alchem) — reálne tržby z e-mailov môžu byť vyššie.',
    'GA4 CSV exporty (traffic/user acquisition, landing page, e-commerce) — január až jún 2026. Staršie mesiace majú platenú vs. organickú návštevnosť z PDF reportu.',
  ],

  // Mesiace zoradené chronologicky: 2/2025 … 6/2026
  months: [
    {
      year: 2025, month: 2,
      meta: {
        spend: 765.95, impressions: 464448, reach: 125115, clicks: 8877,
        purchases: 88, purchaseValue: 2730.58, roas: 3.56, addToCart: 346,
        cpc: 0.09, costPerPurchase: 8.7,
        campaigns: [
          { name: 'Frigomax', spend: 517.11, clicks: 7907, purchases: 81, value: 2463.08, roas: 4.76 },
          { name: 'Minigarden', spend: 96.15, clicks: 748, purchases: 0, value: 0, roas: 0 },
          { name: 'HydroHumat', spend: 42.37, clicks: 222, purchases: 2, value: 121.05, roas: 2.86 },
        ],
      },
      boosting: { spend: 110.32, interactions: 1475, purchases: 5, value: 146.45 },
      google: null,
      ga: {
        paid: { sessions: 6751, users: 6032, engagementRate: 41.28, avgDuration: '00:15:25' },
        organic: { sessions: 7637, users: 6495, engagementRate: 48.67, avgDuration: '00:09:04' },
      },
      email: {
        sent: 27587, openRate: 20.94, clickRate: 1.02, uniqueClicks: 347,
        unsubRate: 0.28, orders: 20, revenue: 319.12, campaignsCount: 9,
      },
      eshop: { revenue: null, items: null, orders: null },
    },
    {
      year: 2025, month: 3,
      meta: {
        spend: 1525.26, impressions: 491576, reach: 118649, clicks: 6896,
        purchases: 188, purchaseValue: 7147.18, roas: 4.69, addToCart: null,
        cpc: 0.22, costPerPurchase: 8.11,
        campaigns: [
          { name: 'Frigomax', spend: 928.07, clicks: 4748, purchases: 153, value: 4839.39, roas: 5.21 },
          { name: 'HydroHumat', spend: 217.8, clicks: 728, purchases: 13, value: 674.86, roas: 3.1 },
          { name: 'Sadbové zemiaky', spend: 65.74, clicks: 806, purchases: 17, value: 991.57, roas: 15.08 },
          { name: 'Všeobecná Sanaplant', spend: 105.6, clicks: 246, purchases: 1, value: 32.13, roas: 0.3 },
          { name: 'Katalóg produktov', spend: 208.05, clicks: 368, purchases: 4, value: 609.23, roas: 2.93 },
        ],
      },
      boosting: { spend: 143.18, interactions: 1691, purchases: 3, value: 112.21 },
      google: null,
      ga: {
        paid: { sessions: 6587, users: 5520, engagementRate: 52.92, avgDuration: '00:22:00' },
        organic: { sessions: 5934, users: 4679, engagementRate: 56.39, avgDuration: '00:16:18' },
      },
      email: {
        sent: 15731, openRate: 17.34, clickRate: 1.42, uniqueClicks: 273,
        unsubRate: 0.26, orders: 54, revenue: 989.5, campaignsCount: 7,
      },
      eshop: { revenue: 22563.8, items: null, orders: null },
    },
    {
      year: 2025, month: 4,
      meta: {
        spend: 1310.61, impressions: 513862, reach: 141787, clicks: 6360,
        purchases: 33, purchaseValue: 2449.47, roas: 1.87, addToCart: 267,
        cpc: 0.21, costPerPurchase: 39.72,
        campaigns: [
          { name: 'Katalóg produktov', spend: 566.98, clicks: 2238, purchases: 19, value: 1545.65, roas: 2.73 },
          { name: 'Všeobecná Sanaplant', spend: 184.51, clicks: 467, purchases: 5, value: 441.48, roas: 2.39 },
          { name: 'Vybrané produkty', spend: 168.64, clicks: 1419, purchases: 1, value: 91.96, roas: 0.55 },
          { name: 'Šikovný gazda', spend: 97.2, clicks: 523, purchases: 0, value: 0, roas: 0 },
          { name: 'Silva Tabs', spend: 97.0, clicks: 442, purchases: 3, value: 255.46, roas: 2.63 },
          { name: 'Gunner', spend: 97.0, clicks: 672, purchases: 1, value: 136.74, roas: 1.41 },
          { name: 'HydroHumat', spend: 96.45, clicks: 656, purchases: 3, value: 46.17, roas: 0.48 },
          { name: 'Sanaplant (dosah)', spend: 50.72, clicks: null, purchases: 2, value: 23.97, roas: 0.47 },
          { name: 'Manychat (zber e-mailov)', spend: 27.11, clicks: null, purchases: null, value: null, roas: null },
          { name: 'Sadbové zemiaky', spend: 1.84, clicks: 16, purchases: 0, value: 0, roas: 0 },
        ],
      },
      boosting: { spend: 94.05, interactions: 8139, purchases: 1, value: 23.97 },
      google: {
        spend: 79.2, impressions: 40342, clicks: 387, cpc: 0.2, ctr: 0.96,
        purchases: 1, purchaseValue: 105.38, conversions: 94,
        campaigns: [
          { name: 'Search (brand)', spend: 33.87, clicks: 102, purchases: 1, value: 105.38 },
          { name: 'Display – Remarketing', spend: 45.32, clicks: 285, purchases: 0, value: 0 },
        ],
      },
      ga: {
        paid: { sessions: 8213, users: 6287, engagementRate: 55.22, avgDuration: '00:20:07' },
        organic: { sessions: 5266, users: 3926, engagementRate: 56.23, avgDuration: '00:10:21' },
      },
      email: {
        sent: 2900, openRate: 24.38, clickRate: 1.9, uniqueClicks: 44,
        unsubRate: 0.0, orders: 2, revenue: 175.77, campaignsCount: 3,
      },
      eshop: { revenue: 25343.49, items: 502, orders: null },
    },
    {
      year: 2025, month: 5,
      meta: {
        spend: 1479.91, impressions: 659328, reach: 195510, clicks: 11374,
        purchases: 78, purchaseValue: 2784.83, roas: 1.88, addToCart: 369,
        cpc: 0.13, costPerPurchase: 18.97,
        campaigns: [
          { name: 'Katalóg produktov', spend: 596.39, clicks: 2190, purchases: 41, value: 1724.34, roas: 2.26 },
          { name: 'Šikovný gazda', spend: 258.76, clicks: 5618, purchases: 19, value: 523.11, roas: 0.87 },
          { name: 'Vybrané produkty', spend: 170.73, clicks: 702, purchases: 6, value: 163.08, roas: 0.96 },
          { name: 'HydroHumat', spend: 139.57, clicks: 1997, purchases: 0, value: 0, roas: 0 },
          { name: 'Silva Tabs', spend: 137.74, clicks: 254, purchases: 10, value: 239.88, roas: 2.72 },
          { name: 'QUANTUM', spend: 97.27, clicks: 250, purchases: 2, value: 134.42, roas: 1.38 },
          { name: 'Gunner', spend: 41.47, clicks: 293, purchases: 0, value: 0, roas: 0 },
          { name: 'Všeobecná Sanaplant', spend: 37.98, clicks: 70, purchases: 0, value: 0, roas: 0 },
          { name: 'Manychat (zber e-mailov)', spend: 26.32, clicks: null, purchases: null, value: null, roas: null },
        ],
      },
      boosting: { spend: 155.66, interactions: 1472, purchases: 0, value: 0 },
      google: {
        spend: 68.36, impressions: 18127, clicks: 273, cpc: 0.25, ctr: 1.51,
        purchases: 8, purchaseValue: 661.4, conversions: 41.91,
        campaigns: [
          { name: 'Search (brand)', spend: 51.22, clicks: 141, purchases: 8, value: 661.4 },
          { name: 'Display – Remarketing', spend: 17.14, clicks: 132, purchases: 0, value: 0 },
        ],
      },
      ga: {
        paid: { sessions: 9346, users: 7755, engagementRate: 56.47, avgDuration: '00:16:34' },
        organic: { sessions: 7214, users: 5423, engagementRate: 59.52, avgDuration: '00:08:37' },
      },
      email: {
        sent: 14603, openRate: 20.14, clickRate: 2.13, uniqueClicks: 400,
        unsubRate: 0.0, orders: 3, revenue: 174.37, campaignsCount: 4,
      },
      eshop: { revenue: 20687.03, items: 355, orders: null },
    },
    {
      year: 2025, month: 6,
      meta: {
        spend: 1396.71, impressions: 438012, reach: 124906, clicks: 5129,
        purchases: 43, purchaseValue: 2640.79, roas: 1.89, addToCart: 209,
        cpc: 0.27, costPerPurchase: 32.48,
        campaigns: [
          { name: 'Katalóg produktov', spend: 793.41, clicks: 2463, purchases: 28, value: 1576.79, roas: 1.99 },
          { name: 'Vybrané produkty', spend: 477.91, clicks: 782, purchases: 13, value: 998.37, roas: 2.09 },
          { name: 'Traffic kampane', spend: 125.39, clicks: 1884, purchases: 2, value: 65.63, roas: 0.52 },
          { name: 'Manychat (zber e-mailov)', spend: 60.99, clicks: null, purchases: null, value: null, roas: null },
        ],
      },
      boosting: { spend: 141.84, interactions: 1150, purchases: 2, value: 289.51 },
      google: {
        spend: 8.48, impressions: 75, clicks: 32, cpc: 0.27, ctr: 42.67,
        purchases: 4, purchaseValue: 1230.46, conversions: 14,
        campaigns: [
          { name: 'Search (brand)', spend: 8.48, clicks: 32, purchases: 4, value: 1230.46 },
        ],
      },
      ga: {
        paid: { sessions: 12969, users: 11585, engagementRate: 28.66, avgDuration: '00:08:33' },
        organic: { sessions: 3813, users: 3072, engagementRate: 60.01, avgDuration: '00:08:51' },
      },
      email: {
        sent: 14972, openRate: 17.78, clickRate: 0.61, uniqueClicks: 65,
        unsubRate: 0.0, orders: 1, revenue: 54.49, campaignsCount: 4,
      },
      eshop: { revenue: 19548.73, items: 347, orders: null },
    },
    {
      year: 2025, month: 7,
      meta: {
        spend: 668.28, impressions: 287163, reach: 70920, clicks: 3224,
        purchases: 23, purchaseValue: 1073.36, roas: 1.61, addToCart: 146,
        cpc: 0.21, costPerPurchase: 29.06,
        campaigns: [
          { name: 'Katalóg produktov', spend: 462.37, clicks: 2093, purchases: 19, value: 894.48, roas: 1.93 },
          { name: 'Vybrané produkty', spend: 141.19, clicks: 296, purchases: 4, value: 178.88, roas: 1.27 },
          { name: 'Traffic kampane', spend: 39.99, clicks: 630, purchases: 0, value: 0, roas: 0 },
        ],
      },
      boosting: { spend: 24.73, interactions: 674, purchases: 0, value: 0 },
      google: {
        spend: 359.34, impressions: 105255, clicks: 2745, cpc: 0.13, ctr: 2.61,
        purchases: 30, purchaseValue: 1518.92, conversions: 30,
        campaigns: [
          { name: 'PMax – produkty', spend: 359.34, clicks: 2745, purchases: 30, value: 1518.92 },
        ],
      },
      ga: {
        paid: { sessions: 4288, users: 3826, engagementRate: 52.92, avgDuration: '00:15:48' },
        organic: { sessions: 4142, users: 3450, engagementRate: 61.83, avgDuration: '00:12:59' },
      },
      email: {
        sent: 10155, openRate: 20.95, clickRate: 1.99, uniqueClicks: 146,
        unsubRate: 0.0, orders: 0, revenue: 0, campaignsCount: 3,
      },
      eshop: { revenue: 11142.91, items: 284, orders: null },
    },
    {
      year: 2025, month: 8,
      meta: {
        spend: 223.96, impressions: 134802, reach: 47126, clicks: 1795,
        purchases: 6, purchaseValue: 461.57, roas: 2.06, addToCart: 48,
        cpc: 0.12, costPerPurchase: 37.33,
        campaigns: [
          { name: 'Katalóg produktov', spend: 101.83, clicks: 560, purchases: 4, value: 375.92, roas: 3.69 },
          { name: 'Traffic kampane', spend: 59.94, clicks: 887, purchases: 0, value: 0, roas: 0 },
        ],
      },
      boosting: { spend: 62.19, interactions: 1596, purchases: 2, value: 85.65 },
      google: {
        spend: 615.48, impressions: 177911, clicks: 3550, cpc: 0.17, ctr: 2.0,
        purchases: 11, purchaseValue: 1725.29, conversions: 11,
        campaigns: [
          { name: 'PMax – produkty', spend: 615.48, clicks: 3550, purchases: 11, value: 1725.29 },
        ],
      },
      ga: {
        paid: { sessions: 2773, users: 2432, engagementRate: 56.69, avgDuration: '00:15:53' },
        organic: { sessions: 3842, users: 3175, engagementRate: 58.59, avgDuration: '00:13:42' },
      },
      email: {
        sent: 17833, openRate: 18.91, clickRate: 0.52, uniqueClicks: 105,
        unsubRate: 0.0, orders: 0, revenue: 0, campaignsCount: 4,
      },
      eshop: { revenue: 16989.03, items: 281, orders: 97 },
    },
    {
      year: 2025, month: 9,
      meta: {
        spend: 323.82, impressions: 178693, reach: 54399, clicks: 2390,
        purchases: 21, purchaseValue: 697.29, roas: 2.15, addToCart: 102,
        cpc: 0.14, costPerPurchase: 15.42,
        campaigns: [
          { name: 'Katalóg produktov', spend: 216.02, clicks: 1473, purchases: 21, value: 697.29, roas: 3.23 },
          { name: 'Traffic kampane', spend: 59.91, clicks: 662, purchases: 0, value: 0, roas: 0 },
        ],
      },
      boosting: { spend: 47.89, interactions: 677, purchases: 0, value: 0 },
      google: {
        spend: 730.95, impressions: 193457, clicks: 4310, cpc: 0.17, ctr: 2.23,
        purchases: 36, purchaseValue: 3221.99, conversions: 36,
        campaigns: [
          { name: 'PMax – produkty', spend: 685.67, clicks: 4073, purchases: 35, value: 3077.15 },
          { name: 'PMax – remarketing', spend: 45.28, clicks: 237, purchases: 1, value: 144.84 },
        ],
      },
      ga: {
        paid: { sessions: 2763, users: 2302, engagementRate: 61.31, avgDuration: '00:21:54' },
        organic: { sessions: 4741, users: 3957, engagementRate: 63.64, avgDuration: '00:16:02' },
      },
      email: {
        sent: 4994, openRate: 29.87, clickRate: 1.15, uniqueClicks: 81,
        unsubRate: 0.0, orders: 0, revenue: 0, campaignsCount: 2,
      },
      eshop: { revenue: 17164.95, items: 401, orders: 97 },
    },
    {
      year: 2025, month: 10,
      meta: {
        spend: 464.03, impressions: 224148, reach: 76211, clicks: 3027,
        purchases: 54, purchaseValue: 2457.05, roas: 5.3, addToCart: 299,
        cpc: 0.15, costPerPurchase: 8.59, purchaseBook: 19,
        campaigns: [
          { name: 'Katalóg produktov', spend: 153.64, clicks: 1021, purchases: 36, value: 1794.05, roas: 11.68 },
          { name: 'Encyklopédia', spend: 198.98, clicks: 734, purchases: 18, value: 663.0, roas: 3.33 },
          { name: 'Traffic kampane', spend: 34.46, clicks: 1023, purchases: 0, value: 0, roas: 0 },
        ],
      },
      boosting: { spend: 76.95, interactions: 12745, purchases: 0, value: 0 },
      google: {
        spend: 795.45, impressions: 178644, clicks: 4441, cpc: 0.18, ctr: 2.49,
        purchases: 35, purchaseValue: 2754.23, conversions: 35, roas: 3.46, purchaseBook: 9,
        campaigns: [
          { name: 'PMax – produkty', spend: 610.04, clicks: 3189, purchases: 27, value: 2229.97 },
          { name: 'Encyklopédia (Demand Gen + PMax)', spend: 185.4, clicks: 1252, purchases: 7, value: 0 },
        ],
      },
      ga: {
        paid: { sessions: 3013, users: 2581, engagementRate: 55.92, avgDuration: '00:16:44' },
        organic: { sessions: 4936, users: 4333, engagementRate: 60.27, avgDuration: '00:12:09' },
      },
      email: {
        sent: 4612, openRate: 18.89, clickRate: 0.86, uniqueClicks: 54,
        unsubRate: 0.0, orders: 1, revenue: 15.8, campaignsCount: 2,
      },
      eshop: { revenue: 10111.03, items: 293, orders: 103, encyItems: 34, encyOrders: 31 },
    },
    {
      year: 2025, month: 11,
      meta: {
        spend: 1449.04, impressions: 423678, reach: 123673, clicks: 4877,
        purchases: 87, purchaseValue: 3940.94, roas: 2.72, addToCart: 256,
        cpc: 0.3, costPerPurchase: 16.66, purchaseBook: 48,
        campaigns: [
          { name: 'Encyklopédia', spend: 921.18, clicks: 2479, purchases: 75, value: 3209.27, roas: 3.48 },
          { name: 'Black Friday 2025', spend: 392.42, clicks: 1329, purchases: 12, value: 731.67, roas: 1.86 },
          { name: 'Katalóg produktov', spend: 95.09, clicks: 705, purchases: 0, value: 0, roas: 0 },
        ],
      },
      boosting: { spend: 14.97, interactions: 575, purchases: 0, value: 0 },
      google: {
        spend: 151.29, impressions: 38503, clicks: 817, cpc: 0.19, ctr: 2.12,
        purchases: 2, purchaseValue: 166.59, conversions: 2, roas: 1.1,
        campaigns: [
          { name: 'PMax – produkty', spend: 133.84, clicks: 732, purchases: 2, value: 166.59 },
          { name: 'Encyklopédia (Demand Gen + PMax)', spend: 17.45, clicks: 85, purchases: 0, value: 0 },
        ],
      },
      ga: {
        paid: { sessions: 3370, users: 2994, engagementRate: 47.21, avgDuration: '00:15:29' },
        organic: { sessions: 4378, users: 3622, engagementRate: 46.78, avgDuration: '00:11:45' },
      },
      email: {
        sent: 24179, openRate: 18.14, clickRate: 0.77, uniqueClicks: 195,
        unsubRate: 0.25, orders: 6, revenue: 468.15, campaignsCount: 6,
      },
      eshop: { revenue: 16750.05, items: 386, orders: 174, encyItems: 149, encyOrders: 144, encyRevenue: 8538.13 },
    },
    {
      year: 2025, month: 12,
      meta: {
        spend: 1264.27, impressions: 337407, reach: 116928, clicks: 3821,
        purchases: 68, purchaseValue: 4504.87, roas: 3.56, addToCart: 174,
        cpc: 0.33, costPerPurchase: 18.59, purchaseBook: 60,
        campaigns: [
          { name: 'Encyklopédia', spend: 1148.57, clicks: 3113, purchases: 61, value: 4011.57, roas: 3.49 },
        ],
      },
      boosting: { spend: 29.95, interactions: 2869, purchases: 0, value: 0 },
      google: null,
      ga: {
        paid: { sessions: 4398, users: 4067, engagementRate: 31.4, avgDuration: '00:14:07' },
        organic: { sessions: 2661, users: 2316, engagementRate: 35.78, avgDuration: '00:09:41' },
      },
      email: {
        sent: 27574, openRate: 19.12, clickRate: 0.56, uniqueClicks: 152,
        unsubRate: 0.35, orders: 5, revenue: 359.28, campaignsCount: 9,
      },
      eshop: { revenue: 11872.86, items: 214, orders: 172, encyItems: 148, encyOrders: 144, encyRevenue: 8802.57 },
    },

    // ---------- 2026 ----------
    {
      year: 2026, month: 1,
      meta: {
        spend: 528.87, impressions: 282503, reach: 134417, clicks: 3416,
        purchases: 13, purchaseValue: 616.09, roas: 1.16, addToCart: 123,
        cpc: 0.15, costPerPurchase: 40.68,
        ads: [
          { name: "10 produktov Sanaplant 1/26", campaign: "sanaplant_general_sales", spend: 151.7, value: 283.91, roas: 4.91, purchases: 8, costPerPurchase: 30.5, aov: 63.96, cpm: 6.03, impressions: 49119, reach: 16280, frequency: 5.03, clicks: 704, cpc: 0.42, ctr: 2.91, addToCart: 86, costPerAddToCart: 4.31, landingPageViews: 367, costPerLandingPageView: 0.81, engagements: 4710, costPerEngagement: 0.09, saves: 7, shares: 6 },
          { name: "SÚŤAŽ O ENCYKLOPÉDIU", campaign: "sanaplant_boosting", spend: 99.66, purchases: 0, cpm: 2.01, impressions: 49507, reach: 24760, frequency: 2, clicks: 44, cpc: 2.27, ctr: 0.09, addToCart: 5, costPerAddToCart: 19.93, landingPageViews: 18, costPerLandingPageView: 5.54, engagements: 1617, costPerEngagement: 0.06, saves: 13, shares: 140, comments: 474 },
          { name: "repka_video", campaign: "sanaplant_boosting_traffic", spend: 83.47, value: 212.7, roas: 2.55, purchases: 3, costPerPurchase: 27.82, aov: 70.9, cpm: 1.59, impressions: 52578, reach: 27310, frequency: 1.93, clicks: 731, cpc: 0.11, ctr: 1.39, addToCart: 6, costPerAddToCart: 13.91, landingPageViews: 474, costPerLandingPageView: 0.18, engagements: 12997, costPerEngagement: 0.01, saves: 18, shares: 6, comments: 2 },
          { name: "Pestujete repku, slnečnicu, mak alebo sóju?", campaign: "sanaplant_boosting_traffic", spend: 75.59, value: 69.9, roas: 0.92, purchases: 1, costPerPurchase: 75.59, aov: 69.9, cpm: 1.29, impressions: 58814, reach: 27152, frequency: 2.17, clicks: 418, cpc: 0.18, ctr: 0.71, addToCart: 3, costPerAddToCart: 25.2, landingPageViews: 279, costPerLandingPageView: 0.27, engagements: 494, costPerEngagement: 0.15, saves: 7, shares: 3 },
          { name: "Predjarná ochrana broskýň", campaign: "sanaplant_boosting_traffic", spend: 54.93, purchases: 0, cpm: 1.46, impressions: 37669, reach: 17594, frequency: 2.14, clicks: 989, cpc: 0.06, ctr: 2.63, addToCart: 2, costPerAddToCart: 27.47, landingPageViews: 808, costPerLandingPageView: 0.07, engagements: 9941, costPerEngagement: 0.01, saves: 42, shares: 10, comments: 1 },
          { name: "Sanaplant Poradňa | Zozelenená mrkva v časti pod vňaťou", campaign: "sanaplant_boosting", spend: 14.98, purchases: 0, cpm: 1.7, impressions: 8818, reach: 6554, frequency: 1.35, clicks: 181, cpc: 0.08, ctr: 2.05, addToCart: 1, costPerAddToCart: 14.98, landingPageViews: 27, costPerLandingPageView: 0.55, engagements: 383, costPerEngagement: 0.04, saves: 2, shares: 1, comments: 9 },
          { name: "Najlepšie rady nie sú z internetu", campaign: "sanaplant_boosting_traffic", spend: 14.98, purchases: 0, cpm: 1.62, impressions: 9270, reach: 6019, frequency: 1.54, clicks: 125, cpc: 0.12, ctr: 1.35, addToCart: 2, costPerAddToCart: 7.49, landingPageViews: 100, costPerLandingPageView: 0.15, engagements: 145, costPerEngagement: 0.1 },
          { name: "Začiatok sezóny je plný stresov", campaign: "sanaplant_boosting_traffic", spend: 14.96, purchases: 0, cpm: 1.84, impressions: 8116, reach: 4570, frequency: 1.78, clicks: 113, cpc: 0.13, ctr: 1.39, landingPageViews: 60, costPerLandingPageView: 0.25, engagements: 134, costPerEngagement: 0.11, saves: 3, comments: 1 },
          { name: "Predjarná ochrana broskýň", campaign: "sanaplant_general_sales", spend: 10.78, purchases: 0, cpm: 2.13, impressions: 5061, reach: 2953, frequency: 1.71, clicks: 85, cpc: 0.13, ctr: 1.68, addToCart: 14, costPerAddToCart: 0.77, landingPageViews: 47, costPerLandingPageView: 0.23, engagements: 1380, costPerEngagement: 0.01, saves: 3, shares: 2 },
          { name: "Pestujete repku, slnečnicu, mak alebo sóju?", campaign: "sanaplant_general_sales", spend: 7.82, value: 49.58, roas: 6.34, purchases: 1, costPerPurchase: 7.82, aov: 49.58, cpm: 2.2, impressions: 3551, reach: 1225, frequency: 2.9, clicks: 26, cpc: 0.3, ctr: 0.73, addToCart: 4, costPerAddToCart: 1.96, landingPageViews: 17, costPerLandingPageView: 0.46, engagements: 506, costPerEngagement: 0.02 }
        ],
      },
      boosting: null,
      google: {
        spend: 170.53, impressions: 60228, clicks: 1486, cpc: 0.11, ctr: 2.47,
        interactions: 1729, interactionRate: 2.87, convRate: 5.38, costPerConv: 1.83,
        purchases: 9.01, purchaseValue: 858.18, conversions: 93.05, roas: 5.03,
        conversionActions: { add_to_cart: 57.01, begin_checkout: 27.03, purchase: 9.01 },
        campaigns: [
          { name: "PMax_sales_products", type: "Performance Max", status: "Enabled", purchases: 9.01, value: 858.18, conversionActions: { add_to_cart: 57.01, purchase: 9.01, begin_checkout: 27.03 } }
        ],
      },
      ga: {
          paid: {
            sessions: 3759,
            users: 3174,
            engagementRate: 46.45,
            avgDuration: "00:17:49"
          },
          organic: {
            sessions: 3975,
            users: 3718,
            engagementRate: 28.88,
            avgDuration: "00:05:40"
          },
          snapshot: {
            activeUsers: 6762,
            newUsers: 6198,
            sessions: 7733,
            engagedSessions: 2891,
            engagementRate: 0.3738523212207423,
            totalRevenue: 4362.7100009999995,
            keyEvents: 513
          },
          trafficAcquisition: [
            {
              channelGroup: "Paid Social",
              sessions: 2787,
              engagedSessions: 538,
              engagementRate: 0.19303911015428776,
              avgEngagementTimePerSession: 11.70075349838536,
              eventsPerSession: 4.031933979189092,
              eventCount: 11237,
              keyEvents: 59,
              sessionKeyEventRate: 0.009329027628274129,
              totalRevenue: 407.45
            },
            {
              channelGroup: "Direct",
              sessions: 1486,
              engagedSessions: 666,
              engagementRate: 0.44818304172274565,
              avgEngagementTimePerSession: 29.376177658142666,
              eventsPerSession: 6.397711978465679,
              eventCount: 9507,
              keyEvents: 58,
              sessionKeyEventRate: 0.02220726783310902,
              totalRevenue: 538.11
            },
            {
              channelGroup: "Organic Search",
              sessions: 1420,
              engagedSessions: 744,
              engagementRate: 0.523943661971831,
              avgEngagementTimePerSession: 48.957042253521124,
              eventsPerSession: 6.545070422535211,
              eventCount: 9294,
              keyEvents: 124,
              sessionKeyEventRate: 0.02323943661971831,
              totalRevenue: 1782.94
            },
            {
              channelGroup: "Cross-network",
              sessions: 1228,
              engagedSessions: 604,
              engagementRate: 0.49185667752442996,
              avgEngagementTimePerSession: 53.94951140065147,
              eventsPerSession: 6.513029315960912,
              eventCount: 7998,
              keyEvents: 141,
              sessionKeyEventRate: 0.03257328990228013,
              totalRevenue: 1010.830001
            },
            {
              channelGroup: "Organic Social",
              sessions: 378,
              engagedSessions: 132,
              engagementRate: 0.3492063492063492,
              avgEngagementTimePerSession: 30.03174603174603,
              eventsPerSession: 6.616402116402116,
              eventCount: 2501,
              keyEvents: 43,
              sessionKeyEventRate: 0.03439153439153439,
              totalRevenue: 88.34
            },
            {
              channelGroup: "Email",
              sessions: 225,
              engagedSessions: 101,
              engagementRate: 0.4488888888888889,
              avgEngagementTimePerSession: 39.72888888888889,
              eventsPerSession: 7.373333333333333,
              eventCount: 1659,
              keyEvents: 19,
              sessionKeyEventRate: 0.022222222222222223,
              totalRevenue: 69.9
            },
            {
              channelGroup: "Unassigned",
              sessions: 91,
              engagedSessions: 40,
              engagementRate: 0.43956043956043955,
              avgEngagementTimePerSession: 131.12087912087912,
              eventsPerSession: 11.868131868131869,
              eventCount: 1080,
              keyEvents: 19,
              sessionKeyEventRate: 0.08791208791208792,
              totalRevenue: 212.26
            },
            {
              channelGroup: "Referral",
              sessions: 84,
              engagedSessions: 41,
              engagementRate: 0.4880952380952381,
              avgEngagementTimePerSession: 67.57142857142857,
              eventsPerSession: 9.785714285714286,
              eventCount: 822,
              keyEvents: 11,
              sessionKeyEventRate: 0.047619047619047616,
              totalRevenue: 127.65
            },
            {
              channelGroup: "Paid Search",
              sessions: 22,
              engagedSessions: 17,
              engagementRate: 0.7727272727272727,
              avgEngagementTimePerSession: 223.5909090909091,
              eventsPerSession: 32.18181818181818,
              eventCount: 708,
              keyEvents: 30,
              sessionKeyEventRate: 0.13636363636363635,
              totalRevenue: 125.23
            },
            {
              channelGroup: "Organic Shopping",
              sessions: 11,
              engagedSessions: 8,
              engagementRate: 0.7272727272727273,
              avgEngagementTimePerSession: 24,
              eventsPerSession: 8.545454545454545,
              eventCount: 94,
              keyEvents: 9,
              sessionKeyEventRate: 0.18181818181818182,
              totalRevenue: 0
            },
            {
              channelGroup: "SMS",
              sessions: 1,
              engagedSessions: 0,
              engagementRate: 0,
              avgEngagementTimePerSession: 0,
              eventsPerSession: 3,
              eventCount: 3,
              keyEvents: 0,
              sessionKeyEventRate: 0,
              totalRevenue: 0
            }
          ],
          userAcquisition: [
            {
              firstUserChannelGroup: "Paid Social",
              totalUsers: 2524,
              newUsers: 2290,
              returningUsers: 107,
              avgEngagementTimePerActiveUser: 12.738135593220338,
              engagedSessionsPerActiveUser: 0.21610169491525424,
              eventCount: 10629,
              keyEvents: 38,
              userKeyEventRate: 0.00847457627118644
            },
            {
              firstUserChannelGroup: "Direct",
              totalUsers: 1445,
              newUsers: 1381,
              returningUsers: 104,
              avgEngagementTimePerActiveUser: 43.01686577652846,
              engagedSessionsPerActiveUser: 0.5643007730147576,
              eventCount: 12171,
              keyEvents: 113,
              userKeyEventRate: 0.024595924104005622
            },
            {
              firstUserChannelGroup: "Organic Search",
              totalUsers: 1096,
              newUsers: 923,
              returningUsers: 198,
              avgEngagementTimePerActiveUser: 58.062380038387715,
              engagedSessionsPerActiveUser: 0.6717850287907869,
              eventCount: 8418,
              keyEvents: 103,
              userKeyEventRate: 0.02399232245681382
            },
            {
              firstUserChannelGroup: "Cross-network",
              totalUsers: 1067,
              newUsers: 1036,
              returningUsers: 72,
              avgEngagementTimePerActiveUser: 56.12547169811321,
              engagedSessionsPerActiveUser: 0.5254716981132076,
              eventCount: 7712,
              keyEvents: 143,
              userKeyEventRate: 0.0330188679245283
            },
            {
              firstUserChannelGroup: "Organic Social",
              totalUsers: 356,
              newUsers: 340,
              returningUsers: 8,
              avgEngagementTimePerActiveUser: 18.109826589595375,
              engagedSessionsPerActiveUser: 0.35260115606936415,
              eventCount: 1818,
              keyEvents: 16,
              userKeyEventRate: 0.031791907514450865
            },
            {
              firstUserChannelGroup: "Email",
              totalUsers: 118,
              newUsers: 95,
              returningUsers: 23,
              avgEngagementTimePerActiveUser: 72.16814159292035,
              engagedSessionsPerActiveUser: 0.7522123893805309,
              eventCount: 1363,
              keyEvents: 24,
              userKeyEventRate: 0.05309734513274336
            },
            {
              firstUserChannelGroup: "Referral",
              totalUsers: 64,
              newUsers: 48,
              returningUsers: 17,
              avgEngagementTimePerActiveUser: 154.7704918032787,
              engagedSessionsPerActiveUser: 0.819672131147541,
              eventCount: 1161,
              keyEvents: 25,
              userKeyEventRate: 0.13114754098360656
            },
            {
              firstUserChannelGroup: "Unassigned",
              totalUsers: 61,
              newUsers: 54,
              returningUsers: 10,
              avgEngagementTimePerActiveUser: 200.2,
              engagedSessionsPerActiveUser: 0.65,
              eventCount: 809,
              keyEvents: 9,
              userKeyEventRate: 0.06666666666666667
            },
            {
              firstUserChannelGroup: "Paid Search",
              totalUsers: 21,
              newUsers: 21,
              returningUsers: 3,
              avgEngagementTimePerActiveUser: 362.85714285714283,
              engagedSessionsPerActiveUser: 0.8571428571428571,
              eventCount: 725,
              keyEvents: 32,
              userKeyEventRate: 0.14285714285714285
            },
            {
              firstUserChannelGroup: "Organic Shopping",
              totalUsers: 9,
              newUsers: 9,
              returningUsers: 1,
              avgEngagementTimePerActiveUser: 39,
              engagedSessionsPerActiveUser: 1,
              eventCount: 94,
              keyEvents: 10,
              userKeyEventRate: 0.2222222222222222
            },
            {
              firstUserChannelGroup: "SMS",
              totalUsers: 1,
              newUsers: 1,
              returningUsers: 0,
              avgEngagementTimePerActiveUser: 0,
              engagedSessionsPerActiveUser: 0,
              eventCount: 3,
              keyEvents: 0,
              userKeyEventRate: 0
            }
          ],
          landingPages: [
            {
              path: "/",
              sessions: 2088,
              activeUsers: 1801,
              newUsers: 1671,
              avgEngagementTimePerSession: 20.579980842911876,
              totalRevenue: 224.83,
              bounceRate: 0.8022030651340997,
              addToCart: 71,
              checkouts: 7,
              purchases: 3
            },
            {
              path: "/produkt/kompletny-sprievodca-pestovanim-a-ochranou-repky-slnecnice-maku-a-soje",
              sessions: 1047,
              activeUsers: 938,
              newUsers: 917,
              avgEngagementTimePerSession: 8.734479465138492,
              totalRevenue: 493.3,
              bounceRate: 0.8213944603629417,
              addToCart: 11,
              checkouts: 5,
              purchases: 7
            },
            {
              path: "/produkt/damisol-gold-frigomax-1-l",
              sessions: 395,
              activeUsers: 298,
              newUsers: 268,
              avgEngagementTimePerSession: 52.063291139240505,
              totalRevenue: 261.96,
              bounceRate: 0.4430379746835443,
              addToCart: 39,
              checkouts: 9,
              purchases: 8
            },
            {
              path: "(not set)",
              sessions: 373,
              activeUsers: 356,
              newUsers: 348,
              avgEngagementTimePerSession: 19.4343163538874,
              totalRevenue: 0,
              bounceRate: 0.32439678284182305,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/encyklopedia-chorob-skodcov-a-vyzivy-zahradnickych-rastlin",
              sessions: 251,
              activeUsers: 202,
              newUsers: 187,
              avgEngagementTimePerSession: 22.179282868525895,
              totalRevenue: 39.28,
              bounceRate: 0.5139442231075697,
              addToCart: 16,
              checkouts: 3,
              purchases: 1
            },
            {
              path: "/obchod",
              sessions: 187,
              activeUsers: 172,
              newUsers: 149,
              avgEngagementTimePerSession: 100.40106951871658,
              totalRevenue: 0,
              bounceRate: 0.32620320855614976,
              addToCart: 17,
              checkouts: 2,
              purchases: 0
            },
            {
              path: "/odborna-poradna",
              sessions: 142,
              activeUsers: 130,
              newUsers: 129,
              avgEngagementTimePerSession: 4.035211267605634,
              totalRevenue: 0,
              bounceRate: 0.823943661971831,
              addToCart: 1,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/hydrohumat_1l",
              sessions: 122,
              activeUsers: 106,
              newUsers: 92,
              avgEngagementTimePerSession: 20.65573770491803,
              totalRevenue: 0,
              bounceRate: 0.5655737704918032,
              addToCart: 11,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/predjarny-postrek-na-10-l",
              sessions: 87,
              activeUsers: 81,
              newUsers: 78,
              avgEngagementTimePerSession: 68.183908045977,
              totalRevenue: 18.12,
              bounceRate: 0.41379310344827586,
              addToCart: 5,
              checkouts: 3,
              purchases: 1
            },
            {
              path: "/produkt/pocahontas-premiovy-stolovy-zemiak-28-40-mm",
              sessions: 55,
              activeUsers: 31,
              newUsers: 29,
              avgEngagementTimePerSession: 7.909090909090909,
              totalRevenue: 0,
              bounceRate: 0.5636363636363636,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/fyziologicke-skvrnitosti-jacmena",
              sessions: 43,
              activeUsers: 17,
              newUsers: 16,
              avgEngagementTimePerSession: 0,
              totalRevenue: 0,
              bounceRate: 0.5581395348837209,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/superfosfat-18",
              sessions: 43,
              activeUsers: 40,
              newUsers: 39,
              avgEngagementTimePerSession: 125.46511627906976,
              totalRevenue: 124.76,
              bounceRate: 0.3953488372093023,
              addToCart: 7,
              checkouts: 5,
              purchases: 2
            },
            {
              path: "/produkt/mospilan-20-sp",
              sessions: 42,
              activeUsers: 42,
              newUsers: 40,
              avgEngagementTimePerSession: 41.80952380952381,
              totalRevenue: 0,
              bounceRate: 0.40476190476190477,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/special-zemiaky-zahrada-bezchloridove-npk-11-9-2016s15mg005-b",
              sessions: 42,
              activeUsers: 36,
              newUsers: 31,
              avgEngagementTimePerSession: 80.5,
              totalRevenue: 0,
              bounceRate: 0.2619047619047619,
              addToCart: 3,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/vinovcerit-npk",
              sessions: 41,
              activeUsers: 13,
              newUsers: 11,
              avgEngagementTimePerSession: 107.1219512195122,
              totalRevenue: 96.72,
              bounceRate: 0.6829268292682927,
              addToCart: 5,
              checkouts: 3,
              purchases: 1
            },
            {
              path: "/produkt/sivanto-prime-1-l",
              sessions: 36,
              activeUsers: 28,
              newUsers: 19,
              avgEngagementTimePerSession: 67.61111111111111,
              totalRevenue: 136.66,
              bounceRate: 0.3055555555555556,
              addToCart: 3,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/biopasy",
              sessions: 34,
              activeUsers: 33,
              newUsers: 32,
              avgEngagementTimePerSession: 36.61764705882353,
              totalRevenue: 0,
              bounceRate: 0.47058823529411764,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/liadok-27",
              sessions: 31,
              activeUsers: 30,
              newUsers: 29,
              avgEngagementTimePerSession: 22.096774193548388,
              totalRevenue: 0,
              bounceRate: 0.45161290322580644,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/machozrut",
              sessions: 29,
              activeUsers: 29,
              newUsers: 29,
              avgEngagementTimePerSession: 107.34482758620689,
              totalRevenue: 64.27,
              bounceRate: 0.4827586206896552,
              addToCart: 12,
              checkouts: 6,
              purchases: 1
            },
            {
              path: "/produkt/predjarny-postrek-na-50-l",
              sessions: 29,
              activeUsers: 29,
              newUsers: 28,
              avgEngagementTimePerSession: 35.89655172413793,
              totalRevenue: 0,
              bounceRate: 0.3793103448275862,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/prakticky-balicek-ochrany-rastlin-pre-zahradkara-maly-1-ks",
              sessions: 28,
              activeUsers: 25,
              newUsers: 22,
              avgEngagementTimePerSession: 43.964285714285715,
              totalRevenue: 0,
              bounceRate: 0.5,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/k-othrine-25-sc-1-l",
              sessions: 27,
              activeUsers: 25,
              newUsers: 25,
              avgEngagementTimePerSession: 39.51851851851852,
              totalRevenue: 139.74,
              bounceRate: 0.48148148148148145,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/prakticky-balicek-ochrany-rastlin-pre-zahradkara-velky-1-ks",
              sessions: 26,
              activeUsers: 21,
              newUsers: 21,
              avgEngagementTimePerSession: 12.346153846153847,
              totalRevenue: 0,
              bounceRate: 0.7692307692307693,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/quantum-aminomax-1-l",
              sessions: 26,
              activeUsers: 22,
              newUsers: 20,
              avgEngagementTimePerSession: 16.692307692307693,
              totalRevenue: 0,
              bounceRate: 0.7307692307692307,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/cyperfor-100-ec-1-l",
              sessions: 25,
              activeUsers: 23,
              newUsers: 19,
              avgEngagementTimePerSession: 66.72,
              totalRevenue: 125.23,
              bounceRate: 0.36,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/signum",
              sessions: 24,
              activeUsers: 21,
              newUsers: 20,
              avgEngagementTimePerSession: 16.166666666666668,
              totalRevenue: 0,
              bounceRate: 0.7083333333333334,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/zlate-zltnutie-vinica",
              sessions: 21,
              activeUsers: 20,
              newUsers: 19,
              avgEngagementTimePerSession: 171.38095238095238,
              totalRevenue: 0,
              bounceRate: 0.47619047619047616,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/kontakt",
              sessions: 20,
              activeUsers: 20,
              newUsers: 19,
              avgEngagementTimePerSession: 71.6,
              totalRevenue: 0,
              bounceRate: 0.35,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/neemazal-t-s",
              sessions: 20,
              activeUsers: 16,
              newUsers: 16,
              avgEngagementTimePerSession: 93.45,
              totalRevenue: 24.87,
              bounceRate: 0.3,
              addToCart: 4,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/airone-sc-5-l",
              sessions: 19,
              activeUsers: 17,
              newUsers: 13,
              avgEngagementTimePerSession: 151.26315789473685,
              totalRevenue: 0,
              bounceRate: 0.21052631578947367,
              addToCart: 4,
              checkouts: 2,
              purchases: 0
            },
            {
              path: "/produkt/champion-50-wg",
              sessions: 19,
              activeUsers: 19,
              newUsers: 18,
              avgEngagementTimePerSession: 25.157894736842106,
              totalRevenue: 0,
              bounceRate: 0.5263157894736842,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/trava-timotejka-lucna-lema-1-kg",
              sessions: 19,
              activeUsers: 18,
              newUsers: 18,
              avgEngagementTimePerSession: 6.947368421052632,
              totalRevenue: 0,
              bounceRate: 0.6842105263157895,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/virkon-s-50-g",
              sessions: 19,
              activeUsers: 19,
              newUsers: 19,
              avgEngagementTimePerSession: 33.1578947368421,
              totalRevenue: 0,
              bounceRate: 0.7368421052631579,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/znacka-produktu/silva-tabs",
              sessions: 18,
              activeUsers: 15,
              newUsers: 14,
              avgEngagementTimePerSession: 16.833333333333332,
              totalRevenue: 0,
              bounceRate: 0.7777777777777778,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/mrlik-celorocny-nepriatel-nasich-poli",
              sessions: 17,
              activeUsers: 17,
              newUsers: 17,
              avgEngagementTimePerSession: 103.29411764705883,
              totalRevenue: 0,
              bounceRate: 0.5294117647058824,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/flipper-ew-4798-1-l",
              sessions: 17,
              activeUsers: 16,
              newUsers: 11,
              avgEngagementTimePerSession: 25.823529411764707,
              totalRevenue: 0,
              bounceRate: 0.7058823529411765,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/draselna-sol",
              sessions: 16,
              activeUsers: 16,
              newUsers: 15,
              avgEngagementTimePerSession: 72.6875,
              totalRevenue: 58.02,
              bounceRate: 0.375,
              addToCart: 4,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/escort-novy-10-l",
              sessions: 16,
              activeUsers: 16,
              newUsers: 15,
              avgEngagementTimePerSession: 1.6875,
              totalRevenue: 0,
              bounceRate: 0.75,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/redkev-olejna",
              sessions: 16,
              activeUsers: 15,
              newUsers: 9,
              avgEngagementTimePerSession: 19.25,
              totalRevenue: 0,
              bounceRate: 0.5625,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/benevia",
              sessions: 15,
              activeUsers: 11,
              newUsers: 9,
              avgEngagementTimePerSession: 16.533333333333335,
              totalRevenue: 0,
              bounceRate: 0.5333333333333333,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/katalog-pripravky-na-ochranu-rastlin-2025",
              sessions: 15,
              activeUsers: 11,
              newUsers: 10,
              avgEngagementTimePerSession: 16.4,
              totalRevenue: 0,
              bounceRate: 0.7333333333333333,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/kategoria-produktu/sikovny-gazda",
              sessions: 14,
              activeUsers: 14,
              newUsers: 14,
              avgEngagementTimePerSession: 6.142857142857143,
              totalRevenue: 0,
              bounceRate: 0.5714285714285714,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/exirel-1-l",
              sessions: 14,
              activeUsers: 12,
              newUsers: 10,
              avgEngagementTimePerSession: 83.14285714285714,
              totalRevenue: 260.89,
              bounceRate: 0.5,
              addToCart: 4,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/mustang-forte-5-l",
              sessions: 14,
              activeUsers: 11,
              newUsers: 8,
              avgEngagementTimePerSession: 35.857142857142854,
              totalRevenue: 0,
              bounceRate: 0.5,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/profiler-wg",
              sessions: 14,
              activeUsers: 11,
              newUsers: 9,
              avgEngagementTimePerSession: 301,
              totalRevenue: 42.16,
              bounceRate: 0.35714285714285715,
              addToCart: 20,
              checkouts: 4,
              purchases: 1
            },
            {
              path: "/produkt/sudanska-trava",
              sessions: 14,
              activeUsers: 12,
              newUsers: 12,
              avgEngagementTimePerSession: 18.285714285714285,
              totalRevenue: 0,
              bounceRate: 0.35714285714285715,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/kategoria-produktu/vsetky-fungicidy",
              sessions: 13,
              activeUsers: 8,
              newUsers: 7,
              avgEngagementTimePerSession: 26.307692307692307,
              totalRevenue: 0,
              bounceRate: 0.46153846153846156,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/barbarian-super-1-l",
              sessions: 12,
              activeUsers: 10,
              newUsers: 9,
              avgEngagementTimePerSession: 76.08333333333333,
              totalRevenue: 39.33,
              bounceRate: 0.3333333333333333,
              addToCart: 1,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/zlte-lepove-dosky",
              sessions: 12,
              activeUsers: 6,
              newUsers: 6,
              avgEngagementTimePerSession: 26.166666666666668,
              totalRevenue: 0,
              bounceRate: 0.6666666666666666,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/wp-login.php",
              sessions: 12,
              activeUsers: 3,
              newUsers: 0,
              avgEngagementTimePerSession: 6.166666666666667,
              totalRevenue: 0,
              bounceRate: 0.5,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            }
          ],
          ecommerceItems: [
            {
              name: "Kompletný  sprievodca pestovaním  a ochranou repky,  slnečnice,  maku a sóje",
              itemsViewed: 0,
              itemsAddedToCart: 13,
              itemsPurchased: 8,
              itemRevenue: 559.2
            },
            {
              name: "Previcur Energy, 1 l",
              itemsViewed: 0,
              itemsAddedToCart: 9,
              itemsPurchased: 4,
              itemRevenue: 423.510001
            },
            {
              name: "Sivanto Prime, 1 l",
              itemsViewed: 0,
              itemsAddedToCart: 9,
              itemsPurchased: 3,
              itemRevenue: 404.34
            },
            {
              name: "Zato 50 WG, 1 kg",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 391.19
            },
            {
              name: "Cyperfor 100 EC, 5 l",
              itemsViewed: 0,
              itemsAddedToCart: 5,
              itemsPurchased: 2,
              itemRevenue: 248.46
            },
            {
              name: "Pendistar 40 SC, 10 l",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 231.52
            },
            {
              name: "Rokoaktív, 25 l",
              itemsViewed: 0,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 160.67
            },
            {
              name: "Ďatelina lúčna - Rozeta",
              itemsViewed: 0,
              itemsAddedToCart: 16,
              itemsPurchased: 9,
              itemRevenue: 150.51999
            },
            {
              name: "Damisol Gold Frigomax, 1 l",
              itemsViewed: 0,
              itemsAddedToCart: 41,
              itemsPurchased: 8,
              itemRevenue: 147.52
            },
            {
              name: "K - Othrine 25 SC, 1 l",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 138.74
            },
            {
              name: "Tofino, 10 kg",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 127.65
            },
            {
              name: "Luna Experience, 1 l",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 124.23
            },
            {
              name: "Cervacol Extra, 15 kg",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 119.93
            },
            {
              name: "Vin-OVO-cerit",
              itemsViewed: 0,
              itemsAddedToCart: 19,
              itemsPurchased: 15,
              itemRevenue: 104.050002
            },
            {
              name: "Dacor, 1 l",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 102.08
            },
            {
              name: "Superfosfát 19 %, 5 kg",
              itemsViewed: 0,
              itemsAddedToCart: 17,
              itemsPurchased: 16,
              itemRevenue: 83.060003
            },
            {
              name: "Bofix",
              itemsViewed: 0,
              itemsAddedToCart: 10,
              itemsPurchased: 7,
              itemRevenue: 79.520002
            },
            {
              name: "Encyklopédia chorôb, škodcov a výživy záhradníckych rastlín",
              itemsViewed: 0,
              itemsAddedToCart: 31,
              itemsPurchased: 2,
              itemRevenue: 65.5
            },
            {
              name: "Touchdown System 4",
              itemsViewed: 0,
              itemsAddedToCart: 3,
              itemsPurchased: 2,
              itemRevenue: 55.720001
            },
            {
              name: "Hrach siaty (jarný) - GAMBIT",
              itemsViewed: 0,
              itemsAddedToCart: 85,
              itemsPurchased: 1,
              itemRevenue: 43.05
            },
            {
              name: "Žlté lepové dosky 6ks",
              itemsViewed: 0,
              itemsAddedToCart: 8,
              itemsPurchased: 6,
              itemRevenue: 40.020001
            },
            {
              name: "Signum",
              itemsViewed: 0,
              itemsAddedToCart: 6,
              itemsPurchased: 6,
              itemRevenue: 34
            },
            {
              name: "Síran draselný, 5 kg",
              itemsViewed: 0,
              itemsAddedToCart: 5,
              itemsPurchased: 3,
              itemRevenue: 32.04
            },
            {
              name: "Barbarian Super, 1 l",
              itemsViewed: 0,
              itemsAddedToCart: 5,
              itemsPurchased: 2,
              itemRevenue: 30.760001
            },
            {
              name: "Profiler WG",
              itemsViewed: 0,
              itemsAddedToCart: 7,
              itemsPurchased: 4,
              itemRevenue: 30.039999
            },
            {
              name: "Dynali",
              itemsViewed: 0,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 27.06
            },
            {
              name: "Machožrút",
              itemsViewed: 0,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 23.72
            },
            {
              name: "Champion 50 WG",
              itemsViewed: 0,
              itemsAddedToCart: 7,
              itemsPurchased: 4,
              itemRevenue: 22.299999
            },
            {
              name: "Predjarný postrek na 50 l, 500 + 25 ml",
              itemsViewed: 0,
              itemsAddedToCart: 6,
              itemsPurchased: 2,
              itemRevenue: 22.019999
            },
            {
              name: "Silwet Star",
              itemsViewed: 0,
              itemsAddedToCart: 4,
              itemsPurchased: 3,
              itemRevenue: 17.75
            },
            {
              name: "NeemAZAL T/S, 100 ml",
              itemsViewed: 0,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 15.61
            },
            {
              name: "Predjarný postrek na 10 l, 100+5 ml",
              itemsViewed: 0,
              itemsAddedToCart: 12,
              itemsPurchased: 4,
              itemRevenue: 15.44
            },
            {
              name: "Mospilan 20 SP",
              itemsViewed: 0,
              itemsAddedToCart: 17,
              itemsPurchased: 11,
              itemRevenue: 15.110002
            },
            {
              name: "BIOPÁSY",
              itemsViewed: 0,
              itemsAddedToCart: 9,
              itemsPurchased: 3,
              itemRevenue: 14.940001
            },
            {
              name: "Travcerit",
              itemsViewed: 0,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 13.84
            },
            {
              name: "Draselná soľ, 5 kg",
              itemsViewed: 0,
              itemsAddedToCart: 2,
              itemsPurchased: 2,
              itemRevenue: 13.52
            },
            {
              name: "Karate Zeon 5 CS",
              itemsViewed: 0,
              itemsAddedToCart: 9,
              itemsPurchased: 2,
              itemRevenue: 10.71
            },
            {
              name: "Štepársky vosk",
              itemsViewed: 0,
              itemsAddedToCart: 2,
              itemsPurchased: 2,
              itemRevenue: 10.539999
            },
            {
              name: "Horká soľ - prášková",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 2,
              itemRevenue: 10.459999
            },
            {
              name: "Vivando",
              itemsViewed: 0,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 10.32
            },
            {
              name: "Nissorun 10 WP",
              itemsViewed: 0,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 9.3
            },
            {
              name: "NPK 15-10-10",
              itemsViewed: 0,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 7.17
            },
            {
              name: "Desimo Duo, 350 g",
              itemsViewed: 0,
              itemsAddedToCart: 7,
              itemsPurchased: 1,
              itemRevenue: 6.95
            },
            {
              name: "Agrovital",
              itemsViewed: 0,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 6.31
            },
            {
              name: "Cuproxat SC",
              itemsViewed: 0,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 6.29
            },
            {
              name: "Liadok 27 %",
              itemsViewed: 0,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 5.98
            },
            {
              name: "Scala",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 5.83
            },
            {
              name: "Bellis",
              itemsViewed: 0,
              itemsAddedToCart: 3,
              itemsPurchased: 2,
              itemRevenue: 5.08
            },
            {
              name: "Score 20 EC",
              itemsViewed: 0,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 4.24
            },
            {
              name: "Wuxal Super, 250 ml",
              itemsViewed: 0,
              itemsAddedToCart: 12,
              itemsPurchased: 1,
              itemRevenue: 4.059999
            }
          ]
        },
      email: {
        sent: 30460, openRate: 21.52, clickRate: 0.67, uniqueClicks: 231,
        unsubRate: 0.27, orders: 3, revenue: 549.02, campaignsCount: 8,
      },
      eshop: {
        woocommerce: true,
        revenue: 6024.13,
        netRevenue: 4984.63,
        grossSales: 5053.03,
        orders: 65,
        items: 210,
        variants: 106,
        refunds: 0,
        coupons: 68.4,
        taxes: 952.4,
        shipping: 87.1,
        categories: [
          { name: 'Záhradkári', items: 152, netRevenue: 1293.4 },
          { name: 'Výživa rastlín', items: 127, netRevenue: 1241.9 },
          { name: 'Hnojivá', items: 84, netRevenue: 434.56 },
          { name: 'Fungicídy', items: 78, netRevenue: 3427.1 },
          { name: 'Insekcitídy', items: 62, netRevenue: 983.2 },
          { name: 'Exkluzívne produkty', items: 47, netRevenue: 1586.29 },
          { name: 'Poľnohospodári', items: 47, netRevenue: 3108.69 },
          { name: 'Šikovný gazda', items: 40, netRevenue: 1145.82 },
          { name: 'Herbicídy', items: 35, netRevenue: 640.29 },
          { name: 'Ostatné', items: 31, netRevenue: 497.2 },
          { name: 'Bio prípravky', items: 21, netRevenue: 428.42 },
          { name: 'Encyklopédia', items: 18, netRevenue: 983.46 },
          { name: 'Osivá', items: 15, netRevenue: 145.8 },
          { name: 'Trávne osivá', items: 9, netRevenue: 221.23 },
        ],
        products: [
          { name: 'Superfosfát 19 %, 5 kg', sku: '2402', items: 16, netRevenue: 67.5, orders: 3, variants: 0 },
          { name: 'Vin-OVO-cerit', sku: '2404', items: 15, netRevenue: 84.6, orders: 1, variants: 2 },
          { name: 'Damisol Gold Frigomax, 1 l', sku: '3032', items: 15, netRevenue: 224.85, orders: 13, variants: 0 },
          { name: 'Mospilan 20 SP', sku: '2322', items: 13, netRevenue: 17.01, orders: 5, variants: 3 },
          { name: 'Kompletný sprievodca pestovaním a ochranou repky, slnečnice, maku a sóje', sku: '3044-1', items: 12, netRevenue: 779.89, orders: 12, variants: 0 },
          { name: 'Žlté lepové dosky', sku: '2408', items: 9, netRevenue: 48.78, orders: 3, variants: 2 },
          { name: 'Ďatelina lúčna - Rozeta', sku: '15325', items: 9, netRevenue: 122.4, orders: 2, variants: 3 },
          { name: 'Previcur Energy, 1 l', sku: '1477', items: 7, netRevenue: 577.85, orders: 4, variants: 0 },
          { name: 'Bofix', sku: '2309', items: 7, netRevenue: 64.67, orders: 1, variants: 4 },
          { name: 'Machožrút, 1 l', sku: '2362', items: 7, netRevenue: 65.77, orders: 3, variants: 0 },
          { name: 'Signum', sku: '2304', items: 6, netRevenue: 32.01, orders: 4, variants: 3 },
          { name: 'Predjarný postrek na 10 l, 100+5 ml', sku: '2339', items: 6, netRevenue: 18.84, orders: 3, variants: 0 },
          { name: 'Encyklopédia chorôb, škodcov a výživy záhradníckych rastlín', sku: '3044', items: 6, netRevenue: 203.57, orders: 6, variants: 2 },
          { name: 'Champion 50 WG', sku: '2291', items: 5, netRevenue: 19.26, orders: 4, variants: 4 },
          { name: 'Profiler WG', sku: '2297', items: 4, netRevenue: 24.42, orders: 3, variants: 2 },
          { name: 'Sivanto Prime', sku: '1294', items: 3, netRevenue: 328.73, orders: 3, variants: 2 },
          { name: 'Cyperfor 100 EC', sku: '2071', items: 3, netRevenue: 300.15, orders: 3, variants: 3 },
          { name: 'Silwet Star', sku: '2332', items: 3, netRevenue: 14.43, orders: 3, variants: 2 },
          { name: 'Trávna zmes EXPERT - na slnečné miesta', sku: '2352', items: 3, netRevenue: 17.66, orders: 2, variants: 3 },
          { name: 'Síran draselný, 5 kg', sku: '2399', items: 3, netRevenue: 26.04, orders: 1, variants: 0 },
          { name: 'BIOPÁSY', sku: '22975', items: 3, netRevenue: 12.15, orders: 1, variants: 3 },
          { name: 'Sudánska tráva', sku: 'f75201af0400', items: 3, netRevenue: 11.25, orders: 1, variants: 0 },
          { name: 'TBM 75 WG, 100 g', sku: '1581', items: 2, netRevenue: 100.58, orders: 1, variants: 0 },
          { name: 'K - Othrine 25 SC, 1 l', sku: '1835', items: 2, netRevenue: 217.05, orders: 2, variants: 0 },
          { name: 'Champion 50 WG, 10 kg', sku: '1878', items: 2, netRevenue: 312.67, orders: 2, variants: 0 },
        ],
      },
    },
    {
      year: 2026, month: 2,
      meta: {
        spend: 672.67, impressions: 266845, reach: 122284, clicks: 4504,
        purchases: 80, purchaseValue: 3205.93, roas: 4.77, addToCart: 481,
        cpc: 0.15, costPerPurchase: 8.41,
        ads: [
          { name: "Ochráňte svoje stromy pred jarnými mrazmi", campaign: "sanaplant_conversion_frigomax", spend: 209.75, value: 1368.8, roas: 12.01, purchases: 49, costPerPurchase: 9.99, aov: 54.88, cpm: 9.87, impressions: 83638, reach: 30813, frequency: 6.37, clicks: 1549, cpc: 1.6, ctr: 4.22, addToCart: 150, costPerAddToCart: 2.85, landingPageViews: 991, costPerLandingPageView: 0.41, engagements: 1684, costPerEngagement: 1.32, saves: 28, shares: 18, comments: 7 },
          { name: "10 produktov Sanaplant 1/26", campaign: "sanaplant_general_sales", spend: 154.2, value: 1098.33, roas: 7.6, purchases: 15, costPerPurchase: 9.63, aov: 73.22, cpm: 6.2, impressions: 43990, reach: 16370, frequency: 4.37, clicks: 885, cpc: 0.33, ctr: 3.64, addToCart: 160, costPerAddToCart: 0.9, landingPageViews: 516, costPerLandingPageView: 0.66, engagements: 1432, costPerEngagement: 0.16, saves: 7, shares: 6 },
          { name: "Malý praktický balíček", campaign: "sanaplant_general_sales", spend: 57.16, value: 243.76, roas: 4.44, purchases: 5, costPerPurchase: 10.99, aov: 48.75, cpm: 8.17, impressions: 14413, reach: 7105, frequency: 3.34, clicks: 187, cpc: 0.46, ctr: 4.3, addToCart: 25, costPerAddToCart: 3.17, landingPageViews: 122, costPerLandingPageView: 0.67, engagements: 4107, costPerEngagement: 0.02, saves: 13, shares: 3 },
          { name: "Predjarná ochrana broskýň", campaign: "sanaplant_general_sales", spend: 41.62, value: 212.84, roas: 5.11, purchases: 3, costPerPurchase: 13.87, aov: 70.95, cpm: 2.39, impressions: 17417, reach: 7966, frequency: 2.19, clicks: 291, cpc: 0.14, ctr: 1.67, addToCart: 62, costPerAddToCart: 0.67, landingPageViews: 151, costPerLandingPageView: 0.28, engagements: 4355, costPerEngagement: 0.01, saves: 12, shares: 2, comments: 1 },
          { name: "Broskyne CAT", campaign: "sanaplant_general_sales", spend: 39.89, value: 42.08, roas: 2.37, purchases: 2, costPerPurchase: 39.89, aov: 42.08, cpm: 4.58, impressions: 17411, reach: 9494, frequency: 3.62, clicks: 390, cpc: 0.2, ctr: 4.51, addToCart: 30, costPerAddToCart: 4.22, landingPageViews: 252, costPerLandingPageView: 0.32, engagements: 413, costPerEngagement: 0.19, shares: 3 },
          { name: "exkluzivne_produkty", campaign: "sanaplant_product_catalog", spend: 33.4, value: 113.12, roas: 3.39, purchases: 3, costPerPurchase: 11.13, aov: 37.71, cpm: 2.14, impressions: 15612, reach: 7264, frequency: 2.15, clicks: 196, cpc: 0.17, ctr: 1.26, addToCart: 11, costPerAddToCart: 3.04, landingPageViews: 110, costPerLandingPageView: 0.3, engagements: 209, costPerEngagement: 0.16 },
          { name: "frigomax_video", campaign: "sanaplant_conversion_frigomax", spend: 32.28, value: 24.97, roas: 1.98, purchases: 1, costPerPurchase: 12.58, aov: 24.97, cpm: 9.2, impressions: 10650, reach: 6831, frequency: 4.77, clicks: 123, cpc: 1.03, ctr: 3.34, addToCart: 16, costPerAddToCart: 12.35, landingPageViews: 73, costPerLandingPageView: 2.35, engagements: 2010, costPerEngagement: 0.06, saves: 2 },
          { name: "repka_video", campaign: "sanaplant_boosting_traffic", spend: 27.06, value: 70.9, roas: 2.62, purchases: 1, costPerPurchase: 27.06, aov: 70.9, cpm: 1.41, impressions: 19153, reach: 12481, frequency: 1.53, clicks: 203, cpc: 0.13, ctr: 1.06, addToCart: 1, costPerAddToCart: 27.06, landingPageViews: 124, costPerLandingPageView: 0.22, engagements: 3991, costPerEngagement: 0.01, saves: 5, shares: 1 },
          { name: "My vieme, čo ochráni vašu záhradu. Viete to aj vy?", campaign: "sanaplant_boosting_traffic", spend: 19.98, value: 31.13, roas: 1.56, purchases: 1, costPerPurchase: 19.98, aov: 31.13, cpm: 1.44, impressions: 13884, reach: 7693, frequency: 1.8, clicks: 487, cpc: 0.04, ctr: 3.51, addToCart: 3, costPerAddToCart: 6.66, landingPageViews: 409, costPerLandingPageView: 0.05, engagements: 6816, costPerEngagement: 0, saves: 20, shares: 6 },
          { name: "Pestujete repku, slnečnicu, mak alebo sóju?", campaign: "sanaplant_general_sales", spend: 15.35, purchases: 0, cpm: 1.78, impressions: 8643, reach: 2024, frequency: 4.27, clicks: 36, cpc: 0.43, ctr: 0.42, addToCart: 14, costPerAddToCart: 1.1, landingPageViews: 13, costPerLandingPageView: 1.18, engagements: 960, costPerEngagement: 0.02, saves: 1, shares: 1 },
          { name: "TOP 10 najčastejších záhradkárskych problémov", campaign: "sanaplant_boosting", spend: 14.96, purchases: 0, cpm: 1.87, impressions: 8013, reach: 4491, frequency: 1.78, clicks: 11, cpc: 1.36, ctr: 0.14, landingPageViews: 1, costPerLandingPageView: 14.96, engagements: 116, costPerEngagement: 0.13, shares: 2, comments: 2 },
          { name: "Pestujete repku, slnečnicu, mak alebo sóju?", campaign: "sanaplant_boosting_traffic", spend: 10.73, purchases: 0, cpm: 1.44, impressions: 7438, reach: 5138, frequency: 1.45, clicks: 67, cpc: 0.16, ctr: 0.9, landingPageViews: 42, costPerLandingPageView: 0.26, engagements: 73, costPerEngagement: 0.15, saves: 1 },
          { name: "Záhradkári CAT", campaign: "sanaplant_general_sales", spend: 5.7, purchases: 0, cpm: 2.1, impressions: 2712, reach: 1957, frequency: 1.39, clicks: 40, cpc: 0.14, ctr: 1.47, addToCart: 1, costPerAddToCart: 5.7, landingPageViews: 18, costPerLandingPageView: 0.32, engagements: 42, costPerEngagement: 0.14, saves: 1 },
          { name: "Žlté lepové dosky", campaign: "sanaplant_general_sales", spend: 5.55, purchases: 0, cpm: 2.44, impressions: 2272, reach: 1723, frequency: 1.32, clicks: 26, cpc: 0.21, ctr: 1.14, addToCart: 5, costPerAddToCart: 1.11, landingPageViews: 15, costPerLandingPageView: 0.37, engagements: 31, costPerEngagement: 0.18 },
          { name: "Začiatok sezóny sa začína v pôde, ktorá je zásobená živinami.", campaign: "sanaplant_general_sales", spend: 5.04, purchases: 0, cpm: 3.15, impressions: 1599, reach: 934, frequency: 1.71, clicks: 13, cpc: 0.39, ctr: 0.81, addToCart: 3, costPerAddToCart: 1.68, landingPageViews: 5, costPerLandingPageView: 1.01, engagements: 311, costPerEngagement: 0.02, saves: 1 }
        ],
      },
      boosting: null,
      google: {
        spend: 849.42, impressions: 297596, clicks: 10025, cpc: 0.08, ctr: 3.37,
        interactions: 17649, interactionRate: 5.93, convRate: 4.79, costPerConv: 1,
        purchases: 80.32, purchaseValue: 5820.34, conversions: 551.4, roas: 6.85,
        conversionActions: { purchase: 80.32, add_to_cart: 296.13, begin_checkout: 174.95 },
        campaigns: [
          { name: "PMax_sales_products", type: "Performance Max", status: "Enabled", purchases: 76.17, value: 5699.39, conversionActions: { add_to_cart: 275.03, purchase: 76.17, begin_checkout: 109.04 } },
          { name: "PMax - Frigomax", type: "Performance Max", status: "Paused", purchases: 4.15, value: 120.95, conversionActions: { add_to_cart: 21.1, purchase: 4.15, begin_checkout: 65.9 } }
        ],
      },
      ga: {
          paid: {
            sessions: 242171,
            users: 239528,
            engagementRate: 2.11,
            avgDuration: "00:00:26"
          },
          organic: {
            sessions: 11546,
            users: 9176,
            engagementRate: 57.07,
            avgDuration: "00:11:49"
          },
          snapshot: {
            activeUsers: 248077,
            newUsers: 244486,
            sessions: 253441,
            engagedSessions: 11637,
            engagementRate: 0.04591601201068493,
            totalRevenue: 12194.450004,
            keyEvents: 8678
          },
          trafficAcquisition: [
            {
              channelGroup: "Direct",
              sessions: 238344,
              engagedSessions: 3091,
              engagementRate: 0.012968650354110026,
              avgEngagementTimePerSession: 0.42689138388211995,
              eventsPerSession: 3.7037013728056927,
              eventCount: 882755,
              keyEvents: 1700,
              sessionKeyEventRate: 0.005806733125230759,
              totalRevenue: 694.280001
            },
            {
              channelGroup: "Cross-network",
              sessions: 7955,
              engagedSessions: 4992,
              engagementRate: 0.6275298554368322,
              avgEngagementTimePerSession: 64.10949088623508,
              eventsPerSession: 6.756505342551854,
              eventCount: 53748,
              keyEvents: 4578,
              sessionKeyEventRate: 0.20703959773727215,
              totalRevenue: 5771.060003
            },
            {
              channelGroup: "Paid Social",
              sessions: 3711,
              engagedSessions: 1703,
              engagementRate: 0.4589059552681218,
              avgEngagementTimePerSession: 39.52411748854756,
              eventsPerSession: 6.175424413904608,
              eventCount: 22917,
              keyEvents: 981,
              sessionKeyEventRate: 0.10455402856372946,
              totalRevenue: 2015.96
            },
            {
              channelGroup: "Organic Search",
              sessions: 2114,
              engagedSessions: 1246,
              engagementRate: 0.5894039735099338,
              avgEngagementTimePerSession: 53.44087038789026,
              eventsPerSession: 7.369441816461684,
              eventCount: 15579,
              keyEvents: 1017,
              sessionKeyEventRate: 0.15468306527909176,
              totalRevenue: 2430.67
            },
            {
              channelGroup: "Organic Social",
              sessions: 573,
              engagedSessions: 257,
              engagementRate: 0.44851657940663175,
              avgEngagementTimePerSession: 15.328097731239092,
              eventsPerSession: 5.37696335078534,
              eventCount: 3081,
              keyEvents: 62,
              sessionKeyEventRate: 0.07504363001745201,
              totalRevenue: 107.91
            },
            {
              channelGroup: "Unassigned",
              sessions: 259,
              engagedSessions: 63,
              engagementRate: 0.24324324324324326,
              avgEngagementTimePerSession: 29.08880308880309,
              eventsPerSession: 4.374517374517374,
              eventCount: 1133,
              keyEvents: 68,
              sessionKeyEventRate: 0.08494208494208494,
              totalRevenue: 24.97
            },
            {
              channelGroup: "Email",
              sessions: 200,
              engagedSessions: 86,
              engagementRate: 0.43,
              avgEngagementTimePerSession: 67.16,
              eventsPerSession: 7.85,
              eventCount: 1570,
              keyEvents: 89,
              sessionKeyEventRate: 0.105,
              totalRevenue: 871.23
            },
            {
              channelGroup: "Referral",
              sessions: 150,
              engagedSessions: 82,
              engagementRate: 0.5466666666666666,
              avgEngagementTimePerSession: 139.76,
              eventsPerSession: 11.333333333333334,
              eventCount: 1700,
              keyEvents: 143,
              sessionKeyEventRate: 0.13333333333333333,
              totalRevenue: 278.37
            },
            {
              channelGroup: "Paid Search",
              sessions: 113,
              engagedSessions: 98,
              engagementRate: 0.8672566371681416,
              avgEngagementTimePerSession: 55.309734513274336,
              eventsPerSession: 7.469026548672566,
              eventCount: 844,
              keyEvents: 10,
              sessionKeyEventRate: 0.02654867256637168,
              totalRevenue: 0
            },
            {
              channelGroup: "Organic Shopping",
              sessions: 22,
              engagedSessions: 19,
              engagementRate: 0.8636363636363636,
              avgEngagementTimePerSession: 84.27272727272727,
              eventsPerSession: 11.818181818181818,
              eventCount: 260,
              keyEvents: 30,
              sessionKeyEventRate: 0.3181818181818182,
              totalRevenue: 0
            }
          ],
          userAcquisition: [
            {
              firstUserChannelGroup: "Direct",
              totalUsers: 236597,
              newUsers: 233833,
              returningUsers: 302,
              avgEngagementTimePerActiveUser: 0.6014608228118303,
              engagedSessionsPerActiveUser: 0.014887204696951125,
              eventCount: 888251,
              keyEvents: 2204,
              userKeyEventRate: 0.006200888498133815
            },
            {
              firstUserChannelGroup: "Cross-network",
              totalUsers: 5924,
              newUsers: 5754,
              returningUsers: 890,
              avgEngagementTimePerActiveUser: 77.77228731533367,
              engagedSessionsPerActiveUser: 0.7840040753948039,
              eventCount: 50082,
              keyEvents: 4184,
              userKeyEventRate: 0.1726948548140601
            },
            {
              firstUserChannelGroup: "Paid Social",
              totalUsers: 2860,
              newUsers: 2584,
              returningUsers: 345,
              avgEngagementTimePerActiveUser: 49.32228696285506,
              engagedSessionsPerActiveUser: 0.5797523670793882,
              eventCount: 21379,
              keyEvents: 824,
              userKeyEventRate: 0.08922068463219228
            },
            {
              firstUserChannelGroup: "Organic Search",
              totalUsers: 1739,
              newUsers: 1457,
              returningUsers: 338,
              avgEngagementTimePerActiveUser: 81.62589498806683,
              engagedSessionsPerActiveUser: 0.7834128878281623,
              eventCount: 15720,
              keyEvents: 1027,
              userKeyEventRate: 0.16288782816229117
            },
            {
              firstUserChannelGroup: "Organic Social",
              totalUsers: 533,
              newUsers: 505,
              returningUsers: 29,
              avgEngagementTimePerActiveUser: 9.669847328244275,
              engagedSessionsPerActiveUser: 0.45610687022900764,
              eventCount: 2640,
              keyEvents: 37,
              userKeyEventRate: 0.05534351145038168
            },
            {
              firstUserChannelGroup: "Paid Search",
              totalUsers: 115,
              newUsers: 110,
              returningUsers: 22,
              avgEngagementTimePerActiveUser: 107.84347826086956,
              engagedSessionsPerActiveUser: 1.1304347826086956,
              eventCount: 1378,
              keyEvents: 98,
              userKeyEventRate: 0.10434782608695652
            },
            {
              firstUserChannelGroup: "Email",
              totalUsers: 107,
              newUsers: 78,
              returningUsers: 26,
              avgEngagementTimePerActiveUser: 71.86734693877551,
              engagedSessionsPerActiveUser: 0.8367346938775511,
              eventCount: 1346,
              keyEvents: 112,
              userKeyEventRate: 0.17346938775510204
            },
            {
              firstUserChannelGroup: "Referral",
              totalUsers: 104,
              newUsers: 81,
              returningUsers: 35,
              avgEngagementTimePerActiveUser: 255.30693069306932,
              engagedSessionsPerActiveUser: 0.9405940594059405,
              eventCount: 1894,
              keyEvents: 142,
              userKeyEventRate: 0.21782178217821782
            },
            {
              firstUserChannelGroup: "Unassigned",
              totalUsers: 83,
              newUsers: 70,
              returningUsers: 13,
              avgEngagementTimePerActiveUser: 78.88461538461539,
              engagedSessionsPerActiveUser: 0.717948717948718,
              eventCount: 721,
              keyEvents: 37,
              userKeyEventRate: 0.14102564102564102
            },
            {
              firstUserChannelGroup: "Organic Shopping",
              totalUsers: 15,
              newUsers: 14,
              returningUsers: 3,
              avgEngagementTimePerActiveUser: 80.93333333333334,
              engagedSessionsPerActiveUser: 1.0666666666666667,
              eventCount: 176,
              keyEvents: 13,
              userKeyEventRate: 0.3333333333333333
            }
          ],
          landingPages: [
            {
              path: "/produkt/damisol-gold-frigomax-1-l",
              sessions: 6937,
              activeUsers: 5498,
              newUsers: 5139,
              avgEngagementTimePerSession: 64.41848061121522,
              totalRevenue: 4894.67,
              bounceRate: 0.37494594204987747,
              addToCart: 687,
              checkouts: 171,
              purchases: 123
            },
            {
              path: "/",
              sessions: 2324,
              activeUsers: 2014,
              newUsers: 1677,
              avgEngagementTimePerSession: 26.864888123924267,
              totalRevenue: 459.46,
              bounceRate: 0.7379518072289156,
              addToCart: 106,
              checkouts: 21,
              purchases: 10
            },
            {
              path: "/produkt/predjarny-postrek-na-10-l",
              sessions: 473,
              activeUsers: 435,
              newUsers: 393,
              avgEngagementTimePerSession: 51.17547568710359,
              totalRevenue: 40.1,
              bounceRate: 0.3953488372093023,
              addToCart: 47,
              checkouts: 4,
              purchases: 2
            },
            {
              path: "(not set)",
              sessions: 400,
              activeUsers: 374,
              newUsers: 233,
              avgEngagementTimePerSession: 9.6475,
              totalRevenue: 0,
              bounceRate: 0.66,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/kompletny-sprievodca-pestovanim-a-ochranou-repky-slnecnice-maku-a-soje",
              sessions: 295,
              activeUsers: 275,
              newUsers: 262,
              avgEngagementTimePerSession: 9.96271186440678,
              totalRevenue: 141.8,
              bounceRate: 0.7864406779661017,
              addToCart: 5,
              checkouts: 2,
              purchases: 2
            },
            {
              path: "/produkt/hydrohumat_1l",
              sessions: 159,
              activeUsers: 130,
              newUsers: 107,
              avgEngagementTimePerSession: 44.308176100628934,
              totalRevenue: 109.35,
              bounceRate: 0.559748427672956,
              addToCart: 22,
              checkouts: 6,
              purchases: 2
            },
            {
              path: "/produkt/prakticky-balicek-ochrany-rastlin-pre-zahradkara-maly-1-ks",
              sessions: 145,
              activeUsers: 136,
              newUsers: 128,
              avgEngagementTimePerSession: 59.30344827586207,
              totalRevenue: 31.13,
              bounceRate: 0.3793103448275862,
              addToCart: 6,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/predjarny-postrek-na-50-l",
              sessions: 137,
              activeUsers: 128,
              newUsers: 97,
              avgEngagementTimePerSession: 90.01459854014598,
              totalRevenue: 193.12,
              bounceRate: 0.2773722627737226,
              addToCart: 33,
              checkouts: 10,
              purchases: 3
            },
            {
              path: "/produkt/encyklopedia-chorob-skodcov-a-vyzivy-zahradnickych-rastlin",
              sessions: 115,
              activeUsers: 82,
              newUsers: 67,
              avgEngagementTimePerSession: 40.243478260869566,
              totalRevenue: 192.72,
              bounceRate: 0.5739130434782609,
              addToCart: 8,
              checkouts: 2,
              purchases: 3
            },
            {
              path: "/produkt/special-zemiaky-zahrada-bezchloridove-npk-11-9-2016s15mg005-b",
              sessions: 112,
              activeUsers: 97,
              newUsers: 88,
              avgEngagementTimePerSession: 53.4375,
              totalRevenue: 42.33,
              bounceRate: 0.4642857142857143,
              addToCart: 10,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/quantum-aminomax-1-l",
              sessions: 103,
              activeUsers: 81,
              newUsers: 42,
              avgEngagementTimePerSession: 49.43689320388349,
              totalRevenue: 0,
              bounceRate: 0.24271844660194175,
              addToCart: 2,
              checkouts: 2,
              purchases: 0
            },
            {
              path: "/obchod",
              sessions: 95,
              activeUsers: 94,
              newUsers: 87,
              avgEngagementTimePerSession: 159.73684210526315,
              totalRevenue: 33.65,
              bounceRate: 0.29473684210526313,
              addToCart: 19,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/signum-1-kg",
              sessions: 94,
              activeUsers: 75,
              newUsers: 55,
              avgEngagementTimePerSession: 52.42553191489362,
              totalRevenue: 176.51,
              bounceRate: 0.3723404255319149,
              addToCart: 6,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/zlte-lepove-dosky",
              sessions: 94,
              activeUsers: 84,
              newUsers: 75,
              avgEngagementTimePerSession: 39.04255319148936,
              totalRevenue: 26.21,
              bounceRate: 0.574468085106383,
              addToCart: 5,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/prakticky-balicek-ochrany-rastlin-pre-zahradkara-velky-1-ks",
              sessions: 88,
              activeUsers: 82,
              newUsers: 74,
              avgEngagementTimePerSession: 55.60227272727273,
              totalRevenue: 115.49,
              bounceRate: 0.3977272727272727,
              addToCart: 6,
              checkouts: 2,
              purchases: 2
            },
            {
              path: "/produkt/orgevit-4-3-25",
              sessions: 85,
              activeUsers: 72,
              newUsers: 53,
              avgEngagementTimePerSession: 91.70588235294117,
              totalRevenue: 63.96,
              bounceRate: 0.36470588235294116,
              addToCart: 10,
              checkouts: 5,
              purchases: 1
            },
            {
              path: "/produkt/mospilan-20-sp",
              sessions: 81,
              activeUsers: 63,
              newUsers: 54,
              avgEngagementTimePerSession: 28.444444444444443,
              totalRevenue: 0,
              bounceRate: 0.5679012345679012,
              addToCart: 3,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/vinovcerit-npk",
              sessions: 76,
              activeUsers: 56,
              newUsers: 44,
              avgEngagementTimePerSession: 35.96052631578947,
              totalRevenue: 26.75,
              bounceRate: 0.40789473684210525,
              addToCart: 7,
              checkouts: 4,
              purchases: 1
            },
            {
              path: "/produkt/superfosfat-18",
              sessions: 73,
              activeUsers: 62,
              newUsers: 51,
              avgEngagementTimePerSession: 50.95890410958904,
              totalRevenue: 0,
              bounceRate: 0.2876712328767123,
              addToCart: 12,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/liadok-27",
              sessions: 70,
              activeUsers: 63,
              newUsers: 58,
              avgEngagementTimePerSession: 35.98571428571429,
              totalRevenue: 0,
              bounceRate: 0.5571428571428572,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/luna-experience-1-l",
              sessions: 70,
              activeUsers: 57,
              newUsers: 29,
              avgEngagementTimePerSession: 127.65714285714286,
              totalRevenue: 374.69,
              bounceRate: 0.2,
              addToCart: 5,
              checkouts: 6,
              purchases: 3
            },
            {
              path: "/produkt/machozrut",
              sessions: 69,
              activeUsers: 65,
              newUsers: 63,
              avgEngagementTimePerSession: 38.57971014492754,
              totalRevenue: 0,
              bounceRate: 0.43478260869565216,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/znacka-produktu/broskyna-celorocna-ochrana-a-vyziva",
              sessions: 69,
              activeUsers: 58,
              newUsers: 50,
              avgEngagementTimePerSession: 91.28985507246377,
              totalRevenue: 35.55,
              bounceRate: 0.3188405797101449,
              addToCart: 9,
              checkouts: 2,
              purchases: 2
            },
            {
              path: "/produkt/barbarian-super-1-l",
              sessions: 67,
              activeUsers: 58,
              newUsers: 39,
              avgEngagementTimePerSession: 32.67164179104478,
              totalRevenue: 0,
              bounceRate: 0.3880597014925373,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/kategoria-produktu/exkluzivne-produkty",
              sessions: 62,
              activeUsers: 60,
              newUsers: 59,
              avgEngagementTimePerSession: 4.806451612903226,
              totalRevenue: 0,
              bounceRate: 0.8387096774193549,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/predjarny-postrek-na-25-l",
              sessions: 60,
              activeUsers: 55,
              newUsers: 43,
              avgEngagementTimePerSession: 52.06666666666667,
              totalRevenue: 0,
              bounceRate: 0.4666666666666667,
              addToCart: 8,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/pocahontas-premiovy-stolovy-zemiak-28-40-mm",
              sessions: 58,
              activeUsers: 46,
              newUsers: 43,
              avgEngagementTimePerSession: 7.482758620689655,
              totalRevenue: 0,
              bounceRate: 0.6379310344827587,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/biopasy",
              sessions: 57,
              activeUsers: 55,
              newUsers: 51,
              avgEngagementTimePerSession: 46.50877192982456,
              totalRevenue: 0,
              bounceRate: 0.47368421052631576,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/champion-50-wg",
              sessions: 56,
              activeUsers: 50,
              newUsers: 42,
              avgEngagementTimePerSession: 34.30357142857143,
              totalRevenue: 13.91,
              bounceRate: 0.48214285714285715,
              addToCart: 6,
              checkouts: 0,
              purchases: 1
            },
            {
              path: "/produkt/signum",
              sessions: 56,
              activeUsers: 51,
              newUsers: 38,
              avgEngagementTimePerSession: 40.017857142857146,
              totalRevenue: 0,
              bounceRate: 0.375,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/sivanto-prime-1-l",
              sessions: 52,
              activeUsers: 44,
              newUsers: 34,
              avgEngagementTimePerSession: 56.86538461538461,
              totalRevenue: 125.14,
              bounceRate: 0.46153846153846156,
              addToCart: 2,
              checkouts: 4,
              purchases: 1
            },
            {
              path: "/produkt/zlte-moerickeho-misky",
              sessions: 51,
              activeUsers: 48,
              newUsers: 45,
              avgEngagementTimePerSession: 30.176470588235293,
              totalRevenue: 28.06,
              bounceRate: 0.47058823529411764,
              addToCart: 6,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/virkon-s-50-g",
              sessions: 49,
              activeUsers: 46,
              newUsers: 44,
              avgEngagementTimePerSession: 62.93877551020408,
              totalRevenue: 25.35,
              bounceRate: 0.40816326530612246,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/mustang-forte-5-l",
              sessions: 46,
              activeUsers: 44,
              newUsers: 31,
              avgEngagementTimePerSession: 72.41304347826087,
              totalRevenue: 0,
              bounceRate: 0.3695652173913043,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/quantum-ultra-complex-1-l",
              sessions: 46,
              activeUsers: 35,
              newUsers: 24,
              avgEngagementTimePerSession: 111.3695652173913,
              totalRevenue: 0,
              bounceRate: 0.391304347826087,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/trava-timotejka-lucna-lema-1-kg",
              sessions: 44,
              activeUsers: 42,
              newUsers: 40,
              avgEngagementTimePerSession: 52.18181818181818,
              totalRevenue: 0,
              bounceRate: 0.3409090909090909,
              addToCart: 3,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/kategoria-produktu/zahradkari",
              sessions: 42,
              activeUsers: 33,
              newUsers: 29,
              avgEngagementTimePerSession: 85.23809523809524,
              totalRevenue: 43.41,
              bounceRate: 0.5476190476190477,
              addToCart: 3,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/delan-700-wdg-1-kg",
              sessions: 42,
              activeUsers: 37,
              newUsers: 27,
              avgEngagementTimePerSession: 65.02380952380952,
              totalRevenue: 201.41,
              bounceRate: 0.3333333333333333,
              addToCart: 11,
              checkouts: 4,
              purchases: 3
            },
            {
              path: "/produkt/siran-amonny",
              sessions: 42,
              activeUsers: 37,
              newUsers: 32,
              avgEngagementTimePerSession: 57.07142857142857,
              totalRevenue: 24.97,
              bounceRate: 0.38095238095238093,
              addToCart: 3,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/syllit-544-sc-5-l",
              sessions: 41,
              activeUsers: 34,
              newUsers: 28,
              avgEngagementTimePerSession: 26.585365853658537,
              totalRevenue: 227.87,
              bounceRate: 0.4878048780487805,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/nissorun-10-wp",
              sessions: 40,
              activeUsers: 33,
              newUsers: 30,
              avgEngagementTimePerSession: 30.775,
              totalRevenue: 0,
              bounceRate: 0.525,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/garlon-new-5-l",
              sessions: 39,
              activeUsers: 37,
              newUsers: 36,
              avgEngagementTimePerSession: 41.46153846153846,
              totalRevenue: 346.58,
              bounceRate: 0.41025641025641024,
              addToCart: 2,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/previcur-energy-1-l",
              sessions: 39,
              activeUsers: 37,
              newUsers: 26,
              avgEngagementTimePerSession: 47.53846153846154,
              totalRevenue: 0,
              bounceRate: 0.38461538461538464,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/sudanska-trava",
              sessions: 39,
              activeUsers: 38,
              newUsers: 35,
              avgEngagementTimePerSession: 74.74358974358974,
              totalRevenue: 0,
              bounceRate: 0.41025641025641024,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/thiovit-jet-10-kg",
              sessions: 38,
              activeUsers: 34,
              newUsers: 27,
              avgEngagementTimePerSession: 49.973684210526315,
              totalRevenue: 76.98,
              bounceRate: 0.42105263157894735,
              addToCart: 4,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/k-othrine-25-sc-1-l",
              sessions: 37,
              activeUsers: 33,
              newUsers: 31,
              avgEngagementTimePerSession: 43.2972972972973,
              totalRevenue: 833.46,
              bounceRate: 0.24324324324324326,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/serenade-aso-5-l",
              sessions: 37,
              activeUsers: 32,
              newUsers: 23,
              avgEngagementTimePerSession: 121.62162162162163,
              totalRevenue: 112.24,
              bounceRate: 0.3783783783783784,
              addToCart: 4,
              checkouts: 6,
              purchases: 1
            },
            {
              path: "/produkt/cuproxat-sc",
              sessions: 36,
              activeUsers: 33,
              newUsers: 30,
              avgEngagementTimePerSession: 40.05555555555556,
              totalRevenue: 0,
              bounceRate: 0.5555555555555556,
              addToCart: 4,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/darium-5-l",
              sessions: 36,
              activeUsers: 29,
              newUsers: 19,
              avgEngagementTimePerSession: 37.55555555555556,
              totalRevenue: 0,
              bounceRate: 0.4722222222222222,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/flowbrix",
              sessions: 36,
              activeUsers: 33,
              newUsers: 21,
              avgEngagementTimePerSession: 47.47222222222222,
              totalRevenue: 40.23,
              bounceRate: 0.4444444444444444,
              addToCart: 2,
              checkouts: 2,
              purchases: 1
            }
          ],
          ecommerceItems: [
            {
              name: "Damisol Gold Frigomax, 1 l",
              itemsViewed: 2042,
              itemsAddedToCart: 923,
              itemsPurchased: 160,
              itemRevenue: 2950.40001
            },
            {
              name: "K - Othrine 25 SC, 1 l",
              itemsViewed: 15,
              itemsAddedToCart: 6,
              itemsPurchased: 6,
              itemRevenue: 832.439999
            },
            {
              name: "Luna Experience, 1 l",
              itemsViewed: 75,
              itemsAddedToCart: 9,
              itemsPurchased: 5,
              itemRevenue: 621.150001
            },
            {
              name: "Vaztak Pro, 5 l",
              itemsViewed: 4,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 426.16
            },
            {
              name: "Maister Power, 5 l",
              itemsViewed: 12,
              itemsAddedToCart: 62,
              itemsPurchased: 1,
              itemRevenue: 419.18
            },
            {
              name: "Predjarný postrek na 50 l, 500 + 25 ml",
              itemsViewed: 103,
              itemsAddedToCart: 59,
              itemsPurchased: 31,
              itemRevenue: 363.009993
            },
            {
              name: "Simplia, 5 l",
              itemsViewed: 5,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 362.39
            },
            {
              name: "Garlon New, 5 l",
              itemsViewed: 15,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 345.580001
            },
            {
              name: "Encyklopédia chorôb, škodcov a výživy záhradníckych rastlín",
              itemsViewed: 31,
              itemsAddedToCart: 25,
              itemsPurchased: 7,
              itemRevenue: 327.5
            },
            {
              name: "Kompletný  sprievodca pestovaním  a ochranou repky,  slnečnice,  maku a sóje",
              itemsViewed: 22,
              itemsAddedToCart: 9,
              itemsPurchased: 4,
              itemRevenue: 279.6
            },
            {
              name: "Delan 700 WDG, 1 kg",
              itemsViewed: 21,
              itemsAddedToCart: 14,
              itemsPurchased: 4,
              itemRevenue: 265.88
            },
            {
              name: "Sivanto Prime, 1 l",
              itemsViewed: 24,
              itemsAddedToCart: 5,
              itemsPurchased: 2,
              itemRevenue: 260.8
            },
            {
              name: "Dicopur M 750, 10 l",
              itemsViewed: 8,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 241.26
            },
            {
              name: "Syllit 544 SC, 5 l",
              itemsViewed: 25,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 226.87
            },
            {
              name: "Raykat Start, 10 l",
              itemsViewed: 7,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 214.12
            },
            {
              name: "Champion 50 WG, 10 kg",
              itemsViewed: 7,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 194.04
            },
            {
              name: "Stabilan 750 SL, 20 l",
              itemsViewed: 5,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 160.05
            },
            {
              name: "Globaryll 100, 1 l",
              itemsViewed: 1,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 157.16
            },
            {
              name: "Praktický balíček ochrany rastlín pre záhradkára - Veľký, 1 ks",
              itemsViewed: 33,
              itemsAddedToCart: 9,
              itemsPurchased: 3,
              itemRevenue: 146.1
            },
            {
              name: "Signum, 1 kg",
              itemsViewed: 52,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 136.89
            },
            {
              name: "Lucerna siata - Giulia",
              itemsViewed: 19,
              itemsAddedToCart: 7,
              itemsPurchased: 2,
              itemRevenue: 136.68
            },
            {
              name: "TBM 75 WG, 100 g",
              itemsViewed: 5,
              itemsAddedToCart: 3,
              itemsPurchased: 2,
              itemRevenue: 123.719999
            },
            {
              name: "Airone SC, 5 l",
              itemsViewed: 13,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 119.47
            },
            {
              name: "Champion 50 WG",
              itemsViewed: 93,
              itemsAddedToCart: 59,
              itemsPurchased: 18,
              itemRevenue: 116.540002
            },
            {
              name: "Serenade ASO, 5 l",
              itemsViewed: 29,
              itemsAddedToCart: 5,
              itemsPurchased: 1,
              itemRevenue: 112.24
            },
            {
              name: "Žlté lepové dosky",
              itemsViewed: 40,
              itemsAddedToCart: 61,
              itemsPurchased: 17,
              itemRevenue: 83.639996
            },
            {
              name: "Quantum AquaSil, 5 l",
              itemsViewed: 8,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 78.420001
            },
            {
              name: "Thiovit Jet, 10 kg",
              itemsViewed: 32,
              itemsAddedToCart: 5,
              itemsPurchased: 1,
              itemRevenue: 75.98
            },
            {
              name: "Signum",
              itemsViewed: 78,
              itemsAddedToCart: 41,
              itemsPurchased: 10,
              itemRevenue: 72.200002
            },
            {
              name: "Taegro, 0,375 kg",
              itemsViewed: 7,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 71.19
            },
            {
              name: "Orgevit (4-3-2,5)",
              itemsViewed: 12,
              itemsAddedToCart: 28,
              itemsPurchased: 4,
              itemRevenue: 63.96
            },
            {
              name: "Quantum Boron Active, 5 l",
              itemsViewed: 8,
              itemsAddedToCart: 3,
              itemsPurchased: 2,
              itemRevenue: 62.22
            },
            {
              name: "Trávna zmes EXPERT - park",
              itemsViewed: 13,
              itemsAddedToCart: 32,
              itemsPurchased: 8,
              itemRevenue: 61.120001
            },
            {
              name: "Tegoplant Spu, 1 l",
              itemsViewed: 2,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 60.86
            },
            {
              name: "Laudis OD, 1 l",
              itemsViewed: 13,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 58.06
            },
            {
              name: "Špeciál zemiaky, záhrada - bezchloridové NPK 11-9-20+16S+1,5Mg+0,05 B",
              itemsViewed: 56,
              itemsAddedToCart: 33,
              itemsPurchased: 4,
              itemRevenue: 55.38
            },
            {
              name: "HydroHumat, 1 l",
              itemsViewed: 48,
              itemsAddedToCart: 17,
              itemsPurchased: 4,
              itemRevenue: 51.68
            },
            {
              name: "Praktický balíček ochrany rastlín pre záhradkára - Malý, 1 ks",
              itemsViewed: 42,
              itemsAddedToCart: 9,
              itemsPurchased: 2,
              itemRevenue: 49.2
            },
            {
              name: "Katalóg - Prípravky na ochranu rastlín 2025",
              itemsViewed: 14,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 44.28
            },
            {
              name: "Karate Zeon 5 CS",
              itemsViewed: 23,
              itemsAddedToCart: 19,
              itemsPurchased: 6,
              itemRevenue: 41.809999
            },
            {
              name: "Dynali",
              itemsViewed: 21,
              itemsAddedToCart: 8,
              itemsPurchased: 6,
              itemRevenue: 38.849999
            },
            {
              name: "Predjarný postrek na 10 l, 100+5 ml",
              itemsViewed: 92,
              itemsAddedToCart: 75,
              itemsPurchased: 10,
              itemRevenue: 38.600002
            },
            {
              name: "Bellis",
              itemsViewed: 12,
              itemsAddedToCart: 35,
              itemsPurchased: 12,
              itemRevenue: 34.679997
            },
            {
              name: "Flowbrix",
              itemsViewed: 12,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 33.7
            },
            {
              name: "Spectrum",
              itemsViewed: 12,
              itemsAddedToCart: 2,
              itemsPurchased: 2,
              itemRevenue: 32.72
            },
            {
              name: "Predjarný postrek na 25 l, 250 + 12,5 ml",
              itemsViewed: 54,
              itemsAddedToCart: 10,
              itemsPurchased: 4,
              itemRevenue: 27.6
            },
            {
              name: "Vin-OVO-cerit",
              itemsViewed: 63,
              itemsAddedToCart: 17,
              itemsPurchased: 3,
              itemRevenue: 22.67
            },
            {
              name: "Žlté Moerickeho misky",
              itemsViewed: 29,
              itemsAddedToCart: 10,
              itemsPurchased: 2,
              itemRevenue: 21.54
            },
            {
              name: "Tráva - Mätonoh jednoročný Mowestra 1 kg",
              itemsViewed: 1,
              itemsAddedToCart: 2,
              itemsPurchased: 5,
              itemRevenue: 20
            },
            {
              name: "Agil 100 EC",
              itemsViewed: 14,
              itemsAddedToCart: 3,
              itemsPurchased: 2,
              itemRevenue: 19.44
            }
          ]
        },
      email: {
        sent: null, openRate: 16.97, clickRate: 1.03, uniqueClicks: 227,
        unsubRate: 0.24, orders: 2, revenue: 45.87, campaignsCount: 4,
      },
      eshop: {
        woocommerce: true,
        revenue: 22046.88,
        netRevenue: 17590.5,
        grossSales: 17681.3,
        orders: 299,
        items: 1770,
        variants: 1237,
        refunds: 0,
        coupons: 90.8,
        taxes: 3618.41,
        shipping: 837.97,
        products: [
          { name: 'Žlté lepové dosky', sku: '2408', items: 917, netRevenue: 437, orders: 4, variants: 2 },
          { name: 'Damisol Gold Frigomax, 1 l', sku: '3032', items: 241, netRevenue: 3603.6, orders: 202, variants: 0 },
          { name: 'Orgevit (4-3-2,5)', sku: '3008', items: 63, netRevenue: 593, orders: 4, variants: 3 },
          { name: 'Predjarný postrek na 50 l, 500 + 25 ml', sku: '2376', items: 43, netRevenue: 408.64, orders: 19, variants: 0 },
          { name: 'Champion 50 WG', sku: '2291', items: 41, netRevenue: 164.36, orders: 26, variants: 4 },
          { name: 'Kompletný sprievodca pestovaním a ochranou repky, slnečnice, maku a sóje', sku: '3044-1', items: 40, netRevenue: 2458.51, orders: 11, variants: 0 },
          { name: 'Bellis', sku: '2285', items: 21, netRevenue: 42.5, orders: 6, variants: 2 },
          { name: 'Trávna zmes EXPERT - park', sku: '2351', items: 21, netRevenue: 128.73, orders: 3, variants: 2 },
          { name: 'Predjarný postrek na 10 l, 100+5 ml', sku: '2339', items: 16, netRevenue: 50.24, orders: 10, variants: 0 },
          { name: 'Tráva - Kostrava ovčia Ridu 1 kg', sku: '22791-2', items: 16, netRevenue: 54.4, orders: 1, variants: 0 },
          { name: 'Signum', sku: '2304', items: 15, netRevenue: 87.34, orders: 10, variants: 3 },
          { name: 'Mospilan 20 SP', sku: '2322', items: 14, netRevenue: 20.58, orders: 7, variants: 3 },
          { name: 'Encyklopédia chorôb, škodcov a výživy záhradníckych rastlín', sku: '3044', items: 12, netRevenue: 654.99, orders: 12, variants: 2 },
          { name: 'Predjarný postrek na 25 l, 250 + 12,5 ml', sku: '2347', items: 10, netRevenue: 56.1, orders: 7, variants: 0 },
          { name: 'Vin-OVO-cerit', sku: '2404', items: 9, netRevenue: 70.35, orders: 6, variants: 2 },
          { name: 'Delan 700 WDG, 1 kg', sku: '1869', items: 8, netRevenue: 432.32, orders: 7, variants: 0 },
          { name: 'Karate Zeon 5 CS', sku: '2320', items: 8, netRevenue: 43.28, orders: 6, variants: 3 },
          { name: 'HydroHumat, 1 l', sku: '3033', items: 8, netRevenue: 82.43, orders: 6, variants: 0 },
          { name: 'K - Othrine 25 SC, 1 l', sku: '1835', items: 7, netRevenue: 789.6, orders: 2, variants: 0 },
          { name: 'Špeciál zemiaky, záhrada - bezchloridové NPK 11-9-20+16S+1,5Mg+0,05 B', sku: '2397', items: 7, netRevenue: 67.67, orders: 5, variants: 2 },
          { name: 'Žlté Moerickeho misky', sku: '2409', items: 7, netRevenue: 61.25, orders: 3, variants: 0 },
          { name: 'Buzzin', sku: '2282', items: 6, netRevenue: 34.45, orders: 2, variants: 3 },
          { name: 'Dynali', sku: '2288', items: 6, netRevenue: 31.57, orders: 3, variants: 2 },
          { name: 'BIOPÁSY', sku: '22975', items: 6, netRevenue: 22.8, orders: 2, variants: 3 },
          { name: 'Lucerna siata - Vlasta', sku: '5a211b75578c', items: 6, netRevenue: 42, orders: 2, variants: 3 },
        ],
      },
    },
    {
      year: 2026, month: 3,
      meta: {
        spend: 609.52, impressions: 273027, reach: 85612, clicks: 4923,
        purchases: 163, purchaseValue: 6320.08, roas: 10.37, addToCart: 704,
        cpc: 0.12, costPerPurchase: 3.74,
        ads: [
          { name: "Ochráňte svoje stromy pred jarnými mrazmi", campaign: "sanaplant_conversion_frigomax", spend: 352.31, value: 3999.4, roas: 11.35, purchases: 132, costPerPurchase: 2.67, aov: 30.3, cpm: 2.22, impressions: 158546, reach: 36545, frequency: 4.34, clicks: 2907, cpc: 0.12, ctr: 1.83, addToCart: 405, costPerAddToCart: 0.87, landingPageViews: 1857, costPerLandingPageView: 0.19, engagements: 3166, costPerEngagement: 0.11, saves: 51, shares: 59, comments: 12 },
          { name: "10 produktov Sanaplant 1/26", campaign: "sanaplant_general_sales", spend: 151.55, value: 2266.31, roas: 14.95, purchases: 29, costPerPurchase: 5.23, aov: 78.15, cpm: 3.18, impressions: 47738, reach: 15578, frequency: 4.07, clicks: 859, cpc: 0.18, ctr: 1.8, addToCart: 231, costPerAddToCart: 0.66, landingPageViews: 495, costPerLandingPageView: 0.31, engagements: 2115, costPerEngagement: 0.07, saves: 7, shares: 4 },
          { name: "Malý praktický balíček", campaign: "sanaplant_general_sales", spend: 22.35, value: 35.69, roas: 1.6, purchases: 1, costPerPurchase: 22.35, aov: 35.69, cpm: 3.55, impressions: 6291, reach: 3803, frequency: 1.65, clicks: 38, cpc: 0.59, ctr: 0.6, addToCart: 39, costPerAddToCart: 0.57, landingPageViews: 19, costPerLandingPageView: 1.18, engagements: 1374, costPerEngagement: 0.02, saves: 2, shares: 3 },
          { name: "MYCOFiX – mikrobiálny biostimulant na podporu koreňov a lepšieho využitia živín.", campaign: "sanaplant_boosting_traffic", spend: 19.99, purchases: 0, cpm: 1.26, impressions: 15863, reach: 8203, frequency: 1.93, clicks: 300, cpc: 0.07, ctr: 1.89, addToCart: 1, costPerAddToCart: 19.99, landingPageViews: 236, costPerLandingPageView: 0.08, engagements: 318, costPerEngagement: 0.06, saves: 1, shares: 1 },
          { name: "Spolu za zdravý vinič", campaign: "sanaplant_boosting_traffic", spend: 19.96, purchases: 0, cpm: 1.39, impressions: 14383, reach: 5510, frequency: 2.61, clicks: 308, cpc: 0.06, ctr: 2.14, addToCart: 4, costPerAddToCart: 4.99, landingPageViews: 272, costPerLandingPageView: 0.07, engagements: 349, costPerEngagement: 0.06, saves: 2, shares: 4 },
          { name: "Či už plánujete výsev v záhrade...", campaign: "sanaplant_boosting_traffic", spend: 19.94, value: 18.68, roas: 0.94, purchases: 1, costPerPurchase: 19.94, aov: 18.68, cpm: 1.16, impressions: 17212, reach: 9039, frequency: 1.9, clicks: 257, cpc: 0.08, ctr: 1.49, addToCart: 3, costPerAddToCart: 6.65, landingPageViews: 179, costPerLandingPageView: 0.11, engagements: 280, costPerEngagement: 0.07, shares: 1, comments: 1 },
          { name: "Viete, čo najviac ovplyvní úrodu v júli?", campaign: "sanaplant_boosting_traffic", spend: 19.93, purchases: 0, cpm: 1.77, impressions: 11267, reach: 5550, frequency: 2.03, clicks: 234, cpc: 0.09, ctr: 2.08, addToCart: 19, costPerAddToCart: 1.05, landingPageViews: 114, costPerLandingPageView: 0.17, engagements: 241, costPerEngagement: 0.08, saves: 1, shares: 1 },
          { name: "Žlté lepové dosky", campaign: "sanaplant_general_sales", spend: 3.49, purchases: 0, cpm: 2.02, impressions: 1727, reach: 1384, frequency: 1.25, clicks: 20, cpc: 0.17, ctr: 1.16, addToCart: 2, costPerAddToCart: 1.75, landingPageViews: 14, costPerLandingPageView: 0.25, engagements: 22, costPerEngagement: 0.16 }
        ],
      },
      boosting: null,
      google: {
        spend: 1057.41, impressions: 331796, clicks: 11595, cpc: 0.09, ctr: 3.49,
        interactions: 19755, interactionRate: 5.95, convRate: 9.3, costPerConv: 0.58,
        purchases: 246.56, purchaseValue: 14920.76, conversions: 1373.21, roas: 14.11,
        conversionActions: { purchase: 246.56, add_to_cart: 626.62, begin_checkout: 500.03 },
        campaigns: [
          { name: "PMax_sales_products", type: "Performance Max", status: "Enabled", purchases: 246.56, value: 14920.76, conversionActions: { add_to_cart: 626.62, purchase: 246.56, begin_checkout: 351.34 } },
          { name: "PMax - Frigomax", type: "Performance Max", status: "Paused", purchases: 0, value: 0, conversionActions: { begin_checkout: 148.69 } }
        ],
      },
      ga: {
          paid: {
            sessions: 8964,
            users: 7538,
            engagementRate: 45.81,
            avgDuration: "00:16:34"
          },
          organic: {
            sessions: 13371,
            users: 10333,
            engagementRate: 59.02,
            avgDuration: "00:16:47"
          },
          snapshot: {
            activeUsers: 17403,
            newUsers: 15179,
            sessions: 22188,
            engagedSessions: 11896,
            engagementRate: 0.5361456643230575,
            totalRevenue: 25029.650003,
            keyEvents: 16252
          },
          trafficAcquisition: [
            {
              channelGroup: "Cross-network",
              sessions: 9381,
              engagedSessions: 5732,
              engagementRate: 0.6110222790747255,
              avgEngagementTimePerSession: 61.20328323206481,
              eventsPerSession: 7.374267135699819,
              eventCount: 69178,
              keyEvents: 9844,
              sessionKeyEventRate: 0.37181537149557614,
              totalRevenue: 13549.63
            },
            {
              channelGroup: "Organic Search",
              sessions: 4291,
              engagedSessions: 2537,
              engagementRate: 0.5912374737823352,
              avgEngagementTimePerSession: 48.65532509904451,
              eventsPerSession: 7.3498019109764625,
              eventCount: 31538,
              keyEvents: 3356,
              sessionKeyEventRate: 0.2840829643439758,
              totalRevenue: 5117.830001
            },
            {
              channelGroup: "Paid Social",
              sessions: 4061,
              engagedSessions: 2197,
              engagementRate: 0.5409997537552327,
              avgEngagementTimePerSession: 55.451859147993105,
              eventsPerSession: 6.607239596158582,
              eventCount: 26832,
              keyEvents: 1604,
              sessionKeyEventRate: 0.1310022162029057,
              totalRevenue: 2932.260002
            },
            {
              channelGroup: "Direct",
              sessions: 3120,
              engagedSessions: 729,
              engagementRate: 0.23365384615384616,
              avgEngagementTimePerSession: 19.922115384615385,
              eventsPerSession: 5.910576923076923,
              eventCount: 18441,
              keyEvents: 717,
              sessionKeyEventRate: 0.06506410256410257,
              totalRevenue: 2012.7
            },
            {
              channelGroup: "Organic Social",
              sessions: 492,
              engagedSessions: 234,
              engagementRate: 0.47560975609756095,
              avgEngagementTimePerSession: 23.414634146341463,
              eventsPerSession: 5.477642276422764,
              eventCount: 2695,
              keyEvents: 67,
              sessionKeyEventRate: 0.06504065040650407,
              totalRevenue: 219.72
            },
            {
              channelGroup: "Unassigned",
              sessions: 290,
              engagedSessions: 153,
              engagementRate: 0.5275862068965518,
              avgEngagementTimePerSession: 29.44137931034483,
              eventsPerSession: 6.551724137931035,
              eventCount: 1900,
              keyEvents: 211,
              sessionKeyEventRate: 0.32413793103448274,
              totalRevenue: 295.42
            },
            {
              channelGroup: "Referral",
              sessions: 274,
              engagedSessions: 150,
              engagementRate: 0.5474452554744526,
              avgEngagementTimePerSession: 55.558394160583944,
              eventsPerSession: 9.299270072992702,
              eventCount: 2548,
              keyEvents: 236,
              sessionKeyEventRate: 0.24817518248175183,
              totalRevenue: 357.98
            },
            {
              channelGroup: "Email",
              sessions: 128,
              engagedSessions: 49,
              engagementRate: 0.3828125,
              avgEngagementTimePerSession: 51.65625,
              eventsPerSession: 7.7890625,
              eventCount: 997,
              keyEvents: 126,
              sessionKeyEventRate: 0.1484375,
              totalRevenue: 215.23
            },
            {
              channelGroup: "Paid Search",
              sessions: 96,
              engagedSessions: 80,
              engagementRate: 0.8333333333333334,
              avgEngagementTimePerSession: 17.104166666666668,
              eventsPerSession: 5.427083333333333,
              eventCount: 521,
              keyEvents: 25,
              sessionKeyEventRate: 0.11458333333333333,
              totalRevenue: 172.3
            },
            {
              channelGroup: "Organic Shopping",
              sessions: 55,
              engagedSessions: 35,
              engagementRate: 0.6363636363636364,
              avgEngagementTimePerSession: 93.2909090909091,
              eventsPerSession: 9.090909090909092,
              eventCount: 500,
              keyEvents: 66,
              sessionKeyEventRate: 0.3090909090909091,
              totalRevenue: 156.58
            }
          ],
          userAcquisition: [
            {
              firstUserChannelGroup: "Cross-network",
              totalUsers: 6780,
              newUsers: 5807,
              returningUsers: 1558,
              avgEngagementTimePerActiveUser: 80.0267071320182,
              engagedSessionsPerActiveUser: 0.8268588770864946,
              eventCount: 66058,
              keyEvents: 9235,
              userKeyEventRate: 0.31471927162367225
            },
            {
              firstUserChannelGroup: "Organic Search",
              totalUsers: 3309,
              newUsers: 2851,
              returningUsers: 620,
              avgEngagementTimePerActiveUser: 63.044209215442095,
              engagedSessionsPerActiveUser: 0.7833125778331258,
              eventCount: 30276,
              keyEvents: 3247,
              userKeyEventRate: 0.2487546699875467
            },
            {
              firstUserChannelGroup: "Direct",
              totalUsers: 3164,
              newUsers: 2918,
              returningUsers: 273,
              avgEngagementTimePerActiveUser: 33.819967793880835,
              engagedSessionsPerActiveUser: 0.3426731078904992,
              eventCount: 23090,
              keyEvents: 1398,
              userKeyEventRate: 0.0856682769726248
            },
            {
              firstUserChannelGroup: "Paid Social",
              totalUsers: 3140,
              newUsers: 2694,
              returningUsers: 487,
              avgEngagementTimePerActiveUser: 72.75805904309468,
              engagedSessionsPerActiveUser: 0.7271801832371904,
              eventCount: 26078,
              keyEvents: 1527,
              userKeyEventRate: 0.13064133016627077
            },
            {
              firstUserChannelGroup: "Organic Social",
              totalUsers: 434,
              newUsers: 404,
              returningUsers: 30,
              avgEngagementTimePerActiveUser: 24.80235294117647,
              engagedSessionsPerActiveUser: 0.548235294117647,
              eventCount: 2512,
              keyEvents: 50,
              userKeyEventRate: 0.058823529411764705
            },
            {
              firstUserChannelGroup: "Unassigned",
              totalUsers: 197,
              newUsers: 186,
              returningUsers: 28,
              avgEngagementTimePerActiveUser: 125.46875,
              engagedSessionsPerActiveUser: 0.75,
              eventCount: 2192,
              keyEvents: 256,
              userKeyEventRate: 0.2760416666666667
            },
            {
              firstUserChannelGroup: "Referral",
              totalUsers: 183,
              newUsers: 161,
              returningUsers: 38,
              avgEngagementTimePerActiveUser: 72.99444444444444,
              engagedSessionsPerActiveUser: 0.75,
              eventCount: 2067,
              keyEvents: 234,
              userKeyEventRate: 0.2777777777777778
            },
            {
              firstUserChannelGroup: "Paid Search",
              totalUsers: 89,
              newUsers: 77,
              returningUsers: 15,
              avgEngagementTimePerActiveUser: 36.47674418604651,
              engagedSessionsPerActiveUser: 1.0116279069767442,
              eventCount: 667,
              keyEvents: 45,
              userKeyEventRate: 0.1511627906976744
            },
            {
              firstUserChannelGroup: "Email",
              totalUsers: 68,
              newUsers: 44,
              returningUsers: 26,
              avgEngagementTimePerActiveUser: 208.93939393939394,
              engagedSessionsPerActiveUser: 1.4242424242424243,
              eventCount: 1771,
              keyEvents: 203,
              userKeyEventRate: 0.3181818181818182
            },
            {
              firstUserChannelGroup: "Organic Shopping",
              totalUsers: 39,
              newUsers: 37,
              returningUsers: 4,
              avgEngagementTimePerActiveUser: 126.6923076923077,
              engagedSessionsPerActiveUser: 0.7948717948717948,
              eventCount: 439,
              keyEvents: 57,
              userKeyEventRate: 0.28205128205128205
            }
          ],
          landingPages: [
            {
              path: "/produkt/damisol-gold-frigomax-1-l",
              sessions: 9263,
              activeUsers: 6846,
              newUsers: 5955,
              avgEngagementTimePerSession: 60.14099103961999,
              totalRevenue: 9555.04,
              bounceRate: 0.4014897981215589,
              addToCart: 1396,
              checkouts: 498,
              purchases: 322
            },
            {
              path: "/",
              sessions: 1284,
              activeUsers: 1110,
              newUsers: 952,
              avgEngagementTimePerSession: 45.148753894081,
              totalRevenue: 1318.05,
              bounceRate: 0.7032710280373832,
              addToCart: 155,
              checkouts: 29,
              purchases: 15
            },
            {
              path: "/zlate-zltnutie-vinica",
              sessions: 309,
              activeUsers: 246,
              newUsers: 211,
              avgEngagementTimePerSession: 71.63754045307444,
              totalRevenue: 0,
              bounceRate: 0.5080906148867314,
              addToCart: 5,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/mycofix-mikrobialny-biostimulant-mykorizne-huby",
              sessions: 270,
              activeUsers: 215,
              newUsers: 190,
              avgEngagementTimePerSession: 18.75925925925926,
              totalRevenue: 68.88,
              bounceRate: 0.6444444444444445,
              addToCart: 2,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/kategoria-produktu/osiva",
              sessions: 242,
              activeUsers: 211,
              newUsers: 194,
              avgEngagementTimePerSession: 38.38429752066116,
              totalRevenue: 79.31,
              bounceRate: 0.49173553719008267,
              addToCart: 7,
              checkouts: 3,
              purchases: 2
            },
            {
              path: "/produkt/predjarny-postrek-na-10-l",
              sessions: 241,
              activeUsers: 229,
              newUsers: 214,
              avgEngagementTimePerSession: 37.045643153526974,
              totalRevenue: 0,
              bounceRate: 0.4107883817427386,
              addToCart: 7,
              checkouts: 5,
              purchases: 0
            },
            {
              path: "/odborna-poradna",
              sessions: 205,
              activeUsers: 157,
              newUsers: 148,
              avgEngagementTimePerSession: 12.414634146341463,
              totalRevenue: 0,
              bounceRate: 0.5609756097560976,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/predjarny-postrek-na-50-l",
              sessions: 175,
              activeUsers: 166,
              newUsers: 130,
              avgEngagementTimePerSession: 53.38857142857143,
              totalRevenue: 262.35,
              bounceRate: 0.3485714285714286,
              addToCart: 36,
              checkouts: 6,
              purchases: 4
            },
            {
              path: "/produkt/hydrohumat_1l",
              sessions: 174,
              activeUsers: 133,
              newUsers: 103,
              avgEngagementTimePerSession: 34.764367816091955,
              totalRevenue: 25.95,
              bounceRate: 0.45977011494252873,
              addToCart: 5,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "(not set)",
              sessions: 172,
              activeUsers: 114,
              newUsers: 92,
              avgEngagementTimePerSession: 10.88953488372093,
              totalRevenue: 64.87,
              bounceRate: 0.7906976744186046,
              addToCart: 7,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/special-zemiaky-zahrada-bezchloridove-npk-11-9-2016s15mg005-b",
              sessions: 116,
              activeUsers: 103,
              newUsers: 99,
              avgEngagementTimePerSession: 49.12068965517241,
              totalRevenue: 0,
              bounceRate: 0.4827586206896552,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/stabilan-750-sl-20-l",
              sessions: 100,
              activeUsers: 82,
              newUsers: 49,
              avgEngagementTimePerSession: 24.56,
              totalRevenue: 0,
              bounceRate: 0.2,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/garlon-new-5-l",
              sessions: 87,
              activeUsers: 78,
              newUsers: 64,
              avgEngagementTimePerSession: 40.03448275862069,
              totalRevenue: 347.58,
              bounceRate: 0.3333333333333333,
              addToCart: 8,
              checkouts: 7,
              purchases: 2
            },
            {
              path: "/obchod",
              sessions: 83,
              activeUsers: 71,
              newUsers: 59,
              avgEngagementTimePerSession: 173.25301204819277,
              totalRevenue: 116.68,
              bounceRate: 0.3493975903614458,
              addToCart: 36,
              checkouts: 8,
              purchases: 1
            },
            {
              path: "/produkt/delan-700-wdg-1-kg",
              sessions: 80,
              activeUsers: 69,
              newUsers: 49,
              avgEngagementTimePerSession: 48.875,
              totalRevenue: 1330.38,
              bounceRate: 0.3625,
              addToCart: 5,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/liadok-27",
              sessions: 75,
              activeUsers: 74,
              newUsers: 67,
              avgEngagementTimePerSession: 32.946666666666665,
              totalRevenue: 0,
              bounceRate: 0.5333333333333333,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/sivanto-prime",
              sessions: 75,
              activeUsers: 61,
              newUsers: 42,
              avgEngagementTimePerSession: 41.666666666666664,
              totalRevenue: 0,
              bounceRate: 0.4,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/cyperfor-100-ec",
              sessions: 73,
              activeUsers: 60,
              newUsers: 47,
              avgEngagementTimePerSession: 88.75342465753425,
              totalRevenue: 170.51,
              bounceRate: 0.3835616438356164,
              addToCart: 3,
              checkouts: 3,
              purchases: 2
            },
            {
              path: "/produkt/encyklopedia-chorob-skodcov-a-vyzivy-zahradnickych-rastlin",
              sessions: 73,
              activeUsers: 36,
              newUsers: 34,
              avgEngagementTimePerSession: 29.767123287671232,
              totalRevenue: 42.02,
              bounceRate: 0.6986301369863014,
              addToCart: 6,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/zlte-moerickeho-misky",
              sessions: 71,
              activeUsers: 57,
              newUsers: 54,
              avgEngagementTimePerSession: 56.16901408450704,
              totalRevenue: 136.08,
              bounceRate: 0.43661971830985913,
              addToCart: 9,
              checkouts: 7,
              purchases: 2
            },
            {
              path: "/produkt/signum-1-kg",
              sessions: 70,
              activeUsers: 61,
              newUsers: 43,
              avgEngagementTimePerSession: 49.25714285714286,
              totalRevenue: 275.78,
              bounceRate: 0.35714285714285715,
              addToCart: 5,
              checkouts: 4,
              purchases: 2
            },
            {
              path: "/produkt/bio-fer-natur-4-3-3-500-kg",
              sessions: 69,
              activeUsers: 58,
              newUsers: 49,
              avgEngagementTimePerSession: 27.463768115942027,
              totalRevenue: 23.12,
              bounceRate: 0.2753623188405797,
              addToCart: 3,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/flipper-ew-4798-1-l",
              sessions: 68,
              activeUsers: 51,
              newUsers: 41,
              avgEngagementTimePerSession: 159.7058823529412,
              totalRevenue: 957,
              bounceRate: 0.3088235294117647,
              addToCart: 17,
              checkouts: 7,
              purchases: 3
            },
            {
              path: "/produkt/mustang-forte-5-l",
              sessions: 68,
              activeUsers: 61,
              newUsers: 44,
              avgEngagementTimePerSession: 51.955882352941174,
              totalRevenue: 0,
              bounceRate: 0.36764705882352944,
              addToCart: 6,
              checkouts: 3,
              purchases: 0
            },
            {
              path: "/produkt/retacel-extra-r68-10-l",
              sessions: 64,
              activeUsers: 56,
              newUsers: 39,
              avgEngagementTimePerSession: 103.640625,
              totalRevenue: 78.23,
              bounceRate: 0.265625,
              addToCart: 4,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/vinovcerit-npk",
              sessions: 60,
              activeUsers: 40,
              newUsers: 31,
              avgEngagementTimePerSession: 197.8,
              totalRevenue: 0,
              bounceRate: 0.35,
              addToCart: 16,
              checkouts: 4,
              purchases: 0
            },
            {
              path: "/produkt/huricane-1-kg",
              sessions: 58,
              activeUsers: 48,
              newUsers: 26,
              avgEngagementTimePerSession: 50.275862068965516,
              totalRevenue: 0,
              bounceRate: 0.1724137931034483,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/pocahontas-premiovy-stolovy-zemiak-28-40-mm",
              sessions: 58,
              activeUsers: 52,
              newUsers: 48,
              avgEngagementTimePerSession: 7.706896551724138,
              totalRevenue: 0,
              bounceRate: 0.5344827586206896,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/signum",
              sessions: 58,
              activeUsers: 51,
              newUsers: 45,
              avgEngagementTimePerSession: 71.65517241379311,
              totalRevenue: 0,
              bounceRate: 0.4482758620689655,
              addToCart: 10,
              checkouts: 2,
              purchases: 0
            },
            {
              path: "/produkt/trebon-osr-1-l",
              sessions: 58,
              activeUsers: 48,
              newUsers: 35,
              avgEngagementTimePerSession: 16.310344827586206,
              totalRevenue: 0,
              bounceRate: 0.39655172413793105,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/orgevit-4-3-25",
              sessions: 56,
              activeUsers: 44,
              newUsers: 33,
              avgEngagementTimePerSession: 140.39285714285714,
              totalRevenue: 89.53,
              bounceRate: 0.39285714285714285,
              addToCart: 7,
              checkouts: 4,
              purchases: 2
            },
            {
              path: "/produkt/biopasy",
              sessions: 53,
              activeUsers: 48,
              newUsers: 45,
              avgEngagementTimePerSession: 57.22641509433962,
              totalRevenue: 132.77,
              bounceRate: 0.4339622641509434,
              addToCart: 16,
              checkouts: 7,
              purchases: 3
            },
            {
              path: "/produkt/zlte-lepove-dosky",
              sessions: 50,
              activeUsers: 45,
              newUsers: 35,
              avgEngagementTimePerSession: 57.8,
              totalRevenue: 19.68,
              bounceRate: 0.44,
              addToCart: 5,
              checkouts: 3,
              purchases: 1
            },
            {
              path: "/produkt/impulse-gold-5-l",
              sessions: 49,
              activeUsers: 45,
              newUsers: 37,
              avgEngagementTimePerSession: 12.755102040816327,
              totalRevenue: 0,
              bounceRate: 0.4489795918367347,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/luna-experience-1-l",
              sessions: 49,
              activeUsers: 44,
              newUsers: 22,
              avgEngagementTimePerSession: 42.40816326530612,
              totalRevenue: 0,
              bounceRate: 0.20408163265306123,
              addToCart: 2,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/serenade-aso-5-l",
              sessions: 49,
              activeUsers: 42,
              newUsers: 34,
              avgEngagementTimePerSession: 71.48979591836735,
              totalRevenue: 158.17,
              bounceRate: 0.3673469387755102,
              addToCart: 8,
              checkouts: 5,
              purchases: 1
            },
            {
              path: "/produkt/airone-sc-5-l",
              sessions: 48,
              activeUsers: 40,
              newUsers: 25,
              avgEngagementTimePerSession: 37.6875,
              totalRevenue: 0,
              bounceRate: 0.3541666666666667,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/kompletny-sprievodca-pestovanim-a-ochranou-repky-slnecnice-maku-a-soje",
              sessions: 48,
              activeUsers: 41,
              newUsers: 33,
              avgEngagementTimePerSession: 30.75,
              totalRevenue: 70.9,
              bounceRate: 0.3958333333333333,
              addToCart: 2,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/mospilan-mizu-120-sl-1-l",
              sessions: 48,
              activeUsers: 44,
              newUsers: 33,
              avgEngagementTimePerSession: 50.770833333333336,
              totalRevenue: 115.88,
              bounceRate: 0.3125,
              addToCart: 2,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/machozrut",
              sessions: 46,
              activeUsers: 46,
              newUsers: 41,
              avgEngagementTimePerSession: 59.65217391304348,
              totalRevenue: 204.74,
              bounceRate: 0.391304347826087,
              addToCart: 13,
              checkouts: 7,
              purchases: 3
            },
            {
              path: "/produkt/k-othrine-25-sc-1-l",
              sessions: 45,
              activeUsers: 40,
              newUsers: 39,
              avgEngagementTimePerSession: 43.93333333333333,
              totalRevenue: 139.74,
              bounceRate: 0.3111111111111111,
              addToCart: 3,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/prakticky-balicek-ochrany-rastlin-pre-zahradkara-maly-1-ks",
              sessions: 44,
              activeUsers: 40,
              newUsers: 32,
              avgEngagementTimePerSession: 40.52272727272727,
              totalRevenue: 0,
              bounceRate: 0.3181818181818182,
              addToCart: 4,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/kontakt",
              sessions: 43,
              activeUsers: 37,
              newUsers: 29,
              avgEngagementTimePerSession: 45.41860465116279,
              totalRevenue: 0,
              bounceRate: 0.37209302325581395,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/kosik",
              sessions: 43,
              activeUsers: 34,
              newUsers: 24,
              avgEngagementTimePerSession: 48.604651162790695,
              totalRevenue: 23.97,
              bounceRate: 0.4418604651162791,
              addToCart: 8,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/predjarny-postrek-na-25-l",
              sessions: 43,
              activeUsers: 39,
              newUsers: 30,
              avgEngagementTimePerSession: 52,
              totalRevenue: 0,
              bounceRate: 0.3953488372093023,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/barbarian-super-1-l",
              sessions: 42,
              activeUsers: 39,
              newUsers: 36,
              avgEngagementTimePerSession: 80.14285714285714,
              totalRevenue: 0,
              bounceRate: 0.38095238095238093,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/lynx-5-l",
              sessions: 42,
              activeUsers: 37,
              newUsers: 31,
              avgEngagementTimePerSession: 61.095238095238095,
              totalRevenue: 0,
              bounceRate: 0.38095238095238093,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/superfosfat-18",
              sessions: 42,
              activeUsers: 37,
              newUsers: 20,
              avgEngagementTimePerSession: 54.26190476190476,
              totalRevenue: 0,
              bounceRate: 0.47619047619047616,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/cervacol-extra-15-kg",
              sessions: 40,
              activeUsers: 31,
              newUsers: 28,
              avgEngagementTimePerSession: 36.825,
              totalRevenue: 120.93,
              bounceRate: 0.4,
              addToCart: 4,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/puma-extra-5-l",
              sessions: 39,
              activeUsers: 36,
              newUsers: 32,
              avgEngagementTimePerSession: 25.41025641025641,
              totalRevenue: 0,
              bounceRate: 0.38461538461538464,
              addToCart: 1,
              checkouts: 1,
              purchases: 0
            }
          ],
          ecommerceItems: [
            {
              name: "Damisol Gold Frigomax, 1 l",
              itemsViewed: 4962,
              itemsAddedToCart: 1472,
              itemsPurchased: 388,
              itemRevenue: 7154.720009
            },
            {
              name: "Delan 700 WDG, 1 kg",
              itemsViewed: 65,
              itemsAddedToCart: 25,
              itemsPurchased: 20,
              itemRevenue: 1329.4
            },
            {
              name: "Boogie Xpro, 5 l",
              itemsViewed: 6,
              itemsAddedToCart: 5,
              itemsPurchased: 2,
              itemRevenue: 914.16
            },
            {
              name: "Flowbrix Profi, 5 l",
              itemsViewed: 4,
              itemsAddedToCart: 4,
              itemsPurchased: 4,
              itemRevenue: 633.760002
            },
            {
              name: "Barbarian Super, 20 l",
              itemsViewed: 55,
              itemsAddedToCart: 107,
              itemsPurchased: 3,
              itemRevenue: 577.859999
            },
            {
              name: "Herbavital Extra, 10 l",
              itemsViewed: 131,
              itemsAddedToCart: 50,
              itemsPurchased: 5,
              itemRevenue: 517.999999
            },
            {
              name: "Signum, 1 kg",
              itemsViewed: 52,
              itemsAddedToCart: 7,
              itemsPurchased: 3,
              itemRevenue: 410.67
            },
            {
              name: "Flipper EW 479,8, 1 l",
              itemsViewed: 64,
              itemsAddedToCart: 37,
              itemsPurchased: 16,
              itemRevenue: 401.639999
            },
            {
              name: "Champion 50 WG, 10 kg",
              itemsViewed: 27,
              itemsAddedToCart: 5,
              itemsPurchased: 2,
              itemRevenue: 388.08
            },
            {
              name: "Garlon New, 5 l",
              itemsViewed: 48,
              itemsAddedToCart: 9,
              itemsPurchased: 2,
              itemRevenue: 345.58
            },
            {
              name: "LS Prothio-Tebuc",
              itemsViewed: 5,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 345
            },
            {
              name: "Previcur Energy, 1 l",
              itemsViewed: 23,
              itemsAddedToCart: 5,
              itemsPurchased: 3,
              itemRevenue: 331.44
            },
            {
              name: "Mustang Forte, 5 l",
              itemsViewed: 65,
              itemsAddedToCart: 12,
              itemsPurchased: 2,
              itemRevenue: 302.320001
            },
            {
              name: "Melody Combi WG, 5 kg",
              itemsViewed: 12,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 287.64
            },
            {
              name: "Horizon 250 EW, 5 l",
              itemsViewed: 4,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 286.25
            },
            {
              name: "Samppi, 5 l",
              itemsViewed: 17,
              itemsAddedToCart: 3,
              itemsPurchased: 2,
              itemRevenue: 250.920001
            },
            {
              name: "Racer 25 EC, 5 l",
              itemsViewed: 21,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 233.9
            },
            {
              name: "Dacor, 1 l",
              itemsViewed: 18,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 225.199999
            },
            {
              name: "Katalóg - Prípravky na ochranu rastlín 2026",
              itemsViewed: 29,
              itemsAddedToCart: 12,
              itemsPurchased: 5,
              itemRevenue: 219.19
            },
            {
              name: "CAMPOFORT® Forte, 20 l",
              itemsViewed: 37,
              itemsAddedToCart: 3,
              itemsPurchased: 2,
              itemRevenue: 215.32
            },
            {
              name: "Cyperfor 100 EC",
              itemsViewed: 65,
              itemsAddedToCart: 7,
              itemsPurchased: 5,
              itemRevenue: 206.97
            },
            {
              name: "Eutrofit, 10 l",
              itemsViewed: 123,
              itemsAddedToCart: 36,
              itemsPurchased: 1,
              itemRevenue: 203.65
            },
            {
              name: "Machožrút, 1 l",
              itemsViewed: 30,
              itemsAddedToCart: 37,
              itemsPurchased: 17,
              itemRevenue: 201.620001
            },
            {
              name: "Fusilade Forte, 5 l",
              itemsViewed: 11,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 195.62
            },
            {
              name: "Nasa, 20 l",
              itemsViewed: 11,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 192.62
            },
            {
              name: "Ďatelina lúčna - Rozeta",
              itemsViewed: 18,
              itemsAddedToCart: 11,
              itemsPurchased: 5,
              itemRevenue: 192.379996
            },
            {
              name: "Vivando, 1 l",
              itemsViewed: 5,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 191.67
            },
            {
              name: "BIOPÁSY",
              itemsViewed: 88,
              itemsAddedToCart: 63,
              itemsPurchased: 37,
              itemRevenue: 181.160006
            },
            {
              name: "Touchdown System 4",
              itemsViewed: 19,
              itemsAddedToCart: 9,
              itemsPurchased: 6,
              itemRevenue: 167.159998
            },
            {
              name: "Žlté Moerickeho misky",
              itemsViewed: 40,
              itemsAddedToCart: 50,
              itemsPurchased: 18,
              itemRevenue: 165.540002
            },
            {
              name: "Ďatelina plazivá - Liflex 1 kg",
              itemsViewed: 72,
              itemsAddedToCart: 59,
              itemsPurchased: 14,
              itemRevenue: 160.7
            },
            {
              name: "Devrinol 45 F, 5 l",
              itemsViewed: 4,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 153.14
            },
            {
              name: "Merpan 80 WDG",
              itemsViewed: 6,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 147.4
            },
            {
              name: "Coltrane SC , 5 l",
              itemsViewed: 5,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 146.89
            },
            {
              name: "K - Othrine 25 SC, 1 l",
              itemsViewed: 22,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 138.74
            },
            {
              name: "Flowbrix",
              itemsViewed: 12,
              itemsAddedToCart: 5,
              itemsPurchased: 4,
              itemRevenue: 134.800001
            },
            {
              name: "Teldor 500 SC, 1 l",
              itemsViewed: 13,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 132.16
            },
            {
              name: "Signum",
              itemsViewed: 109,
              itemsAddedToCart: 53,
              itemsPurchased: 21,
              itemRevenue: 126.28
            },
            {
              name: "Luna Experience, 1 l",
              itemsViewed: 63,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 124.23
            },
            {
              name: "Cyperfor 100 EC, 5 l",
              itemsViewed: 14,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 124.23
            },
            {
              name: "Cervacol Extra, 15 kg",
              itemsViewed: 23,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 119.93
            },
            {
              name: "Predjarný postrek na 50 l, 500 + 25 ml",
              itemsViewed: 108,
              itemsAddedToCart: 33,
              itemsPurchased: 10,
              itemRevenue: 116.510002
            },
            {
              name: "Markate 50, 1 l",
              itemsViewed: 19,
              itemsAddedToCart: 16,
              itemsPurchased: 2,
              itemRevenue: 114.88
            },
            {
              name: "Šaman, 1 l",
              itemsViewed: 10,
              itemsAddedToCart: 6,
              itemsPurchased: 6,
              itemRevenue: 113.529999
            },
            {
              name: "Serenade ASO, 5 l",
              itemsViewed: 30,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 112.24
            },
            {
              name: "Infinito SC",
              itemsViewed: 15,
              itemsAddedToCart: 5,
              itemsPurchased: 2,
              itemRevenue: 106.220001
            },
            {
              name: "Atonik",
              itemsViewed: 18,
              itemsAddedToCart: 3,
              itemsPurchased: 3,
              itemRevenue: 103.639999
            },
            {
              name: "Hrach siaty (jarný) - GAMBIT",
              itemsViewed: 19,
              itemsAddedToCart: 20,
              itemsPurchased: 3,
              itemRevenue: 87.970001
            },
            {
              name: "Síra BL, 25 kg",
              itemsViewed: 14,
              itemsAddedToCart: 0,
              itemsPurchased: 1,
              itemRevenue: 86.72
            },
            {
              name: "Tráva - Kostrava lúčna Cosmolit 1 kg",
              itemsViewed: 19,
              itemsAddedToCart: 99,
              itemsPurchased: 14,
              itemRevenue: 84.699996
            }
          ]
        },
      email: {
        sent: null, openRate: 21.2, clickRate: 0.72, uniqueClicks: 129,
        unsubRate: 0.18, orders: 1, revenue: 56.0, campaignsCount: 4,
      },
      eshop: {
        woocommerce: true,
        revenue: 45993.29,
        netRevenue: 35252,
        grossSales: 35410.46,
        orders: 702,
        items: 2386,
        variants: 1331,
        refunds: 0,
        coupons: 158.46,
        taxes: 8471.76,
        shipping: 2269.53,
        categories: [
          { name: 'Záhradkári', items: 1969, netRevenue: 14832.09 },
          { name: 'Šikovný gazda', items: 1671, netRevenue: 13534.35 },
          { name: 'Exkluzívne produkty', items: 1625, netRevenue: 13318.64 },
          { name: 'Ostatné', items: 1524, netRevenue: 10644.64 },
          { name: 'Výživa rastlín', items: 1520, netRevenue: 21989.36 },
          { name: 'Poľnohospodári', items: 909, netRevenue: 27103.95 },
          { name: 'Bio prípravky', items: 636, netRevenue: 9707.07 },
          { name: 'Fungicídy', items: 421, netRevenue: 15789.71 },
          { name: 'Insekcitídy', items: 400, netRevenue: 6642.02 },
          { name: 'Hnojivá', items: 230, netRevenue: 1880.16 },
          { name: 'Osivá', items: 169, netRevenue: 1074.03 },
          { name: 'Trávy a ďatelinoviny', items: 106, netRevenue: 752.83 },
          { name: 'Herbicídy', items: 75, netRevenue: 6945.46 },
          { name: 'Listová výživa', items: 65, netRevenue: 1425.31 },
        ],
        products: [
          { name: 'Žlté lepové dosky', sku: '2408', items: 834, netRevenue: 496.8, orders: 16, variants: 2 },
          { name: 'Damisol Gold Frigomax, 1 l', sku: '3032', items: 620, netRevenue: 9172.2, orders: 500, variants: 0 },
          { name: 'Flipper EW 479,8, 1 l', sku: '2076', items: 46, netRevenue: 809.79, orders: 11, variants: 0 },
          { name: 'Signum', sku: '2304', items: 37, netRevenue: 204.82, orders: 21, variants: 3 },
          { name: 'Champion 50 WG', sku: '2291', items: 34, netRevenue: 154.46, orders: 22, variants: 4 },
          { name: 'Cyperfor 100 EC', sku: '2071', items: 33, netRevenue: 495.09, orders: 11, variants: 3 },
          { name: 'Delan 700 WDG, 1 kg', sku: '1869', items: 29, netRevenue: 1372.62, orders: 4, variants: 0 },
          { name: 'Mospilan 20 SP', sku: '2322', items: 29, netRevenue: 35.92, orders: 14, variants: 3 },
          { name: 'Orgevit (4-3-2,5)', sku: '3008', items: 28, netRevenue: 238, orders: 5, variants: 3 },
          { name: 'Žlté Moerickeho misky', sku: '2409', items: 26, netRevenue: 227.5, orders: 4, variants: 0 },
          { name: 'Facélia vratičolistá - Factotum', sku: '21278-1', items: 25, netRevenue: 122.25, orders: 9, variants: 2 },
          { name: 'Machožrút, 1 l', sku: '2362', items: 21, netRevenue: 202.44, orders: 6, variants: 0 },
          { name: 'Karate Zeon 5 CS', sku: '2320', items: 19, netRevenue: 104.95, orders: 14, variants: 3 },
          { name: 'Vin-OVO-cerit', sku: '2404', items: 18, netRevenue: 147.66, orders: 8, variants: 2 },
          { name: 'BIOPÁSY', sku: '22975', items: 18, netRevenue: 69.88, orders: 9, variants: 3 },
          { name: 'Predjarný postrek na 50 l, 500 + 25 ml', sku: '2376', items: 15, netRevenue: 142.32, orders: 12, variants: 0 },
          { name: 'Ďatelina plazivá - Apollo 1 kg', sku: 'fa5792e9c0fa', items: 13, netRevenue: 130, orders: 7, variants: 0 },
          { name: 'Zelená skalica', sku: '2373', items: 12, netRevenue: 18.57, orders: 7, variants: 2 },
          { name: 'Chorus 50 WG, 3x1,5 g', sku: '2292', items: 11, netRevenue: 22.55, orders: 5, variants: 0 },
          { name: 'Ďatelina lúčna - Rozeta', sku: '15325', items: 11, netRevenue: 197.2, orders: 6, variants: 3 },
          { name: 'Bellis', sku: '2285', items: 10, netRevenue: 16.65, orders: 6, variants: 2 },
          { name: 'Vika jarná', sku: '3ec6c37447bf', items: 10, netRevenue: 23.96, orders: 3, variants: 0 },
          { name: 'Dicopur M 750', sku: '2311', items: 9, netRevenue: 94.61, orders: 5, variants: 3 },
          { name: 'Ďatelina alexandrijská, 1 kg', sku: '26bbeaa9d717', items: 9, netRevenue: 40.85, orders: 4, variants: 0 },
          { name: 'Herbavital Extra, 10 l', sku: '1257', items: 8, netRevenue: 661.21, orders: 2, variants: 0 },
        ],
      },
    },
    {
      year: 2026, month: 4,
      meta: {
        spend: 295.15, impressions: 151756, reach: 60094, clicks: 2205,
        purchases: 24, purchaseValue: 1031.35, roas: 3.49, addToCart: 121,
        cpc: 0.13, costPerPurchase: 12.3,
        ads: [
          { name: "Ochráňte svoje stromy pred jarnými mrazmi", campaign: "sanaplant_conversion_frigomax", spend: 114.86, value: 447.92, roas: 3.9, purchases: 18, costPerPurchase: 6.38, aov: 24.88, cpm: 1.95, impressions: 58875, reach: 19661, frequency: 2.99, clicks: 967, cpc: 0.12, ctr: 1.64, addToCart: 83, costPerAddToCart: 1.38, landingPageViews: 605, costPerLandingPageView: 0.19, engagements: 1076, costPerEngagement: 0.11, saves: 10, shares: 39, comments: 14 },
          { name: "frigomax_video", campaign: "sanaplant_conversion_frigomax", spend: 71.2, value: 436.55, roas: 6.13, purchases: 3, costPerPurchase: 23.73, aov: 145.52, cpm: 2.78, impressions: 25576, reach: 9970, frequency: 2.57, clicks: 173, cpc: 0.41, ctr: 0.68, addToCart: 9, costPerAddToCart: 7.91, landingPageViews: 78, costPerLandingPageView: 0.91, engagements: 4807, costPerEngagement: 0.01, saves: 9, shares: 14, comments: 2 },
          { name: "Jarné mrazy môžu zničiť úrodu", campaign: "sanaplant_conversion_frigomax", spend: 39.19, value: 121.91, roas: 3.11, purchases: 2, costPerPurchase: 19.6, aov: 60.96, cpm: 1.92, impressions: 20458, reach: 8387, frequency: 2.44, clicks: 13, cpc: 3.01, ctr: 0.06, addToCart: 4, costPerAddToCart: 9.8, landingPageViews: 2, costPerLandingPageView: 19.6, engagements: 390, costPerEngagement: 0.1, saves: 1, shares: 1, comments: 3 },
          { name: "10 produktov Sanaplant 1/26", campaign: "sanaplant_general_sales", spend: 32.9, value: 24.97, roas: 0.76, purchases: 1, costPerPurchase: 32.9, aov: 24.97, cpm: 2.36, impressions: 13956, reach: 4671, frequency: 2.99, clicks: 173, cpc: 0.19, ctr: 1.24, addToCart: 19, costPerAddToCart: 1.73, landingPageViews: 112, costPerLandingPageView: 0.29, engagements: 1092, costPerEngagement: 0.03, shares: 2 },
          { name: "Silné rastliny začínajú v pôde", campaign: "sanaplant_boosting_traffic", spend: 14.97, purchases: 0, cpm: 1.22, impressions: 12295, reach: 5627, frequency: 2.19, clicks: 290, cpc: 0.05, ctr: 2.36, addToCart: 1, costPerAddToCart: 14.97, landingPageViews: 243, costPerLandingPageView: 0.06, engagements: 322, costPerEngagement: 0.05, saves: 6, shares: 4 },
          { name: "🌱 Ponuka produktov v kategórii Šikovný gazda sa opäť rozrastá.", campaign: "sanaplant_boosting_traffic", spend: 14.95, purchases: 0, cpm: 1.24, impressions: 12104, reach: 5659, frequency: 2.14, clicks: 262, cpc: 0.06, ctr: 2.16, addToCart: 5, costPerAddToCart: 2.99, landingPageViews: 183, costPerLandingPageView: 0.08, engagements: 293, costPerEngagement: 0.05, saves: 6, shares: 3 },
          { name: "Starostlivosť o broskyne", campaign: "sanaplant_boosting_traffic", spend: 4.52, purchases: 0, cpm: 0.66, impressions: 6803, reach: 4671, frequency: 1.46, clicks: 274, cpc: 0.02, ctr: 4.03, landingPageViews: 207, costPerLandingPageView: 0.02, engagements: 295, costPerEngagement: 0.02, saves: 6, shares: 3 },
          { name: "Slimáky / slizniaky", campaign: "sanaplant_boosting_traffic", spend: 2.56, purchases: 0, cpm: 1.52, impressions: 1689, reach: 1448, frequency: 1.17, clicks: 53, cpc: 0.05, ctr: 3.14, landingPageViews: 21, costPerLandingPageView: 0.12, engagements: 147, costPerEngagement: 0.02 }
        ],
      },
      boosting: null,
      google: {
        spend: 801.88, impressions: 246997, clicks: 7552, cpc: 0.11, ctr: 3.06,
        interactions: 14749, interactionRate: 5.97, convRate: 4.48, costPerConv: 1.21,
        purchases: 89, purchaseValue: 7003.08, conversions: 589.32, roas: 8.73,
        conversionActions: { add_to_cart: 319.32, begin_checkout: 181, purchase: 89 },
        campaigns: [
          { name: "PMax_sales_products", type: "Performance Max", status: "Enabled", purchases: 89, value: 7003.08, conversionActions: { add_to_cart: 319.32, purchase: 89, begin_checkout: 150.56 } },
          { name: "PMax - Frigomax", type: "Performance Max", status: "Paused", purchases: 0, value: 0, conversionActions: { begin_checkout: 30.44 } }
        ],
      },
      ga: {
          paid: {
            sessions: 11074,
            users: 9976,
            engagementRate: 33.37,
            avgDuration: "00:10:56"
          },
          organic: {
            sessions: 7481,
            users: 6165,
            engagementRate: 54.94,
            avgDuration: "00:18:57"
          },
          snapshot: {
            activeUsers: 15630,
            newUsers: 13547,
            sessions: 18595,
            engagedSessions: 7817,
            engagementRate: 0.4203818230707179,
            totalRevenue: 13813.840006,
            keyEvents: 9120
          },
          trafficAcquisition: [
            {
              channelGroup: "Cross-network",
              sessions: 5697,
              engagedSessions: 3416,
              engagementRate: 0.59961383184132,
              avgEngagementTimePerSession: 49.08056872037915,
              eventsPerSession: 6.636124275934702,
              eventCount: 37806,
              keyEvents: 4862,
              sessionKeyEventRate: 0.3691416535018431,
              totalRevenue: 5666.950004
            },
            {
              channelGroup: "Direct",
              sessions: 5582,
              engagedSessions: 611,
              engagementRate: 0.10945897527767826,
              avgEngagementTimePerSession: 5.379792189179506,
              eventsPerSession: 4.54209960587603,
              eventCount: 25354,
              keyEvents: 357,
              sessionKeyEventRate: 0.02257255463991401,
              totalRevenue: 1514.5
            },
            {
              channelGroup: "Organic Search",
              sessions: 4380,
              engagedSessions: 2461,
              engagementRate: 0.5618721461187215,
              avgEngagementTimePerSession: 52.863013698630134,
              eventsPerSession: 6.420776255707763,
              eventCount: 28123,
              keyEvents: 3047,
              sessionKeyEventRate: 0.30525114155251143,
              totalRevenue: 4564.040001
            },
            {
              channelGroup: "Paid Social",
              sessions: 1808,
              engagedSessions: 760,
              engagementRate: 0.42035398230088494,
              avgEngagementTimePerSession: 32.686393805309734,
              eventsPerSession: 4.830199115044247,
              eventCount: 8733,
              keyEvents: 343,
              sessionKeyEventRate: 0.09015486725663717,
              totalRevenue: 332.830001
            },
            {
              channelGroup: "Unassigned",
              sessions: 303,
              engagedSessions: 155,
              engagementRate: 0.5115511551155115,
              avgEngagementTimePerSession: 31.059405940594058,
              eventsPerSession: 6.128712871287129,
              eventCount: 1857,
              keyEvents: 184,
              sessionKeyEventRate: 0.32673267326732675,
              totalRevenue: 660.59
            },
            {
              channelGroup: "Organic Social",
              sessions: 285,
              engagedSessions: 121,
              engagementRate: 0.4245614035087719,
              avgEngagementTimePerSession: 29.08421052631579,
              eventsPerSession: 5.7368421052631575,
              eventCount: 1635,
              keyEvents: 55,
              sessionKeyEventRate: 0.07368421052631578,
              totalRevenue: 123.85
            },
            {
              channelGroup: "Referral",
              sessions: 224,
              engagedSessions: 121,
              engagementRate: 0.5401785714285714,
              avgEngagementTimePerSession: 33.54017857142857,
              eventsPerSession: 5.866071428571429,
              eventCount: 1314,
              keyEvents: 82,
              sessionKeyEventRate: 0.1875,
              totalRevenue: 514.08
            },
            {
              channelGroup: "Email",
              sessions: 203,
              engagedSessions: 96,
              engagementRate: 0.4729064039408867,
              avgEngagementTimePerSession: 111.93596059113301,
              eventsPerSession: 7.54679802955665,
              eventCount: 1532,
              keyEvents: 107,
              sessionKeyEventRate: 0.2019704433497537,
              totalRevenue: 85.37
            },
            {
              channelGroup: "Paid Search",
              sessions: 63,
              engagedSessions: 43,
              engagementRate: 0.6825396825396826,
              avgEngagementTimePerSession: 7.190476190476191,
              eventsPerSession: 5.333333333333333,
              eventCount: 336,
              keyEvents: 12,
              sessionKeyEventRate: 0.1111111111111111,
              totalRevenue: 0
            },
            {
              channelGroup: "Organic Shopping",
              sessions: 50,
              engagedSessions: 33,
              engagementRate: 0.66,
              avgEngagementTimePerSession: 55.56,
              eventsPerSession: 9.7,
              eventCount: 485,
              keyEvents: 71,
              sessionKeyEventRate: 0.44,
              totalRevenue: 351.63
            }
          ],
          userAcquisition: [
            {
              firstUserChannelGroup: "Direct",
              totalUsers: 5676,
              newUsers: 5498,
              returningUsers: 185,
              avgEngagementTimePerActiveUser: 18.61427554289783,
              engagedSessionsPerActiveUser: 0.15005339978640087,
              eventCount: 28840,
              keyEvents: 761,
              userKeyEventRate: 0.02758988964044144
            },
            {
              firstUserChannelGroup: "Cross-network",
              totalUsers: 4360,
              newUsers: 3578,
              returningUsers: 1017,
              avgEngagementTimePerActiveUser: 60.69121140142518,
              engagedSessionsPerActiveUser: 0.7771971496437055,
              eventCount: 35812,
              keyEvents: 4476,
              userKeyEventRate: 0.32565320665083136
            },
            {
              firstUserChannelGroup: "Organic Search",
              totalUsers: 3289,
              newUsers: 2680,
              returningUsers: 699,
              avgEngagementTimePerActiveUser: 58.686590765338394,
              engagedSessionsPerActiveUser: 0.7798861480075902,
              eventCount: 27323,
              keyEvents: 3088,
              userKeyEventRate: 0.2792536369386464
            },
            {
              firstUserChannelGroup: "Paid Social",
              totalUsers: 1471,
              newUsers: 1080,
              returningUsers: 230,
              avgEngagementTimePerActiveUser: 46.0328,
              engagedSessionsPerActiveUser: 0.5904,
              eventCount: 8341,
              keyEvents: 296,
              userKeyEventRate: 0.0824
            },
            {
              firstUserChannelGroup: "Organic Social",
              totalUsers: 252,
              newUsers: 223,
              returningUsers: 17,
              avgEngagementTimePerActiveUser: 27.261802575107296,
              engagedSessionsPerActiveUser: 0.4678111587982833,
              eventCount: 1412,
              keyEvents: 42,
              userKeyEventRate: 0.06437768240343347
            },
            {
              firstUserChannelGroup: "Unassigned",
              totalUsers: 212,
              newUsers: 181,
              returningUsers: 33,
              avgEngagementTimePerActiveUser: 34.38235294117647,
              engagedSessionsPerActiveUser: 0.6225490196078431,
              eventCount: 1560,
              keyEvents: 123,
              userKeyEventRate: 0.22549019607843138
            },
            {
              firstUserChannelGroup: "Referral",
              totalUsers: 161,
              newUsers: 144,
              returningUsers: 22,
              avgEngagementTimePerActiveUser: 46.15822784810127,
              engagedSessionsPerActiveUser: 0.6329113924050633,
              eventCount: 1248,
              keyEvents: 95,
              userKeyEventRate: 0.189873417721519
            },
            {
              firstUserChannelGroup: "Email",
              totalUsers: 97,
              newUsers: 71,
              returningUsers: 31,
              avgEngagementTimePerActiveUser: 254.89247311827958,
              engagedSessionsPerActiveUser: 1.2150537634408602,
              eventCount: 1721,
              keyEvents: 147,
              userKeyEventRate: 0.3118279569892473
            },
            {
              firstUserChannelGroup: "Paid Search",
              totalUsers: 73,
              newUsers: 58,
              returningUsers: 16,
              avgEngagementTimePerActiveUser: 28.82857142857143,
              engagedSessionsPerActiveUser: 0.8857142857142857,
              eventCount: 571,
              keyEvents: 48,
              userKeyEventRate: 0.17142857142857143
            },
            {
              firstUserChannelGroup: "Organic Shopping",
              totalUsers: 39,
              newUsers: 34,
              returningUsers: 5,
              avgEngagementTimePerActiveUser: 50.567567567567565,
              engagedSessionsPerActiveUser: 0.7027027027027027,
              eventCount: 347,
              keyEvents: 44,
              userKeyEventRate: 0.35135135135135137
            }
          ],
          landingPages: [
            {
              path: "/produkt/damisol-gold-frigomax-1-l",
              sessions: 3803,
              activeUsers: 2847,
              newUsers: 2317,
              avgEngagementTimePerSession: 54.60767814882987,
              totalRevenue: 1861.62,
              bounceRate: 0.4004733105443071,
              addToCart: 347,
              checkouts: 97,
              purchases: 62
            },
            {
              path: "/",
              sessions: 1053,
              activeUsers: 857,
              newUsers: 719,
              avgEngagementTimePerSession: 31.47198480531814,
              totalRevenue: 1176.57,
              bounceRate: 0.7302943969610636,
              addToCart: 25,
              checkouts: 20,
              purchases: 9
            },
            {
              path: "/produkt/hydrohumat_1l",
              sessions: 357,
              activeUsers: 254,
              newUsers: 214,
              avgEngagementTimePerSession: 19.77871148459384,
              totalRevenue: 259.3,
              bounceRate: 0.5658263305322129,
              addToCart: 2,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/znacka-produktu/broskyna-celorocna-ochrana-a-vyziva",
              sessions: 261,
              activeUsers: 213,
              newUsers: 188,
              avgEngagementTimePerSession: 12.804597701149426,
              totalRevenue: 0,
              bounceRate: 0.5977011494252874,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/sivanto-prime",
              sessions: 171,
              activeUsers: 127,
              newUsers: 83,
              avgEngagementTimePerSession: 126.88888888888889,
              totalRevenue: 233.59,
              bounceRate: 0.36257309941520466,
              addToCart: 23,
              checkouts: 10,
              purchases: 4
            },
            {
              path: "(not set)",
              sessions: 133,
              activeUsers: 94,
              newUsers: 74,
              avgEngagementTimePerSession: 10.090225563909774,
              totalRevenue: 0,
              bounceRate: 0.6917293233082706,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/huricane-1-kg",
              sessions: 107,
              activeUsers: 91,
              newUsers: 66,
              avgEngagementTimePerSession: 43.570093457943926,
              totalRevenue: 334.97,
              bounceRate: 0.32710280373831774,
              addToCart: 6,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/special-zemiaky-zahrada-bezchloridove-npk-11-9-2016s15mg005-b",
              sessions: 101,
              activeUsers: 95,
              newUsers: 91,
              avgEngagementTimePerSession: 19.07920792079208,
              totalRevenue: 0,
              bounceRate: 0.5643564356435643,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/stabilan-750-sl-20-l",
              sessions: 91,
              activeUsers: 71,
              newUsers: 44,
              avgEngagementTimePerSession: 24.32967032967033,
              totalRevenue: 0,
              bounceRate: 0.34065934065934067,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/desimo-duo",
              sessions: 85,
              activeUsers: 82,
              newUsers: 74,
              avgEngagementTimePerSession: 43.576470588235296,
              totalRevenue: 0,
              bounceRate: 0.6588235294117647,
              addToCart: 4,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/mospilan-20-sp",
              sessions: 81,
              activeUsers: 77,
              newUsers: 72,
              avgEngagementTimePerSession: 35.22222222222222,
              totalRevenue: 0,
              bounceRate: 0.5802469135802469,
              addToCart: 5,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/neemazal-t-s",
              sessions: 80,
              activeUsers: 67,
              newUsers: 66,
              avgEngagementTimePerSession: 52.85,
              totalRevenue: 198.5,
              bounceRate: 0.3375,
              addToCart: 28,
              checkouts: 10,
              purchases: 3
            },
            {
              path: "/produkt/barbarian-super-1-l",
              sessions: 76,
              activeUsers: 71,
              newUsers: 65,
              avgEngagementTimePerSession: 59.026315789473685,
              totalRevenue: 0,
              bounceRate: 0.3684210526315789,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/mustang-forte-5-l",
              sessions: 76,
              activeUsers: 62,
              newUsers: 46,
              avgEngagementTimePerSession: 19.81578947368421,
              totalRevenue: 0,
              bounceRate: 0.40789473684210525,
              addToCart: 2,
              checkouts: 3,
              purchases: 0
            },
            {
              path: "/produkt/signum-1-kg",
              sessions: 73,
              activeUsers: 69,
              newUsers: 43,
              avgEngagementTimePerSession: 26.63013698630137,
              totalRevenue: 136.89,
              bounceRate: 0.3287671232876712,
              addToCart: 3,
              checkouts: 3,
              purchases: 1
            },
            {
              path: "/produkt/bio-fer-natur-4-3-3-500-kg",
              sessions: 71,
              activeUsers: 61,
              newUsers: 52,
              avgEngagementTimePerSession: 39.66197183098591,
              totalRevenue: 237.64,
              bounceRate: 0.30985915492957744,
              addToCart: 3,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/cyperfor-100-ec",
              sessions: 69,
              activeUsers: 53,
              newUsers: 34,
              avgEngagementTimePerSession: 58.84057971014493,
              totalRevenue: 0,
              bounceRate: 0.37681159420289856,
              addToCart: 2,
              checkouts: 2,
              purchases: 0
            },
            {
              path: "/produkt/signum",
              sessions: 69,
              activeUsers: 60,
              newUsers: 57,
              avgEngagementTimePerSession: 14.623188405797102,
              totalRevenue: 0,
              bounceRate: 0.6956521739130435,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/k-othrine-25-sc-1-l",
              sessions: 64,
              activeUsers: 56,
              newUsers: 52,
              avgEngagementTimePerSession: 52.046875,
              totalRevenue: 854.05,
              bounceRate: 0.4375,
              addToCart: 17,
              checkouts: 10,
              purchases: 5
            },
            {
              path: "/obchod",
              sessions: 60,
              activeUsers: 60,
              newUsers: 53,
              avgEngagementTimePerSession: 154.5,
              totalRevenue: 43.72,
              bounceRate: 0.31666666666666665,
              addToCart: 8,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/flipper-ew-4798-1-l",
              sessions: 59,
              activeUsers: 53,
              newUsers: 36,
              avgEngagementTimePerSession: 44.559322033898304,
              totalRevenue: 0,
              bounceRate: 0.3898305084745763,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/encyklopedia-chorob-skodcov-a-vyzivy-zahradnickych-rastlin",
              sessions: 57,
              activeUsers: 26,
              newUsers: 21,
              avgEngagementTimePerSession: 12.543859649122806,
              totalRevenue: 0,
              bounceRate: 0.7719298245614035,
              addToCart: 3,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/herbavital",
              sessions: 56,
              activeUsers: 45,
              newUsers: 32,
              avgEngagementTimePerSession: 31.821428571428573,
              totalRevenue: 0,
              bounceRate: 0.5,
              addToCart: 1,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/wing-p-10-l",
              sessions: 55,
              activeUsers: 45,
              newUsers: 26,
              avgEngagementTimePerSession: 15.8,
              totalRevenue: 0,
              bounceRate: 0.45454545454545453,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/campofort-forte",
              sessions: 54,
              activeUsers: 51,
              newUsers: 32,
              avgEngagementTimePerSession: 57.925925925925924,
              totalRevenue: 0,
              bounceRate: 0.3333333333333333,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/delan-700-wdg-1-kg",
              sessions: 50,
              activeUsers: 44,
              newUsers: 30,
              avgEngagementTimePerSession: 51.72,
              totalRevenue: 0,
              bounceRate: 0.24,
              addToCart: 4,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/zlate-zltnutie-vinica",
              sessions: 50,
              activeUsers: 45,
              newUsers: 33,
              avgEngagementTimePerSession: 82.04,
              totalRevenue: 0,
              bounceRate: 0.32,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/predjarny-postrek-na-10-l",
              sessions: 48,
              activeUsers: 45,
              newUsers: 44,
              avgEngagementTimePerSession: 21.520833333333332,
              totalRevenue: 0,
              bounceRate: 0.5625,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/zlte-lepove-dosky",
              sessions: 48,
              activeUsers: 44,
              newUsers: 40,
              avgEngagementTimePerSession: 24.375,
              totalRevenue: 26.21,
              bounceRate: 0.5625,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/puma-extra-5-l",
              sessions: 45,
              activeUsers: 41,
              newUsers: 38,
              avgEngagementTimePerSession: 36.8,
              totalRevenue: 0,
              bounceRate: 0.4444444444444444,
              addToCart: 1,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/trava-lipnica-lucna-balin-1-kg",
              sessions: 45,
              activeUsers: 44,
              newUsers: 44,
              avgEngagementTimePerSession: 6.888888888888889,
              totalRevenue: 0,
              bounceRate: 0.6,
              addToCart: 3,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/gallup-super-360-20-l",
              sessions: 42,
              activeUsers: 41,
              newUsers: 33,
              avgEngagementTimePerSession: 27.714285714285715,
              totalRevenue: 0,
              bounceRate: 0.35714285714285715,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/barbarian-super-20-l",
              sessions: 41,
              activeUsers: 39,
              newUsers: 31,
              avgEngagementTimePerSession: 32.75609756097561,
              totalRevenue: 0,
              bounceRate: 0.4634146341463415,
              addToCart: 4,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/biplay-starane-forte-1-ks-600-g-5-l",
              sessions: 41,
              activeUsers: 34,
              newUsers: 20,
              avgEngagementTimePerSession: 33.36585365853659,
              totalRevenue: 0,
              bounceRate: 0.2926829268292683,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/garlon-new-5-l",
              sessions: 41,
              activeUsers: 34,
              newUsers: 29,
              avgEngagementTimePerSession: 69.26829268292683,
              totalRevenue: 173.79,
              bounceRate: 0.43902439024390244,
              addToCart: 8,
              checkouts: 5,
              purchases: 1
            },
            {
              path: "/produkt/liadok-27",
              sessions: 41,
              activeUsers: 40,
              newUsers: 34,
              avgEngagementTimePerSession: 12.707317073170731,
              totalRevenue: 0,
              bounceRate: 0.6097560975609756,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/superfosfat-18",
              sessions: 41,
              activeUsers: 36,
              newUsers: 31,
              avgEngagementTimePerSession: 15.146341463414634,
              totalRevenue: 0,
              bounceRate: 0.5121951219512195,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/machozrut",
              sessions: 40,
              activeUsers: 39,
              newUsers: 38,
              avgEngagementTimePerSession: 83.525,
              totalRevenue: 471.95,
              bounceRate: 0.375,
              addToCart: 11,
              checkouts: 8,
              purchases: 4
            },
            {
              path: "/produkt/datelina-alexandrijska",
              sessions: 38,
              activeUsers: 37,
              newUsers: 31,
              avgEngagementTimePerSession: 51.73684210526316,
              totalRevenue: 23.47,
              bounceRate: 0.4473684210526316,
              addToCart: 2,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/dicopur-m-750-10-l",
              sessions: 38,
              activeUsers: 32,
              newUsers: 24,
              avgEngagementTimePerSession: 128.73684210526315,
              totalRevenue: 0,
              bounceRate: 0.39473684210526316,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/kompletny-sprievodca-pestovanim-a-ochranou-repky-slnecnice-maku-a-soje",
              sessions: 38,
              activeUsers: 33,
              newUsers: 26,
              avgEngagementTimePerSession: 44.973684210526315,
              totalRevenue: 69.9,
              bounceRate: 0.34210526315789475,
              addToCart: 4,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/lucerna-siata-vlasta",
              sessions: 38,
              activeUsers: 36,
              newUsers: 33,
              avgEngagementTimePerSession: 38.078947368421055,
              totalRevenue: 0,
              bounceRate: 0.5,
              addToCart: 5,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/pirimor-50-wg-1-kg",
              sessions: 37,
              activeUsers: 33,
              newUsers: 29,
              avgEngagementTimePerSession: 74.72972972972973,
              totalRevenue: 112.77,
              bounceRate: 0.43243243243243246,
              addToCart: 4,
              checkouts: 4,
              purchases: 1
            },
            {
              path: "/produkt/tebucur-250-ew-5-l",
              sessions: 37,
              activeUsers: 25,
              newUsers: 12,
              avgEngagementTimePerSession: 21.45945945945946,
              totalRevenue: 0,
              bounceRate: 0.2702702702702703,
              addToCart: 3,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/touchdown-system-4",
              sessions: 37,
              activeUsers: 33,
              newUsers: 29,
              avgEngagementTimePerSession: 24.37837837837838,
              totalRevenue: 0,
              bounceRate: 0.3783783783783784,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/slape-trio-5-l",
              sessions: 36,
              activeUsers: 31,
              newUsers: 17,
              avgEngagementTimePerSession: 25.61111111111111,
              totalRevenue: 0,
              bounceRate: 0.25,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/pendistar-40-sc-10-l",
              sessions: 35,
              activeUsers: 28,
              newUsers: 19,
              avgEngagementTimePerSession: 126.94285714285714,
              totalRevenue: 0,
              bounceRate: 0.22857142857142856,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/retacel-extra-r68-10-l",
              sessions: 35,
              activeUsers: 33,
              newUsers: 22,
              avgEngagementTimePerSession: 42.25714285714286,
              totalRevenue: 78.23,
              bounceRate: 0.34285714285714286,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/ataman-complete-dash-5-l-05-kg-5-l",
              sessions: 33,
              activeUsers: 22,
              newUsers: 11,
              avgEngagementTimePerSession: 42.333333333333336,
              totalRevenue: 0,
              bounceRate: 0.15151515151515152,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/orgevit-4-3-25",
              sessions: 33,
              activeUsers: 28,
              newUsers: 20,
              avgEngagementTimePerSession: 45.84848484848485,
              totalRevenue: 0,
              bounceRate: 0.3333333333333333,
              addToCart: 6,
              checkouts: 1,
              purchases: 0
            }
          ],
          ecommerceItems: [
            {
              name: "Damisol Gold Frigomax, 1 l",
              itemsViewed: 2115,
              itemsAddedToCart: 411,
              itemsPurchased: 86,
              itemRevenue: 1585.840012
            },
            {
              name: "K - Othrine 25 SC, 1 l",
              itemsViewed: 48,
              itemsAddedToCart: 19,
              itemsPurchased: 7,
              itemRevenue: 971.2
            },
            {
              name: "Machožrút, 1 l",
              itemsViewed: 20,
              itemsAddedToCart: 58,
              itemsPurchased: 39,
              itemRevenue: 462.539996
            },
            {
              name: "Harmavit Špeciál",
              itemsViewed: 19,
              itemsAddedToCart: 14,
              itemsPurchased: 8,
              itemRevenue: 393.439998
            },
            {
              name: "Nasa, 20 l",
              itemsViewed: 18,
              itemsAddedToCart: 1,
              itemsPurchased: 2,
              itemRevenue: 385.24
            },
            {
              name: "Samppi, 5 l",
              itemsViewed: 5,
              itemsAddedToCart: 4,
              itemsPurchased: 3,
              itemRevenue: 376.379999
            },
            {
              name: "Starane Forte, 5 l",
              itemsViewed: 21,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 353.12
            },
            {
              name: "Huricane, 1 kg",
              itemsViewed: 71,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 333.97
            },
            {
              name: "Hi Stick, 1 ks = 1 ha (0,4 kg)",
              itemsViewed: 22,
              itemsAddedToCart: 42,
              itemsPurchased: 14,
              itemRevenue: 298.06
            },
            {
              name: "Puma Extra, 5 l",
              itemsViewed: 13,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 282.48
            },
            {
              name: "Laudis OD, 1 l",
              itemsViewed: 37,
              itemsAddedToCart: 18,
              itemsPurchased: 5,
              itemRevenue: 279.439998
            },
            {
              name: "Foxtrot, 5 l",
              itemsViewed: 5,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 274.3
            },
            {
              name: "Pendiflex 400, 5 l",
              itemsViewed: 10,
              itemsAddedToCart: 2,
              itemsPurchased: 2,
              itemRevenue: 259.56
            },
            {
              name: "HydroHumat, 1 l",
              itemsViewed: 37,
              itemsAddedToCart: 25,
              itemsPurchased: 20,
              itemRevenue: 258.399994
            },
            {
              name: "amazoN, 5 kg",
              itemsViewed: 9,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 253.01
            },
            {
              name: "Butisan 400 SC, 5 l",
              itemsViewed: 17,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 248.72
            },
            {
              name: "Dicopur M 750, 10 l",
              itemsViewed: 25,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 241.26
            },
            {
              name: "Bio - Fer Natur (4-3-3), 500 kg",
              itemsViewed: 36,
              itemsAddedToCart: 7,
              itemsPurchased: 1,
              itemRevenue: 237.64
            },
            {
              name: "Pendistar 40 SC, 10 l",
              itemsViewed: 30,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 236.79
            },
            {
              name: "Racer 25 EC, 5 l",
              itemsViewed: 18,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 233.9
            },
            {
              name: "Retacel Extra R68, 10 l",
              itemsViewed: 36,
              itemsAddedToCart: 2,
              itemsPurchased: 3,
              itemRevenue: 231.69
            },
            {
              name: "Bofix",
              itemsViewed: 25,
              itemsAddedToCart: 6,
              itemsPurchased: 2,
              itemRevenue: 231.46
            },
            {
              name: "Pony 306 SE, 1 l",
              itemsViewed: 23,
              itemsAddedToCart: 5,
              itemsPurchased: 4,
              itemRevenue: 213.280001
            },
            {
              name: "Lebosol Aque Bór 150, 10 l",
              itemsViewed: 27,
              itemsAddedToCart: 4,
              itemsPurchased: 3,
              itemRevenue: 195.57
            },
            {
              name: "Tripali, 0,25 kg",
              itemsViewed: 15,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 183.49
            },
            {
              name: "Saracen",
              itemsViewed: 7,
              itemsAddedToCart: 2,
              itemsPurchased: 2,
              itemRevenue: 175.259999
            },
            {
              name: "Garlon New, 5 l",
              itemsViewed: 23,
              itemsAddedToCart: 11,
              itemsPurchased: 1,
              itemRevenue: 172.79
            },
            {
              name: "Sivanto Prime",
              itemsViewed: 111,
              itemsAddedToCart: 24,
              itemsPurchased: 4,
              itemRevenue: 166.04
            },
            {
              name: "Trinity, 5 l",
              itemsViewed: 42,
              itemsAddedToCart: 34,
              itemsPurchased: 1,
              itemRevenue: 163.55
            },
            {
              name: "Kaishi, 5 l",
              itemsViewed: 2,
              itemsAddedToCart: 4,
              itemsPurchased: 4,
              itemRevenue: 158.040002
            },
            {
              name: "Darium, 5 l",
              itemsViewed: 7,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 153.14
            },
            {
              name: "Signum, 1 kg",
              itemsViewed: 45,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 136.89
            },
            {
              name: "Mospilan Mizu 120 SL, 1 l",
              itemsViewed: 15,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 125
            },
            {
              name: "NeemAZAL T/S, 100 ml",
              itemsViewed: 61,
              itemsAddedToCart: 38,
              itemsPurchased: 8,
              itemRevenue: 124.879999
            },
            {
              name: "Luna Experience, 1 l",
              itemsViewed: 20,
              itemsAddedToCart: 9,
              itemsPurchased: 1,
              itemRevenue: 124.23
            },
            {
              name: "Neem Azal",
              itemsViewed: 6,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 122
            },
            {
              name: "Gibb Plus 10 SL, 1 l",
              itemsViewed: 7,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 119.78
            },
            {
              name: "Trebon OSR, 1 l",
              itemsViewed: 29,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 116.22
            },
            {
              name: "Pirimor 50 WG, 1 kg",
              itemsViewed: 18,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 112.77
            },
            {
              name: "Traton SX , 225 g",
              itemsViewed: 6,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 112.51
            },
            {
              name: "Serenade ASO, 5 l",
              itemsViewed: 31,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 112.24
            },
            {
              name: "Previcur Energy, 1 l",
              itemsViewed: 7,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 110.48
            },
            {
              name: "Legume FIX, 1 ks = 2 ha (0,75 kg)",
              itemsViewed: 11,
              itemsAddedToCart: 2,
              itemsPurchased: 2,
              itemRevenue: 95.28
            },
            {
              name: "Hoštické NPK hnojivo s guánom",
              itemsViewed: 26,
              itemsAddedToCart: 8,
              itemsPurchased: 2,
              itemRevenue: 91.66
            },
            {
              name: "Istroekol, 10 l",
              itemsViewed: 7,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 89.43
            },
            {
              name: "VermiFit B",
              itemsViewed: 3,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 82.9
            },
            {
              name: "Katalóg - Prípravky na ochranu rastlín 2026",
              itemsViewed: 15,
              itemsAddedToCart: 5,
              itemsPurchased: 2,
              itemRevenue: 82.08
            },
            {
              name: "Amcel, 10 l",
              itemsViewed: 8,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 80.02
            },
            {
              name: "Thiovit Jet, 10 kg",
              itemsViewed: 8,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 75.98
            },
            {
              name: "LS Prothio-Tebuc",
              itemsViewed: 8,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 72.14
            }
          ]
        },
      email: {
        sent: null, openRate: 28.16, clickRate: 2.5, uniqueClicks: 172,
        unsubRate: 0.57, orders: 4, revenue: 544.23, campaignsCount: 4,
      },
      eshop: {
        woocommerce: true,
        revenue: 37215.1,
        netRevenue: 29692.84,
        grossSales: 30089.27,
        orders: 275,
        items: 894,
        variants: 245,
        refunds: 0,
        coupons: 396.43,
        taxes: 6861.28,
        shipping: 660.98,
        categories: [
          { name: 'Výživa rastlín', items: 646, netRevenue: 12348.49 },
          { name: 'Záhradkári', items: 558, netRevenue: 9248.32 },
          { name: 'Poľnohospodári', items: 447, netRevenue: 22243.1 },
          { name: 'Herbicídy', items: 347, netRevenue: 25067.2 },
          { name: 'Exkluzívne produkty', items: 325, netRevenue: 7435.32 },
          { name: 'Šikovný gazda', items: 323, netRevenue: 6214.38 },
          { name: 'Ostatné', items: 217, netRevenue: 3142.32 },
          { name: 'Bio prípravky', items: 209, netRevenue: 3941.72 },
          { name: 'Insekcitídy', items: 154, netRevenue: 1427.3 },
          { name: 'Osivá', items: 129, netRevenue: 1089.21 },
          { name: 'Fungicídy', items: 98, netRevenue: 4081.23 },
          { name: 'Trávy a ďatelinoviny', items: 96, netRevenue: 948.13 },
          { name: 'Listová výživa', items: 95, netRevenue: 3654.44 },
          { name: 'Hnojivá', items: 70, netRevenue: 868.14 },
        ],
        products: [
          { name: 'Damisol Gold Frigomax, 1 l', sku: '3032', items: 201, netRevenue: 2953.59, orders: 110, variants: 0 },
          { name: 'Machožrút, 1 l', sku: '2362', items: 59, netRevenue: 568.76, orders: 8, variants: 0 },
          { name: 'HydroHumat, 1 l', sku: '3033', items: 37, netRevenue: 388.5, orders: 5, variants: 0 },
          { name: 'Ďatelina plazivá - Apollo 1 kg', sku: 'fa5792e9c0fa', items: 29, netRevenue: 280, orders: 5, variants: 0 },
          { name: 'LeoHumin Organic', sku: '2410', items: 21, netRevenue: 1151.77, orders: 2, variants: 3 },
          { name: 'Savvy, 100 g', sku: '1191', items: 18, netRevenue: 630, orders: 3, variants: 0 },
          { name: 'Harmavit Špeciál', sku: '2237', items: 16, netRevenue: 639.68, orders: 6, variants: 2 },
          { name: 'Spintor', sku: '2326', items: 16, netRevenue: 114.56, orders: 6, variants: 2 },
          { name: 'Ďatelina lúčna - Rozeta', sku: '15325', items: 16, netRevenue: 231.2, orders: 4, variants: 3 },
          { name: 'Agropur, 0,2 kg', sku: '2121', items: 15, netRevenue: 34.2, orders: 2, variants: 0 },
          { name: 'Opeľovače', sku: '23005', items: 15, netRevenue: 59.75, orders: 1, variants: 4 },
          { name: 'Funguran Progress, 10 kg', sku: '1404', items: 13, netRevenue: 2064.67, orders: 2, variants: 0 },
          { name: 'Mospilan 20 SP', sku: '2322', items: 13, netRevenue: 16.92, orders: 6, variants: 3 },
          { name: 'Laudis OD, 5 l', sku: '1214', items: 12, netRevenue: 2664.3, orders: 1, variants: 0 },
          { name: 'K - Othrine 25 SC, 1 l', sku: '1835', items: 11, netRevenue: 1229.52, orders: 10, variants: 0 },
          { name: 'Starane Forte, 60 ml', sku: '2315', items: 10, netRevenue: 51.7, orders: 1, variants: 0 },
          { name: 'Žlté lepové dosky', sku: '2408', items: 10, netRevenue: 36.8, orders: 4, variants: 2 },
          { name: 'Ďatelinová trávna zmes krátkodobá - 1 kg', sku: '6b073a469719', items: 10, netRevenue: 55, orders: 1, variants: 0 },
          { name: 'Sivanto Prime', sku: '1294', items: 9, netRevenue: 303.75, orders: 6, variants: 2 },
          { name: 'Drop For, 1 l', sku: '2126', items: 9, netRevenue: 300.87, orders: 1, variants: 0 },
          { name: 'Gondola', sku: '2319', items: 9, netRevenue: 31.05, orders: 3, variants: 2 },
          { name: 'Flipper EW 479,8, 1 l', sku: '2076', items: 8, netRevenue: 163.28, orders: 5, variants: 0 },
          { name: 'Vin-OVO-cerit', sku: '2404', items: 8, netRevenue: 71.12, orders: 2, variants: 2 },
          { name: 'Laudis OD, 1 l', sku: '1214-1', items: 8, netRevenue: 377.6, orders: 4, variants: 0 },
          { name: 'Lonstar, 20+15 ml', sku: '2314', items: 7, netRevenue: 43.96, orders: 2, variants: 0 },
        ],
      },
    },
    {
      year: 2026, month: 5,
      meta: {
        spend: 610.84, impressions: 254470, reach: 130572, clicks: 6830,
        purchases: 17, purchaseValue: 1728.66, roas: 2.83, addToCart: 130,
        cpc: 0.09, costPerPurchase: 35.93,
        ads: [
          { name: "Foli Max", campaign: "sanaplant_05-07/26", spend: 107.05, value: 635.53, roas: 12.04, purchases: 5, costPerPurchase: 46.58, aov: 281.37, cpm: 8.62, impressions: 25938, reach: 9521, frequency: 4.98, clicks: 281, cpc: 0.71, ctr: 2.78, addToCart: 31, costPerAddToCart: 6.48, landingPageViews: 153, costPerLandingPageView: 1.32, engagements: 315, costPerEngagement: 0.64, saves: 5, shares: 2 },
          { name: "Sivanto Prime", campaign: "sanaplant_05-07/26", spend: 103.37, value: 422.61, roas: 12.11, purchases: 6, costPerPurchase: 34.46, aov: 140.87, cpm: 7.4, impressions: 28339, reach: 12529, frequency: 4.22, clicks: 510, cpc: 0.38, ctr: 4.07, addToCart: 21, costPerAddToCart: 11.1, landingPageViews: 351, costPerLandingPageView: 0.56, engagements: 1047, costPerEngagement: 0.21, saves: 11, shares: 15 },
          { name: "Barbarian Super 360", campaign: "sanaplant_05-07/26", spend: 74.92, value: 62.29, roas: 2.75, purchases: 2, costPerPurchase: 74.92, aov: 62.29, cpm: 7.57, impressions: 18788, reach: 11441, frequency: 3.12, clicks: 357, cpc: 0.39, ctr: 4.57, addToCart: 26, costPerAddToCart: 6.41, landingPageViews: 241, costPerLandingPageView: 0.59, engagements: 392, costPerEngagement: 0.36, saves: 9, shares: 11, comments: 3 },
          { name: "Šikovný gazda vie, čím ochráni svoju úrodu.", campaign: "sanaplant_05-07/26", spend: 62.76, purchases: 0, cpm: 8.03, impressions: 15599, reach: 8011, frequency: 3.75, clicks: 388, cpc: 0.32, ctr: 5.1, addToCart: 18, costPerAddToCart: 11.57, landingPageViews: 260, costPerLandingPageView: 0.47, engagements: 949, costPerEngagement: 0.14, saves: 2, shares: 2, comments: 1 },
          { name: "Laudis – spoľahlivý pomocník v boji s burinou pri pestovaní kukurice", campaign: "sanaplant_05-07/26", spend: 62.12, value: 64.59, roas: 4.03, purchases: 1, costPerPurchase: 16.02, aov: 64.59, cpm: 4.74, impressions: 25069, reach: 12284, frequency: 3.95, clicks: 396, cpc: 0.3, ctr: 3.47, addToCart: 8, costPerAddToCart: 22.61, landingPageViews: 245, costPerLandingPageView: 0.48, engagements: 449, costPerEngagement: 0.26, saves: 2, shares: 3, comments: 1 },
          { name: "Gunner = presnosť, sila a spoľahlivosť v každom postreku", campaign: "sanaplant_05-07/26", spend: 59.64, purchases: 0, cpm: 10.43, impressions: 11312, reach: 6277, frequency: 3.44, clicks: 178, cpc: 0.64, ctr: 3.65, addToCart: 2, costPerAddToCart: 21.7, landingPageViews: 112, costPerLandingPageView: 1.01, engagements: 208, costPerEngagement: 0.54, saves: 4, shares: 4, comments: 1 },
          { name: "Starostlivosť o broskyne", campaign: "sanaplant_boosting_traffic", spend: 25.44, purchases: 0, cpm: 0.75, impressions: 33860, reach: 15562, frequency: 2.18, clicks: 1309, cpc: 0.02, ctr: 3.87, addToCart: 4, costPerAddToCart: 6.36, landingPageViews: 997, costPerLandingPageView: 0.03, engagements: 1363, costPerEngagement: 0.02, saves: 8, shares: 4, comments: 1 },
          { name: "Vrtivka čerešňová", campaign: "sanaplant_boosting_traffic", spend: 24.95, value: 511.2, roas: 20.49, purchases: 1, costPerPurchase: 24.95, aov: 511.2, cpm: 0.8, impressions: 31248, reach: 16096, frequency: 1.94, clicks: 1734, cpc: 0.01, ctr: 5.55, addToCart: 8, costPerAddToCart: 3.12, landingPageViews: 1197, costPerLandingPageView: 0.02, engagements: 1840, costPerEngagement: 0.01, saves: 1, shares: 7, comments: 3 },
          { name: "Mak patrí medzi plodiny", campaign: "sanaplant_boosting_traffic", spend: 24.92, purchases: 0, cpm: 1.67, impressions: 14959, reach: 9030, frequency: 1.66, clicks: 521, cpc: 0.05, ctr: 3.48, landingPageViews: 333, costPerLandingPageView: 0.07, engagements: 571, costPerEngagement: 0.04, shares: 1, comments: 1 },
          { name: "Sanaplant Poradňa | Škvrnité listy ríbezlí a egrešov", campaign: "sanaplant_boosting_traffic", spend: 20.33, purchases: 0, cpm: 0.95, impressions: 21462, reach: 12383, frequency: 1.73, clicks: 393, cpc: 0.05, ctr: 1.83, landingPageViews: 315, costPerLandingPageView: 0.06, engagements: 6490, costPerEngagement: 0, saves: 8, shares: 8, comments: 3 },
          { name: "Vrtivka čerešňová", campaign: "sanaplant_05-07/26", spend: 16.6, value: 16.37, roas: 0.99, purchases: 1, costPerPurchase: 16.6, aov: 16.37, cpm: 1.69, impressions: 9830, reach: 6814, frequency: 1.44, clicks: 187, cpc: 0.09, ctr: 1.9, addToCart: 11, costPerAddToCart: 1.51, landingPageViews: 101, costPerLandingPageView: 0.16, engagements: 268, costPerEngagement: 0.06, saves: 4, shares: 6 },
          { name: "ZDRAVÁ UHORKA - CELOROČNÁ OCHRANA", campaign: "sanaplant_boosting_traffic", spend: 16.37, purchases: 0, cpm: 1.4, impressions: 11705, reach: 6318, frequency: 1.85, clicks: 290, cpc: 0.06, ctr: 2.48, landingPageViews: 186, costPerLandingPageView: 0.09, engagements: 3136, costPerEngagement: 0.01, saves: 7, shares: 6 },
          { name: "Slimáky / slizniaky", campaign: "sanaplant_boosting_traffic", spend: 12.37, value: 16.07, roas: 1.3, purchases: 1, costPerPurchase: 12.37, aov: 16.07, cpm: 1.94, impressions: 6361, reach: 4306, frequency: 1.48, clicks: 286, cpc: 0.04, ctr: 4.5, addToCart: 1, costPerAddToCart: 12.37, landingPageViews: 154, costPerLandingPageView: 0.08, engagements: 352, costPerEngagement: 0.04, shares: 1 }
        ],
      },
      boosting: null,
      google: {
        spend: 1708.95, impressions: 511320, clicks: 10834, cpc: 0.16, ctr: 2.12,
        interactions: 18728, interactionRate: 3.66, convRate: 3.34, costPerConv: 2.74,
        purchases: 111.03, purchaseValue: 11039.89, conversions: 624.72, roas: 6.46,
        conversionActions: { purchase: 111.03, add_to_cart: 338.68, begin_checkout: 175.01 },
        campaigns: [
          { name: "PMax_sales_products", type: "Performance Max", status: "Enabled", purchases: 87.69, value: 8998.91, conversionActions: { add_to_cart: 261.51, purchase: 87.69, begin_checkout: 137.97 } },
          { name: "PMax - zlaté žltnutie viniča", type: "Performance Max", status: "Paused", purchases: 8.69, value: 598.15, conversionActions: { add_to_cart: 36.2, purchase: 8.69, begin_checkout: 10.95 } },
          { name: "PMax - kukurica", type: "Performance Max", status: "Enabled", purchases: 8.55, value: 945.39, conversionActions: { add_to_cart: 17.8, purchase: 8.55, begin_checkout: 12.38 } },
          { name: "PMax - listové hnojivá", type: "Performance Max", status: "Paused", purchases: 3.48, value: 323.67, conversionActions: { add_to_cart: 15.98, purchase: 3.48, begin_checkout: 5.56 } },
          { name: "PMax - obilniny", type: "Performance Max", status: "Paused", purchases: 2.62, value: 173.77, conversionActions: { add_to_cart: 7.2, purchase: 2.62, begin_checkout: 8.14 } }
        ],
      },
      ga: {
          paid: {
            sessions: 9382,
            users: 8175,
            engagementRate: 42.6,
            avgDuration: "00:13:25"
          },
          organic: {
            sessions: 12970,
            users: 10452,
            engagementRate: 47.15,
            avgDuration: "00:13:17"
          },
          snapshot: {
            activeUsers: 18001,
            newUsers: 15856,
            sessions: 22449,
            engagedSessions: 10046,
            engagementRate: 0.4475032295425186,
            totalRevenue: 15748.259998000001,
            keyEvents: 9805
          },
          trafficAcquisition: [
            {
              channelGroup: "Cross-network",
              sessions: 7680,
              engagedSessions: 4185,
              engagementRate: 0.544921875,
              avgEngagementTimePerSession: 44.04127604166667,
              eventsPerSession: 6.2875,
              eventCount: 48288,
              keyEvents: 5183,
              sessionKeyEventRate: 0.2735677083333333,
              totalRevenue: 9553.219999
            },
            {
              channelGroup: "Paid Social",
              sessions: 5656,
              engagedSessions: 2016,
              engagementRate: 0.3564356435643564,
              avgEngagementTimePerSession: 17.56488684582744,
              eventsPerSession: 4.00990099009901,
              eventCount: 22680,
              keyEvents: 563,
              sessionKeyEventRate: 0.05038896746817539,
              totalRevenue: 600.7
            },
            {
              channelGroup: "Organic Search",
              sessions: 4472,
              engagedSessions: 2487,
              engagementRate: 0.5561270125223614,
              avgEngagementTimePerSession: 36.690071556350624,
              eventsPerSession: 6.278398926654741,
              eventCount: 28077,
              keyEvents: 3059,
              sessionKeyEventRate: 0.29852415026833634,
              totalRevenue: 2616.019999
            },
            {
              channelGroup: "Direct",
              sessions: 3132,
              engagedSessions: 652,
              engagementRate: 0.2081736909323116,
              avgEngagementTimePerSession: 11.180715197956577,
              eventsPerSession: 4.933269476372924,
              eventCount: 15451,
              keyEvents: 478,
              sessionKeyEventRate: 0.08173690932311622,
              totalRevenue: 903.69
            },
            {
              channelGroup: "Organic Social",
              sessions: 361,
              engagedSessions: 120,
              engagementRate: 0.33240997229916897,
              avgEngagementTimePerSession: 13.681440443213296,
              eventsPerSession: 4.92797783933518,
              eventCount: 1779,
              keyEvents: 46,
              sessionKeyEventRate: 0.05817174515235457,
              totalRevenue: 244.81
            },
            {
              channelGroup: "Email",
              sessions: 348,
              engagedSessions: 200,
              engagementRate: 0.5747126436781609,
              avgEngagementTimePerSession: 71.22988505747126,
              eventsPerSession: 6.758620689655173,
              eventCount: 2352,
              keyEvents: 126,
              sessionKeyEventRate: 0.1752873563218391,
              totalRevenue: 0
            },
            {
              channelGroup: "Unassigned",
              sessions: 348,
              engagedSessions: 151,
              engagementRate: 0.4339080459770115,
              avgEngagementTimePerSession: 21.419540229885058,
              eventsPerSession: 5.554597701149425,
              eventCount: 1933,
              keyEvents: 173,
              sessionKeyEventRate: 0.23563218390804597,
              totalRevenue: 1590.62
            },
            {
              channelGroup: "Referral",
              sessions: 277,
              engagedSessions: 143,
              engagementRate: 0.516245487364621,
              avgEngagementTimePerSession: 32.42960288808664,
              eventsPerSession: 6.59927797833935,
              eventCount: 1828,
              keyEvents: 126,
              sessionKeyEventRate: 0.17328519855595667,
              totalRevenue: 239.2
            },
            {
              channelGroup: "Paid Search",
              sessions: 79,
              engagedSessions: 49,
              engagementRate: 0.620253164556962,
              avgEngagementTimePerSession: 14.30379746835443,
              eventsPerSession: 4.810126582278481,
              eventCount: 380,
              keyEvents: 7,
              sessionKeyEventRate: 0.0379746835443038,
              totalRevenue: 0
            },
            {
              channelGroup: "Organic Video",
              sessions: 49,
              engagedSessions: 19,
              engagementRate: 0.3877551020408163,
              avgEngagementTimePerSession: 15.673469387755102,
              eventsPerSession: 4.122448979591836,
              eventCount: 202,
              keyEvents: 24,
              sessionKeyEventRate: 0.20408163265306123,
              totalRevenue: 0
            },
            {
              channelGroup: "Organic Shopping",
              sessions: 47,
              engagedSessions: 24,
              engagementRate: 0.5106382978723404,
              avgEngagementTimePerSession: 25.574468085106382,
              eventsPerSession: 4.404255319148936,
              eventCount: 207,
              keyEvents: 20,
              sessionKeyEventRate: 0.3191489361702128,
              totalRevenue: 0
            }
          ],
          userAcquisition: [
            {
              firstUserChannelGroup: "Cross-network",
              totalUsers: 5765,
              newUsers: 5169,
              returningUsers: 860,
              avgEngagementTimePerActiveUser: 51.7667317592757,
              engagedSessionsPerActiveUser: 0.6733534528670335,
              eventCount: 42858,
              keyEvents: 4314,
              userKeyEventRate: 0.21409550860997692
            },
            {
              firstUserChannelGroup: "Paid Social",
              totalUsers: 4240,
              newUsers: 3710,
              returningUsers: 485,
              avgEngagementTimePerActiveUser: 23.524980978950037,
              engagedSessionsPerActiveUser: 0.49581536900836926,
              eventCount: 21860,
              keyEvents: 478,
              userKeyEventRate: 0.05452700989094598
            },
            {
              firstUserChannelGroup: "Organic Search",
              totalUsers: 3564,
              newUsers: 2831,
              returningUsers: 830,
              avgEngagementTimePerActiveUser: 58.09232578653337,
              engagedSessionsPerActiveUser: 0.7997647750661571,
              eventCount: 31024,
              keyEvents: 3571,
              userKeyEventRate: 0.2708027050867392
            },
            {
              firstUserChannelGroup: "Direct",
              totalUsers: 3268,
              newUsers: 3076,
              returningUsers: 199,
              avgEngagementTimePerActiveUser: 18.481931464174455,
              engagedSessionsPerActiveUser: 0.29750778816199375,
              eventCount: 19365,
              keyEvents: 935,
              userKeyEventRate: 0.09844236760124611
            },
            {
              firstUserChannelGroup: "Organic Social",
              totalUsers: 338,
              newUsers: 313,
              returningUsers: 18,
              avgEngagementTimePerActiveUser: 11.653374233128835,
              engagedSessionsPerActiveUser: 0.35276073619631904,
              eventCount: 1723,
              keyEvents: 49,
              userKeyEventRate: 0.05828220858895705
            },
            {
              firstUserChannelGroup: "Unassigned",
              totalUsers: 269,
              newUsers: 238,
              returningUsers: 32,
              avgEngagementTimePerActiveUser: 21.56,
              engagedSessionsPerActiveUser: 0.56,
              eventCount: 1616,
              keyEvents: 130,
              userKeyEventRate: 0.2
            },
            {
              firstUserChannelGroup: "Referral",
              totalUsers: 220,
              newUsers: 193,
              returningUsers: 30,
              avgEngagementTimePerActiveUser: 33.740566037735846,
              engagedSessionsPerActiveUser: 0.5849056603773585,
              eventCount: 1581,
              keyEvents: 113,
              userKeyEventRate: 0.1792452830188679
            },
            {
              firstUserChannelGroup: "Email",
              totalUsers: 196,
              newUsers: 203,
              returningUsers: 35,
              avgEngagementTimePerActiveUser: 139,
              engagedSessionsPerActiveUser: 0.9891891891891892,
              eventCount: 2336,
              keyEvents: 163,
              userKeyEventRate: 0.21081081081081082
            },
            {
              firstUserChannelGroup: "Paid Search",
              totalUsers: 85,
              newUsers: 76,
              returningUsers: 11,
              avgEngagementTimePerActiveUser: 26.301204819277107,
              engagedSessionsPerActiveUser: 0.8192771084337349,
              eventCount: 530,
              keyEvents: 34,
              userKeyEventRate: 0.07228915662650602
            },
            {
              firstUserChannelGroup: "Organic Shopping",
              totalUsers: 38,
              newUsers: 29,
              returningUsers: 10,
              avgEngagementTimePerActiveUser: 8.789473684210526,
              engagedSessionsPerActiveUser: 0.5526315789473685,
              eventCount: 179,
              keyEvents: 13,
              userKeyEventRate: 0.2631578947368421
            },
            {
              firstUserChannelGroup: "Organic Video",
              totalUsers: 18,
              newUsers: 18,
              returningUsers: 2,
              avgEngagementTimePerActiveUser: 6.111111111111111,
              engagedSessionsPerActiveUser: 0.6111111111111112,
              eventCount: 105,
              keyEvents: 5,
              userKeyEventRate: 0.1111111111111111
            }
          ],
          landingPages: [
            {
              path: "/produkt/zlte-lepove-dosky",
              sessions: 1729,
              activeUsers: 1225,
              newUsers: 1152,
              avgEngagementTimePerSession: 11.196067090803933,
              totalRevenue: 32.74,
              bounceRate: 0.6980913823019086,
              addToCart: 21,
              checkouts: 1,
              purchases: 2
            },
            {
              path: "/znacka-produktu/broskyna-celorocna-ochrana-a-vyziva",
              sessions: 1099,
              activeUsers: 758,
              newUsers: 657,
              avgEngagementTimePerSession: 14.255686988171064,
              totalRevenue: 0,
              bounceRate: 0.6305732484076433,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/sivanto-prime",
              sessions: 936,
              activeUsers: 675,
              newUsers: 517,
              avgEngagementTimePerSession: 49.79380341880342,
              totalRevenue: 558.08,
              bounceRate: 0.4561965811965812,
              addToCart: 63,
              checkouts: 17,
              purchases: 8
            },
            {
              path: "/",
              sessions: 893,
              activeUsers: 736,
              newUsers: 619,
              avgEngagementTimePerSession: 30.845464725643897,
              totalRevenue: 433.46,
              bounceRate: 0.7245240761478163,
              addToCart: 27,
              checkouts: 13,
              purchases: 4
            },
            {
              path: "/produkt/laudis-od-1-l",
              sessions: 764,
              activeUsers: 620,
              newUsers: 490,
              avgEngagementTimePerSession: 44.16492146596859,
              totalRevenue: 808.05,
              bounceRate: 0.4424083769633508,
              addToCart: 47,
              checkouts: 24,
              purchases: 12
            },
            {
              path: "/produkt/barbarian-super-1-l",
              sessions: 509,
              activeUsers: 455,
              newUsers: 413,
              avgEngagementTimePerSession: 52.54420432220039,
              totalRevenue: 85.25,
              bounceRate: 0.43222003929273084,
              addToCart: 38,
              checkouts: 2,
              purchases: 3
            },
            {
              path: "/produkt/karate-zeon-5-cs",
              sessions: 453,
              activeUsers: 422,
              newUsers: 406,
              avgEngagementTimePerSession: 28.88962472406181,
              totalRevenue: 21.87,
              bounceRate: 0.6600441501103753,
              addToCart: 6,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/kompletny-sprievodca-pestovanim-a-ochranou-repky-slnecnice-maku-a-soje",
              sessions: 453,
              activeUsers: 370,
              newUsers: 352,
              avgEngagementTimePerSession: 6.717439293598234,
              totalRevenue: 0,
              bounceRate: 0.7615894039735099,
              addToCart: 4,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/cyperfor-100-ec",
              sessions: 431,
              activeUsers: 387,
              newUsers: 352,
              avgEngagementTimePerSession: 56.05336426914153,
              totalRevenue: 311.7,
              bounceRate: 0.5777262180974478,
              addToCart: 21,
              checkouts: 13,
              purchases: 6
            },
            {
              path: "/zlate-zltnutie-vinica",
              sessions: 415,
              activeUsers: 315,
              newUsers: 263,
              avgEngagementTimePerSession: 101.40963855421687,
              totalRevenue: 625.86,
              bounceRate: 0.4746987951807229,
              addToCart: 23,
              checkouts: 15,
              purchases: 6
            },
            {
              path: "/produkt/neemazal-t-s",
              sessions: 316,
              activeUsers: 265,
              newUsers: 249,
              avgEngagementTimePerSession: 20.015822784810126,
              totalRevenue: 18.12,
              bounceRate: 0.5348101265822784,
              addToCart: 18,
              checkouts: 3,
              purchases: 1
            },
            {
              path: "/produkt/pony-306-se-1-l",
              sessions: 281,
              activeUsers: 263,
              newUsers: 203,
              avgEngagementTimePerSession: 36.5338078291815,
              totalRevenue: 0,
              bounceRate: 0.38434163701067614,
              addToCart: 2,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/gunner-1-l",
              sessions: 276,
              activeUsers: 223,
              newUsers: 187,
              avgEngagementTimePerSession: 22.304347826086957,
              totalRevenue: 0,
              bounceRate: 0.4963768115942029,
              addToCart: 7,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/odborna-poradna",
              sessions: 241,
              activeUsers: 163,
              newUsers: 151,
              avgEngagementTimePerSession: 4.157676348547718,
              totalRevenue: 0,
              bounceRate: 0.6680497925311203,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/desimo-duo",
              sessions: 241,
              activeUsers: 223,
              newUsers: 219,
              avgEngagementTimePerSession: 2.863070539419087,
              totalRevenue: 16.07,
              bounceRate: 0.8340248962655602,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/znacka-produktu/uhorka-celorocna-ochrana-a-vyziva",
              sessions: 223,
              activeUsers: 180,
              newUsers: 170,
              avgEngagementTimePerSession: 13.547085201793722,
              totalRevenue: 0,
              bounceRate: 0.7354260089686099,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/znacka-produktu/kukurica",
              sessions: 211,
              activeUsers: 200,
              newUsers: 145,
              avgEngagementTimePerSession: 87.22274881516587,
              totalRevenue: 649.08,
              bounceRate: 0.4786729857819905,
              addToCart: 29,
              checkouts: 13,
              purchases: 5
            },
            {
              path: "/produkt/damisol-gold-frigomax-1-l",
              sessions: 203,
              activeUsers: 127,
              newUsers: 104,
              avgEngagementTimePerSession: 24.665024630541872,
              totalRevenue: 23.97,
              bounceRate: 0.541871921182266,
              addToCart: 5,
              checkouts: 4,
              purchases: 1
            },
            {
              path: "/produkt/foli-max-universal",
              sessions: 191,
              activeUsers: 175,
              newUsers: 149,
              avgEngagementTimePerSession: 21.50261780104712,
              totalRevenue: 84.17,
              bounceRate: 0.5235602094240838,
              addToCart: 6,
              checkouts: 1,
              purchases: 2
            },
            {
              path: "/produkt/mospilan-20-sp",
              sessions: 157,
              activeUsers: 149,
              newUsers: 136,
              avgEngagementTimePerSession: 24.878980891719745,
              totalRevenue: 0,
              bounceRate: 0.5923566878980892,
              addToCart: 2,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "(not set)",
              sessions: 145,
              activeUsers: 115,
              newUsers: 103,
              avgEngagementTimePerSession: 10.6,
              totalRevenue: 0,
              bounceRate: 0.6758620689655173,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/harmavit-special",
              sessions: 135,
              activeUsers: 120,
              newUsers: 103,
              avgEngagementTimePerSession: 61.903703703703705,
              totalRevenue: 734.57,
              bounceRate: 0.43703703703703706,
              addToCart: 18,
              checkouts: 12,
              purchases: 6
            },
            {
              path: "/kategoria-produktu/sikovny-gazda",
              sessions: 122,
              activeUsers: 111,
              newUsers: 78,
              avgEngagementTimePerSession: 50.704918032786885,
              totalRevenue: 0,
              bounceRate: 0.3360655737704918,
              addToCart: 4,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/poradna",
              sessions: 117,
              activeUsers: 88,
              newUsers: 87,
              avgEngagementTimePerSession: 0.08547008547008547,
              totalRevenue: 0,
              bounceRate: 0.8717948717948718,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/flipper-ew-4798-1-l",
              sessions: 112,
              activeUsers: 100,
              newUsers: 80,
              avgEngagementTimePerSession: 29.848214285714285,
              totalRevenue: 110.36,
              bounceRate: 0.44642857142857145,
              addToCart: 9,
              checkouts: 3,
              purchases: 2
            },
            {
              path: "/produkt/pirimor-50-wg-1-kg",
              sessions: 111,
              activeUsers: 102,
              newUsers: 86,
              avgEngagementTimePerSession: 58.85585585585586,
              totalRevenue: 567.85,
              bounceRate: 0.3963963963963964,
              addToCart: 12,
              checkouts: 5,
              purchases: 5
            },
            {
              path: "/znacka-produktu/listove-hnojiva",
              sessions: 108,
              activeUsers: 92,
              newUsers: 80,
              avgEngagementTimePerSession: 48.48148148148148,
              totalRevenue: 153.52,
              bounceRate: 0.5555555555555556,
              addToCart: 2,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/quantum-ultra-complex-1-l",
              sessions: 98,
              activeUsers: 92,
              newUsers: 70,
              avgEngagementTimePerSession: 20.397959183673468,
              totalRevenue: 44.11,
              bounceRate: 0.5306122448979592,
              addToCart: 7,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/laudis-od-5-l",
              sessions: 95,
              activeUsers: 85,
              newUsers: 56,
              avgEngagementTimePerSession: 27.347368421052632,
              totalRevenue: 175.17,
              bounceRate: 0.4631578947368421,
              addToCart: 4,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/lucerna-siata-vlasta",
              sessions: 91,
              activeUsers: 87,
              newUsers: 85,
              avgEngagementTimePerSession: 23.835164835164836,
              totalRevenue: 85.06,
              bounceRate: 0.6483516483516484,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/k-othrine-25-sc-1-l",
              sessions: 84,
              activeUsers: 78,
              newUsers: 71,
              avgEngagementTimePerSession: 44.01190476190476,
              totalRevenue: 995.85,
              bounceRate: 0.44047619047619047,
              addToCart: 11,
              checkouts: 7,
              purchases: 6
            },
            {
              path: "/produkt/quantum-ultra-complex-5-l",
              sessions: 78,
              activeUsers: 69,
              newUsers: 51,
              avgEngagementTimePerSession: 21.525641025641026,
              totalRevenue: 0,
              bounceRate: 0.5,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/delan-700-wdg-1-kg",
              sessions: 75,
              activeUsers: 67,
              newUsers: 42,
              avgEngagementTimePerSession: 24.786666666666665,
              totalRevenue: 0,
              bounceRate: 0.3333333333333333,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/infinito-sc",
              sessions: 74,
              activeUsers: 62,
              newUsers: 44,
              avgEngagementTimePerSession: 23.89189189189189,
              totalRevenue: 0,
              bounceRate: 0.3783783783783784,
              addToCart: 4,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/signum-1-kg",
              sessions: 73,
              activeUsers: 61,
              newUsers: 40,
              avgEngagementTimePerSession: 74.57534246575342,
              totalRevenue: 137.89,
              bounceRate: 0.3698630136986301,
              addToCart: 1,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/maister-power-5-l",
              sessions: 71,
              activeUsers: 59,
              newUsers: 33,
              avgEngagementTimePerSession: 20.56338028169014,
              totalRevenue: 0,
              bounceRate: 0.38028169014084506,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/znacka-produktu/obilniny",
              sessions: 68,
              activeUsers: 59,
              newUsers: 56,
              avgEngagementTimePerSession: 36.85294117647059,
              totalRevenue: 0,
              bounceRate: 0.5294117647058824,
              addToCart: 2,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/herbavital",
              sessions: 67,
              activeUsers: 62,
              newUsers: 43,
              avgEngagementTimePerSession: 65.07462686567165,
              totalRevenue: 98.72,
              bounceRate: 0.31343283582089554,
              addToCart: 4,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/ls-prothio-tebuc-fungicid",
              sessions: 67,
              activeUsers: 54,
              newUsers: 51,
              avgEngagementTimePerSession: 48.91044776119403,
              totalRevenue: 0,
              bounceRate: 0.44776119402985076,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/machozrut",
              sessions: 67,
              activeUsers: 64,
              newUsers: 62,
              avgEngagementTimePerSession: 58.97014925373134,
              totalRevenue: 263.06,
              bounceRate: 0.47761194029850745,
              addToCart: 17,
              checkouts: 10,
              purchases: 4
            },
            {
              path: "/produkt/ls-profix-systemovy-fungicid-na-choroby-obilnin",
              sessions: 65,
              activeUsers: 57,
              newUsers: 42,
              avgEngagementTimePerSession: 18.476923076923075,
              totalRevenue: 0,
              bounceRate: 0.38461538461538464,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/hydrohumat_1l",
              sessions: 63,
              activeUsers: 57,
              newUsers: 48,
              avgEngagementTimePerSession: 62.904761904761905,
              totalRevenue: 0,
              bounceRate: 0.4444444444444444,
              addToCart: 4,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/encyklopedia-chorob-skodcov-a-vyzivy-zahradnickych-rastlin",
              sessions: 59,
              activeUsers: 25,
              newUsers: 21,
              avgEngagementTimePerSession: 50.88135593220339,
              totalRevenue: 171.28,
              bounceRate: 0.6779661016949152,
              addToCart: 10,
              checkouts: 3,
              purchases: 3
            },
            {
              path: "/produkt/liadok-27",
              sessions: 59,
              activeUsers: 55,
              newUsers: 50,
              avgEngagementTimePerSession: 27.559322033898304,
              totalRevenue: 19.54,
              bounceRate: 0.6101694915254238,
              addToCart: 4,
              checkouts: 3,
              purchases: 1
            },
            {
              path: "/produkt/puma-extra-5-l",
              sessions: 59,
              activeUsers: 57,
              newUsers: 56,
              avgEngagementTimePerSession: 21.593220338983052,
              totalRevenue: 0,
              bounceRate: 0.5423728813559322,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/pulsar-40-5-l",
              sessions: 58,
              activeUsers: 49,
              newUsers: 31,
              avgEngagementTimePerSession: 36.93103448275862,
              totalRevenue: 0,
              bounceRate: 0.2413793103448276,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/karate-zeon-5-cs-xl-50-l-xl-50-l",
              sessions: 57,
              activeUsers: 52,
              newUsers: 38,
              avgEngagementTimePerSession: 14.403508771929825,
              totalRevenue: 0,
              bounceRate: 0.5263157894736842,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/benevia",
              sessions: 56,
              activeUsers: 47,
              newUsers: 36,
              avgEngagementTimePerSession: 29.464285714285715,
              totalRevenue: 511.2,
              bounceRate: 0.4642857142857143,
              addToCart: 5,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/bio-fer-natur-4-3-3-500-kg",
              sessions: 56,
              activeUsers: 50,
              newUsers: 45,
              avgEngagementTimePerSession: 19.232142857142858,
              totalRevenue: 0,
              bounceRate: 0.5535714285714286,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/mustang-forte-5-l",
              sessions: 55,
              activeUsers: 49,
              newUsers: 37,
              avgEngagementTimePerSession: 30.163636363636364,
              totalRevenue: 0,
              bounceRate: 0.509090909090909,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            }
          ],
          ecommerceItems: [
            {
              name: "Passat, 5 l",
              itemsViewed: 54,
              itemsAddedToCart: 7,
              itemsPurchased: 3,
              itemRevenue: 1334.719999
            },
            {
              name: "Sivanto Prime",
              itemsViewed: 437,
              itemsAddedToCart: 59,
              itemsPurchased: 20,
              itemRevenue: 1197.629999
            },
            {
              name: "Laudis OD, 1 l",
              itemsViewed: 297,
              itemsAddedToCart: 58,
              itemsPurchased: 17,
              itemRevenue: 987.02
            },
            {
              name: "Callisto 100 SC, 5 l",
              itemsViewed: 33,
              itemsAddedToCart: 2,
              itemsPurchased: 2,
              itemRevenue: 848.72
            },
            {
              name: "K - Othrine 25 SC, 1 l",
              itemsViewed: 40,
              itemsAddedToCart: 11,
              itemsPurchased: 6,
              itemRevenue: 832.440001
            },
            {
              name: "Harmavit Špeciál",
              itemsViewed: 72,
              itemsAddedToCart: 30,
              itemsPurchased: 18,
              itemRevenue: 786.919998
            },
            {
              name: "Pirimor 50 WG, 1 kg",
              itemsViewed: 50,
              itemsAddedToCart: 13,
              itemsPurchased: 5,
              itemRevenue: 563.85
            },
            {
              name: "Garlon New, 5 l",
              itemsViewed: 13,
              itemsAddedToCart: 3,
              itemsPurchased: 3,
              itemRevenue: 518.369999
            },
            {
              name: "Cyperfor 100 EC",
              itemsViewed: 224,
              itemsAddedToCart: 43,
              itemsPurchased: 25,
              itemRevenue: 502.849998
            },
            {
              name: "Boxer 800 EC, 20 l",
              itemsViewed: 6,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 408.24
            },
            {
              name: "Sudánska tráva",
              itemsViewed: 42,
              itemsAddedToCart: 110,
              itemsPurchased: 80,
              itemRevenue: 368.569998
            },
            {
              name: "Dirigent, 5 l",
              itemsViewed: 9,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 325.97
            },
            {
              name: "Kumulus WG, 20 kg",
              itemsViewed: 26,
              itemsAddedToCart: 14,
              itemsPurchased: 3,
              itemRevenue: 295.05
            },
            {
              name: "Delan Pro, 5 l",
              itemsViewed: 20,
              itemsAddedToCart: 3,
              itemsPurchased: 2,
              itemRevenue: 291.96
            },
            {
              name: "Sharpen 40 EC, 10 l",
              itemsViewed: 8,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 260.45
            },
            {
              name: "Machožrút, 1 l",
              itemsViewed: 36,
              itemsAddedToCart: 49,
              itemsPurchased: 21,
              itemRevenue: 249.060006
            },
            {
              name: "Luna Experience, 1 l",
              itemsViewed: 23,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 248.46
            },
            {
              name: "Aurora 40 WG, 400 g",
              itemsViewed: 98,
              itemsAddedToCart: 39,
              itemsPurchased: 2,
              itemRevenue: 237.26
            },
            {
              name: "Sekator OD, 1 l",
              itemsViewed: 26,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 215.47
            },
            {
              name: "Casper 55 WG, 1 kg",
              itemsViewed: 103,
              itemsAddedToCart: 31,
              itemsPurchased: 1,
              itemRevenue: 195.39
            },
            {
              name: "Barbarian Super, 20 l",
              itemsViewed: 103,
              itemsAddedToCart: 28,
              itemsPurchased: 1,
              itemRevenue: 192.62
            },
            {
              name: "Folpan Gold, 5 kg",
              itemsViewed: 3,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 191.73
            },
            {
              name: "Fantic F, 5 kg",
              itemsViewed: 11,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 180.44
            },
            {
              name: "Chwastox 500 SL, 10 l",
              itemsViewed: 5,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 179.41
            },
            {
              name: "Grasstex - netkaná polyesterová geotextília naplnená trávovým osivom",
              itemsViewed: 5,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 174.34
            },
            {
              name: "Nutrino Bora, 10 l",
              itemsViewed: 9,
              itemsAddedToCart: 4,
              itemsPurchased: 3,
              itemRevenue: 167.910001
            },
            {
              name: "Encyklopédia chorôb, škodcov a výživy záhradníckych rastlín",
              itemsViewed: 30,
              itemsAddedToCart: 11,
              itemsPurchased: 3,
              itemRevenue: 163.75
            },
            {
              name: "Aqua Py, 1 l",
              itemsViewed: 5,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 159.41
            },
            {
              name: "Refine 50 SX , 90 g",
              itemsViewed: 19,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 154.99
            },
            {
              name: "Pronto, 1 l",
              itemsViewed: 13,
              itemsAddedToCart: 4,
              itemsPurchased: 4,
              itemRevenue: 140.960001
            },
            {
              name: "Signum, 1 kg",
              itemsViewed: 42,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 136.89
            },
            {
              name: "Cyflamid 50 EW, 1 l",
              itemsViewed: 6,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 126.35
            },
            {
              name: "Trebon OSR, 1 l",
              itemsViewed: 28,
              itemsAddedToCart: 5,
              itemsPurchased: 1,
              itemRevenue: 116.22
            },
            {
              name: "Fixa Zn, 10 l",
              itemsViewed: 59,
              itemsAddedToCart: 21,
              itemsPurchased: 1,
              itemRevenue: 113.14
            },
            {
              name: "Lentagran WP, 1 kg",
              itemsViewed: 6,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 112.27
            },
            {
              name: "Serenade ASO, 5 l",
              itemsViewed: 30,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 112.24
            },
            {
              name: "Flipper EW 479,8, 1 l",
              itemsViewed: 82,
              itemsAddedToCart: 19,
              itemsPurchased: 4,
              itemRevenue: 100.42
            },
            {
              name: "Herbavital, 10 l",
              itemsViewed: 46,
              itemsAddedToCart: 8,
              itemsPurchased: 1,
              itemRevenue: 97.72
            },
            {
              name: "Barbarian Super, 1 l",
              itemsViewed: 108,
              itemsAddedToCart: 42,
              itemsPurchased: 6,
              itemRevenue: 92.28
            },
            {
              name: "Dynali, 1 l",
              itemsViewed: 30,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 91.29
            },
            {
              name: "Asahi SL",
              itemsViewed: 5,
              itemsAddedToCart: 3,
              itemsPurchased: 2,
              itemRevenue: 88.26
            },
            {
              name: "Lucerna siata - Vlasta",
              itemsViewed: 38,
              itemsAddedToCart: 5,
              itemsPurchased: 1,
              itemRevenue: 84.06
            },
            {
              name: "Touchdown System 4",
              itemsViewed: 16,
              itemsAddedToCart: 14,
              itemsPurchased: 3,
              itemRevenue: 83.58
            },
            {
              name: "Retacel Extra R68, 10 l",
              itemsViewed: 15,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 77.23
            },
            {
              name: "Thiovit Jet, 10 kg",
              itemsViewed: 22,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 75.98
            },
            {
              name: "Ďatelina plazivá - Apollo 1 kg",
              itemsViewed: 28,
              itemsAddedToCart: 20,
              itemsPurchased: 6,
              itemRevenue: 73.799999
            },
            {
              name: "Cythrin Max, 0,5 l",
              itemsViewed: 36,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 68.62
            },
            {
              name: "Foli MAX Universal, 0,5 l",
              itemsViewed: 93,
              itemsAddedToCart: 24,
              itemsPurchased: 11,
              itemRevenue: 67.32
            },
            {
              name: "Karate Zeon 5 CS",
              itemsViewed: 56,
              itemsAddedToCart: 19,
              itemsPurchased: 9,
              itemRevenue: 63.47
            },
            {
              name: "Silwet Star, 1 l",
              itemsViewed: 9,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 62.31
            }
          ]
      },
      email: {
        sent: null, openRate: 12.84, clickRate: 1.18, uniqueClicks: 280,
        unsubRate: 0.31, orders: 5, revenue: 164.13, campaignsCount: 4,
      },
      eshop: {
        woocommerce: true,
        revenue: 28655.76,
        netRevenue: 22904.89,
        grossSales: 23146.68,
        orders: 229,
        items: 883,
        variants: 510,
        refunds: 0,
        coupons: 241.79,
        taxes: 5331.71,
        shipping: 419.16,
        categories: [
          { name: 'Fungicídy', items: 608, netRevenue: 10671.98 },
          { name: 'Záhradkári', items: 528, netRevenue: 4535.5 },
          { name: 'Herbicídy', items: 299, netRevenue: 16475 },
          { name: 'Insekcitídy', items: 272, netRevenue: 6393.28 },
          { name: 'Poľnohospodári', items: 233, netRevenue: 15301.62 },
          { name: 'Šikovný gazda', items: 199, netRevenue: 4231.27 },
          { name: 'Výživa rastlín', items: 167, netRevenue: 2824.05 },
          { name: 'Exkluzívne produkty', items: 156, netRevenue: 3306.51 },
          { name: 'Osivá', items: 110, netRevenue: 624.02 },
          { name: 'Listová výživa', items: 74, netRevenue: 1694.27 },
          { name: 'Trávy a ďatelinoviny', items: 68, netRevenue: 332.36 },
          { name: 'Ostatné', items: 37, netRevenue: 335.74 },
          { name: 'Hnojivá', items: 31, netRevenue: 255.86 },
        ],
        products: [
          { name: 'Aliette 80 WG', sku: '2283', items: 91, netRevenue: 311.22, orders: 3, variants: 2 },
          { name: 'Signum', sku: '2304', items: 47, netRevenue: 296.4, orders: 5, variants: 3 },
          { name: 'Kumulus WG', sku: '2294', items: 43, netRevenue: 162.59, orders: 3, variants: 2 },
          { name: 'Machožrút, 1 l', sku: '2362', items: 41, netRevenue: 395.24, orders: 10, variants: 0 },
          { name: 'Tráva - Mätonoh trváci Solen 1 kg', sku: '2fe47a02e979', items: 34, netRevenue: 97.1, orders: 2, variants: 0 },
          { name: 'Sivanto Prime', sku: '1294', items: 29, netRevenue: 1277.44, orders: 24, variants: 2 },
          { name: 'Cyperfor 100 EC', sku: '2071', items: 28, netRevenue: 531.06, orders: 18, variants: 3 },
          { name: 'Laudis OD, 1 l', sku: '1214-1', items: 26, netRevenue: 1222.48, orders: 19, variants: 0 },
          { name: 'Kocide 2000', sku: '2293', items: 25, netRevenue: 154, orders: 2, variants: 2 },
          { name: 'Žlté lepové dosky', sku: '2408', items: 21, netRevenue: 74.4, orders: 8, variants: 2 },
          { name: 'Harmavit Špeciál', sku: '2237', items: 20, netRevenue: 699.7, orders: 9, variants: 2 },
          { name: 'Cuproxat SC', sku: '2333', items: 20, netRevenue: 113.6, orders: 1, variants: 2 },
          { name: 'Sudánska tráva', sku: 'f75201af0400', items: 20, netRevenue: 74.81, orders: 4, variants: 0 },
          { name: 'Foli MAX Universal, 0,5 l', sku: '2281', items: 19, netRevenue: 92.56, orders: 8, variants: 0 },
          { name: 'Flipper EW 479,8, 1 l', sku: '2076', items: 16, netRevenue: 242.11, orders: 4, variants: 0 },
          { name: 'Mospilan 20 SP', sku: '2322', items: 16, netRevenue: 23.3, orders: 4, variants: 3 },
          { name: 'Vivando', sku: '2307', items: 13, netRevenue: 58.24, orders: 2, variants: 2 },
          { name: 'Barbarian Super, 1 l', sku: '1118-1', items: 12, netRevenue: 149.37, orders: 9, variants: 0 },
          { name: 'Gondola', sku: '2319', items: 11, netRevenue: 37.95, orders: 5, variants: 2 },
          { name: 'K - Othrine 25 SC, 1 l', sku: '1835', items: 10, netRevenue: 1122.36, orders: 10, variants: 0 },
          { name: 'Pronto, 1 l', sku: '1896', items: 10, netRevenue: 263.58, orders: 3, variants: 0 },
          { name: 'Dicopur M 750', sku: '2311', items: 10, netRevenue: 97.84, orders: 5, variants: 3 },
          { name: 'Karate Zeon 5 CS', sku: '2320', items: 10, netRevenue: 57.79, orders: 6, variants: 3 },
          { name: 'Combi Protec', sku: '1607', items: 9, netRevenue: 336.17, orders: 3, variants: 2 },
          { name: 'Proso siate', sku: '2871', items: 8, netRevenue: 13.28, orders: 4, variants: 2 },
        ],
      },
    },
    {
      year: 2026, month: 6,
      meta: {
        spend: 872.7, impressions: 360745, reach: 162387, clicks: 7940,
        purchases: 36, purchaseValue: 3556.34, roas: 4.08, addToCart: 188,
        cpc: 0.11, costPerPurchase: 24.24,
        ads: [
          { name: "Sivanto Prime", campaign: "sanaplant_05-07/26", spend: 149.98, value: 886.19, roas: 5.91, purchases: 9, costPerPurchase: 16.66, aov: 98.47, cpm: 2.94, impressions: 51052, reach: 15414, frequency: 3.31, clicks: 1062, cpc: 0.14, ctr: 2.08, addToCart: 34, costPerAddToCart: 4.41, landingPageViews: 649, costPerLandingPageView: 0.23, engagements: 2182, costPerEngagement: 0.07, saves: 12, shares: 24, comments: 1 },
          { name: "zltnutie vinica", campaign: "sanaplant_catalog_2026", spend: 120.53, value: 1462.22, roas: 12.13, purchases: 15, costPerPurchase: 8.04, aov: 97.48, cpm: 2.5, impressions: 48293, reach: 11327, frequency: 4.26, clicks: 1174, cpc: 0.1, ctr: 2.43, addToCart: 82, costPerAddToCart: 1.47, landingPageViews: 679, costPerLandingPageView: 0.18, engagements: 1261, costPerEngagement: 0.1, saves: 18, shares: 17, comments: 2 },
          { name: "Šikovný gazda vie, čím ochráni svoju úrodu.", campaign: "sanaplant_05-07/26", spend: 111.24, value: 686.94, roas: 6.18, purchases: 5, costPerPurchase: 22.25, aov: 137.39, cpm: 2.99, impressions: 37147, reach: 12774, frequency: 2.91, clicks: 1112, cpc: 0.1, ctr: 2.99, addToCart: 26, costPerAddToCart: 4.28, landingPageViews: 677, costPerLandingPageView: 0.16, engagements: 1531, costPerEngagement: 0.07, saves: 8, shares: 19 },
          { name: "Gunner = presnosť, sila a spoľahlivosť v každom postreku", campaign: "sanaplant_05-07/26", spend: 87.55, value: 390.76, roas: 4.46, purchases: 3, costPerPurchase: 29.18, aov: 130.25, cpm: 3.91, impressions: 22404, reach: 8070, frequency: 2.78, clicks: 376, cpc: 0.23, ctr: 1.68, addToCart: 10, costPerAddToCart: 8.76, landingPageViews: 237, costPerLandingPageView: 0.37, engagements: 401, costPerEngagement: 0.22, saves: 3, shares: 5 },
          { name: "Foli Max", campaign: "sanaplant_05-07/26", spend: 76.49, value: 46.52, roas: 0.63, purchases: 2, costPerPurchase: 36.71, aov: 23.26, cpm: 6.82, impressions: 18092, reach: 8092, frequency: 3.56, clicks: 268, cpc: 0.62, ctr: 2.26, addToCart: 16, costPerAddToCart: 4.59, landingPageViews: 149, costPerLandingPageView: 1.12, engagements: 291, costPerEngagement: 0.57, saves: 1, shares: 4 },
          { name: "Nedovoľte stresu zastaviť rast vašich plodín", campaign: "sanaplant_boosting_traffic", spend: 49.93, purchases: 0, cpm: 3.42, impressions: 29543, reach: 15261, frequency: 3.87, clicks: 639, cpc: 0.16, ctr: 4.39, addToCart: 2, costPerAddToCart: 12.49, landingPageViews: 455, costPerLandingPageView: 0.22, engagements: 4079, costPerEngagement: 0.03, saves: 5, shares: 6 },
          { name: "Nakupovať-Šikovný gazda vie, čím ochráni svoju úrodu.", campaign: "sanaplant_boosting_traffic", spend: 32.13, purchases: 0, cpm: 1.91, impressions: 16864, reach: 10822, frequency: 1.56, clicks: 299, cpc: 0.11, ctr: 1.77, landingPageViews: 194, costPerLandingPageView: 0.17, engagements: 3330, costPerEngagement: 0.01, saves: 2, shares: 4, comments: 1 },
          { name: "sanaplant_vybrane_produkty", campaign: "sanaplant_catalog_2026", spend: 31.05, value: 63.06, roas: 2.03, purchases: 1, costPerPurchase: 31.05, aov: 63.06, cpm: 5.62, impressions: 5524, reach: 754, frequency: 7.33, clicks: 123, cpc: 0.25, ctr: 2.23, addToCart: 3, costPerAddToCart: 10.35, landingPageViews: 70, costPerLandingPageView: 0.44, engagements: 125, costPerEngagement: 0.25 },
          { name: "listové hnojivá", campaign: "sanaplant_catalog_2026", spend: 30.04, value: 20.65, roas: 0.69, purchases: 1, costPerPurchase: 30.04, aov: 20.65, cpm: 2.16, impressions: 13899, reach: 6647, frequency: 2.09, clicks: 192, cpc: 0.16, ctr: 1.38, addToCart: 3, costPerAddToCart: 10.01, landingPageViews: 118, costPerLandingPageView: 0.25, engagements: 202, costPerEngagement: 0.15, saves: 1 },
          { name: "Biele pásiky na listoch ovsa?", campaign: "sanaplant_boosting", spend: 24.96, purchases: 0, cpm: 1.89, impressions: 13188, reach: 6999, frequency: 1.88, engagements: 1971, costPerEngagement: 0.01, shares: 7 },
          { name: "ZDRAVÁ UHORKA - CELOROČNÁ OCHRANA", campaign: "sanaplant_boosting_traffic", spend: 23.6, purchases: 0, cpm: 1.33, impressions: 17718, reach: 8976, frequency: 1.97, clicks: 678, cpc: 0.03, ctr: 3.83, landingPageViews: 519, costPerLandingPageView: 0.05, engagements: 1436, costPerEngagement: 0.02, saves: 11, shares: 15 },
          { name: "Sivanto Prime", campaign: "sanaplant_boosting_traffic", spend: 20.34, purchases: 0, cpm: 1.64, impressions: 12365, reach: 6510, frequency: 1.9, clicks: 385, cpc: 0.05, ctr: 3.11, addToCart: 3, costPerAddToCart: 6.78, landingPageViews: 303, costPerLandingPageView: 0.07, engagements: 401, costPerEngagement: 0.05, saves: 1, shares: 3 },
          { name: "Foli Max® Universal", campaign: "sanaplant_boosting_traffic", spend: 20.15, purchases: 0, cpm: 1.96, impressions: 10270, reach: 5846, frequency: 1.76, clicks: 350, cpc: 0.06, ctr: 3.41, addToCart: 2, costPerAddToCart: 10.07, landingPageViews: 209, costPerLandingPageView: 0.1, engagements: 2495, costPerEngagement: 0.01, saves: 2, shares: 2 },
          { name: "LeoHumin Organic", campaign: "sanaplant_boosting_traffic", spend: 17.62, purchases: 0, cpm: 1.73, impressions: 10177, reach: 7204, frequency: 1.41, clicks: 208, cpc: 0.08, ctr: 2.04, addToCart: 1, costPerAddToCart: 17.62, landingPageViews: 160, costPerLandingPageView: 0.11, engagements: 548, costPerEngagement: 0.03 },
          { name: "Quantum® AminoMax", campaign: "sanaplant_boosting_traffic", spend: 16.14, purchases: 0, cpm: 1.92, impressions: 8409, reach: 5590, frequency: 1.5, clicks: 216, cpc: 0.07, ctr: 2.57, addToCart: 1, costPerAddToCart: 16.14, landingPageViews: 163, costPerLandingPageView: 0.1, engagements: 1054, costPerEngagement: 0.02, saves: 5, shares: 3 },
          { name: "Laudis – spoľahlivý pomocník v boji s burinou pri pestovaní kukurice", campaign: "sanaplant_boosting_traffic", spend: 15.39, purchases: 0, cpm: 1.13, impressions: 13635, reach: 7825, frequency: 1.74, clicks: 216, cpc: 0.07, ctr: 1.58, landingPageViews: 160, costPerLandingPageView: 0.1, engagements: 488, costPerEngagement: 0.03, shares: 3 },
          { name: "Nutrino®", campaign: "sanaplant_boosting_traffic", spend: 8.54, purchases: 0, cpm: 1.14, impressions: 7504, reach: 4478, frequency: 1.68, clicks: 185, cpc: 0.05, ctr: 2.47, landingPageViews: 157, costPerLandingPageView: 0.05, engagements: 227, costPerEngagement: 0.04, saves: 2, shares: 1 },
          { name: "Šikovný gazda vie, čím ochráni svoju úrodu.", campaign: "sanaplant_boosting_traffic", spend: 7.62, purchases: 0, cpm: 1.74, impressions: 4389, reach: 3519, frequency: 1.25, clicks: 125, cpc: 0.06, ctr: 2.85, addToCart: 2, costPerAddToCart: 3.81, landingPageViews: 83, costPerLandingPageView: 0.09, engagements: 134, costPerEngagement: 0.06, saves: 1 },
          { name: "kukurica", campaign: "sanaplant_catalog_2026", spend: 7.12, purchases: 0, cpm: 2.03, impressions: 3507, reach: 2583, frequency: 1.36, clicks: 38, cpc: 0.19, ctr: 1.08, addToCart: 1, costPerAddToCart: 7.12, landingPageViews: 18, costPerLandingPageView: 0.4, engagements: 38, costPerEngagement: 0.19 },
          { name: "Barbarian Super 360", campaign: "sanaplant_05-07/26", spend: 6.47, purchases: 0, cpm: 2.56, impressions: 2526, reach: 2203, frequency: 1.15, clicks: 60, cpc: 0.11, ctr: 2.38, landingPageViews: 35, costPerLandingPageView: 0.18, engagements: 65, costPerEngagement: 0.1, shares: 2 },
          { name: "Vrtivka čerešňová", campaign: "sanaplant_05-07/26", spend: 5.62, purchases: 0, cpm: 1.08, impressions: 5222, reach: 4348, frequency: 1.2, clicks: 90, cpc: 0.06, ctr: 1.72, landingPageViews: 45, costPerLandingPageView: 0.12, engagements: 102, costPerEngagement: 0.06, shares: 2, comments: 1 },
          { name: "Laudis – spoľahlivý pomocník v boji s burinou pri pestovaní kukurice", campaign: "sanaplant_05-07/26", spend: 4.66, purchases: 0, cpm: 1.54, impressions: 3022, reach: 2331, frequency: 1.3, clicks: 53, cpc: 0.09, ctr: 1.75, addToCart: 2, costPerAddToCart: 2.33, landingPageViews: 31, costPerLandingPageView: 0.15, engagements: 53, costPerEngagement: 0.09 },
          { name: "Sanaplant Poradňa | Škvrnité listy ríbezlí a egrešov", campaign: "sanaplant_boosting_traffic", spend: 4.59, purchases: 0, cpm: 0.86, impressions: 5347, reach: 4357, frequency: 1.23, clicks: 84, cpc: 0.05, ctr: 1.57, landingPageViews: 68, costPerLandingPageView: 0.07, engagements: 1522, costPerEngagement: 0, saves: 2, comments: 1 },
          { name: "obilniny", campaign: "sanaplant_catalog_2026", spend: 0.94, purchases: 0, cpm: 1.45, impressions: 648, reach: 457, frequency: 1.42, clicks: 7, cpc: 0.13, ctr: 1.08, landingPageViews: 4, costPerLandingPageView: 0.24, engagements: 7, costPerEngagement: 0.13 },
        ],
      },
      google: {
        spend: 1407.19, impressions: 365724, clicks: 7804, cpc: 0.18, ctr: 2.13,
        interactions: 17501, interactionRate: 4.79, convRate: 2.55, costPerConv: 3.15,
        purchases: 85.97, purchaseValue: 8517.31, conversions: 446.28, roas: 6.05,
        conversionActions: { add_to_cart: 236.32, begin_checkout: 123.99, purchase: 85.97 },
        campaigns: [
          { name: "PMax_sales_products", type: "Performance Max", status: "Enabled", purchases: 61.6, value: 6386.96, conversionActions: { add_to_cart: 174.52, purchase: 61.6, begin_checkout: 85.24 } },
          { name: "PMax - kukurica", type: "Performance Max", status: "Enabled", purchases: 15.7, value: 1434.09, conversionActions: { add_to_cart: 30.87, purchase: 15.7, begin_checkout: 22.39 } },
          { name: "PMax - zlaté žltnutie viniča", type: "Performance Max", status: "Paused", purchases: 5.08, value: 341.97, conversionActions: { add_to_cart: 21.81, purchase: 5.08, begin_checkout: 11.31 } },
          { name: "PMax - obilniny", type: "Performance Max", status: "Paused", purchases: 3.25, value: 333.39, conversionActions: { add_to_cart: 6.29, purchase: 3.25, begin_checkout: 3.22 } },
          { name: "PMax - listové hnojivá", type: "Performance Max", status: "Paused", purchases: 0.33, value: 20.9, conversionActions: { add_to_cart: 2.84, purchase: 0.33, begin_checkout: 1.83 } }
        ],
      },
      ga: {
        paid: { sessions: 7647, users: 6852, engagementRate: 37.33, avgDuration: '00:11:59' },
        organic: { sessions: 11125, users: 8435, engagementRate: 48.23, avgDuration: '00:13:51' },
          snapshot: {
            activeUsers: 14826,
            newUsers: 12358,
            sessions: 18744,
            engagedSessions: 8306,
            engagementRate: 0.4431284677763551,
            totalRevenue: 13028.480002999999,
            keyEvents: 7782
          },
          trafficAcquisition: [
            {
              channelGroup: "Cross-network",
              sessions: 6042,
              engagedSessions: 3326,
              engagementRate: 0.5504799735187024,
              avgEngagementTimePerSession: 46.98990400529626,
              eventsPerSession: 6.284508440913605,
              eventCount: 37971,
              keyEvents: 4048,
              sessionKeyEventRate: 0.2747434624296591,
              totalRevenue: 7588.870001
            },
            {
              channelGroup: "Paid Social",
              sessions: 5682,
              engagedSessions: 2313,
              engagementRate: 0.40707497360084477,
              avgEngagementTimePerSession: 24.45124956001408,
              eventsPerSession: 4.424322421682506,
              eventCount: 25139,
              keyEvents: 998,
              sessionKeyEventRate: 0.08694121788102781,
              totalRevenue: 795.43
            },
            {
              channelGroup: "Direct",
              sessions: 2980,
              engagedSessions: 548,
              engagementRate: 0.18389261744966443,
              avgEngagementTimePerSession: 12.268791946308724,
              eventsPerSession: 4.883557046979866,
              eventCount: 14553,
              keyEvents: 409,
              sessionKeyEventRate: 0.06677852348993289,
              totalRevenue: 743.98
            },
            {
              channelGroup: "Organic Search",
              sessions: 2885,
              engagedSessions: 1603,
              engagementRate: 0.555632582322357,
              avgEngagementTimePerSession: 41.72547660311958,
              eventsPerSession: 6.2374350086655115,
              eventCount: 17995,
              keyEvents: 1878,
              sessionKeyEventRate: 0.28214904679376085,
              totalRevenue: 3350.800002
            },
            {
              channelGroup: "Organic Social",
              sessions: 445,
              engagedSessions: 156,
              engagementRate: 0.350561797752809,
              avgEngagementTimePerSession: 16.175280898876405,
              eventsPerSession: 5.168539325842697,
              eventCount: 2300,
              keyEvents: 92,
              sessionKeyEventRate: 0.07415730337078652,
              totalRevenue: 62.42
            },
            {
              channelGroup: "Referral",
              sessions: 253,
              engagedSessions: 144,
              engagementRate: 0.5691699604743083,
              avgEngagementTimePerSession: 47.023715415019765,
              eventsPerSession: 9.312252964426877,
              eventCount: 2356,
              keyEvents: 158,
              sessionKeyEventRate: 0.22529644268774704,
              totalRevenue: 249.72
            },
            {
              channelGroup: "Unassigned",
              sessions: 219,
              engagedSessions: 99,
              engagementRate: 0.4520547945205479,
              avgEngagementTimePerSession: 41.538812785388124,
              eventsPerSession: 6.36986301369863,
              eventCount: 1395,
              keyEvents: 131,
              sessionKeyEventRate: 0.2328767123287671,
              totalRevenue: 237.26
            },
            {
              channelGroup: "Email",
              sessions: 138,
              engagedSessions: 72,
              engagementRate: 0.5217391304347826,
              avgEngagementTimePerSession: 25.144927536231883,
              eventsPerSession: 5.833333333333333,
              eventCount: 805,
              keyEvents: 49,
              sessionKeyEventRate: 0.15942028985507245,
              totalRevenue: 0
            },
            {
              channelGroup: "Paid Search",
              sessions: 41,
              engagedSessions: 18,
              engagementRate: 0.43902439024390244,
              avgEngagementTimePerSession: 3.975609756097561,
              eventsPerSession: 4.097560975609756,
              eventCount: 168,
              keyEvents: 6,
              sessionKeyEventRate: 0.12195121951219512,
              totalRevenue: 0
            },
            {
              channelGroup: "AI Assistant",
              sessions: 29,
              engagedSessions: 11,
              engagementRate: 0.3793103448275862,
              avgEngagementTimePerSession: 10.586206896551724,
              eventsPerSession: 5.206896551724138,
              eventCount: 151,
              keyEvents: 8,
              sessionKeyEventRate: 0.034482758620689655,
              totalRevenue: 0
            },
            {
              channelGroup: "Organic Shopping",
              sessions: 18,
              engagedSessions: 12,
              engagementRate: 0.6666666666666666,
              avgEngagementTimePerSession: 28.27777777777778,
              eventsPerSession: 6.611111111111111,
              eventCount: 119,
              keyEvents: 4,
              sessionKeyEventRate: 0.16666666666666666,
              totalRevenue: 0
            },
            {
              channelGroup: "Organic Video",
              sessions: 12,
              engagedSessions: 4,
              engagementRate: 0.3333333333333333,
              avgEngagementTimePerSession: 8.916666666666666,
              eventsPerSession: 2.9166666666666665,
              eventCount: 35,
              keyEvents: 1,
              sessionKeyEventRate: 0.08333333333333333,
              totalRevenue: 0
            }
          ],
          userAcquisition: [
            {
              firstUserChannelGroup: "Cross-network",
              totalUsers: 4348,
              newUsers: 3647,
              returningUsers: 816,
              avgEngagementTimePerActiveUser: 58.83301481127568,
              engagedSessionsPerActiveUser: 0.7188246536072623,
              eventCount: 33984,
              keyEvents: 3549,
              userKeyEventRate: 0.24581939799331104
            },
            {
              firstUserChannelGroup: "Paid Social",
              totalUsers: 3989,
              newUsers: 3166,
              returningUsers: 644,
              avgEngagementTimePerActiveUser: 37.08952273369105,
              engagedSessionsPerActiveUser: 0.6195989833380401,
              eventCount: 24068,
              keyEvents: 903,
              userKeyEventRate: 0.09206438859079356
            },
            {
              firstUserChannelGroup: "Direct",
              totalUsers: 3081,
              newUsers: 2882,
              returningUsers: 188,
              avgEngagementTimePerActiveUser: 21.21979476994373,
              engagedSessionsPerActiveUser: 0.27275736511089044,
              eventCount: 18403,
              keyEvents: 695,
              userKeyEventRate: 0.07977490897053956
            },
            {
              firstUserChannelGroup: "Organic Search",
              totalUsers: 2476,
              newUsers: 1821,
              returningUsers: 637,
              avgEngagementTimePerActiveUser: 56.656209712075636,
              engagedSessionsPerActiveUser: 0.7739578856897292,
              eventCount: 19658,
              keyEvents: 2161,
              userKeyEventRate: 0.274172754619682
            },
            {
              firstUserChannelGroup: "Organic Social",
              totalUsers: 398,
              newUsers: 366,
              returningUsers: 24,
              avgEngagementTimePerActiveUser: 22.634920634920636,
              engagedSessionsPerActiveUser: 0.3941798941798942,
              eventCount: 2231,
              keyEvents: 78,
              userKeyEventRate: 0.06613756613756613
            },
            {
              firstUserChannelGroup: "Referral",
              totalUsers: 195,
              newUsers: 172,
              returningUsers: 26,
              avgEngagementTimePerActiveUser: 78.171875,
              engagedSessionsPerActiveUser: 0.6510416666666666,
              eventCount: 2092,
              keyEvents: 216,
              userKeyEventRate: 0.17708333333333334
            },
            {
              firstUserChannelGroup: "Unassigned",
              totalUsers: 154,
              newUsers: 139,
              returningUsers: 30,
              avgEngagementTimePerActiveUser: 49.25170068027211,
              engagedSessionsPerActiveUser: 0.6598639455782312,
              eventCount: 1172,
              keyEvents: 104,
              userKeyEventRate: 0.25170068027210885
            },
            {
              firstUserChannelGroup: "Email",
              totalUsers: 89,
              newUsers: 87,
              returningUsers: 21,
              avgEngagementTimePerActiveUser: 68.83132530120481,
              engagedSessionsPerActiveUser: 0.927710843373494,
              eventCount: 860,
              keyEvents: 46,
              userKeyEventRate: 0.25301204819277107
            },
            {
              firstUserChannelGroup: "Paid Search",
              totalUsers: 44,
              newUsers: 36,
              returningUsers: 5,
              avgEngagementTimePerActiveUser: 13.1,
              engagedSessionsPerActiveUser: 0.55,
              eventCount: 208,
              keyEvents: 14,
              userKeyEventRate: 0.15
            },
            {
              firstUserChannelGroup: "AI Assistant",
              totalUsers: 26,
              newUsers: 27,
              returningUsers: 3,
              avgEngagementTimePerActiveUser: 11.807692307692308,
              engagedSessionsPerActiveUser: 0.46153846153846156,
              eventCount: 153,
              keyEvents: 8,
              userKeyEventRate: 0.038461538461538464
            },
            {
              firstUserChannelGroup: "Organic Shopping",
              totalUsers: 19,
              newUsers: 11,
              returningUsers: 7,
              avgEngagementTimePerActiveUser: 42.111111111111114,
              engagedSessionsPerActiveUser: 1.0555555555555556,
              eventCount: 126,
              keyEvents: 6,
              userKeyEventRate: 0.2222222222222222
            },
            {
              firstUserChannelGroup: "Organic Video",
              totalUsers: 7,
              newUsers: 4,
              returningUsers: 3,
              avgEngagementTimePerActiveUser: 124.57142857142857,
              engagedSessionsPerActiveUser: 0.7142857142857143,
              eventCount: 32,
              keyEvents: 2,
              userKeyEventRate: 0.2857142857142857
            }
          ],
          landingPages: [
            {
              path: "/produkt/sivanto-prime",
              sessions: 1394,
              activeUsers: 914,
              newUsers: 681,
              avgEngagementTimePerSession: 35.14060258249641,
              totalRevenue: 514.95,
              bounceRate: 0.5351506456241033,
              addToCart: 50,
              checkouts: 6,
              purchases: 9
            },
            {
              path: "/zlate-zltnutie-vinica",
              sessions: 1005,
              activeUsers: 774,
              newUsers: 607,
              avgEngagementTimePerSession: 67.2636815920398,
              totalRevenue: 466.68,
              bounceRate: 0.4597014925373134,
              addToCart: 20,
              checkouts: 10,
              purchases: 8
            },
            {
              path: "/produkt/laudis-od-1-l",
              sessions: 913,
              activeUsers: 737,
              newUsers: 594,
              avgEngagementTimePerSession: 32.420591456736034,
              totalRevenue: 1366.79,
              bounceRate: 0.49069003285870755,
              addToCart: 43,
              checkouts: 24,
              purchases: 13
            },
            {
              path: "/",
              sessions: 824,
              activeUsers: 677,
              newUsers: 584,
              avgEngagementTimePerSession: 23.0376213592233,
              totalRevenue: 472.91,
              bounceRate: 0.7063106796116505,
              addToCart: 41,
              checkouts: 9,
              purchases: 3
            },
            {
              path: "/produkt/neemazal-t-s",
              sessions: 574,
              activeUsers: 426,
              newUsers: 384,
              avgEngagementTimePerSession: 18.20731707317073,
              totalRevenue: 71,
              bounceRate: 0.5975609756097561,
              addToCart: 18,
              checkouts: 4,
              purchases: 2
            },
            {
              path: "/produkt/quantum-aminomax-1-l",
              sessions: 454,
              activeUsers: 334,
              newUsers: 294,
              avgEngagementTimePerSession: 12.894273127753303,
              totalRevenue: 0,
              bounceRate: 0.7048458149779736,
              addToCart: 6,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/gunner-1-l",
              sessions: 432,
              activeUsers: 309,
              newUsers: 237,
              avgEngagementTimePerSession: 33.11574074074074,
              totalRevenue: 72.34,
              bounceRate: 0.48842592592592593,
              addToCart: 13,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/leohumin-organic",
              sessions: 421,
              activeUsers: 285,
              newUsers: 260,
              avgEngagementTimePerSession: 6.166270783847981,
              totalRevenue: 0,
              bounceRate: 0.8242280285035629,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/kategoria-produktu/sikovny-gazda",
              sessions: 347,
              activeUsers: 296,
              newUsers: 256,
              avgEngagementTimePerSession: 25.38328530259366,
              totalRevenue: 0,
              bounceRate: 0.6512968299711815,
              addToCart: 7,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/cyperfor-100-ec",
              sessions: 305,
              activeUsers: 263,
              newUsers: 232,
              avgEngagementTimePerSession: 40.22295081967213,
              totalRevenue: 22.22,
              bounceRate: 0.6,
              addToCart: 16,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/karate-zeon-5-cs",
              sessions: 288,
              activeUsers: 240,
              newUsers: 211,
              avgEngagementTimePerSession: 42.00347222222222,
              totalRevenue: 43.4,
              bounceRate: 0.5625,
              addToCart: 12,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/barbarian-super-1-l",
              sessions: 261,
              activeUsers: 215,
              newUsers: 178,
              avgEngagementTimePerSession: 44.32567049808429,
              totalRevenue: 61.5,
              bounceRate: 0.4099616858237548,
              addToCart: 8,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/znacka-produktu/kukurica",
              sessions: 261,
              activeUsers: 228,
              newUsers: 156,
              avgEngagementTimePerSession: 93.2911877394636,
              totalRevenue: 317.74,
              bounceRate: 0.4061302681992337,
              addToCart: 35,
              checkouts: 5,
              purchases: 4
            },
            {
              path: "/produkt/zlte-lepove-dosky",
              sessions: 255,
              activeUsers: 201,
              newUsers: 171,
              avgEngagementTimePerSession: 23.580392156862747,
              totalRevenue: 16.37,
              bounceRate: 0.6196078431372549,
              addToCart: 7,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/foli-max-universal",
              sessions: 217,
              activeUsers: 168,
              newUsers: 138,
              avgEngagementTimePerSession: 22.1889400921659,
              totalRevenue: 18.77,
              bounceRate: 0.5483870967741935,
              addToCart: 8,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/harmavit-special",
              sessions: 186,
              activeUsers: 153,
              newUsers: 125,
              avgEngagementTimePerSession: 91.03763440860214,
              totalRevenue: 67.97,
              bounceRate: 0.4946236559139785,
              addToCart: 16,
              checkouts: 5,
              purchases: 2
            },
            {
              path: "/produkt/k-othrine-25-sc-1-l",
              sessions: 173,
              activeUsers: 135,
              newUsers: 124,
              avgEngagementTimePerSession: 58.716763005780344,
              totalRevenue: 1894.28,
              bounceRate: 0.34104046242774566,
              addToCart: 17,
              checkouts: 17,
              purchases: 13
            },
            {
              path: "/znacka-produktu/uhorka-celorocna-ochrana-a-vyziva",
              sessions: 154,
              activeUsers: 116,
              newUsers: 105,
              avgEngagementTimePerSession: 20.603896103896105,
              totalRevenue: 0,
              bounceRate: 0.6363636363636364,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/nutrino-20-l",
              sessions: 139,
              activeUsers: 93,
              newUsers: 71,
              avgEngagementTimePerSession: 23.309352517985612,
              totalRevenue: 0,
              bounceRate: 0.6402877697841727,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "(not set)",
              sessions: 129,
              activeUsers: 91,
              newUsers: 74,
              avgEngagementTimePerSession: 11.7984496124031,
              totalRevenue: 0,
              bounceRate: 0.6976744186046512,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/ls-profix-systemovy-fungicid-na-choroby-obilnin",
              sessions: 122,
              activeUsers: 98,
              newUsers: 73,
              avgEngagementTimePerSession: 12.868852459016393,
              totalRevenue: 0,
              bounceRate: 0.45901639344262296,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/laudis-od-5-l",
              sessions: 111,
              activeUsers: 102,
              newUsers: 63,
              avgEngagementTimePerSession: 31.98198198198198,
              totalRevenue: 65.37,
              bounceRate: 0.36036036036036034,
              addToCart: 4,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/benevia",
              sessions: 106,
              activeUsers: 92,
              newUsers: 68,
              avgEngagementTimePerSession: 41.45283018867924,
              totalRevenue: 0,
              bounceRate: 0.44339622641509435,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/quantum-boron-active-5-l",
              sessions: 99,
              activeUsers: 77,
              newUsers: 58,
              avgEngagementTimePerSession: 23.333333333333332,
              totalRevenue: 20.65,
              bounceRate: 0.494949494949495,
              addToCart: 2,
              checkouts: 0,
              purchases: 1
            },
            {
              path: "/produkt/pirimor-50-wg-1-kg",
              sessions: 90,
              activeUsers: 77,
              newUsers: 63,
              avgEngagementTimePerSession: 12.222222222222221,
              totalRevenue: 179.37,
              bounceRate: 0.5111111111111111,
              addToCart: 4,
              checkouts: 5,
              purchases: 1
            },
            {
              path: "/produkt/pony-306-se-1-l",
              sessions: 86,
              activeUsers: 68,
              newUsers: 46,
              avgEngagementTimePerSession: 23.976744186046513,
              totalRevenue: 59.85,
              bounceRate: 0.4186046511627907,
              addToCart: 2,
              checkouts: 1,
              purchases: 1
            },
            {
              path: "/produkt/quantum-ultra-complex-1-l",
              sessions: 84,
              activeUsers: 71,
              newUsers: 53,
              avgEngagementTimePerSession: 27.05952380952381,
              totalRevenue: 0,
              bounceRate: 0.40476190476190477,
              addToCart: 3,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/damisol-gold-frigomax-1-l",
              sessions: 83,
              activeUsers: 56,
              newUsers: 47,
              avgEngagementTimePerSession: 31.481927710843372,
              totalRevenue: 0,
              bounceRate: 0.5903614457831325,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/puma-extra-5-l",
              sessions: 83,
              activeUsers: 82,
              newUsers: 77,
              avgEngagementTimePerSession: 26.674698795180724,
              totalRevenue: 283.48,
              bounceRate: 0.6024096385542169,
              addToCart: 2,
              checkouts: 4,
              purchases: 1
            },
            {
              path: "/znacka-produktu/obilniny",
              sessions: 72,
              activeUsers: 54,
              newUsers: 44,
              avgEngagementTimePerSession: 89.20833333333333,
              totalRevenue: 290.46,
              bounceRate: 0.5694444444444444,
              addToCart: 7,
              checkouts: 3,
              purchases: 2
            },
            {
              path: "/produkt/maister-power-5-l",
              sessions: 71,
              activeUsers: 57,
              newUsers: 27,
              avgEngagementTimePerSession: 16.47887323943662,
              totalRevenue: 0,
              bounceRate: 0.38028169014084506,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/herbavital",
              sessions: 69,
              activeUsers: 56,
              newUsers: 42,
              avgEngagementTimePerSession: 16.55072463768116,
              totalRevenue: 0,
              bounceRate: 0.5362318840579711,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/ls-prothio-tebuc-fungicid",
              sessions: 68,
              activeUsers: 51,
              newUsers: 42,
              avgEngagementTimePerSession: 5.044117647058823,
              totalRevenue: 0,
              bounceRate: 0.6911764705882353,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/obchod",
              sessions: 67,
              activeUsers: 60,
              newUsers: 55,
              avgEngagementTimePerSession: 72.94029850746269,
              totalRevenue: 74.68,
              bounceRate: 0.40298507462686567,
              addToCart: 6,
              checkouts: 2,
              purchases: 1
            },
            {
              path: "/produkt/flipper-ew-4798-1-l",
              sessions: 65,
              activeUsers: 55,
              newUsers: 44,
              avgEngagementTimePerSession: 25.615384615384617,
              totalRevenue: 0,
              bounceRate: 0.47692307692307695,
              addToCart: 3,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/produkt/mospilan-20-sp",
              sessions: 63,
              activeUsers: 57,
              newUsers: 46,
              avgEngagementTimePerSession: 39.857142857142854,
              totalRevenue: 0,
              bounceRate: 0.3492063492063492,
              addToCart: 10,
              checkouts: 1,
              purchases: 0
            },
            {
              path: "/znacka-produktu/listove-hnojiva",
              sessions: 63,
              activeUsers: 54,
              newUsers: 44,
              avgEngagementTimePerSession: 22.349206349206348,
              totalRevenue: 0,
              bounceRate: 0.5873015873015873,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/maister-power-xl-200-l-xl-200-l",
              sessions: 59,
              activeUsers: 55,
              newUsers: 45,
              avgEngagementTimePerSession: 14.23728813559322,
              totalRevenue: 0,
              bounceRate: 0.5932203389830508,
              addToCart: 1,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/karate-zeon-5-cs-5-l",
              sessions: 58,
              activeUsers: 48,
              newUsers: 35,
              avgEngagementTimePerSession: 21.396551724137932,
              totalRevenue: 0,
              bounceRate: 0.3103448275862069,
              addToCart: 3,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/exirel-1-l",
              sessions: 56,
              activeUsers: 41,
              newUsers: 25,
              avgEngagementTimePerSession: 10.803571428571429,
              totalRevenue: 0,
              bounceRate: 0.375,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/infinito-sc",
              sessions: 52,
              activeUsers: 45,
              newUsers: 33,
              avgEngagementTimePerSession: 44.57692307692308,
              totalRevenue: 58.64,
              bounceRate: 0.3269230769230769,
              addToCart: 7,
              checkouts: 3,
              purchases: 1
            },
            {
              path: "/produkt/siran-draselny",
              sessions: 51,
              activeUsers: 47,
              newUsers: 44,
              avgEngagementTimePerSession: 42.92156862745098,
              totalRevenue: 27.88,
              bounceRate: 0.5882352941176471,
              addToCart: 6,
              checkouts: 4,
              purchases: 1
            },
            {
              path: "/mrlik-celorocny-nepriatel-nasich-poli",
              sessions: 49,
              activeUsers: 42,
              newUsers: 40,
              avgEngagementTimePerSession: 26.040816326530614,
              totalRevenue: 0,
              bounceRate: 0.7142857142857143,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/odborna-poradna",
              sessions: 48,
              activeUsers: 34,
              newUsers: 33,
              avgEngagementTimePerSession: 4.4375,
              totalRevenue: 0,
              bounceRate: 0.7083333333333334,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/ucinna-latka/bacillus-mojavensis-kmen-kn32-minimalny-pocet-bakterii-5x109-cfu-m3",
              sessions: 48,
              activeUsers: 45,
              newUsers: 44,
              avgEngagementTimePerSession: 9.395833333333334,
              totalRevenue: 0,
              bounceRate: 0.5625,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/encyklopedia-chorob-skodcov-a-vyzivy-zahradnickych-rastlin",
              sessions: 47,
              activeUsers: 19,
              newUsers: 13,
              avgEngagementTimePerSession: 11.319148936170214,
              totalRevenue: 0,
              bounceRate: 0.6170212765957447,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/touchdown-system-4",
              sessions: 47,
              activeUsers: 40,
              newUsers: 38,
              avgEngagementTimePerSession: 30.78723404255319,
              totalRevenue: 0,
              bounceRate: 0.425531914893617,
              addToCart: 3,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/champion-50-wg",
              sessions: 44,
              activeUsers: 37,
              newUsers: 36,
              avgEngagementTimePerSession: 35.11363636363637,
              totalRevenue: 63.87,
              bounceRate: 0.75,
              addToCart: 6,
              checkouts: 3,
              purchases: 1
            },
            {
              path: "/produkt/refine-50-sx-90-g",
              sessions: 43,
              activeUsers: 37,
              newUsers: 19,
              avgEngagementTimePerSession: 19.813953488372093,
              totalRevenue: 0,
              bounceRate: 0.3488372093023256,
              addToCart: 2,
              checkouts: 0,
              purchases: 0
            },
            {
              path: "/produkt/revus-top-5-l",
              sessions: 43,
              activeUsers: 34,
              newUsers: 18,
              avgEngagementTimePerSession: 121.90697674418605,
              totalRevenue: 0,
              bounceRate: 0.2558139534883721,
              addToCart: 0,
              checkouts: 0,
              purchases: 0
            }
          ],
          ecommerceItems: [
            {
              name: "K - Othrine 25 SC, 1 l",
              itemsViewed: 170,
              itemsAddedToCart: 20,
              itemsPurchased: 12,
              itemRevenue: 1664.879999
            },
            {
              name: "Laudis OD, 1 l",
              itemsViewed: 256,
              itemsAddedToCart: 33,
              itemsPurchased: 21,
              itemRevenue: 1219.259999
            },
            {
              name: "Sivanto Prime",
              itemsViewed: 348,
              itemsAddedToCart: 37,
              itemsPurchased: 13,
              itemRevenue: 539.689999
            },
            {
              name: "Bofix",
              itemsViewed: 29,
              itemsAddedToCart: 7,
              itemsPurchased: 4,
              itemRevenue: 462.919999
            },
            {
              name: "Casper 55 WG, 1 kg",
              itemsViewed: 91,
              itemsAddedToCart: 24,
              itemsPurchased: 2,
              itemRevenue: 390.78
            },
            {
              name: "Dynali, 1 l",
              itemsViewed: 32,
              itemsAddedToCart: 7,
              itemsPurchased: 4,
              itemRevenue: 360.600001
            },
            {
              name: "Chikara 25 WG, 200 g",
              itemsViewed: 14,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 326.29
            },
            {
              name: "Cyperfor 100 EC",
              itemsViewed: 147,
              itemsAddedToCart: 40,
              itemsPurchased: 9,
              itemRevenue: 299.69
            },
            {
              name: "Melody Combi WG, 5 kg",
              itemsViewed: 10,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 287.64
            },
            {
              name: "Puma Extra, 5 l",
              itemsViewed: 25,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 282.48
            },
            {
              name: "Teldor 500 SC, 1 l",
              itemsViewed: 16,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 271.26
            },
            {
              name: "Gondola",
              itemsViewed: 10,
              itemsAddedToCart: 62,
              itemsPurchased: 62,
              itemRevenue: 262.899975
            },
            {
              name: "Butisan 400 SC, 5 l",
              itemsViewed: 12,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 248.72
            },
            {
              name: "Luna Experience, 1 l",
              itemsViewed: 15,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 248.46
            },
            {
              name: "Bio - Fer Natur (4-3-3), 500 kg",
              itemsViewed: 29,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 237.64
            },
            {
              name: "Fenifan, 10 l",
              itemsViewed: 6,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 233.31
            },
            {
              name: "Pirimor 50 WG, 1 kg",
              itemsViewed: 28,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 225.54
            },
            {
              name: "Efect Ultimum, 1 l",
              itemsViewed: 38,
              itemsAddedToCart: 11,
              itemsPurchased: 2,
              itemRevenue: 221.4
            },
            {
              name: "Harpun, 1 l",
              itemsViewed: 17,
              itemsAddedToCart: 7,
              itemsPurchased: 3,
              itemRevenue: 210.750001
            },
            {
              name: "Eutrofit, 10 l",
              itemsViewed: 70,
              itemsAddedToCart: 23,
              itemsPurchased: 1,
              itemRevenue: 203.65
            },
            {
              name: "Champion 50 WG, 10 kg",
              itemsViewed: 9,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 194.04
            },
            {
              name: "Folpan Gold, 5 kg",
              itemsViewed: 7,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 191.73
            },
            {
              name: "Beloukha, 5 l",
              itemsViewed: 2,
              itemsAddedToCart: 6,
              itemsPurchased: 1,
              itemRevenue: 178.93
            },
            {
              name: "Rafan Max, 1 l",
              itemsViewed: 25,
              itemsAddedToCart: 5,
              itemsPurchased: 1,
              itemRevenue: 176.19
            },
            {
              name: "Fantic F, 5 kg",
              itemsViewed: 20,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 171.43
            },
            {
              name: "Spotlight Plus, 1 l",
              itemsViewed: 8,
              itemsAddedToCart: 4,
              itemsPurchased: 2,
              itemRevenue: 167.94
            },
            {
              name: "Folpan 80 WDG, 5 kg",
              itemsViewed: 37,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 162.52
            },
            {
              name: "Delan Pro, 5 l",
              itemsViewed: 24,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 145.98
            },
            {
              name: "Signum, 1 kg",
              itemsViewed: 29,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 136.89
            },
            {
              name: "Supersect Max, 1 l",
              itemsViewed: 32,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 136.32
            },
            {
              name: "Lebosol Aque Bór 150, 10 l",
              itemsViewed: 24,
              itemsAddedToCart: 1,
              itemsPurchased: 2,
              itemRevenue: 130.38
            },
            {
              name: "Samppi, 5 l",
              itemsViewed: 7,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 125.46
            },
            {
              name: "Neem Azal",
              itemsViewed: 25,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 122
            },
            {
              name: "Airone SC, 5 l",
              itemsViewed: 23,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 119.47
            },
            {
              name: "Harmavit Špeciál",
              itemsViewed: 71,
              itemsAddedToCart: 16,
              itemsPurchased: 4,
              itemRevenue: 98.4
            },
            {
              name: "Kumulus WG, 20 kg",
              itemsViewed: 9,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 98.35
            },
            {
              name: "Delan 700 WDG, 1 kg",
              itemsViewed: 48,
              itemsAddedToCart: 4,
              itemsPurchased: 1,
              itemRevenue: 84.53
            },
            {
              name: "NeemAZAL T/S, 50 ml",
              itemsViewed: 112,
              itemsAddedToCart: 33,
              itemsPurchased: 7,
              itemRevenue: 81.13
            },
            {
              name: "Barbarian Super, 1 l",
              itemsViewed: 54,
              itemsAddedToCart: 22,
              itemsPurchased: 5,
              itemRevenue: 76.9
            },
            {
              name: "Thiovit Jet, 10 kg",
              itemsViewed: 20,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 72.19
            },
            {
              name: "Gunner, 1 l",
              itemsViewed: 80,
              itemsAddedToCart: 6,
              itemsPurchased: 1,
              itemRevenue: 71.34
            },
            {
              name: "Silwet Star, 1 l",
              itemsViewed: 14,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 65.599999
            },
            {
              name: "Quantum Ultra Complex, 5 l",
              itemsViewed: 18,
              itemsAddedToCart: 2,
              itemsPurchased: 2,
              itemRevenue: 61.699999
            },
            {
              name: "Nissorun 10 WP, 0,5 kg",
              itemsViewed: 5,
              itemsAddedToCart: 2,
              itemsPurchased: 1,
              itemRevenue: 61.46
            },
            {
              name: "Silwett Gold, 1 l",
              itemsViewed: 7,
              itemsAddedToCart: 1,
              itemsPurchased: 1,
              itemRevenue: 61.32
            },
            {
              name: "Flowbrix - 1 l",
              itemsViewed: 0,
              itemsAddedToCart: 0,
              itemsPurchased: 2,
              itemRevenue: 59.707318
            },
            {
              name: "Pony 306 SE, 1 l",
              itemsViewed: 70,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 53.32
            },
            {
              name: "Infinito SC",
              itemsViewed: 22,
              itemsAddedToCart: 3,
              itemsPurchased: 1,
              itemRevenue: 53.11
            },
            {
              name: "Flipper EW 479,8, 1 l",
              itemsViewed: 34,
              itemsAddedToCart: 9,
              itemsPurchased: 2,
              itemRevenue: 50.2
            },
            {
              name: "Optysil",
              itemsViewed: 11,
              itemsAddedToCart: 2,
              itemsPurchased: 2,
              itemRevenue: 50.179999
            }
          ]
      },
      eshop: {
        woocommerce: true,
        combinedShops: ['sanaplant.sk', 'novy'],
        revenue: 24537.89,
        netRevenue: 19814.41,
        grossSales: 19848.2,
        orders: 202,
        items: 669,
        variants: 412,
        refunds: 0,
        coupons: 33.79,
        taxes: 4387.56,
        shipping: 335.92,
        categories: [
          { name: 'Záhradkári', items: 371, netRevenue: 5020.96 },
          { name: 'Insekcitídy', items: 289, netRevenue: 5342.96 },
          { name: 'Šikovný gazda', items: 260, netRevenue: 5884.74 },
          { name: 'Exkluzívne produkty', items: 226, netRevenue: 4933.39 },
          { name: 'Fungicídy', items: 214, netRevenue: 9038.28 },
          { name: 'Poľnohospodári', items: 199, netRevenue: 12538.5 },
          { name: 'Výživa rastlín', items: 149, netRevenue: 6215.26 },
          { name: 'Herbicídy', items: 143, netRevenue: 8043.32 },
          { name: 'Ostatné', items: 122, netRevenue: 272.83 },
          { name: 'Listová výživa', items: 60, netRevenue: 3119.08 },
          { name: 'Osivá', items: 58, netRevenue: 1044.06 },
          { name: 'Ochrana rastlín', items: 46, netRevenue: 842.95 },
          { name: 'Trávy a ďatelinoviny', items: 41, netRevenue: 995.81 },
          { name: 'Hnojivá', items: 22, netRevenue: 383.07 },
          { name: 'Hnojivá a výživa rastlín', items: 4, netRevenue: 12.58 },
        ],
        products: [
          { name: 'Žlté lepové dosky', sku: '2408', items: 112, netRevenue: 96, orders: 7, variants: 2 },
          { name: 'Laudis OD, 1 l', sku: '1214-1', items: 30, netRevenue: 1416, orders: 23, variants: 0 },
          { name: 'Sivanto Prime', sku: '1294', items: 29, netRevenue: 942.88, orders: 20, variants: 4 },
          { name: 'Mavrik 2F, 5 ml', sku: '2321', items: 20, netRevenue: 45.8, orders: 5, variants: 0 },
          { name: 'Cyperfor 100 EC', sku: '2071', items: 20, netRevenue: 478.13, orders: 16, variants: 6 },
          { name: 'LeoHumin Organic', sku: '2410', items: 19, netRevenue: 2063.28, orders: 3, variants: 3 },
          { name: 'K - Othrine 25 SC, 1 l', sku: '1835', items: 16, netRevenue: 1799.16, orders: 16, variants: 0 },
          { name: 'Spintor', sku: '2326', items: 16, netRevenue: 90.78, orders: 8, variants: 5 },
          { name: 'Harmavit Špeciál', sku: '2237', items: 15, netRevenue: 374.92, orders: 8, variants: 2 },
          { name: 'Karate Zeon 5 CS', sku: '2320', items: 15, netRevenue: 85.19, orders: 11, variants: 7 },
          { name: 'Lúčna zmes do horských a podhorských oblastí', sku: '1954551c89f0', items: 14, netRevenue: 882, orders: 1, variants: 2 },
          { name: 'Ďatelina alexandrijská, 1 kg', sku: '26bbeaa9d717', items: 12, netRevenue: 55.08, orders: 2, variants: 0 },
          { name: 'Champion 50 WG', sku: '2291', items: 11, netRevenue: 41.23, orders: 8, variants: 9 },
          { name: 'Gondola', sku: '2319', items: 10, netRevenue: 34.5, orders: 3, variants: 2 },
          { name: 'Orgevit (4-3-2,5)', sku: '3008', items: 10, netRevenue: 130, orders: 2, variants: 3 },
          { name: 'Pronto, 1 l', sku: '1896', items: 9, netRevenue: 234.93, orders: 2, variants: 0 },
          { name: 'Flipper EW 479,8, 1 l', sku: '2076', items: 9, netRevenue: 183.69, orders: 4, variants: 0 },
          { name: 'Horčica biela', sku: '2832', items: 9, netRevenue: 20.25, orders: 3, variants: 2 },
          { name: 'Penthiol, 25 kg', sku: '1892', items: 8, netRevenue: 531.52, orders: 1, variants: 0 },
          { name: 'Foli MAX Universal, 0,5 l', sku: '2281', items: 8, netRevenue: 39.81, orders: 5, variants: 0 },
          { name: 'NeemAZAL T/S, 50 ml', sku: '2338', items: 7, netRevenue: 65.94, orders: 3, variants: 0 },
          { name: 'Barbarian Super, 1 l', sku: '1118-1', items: 7, netRevenue: 87.5, orders: 4, variants: 0 },
          { name: 'Ďatelina purpurová - Kardinal', sku: '82a8abd537d3', items: 7, netRevenue: 29.19, orders: 3, variants: 2 },
          { name: 'Bellis', sku: '2285', items: 6, netRevenue: 14.1, orders: 3, variants: 2 },
          { name: 'Bofix', sku: '2309', items: 6, netRevenue: 427.6, orders: 2, variants: 4 },
        ],
      },
    },
  ],
}

export default sanaplant
