const conceptNodes = (exam, stage, subjectId, subjectTitle, groups) => {
  const subjectNodeId = `${exam}.${stage}.${subjectId}`;
  const subject = { exam, nodeId: subjectNodeId, parentId: "", level: "subject", title: subjectTitle, description: "" };
  const nodes = [subject];
  for (const group of groups) {
    const topicId = `${subjectNodeId}.${group.id}`;
    nodes.push({ exam, nodeId: topicId, parentId: subjectNodeId, level: "topic", title: group.title, description: "" });
    for (const concept of group.concepts) {
      const id = `${topicId}.${concept.id}`;
      nodes.push({ exam, nodeId: id, parentId: topicId, level: "concept", title: concept.title, description: concept.description || "" });
    }
  }
  return nodes;
};

const c = (id, title, description = "") => ({ id, title, description });
const g = (id, title, concepts) => ({ id, title, concepts });

const RAS_PRELIMS = [
  ...conceptNodes("ras", "prelims", "history_india", "History of India", [
    g("ancient", "Ancient India", [c("prehistoric", "Prehistoric cultures"), c("indus", "Indus Valley Civilization"), c("vedic", "Vedic Age"), c("mahajanapadas", "Mahajanapadas"), c("buddhism", "Buddhism"), c("jainism", "Jainism"), c("maurya", "Mauryan Empire"), c("post_maurya", "Post-Mauryan kingdoms"), c("gupta", "Gupta Age"), c("south_ancient", "Ancient South India")]),
    g("medieval", "Medieval India", [c("early_medieval", "Early medieval regional kingdoms"), c("delhi_sultanate", "Delhi Sultanate"), c("vijayanagara", "Vijayanagara and Bahmani kingdoms"), c("mughal", "Mughal Empire"), c("maratha", "Marathas"), c("bhakti", "Bhakti movement"), c("sufi", "Sufi traditions"), c("medieval_economy", "Medieval economy and society"), c("architecture", "Medieval architecture"), c("literature", "Medieval literature")]),
    g("modern", "Modern India", [c("europeans", "European entry and expansion"), c("british_rule", "British administrative expansion"), c("economic_impact", "Colonial economy and economic impact"), c("tribal_peasant", "Tribal and peasant movements"), c("revolt1857", "Revolt of 1857"), c("social_reform", "Social and religious reform movements"), c("congress", "Indian National Congress"), c("extremists", "Extremist and revolutionary movements"), c("gandhian", "Gandhian movements"), c("constitutional", "Constitutional developments 1909–1947"), c("partition", "Partition and independence")]),
    g("culture", "Indian Art & Culture", [c("architecture", "Temple, Buddhist and Indo-Islamic architecture"), c("sculpture", "Sculpture traditions"), c("painting", "Indian painting traditions"), c("music", "Classical music"), c("dance", "Classical dances"), c("theatre", "Theatre and performing arts"), c("literature", "Indian literary traditions"), c("heritage", "UNESCO and cultural heritage")])
  ]),
  ...conceptNodes("ras", "prelims", "polity", "Indian Constitution & Governance", [
    g("constitution", "Constitutional Framework", [c("making", "Making of the Constitution"), c("features", "Salient features"), c("preamble", "Preamble"), c("citizenship", "Citizenship"), c("amendment", "Constitutional amendment procedure"), c("basic_structure", "Basic structure doctrine")]),
    g("rights", "Fundamental Rights & Duties", [c("fr", "Fundamental Rights"), c("writs", "Constitutional writs"), c("dpsp", "Directive Principles"), c("duties", "Fundamental Duties"), c("judicial_review", "Judicial review"), c("reasonable_restrictions", "Reasonable restrictions")]),
    g("union", "Union Executive & Legislature", [c("president", "President"), c("vice_president", "Vice-President"), c("pm_council", "Prime Minister and Council of Ministers"), c("parliament", "Parliament"), c("committees", "Parliamentary committees"), c("budget_process", "Budget and parliamentary financial procedure"), c("ordinance", "Ordinance power")]),
    g("state", "State Government", [c("governor", "Governor"), c("cm_council", "Chief Minister and Council"), c("state_legislature", "State Legislature"), c("high_court", "High Courts")]),
    g("federal", "Federalism & Local Government", [c("centre_state", "Centre-State relations"), c("inter_state", "Inter-State Council"), c("finance_commission", "Finance Commission"), c("gst_council", "GST Council"), c("panchayati_raj", "Panchayati Raj"), c("municipalities", "Urban local bodies")]),
    g("judiciary", "Judiciary & Constitutional Bodies", [c("supreme_court", "Supreme Court"), c("judicial_appointments", "Judicial appointments"), c("election_commission", "Election Commission"), c("cag", "Comptroller and Auditor General"), c("upsc", "Union Public Service Commission"), c("finance_commission_body", "Finance Commission as constitutional body"), c("constitutional_commissions", "SC/ST/Backward Classes commissions")]),
    g("governance", "Governance & Accountability", [c("rtI", "Right to Information"), c("citizen_charter", "Citizen Charter"), c("social_audit", "Social audit"), c("e_governance", "E-governance"), c("transparency", "Transparency and accountability"), c("civil_services", "Civil services and administrative ethics basics")])
  ]),
  ...conceptNodes("ras", "prelims", "geography", "Geography of India & Rajasthan", [
    g("physical", "Physical Geography", [c("geomorphology", "Geomorphology"), c("physiography", "Physiographic divisions"), c("rocks", "Rocks and minerals"), c("earthquakes", "Earthquakes and volcanoes"), c("climate", "Climatology"), c("monsoon", "Indian monsoon"), c("oceanography", "Oceanography"), c("soils", "Soils"), c("drainage", "Drainage systems")]),
    g("india", "Indian Geography", [c("rivers", "Major river systems"), c("irrigation", "Irrigation"), c("agriculture", "Agriculture and cropping patterns"), c("minerals", "Mineral resources"), c("energy", "Energy resources"), c("industries", "Industrial regions"), c("transport", "Transport networks"), c("population", "Population and settlement"), c("urbanization", "Urbanization")]),
    g("rajasthan", "Rajasthan Geography", [c("location", "Location, extent and boundaries"), c("physiography", "Aravalli and physiographic regions"), c("desert", "Thar Desert"), c("climate", "Rajasthan climate"), c("rivers", "Rajasthan rivers and drainage"), c("groundwater", "Groundwater"), c("lakes", "Lakes and wetlands"), c("soils", "Soils of Rajasthan"), c("agriculture", "Agriculture of Rajasthan"), c("minerals", "Mineral resources"), c("industries", "Industries and industrial regions"), c("population", "Population and urbanisation")])
  ]),
  ...conceptNodes("ras", "prelims", "economy", "Indian & Rajasthan Economy", [
    g("basics", "Macroeconomic Basics", [c("national_income", "National income"), c("gdp_gva", "GDP and GVA"), c("real_nominal", "Real and nominal variables"), c("growth", "Economic growth and development"), c("inflation", "Inflation"), c("unemployment", "Unemployment")]),
    g("banking", "Money, Banking & Finance", [c("money", "Money and monetary aggregates"), c("rbi", "RBI"), c("monetary_policy", "Monetary policy"), c("banks", "Banking system"), c("npa", "NPAs and banking regulation"), c("financial_markets", "Financial markets"), c("digital_payments", "Digital payments")]),
    g("fiscal", "Public Finance", [c("taxation", "Taxation"), c("gst", "GST"), c("budget", "Union Budget"), c("deficit", "Fiscal deficit and public debt"), c("fiscal_federalism", "Fiscal federalism")]),
    g("rajasthan", "Rajasthan Economy", [c("state_gdp", "Rajasthan GSDP"), c("state_budget", "Rajasthan budget"), c("agriculture", "Agriculture and allied sectors"), c("industry", "Industry and MSMEs"), c("tourism", "Tourism economy"), c("infrastructure", "Infrastructure"), c("water_economy", "Water and drought economy"), c("welfare", "State welfare and development programmes")])
  ]),
  ...conceptNodes("ras", "prelims", "science", "Science, Technology & Digital", [
    g("physics", "Physics & Everyday Science", [c("mechanics", "Mechanics"), c("heat", "Heat and thermodynamics"), c("waves", "Waves and sound"), c("optics", "Optics"), c("electricity", "Electricity and magnetism"), c("nuclear", "Nuclear science")]),
    g("chemistry", "Chemistry", [c("atom", "Atomic structure"), c("bonding", "Chemical bonding"), c("acids", "Acids, bases and salts"), c("metals", "Metals and alloys"), c("polymers", "Polymers"), c("environmental_chem", "Environmental chemistry")]),
    g("biology", "Biology & Health", [c("cell", "Cell biology"), c("genetics", "Genetics and heredity"), c("human_systems", "Human body systems"), c("nutrition", "Nutrition and deficiency"), c("disease", "Communicable and non-communicable diseases"), c("immunity", "Immunity and vaccines"), c("biotech", "Biotechnology basics")]),
    g("digital", "IT, AI & Cybersecurity", [c("computer", "Computer fundamentals"), c("internet", "Internet and networking"), c("ai", "Artificial Intelligence and ML"), c("cyber", "Cybersecurity"), c("data", "Data and cloud computing"), c("digital_governance", "Digital governance")]),
    g("space", "Space & Emerging Technology", [c("isro", "Indian space programme"), c("satellites", "Satellites and applications"), c("quantum", "Quantum technology"), c("semiconductor", "Semiconductors"), c("drones", "Drones and unmanned systems")])
  ]),
  ...conceptNodes("ras", "prelims", "environment", "Environment & Ecology", [
    g("ecology", "Ecology", [c("ecosystem", "Ecosystems"), c("food_chain", "Food chains and food webs"), c("cycles", "Biogeochemical cycles"), c("succession", "Ecological succession"), c("population", "Population ecology")]),
    g("biodiversity", "Biodiversity & Conservation", [c("levels", "Levels of biodiversity"), c("hotspots", "Biodiversity hotspots"), c("protected", "Protected areas"), c("in_situ", "In-situ conservation"), c("ex_situ", "Ex-situ conservation"), c("wildlife_law", "Wildlife protection framework")]),
    g("pollution", "Pollution & Environmental Issues", [c("air", "Air pollution"), c("water", "Water pollution"), c("soil", "Soil pollution"), c("waste", "Waste management"), c("eutrophication", "Eutrophication"), c("noise", "Noise pollution")]),
    g("climate", "Climate Change", [c("ghg", "Greenhouse gases"), c("warming", "Global warming"), c("adaptation", "Climate adaptation"), c("mitigation", "Climate mitigation"), c("carbon_markets", "Carbon markets"), c("international", "International climate regime")]),
    g("rajasthan_env", "Rajasthan Environment", [c("aravalli", "Aravalli ecology"), c("desert_ecology", "Thar desert ecology"), c("wetlands", "Wetlands"), c("forest", "Forests and wildlife"), c("water_stress", "Water stress and drought")])
  ]),
  ...conceptNodes("ras", "prelims", "rajasthan", "Rajasthan History, Culture & Society", [
    g("history", "Rajasthan History", [c("ancient", "Ancient Rajasthan"), c("medieval", "Medieval Rajasthan"), c("rajput_states", "Rajput states and polity"), c("mewar", "Mewar"), c("marwar", "Marwar"), c("jaipur", "Jaipur and Dhundhar"), c("1857", "1857 in Rajasthan"), c("praja_mandal", "Praja Mandal movements"), c("integration", "Integration of Rajasthan")]),
    g("culture", "Art & Culture", [c("folk_music", "Folk music"), c("folk_dance", "Folk dances"), c("painting", "Painting schools"), c("architecture", "Forts, palaces and architecture"), c("handicrafts", "Handicrafts"), c("fairs", "Fairs and festivals"), c("literature", "Rajasthani literature")]),
    g("society", "Society & Tribal Life", [c("tribes", "Major tribes"), c("customs", "Customs and social practices"), c("women", "Women and social change"), c("rural", "Rural society"), c("cooperatives", "Cooperatives and community institutions")])
  ]),
  ...conceptNodes("ras", "prelims", "current", "Current Affairs", [
    g("national", "National Affairs", [c("government", "Government policies and schemes"), c("economy", "Economy and budget developments"), c("science", "Science and technology developments"), c("environment", "Environment and climate developments"), c("governance", "Governance and institutions")]),
    g("rajasthan", "Rajasthan Current Affairs", [c("schemes", "Rajasthan schemes and programmes"), c("budget", "Rajasthan budget and economy"), c("projects", "Major state projects"), c("awards", "State awards and appointments")]),
    g("international", "International Affairs", [c("organisations", "International organisations"), c("summits", "Major summits and agreements"), c("geopolitics", "Major geopolitical developments")])
  ])
];

const RAS_MAINS = [
  ...conceptNodes("ras", "mains", "gs1_history", "History, Art, Culture, Literature & Society", [
    g("culture", "Indian Culture", [c("architecture", "Architecture"), c("painting", "Painting"), c("performing", "Performing arts"), c("literature", "Literature and intellectual traditions")]),
    g("modern", "Modern Indian History", [c("18th", "18th century developments"), c("british", "British expansion and administration"), c("1857", "Revolt of 1857"), c("reforms", "Social reform"), c("nationalism", "Rise of nationalism"), c("gandhi", "Gandhian phase"), c("post_independence", "Post-independence consolidation")]),
    g("rajasthan", "Rajasthan History & Culture", [c("states", "Political history of Rajasthan"), c("movements", "Peasant and tribal movements"), c("praja", "Praja Mandal movement"), c("integration", "Integration of Rajasthan"), c("folk", "Folk culture"), c("literature", "Literature and language")]),
    g("society", "Indian Society", [c("diversity", "Salient features of Indian society"), c("women", "Role of women and women’s organisations"), c("population", "Population issues"), c("urbanisation", "Urbanisation and associated problems"), c("globalisation", "Effects of globalisation"), c("communalism", "Communalism, regionalism and secularism")])
  ]),
  ...conceptNodes("ras", "mains", "gs2_governance", "Governance, Constitution, Polity & Social Justice", [
    g("constitution", "Constitution & Polity", [c("features", "Constitutional features"), c("federalism", "Federalism"), c("parliament", "Parliament and state legislatures"), c("judiciary", "Judiciary"), c("constitutional_bodies", "Constitutional bodies"), c("local", "Local governance")]),
    g("governance", "Governance", [c("transparency", "Transparency and accountability"), c("e_governance", "E-governance"), c("citizen", "Citizen-centric administration"), c("civil_services", "Civil services"), c("social_audit", "Social audit")]),
    g("social_justice", "Social Justice", [c("health", "Health"), c("education", "Education"), c("poverty", "Poverty and hunger"), c("vulnerable", "Vulnerable sections"), c("welfare", "Welfare schemes"), c("rights", "Rights issues")]),
    g("rajasthan", "Rajasthan Governance", [c("administration", "State administration"), c("decentralisation", "Decentralisation"), c("state_schemes", "Major state schemes"), c("service_delivery", "Public service delivery")])
  ]),
  ...conceptNodes("ras", "mains", "gs3_economy", "Economy, Science, Technology, Environment & Security", [
    g("economy", "Economy", [c("growth", "Growth and development"), c("employment", "Employment"), c("agriculture", "Agriculture"), c("infrastructure", "Infrastructure"), c("budget", "Budgeting"), c("inclusive", "Inclusive growth")]),
    g("science", "Science & Technology", [c("space", "Space technology"), c("biotech", "Biotechnology"), c("ai", "AI and digital technology"), c("quantum", "Quantum and frontier technologies"), c("energy", "Energy technology")]),
    g("environment", "Environment & Disaster Management", [c("climate", "Climate change"), c("biodiversity", "Biodiversity"), c("pollution", "Pollution control"), c("disaster", "Disaster management"), c("water", "Water management")]),
    g("security", "Internal Security", [c("cyber", "Cybersecurity"), c("border", "Border management"), c("terrorism", "Terrorism and organised crime"), c("extremism", "Extremism"), c("security_agencies", "Security agencies")]),
    g("rajasthan", "Rajasthan Economy & Development", [c("industries", "Industries"), c("water", "Water resources"), c("agriculture", "Agriculture and irrigation"), c("tourism", "Tourism"), c("regional", "Regional disparities")])
  ]),
  ...conceptNodes("ras", "mains", "gs4_ethics", "Ethics, Integrity & Aptitude", [
    g("ethics", "Ethics & Human Interface", [c("values", "Essence of ethics"), c("determinants", "Determinants of ethical behaviour"), c("consequences", "Consequences of ethical action"), c("dimensions", "Dimensions of ethics in private and public life")]),
    g("attitude", "Attitude", [c("content", "Components of attitude"), c("function", "Influence on thought and behaviour"), c("persuasion", "Persuasion")]),
    g("integrity", "Integrity & Aptitude", [c("integrity", "Integrity"), c("impartiality", "Impartiality"), c("objectivity", "Objectivity"), c("empathy", "Empathy"), c("tolerance", "Tolerance"), c("compassion", "Compassion")]),
    g("public_service", "Public Service Values", [c("probity", "Probity in governance"), c("accountability", "Accountability"), c("transparency", "Transparency"), c("ethical_dilemma", "Ethical dilemmas"), c("code", "Codes of conduct and ethics")]),
    g("case_studies", "Case Studies", [c("administration", "Administrative dilemmas"), c("conflict", "Conflict of interest"), c("corruption", "Corruption and whistleblowing"), c("crisis", "Crisis decision-making")])
  ]),
  { exam:"ras", nodeId:"ras.mains.essay", parentId:"", level:"subject", title:"Essay", description:"", },
  ...["Society & governance","Economy & development","Science & technology","Environment & climate","Security & disaster management","Ethics & philosophy","Rajasthan-specific themes","Contemporary national issues"].map((title,i)=>({ exam:"ras", nodeId:`ras.mains.essay.topic_${i+1}`, parentId:"ras.mains.essay", level:"concept", title, description:"" }))
];

const UPSC_PRELIMS = [
  ...conceptNodes("upsc", "prelims", "gs1_history", "History & Culture", [
    g("ancient", "Ancient & Medieval India", [c("prehistory", "Prehistory"), c("indus", "Indus Valley Civilization"), c("vedic", "Vedic age"), c("mahajanapadas", "Mahajanapadas"), c("buddhism", "Buddhism and Jainism"), c("maurya", "Mauryan Empire"), c("gupta", "Gupta Empire"), c("south", "Southern kingdoms"), c("sultanate", "Delhi Sultanate"), c("mughal", "Mughal Empire"), c("bhakti", "Bhakti and Sufi traditions")]),
    g("modern", "Modern India", [c("europeans", "European penetration"), c("british", "British expansion"), c("revolt", "Revolt of 1857"), c("reform", "Social reform movements"), c("congress", "National movement"), c("gandhi", "Gandhian phase"), c("constitutional", "Constitutional developments")]),
    g("culture", "Indian Culture", [c("architecture", "Architecture"), c("sculpture", "Sculpture"), c("painting", "Painting"), c("music", "Music"), c("dance", "Dance"), c("literature", "Literature"), c("heritage", "Heritage")])
  ]),
  ...conceptNodes("upsc", "prelims", "gs1_geography", "Indian & World Geography", [
    g("physical", "Physical Geography", [c("geomorphology", "Geomorphology"), c("climatology", "Climatology"), c("oceanography", "Oceanography"), c("biogeography", "Biogeography")]),
    g("india", "Indian Geography", [c("physiography", "Physiography"), c("rivers", "Rivers and drainage"), c("monsoon", "Monsoon"), c("soils", "Soils"), c("agriculture", "Agriculture"), c("minerals", "Minerals"), c("industry", "Industries"), c("population", "Population")]),
    g("world", "World Geography", [c("resources", "World resources"), c("industries", "World industrial regions"), c("hazards", "Geophysical phenomena"), c("mapping", "Map-based geography")])
  ]),
  ...conceptNodes("upsc", "prelims", "polity", "Indian Polity & Governance", [
    g("constitution", "Constitution", [c("making", "Making of Constitution"), c("features", "Features"), c("preamble", "Preamble"), c("rights", "Fundamental Rights"), c("dpsp", "DPSP"), c("duties", "Fundamental Duties"), c("amendments", "Amendment"), c("basic_structure", "Basic structure")]),
    g("institutions", "Institutions", [c("president", "President"), c("parliament", "Parliament"), c("supreme_court", "Supreme Court"), c("governor", "Governor"), c("state", "State legislature"), c("local", "Local government")]),
    g("bodies", "Constitutional & Statutory Bodies", [c("ec", "Election Commission"), c("cag", "CAG"), c("upsc", "UPSC"), c("finance_commission", "Finance Commission"), c("nhrc", "NHRC"), c("lokpal", "Lokpal")]),
    g("governance", "Governance", [c("rtI", "RTI"), c("e_governance", "E-governance"), c("citizen_charter", "Citizen charters"), c("social_audit", "Social audit")])
  ]),
  ...conceptNodes("upsc", "prelims", "economy", "Economic & Social Development", [
    g("macro", "Macroeconomics", [c("national_income", "National income"), c("inflation", "Inflation"), c("growth", "Growth"), c("unemployment", "Unemployment"), c("poverty", "Poverty")]),
    g("banking", "Banking & Finance", [c("rbi", "RBI"), c("monetary_policy", "Monetary policy"), c("banks", "Banking"), c("markets", "Financial markets"), c("digital", "Digital payments")]),
    g("fiscal", "Public Finance", [c("tax", "Taxation"), c("gst", "GST"), c("budget", "Budget"), c("deficit", "Fiscal deficit")]),
    g("social", "Social Development", [c("health", "Health"), c("education", "Education"), c("demography", "Demography"), c("inclusion", "Inclusion"), c("schemes", "Government schemes")])
  ]),
  ...conceptNodes("upsc", "prelims", "environment", "Environment & Ecology", [
    g("ecology", "Ecology", [c("ecosystem", "Ecosystem"), c("food_web", "Food web"), c("cycles", "Biogeochemical cycles"), c("succession", "Succession")]),
    g("biodiversity", "Biodiversity", [c("hotspots", "Hotspots"), c("species", "Threatened species"), c("protected", "Protected areas"), c("conservation", "Conservation approaches")]),
    g("climate", "Climate Change", [c("ghg", "Greenhouse gases"), c("impacts", "Climate impacts"), c("adaptation", "Adaptation"), c("mitigation", "Mitigation"), c("agreements", "Climate agreements")]),
    g("pollution", "Pollution & Waste", [c("air", "Air pollution"), c("water", "Water pollution"), c("solid", "Solid waste"), c("hazardous", "Hazardous waste"), c("plastic", "Plastic pollution")])
  ]),
  ...conceptNodes("upsc", "prelims", "science", "Science & Technology", [
    g("biology", "Biology", [c("cell", "Cell biology"), c("genetics", "Genetics"), c("disease", "Disease and immunity"), c("biotech", "Biotechnology")]),
    g("physics", "Physics & Space", [c("energy", "Energy"), c("waves", "Waves"), c("electromagnetism", "Electromagnetism"), c("nuclear", "Nuclear science"), c("space", "Space science")]),
    g("digital", "Digital Technology", [c("computing", "Computing"), c("ai", "Artificial intelligence"), c("cyber", "Cybersecurity"), c("quantum", "Quantum technology"), c("semiconductors", "Semiconductors")])
  ]),
  ...conceptNodes("upsc", "prelims", "csat", "CSAT", [
    g("comprehension", "Comprehension", [c("passages", "Reading comprehension"), c("inference", "Inference"), c("main_idea", "Main idea"), c("tone", "Tone and intent")]),
    g("reasoning", "Logical Reasoning", [c("arrangements", "Arrangements"), c("syllogism", "Syllogism"), c("statement", "Statements and conclusions"), c("data_sufficiency", "Data sufficiency")]),
    g("quant", "Basic Numeracy", [c("arithmetic", "Arithmetic"), c("percentages", "Percentages"), c("ratio", "Ratio and proportion"), c("average", "Average"), c("time_work", "Time and work"), c("data_interpretation", "Data interpretation")])
  ])
];

const UPSC_MAINS = [
  ...conceptNodes("upsc", "mains", "gs1", "GS Paper I — Heritage, History, Society & Geography", [
    g("heritage", "Indian Heritage & Culture", [c("architecture", "Indian architecture"), c("painting", "Indian painting"), c("literature", "Indian literature"), c("performing", "Performing arts")]),
    g("history", "History", [c("18th", "18th century"), c("british", "British consolidation"), c("revolt", "1857"), c("reforms", "Social and religious reform"), c("nationalism", "National movement"), c("world", "World history"), c("post1947", "Post-independence consolidation")]),
    g("society", "Indian Society", [c("diversity", "Diversity"), c("women", "Women"), c("population", "Population"), c("urbanisation", "Urbanisation"), c("globalisation", "Globalisation"), c("communalism", "Communalism and secularism")]),
    g("geography", "Geography", [c("resources", "Resources"), c("physical", "Physical geography"), c("hazards", "Geophysical phenomena"), c("distribution", "Resource distribution"), c("industrial", "Industrial location")])
  ]),
  ...conceptNodes("upsc", "mains", "gs2", "GS Paper II — Governance, Constitution, Polity & IR", [
    g("polity", "Constitution & Polity", [c("constitution", "Constitutional framework"), c("federalism", "Federalism"), c("separation", "Separation of powers"), c("parliament", "Parliament"), c("judiciary", "Judiciary"), c("local", "Local bodies"), c("constitutional_bodies", "Constitutional bodies")]),
    g("governance", "Governance", [c("transparency", "Transparency"), c("accountability", "Accountability"), c("e_governance", "E-governance"), c("civil_services", "Civil services"), c("citizen", "Citizen-centric governance")]),
    g("social_justice", "Social Justice", [c("health", "Health"), c("education", "Education"), c("poverty", "Poverty and hunger"), c("vulnerable", "Vulnerable sections"), c("welfare", "Welfare schemes")]),
    g("ir", "International Relations", [c("neighbours", "India and neighbours"), c("bilateral", "Bilateral relations"), c("groupings", "International groupings"), c("global_institutions", "Global institutions"), c("diaspora", "Diaspora")])
  ]),
  ...conceptNodes("upsc", "mains", "gs3", "GS Paper III — Economy, Technology, Environment, Security & Disaster Management", [
    g("economy", "Indian Economy", [c("growth", "Growth and development"), c("employment", "Employment"), c("agriculture", "Agriculture"), c("food_processing", "Food processing"), c("infrastructure", "Infrastructure"), c("investment", "Investment models"), c("inclusive", "Inclusive growth")]),
    g("science", "Science & Technology", [c("ai", "AI"), c("space", "Space"), c("biotech", "Biotechnology"), c("nanotech", "Nanotechnology"), c("quantum", "Quantum technology"), c("indigenisation", "Indigenisation of technology")]),
    g("environment", "Environment", [c("conservation", "Conservation"), c("climate", "Climate change"), c("pollution", "Pollution"), c("impact", "Environmental impact assessment"), c("sustainable", "Sustainable development")]),
    g("security", "Security", [c("internal", "Internal security"), c("cyber", "Cybersecurity"), c("terrorism", "Terrorism"), c("border", "Border management"), c("organised_crime", "Organised crime")]),
    g("disaster", "Disaster Management", [c("risk", "Disaster risk"), c("mitigation", "Mitigation"), c("preparedness", "Preparedness"), c("response", "Response"), c("recovery", "Recovery")])
  ]),
  ...conceptNodes("upsc", "mains", "gs4", "GS Paper IV — Ethics, Integrity & Aptitude", [
    g("ethics", "Ethics & Human Values", [c("ethics", "Essence of ethics"), c("values", "Human values"), c("determinants", "Ethical determinants"), c("consequences", "Ethical consequences")]),
    g("attitude", "Attitude", [c("components", "Components of attitude"), c("function", "Functions"), c("influence", "Influence on thought and behaviour"), c("persuasion", "Persuasion")]),
    g("civil_service", "Civil Service Values", [c("integrity", "Integrity"), c("impartiality", "Impartiality"), c("objectivity", "Objectivity"), c("dedication", "Dedication to public service"), c("empathy", "Empathy"), c("compassion", "Compassion")]),
    g("governance", "Probity & Ethics in Governance", [c("accountability", "Accountability"), c("transparency", "Transparency"), c("corruption", "Corruption"), c("code", "Codes of ethics and conduct"), c("whistleblowing", "Whistleblowing"), c("conflict", "Conflict of interest")]),
    g("case", "Case Studies", [c("dilemmas", "Administrative dilemmas"), c("resource", "Resource allocation"), c("crisis", "Crisis ethics"), c("stakeholders", "Stakeholder balancing")])
  ]),
  { exam:"upsc", nodeId:"upsc.mains.essay", parentId:"", level:"subject", title:"Essay", description:"" },
  ...["Philosophical themes","Society and democracy","Governance and public policy","Economy and development","Science and technology","Environment and climate","International relations","Ethics and public life"].map((title,i)=>({ exam:"upsc", nodeId:`upsc.mains.essay.topic_${i+1}`, parentId:"upsc.mains.essay", level:"concept", title, description:"" }))
];

const SSC = [
  ...conceptNodes("ssc_cgl", "tier1", "reasoning", "General Intelligence & Reasoning", [g("verbal", "Verbal Reasoning", [c("analogy", "Analogy"), c("classification", "Classification"), c("series", "Series"), c("coding", "Coding-decoding"), c("syllogism", "Syllogism")]), g("nonverbal", "Non-verbal Reasoning", [c("figures", "Figural analogy"), c("folding", "Paper folding"), c("embedded", "Embedded figures"), c("mirror", "Mirror and water images")]), g("logic", "Analytical Reasoning", [c("statement", "Statement-conclusion"), c("problem", "Problem solving"), c("venn", "Venn diagrams"), c("critical", "Critical thinking")])]),
  ...conceptNodes("ssc_cgl", "tier1", "gk", "General Awareness", [g("history", "History", [c("ancient", "Ancient"), c("medieval", "Medieval"), c("modern", "Modern India"), c("world", "World history")]), g("polity", "Polity", [c("constitution", "Constitution"), c("parliament", "Parliament"), c("judiciary", "Judiciary"), c("governance", "Governance")]), g("geography", "Geography", [c("physical", "Physical geography"), c("india", "Indian geography"), c("world", "World geography")]), g("science", "Science", [c("physics", "Physics"), c("chemistry", "Chemistry"), c("biology", "Biology")]), g("current", "Current Affairs", [c("national", "National"), c("international", "International"), c("awards", "Awards and appointments")])]),
  ...conceptNodes("ssc_cgl", "tier1", "quant", "Quantitative Aptitude", [g("arithmetic", "Arithmetic", [c("percent", "Percentage"), c("profit", "Profit and loss"), c("ratio", "Ratio and proportion"), c("average", "Average"), c("time_work", "Time and work"), c("time_distance", "Time and distance"), c("interest", "Simple and compound interest")]), g("algebra", "Algebra", [c("identities", "Algebraic identities"), c("equations", "Linear equations"), c("surds", "Surds and indices")]), g("geometry", "Geometry & Mensuration", [c("triangles", "Triangles"), c("circles", "Circles"), c("mensuration", "Mensuration"), c("trigonometry", "Trigonometry")]), g("data", "Statistics & Data Interpretation", [c("tables", "Tables and graphs"), c("central", "Central tendency"), c("probability", "Probability")])]),
  ...conceptNodes("ssc_cgl", "tier1", "english", "English Comprehension", [g("vocab", "Vocabulary", [c("synonyms", "Synonyms"), c("antonyms", "Antonyms"), c("idioms", "Idioms and phrases"), c("one_word", "One-word substitution")]), g("grammar", "Grammar", [c("error", "Spot the error"), c("fill", "Fill in the blanks"), c("voice", "Active/passive"), c("narration", "Direct/indirect speech")]), g("comprehension", "Comprehension", [c("passage", "Reading passage"), c("cloze", "Cloze test")])])
];

const BANKING = [
  ...conceptNodes("banking", "prelims", "english", "English Language", [g("grammar", "Grammar", [c("error", "Error spotting"), c("fill", "Fillers"), c("sentence", "Sentence correction")]), g("vocab", "Vocabulary", [c("synonyms", "Synonyms and antonyms"), c("idioms", "Idioms"), c("usage", "Usage")]), g("reading", "Reading Comprehension", [c("passage", "Passage comprehension"), c("cloze", "Cloze test")])]),
  ...conceptNodes("banking", "prelims", "quant", "Quantitative Aptitude", [g("arithmetic", "Arithmetic", [c("percent", "Percentages"), c("ratio", "Ratio"), c("average", "Average"), c("profit", "Profit and loss"), c("time", "Time and work"), c("distance", "Time, speed and distance")]), g("number", "Number System", [c("simplification", "Simplification"), c("series", "Number series"), c("quadratic", "Quadratic equations")]), g("di", "Data Interpretation", [c("table", "Tables"), c("bar", "Bar graphs"), c("pie", "Pie charts"), c("caselet", "Caselets")])]),
  ...conceptNodes("banking", "prelims", "reasoning", "Reasoning Ability", [g("logical", "Logical Reasoning", [c("syllogism", "Syllogism"), c("inequality", "Inequality"), c("coding", "Coding-decoding"), c("direction", "Direction sense")]), g("puzzles", "Puzzles & Seating", [c("linear", "Linear seating"), c("circular", "Circular seating"), c("floor", "Floor puzzles"), c("scheduling", "Scheduling")])]),
  ...conceptNodes("banking", "mains", "awareness", "Banking & Financial Awareness", [g("banking", "Banking System", [c("rbi", "RBI"), c("monetary", "Monetary policy"), c("banks", "Banking institutions"), c("npa", "NPAs")]), g("economy", "Economy", [c("budget", "Budget"), c("inflation", "Inflation"), c("growth", "Growth"), c("fiscal", "Fiscal policy")]), g("current", "Current Banking Affairs", [c("schemes", "Government schemes"), c("appointments", "Appointments"), c("reports", "Reports and indices")])])
];

const POLICE = [
  ...conceptNodes("police", "written", "gk", "General Knowledge & Current Affairs", [g("india", "India", [c("history", "History"), c("polity", "Polity"), c("geography", "Geography"), c("economy", "Economy"), c("science", "Science")]), g("rajasthan", "Rajasthan", [c("history", "Rajasthan history"), c("culture", "Rajasthan culture"), c("geography", "Rajasthan geography"), c("economy", "Rajasthan economy")]), g("current", "Current Affairs", [c("national", "National"), c("state", "State"), c("international", "International")])]),
  ...conceptNodes("police", "written", "reasoning", "Reasoning & Mental Ability", [g("verbal", "Verbal Reasoning", [c("analogy", "Analogy"), c("series", "Series"), c("coding", "Coding"), c("classification", "Classification")]), g("analytical", "Analytical Reasoning", [c("syllogism", "Syllogism"), c("statement", "Statements and conclusions"), c("blood", "Blood relations"), c("directions", "Directions")])]),
  ...conceptNodes("police", "written", "law", "Law & Constitution", [g("constitution", "Constitution", [c("rights", "Fundamental Rights"), c("dpsp", "DPSP"), c("duties", "Fundamental Duties"), c("federalism", "Federalism")]), g("criminal_law", "Criminal Law", [c("offences", "General principles of offences"), c("evidence", "Evidence basics"), c("procedure", "Criminal procedure basics"), c("juvenile", "Juvenile justice")]), g("policing", "Police Administration", [c("investigation", "Investigation basics"), c("forensics", "Forensic basics"), c("human_rights", "Human rights in policing")])]),
  ...conceptNodes("police", "written", "quant", "Quantitative Aptitude", [g("arithmetic", "Arithmetic", [c("percent", "Percentage"), c("ratio", "Ratio"), c("average", "Average"), c("profit", "Profit and loss"), c("time", "Time and work"), c("distance", "Time and distance")])]),
  ...conceptNodes("police", "written", "technical", "Technical / Computer Knowledge", [g("computer", "Computer Fundamentals", [c("hardware", "Hardware"), c("software", "Software"), c("os", "Operating systems"), c("network", "Networking")]), g("cyber", "Cybersecurity", [c("threats", "Cyber threats"), c("phishing", "Phishing"), c("malware", "Malware"), c("digital_evidence", "Digital evidence basics")]), g("telecom", "Telecommunication Basics", [c("signals", "Signals"), c("modulation", "Modulation"), c("radio", "Radio communication"), c("wireless", "Wireless networks")])])
];

export const PREDEFINED_SYLLABUS = [...RAS_PRELIMS, ...RAS_MAINS, ...UPSC_PRELIMS, ...UPSC_MAINS, ...SSC, ...BANKING, ...POLICE];
export const SYLLABUS_META = {
  ras: { label: "RAS", stages: ["Prelims", "Mains"] },
  upsc: { label: "UPSC CSE", stages: ["Prelims", "Mains"] },
  ssc_cgl: { label: "SSC CGL", stages: ["Tier I"] },
  banking: { label: "Banking", stages: ["Prelims", "Mains"] },
  police: { label: "Police SI", stages: ["Written"] }
};
