const c=(id,en,hi)=>({id,title:`${en} / ${hi}`,description:""});
const g=(id,en,hi,concepts)=>({id,title:`${en} / ${hi}`,concepts});
const nodes=(subjectId,en,hi,groups)=>{
 const subjectNodeId=`neet.ug.${subjectId}`;
 const subject={exam:"neet",nodeId:subjectNodeId,parentId:"",level:"subject",title:`${en} / ${hi}`,description:""};
 const out=[subject];
 for(const group of groups){
  const topicId=`${subjectNodeId}.${group.id}`;
  out.push({exam:"neet",nodeId:topicId,parentId:subjectNodeId,level:"topic",title:group.title,description:""});
  for(const concept of group.concepts) out.push({exam:"neet",nodeId:`${topicId}.${concept.id}`,parentId:topicId,level:"concept",title:concept.title,description:concept.description||""});
 }
 return out;
};

export const NEET_SYLLABUS=[
 ...nodes("physics","Physics","भौतिकी",[
  g("units","Units & Measurements","इकाइयाँ एवं मापन",[c("units_dimensions","Units, dimensions & dimensional analysis","इकाइयाँ, विमाएँ एवं विमीय विश्लेषण"),c("errors","Errors & significant figures","त्रुटियाँ एवं सार्थक अंक"),c("vectors","Vectors & basic mathematics","सदिश एवं मूल गणित")]),
  g("kinematics","Kinematics","गतिकी",[c("motion_1d","Motion in one dimension","एक विमीय गति"),c("motion_2d","Motion in two dimensions","द्विविमीय गति"),c("projectile","Projectile motion","प्रक्षेप्य गति"),c("relative_motion","Relative motion","सापेक्ष गति")]),
  g("laws","Laws of Motion","गति के नियम",[c("newton","Newton's laws","न्यूटन के गति नियम"),c("friction","Friction","घर्षण"),c("circular","Circular motion","वृत्तीय गति"),c("momentum","Momentum & impulse","संवेग एवं आवेग")]),
  g("work_energy","Work, Energy & Power","कार्य, ऊर्जा एवं शक्ति",[c("work","Work and variable force","कार्य एवं परिवर्ती बल"),c("energy","Kinetic and potential energy","गतिज एवं स्थितिज ऊर्जा"),c("conservation","Conservation of energy","ऊर्जा संरक्षण"),c("power","Power","शक्ति")]),
  g("rotation","Rotational Motion","घूर्णन गति",[c("centre_mass","Centre of mass","द्रव्यमान केंद्र"),c("moment_inertia","Moment of inertia","जड़त्व आघूर्ण"),c("torque","Torque and angular momentum","बल आघूर्ण एवं कोणीय संवेग"),c("rolling","Rolling motion","लुढ़कने की गति")]),
  g("gravitation","Gravitation","गुरुत्वाकर्षण",[c("gravitation_law","Universal law of gravitation","सार्वत्रिक गुरुत्वाकर्षण नियम"),c("potential","Gravitational potential & energy","गुरुत्वीय विभव एवं ऊर्जा"),c("satellites","Satellites and escape velocity","उपग्रह एवं पलायन वेग")]),
  g("properties","Properties of Matter & Fluids","पदार्थ एवं द्रवों के गुण",[c("elasticity","Elasticity","प्रत्यास्थता"),c("fluids","Fluid pressure and flow","द्रव दाब एवं प्रवाह"),c("surface_tension","Surface tension","पृष्ठ तनाव"),c("viscosity","Viscosity","श्यानता")]),
  g("thermo","Thermodynamics & Kinetic Theory","ऊष्मागतिकी एवं गतिज सिद्धांत",[c("temperature","Thermal properties","तापीय गुण"),c("laws_thermo","Laws of thermodynamics","ऊष्मागतिकी के नियम"),c("heat_engines","Heat engines and refrigerators","ऊष्मा इंजन एवं रेफ्रिजरेटर"),c("kinetic_gas","Kinetic theory of gases","गैसों का गतिज सिद्धांत")]),
  g("oscillations","Oscillations & Waves","दोलन एवं तरंगें",[c("shm","Simple harmonic motion","सरल आवर्त गति"),c("waves","Progressive waves","प्रगामी तरंगें"),c("standing","Standing waves","स्थिर तरंगें"),c("sound","Sound waves","ध्वनि तरंगें")]),
  g("electrostatics","Electrostatics","स्थिरवैद्युतिकी",[c("charge","Electric charge & field","वैद्युत आवेश एवं क्षेत्र"),c("potential","Potential and capacitance","विभव एवं धारिता"),c("capacitor","Capacitors and dielectrics","संधारित्र एवं परावैद्युत")]),
  g("current","Current Electricity","धारा विद्युत",[c("current","Current and drift","विद्युत धारा एवं अपवाह"),c("resistance","Resistance and networks","प्रतिरोध एवं नेटवर्क"),c("kirchhoff","Kirchhoff laws","किर्चॉफ के नियम"),c("instruments","Electrical instruments","वैद्युत उपकरण")]),
  g("magnetism","Magnetism & Moving Charges","चुंबकत्व एवं गतिमान आवेश",[c("force_charge","Force on moving charge","गतिमान आवेश पर बल"),c("biot_savart","Biot-Savart law","बायो-सावर्ट नियम"),c("ampere","Ampere law","एम्पियर का नियम"),c("magnetic_materials","Magnetic materials","चुंबकीय पदार्थ")]),
  g("emi","Electromagnetic Induction & AC","वैद्युतचुंबकीय प्रेरण एवं प्रत्यावर्ती धारा",[c("faraday","Faraday and Lenz laws","फैराडे एवं लेंज नियम"),c("inductance","Inductance","प्रेरकत्व"),c("ac","Alternating current","प्रत्यावर्ती धारा"),c("transformer","Transformer and power transmission","ट्रांसफॉर्मर एवं शक्ति संचरण")]),
  g("em_waves","Electromagnetic Waves","वैद्युतचुंबकीय तरंगें",[c("spectrum","EM spectrum","वैद्युतचुंबकीय स्पेक्ट्रम"),c("properties","Properties and applications","गुण एवं अनुप्रयोग")]),
  g("optics","Optics","प्रकाशिकी",[c("ray","Ray optics","किरण प्रकाशिकी"),c("wave_optics","Wave optics","तरंग प्रकाशिकी"),c("interference","Interference and diffraction","व्यतिकरण एवं विवर्तन"),c("polarization","Polarisation","ध्रुवण")]),
  g("modern","Modern Physics","आधुनिक भौतिकी",[c("photoelectric","Dual nature & photoelectric effect","द्वैत प्रकृति एवं प्रकाशवैद्युत प्रभाव"),c("atoms","Atoms","परमाणु"),c("nuclei","Nuclei and radioactivity","नाभिक एवं रेडियोधर्मिता"),c("semiconductor","Semiconductors and electronics","अर्धचालक एवं इलेक्ट्रॉनिक्स")])
 ]),
 ...nodes("chemistry","Chemistry","रसायन विज्ञान",[
  g("basic","Some Basic Concepts","मूलभूत अवधारणाएँ",[c("mole","Mole concept & stoichiometry","मोल अवधारणा एवं स्टॉइकियोमेट्री"),c("atomic_mass","Atomic and molecular masses","परमाणु एवं आणविक द्रव्यमान"),c("concentration","Concentration terms","सांद्रता की संकल्पनाएँ")]),
  g("atom","Atomic Structure","परमाणु संरचना",[c("models","Atomic models","परमाणु मॉडल"),c("quantum","Quantum numbers","क्वांटम संख्याएँ"),c("configuration","Electronic configuration","इलेक्ट्रॉनिक विन्यास")]),
  g("periodic","Classification & Periodicity","तत्वों का वर्गीकरण एवं आवर्तिता",[c("periodic_table","Periodic table","आवर्त सारणी"),c("periodic_trends","Periodic trends","आवर्त प्रवृत्तियाँ")]),
  g("bonding","Chemical Bonding","रासायनिक आबंधन",[c("ionic","Ionic bonding","आयनिक आबंधन"),c("covalent","Covalent bonding","सहसंयोजक आबंधन"),c("vsepr","VSEPR and hybridisation","VSEPR एवं संकरण"),c("molecular","Molecular orbital basics","आणविक कक्षक की मूल बातें")]),
  g("thermo","Thermodynamics","ऊष्मागतिकी",[c("enthalpy","Enthalpy and Hess law","एन्थैल्पी एवं हेस नियम"),c("entropy","Entropy and spontaneity","एंट्रॉपी एवं स्वतःस्फूर्तता"),c("gibbs","Gibbs energy","गिब्स ऊर्जा")]),
  g("equilibrium","Equilibrium","साम्यावस्था",[c("chemical","Chemical equilibrium","रासायनिक साम्य"),c("ionic","Ionic equilibrium","आयनिक साम्य"),c("ph","pH and buffers","pH एवं बफर"),c("solubility","Solubility equilibria","विलेयता साम्य")]),
  g("redox","Redox & Electrochemistry","रेडॉक्स एवं वैद्युत रसायन",[c("redox","Oxidation-reduction","ऑक्सीकरण-अपचयन"),c("cells","Galvanic and electrolytic cells","गैल्वेनिक एवं विद्युत अपघटनी सेल"),c("nernst","Nernst equation","नर्न्स्ट समीकरण")]),
  g("kinetics","Chemical Kinetics","रासायनिक बलगतिकी",[c("rate","Rate law","वेग नियम"),c("order","Order and molecularity","कोटि एवं आणविकता"),c("activation","Activation energy","सक्रियण ऊर्जा")]),
  g("solutions","Solutions","विलयन",[c("concentration","Concentration and solubility","सांद्रता एवं विलेयता"),c("colligative","Colligative properties","अणुसंख्य गुणधर्म")]),
  g("inorganic","Inorganic Chemistry","अकार्बनिक रसायन",[c("hydrogen","Hydrogen","हाइड्रोजन"),c("s_block","s-block elements","s-ब्लॉक तत्व"),c("p_block","p-block elements","p-ब्लॉक तत्व"),c("d_f_block","d- and f-block elements","d- एवं f-ब्लॉक तत्व"),c("coordination","Coordination compounds","उपसहसंयोजन यौगिक"),c("metallurgy","Principles of extraction","धातु निष्कर्षण के सिद्धांत")]),
  g("organic","Organic Chemistry Basics","कार्बनिक रसायन की मूल बातें",[c("purification","Purification and characterisation","शुद्धीकरण एवं अभिलक्षणन"),c("goc","General organic chemistry","सामान्य कार्बनिक रसायन"),c("isomerism","Isomerism","समावयवता"),c("mechanisms","Reaction mechanisms","अभिक्रिया क्रियाविधि")]),
  g("hydrocarbons","Hydrocarbons","हाइड्रोकार्बन",[c("alkanes","Alkanes","अल्केन"),c("alkenes","Alkenes","अल्कीन"),c("alkynes","Alkynes","अल्काइन"),c("aromatic","Aromatic hydrocarbons","एरोमैटिक हाइड्रोकार्बन")]),
  g("functional","Organic Functional Groups","कार्बनिक क्रियात्मक समूह",[c("halides","Haloalkanes and haloarenes","हैलोऐल्केन एवं हैलोऐरीन"),c("alcohols","Alcohols, phenols and ethers","ऐल्कोहॉल, फीनॉल एवं ईथर"),c("carbonyl","Aldehydes and ketones","ऐल्डिहाइड एवं कीटोन"),c("acids","Carboxylic acids","कार्बोक्सिलिक अम्ल"),c("amines","Amines","ऐमीन")]),
  g("biomolecules","Biomolecules & Practical Chemistry","जैव-अणु एवं प्रायोगिक रसायन",[c("biomolecules","Biomolecules","जैव-अणु"),c("polymers","Polymers","बहुलक"),c("chemistry_daily","Chemistry in everyday life","दैनिक जीवन में रसायन"),c("practical","Practical principles","प्रायोगिक रसायन के सिद्धांत")])
 ]),
 ...nodes("biology","Biology","जीव विज्ञान",[
  g("diversity","Diversity in Living World","जीव जगत में विविधता",[c("living","What is living","जीवित जगत"),c("classification","Biological classification","जैविक वर्गीकरण"),c("plant_groups","Plant kingdom","पादप जगत"),c("animal_groups","Animal kingdom","जंतु जगत")]),
  g("structural","Structural Organisation","संरचनात्मक संगठन",[c("morphology","Morphology of flowering plants","पुष्पी पादपों की आकारिकी"),c("anatomy","Anatomy of flowering plants","पुष्पी पादपों की आंतरिक संरचना"),c("animal_tissues","Structural organisation in animals","जंतुओं में संरचनात्मक संगठन")]),
  g("cell","Cell Structure & Function","कोशिका संरचना एवं कार्य",[c("cell_unit","Cell as the unit of life","जीवन की इकाई के रूप में कोशिका"),c("biomolecules","Biomolecules","जैव-अणु"),c("cell_cycle","Cell cycle and division","कोशिका चक्र एवं विभाजन"),c("membrane","Membrane transport","झिल्ली परिवहन")]),
  g("plant","Plant Physiology","पादप शरीर क्रिया विज्ञान",[c("transport","Transport in plants","पादपों में परिवहन"),c("mineral","Mineral nutrition","खनिज पोषण"),c("photosynthesis","Photosynthesis","प्रकाश संश्लेषण"),c("respiration","Respiration in plants","पादपों में श्वसन"),c("growth","Plant growth and development","पादप वृद्धि एवं विकास")]),
  g("human","Human Physiology","मानव शरीर क्रिया विज्ञान",[c("digestion","Digestion and absorption","पाचन एवं अवशोषण"),c("breathing","Breathing and exchange of gases","श्वसन एवं गैसों का विनिमय"),c("circulation","Body fluids and circulation","शरीर द्रव एवं परिसंचरण"),c("excretion","Excretory products","उत्सर्जी उत्पाद एवं निष्कासन"),c("locomotion","Locomotion and movement","गमन एवं संचलन"),c("neural","Neural control","तंत्रिका नियंत्रण"),c("chemical_coord","Chemical coordination","रासायनिक समन्वय")]),
  g("reproduction","Reproduction","प्रजनन",[c("flowering","Sexual reproduction in flowering plants","पुष्पी पादपों में लैंगिक प्रजनन"),c("human_repro","Human reproduction","मानव प्रजनन"),c("reproductive_health","Reproductive health","प्रजनन स्वास्थ्य")]),
  g("genetics","Genetics & Evolution","आनुवंशिकी एवं विकास",[c("inheritance","Principles of inheritance","वंशागति के सिद्धांत"),c("molecular","Molecular basis of inheritance","वंशागति का आणविक आधार"),c("evolution","Evolution","विकास"),c("population","Population genetics basics","समष्टि आनुवंशिकी की मूल बातें")]),
  g("biology_human_welfare","Biology & Human Welfare","जीव विज्ञान एवं मानव कल्याण",[c("health","Human health and disease","मानव स्वास्थ्य एवं रोग"),c("immunity","Immunity and vaccines","प्रतिरक्षा एवं टीके"),c("microbes","Microbes in human welfare","मानव कल्याण में सूक्ष्मजीव")]),
  g("biotech","Biotechnology & Applications","जैव प्रौद्योगिकी एवं अनुप्रयोग",[c("principles","Biotechnology principles","जैव प्रौद्योगिकी के सिद्धांत"),c("processes","Biotechnological processes","जैव प्रौद्योगिकीय प्रक्रियाएँ"),c("applications","Biotechnology applications","जैव प्रौद्योगिकी के अनुप्रयोग")]),
  g("ecology","Ecology & Environment","पारिस्थितिकी एवं पर्यावरण",[c("organisms","Organisms and populations","जीव एवं समष्टियाँ"),c("ecosystem","Ecosystem","पारितंत्र"),c("biodiversity","Biodiversity and conservation","जैव विविधता एवं संरक्षण"),c("environmental","Environmental issues","पर्यावरणीय मुद्दे")])
 ])
];

export const NEET_SYLLABUS_META={neet:{label:"NEET (UG) — English / हिन्दी",description:"Bilingual concept-level syllabus for Physics, Chemistry and Biology."}};
