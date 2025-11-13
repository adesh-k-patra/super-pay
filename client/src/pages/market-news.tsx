import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, TrendingUp, TrendingDown, ExternalLink, Building2, Newspaper, List } from "lucide-react";
import { useLocation } from "wouter";
import type { NewsArticle } from "@shared/schema";
import newsPlaceholder from "@assets/stock_images/financial_news_marke_5444f7a8.jpg";
import earningsImg1 from "@assets/stock_images/business_earnings_fi_b5b8736a.jpg";
import earningsImg2 from "@assets/stock_images/business_earnings_fi_701efecd.jpg";
import stocksImg1 from "@assets/stock_images/stock_market_trading_4d79cb6b.jpg";
import stocksImg2 from "@assets/stock_images/stock_market_trading_951d1a16.jpg";
import cryptoImg1 from "@assets/stock_images/cryptocurrency_bitco_53db217a.jpg";
import cryptoImg2 from "@assets/stock_images/cryptocurrency_bitco_65a2f4de.jpg";
import goldImg1 from "@assets/stock_images/gold_bars_precious_m_9516586d.jpg";
import goldImg2 from "@assets/stock_images/gold_bars_precious_m_4287d604.jpg";
import corporateImg1 from "@assets/stock_images/corporate_merger_bus_f369ce30.jpg";
import corporateImg2 from "@assets/stock_images/corporate_merger_bus_70367e6f.jpg";
import commoditiesImg1 from "@assets/stock_images/oil_commodities_ener_7a53ec64.jpg";
import commoditiesImg2 from "@assets/stock_images/oil_commodities_ener_9b93b9c8.jpg";

const categories = [
  { id: "trending", label: "Trending" },
  { id: "corporate-actions", label: "Corporate Actions" },
  { id: "stocks", label: "Stocks" },
  { id: "crypto", label: "Crypto" },
  { id: "gold", label: "Gold" },
  { id: "commodities", label: "Commodities" },
  { id: "earnings", label: "Earnings" },
  { id: "orders", label: "Orders" },
  { id: "forex", label: "Forex" },
  { id: "ipos", label: "IPOs" },
  { id: "mergers", label: "M&A" },
  { id: "analysis", label: "Analysis" }
];

// Company logo mapping - using company logos from react-icons/si
const companyLogos: Record<string, string> = {
  BLK: "https://logo.clearbit.com/blackrock.com",
  WFC: "https://logo.clearbit.com/wellsfargo.com",
  INTU: "https://logo.clearbit.com/intuit.com",
  BP: "https://logo.clearbit.com/bp.com",
  PLTR: "https://logo.clearbit.com/palantir.com",
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  GOLD: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gold-crystals.jpg/800px-Gold-crystals.jpg",
  AAPL: "https://logo.clearbit.com/apple.com"
};

// Mock news data - will be replaced with actual API call
const mockNewsData: NewsArticle[] = [
  {
    id: "1",
    title: "BlackRock Inc. reports Q3 adjusted earnings of $1.91 billion, beating estimates, despite a decrease in profit from last year.",
    description: "BlackRock Inc., the world's largest asset manager, reported third-quarter adjusted earnings of $1.91 billion, surpassing analyst estimates of $1.85 billion. The New York-based firm saw its assets under management increase to $9.1 trillion, up from $8.59 trillion in the previous quarter. Despite the positive earnings beat, net income decreased 3% year-over-year to $1.63 billion due to higher operating expenses and market volatility. The company's ETF business continued to show strong growth, with net inflows of $93 billion during the quarter. CEO Larry Fink attributed the results to strong client demand for sustainable investment products and continued expansion in emerging markets. The firm also announced plans to expand its private markets offerings and technology capabilities.",
    category: "trending",
    sourceUrl: "https://example.com/blackrock-earnings",
    sourceName: "Financial Times",
    postedBy: "Market News",
    ticker: "BLK",
    percentageChange: "2.03",
    isLive: 1,
    imageUrl: earningsImg1,
    publishedAt: new Date(Date.now() - 60000),
    createdAt: new Date()
  },
  {
    id: "2",
    title: "Wells Fargo raised its return on tangible common equity target to 17%-18% after lifting of asset cap, reporting Q3 net income of $5.59 billion.",
    description: "Wells Fargo & Company announced a significant milestone as it raised its return on tangible common equity (ROTCE) target to 17%-18%, following the partial lifting of the Federal Reserve's asset cap. The bank reported third-quarter net income of $5.59 billion, or $1.52 per diluted share, compared to $5.77 billion, or $1.48 per share, in the year-ago quarter. Total revenue increased 2% to $20.86 billion. The lifting of restrictions, which were imposed in 2018 due to governance issues, allows the bank to grow its balance sheet and pursue new business opportunities. CEO Charlie Scharf stated that the bank is well-positioned to capitalize on growth opportunities while maintaining disciplined risk management. Net interest income rose 11% to $13.1 billion, driven by higher interest rates and loan growth.",
    category: "trending",
    sourceUrl: "https://example.com/wells-fargo",
    sourceName: "Bloomberg",
    postedBy: "Trading Desk",
    ticker: "WFC",
    percentageChange: "1.65",
    isLive: 0,
    imageUrl: earningsImg2,
    publishedAt: new Date(Date.now() - 120000),
    createdAt: new Date()
  },
  {
    id: "3",
    title: "Intuit Inc. launches new Mailchimp features to enhance retailers' marketing efforts and drive revenue growth during the holiday shopping season.",
    description: "Intuit Inc. announced the launch of several new features for its Mailchimp platform, designed to help retailers optimize their marketing campaigns during the crucial holiday shopping season. The new capabilities include AI-powered product recommendations, advanced segmentation tools, and enhanced analytics dashboards. The company expects these features to drive significant revenue growth, with early beta testers reporting conversion rate increases of up to 35%. The announcement comes as Intuit reported quarterly revenue of $2.98 billion, up 13% year-over-year. The Mailchimp segment, acquired in 2021 for $12 billion, now contributes approximately 8% of total revenue. CEO Sasan Goodarzi emphasized the company's commitment to providing small businesses with enterprise-grade marketing tools. The stock showed positive momentum following the announcement.",
    category: "stocks",
    sourceUrl: "https://example.com/intuit-mailchimp",
    sourceName: "Reuters",
    postedBy: "Tech Analyst",
    ticker: "INTU",
    percentageChange: "2.16",
    isLive: 0,
    imageUrl: stocksImg1,
    publishedAt: new Date(Date.now() - 180000),
    createdAt: new Date()
  },
  {
    id: "4",
    title: "BP forecasts Q3 production to exceed 2.3 million barrels per day despite weak oil trading performance and lower gas prices impacting earnings.",
    description: "British oil giant BP announced that it expects third-quarter production to exceed 2.3 million barrels of oil equivalent per day, representing a 3% increase from the previous quarter. However, the company warned that weak oil trading performance and declining natural gas prices would impact overall earnings. Brent crude prices averaged $85 per barrel during the quarter, down from $95 in Q2. BP's refining margins also compressed due to oversupply in global markets. The company maintained its commitment to its energy transition strategy, investing $2.5 billion in renewable energy projects during the quarter. CFO Murray Auchincloss noted that while near-term headwinds exist, the company's diversified portfolio positions it well for long-term growth. BP also announced a $1.75 billion share buyback program.",
    category: "commodities",
    sourceUrl: "https://example.com/bp-forecast",
    sourceName: "CNBC",
    postedBy: "Energy Desk",
    ticker: "BP",
    percentageChange: "0.58",
    isLive: 0,
    imageUrl: commoditiesImg1,
    publishedAt: new Date(Date.now() - 240000),
    createdAt: new Date()
  },
  {
    id: "5",
    title: "Palantir reported $1 billion in revenue, a 48% year-over-year increase, with U.S. commercial revenue up 93%, reflecting strong demand for its AI-driven platforms.",
    description: "Palantir Technologies Inc. delivered exceptional third-quarter results, reporting revenue of $1.01 billion, representing a 48% increase year-over-year and exceeding analyst expectations of $975 million. The standout performance came from U.S. commercial revenue, which surged 93% to $179 million, driven by accelerating demand for the company's Artificial Intelligence Platform (AIP). The company added 104 net new customers during the quarter, bringing the total to 629. Government revenue also showed solid growth of 40% to $408 million. CEO Alex Karp highlighted that the company is seeing unprecedented demand from commercial customers looking to implement AI solutions. Palantir raised its full-year revenue guidance to $2.805 billion-$2.809 billion. The company's Rule of 40 score, a key SaaS metric, reached an impressive 68%.",
    category: "stocks",
    sourceUrl: "https://example.com/palantir",
    sourceName: "MarketWatch",
    postedBy: "Tech Reporter",
    ticker: "PLTR",
    percentageChange: "3.87",
    isLive: 0,
    imageUrl: stocksImg2,
    publishedAt: new Date(Date.now() - 300000),
    createdAt: new Date()
  },
  {
    id: "6",
    title: "Bitcoin surges past $68,000 as institutional investors increase holdings ahead of potential ETF approvals and halving event.",
    description: "Bitcoin reached a new multi-month high, surpassing $68,000 as institutional interest continues to grow. The surge comes amid speculation about potential spot Bitcoin ETF approvals and the upcoming halving event expected in April 2024. On-chain data shows significant accumulation by institutional investors, with over 50,000 BTC moved to cold storage in the past week. MicroStrategy announced an additional purchase of 5,500 BTC, bringing its total holdings to 158,400 bitcoins. Grayscale's Bitcoin Trust saw record inflows of $250 million. Analysts point to multiple catalysts including improving macroeconomic conditions, weakening dollar, and increased adoption by traditional financial institutions. Trading volumes across major exchanges exceeded $45 billion in 24 hours. Technical analysts suggest the next resistance level at $70,000.",
    category: "crypto",
    sourceUrl: "https://example.com/bitcoin-surge",
    sourceName: "CoinDesk",
    postedBy: "Crypto Desk",
    ticker: "BTC",
    percentageChange: "5.24",
    isLive: 1,
    imageUrl: cryptoImg1,
    publishedAt: new Date(Date.now() - 30000),
    createdAt: new Date()
  },
  {
    id: "7",
    title: "Gold prices climb to $2,650 per ounce as geopolitical tensions escalate and central banks continue aggressive buying programs.",
    description: "Gold prices reached a new record high of $2,650 per troy ounce, driven by escalating geopolitical tensions in the Middle East and continued central bank purchases. The World Gold Council reported that central banks added 337 tonnes to their reserves in Q3, marking the strongest quarterly demand since 2022. The People's Bank of China led purchases with 78 tonnes, followed by the Reserve Bank of India with 42 tonnes. Safe-haven demand intensified as conflicts in multiple regions raised concerns about global stability. Additionally, expectations of Federal Reserve rate cuts in 2024 have weakened the dollar, making gold more attractive to international buyers. Silver prices also rallied, reaching $32.50 per ounce. Physical demand from India and China remained robust ahead of the festival season.",
    category: "gold",
    sourceUrl: "https://example.com/gold-prices",
    sourceName: "Kitco News",
    postedBy: "Commodities Desk",
    ticker: "GOLD",
    percentageChange: "2.89",
    isLive: 1,
    imageUrl: goldImg1,
    publishedAt: new Date(Date.now() - 45000),
    createdAt: new Date()
  },
  {
    id: "8",
    title: "Apple announces share buyback program worth $110 billion and declares quarterly dividend increase of 4% following strong iPhone 15 sales.",
    description: "Apple Inc. announced a massive $110 billion share buyback program, the largest in corporate history, alongside a 4% increase in its quarterly dividend to $0.25 per share. The announcement followed better-than-expected fiscal third-quarter results, with revenue of $89.5 billion, up 5% year-over-year. iPhone revenue grew 6% to $43.8 billion, driven by strong demand for the iPhone 15 Pro models. Services revenue reached a record $24.2 billion, up 8% and representing 27% of total revenue. CEO Tim Cook highlighted strong performance in emerging markets, particularly India where revenue doubled year-over-year. The company also provided optimistic guidance for the upcoming quarter, expecting revenue growth in line with Q3. Mac and iPad segments showed signs of recovery after several quarters of decline.",
    category: "corporate-actions",
    sourceUrl: "https://example.com/apple-buyback",
    sourceName: "WSJ",
    postedBy: "Corporate News",
    ticker: "AAPL",
    percentageChange: "1.92",
    isLive: 0,
    imageUrl: corporateImg1,
    publishedAt: new Date(Date.now() - 360000),
    createdAt: new Date()
  },
  {
    id: "9",
    title: "Tesla reports record quarterly deliveries of 485,000 vehicles, beating analyst expectations by 12% amid strong demand for Model 3 and Model Y.",
    description: "Tesla Inc. delivered a record 485,000 vehicles in Q3, surpassing Wall Street estimates of 433,000 units. The electric vehicle pioneer's production efficiency improvements and expanded manufacturing capacity at Gigafactories in Texas and Berlin contributed to the stellar performance. Model 3 and Model Y accounted for 94% of total deliveries. The company's energy storage deployments also hit an all-time high of 9.4 GWh. CEO Elon Musk announced plans to unveil the next-generation platform in 2024, targeting a $25,000 mass-market EV. Analysts raised price targets following the delivery beat, with some forecasting the company could deliver 2 million vehicles annually by 2025. The stock surged 8% in after-hours trading.",
    category: "stocks",
    sourceUrl: "https://example.com/tesla-deliveries",
    sourceName: "Reuters",
    postedBy: "Auto Desk",
    ticker: "TSLA",
    percentageChange: "7.85",
    isLive: 0,
    imageUrl: stocksImg1,
    publishedAt: new Date(Date.now() - 400000),
    createdAt: new Date()
  },
  {
    id: "10",
    title: "Ethereum network completes major upgrade enabling 100x scaling with Layer 2 solutions, gas fees drop 95% overnight.",
    description: "The Ethereum network successfully implemented the Dencun upgrade, introducing proto-danksharding that enables significant scaling improvements through Layer 2 rollups. Average transaction fees on popular L2 networks like Arbitrum and Optimism plummeted from $2-5 to under $0.10. The upgrade also improves data availability, allowing L2 networks to process over 100,000 transactions per second collectively. DeFi protocols saw immediate benefits with Uniswap reporting a 300% surge in trading volume. The Ethereum Foundation estimates this upgrade could support mainstream adoption with billions of users. ETH price rallied 12% following the successful deployment, reaching $2,850.",
    category: "crypto",
    sourceUrl: "https://example.com/ethereum-upgrade",
    sourceName: "CoinDesk",
    postedBy: "Blockchain News",
    ticker: "ETH",
    percentageChange: "11.92",
    isLive: 1,
    imageUrl: cryptoImg2,
    publishedAt: new Date(Date.now() - 20000),
    createdAt: new Date()
  },
  {
    id: "11",
    title: "Microsoft acquires AI startup for $16 billion in cash, marking largest tech acquisition of the year as AI race intensifies.",
    description: "Microsoft Corporation announced the acquisition of leading AI research company DeepMind Labs for $16 billion in an all-cash transaction. The deal brings cutting-edge large language model capabilities and a team of 2,000 AI researchers to Microsoft's portfolio. The acquisition is expected to accelerate Microsoft's AI integration across Azure, Office, and GitHub Copilot. CEO Satya Nadella stated this strengthens Microsoft's position in the rapidly evolving AI landscape. Regulatory approval is expected within six months. The acquisition follows Google's similar moves and intensifies competition in the enterprise AI market. Microsoft's stock gained 3.2% on the news.",
    category: "corporate-actions",
    sourceUrl: "https://example.com/microsoft-acquisition",
    sourceName: "Bloomberg",
    postedBy: "M&A Desk",
    ticker: "MSFT",
    percentageChange: "3.18",
    isLive: 0,
    imageUrl: corporateImg2,
    publishedAt: new Date(Date.now() - 480000),
    createdAt: new Date()
  },
  {
    id: "12",
    title: "Fed signals potential rate cuts in Q1 2024 as inflation cools to 2.4%, marking significant shift in monetary policy stance.",
    description: "The Federal Reserve indicated a dovish pivot in its latest policy statement, suggesting interest rate cuts could begin as early as Q1 2024. Inflation has decelerated to 2.4%, approaching the Fed's 2% target. Chairman Jerome Powell noted 'substantial progress' in taming price pressures while acknowledging signs of labor market normalization. Markets now price in 75 basis points of cuts over 2024. The S&P 500 surged 2.1% while the 10-year Treasury yield fell to 4.15%. Bond markets rallied across the curve. Economists project this marks the beginning of a new easing cycle that could extend through 2025.",
    category: "forex",
    sourceUrl: "https://example.com/fed-policy",
    sourceName: "CNBC",
    postedBy: "Fed Watch",
    ticker: "DXY",
    percentageChange: "-0.85",
    isLive: 1,
    imageUrl: earningsImg1,
    publishedAt: new Date(Date.now() - 10000),
    createdAt: new Date()
  },
  {
    id: "13",
    title: "Nvidia unveils next-generation AI chip with 4x performance improvement, securing partnerships with major cloud providers.",
    description: "Nvidia Corporation revealed its H200 AI accelerator chip, delivering 4x performance improvements over the previous generation H100. The new chip features 141GB of HBM3e memory and supports models with up to 100 trillion parameters. Major cloud providers including AWS, Google Cloud, and Microsoft Azure announced immediate deployment plans. CEO Jensen Huang projects the H200 will drive $50 billion in annual revenue by 2025. The chip's enhanced efficiency could reduce AI training costs by 60%. Nvidia's stock jumped 9.5% following the announcement, reaching a new all-time high. Industry analysts call this a 'game-changer' for enterprise AI adoption.",
    category: "stocks",
    sourceUrl: "https://example.com/nvidia-chip",
    sourceName: "TechCrunch",
    postedBy: "Semiconductor News",
    ticker: "NVDA",
    percentageChange: "9.47",
    isLive: 0,
    imageUrl: stocksImg2,
    publishedAt: new Date(Date.now() - 540000),
    createdAt: new Date()
  },
  {
    id: "14",
    title: "Crude oil prices surge 8% as OPEC+ announces surprise production cut of 1.5 million barrels per day starting next month.",
    description: "Oil prices jumped sharply after OPEC+ member nations announced an unexpected production cut of 1.5 million barrels per day, effective from next month. Brent crude surged to $92 per barrel while WTI climbed to $87. Saudi Arabia and Russia are leading the cuts, citing market stabilization goals. The decision caught energy markets off guard, with analysts warning of potential supply shortages. Energy stocks rallied across the board, with Chevron and ExxonMobil gaining over 5%. The White House expressed concern about the impact on inflation. Gasoline futures spiked 6%, suggesting higher pump prices ahead for consumers.",
    category: "commodities",
    sourceUrl: "https://example.com/opec-cuts",
    sourceName: "Energy News",
    postedBy: "Energy Desk",
    ticker: "CL",
    percentageChange: "7.94",
    isLive: 1,
    imageUrl: commoditiesImg2,
    publishedAt: new Date(Date.now() - 15000),
    createdAt: new Date()
  },
  {
    id: "15",
    title: "Amazon reports blowout earnings with AWS revenue up 28% year-over-year, driven by surge in AI workload demand.",
    description: "Amazon.com Inc. posted third-quarter results that exceeded expectations on both revenue and earnings. Total revenue reached $143.1 billion, up 13% year-over-year. Amazon Web Services (AWS) was the standout performer with $25.7 billion in revenue, up 28%, as enterprises accelerated cloud AI deployments. Operating margin expanded to 11.2% as efficiency initiatives took hold. CEO Andy Jassy highlighted strong Prime membership growth and advertising revenue gains. The company announced a $50 billion share repurchase program. Shares surged 12% in extended trading. Analysts view AWS's AI momentum as sustainable, potentially driving accelerated growth through 2025.",
    category: "earnings",
    sourceUrl: "https://example.com/amazon-earnings",
    sourceName: "MarketWatch",
    postedBy: "Earnings Desk",
    ticker: "AMZN",
    percentageChange: "11.85",
    isLive: 0,
    imageUrl: earningsImg2,
    publishedAt: new Date(Date.now() - 600000),
    createdAt: new Date()
  },
  {
    id: "16",
    title: "Silver prices rally to 3-year high at $29.50/oz as industrial demand surges amid solar panel production boom.",
    description: "Silver prices reached $29.50 per ounce, the highest level since 2020, driven by explosive growth in solar panel manufacturing. Global solar installations are projected to hit 500 GW in 2024, requiring record silver consumption. The metal's dual role as both precious and industrial commodity is attracting investors. Physical demand from India ahead of wedding season added further support. The gold-to-silver ratio narrowed to 89:1, suggesting silver remains undervalued relative to gold. Mining supply constraints due to aging deposits compound the bullish outlook. Analysts project silver could test $35 if current demand trends persist.",
    category: "gold",
    sourceUrl: "https://example.com/silver-rally",
    sourceName: "Metals Daily",
    postedBy: "Precious Metals",
    ticker: "SI",
    percentageChange: "5.67",
    isLive: 0,
    imageUrl: goldImg2,
    publishedAt: new Date(Date.now() - 660000),
    createdAt: new Date()
  },
  {
    id: "17",
    title: "Coinbase wins partial victory in SEC lawsuit as judge dismisses three out of five charges, crypto stocks rally.",
    description: "A federal judge dismissed three of five charges against Coinbase in the SEC's lawsuit, dealing a setback to regulators' crypto enforcement campaign. The court ruled that certain digital assets don't meet the definition of securities under the Howey Test. Coinbase's stock surged 15% while other crypto-related equities followed suit. Legal experts view this as a landmark decision that could reshape cryptocurrency regulation. The remaining charges will proceed to trial, but Coinbase's legal team expressed confidence. Industry advocates called for clearer legislation. The ruling may influence ongoing cases against other crypto platforms.",
    category: "crypto",
    sourceUrl: "https://example.com/coinbase-sec",
    sourceName: "Law360",
    postedBy: "Legal News",
    ticker: "COIN",
    percentageChange: "14.92",
    isLive: 1,
    imageUrl: cryptoImg1,
    publishedAt: new Date(Date.now() - 8000),
    createdAt: new Date()
  },
  {
    id: "18",
    title: "JPMorgan Chase beats Q3 estimates with record investment banking fees, announces 15% dividend increase.",
    description: "JPMorgan Chase & Co. reported third-quarter earnings of $4.33 per share, beating estimates of $3.99. Investment banking fees surged 35% to $2.5 billion as M&A activity rebounded. Net interest income rose 9% to $22.8 billion despite rate uncertainty. The bank announced a 15% dividend increase to $1.15 per share, signaling confidence in capital position. CEO Jamie Dimon highlighted strong performance across all business segments. Credit quality remained solid with net charge-offs at historic lows. The board also approved a new $30 billion stock buyback program. Shares gained 4.2% following the earnings release.",
    category: "earnings",
    sourceUrl: "https://example.com/jpmorgan-earnings",
    sourceName: "Financial Times",
    postedBy: "Banking Desk",
    ticker: "JPM",
    percentageChange: "4.15",
    isLive: 0,
    imageUrl: earningsImg1,
    publishedAt: new Date(Date.now() - 720000),
    createdAt: new Date()
  },
  {
    id: "19",
    title: "Breakthrough in fusion energy as startup achieves net energy gain for the third consecutive time, attracting $500M in new funding.",
    description: "Commonwealth Fusion Systems announced a historic third consecutive net energy gain from its compact fusion reactor, demonstrating reproducibility crucial for commercial viability. The breakthrough attracted $500 million in Series C funding led by major energy and tech investors. The startup projects commercial fusion power plants could be operational by 2030. Energy output exceeded input by 40% in the latest test. The achievement could revolutionize clean energy production without the drawbacks of traditional nuclear fission. Global energy giants including Shell and TotalEnergies are exploring partnerships. Scientists call this the most significant fusion milestone since the 1950s.",
    category: "commodities",
    sourceUrl: "https://example.com/fusion-breakthrough",
    sourceName: "Nature Energy",
    postedBy: "Science Desk",
    ticker: "ENERGY",
    percentageChange: "8.32",
    isLive: 1,
    imageUrl: commoditiesImg1,
    publishedAt: new Date(Date.now() - 5000),
    createdAt: new Date()
  },
  {
    id: "20",
    title: "Alphabet announces major restructuring of Google Cloud, targeting $10B cost savings while doubling down on AI infrastructure.",
    description: "Alphabet Inc. unveiled a comprehensive restructuring of its Google Cloud division, aiming to achieve $10 billion in annual cost savings by 2025. The reorganization consolidates overlapping teams and streamlines operations while significantly increasing AI infrastructure investments. CEO Sundar Pichai emphasized the shift toward AI-first enterprise solutions. The company announced partnerships with OpenAI and Anthropic to offer competing AI models on Google Cloud Platform. Workforce reductions of approximately 6,000 positions are planned, primarily in sales and support. Cloud revenue guidance was raised to $38 billion for FY2024. Stock rose 3.8% on operational efficiency optimism.",
    category: "corporate-actions",
    sourceUrl: "https://example.com/alphabet-restructure",
    sourceName: "WSJ",
    postedBy: "Corporate Strategy",
    ticker: "GOOGL",
    percentageChange: "3.76",
    isLive: 0,
    imageUrl: corporateImg1,
    publishedAt: new Date(Date.now() - 780000),
    createdAt: new Date()
  }
];

export default function MarketNews() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("trending");
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "card">("card");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [canNavigate, setCanNavigate] = useState(true);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // In a real implementation, this would fetch from the API
  const { data: newsArticles = mockNewsData, isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news', selectedCategory],
    enabled: false, // Disabled for now as we're using mock data
  });

  const filteredNews = mockNewsData.filter(
    article => selectedCategory === "trending" || article.category === selectedCategory
  );

  const formatTimeAgo = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getCompanyLogo = (ticker: string | null) => {
    if (!ticker) return null;
    return companyLogos[ticker] || null;
  };

  // Check if user has scrolled to bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const threshold = 20; // pixels from bottom to consider "at bottom"
    const isBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
    setIsAtBottom(isBottom);
  };

  // Play paper swipe sound
  const playSwipeSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore audio play errors (e.g., autoplay policy)
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEnd(e.targetTouches[0].clientY);
    setTouchStartTime(Date.now());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!canNavigate) return;

    const finalTouchEnd = e.changedTouches[0].clientY;
    const distance = touchStart - finalTouchEnd;
    const duration = Date.now() - touchStartTime;
    const velocity = Math.abs(distance) / duration;

    // Minimum swipe requirements
    const MIN_SWIPE_DISTANCE = 100; // pixels
    const MIN_SWIPE_VELOCITY = 0.3; // pixels per millisecond

    // Check if swipe meets minimum requirements
    const isValidSwipe = Math.abs(distance) > MIN_SWIPE_DISTANCE || velocity > MIN_SWIPE_VELOCITY;

    if (isValidSwipe) {
      if (distance > 0) {
        // Swipe up - next card (only if at bottom of current content)
        if (isAtBottom && currentCardIndex < filteredNews.length - 1) {
          setCurrentCardIndex(prev => prev + 1);
          playSwipeSound();
          setIsAtBottom(false);
          
          // Cooldown to prevent double-advances
          setCanNavigate(false);
          setTimeout(() => setCanNavigate(true), 400);
        }
      } else {
        // Swipe down - previous card (always allowed)
        if (currentCardIndex > 0) {
          setCurrentCardIndex(prev => prev - 1);
          playSwipeSound();
          setIsAtBottom(false);
          
          // Cooldown to prevent double-advances
          setCanNavigate(false);
          setTimeout(() => setCanNavigate(true), 400);
        }
      }
    }
  };

  useEffect(() => {
    setCurrentCardIndex(0);
    setIsAtBottom(false);
  }, [selectedCategory]);

  // Initialize audio for paper swipe sound
  useEffect(() => {
    // Create audio element with a paper swipe sound URL
    // Using a free paper page turn sound from freesound.org
    audioRef.current = new Audio('https://cdn.freesound.org/previews/442/442943_8213296-lq.mp3');
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <div className="px-4 py-3">
          <div className="relative flex items-center justify-center mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/pro-tools")}
              className="absolute left-0 text-white hover:bg-white/10 rounded-none"
              data-testid="button-back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="mt-1 text-center">
              <h1 className="text-xl font-bold text-white uppercase tracking-widest">Market News</h1>
              <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">Real-time market updates & analysis</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === "timeline" ? "card" : "timeline")}
              className="absolute right-0 text-white hover:bg-white/10 rounded-none"
              data-testid="button-view-toggle"
            >
              {viewMode === "timeline" ? (
                <Newspaper className="h-5 w-5" />
              ) : (
                <List className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Category Tabs - Horizontal Scroll */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2 mt-5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <Button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "rounded-none whitespace-nowrap transition-all uppercase tracking-widest text-xs font-light",
                      isActive
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white"
                    )}
                    data-testid={`button-category-${cat.id}`}
                  >
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "timeline" ? (
        <div className="pt-40 pb-8">
          {/* News Timeline */}
          <div className="relative px-4">
            {/* Timeline Line */}
            <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-white/10"></div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-white/60 font-light text-sm">Loading news...</p>
                </div>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60">No news available in this category</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredNews.map((article, index) => (
                <div key={article.id} className="relative flex gap-4">
                  {/* Time */}
                  <div className="flex-shrink-0 w-16 pt-1">
                    <p className="text-xs text-white/50 uppercase tracking-wider">{formatTimeAgo(article.publishedAt!)}</p>
                    {article.isLive === 1 && (
                      <Badge className="bg-white text-black text-[10px] px-1.5 py-0 mt-1 animate-pulse font-bold uppercase tracking-wider" data-testid={`badge-live-${article.id}`}>
                        LIVE
                      </Badge>
                    )}
                  </div>

                  {/* News Thumbnail */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-none border border-white/20 flex items-center justify-center relative z-10 bg-white/5 overflow-hidden">
                    {article.imageUrl ? (
                      <img 
                        src={article.imageUrl} 
                        alt={article.ticker || "News"}
                        className="w-full h-full object-cover"
                        data-testid={`img-thumbnail-${article.id}`}
                      />
                    ) : (
                      <Newspaper className="h-6 w-6 text-white/40" data-testid={`icon-news-${article.id}`} />
                    )}
                  </div>

                  {/* News Content */}
                  <button
                    onClick={() => setSelectedNews(article)}
                    className="flex-1 text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-none p-4 transition-all group"
                    data-testid={`card-news-${article.id}`}
                  >
                    <h3 className="font-light text-white mb-2 leading-snug group-hover:text-white transition-colors">
                      {article.title}
                    </h3>
                    
                    {article.ticker && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-mono text-white/70 uppercase tracking-wider" data-testid={`text-ticker-${article.id}`}>
                          {article.ticker}
                        </span>
                        {article.percentageChange && (
                          <div className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            parseFloat(article.percentageChange) >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {parseFloat(article.percentageChange) >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span data-testid={`text-change-${article.id}`}>
                              {parseFloat(article.percentageChange) >= 0 ? "+" : ""}
                              {article.percentageChange}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-white/40 mt-2 uppercase tracking-wider" data-testid={`text-source-${article.id}`}>
                      {article.sourceName}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      ) : (
        /* Card Swipe View */
        <div 
          ref={cardContainerRef}
          className="fixed inset-0 top-[clamp(110px,16vh,140px)] overflow-hidden"
          style={{
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {filteredNews.length > 0 && (
            <>
              <div 
                className="h-full transition-transform duration-300 ease-out"
                style={{
                  transform: `translateY(-${currentCardIndex * 100}%)`
                }}
              >
                {filteredNews.map((article, index) => (
                  <div
                    key={article.id}
                    className="h-full flex flex-col"
                  >
                    <div 
                      ref={index === currentCardIndex ? scrollAreaRef : null}
                      className="flex-1 flex flex-col overflow-y-auto pb-28"
                      style={{
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch'
                      }}
                      onScroll={index === currentCardIndex ? handleScroll : undefined}
                    >
                      {/* News Image - Top (16:9 aspect ratio) */}
                      {article.imageUrl && (
                        <div className="w-full h-[56.25vw] max-h-[300px] border-b border-white/20 bg-white/5 overflow-hidden relative flex-shrink-0">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title}
                            className="w-full h-full object-cover"
                            data-testid={`img-news-${article.id}`}
                          />
                        </div>
                      )}

                      {/* Title Section */}
                      <div className="px-6 pt-3 pb-2 border-b border-white/10">
                        <h2 className="text-xl font-light text-white leading-snug text-left">
                          {article.title}
                        </h2>
                      </div>

                      {/* News Meta Section */}
                      <div className="px-6 py-2 border-b border-white/10">
                        <div className="flex items-center justify-between text-xs text-white/60 uppercase tracking-wider">
                          <span>Posted by: {article.postedBy}</span>
                          <span>{formatTimeAgo(article.publishedAt!)}</span>
                        </div>
                      </div>

                      {/* Description Section */}
                      <div className="px-6 py-2 border-b border-white/10">
                        <p className="text-white/80 leading-relaxed font-light">
                          {article.description}
                        </p>
                      </div>
                    </div>

                    {/* View Source Button - Fixed at Bottom */}
                    {article.sourceUrl && index === currentCardIndex && (
                      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-black border-t border-white/10">
                        <Button
                          onClick={() => window.open(article.sourceUrl!, '_blank')}
                          className="w-full h-14 bg-white text-black hover:bg-white/90 gap-2 rounded-none uppercase tracking-widest font-light text-base px-8"
                        >
                          <ExternalLink className="h-5 w-5" />
                          View Source
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="bg-black text-white border-white/20 max-w-2xl max-h-[80vh] p-0" data-testid="dialog-news-detail">
          {/* News Image - Top (16:9 aspect ratio) */}
          {selectedNews?.imageUrl && (
            <div className="w-full h-[56.25vw] max-h-[400px] border-b border-white/20 bg-white/5 overflow-hidden relative flex-shrink-0">
              <img 
                src={selectedNews.imageUrl} 
                alt={selectedNews.title}
                className="w-full h-full object-cover"
                data-testid="img-dialog-news"
              />
            </div>
          )}
          
          <ScrollArea className="max-h-[60vh]">
            <div className="flex flex-col">
              {/* Title Section */}
              <div className="px-6 pt-6 pb-4 border-b border-white/10">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-xl font-light leading-snug text-left">
                    {selectedNews?.title}
                  </DialogTitle>
                </DialogHeader>
              </div>

              {/* News Meta Section */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center justify-between text-xs text-white/60 uppercase tracking-wider">
                  <span data-testid="text-dialog-source">
                    Posted by: {selectedNews?.postedBy}
                  </span>
                  <span data-testid="text-dialog-time">
                    {selectedNews?.publishedAt && formatTimeAgo(selectedNews.publishedAt)}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="px-6 py-4 border-b border-white/10">
                <p className="text-white/80 leading-relaxed font-light" data-testid="text-dialog-description">
                  {selectedNews?.description}
                </p>
              </div>

              {/* View Source Button - Bottom Certificate Style */}
              {selectedNews?.sourceUrl && (
                <div className="px-6 py-4 border-b border-white/10">
                  <Button
                    onClick={() => window.open(selectedNews.sourceUrl!, '_blank')}
                    className="w-full h-14 bg-white text-black hover:bg-white/90 gap-2 rounded-none uppercase tracking-widest font-light text-base px-8"
                    data-testid="button-view-source"
                  >
                    <ExternalLink className="h-5 w-5" />
                    View Source
                  </Button>
                </div>
              )}

              {/* Source Attribution - Bottom */}
              <div className="px-6 py-3">
                <p className="text-xs text-white/40 text-center uppercase tracking-wider">
                  Source: {selectedNews?.sourceName}
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
