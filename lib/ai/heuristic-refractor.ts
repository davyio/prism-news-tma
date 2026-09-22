import { SpectrumPOV, VoiceTone, GlobalLanguage, RefractedPerspective, RefractedStory, NewsItem } from '../news/types';
import { POV_DEFINITIONS } from './prompts';

// Core translations dictionary for key labels across languages
const TRANSLATIONS: Record<GlobalLanguage, {
  bullLabel: string;
  bearLabel: string;
  summaryPrefix: Record<SpectrumPOV, string>;
}> = {
  en: {
    bullLabel: 'Exponential Upside',
    bearLabel: 'Systemic Vulnerability',
    summaryPrefix: {
      OPTIMIST: 'A pivotal inflection point validating exponential innovation. Engineers and founders are capitalizing on friction-free distribution to compound productivity.',
      CYNIC: 'A classic speculative climax masking deteriorating unit economics, regulatory vulnerabilities, and insider exit liquidity.',
      DEGEN: 'Massive volatility catalyst unlocking asymmetrical on-chain leverage. Fiat debasement forces capital into permissionless liquidity venues.',
      REALIST: 'A calculated geopolitical maneuver realigning state sovereignty, strategic supply chain defense, and cross-border resource leverage.',
      TABLOID: 'BOMBSHELL: Insiders are panicking behind closed doors as shockwaves rip through the industry. You will not believe who is pulling the strings.',
      FACT: 'Verified chronology confirms documented developments in accordance with filed disclosures and official communications.',
    }
  },
  es: {
    bullLabel: 'Potencial Exponencial',
    bearLabel: 'Vulnerabilidad Sistémica',
    summaryPrefix: {
      OPTIMIST: 'Un punto de inflexión crucial que valida la innovación exponencial y el crecimiento acelerado.',
      CYNIC: 'Un clímax especulativo clásico que oculta el deterioro económico y la liquidez de salida interna.',
      DEGEN: 'Catalizador de volatilidad masiva que desbloquea un apalancamiento asimétrico en cadena.',
      REALIST: 'Una maniobra geopolítica calculada que reajusta la soberanía estatal y las cadenas de suministro.',
      TABLOID: 'ESCÁNDALO TOTAL: Pánico entre los inversores tras filtraciones explosivas en el sector.',
      FACT: 'La cronología verificada confirma desarrollos documentados según declaraciones oficiales.',
    }
  },
  fr: {
    bullLabel: 'Potentiel Exponentiel',
    bearLabel: 'Vulnérabilité Systémique',
    summaryPrefix: {
      OPTIMIST: 'Un point d’inflexion stratégique confirmant l’accélération technologique et la création de valeur.',
      CYNIC: 'Un piège spéculatif classique masquant l’érosion des marges et des risques réglementaires imminents.',
      DEGEN: 'Catalyseur de volatilité majeur favorisant les flux de capitaux vers les actifs décentralisés.',
      REALIST: 'Une manœuvre géopolitique calculée qui redéfinit la souveraineté stratégique et les chaînes de valeur.',
      TABLOID: 'RÉVÉLATION CHOC : Panique dans les coulisses alors que des informations confidentielles fuient.',
      FACT: 'Chronologie factuelle confirmée par les déclarations officielles et les données vérifiées.',
    }
  },
  zh: {
    bullLabel: '指数级增长潜力',
    bearLabel: '系统性脆弱风险',
    summaryPrefix: {
      OPTIMIST: '这是一个关键的拐点，验证了技术创新的指数级飞跃与全球生产力重塑。',
      CYNIC: '这是一场典型的投机狂热，掩盖了恶化的单位经济效益与内幕资金套现离场。',
      DEGEN: '剧烈的波动性催化剂，正在解锁非对称的链上流动性与去中心化资产重估。',
      REALIST: '一场精心策划的地缘博弈，重新划定了国家主权、核心供应链与技术制高点。',
      TABLOID: '重磅突发：内幕消息泄露引发市场巨震，核心高管紧急密谋应对危机！',
      FACT: '客观事实核查：根据官方文件与审计记录，事件的时间线与核心数据均已核实。',
    }
  },
  ru: {
    bullLabel: 'Экспоненциальный Рост',
    bearLabel: 'Системный Риск',
    summaryPrefix: {
      OPTIMIST: 'Переломный момент, доказывающий превосходство технологического ускорения и масштабирования.',
      CYNIC: 'Классический спекулятивный пузырь, скрывающий сжигание капитала и выход инсайдеров.',
      DEGEN: 'Мощный катализатор волатильности, стимулирующий переход ликвидности в ончейн-протоколы.',
      REALIST: 'Хладнокровный геополитический гамбит в борьбе за суверенный контроль над цепочками поставок.',
      TABLOID: 'ГРОМКИЙ СКАНДАЛ: Инсайдеры в панике после утечки закрытых данных за кулисами индустрии!',
      FACT: 'Верифицированная хроника событий на основе официальных отчетов и первичных источников.',
    }
  },
  ar: {
    bullLabel: 'صعود أسي محتمل',
    bearLabel: 'هشاشة هيكلية',
    summaryPrefix: {
      OPTIMIST: 'نقطة تحول محورية تؤكد التسارع التكنولوجي والإنتاجية الفائقة في المنظومة الرقمية.',
      CYNIC: 'فقاعة مضاربة كلاسيكية تحجب تآكل الأرباح والمخاطر التنظيمية الداهمة للمستثمرين.',
      DEGEN: 'محفز سيولة هائل يطلق العنان للمضاربة الحرة والأصول اللامركزية المقاومة للتضخم.',
      REALIST: 'مناورة جيوسياسية محسوبة تعيد تشكيل السيادة الوطنية وسلاسل التوريد الحيوية في العالم.',
      TABLOID: 'صدمة مدوية: تسريبات سرية تكشف ذعر النخبة وتفجر الجدل في أروقة الصناعة!',
      FACT: 'توثيق موضوعي دقيق يستند بالكامل إلى البيانات الرسمية والوقائع المادية الملموسة.',
    }
  },
  ja: {
    bullLabel: '指数関数的アップサイド',
    bearLabel: '構造的脆弱性',
    summaryPrefix: {
      OPTIMIST: '技術の急速な進化と生産性の飛躍的向上を実証する重要な変革点。',
      CYNIC: '収益性の悪化とインサイダーの利確を隠蔽する典型的な投機バブルの様相。',
      DEGEN: 'オンチェーン流動性と非対称なリターンを解放する極めて強力なボラティリティ要因。',
      REALIST: '国家主権とサプライチェーンの防衛線を再構築する冷徹な地政学的布石。',
      TABLOID: '衝撃のスクープ：極秘情報の流出で業界上層部に激震が走る！',
      FACT: '客観的検証：公式発表および公開監査データに基づいた純粋な事実記録。',
    }
  },
  de: {
    bullLabel: 'Exponentielles Potenzial',
    bearLabel: 'Systemisches Risiko',
    summaryPrefix: {
      OPTIMIST: 'Ein entscheidender Wendepunkt, der die exponentielle Innovationskraft der Technologie belegt.',
      CYNIC: 'Ein klassischer spekulativer Hype, der schwindende Margen und Ausstiegsmanöver kaschiert.',
      DEGEN: 'Massiver Volatilitätskatalysator, der asymmetrische On-Chain-Liquidität und Hebel freisetzt.',
      REALIST: 'Ein kalkuliertes geopolitisches Manöver zur Neuausrichtung strategischer Lieferketten.',
      TABLOID: 'SKANDAL ENTHÜLLT: Panik in den Führungsetagen nach brisanten Insider-Leaks!',
      FACT: 'Verifizierte Chronologie basierend auf offiziellen Erklärungen und belegten Datenpunkten.',
    }
  },
};

export function generateHeuristicPerspective(
  news: NewsItem,
  pov: SpectrumPOV,
  voice: VoiceTone,
  lang: GlobalLanguage
): RefractedPerspective {
  const meta = POV_DEFINITIONS[pov];
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const prefix = t.summaryPrefix[pov] || t.summaryPrefix.FACT;

  let headline = news.title;
  let sentimentScore = 0;
  let keyTakeaways: string[] = [];
  let bullCase = '';
  let bearCase = '';

  switch (pov) {
    case 'OPTIMIST':
      headline = `Accelerating Frontier: How ${news.title.slice(0, 50)} Unlocks Exponential TAM`;
      sentimentScore = 85;
      keyTakeaways = [
        'Radically drives down marginal operational cost across distributed architectures.',
        'Accelerates software flywheel velocity by orders of magnitude.',
        'Positions first-movers to capture dominant platform network effects.'
      ];
      bullCase = 'Global adoption compounds at 200%+ CAGR, redefining industry benchmarks.';
      bearCase = 'Temporary infrastructure bottlenecks delay full production deployment by 3-6 months.';
      break;

    case 'CYNIC':
      headline = `The Bubble Unravels: Behind the Illusion of ${news.title.slice(0, 50)}`;
      sentimentScore = -82;
      keyTakeaways = [
        'Unit economics fail under rigorous cost-of-capital scrutiny.',
        'Regulatory anti-trust subpoenas and compliance overhead will choke operating margins.',
        'Smart money insiders are actively unloading positions into retail euphoria.'
      ];
      bullCase = 'Subsidized capital prolongs the exit window before structural re-pricing occurs.';
      bearCase = 'Cascading liquidity squeeze triggers aggressive multiple compression down to tangible book value.';
      break;

    case 'DEGEN':
      headline = `Send It or Get Rekt: The Alpha Angle on ${news.title.slice(0, 50)}`;
      sentimentScore = 65;
      keyTakeaways = [
        'Fiat debasement is accelerating; this creates an immediate rotation into on-chain beta.',
        'High-leverage perps and memetic derivative instruments will front-run traditional equity markets.',
        'Smart contracts bypass institutional gatekeepers entirely.'
      ];
      bullCase = 'Liquidity floods into the ecosystem, driving an explosive 20x re-rating.';
      bearCase = 'Flash liquidation cascade wipes out overleveraged retail margin longs.';
      break;

    case 'REALIST':
      headline = `Sovereign Chessboard: Strategic Realignments Triggered by ${news.title.slice(0, 50)}`;
      sentimentScore = 5;
      keyTakeaways = [
        'Critical national security interest; state actors will intervene to secure domestic capability.',
        'Supply chain weaponization forces multi-polar bifurcations between trading blocs.',
        'Institutional leverage dictates regulatory capture and strategic sovereignty.'
      ];
      bullCase = 'Bilateral treaty protection and sovereign subsidies insulate core operators.',
      bearCase = 'Export restrictions and retaliatory tariffs fragment the global market permanently.';
      break;

    case 'TABLOID':
      headline = `EXPOSED: What They Aren't Telling You About ${news.title.slice(0, 50)}!`;
      sentimentScore = 40;
      keyTakeaways = [
        'Shocking secret meetings leaked from inside executive inner sanctums.',
        'Whistleblowers break silence on chaotic internal power struggles.',
        'The drama is only beginning — expect high-profile resignations within days.'
      ];
      bullCase = 'The viral attention machine explodes engagement through the roof.',
      bearCase = 'Reputational fallout causes high-profile sponsors to pull out immediately.';
      break;

    case 'FACT':
    default:
      headline = `Verified Intelligence: ${news.title}`;
      sentimentScore = 0;
      keyTakeaways = [
        `Source documentation verified from primary feed: ${news.sourceName}.`,
        `Timestamp registered at ${news.pubDate} with confirmed transmission ID.`,
        'All analytical claims isolated strictly from verifiable factual occurrences.'
      ];
      bullCase = 'Execution proceeds strictly according to documented project specifications.',
      bearCase = 'Variance from historical baseline metrics remains within standard confidence intervals.';
      break;
  }

  // Voice formatting adjustments
  if (voice === 'GENZ') {
    headline = `[FR FR NO CAP] ${headline.replace(/Accelerating|Sovereign|Verified/g, 'Insane Aura')}`;
    keyTakeaways = keyTakeaways.map(k => `Bro really thought... ${k} (it's actually giving high key)`);
  } else if (voice === 'NOIR') {
    headline = `Case File: ${headline} in the Rain`;
    keyTakeaways = keyTakeaways.map(k => `The smoke clears: ${k}`);
  }

  return {
    pov,
    label: meta.label,
    tagline: meta.tagline,
    badgeColor: meta.badgeColor,
    headline,
    summary: `${prefix} ${news.originalSnippet}`,
    keyTakeaways,
    bullCase,
    bearCase,
    sentimentScore,
  };
}

export function generateAllHeuristicPerspectives(
  news: NewsItem,
  voice: VoiceTone = 'EXECUTIVE',
  lang: GlobalLanguage = 'en'
): RefractedStory {
  const povs: SpectrumPOV[] = ['OPTIMIST', 'CYNIC', 'DEGEN', 'REALIST', 'TABLOID', 'FACT'];
  const perspectives = {} as Record<SpectrumPOV, RefractedPerspective>;

  for (const p of povs) {
    perspectives[p] = generateHeuristicPerspective(news, p, voice, lang);
  }

  return {
    newsId: news.id,
    originalTitle: news.title,
    language: lang,
    voice,
    activePov: 'FACT',
    perspectives,
  };
}
