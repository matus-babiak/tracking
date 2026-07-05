// Klient: Sanaplant — dáta extrahované z mesačných reportov 2/2025 – 6/2026.
// Hodnoty null = metrika v danom mesiaci nebola v reporte dostupná
// (napr. Google Ads bežali až od apríla 2025, v decembri 2025 boli vypnuté).

const sanaplant = {
  id: 'sanaplant',
  name: 'Sanaplant',
  currency: '€',
  metaBreakdown: 'ads',
  metaAdsProfile: 'eshop',
  notes: [
    'Google Ads kampane bežali od apríla 2025 (produktové PMax od 14. júla 2025). V decembri 2025 boli Google Ads vypnuté.',
    'Za február 2025 nie sú v reporte dostupné celkové tržby e-shopu.',
    'Hodnoty nákupov za október – december 2025 sú mierne podhodnotené: pre technickú chybu sa nezaznamenala plná hodnota niektorých objednávok Encyklopédie.',
    'Od roku 2026 je boosting súčasťou Meta Ads kampaní (v prehľade Meta je už započítaný), samostatná metrika boostingu sa preto od 1/2026 nevykazuje.',
    'Vo februári 2026 report vykazuje extrémnu platenú návštevnosť (242 tis. relácií s mierou interakcie 2 %) — pravdepodobne nekvalitná/bot návštevnosť z kampaní.',
    'Od 2026 Mailchimp tržby nezahŕňajú publikum Blumeria Consulting (Alchem) — reálne tržby z e-mailov môžu byť vyššie.',
    'Reálne dáta sa môžu líšiť od skutočných predajov e-shopu (atribučné modely, cookie lišta).',
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
        spend: 528.87, impressions: 282503, reach: 96507, clicks: 3416,
        purchases: 13, purchaseValue: 616.09, roas: 1.16, addToCart: 123,
        cpc: 0.15, costPerPurchase: 40.68,
        campaigns: [
          { name: 'Boosting kampane', spend: 358.57, clicks: 2601, purchases: 4, value: 282.6, roas: 0.79 },
          { name: 'Všeobecná Sanaplant', spend: 170.3, clicks: 815, purchases: 9, value: 333.49, roas: 1.96 },
        ],
      },
      boosting: null,
      google: {
        spend: 170.53, impressions: 60228, clicks: 1486, cpc: 0.11, ctr: 2.47,
        purchases: 17, purchaseValue: 1426.18, conversions: 17, roas: 8.36,
        campaigns: [
          { name: 'PMax – produkty', spend: 170.53, clicks: 1486, purchases: 17, value: 1426.18 },
        ],
      },
      ga: {
        paid: { sessions: 3759, users: 3174, engagementRate: 46.45, avgDuration: '00:17:49' },
        organic: { sessions: 3975, users: 3718, engagementRate: 28.88, avgDuration: '00:05:40' },
      },
      email: {
        sent: 30460, openRate: 21.52, clickRate: 0.67, uniqueClicks: 231,
        unsubRate: 0.27, orders: 3, revenue: 549.02, campaignsCount: 8,
      },
      eshop: { revenue: 6024.13, items: 211, orders: 68, netRevenue: 4984.63 },
    },
    {
      year: 2026, month: 2,
      meta: {
        spend: 673.08, impressions: 267028, reach: 68414, clicks: 4511,
        purchases: 80, purchaseValue: 3205.93, roas: 4.76, addToCart: 481,
        cpc: 0.15, costPerPurchase: 8.41,
        campaigns: [
          { name: 'Všeobecná Sanaplant', spend: 357.91, clicks: 2064, purchases: 28, value: 1710.13, roas: 4.78 },
          { name: 'Frigomax', spend: 242.44, clicks: 1679, purchases: 50, value: 1393.77, roas: 5.75 },
          { name: 'Boosting kampane', spend: 72.73, clicks: 768, purchases: 2, value: 102.03, roas: 1.4 },
        ],
      },
      boosting: null,
      google: {
        spend: 849.42, impressions: 297596, clicks: 10025, cpc: 0.08, ctr: 3.37,
        purchases: 126, purchaseValue: 7325.85, conversions: 126, roas: 8.62,
        campaigns: [
          { name: 'PMax – produkty', spend: 635.27, clicks: 5173, purchases: 77, value: 5816.07 },
          { name: 'PMax – Frigomax', spend: 214.16, clicks: 4852, purchases: 44, value: 1381.41 },
        ],
      },
      ga: {
        paid: { sessions: 242171, users: 239528, engagementRate: 2.11, avgDuration: '00:00:26' },
        organic: { sessions: 11546, users: 9176, engagementRate: 57.07, avgDuration: '00:11:49' },
      },
      email: {
        sent: null, openRate: 16.97, clickRate: 1.03, uniqueClicks: 227,
        unsubRate: 0.24, orders: 2, revenue: 45.87, campaignsCount: 4,
      },
      eshop: { revenue: 22200.02, items: 1776, orders: 317, netRevenue: 17752.44 },
    },
    {
      year: 2026, month: 3,
      meta: {
        spend: 609.52, impressions: 273027, reach: 61283, clicks: 4923,
        purchases: 163, purchaseValue: 6320.07, roas: 10.37, addToCart: 708,
        cpc: 0.12, costPerPurchase: 3.74,
        campaigns: [
          { name: 'Frigomax', spend: 352.31, clicks: 2907, purchases: 132, value: 3999.4, roas: 11.35 },
          { name: 'Všeobecná Sanaplant', spend: 177.39, clicks: 917, purchases: 30, value: 2302.0, roas: 12.98 },
          { name: 'Boosting kampane', spend: 79.82, clicks: 1099, purchases: 1, value: 18.68, roas: 0.23 },
        ],
      },
      boosting: null,
      google: {
        spend: 1057.41, impressions: 331796, clicks: 11595, cpc: 0.09, ctr: 3.49,
        purchases: 331, purchaseValue: 18269.92, conversions: 331, roas: 17.28,
        campaigns: [
          { name: 'PMax – produkty', spend: 814.18, clicks: 6767, purchases: 247, value: 14920.76 },
          { name: 'PMax – Frigomax', spend: 243.22, clicks: 4828, purchases: 72, value: 2050.74 },
        ],
      },
      ga: {
        paid: { sessions: 8964, users: 7538, engagementRate: 45.81, avgDuration: '00:16:34' },
        organic: { sessions: 13371, users: 10333, engagementRate: 59.02, avgDuration: '00:16:47' },
      },
      email: {
        sent: null, openRate: 21.2, clickRate: 0.72, uniqueClicks: 129,
        unsubRate: 0.18, orders: 1, revenue: 56.0, campaignsCount: 4,
      },
      eshop: { revenue: 46147.11, items: 2419, orders: 704, netRevenue: 35366.61 },
    },
    {
      year: 2026, month: 4,
      meta: {
        spend: 295.15, impressions: 151756, reach: 38388, clicks: 2205,
        purchases: 24, purchaseValue: 1031.35, roas: 3.49, addToCart: 121,
        cpc: 0.13, costPerPurchase: 12.3,
        campaigns: [
          { name: 'Frigomax', spend: 225.25, clicks: 1153, purchases: 23, value: 1006.38, roas: 4.47 },
          { name: 'Boosting kampane', spend: 37.0, clicks: 879, purchases: 0, value: 0, roas: 0 },
          { name: 'Všeobecná Sanaplant', spend: 32.9, clicks: 173, purchases: 1, value: 24.97, roas: 0.76 },
        ],
      },
      boosting: null,
      google: {
        spend: 801.88, impressions: 246997, clicks: 7552, cpc: 0.11, ctr: 3.06,
        purchases: 110, purchaseValue: 8347.0, conversions: 110, roas: 10.41,
        campaigns: [
          { name: 'PMax – produkty', spend: 701.9, clicks: 6498, purchases: 89, value: 7003.08 },
          { name: 'PMax – Frigomax', spend: 99.99, clicks: 1054, purchases: 14, value: 543.86 },
        ],
      },
      ga: {
        paid: { sessions: 11074, users: 9976, engagementRate: 33.37, avgDuration: '00:10:56' },
        organic: { sessions: 7481, users: 6165, engagementRate: 54.94, avgDuration: '00:18:57' },
      },
      email: {
        sent: null, openRate: 28.16, clickRate: 2.5, uniqueClicks: 172,
        unsubRate: 0.57, orders: 4, revenue: 544.23, campaignsCount: 4,
      },
      eshop: { revenue: 37215.1, items: 904, orders: 282, netRevenue: 29692.84 },
    },
    {
      year: 2026, month: 5,
      meta: {
        spend: 610.84, impressions: 254470, reach: 66696, clicks: 6830,
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
          { name: "Slimáky / slizniaky", campaign: "sanaplant_boosting_traffic", spend: 12.37, value: 16.07, roas: 1.3, purchases: 1, costPerPurchase: 12.37, aov: 16.07, cpm: 1.94, impressions: 6361, reach: 4306, frequency: 1.48, clicks: 286, cpc: 0.04, ctr: 4.5, addToCart: 1, costPerAddToCart: 12.37, landingPageViews: 154, costPerLandingPageView: 0.08, engagements: 352, costPerEngagement: 0.04, shares: 1 },
        ],
      },
      boosting: null,
      google: {
        spend: 1708.95, impressions: 511320, clicks: 10834, cpc: 0.16, ctr: 2.12,
        purchases: 109, purchaseValue: 10964.56, conversions: 109, roas: 6.42,
        campaigns: [
          { name: 'PMax – produkty', spend: 1066.33, clicks: 7303, purchases: 87, value: 8994.97 },
          { name: 'PMax – kukurica', spend: 201.35, clicks: 867, purchases: 9, value: 945.39 },
          { name: 'PMax – zlaté žltnutie viniča', spend: 182.46, clicks: 1507, purchases: 9, value: 598.15 },
          { name: 'PMax – listové hnojivá', spend: 161.56, clicks: 666, purchases: 2, value: 252.28 },
          { name: 'PMax – obilniny', spend: 97.25, clicks: 491, purchases: 3, value: 173.77 },
        ],
      },
      ga: {
        paid: { sessions: 9382, users: 8175, engagementRate: 42.6, avgDuration: '00:13:25' },
        organic: { sessions: 12970, users: 10452, engagementRate: 47.15, avgDuration: '00:13:17' },
      },
      email: {
        sent: null, openRate: 12.84, clickRate: 1.18, uniqueClicks: 280,
        unsubRate: 0.31, orders: 5, revenue: 164.13, campaignsCount: 4,
      },
      eshop: { revenue: 28675.02, items: 533, orders: 230, netRevenue: 22910.77 },
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
        purchases: 86, purchaseValue: 8517.31, conversions: 86, roas: 6.05,
      },
      ga: {
        paid: { sessions: 7647, users: 6852, engagementRate: 37.33, avgDuration: '00:11:59' },
        organic: { sessions: 11125, users: 8435, engagementRate: 48.23, avgDuration: '00:13:51' },
      },
      eshop: { revenue: 24537.89, items: 619, orders: 202, netRevenue: 19814.41 },
    },
  ],
}

export default sanaplant
