// Klient: RentCarSlovakia — Meta Ads + Google Ads, bez e-shopu.

const rentcarslovakia = {
  id: 'rentcarslovakia',
  businessType: 'services',
  name: 'RentCarSlovakia',
  metaProfile: 'leadgen',
  leadgenProfile: 'dual',
  currency: '€',
  notes: [
    'Klient bez e-shopu — sledujeme Meta Ads a Google Ads.',
    'GA4 od 6/2026: traffic/user acquisition, vstupné stránky a udalosti (bez e-commerce metrík).',
    'Meta: návštevy = pozretia cieľovej stránky (landing page views). Frekvencia = zobrazenia / dosah.',
    'Google: konverzie podľa akcií (click_tel, form_start, form_submit a ďalšie z exportu).',
  ],
  months: [
    {
      year: 2026, month: 5,
      google: {
        spend: 60.28, impressions: 628, clicks: 131, cpc: 0.46, ctr: 20.86,
        interactions: 131, interactionRate: 20.86,
        impressionsTop: 92.26, impressionsAbsTop: 37.81,
        convRate: 0.76, conversions: 1, costPerConv: 60.28,
        conversionActions: { click_tel: 1 },
        campaigns: [
          {
            name: 'SE_prenajom_aut', type: 'Search',
            spend: 60.28, impressions: 628, clicks: 131, cpc: 0.46, ctr: 20.86,
            interactions: 131, interactionRate: 20.86,
            impressionsTop: 92.26, impressionsAbsTop: 37.81,
            convRate: 0.76, conversions: 1, costPerConv: 60.28,
            conversionActions: { click_tel: 1 },
          },
        ],
      },
    },
    {
      year: 2026, month: 6,
      meta: {
        spend: 196.61, reach: 50380, impressions: 91949, cpm: 2.14, frequency: 1.83,
        clicks: 1090, landingPageViews: 640, engagements: 1212, costPerEngagement: 0.162, saves: 5,
        campaigns: [
          { name: 'Chcete jazdiť alebo podpisovať 15-stranové zmluvy?', spend: 32.05, reach: 7032, impressions: 11228, clicks: 127, landingPageViews: 79, engagements: 147, saves: 0 },
          { name: 'Zrýchlený prenájom auta bez zbytočných papierov', spend: 48.47, reach: 10762, impressions: 19878, clicks: 191, landingPageViews: 117, engagements: 250, saves: 2 },
          { name: 'Menej podpisov, viac kilometrov', spend: 6.09, reach: 2232, impressions: 2867, clicks: 24, landingPageViews: 14, engagements: 28, saves: 0 },
          { name: 'A - Letná dovolenka bez strachu z odťahoviek', spend: 108.2, reach: 29569, impressions: 57102, clicks: 739, landingPageViews: 425, engagements: 778, saves: 3 },
          { name: 'B - Letná dovolenka bez strachu z odťahoviek', spend: 1.8, reach: 785, impressions: 874, clicks: 9, landingPageViews: 5, engagements: 9, saves: 0 },
        ],
      },
      google: {
        spend: 277.19, impressions: 19085, clicks: 820, cpc: 0.34, ctr: 4.3,
        interactions: 983, interactionRate: 5.15,
        impressionsTop: 90.23, impressionsAbsTop: 58.81,
        convRate: 2.95, conversions: 29, costPerConv: 9.56,
        conversionActions: { form_submit: 4, click_tel: 15, form_start: 10 },
        campaigns: [
          {
            name: 'PMax - dovolenka', type: 'Performance Max',
            spend: 156.05, impressions: 18243, clicks: 625, cpc: 0.25, ctr: 3.43,
            interactions: 788, interactionRate: 4.32,
            convRate: 1.77, conversions: 13.97, costPerConv: 11.17,
            conversionActions: { form_start: 3.48, click_tel: 10, form_submit: 0.48 },
          },
          {
            name: 'SE_prenajom_aut', type: 'Search',
            spend: 121.15, impressions: 842, clicks: 195, cpc: 0.62, ctr: 23.16,
            interactions: 195, interactionRate: 23.16,
            impressionsTop: 90.23, impressionsAbsTop: 58.81,
            convRate: 7.71, conversions: 15.03, costPerConv: 8.06,
            conversionActions: { form_start: 6.52, click_tel: 5, form_submit: 3.52 },
          },
        ],
      },
      ga: {
          snapshot: {
            activeUsers: 427,
            newUsers: 411,
            sessions: 562,
            engagedSessions: 463,
            engagementRate: 0.8238434163701067,
            bounceRate: 0.17615658362989323,
            keyEvents: 268,
            avgEngagementTimePerActiveUser: 98.59275869370778
          },
          trafficAcquisition: [
            {
              channelGroup: "Cross-network",
              sessions: 170,
              engagedSessions: 145,
              engagementRate: 0.8529411764705882,
              avgEngagementTimePerSession: 74.3,
              eventsPerSession: 9.358823529411765,
              keyEvents: 50,
              bounceRate: 0.14705882352941177
            },
            {
              channelGroup: "Paid Social",
              sessions: 136,
              engagedSessions: 105,
              engagementRate: 0.7720588235294118,
              avgEngagementTimePerSession: 57.595588235294116,
              eventsPerSession: 9.632352941176471,
              keyEvents: 68,
              bounceRate: 0.22794117647058823
            },
            {
              channelGroup: "Organic Search",
              sessions: 94,
              engagedSessions: 75,
              engagementRate: 0.7978723404255319,
              avgEngagementTimePerSession: 77.17021276595744,
              eventsPerSession: 12.670212765957446,
              keyEvents: 53,
              bounceRate: 0.20212765957446807
            },
            {
              channelGroup: "Paid Search",
              sessions: 92,
              engagedSessions: 81,
              engagementRate: 0.8804347826086957,
              avgEngagementTimePerSession: 103.65217391304348,
              eventsPerSession: 12.369565217391305,
              keyEvents: 66,
              bounceRate: 0.11956521739130435
            },
            {
              channelGroup: "Direct",
              sessions: 28,
              engagedSessions: 20,
              engagementRate: 0.7142857142857143,
              avgEngagementTimePerSession: 100.67857142857143,
              eventsPerSession: 18.714285714285715,
              keyEvents: 16,
              bounceRate: 0.2857142857142857
            },
            {
              channelGroup: "Organic Social",
              sessions: 25,
              engagedSessions: 22,
              engagementRate: 0.88,
              avgEngagementTimePerSession: 44.04,
              eventsPerSession: 11.04,
              keyEvents: 11,
              bounceRate: 0.12
            },
            {
              channelGroup: "Paid Other",
              sessions: 16,
              engagedSessions: 14,
              engagementRate: 0.875,
              avgEngagementTimePerSession: 42.875,
              eventsPerSession: 7.5,
              keyEvents: 3,
              bounceRate: 0.125
            },
            {
              channelGroup: "AI Assistant",
              sessions: 1,
              engagedSessions: 1,
              engagementRate: 1,
              avgEngagementTimePerSession: 43,
              eventsPerSession: 13,
              keyEvents: 1,
              bounceRate: 0
            }
          ],
          userAcquisition: [
            {
              firstUserChannelGroup: "Cross-network",
              totalUsers: 141,
              newUsers: 138,
              returningUsers: 23,
              avgEngagementTimePerActiveUser: 86.31205673758865,
              engagedSessionsPerActiveUser: 1,
              keyEvents: 56,
              bounceRate: 0.15060240963855423
            },
            {
              firstUserChannelGroup: "Paid Social",
              totalUsers: 116,
              newUsers: 112,
              returningUsers: 11,
              avgEngagementTimePerActiveUser: 68.93859649122807,
              engagedSessionsPerActiveUser: 0.9210526315789473,
              keyEvents: 68,
              bounceRate: 0.23357664233576642
            },
            {
              firstUserChannelGroup: "Paid Search",
              totalUsers: 76,
              newUsers: 74,
              returningUsers: 13,
              avgEngagementTimePerActiveUser: 163.85526315789474,
              engagedSessionsPerActiveUser: 1.25,
              keyEvents: 72,
              bounceRate: 0.11214953271028037
            },
            {
              firstUserChannelGroup: "Organic Search",
              totalUsers: 49,
              newUsers: 46,
              returningUsers: 13,
              avgEngagementTimePerActiveUser: 97.91836734693878,
              engagedSessionsPerActiveUser: 1.3265306122448979,
              keyEvents: 41,
              bounceRate: 0.21686746987951808
            },
            {
              firstUserChannelGroup: "Direct",
              totalUsers: 18,
              newUsers: 17,
              returningUsers: 5,
              avgEngagementTimePerActiveUser: 168.72222222222223,
              engagedSessionsPerActiveUser: 1.2777777777777777,
              keyEvents: 17,
              bounceRate: 0.25806451612903225
            },
            {
              firstUserChannelGroup: "Paid Other",
              totalUsers: 14,
              newUsers: 12,
              returningUsers: 2,
              avgEngagementTimePerActiveUser: 58.23076923076923,
              engagedSessionsPerActiveUser: 1.2307692307692308,
              keyEvents: 4,
              bounceRate: 0.058823529411764705
            },
            {
              firstUserChannelGroup: "Organic Social",
              totalUsers: 12,
              newUsers: 11,
              returningUsers: 2,
              avgEngagementTimePerActiveUser: 65.5,
              engagedSessionsPerActiveUser: 1.4166666666666667,
              keyEvents: 9,
              bounceRate: 0.15
            },
            {
              firstUserChannelGroup: "AI Assistant",
              totalUsers: 1,
              newUsers: 1,
              returningUsers: 0,
              avgEngagementTimePerActiveUser: 43,
              engagedSessionsPerActiveUser: 1,
              keyEvents: 1,
              bounceRate: 0
            }
          ],
          landingPages: [
            {
              path: "/",
              sessions: 235,
              activeUsers: 185,
              newUsers: 172,
              avgEngagementTimePerSession: 91.06382978723404,
              keyEvents: 166,
              bounceRate: 0.1148936170212766
            },
            {
              path: "/dovolenka",
              sessions: 216,
              activeUsers: 188,
              newUsers: 179,
              avgEngagementTimePerSession: 74.70370370370371,
              keyEvents: 82,
              bounceRate: 0.18055555555555555
            },
            {
              path: "/ponuka-aut",
              sessions: 39,
              activeUsers: 29,
              newUsers: 22,
              avgEngagementTimePerSession: 52.333333333333336,
              keyEvents: 6,
              bounceRate: 0.15384615384615385
            },
            {
              path: "/auto/toyota-proace-verso-9",
              sessions: 19,
              activeUsers: 10,
              newUsers: 5,
              avgEngagementTimePerSession: 17.157894736842106,
              keyEvents: 0,
              bounceRate: 0.47368421052631576
            },
            {
              path: "/auto/autoprepravnik",
              sessions: 16,
              activeUsers: 15,
              newUsers: 14,
              avgEngagementTimePerSession: 38.875,
              keyEvents: 6,
              bounceRate: 0.1875
            },
            {
              path: "(not set)",
              sessions: 7,
              activeUsers: 3,
              newUsers: 0,
              avgEngagementTimePerSession: 16.428571428571427,
              keyEvents: 1,
              bounceRate: 0.8571428571428571
            },
            {
              path: "/auto/citroen-berlingo",
              sessions: 7,
              activeUsers: 5,
              newUsers: 5,
              avgEngagementTimePerSession: 35.142857142857146,
              keyEvents: 0,
              bounceRate: 0.2857142857142857
            },
            {
              path: "/auto/mercedes-benz-glc-2-0-cdi",
              sessions: 4,
              activeUsers: 3,
              newUsers: 1,
              avgEngagementTimePerSession: 51.25,
              keyEvents: 1,
              bounceRate: 0.25
            },
            {
              path: "/karoseria/dodavka",
              sessions: 3,
              activeUsers: 3,
              newUsers: 3,
              avgEngagementTimePerSession: 78.33333333333333,
              keyEvents: 1,
              bounceRate: 0
            },
            {
              path: "/auto/skoda-octavia",
              sessions: 2,
              activeUsers: 2,
              newUsers: 0,
              avgEngagementTimePerSession: 27,
              keyEvents: 0,
              bounceRate: 0.5
            },
            {
              path: "/auto/skoda-superb-2021",
              sessions: 2,
              activeUsers: 1,
              newUsers: 0,
              avgEngagementTimePerSession: 0,
              keyEvents: 0,
              bounceRate: 1
            },
            {
              path: "/auto/volkswagen-crafter-l2-h2",
              sessions: 2,
              activeUsers: 2,
              newUsers: 1,
              avgEngagementTimePerSession: 29,
              keyEvents: 1,
              bounceRate: 0
            },
            {
              path: "/auto/vw-crafter-autoprepravnik",
              sessions: 2,
              activeUsers: 2,
              newUsers: 2,
              avgEngagementTimePerSession: 54.5,
              keyEvents: 0,
              bounceRate: 0
            },
            {
              path: "/kontakt",
              sessions: 2,
              activeUsers: 2,
              newUsers: 2,
              avgEngagementTimePerSession: 71.5,
              keyEvents: 1,
              bounceRate: 0.5
            },
            {
              path: "/ochrana-sukromia",
              sessions: 2,
              activeUsers: 2,
              newUsers: 2,
              avgEngagementTimePerSession: 46,
              keyEvents: 1,
              bounceRate: 0
            },
            {
              path: "/vozidla",
              sessions: 2,
              activeUsers: 2,
              newUsers: 2,
              avgEngagementTimePerSession: 39,
              keyEvents: 1,
              bounceRate: 0.5
            },
            {
              path: "/auto/skoda-superb-2017",
              sessions: 1,
              activeUsers: 0,
              newUsers: 0,
              avgEngagementTimePerSession: 0,
              keyEvents: 0,
              bounceRate: 1
            },
            {
              path: "/podmienky-prenajmu",
              sessions: 1,
              activeUsers: 1,
              newUsers: 1,
              avgEngagementTimePerSession: 43,
              keyEvents: 1,
              bounceRate: 0
            }
          ],
          events: [
            {
              name: "page_view",
              eventCount: 1598,
              totalUsers: 427,
              eventCountPerActiveUser: 3.768867924528302
            },
            {
              name: "user_engagement",
              eventCount: 1207,
              totalUsers: 338,
              eventCountPerActiveUser: 3.5816023738872405
            },
            {
              name: "scroll_50",
              eventCount: 818,
              totalUsers: 363,
              eventCountPerActiveUser: 2.2659279778393353
            },
            {
              name: "session_start",
              eventCount: 562,
              totalUsers: 427,
              eventCountPerActiveUser: 1.3254716981132075
            },
            {
              name: "click_auto",
              eventCount: 516,
              totalUsers: 189,
              eventCountPerActiveUser: 2.7301587301587302
            },
            {
              name: "first_visit",
              eventCount: 411,
              totalUsers: 411,
              eventCountPerActiveUser: 1
            },
            {
              name: "scroll_90",
              eventCount: 274,
              totalUsers: 167,
              eventCountPerActiveUser: 1.6506024096385543
            },
            {
              name: "scroll",
              eventCount: 254,
              totalUsers: 153,
              eventCountPerActiveUser: 1.6601307189542485
            },
            {
              name: "click_ponuka",
              eventCount: 239,
              totalUsers: 192,
              eventCountPerActiveUser: 1.2447916666666667
            },
            {
              name: "70scroll60s",
              eventCount: 209,
              totalUsers: 137,
              eventCountPerActiveUser: 1.5255474452554745
            },
            {
              name: "click_tel",
              eventCount: 27,
              totalUsers: 18,
              eventCountPerActiveUser: 1.5
            },
            {
              name: "form_start",
              eventCount: 22,
              totalUsers: 21,
              eventCountPerActiveUser: 1.0476190476190477
            },
            {
              name: "click_rezervovat",
              eventCount: 16,
              totalUsers: 15,
              eventCountPerActiveUser: 1.0666666666666667
            },
            {
              name: "form_submit",
              eventCount: 7,
              totalUsers: 6,
              eventCountPerActiveUser: 1.1666666666666667
            },
            {
              name: "click",
              eventCount: 3,
              totalUsers: 1,
              eventCountPerActiveUser: 3
            }
          ]
        },
    },
    {
      year: 2026, month: 7,
      meta: {
        spend: 23.35, reach: 11761, impressions: 16194, cpm: 1.44, frequency: 1.38,
        clicks: 190, landingPageViews: 99, engagements: 204, costPerEngagement: 0.114, saves: 1,
        campaigns: [
          { name: 'A - Letná dovolenka bez strachu z odťahoviek', spend: 22.3, reach: 11257, impressions: 15611, clicks: 182, landingPageViews: 93, engagements: 195, saves: 1 },
          { name: 'B - Letná dovolenka bez strachu z odťahoviek', spend: 1.05, reach: 504, impressions: 583, clicks: 8, landingPageViews: 6, engagements: 9, saves: 0 },
        ],
      },
      google: {
        spend: 67.9, impressions: 4373, clicks: 249, cpc: 0.27, ctr: 5.69,
        interactions: 268, interactionRate: 6.13,
        impressionsTop: 94.17, impressionsAbsTop: 71.67,
        convRate: 1.12, conversions: 3, costPerConv: 22.63,
        conversionActions: { click_tel: 1, form_start: 2 },
        campaigns: [
          {
            name: 'PMax - dovolenka', type: 'Performance Max',
            spend: 45.7, impressions: 4211, clicks: 211, cpc: 0.22, ctr: 5.01,
            interactions: 230, interactionRate: 5.46,
            convRate: 1.29, conversions: 2.97, costPerConv: 15.38,
            conversionActions: { form_start: 1.97, click_tel: 1 },
          },
          {
            name: 'SE_prenajom_aut', type: 'Search',
            spend: 22.2, impressions: 162, clicks: 38, cpc: 0.58, ctr: 23.46,
            interactions: 38, interactionRate: 23.46,
            impressionsTop: 94.17, impressionsAbsTop: 71.67,
            convRate: 0.08, conversions: 0.03, costPerConv: 763.83,
            conversionActions: { form_start: 0.03 },
          },
        ],
      },
    },
  ],
}

export default rentcarslovakia
