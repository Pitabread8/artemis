import fs from 'node:fs';
import path from 'node:path';

export const contractorStyles: Record<string, { color: string; mergedInto?: string }> = {
  'Northrop Grumman': { color: '#f5df2e' },
  Boeing: { color: '#02a9df' },
  'Lockheed Martin': { color: '#16a35f' },
  'Aerojet Rocketdyne': { color: '#e76f33' },
  'Teledyne Brown Engineering': { color: '#d82f84' },
  IBM: { color: '#6a4cff' },
  'Lockheed Propulsion Co.': { color: '#7acb98', mergedInto: 'Lockheed Martin' },
  'North American Aviation': { color: '#8ad5f2', mergedInto: 'Boeing' },
  'Douglas Aircraft': { color: '#63c5ea', mergedInto: 'Boeing' },
  Rocketdyne: { color: '#f2a56e', mergedInto: 'Aerojet Rocketdyne' },
};

const contractorKeyOrder = [
  'Northrop Grumman', 'Boeing', 'North American Aviation', 'Douglas Aircraft',
  'Lockheed Martin', 'Lockheed Propulsion Co.', 'Aerojet Rocketdyne', 'Rocketdyne',
  'Teledyne Brown Engineering', 'IBM',
];

export const contractorKey: {
  name: string; color: string; mergedInto?: string;
  children: { name: string; color: string; mergedInto?: string }[];
}[] = contractorKeyOrder.reduce((groups: any[], name) => {
  const item = { name, ...contractorStyles[name] };
  if (item.mergedInto) {
    const parent = groups.find((g) => g.name === item.mergedInto);
    if (parent) { parent.children.push(item); return groups; }
  }
  groups.push({ ...item, children: [] });
  return groups;
}, []);

export const priceGroups: Record<string, {
  amount: number; label: string; title: string; note: string; sourceKey: string; estimated?: boolean;
}> = {
  'orion-artemis-ii': {
    amount: 2200000000, label: '$2.2B', title: 'Artemis II Orion completion cost',
    note: 'NASA OIG projected an additional $2.2B between FY2020 and FY2023 to complete Orion development for Artemis II. Used here as a shared Artemis II Orion hardware proxy.',
    sourceKey: 'orion-oig',
  },
  'core-stage': {
    amount: 9200000000, label: '$9.2B', title: 'SLS stages contract value',
    note: 'NASA OIG lists the Boeing stages contract at $9.2B covering two core stages, one exploration upper stage, and test articles. Used here as a shared core-stage proxy.',
    sourceKey: 'sls-contracts-oig',
  },
  'rs25-cluster': {
    amount: 397800000, label: '$397.8M', title: '4-engine RS-25 set',
    note: 'Derived from NASA’s $1.79B contract for 18 RS-25 engines, or about $99.4M each. Artemis II flies with four engines.',
    sourceKey: 'rs25-contract',
  },
  boosters: {
    amount: 4300000000, label: '$4.3B', title: 'SLS booster contract value',
    note: 'NASA OIG lists the Northrop Grumman booster contract at $4.3B to produce 35 booster segments and upgrade future booster hardware. Used here as a shared booster-system proxy.',
    sourceKey: 'sls-contracts-oig',
  },
  icps: {
    amount: 954400000, label: '$954.4M', title: 'ICPS contract value',
    note: 'NASA OIG lists the ICPS contract at $954.4M for three stages, one structural test article, and flight software. Used here as the ICPS program proxy.',
    sourceKey: 'sls-contracts-oig',
  },
  lvsa: {
    amount: 60000000, label: '$60M', title: 'LVSA contract action',
    note: 'NASA selected Teledyne Brown Engineering under a $60M contract action to design, build, test, evaluate, and certify the launch vehicle stage adapter assembly plus a structural test article and two flight units.',
    sourceKey: 'lvsa-contract',
  },
  'orion-stage-adapter-estimate': {
    amount: 4400000, label: '$4.4M (est.)', title: 'Estimated Orion stage adapter value',
    note: 'Estimated from NASA sources by scaling the $60M LVSA contract action against the published OSA and LVSA geometries. This is an inferred estimate, not a NASA-published standalone price.',
    sourceKey: 'orion-stage-adapter-estimate', estimated: true,
  },
};

const apolloInflationFactor = 324.122 / 36.7;
Object.assign(priceGroups, {
  'apollo-csm': {
    amount: Math.round(55000000 * apolloInflationFactor), label: '$485.8M',
    title: 'Apollo command/service module mission cost proxy',
    note: 'Based on NASA’s Apollo 11-era mission cost table ($55M in 1969 dollars). Inflation-adjusted to November 2025 using BLS CPI-U.',
    sourceKey: 'apollo-mission-costs',
  },
  'apollo-lm': {
    amount: Math.round(40000000 * apolloInflationFactor), label: '$353.5M',
    title: 'Apollo lunar module mission cost proxy',
    note: 'Based on NASA’s Apollo 11-era mission cost table ($40M in 1969 dollars). Inflation-adjusted to November 2025 using BLS CPI-U.',
    sourceKey: 'apollo-mission-costs',
  },
  'apollo-saturn-v': {
    amount: Math.round(185000000 * apolloInflationFactor), label: '$1.63B',
    title: 'Apollo Saturn V mission cost proxy',
    note: 'Based on NASA’s Apollo 11-era mission cost table ($185M in 1969 dollars). Inflation-adjusted to November 2025 using BLS CPI-U.',
    sourceKey: 'apollo-mission-costs',
  },
});

export const priceBibliography = [
  { key: 'orion-oig', title: 'NASA OIG: NASA’s Management of the Orion Multi-Purpose Crew Vehicle Program (IG-20-018)', url: 'https://oig.nasa.gov/wp-content/uploads/2024/02/IG-20-018.pdf', note: 'Used for Orion component structure and the $2.2B Artemis II Orion completion estimate.' },
  { key: 'sls-contracts-oig', title: 'NASA OIG: NASA’s Management of the Artemis Missions (IG-22-003), Appendix D', url: 'https://oig.nasa.gov/wp-content/uploads/2024/02/ig-22-003.pdf', note: 'Used for SLS contract values covering Boeing stages, ICPS, and Northrop booster hardware.' },
  { key: 'rs25-contract', title: 'NASA news release: NASA Commits to Future Artemis Missions with More SLS Rocket Engines', url: 'https://www.nasa.gov/news-release/nasa-commits-to-future-artemis-missions-with-more-sls-rocket-engines/', note: 'Used to derive the per-engine RS-25 price proxy from the $1.79B / 18-engine contract.' },
  { key: 'lvsa-contract', title: 'NASA contract release: NASA Selects Space Launch System Adapter Hardware Manufacturer', url: 'https://www.nasa.gov/news-release/nasa-selects-space-launch-system-adapter-hardware-manufacturer/', note: 'Used for the $60M launch vehicle stage adapter contract action.' },
  { key: 'orion-components', title: 'NASA Orion reference: Spacecraft Components', url: 'https://www.nasa.gov/reference/spacecraft-components/', note: 'Used to align Orion component names in the SVG with NASA’s current component breakdown.' },
  { key: 'core-stage-reference', title: 'NASA SLS reference: Core Stage', url: 'https://www.nasa.gov/reference/sls-space-launch-system-core-stage', note: 'Used for core stage component functions including tanks, intertank, engine section, and forward skirt.' },
  { key: 'booster-reference', title: 'NASA SLS reference: Solid Rocket Booster', url: 'https://www.nasa.gov/reference/sls-space-launch-system-solid-rocket-booster/', note: 'Used for booster component functions including the forward skirt, aft skirt, avionics, motor segments, and nozzle control roles.' },
  { key: 'booster-fabrication', title: 'NASA reference: Booster Fabrication Facility', url: 'https://www.nasa.gov/reference/nasas-booster-fabrication-facility/', note: 'Used for detailed descriptions of the booster forward assembly, aft skirt assembly, and thrust vector control hardware.' },
  { key: 'icps-reference', title: 'NASA SLS reference: Interim Cryogenic Propulsion Stage', url: 'https://www.nasa.gov/reference/space-launch-system-interim-cryogenic-propulsion-stage-icps/', note: 'Used for the ICPS role and placement in the Artemis launch stack.' },
  { key: 'lvsa-reference', title: 'NASA SLS reference: Launch Vehicle Stage Adapter', url: 'https://www.nasa.gov/reference/space-launch-system-launch-vehicle-stage-adapter-lvsa/', note: 'Used for the LVSA structural and protective role between the core stage and ICPS.' },
  { key: 'orion-stage-adapter', title: 'NASA image article: NASA Assembles Artemis II Orion Stage Adapter', url: 'https://www.nasa.gov/image-article/nasa-assembles-artemis-ii-orion-stage-adapter-2/', note: 'Used to verify the Orion stage adapter role; reviewed material did not include an isolated NASA-published price for this hardware.' },
  { key: 'orion-stage-adapter-estimate', title: 'Estimate method: NASA OSA factsheet + NASA LVSA contract release', url: 'https://www.nasa.gov/reference/sls-space-launch-system-orion-stage-adapter/', note: 'Estimate uses the NASA-published OSA dimensions together with the $60M NASA LVSA contract action and LVSA published dimensions as a comparable Marshall-built adapter proxy. This is an inference from NASA sources.' },
  { key: 'apollo-mission-costs', title: 'NASA historical Apollo mission cost table', url: 'https://ntrs.nasa.gov/citations/19740027133', note: 'Used for Apollo-era mission hardware costs: Command & Service Module $55M, Lunar Module $40M, Saturn V $185M. Values were then inflation-adjusted for cross-era comparison.' },
  { key: 'bls-cpi-1969-2025', title: 'BLS CPI-U historical and November 2025 index levels', url: 'https://www.bls.gov/news.release/archives/cpi_12182025.htm', note: 'Used to place Apollo and Artemis values on a comparable 2025-dollar scale. Conversion uses CPI-U annual average 36.7 for 1969 and CPI-U index level 324.122 for November 2025.' },
  { key: 'apollo-program-reference', title: 'NASA Apollo Program overview', url: 'https://www.nasa.gov/mission_pages/apollo/index.html', note: 'Used for Apollo spacecraft role descriptions, including the command module, service module, and lunar module as the program’s three major spacecraft elements.' },
  { key: 'saturn-v-reference', title: 'NASA Saturn V educational reference', url: 'https://www.nasa.gov/learning-resources/for-kids-and-students/what-was-the-saturn-v-grades-5-8', note: 'Used for Saturn V stage-role descriptions and the overall sequencing of the first, second, and third stages.' },
  { key: 'saturn-v-stage-1', title: 'NASA Science 3D resource: Saturn V – Stage 1', url: 'https://science.nasa.gov/3d-resources/saturn-v-stage-1/', note: 'Used for the role of the S-IC first stage and its five F-1 engines during liftoff and early ascent.' },
  { key: 'saturn-v-stage-2', title: 'NASA Science 3D resource: Saturn V – Stage 2', url: 'https://science.nasa.gov/3d-resources/saturn-v-stage-2/', note: 'Used for the role of the S-II second stage and its five J-2 engines after first-stage separation.' },
  { key: 'saturn-v-instrument-unit', title: 'NASA image article: Manufacturing the Saturn V Instrument Unit', url: 'https://www.nasa.gov/image-article/manufacturing-saturn-v-instrument-unit/', note: 'Used for the instrument unit description as the Saturn V guidance, navigation, control, and sequencing ring.' },
];

export const artemisHiddenPartIds = new Set(['solid-rocket-booster']);
export const artemisHiddenPartGroups = new Set(['foward-skirt-avionics', 'nozzle']);
export const apolloHiddenPartIds = new Set<string>();
export const apolloHiddenPartGroups = new Set<string>();

export const artemisParts: Record<string, { part: string; contractor: string; note?: string; priceGroup: string; description: string }> = {
  'launch-abort-sytem': { part: 'Launch Abort System', contractor: 'Northrop Grumman', priceGroup: 'orion-artemis-ii', description: 'Pulls the Orion crew module to safety within milliseconds if an emergency occurs during launch or ascent.' },
  'crew-module': { part: 'Crew Module', contractor: 'Lockheed Martin', note: 'Aerojet Rocketdyne supplies auxiliary engines, reaction control thrusters, and helium tanks.', priceGroup: 'orion-artemis-ii', description: 'The pressurized capsule where astronauts live and work during the mission, and the only Orion element that returns to Earth.' },
  'encapsulated-service-module-panels': { part: 'Encapsulated Service Module Panels', contractor: 'Lockheed Martin', priceGroup: 'orion-artemis-ii', description: 'Encloses and protects service-module hardware during ascent while maintaining the spacecraft’s outer aerodynamic shape.' },
  'spacecraft-adpater': { part: 'Spacecraft Adapter', contractor: 'Teledyne Brown Engineering', note: 'Also associated with Jacobs ESSCA and AMRO Fabricating Corp.', priceGroup: 'orion-artemis-ii', description: 'Provides the structural interface that ties Orion spacecraft elements together and supports integration of spacecraft systems.' },
  'orion-stage-adapter': { part: 'Orion Stage Adapter', contractor: 'Teledyne Brown Engineering', note: 'Also associated with Jacobs ESSCA and AMRO Fabricating Corp.', priceGroup: 'orion-stage-adapter-estimate', description: 'Connects Orion to the interim cryogenic propulsion stage, shields the spacecraft from launch gases, and can carry CubeSat payloads.' },
  'interim-cryogenic-propulsion-stage': { part: 'Interim Cryogenic Propulsion Stage', contractor: 'Boeing', note: 'Built through United Launch Alliance, a Lockheed Martin and Boeing joint venture.', priceGroup: 'icps', description: 'Provides in-space propulsion after booster and core-stage separation, giving Orion the push needed to reach its mission trajectory.' },
  'launch-vehicle-stage-adapter': { part: 'Launch Vehicle Stage Adapter', contractor: 'Teledyne Brown Engineering', priceGroup: 'lvsa', description: 'Connects the core stage to the interim upper stage and helps protect ICPS avionics and electrical hardware from vibration and acoustic loads.' },
  'forward-skirt': { part: 'Front Skirt', contractor: 'Boeing', priceGroup: 'core-stage', description: 'The top section of the core stage that carries avionics and supports the upper stack above the liquid oxygen tank.' },
  'liquid-oxygen-tank': { part: 'Liquid Oxygen Tank', contractor: 'Boeing', priceGroup: 'core-stage', description: 'Stores the cryogenic liquid oxygen oxidizer that feeds the four RS-25 engines during ascent.' },
  intertank: { part: 'Intertank', contractor: 'Boeing', priceGroup: 'core-stage', description: 'Connects the liquid oxygen and liquid hydrogen tanks, houses avionics and electronics, and serves as a booster attachment region.' },
  'liquid-hydrogen-tank': { part: 'Liquid Hydrogen Tank', contractor: 'Boeing', note: 'Air Products is also listed for this tank.', priceGroup: 'core-stage', description: 'Stores the cryogenic liquid hydrogen fuel that feeds the four RS-25 engines during ascent.' },
  'engine-section': { part: 'Engine Section', contractor: 'Boeing', priceGroup: 'core-stage', description: 'Mounts, feeds, and controls the four RS-25 engines and serves as a major attachment point for the twin boosters.' },
  'rs25-engine-2': { part: 'RS-25 Engines', contractor: 'Aerojet Rocketdyne', priceGroup: 'rs25-cluster', description: 'The four reusable-space-shuttle-derived engines that provide the core stage’s main liquid-fueled thrust during ascent.' },
  'forward-assembly': { part: 'Forward Assembly', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'The top booster assembly, combining the forward skirt and nose cap to house avionics and provide a major structural connection to SLS.' },
  'foward-skirt-avionics': { part: 'Forward Skirt Avionics', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'Electronics that monitor booster health and communicate flight-control data for ignition, steering, and jettison operations.' },
  'forward-segment-with-igniter': { part: 'Forward Segment with Igniter', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'The top motor segment of the booster stack, containing ignition hardware that starts the five-segment booster burn.' },
  'center-forward-segment': { part: 'Center Forward Segment', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'One of the booster’s propellant-filled center motor segments that contributes sustained thrust during the first two minutes of flight.' },
  'center-center-segment': { part: 'Center Center Segment', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'A middle booster motor segment that adds solid-propellant volume and thrust to the five-segment booster stack.' },
  'center-aft-segment': { part: 'Center Aft Segment', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'A lower center booster motor segment that helps generate the bulk of early-ascent solid-rocket thrust.' },
  'aft-section': { part: 'Aft Segment', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'The lower motor section that channels thrust into the booster aft hardware and nozzle region.' },
  'solid-rocket-booster': { part: 'Solid Rocket Booster', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'A 17-story strap-on booster that provides more than 75 percent of SLS thrust at liftoff and during the first two minutes of ascent.' },
  'aft-skirt': { part: 'Aft Skirt', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'Houses the thrust vector control system and separation motors that steer the nozzle and separate the boosters after burnout.' },
  'core-stage-attach-ring': { part: 'Core Stage Attach Ring', contractor: 'Boeing', priceGroup: 'core-stage', description: 'Transfers structural loads between the booster hardware and core stage at one of the major rocket attachment interfaces.' },
  nozzle: { part: 'Nozzle', contractor: 'Northrop Grumman', priceGroup: 'boosters', description: 'Shapes and directs booster exhaust, allowing thrust vector control hardware to steer the rocket during initial ascent.' },
};

export const apolloParts: Record<string, { part: string; contractor: string; note?: string; priceGroup: string; description: string }> = {
  'launch-escape-system': { part: 'Launch Escape Module', contractor: 'Lockheed Propulsion Co.', note: 'Later folded into Lockheed Martin.', priceGroup: 'apollo-csm', description: 'A tower-mounted abort system that could pull the Apollo command module away from the booster during a launch emergency.' },
  'command-module': { part: 'Command Module', contractor: 'North American Aviation', note: 'Historical Boeing lineage via North American Aviation.', priceGroup: 'apollo-csm', description: 'The crew’s quarters and flight-control capsule, and the only Apollo spacecraft element that returned to Earth.' },
  'service-module': { part: 'Service Module', contractor: 'North American Aviation', note: 'Historical Boeing lineage via North American Aviation.', priceGroup: 'apollo-csm', description: 'Carried the Apollo spacecraft propulsion and support systems that powered and sustained the mission in space.' },
  'lunar-excursion-module': { part: 'Lunar Excursion Module', contractor: 'Northrop Grumman', priceGroup: 'apollo-lm', description: 'The two-stage lunar lander that carried two astronauts down to the Moon and back up to rendezvous in lunar orbit.' },
  'lunar-excursion-module-outer-hull': { part: 'Lunar Excursion Module', contractor: 'Northrop Grumman', priceGroup: 'apollo-lm', description: 'The external structure of the lunar module that enclosed the lander’s ascent and descent hardware for lunar operations.' },
  'instrument-unit': { part: 'Instrument Unit', contractor: 'IBM', priceGroup: 'apollo-saturn-v', description: 'The Saturn V guidance ring mounted above the S-IVB, containing the rocket’s navigation, guidance, control, and sequencing equipment.' },
  'fuel-tank-sivb': { part: 'S-IVB Fuel Tank', contractor: 'Douglas Aircraft', note: 'Historical Boeing lineage via Douglas Aircraft.', priceGroup: 'apollo-saturn-v', description: 'Stored propellant for the Saturn V third stage, which first placed Apollo in Earth orbit and then performed translunar injection.' },
  'lox-tank-s4b': { part: 'S-IVB Liquid Oxygen Tank', contractor: 'Douglas Aircraft', note: 'Historical Boeing lineage via Douglas Aircraft.', priceGroup: 'apollo-saturn-v', description: 'Held the oxidizer for the Saturn V third stage during parking-orbit operations and the burn that sent Apollo toward the Moon.' },
  'j2-engine-1': { part: 'S-IVB J-2 Engine', contractor: 'Rocketdyne', note: 'Later became part of Aerojet Rocketdyne.', priceGroup: 'apollo-saturn-v', description: 'The single restartable J-2 engine that powered the S-IVB third stage in Earth orbit and on the translunar injection burn.' },
  's2-outer-hull': { part: 'S-II Stage', contractor: 'North American Aviation', note: 'Historical Boeing lineage via North American Aviation.', priceGroup: 'apollo-saturn-v', description: 'The Saturn V second stage, which fired after S-IC separation and accelerated Apollo to near-orbital velocity.' },
  'fuel-tank-s2': { part: 'S-II Fuel Tank', contractor: 'North American Aviation', note: 'Historical Boeing lineage via North American Aviation.', priceGroup: 'apollo-saturn-v', description: 'Stored propellant for the Saturn V second stage during the several-minute burn that carried the vehicle to high altitude and speed.' },
  'j2-engines-5': { part: 'S-II J-2 Engines', contractor: 'Rocketdyne', note: 'Later became part of Aerojet Rocketdyne.', priceGroup: 'apollo-saturn-v', description: 'The five J-2 engines that powered the second stage after first-stage separation during the climb toward orbit.' },
  'sic-outer-hull': { part: 'S-IC Stage', contractor: 'North American Aviation', note: 'Historical Boeing lineage via North American Aviation.', priceGroup: 'apollo-saturn-v', description: 'The first stage of Saturn V, responsible for lifting the fully fueled Moon rocket off the pad and through the initial ascent.' },
  'lox-tank-sic': { part: 'S-IC Liquid Oxygen Tank', contractor: 'Boeing', priceGroup: 'apollo-saturn-v', description: 'Held the oxidizer for the Saturn V first stage during the liftoff phase powered by five F-1 engines.' },
  'fuel-tank-sic': { part: 'S-IC Fuel Tank', contractor: 'Boeing', priceGroup: 'apollo-saturn-v', description: 'Stored first-stage fuel for the S-IC burn that launched Saturn V through the earliest minutes of flight.' },
  'f1-engines-5': { part: 'F-1 Engines', contractor: 'Rocketdyne', note: 'Later became part of Aerojet Rocketdyne.', priceGroup: 'apollo-saturn-v', description: 'The five first-stage engines that produced the enormous thrust needed to lift Saturn V from Earth at launch.' },
  'outer-hull': { part: 'Apollo Spacecraft Stack', contractor: 'North American Aviation', note: 'Historical Boeing lineage via North American Aviation.', priceGroup: 'apollo-csm', description: 'The outer stacked spacecraft section combining the command and service modules above the Saturn V launch vehicle.' },
};

export const minPriceAmount = 3000000;
export const maxPriceAmount = 10000000000;
export const minPriceLabel = '$3M';
export const maxPriceLabel = '$10B';
const defaultPriceScaleExponent = 0.6;

export function escapeAttr(value: unknown): string {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

export function normalizeId(id: string): string {
  return id.replace(/-\d+$/, '');
}

export function lookupPart(id: string, partInfo: Record<string, any>) {
  return partInfo[id] ?? partInfo[normalizeId(id)] ?? null;
}

export function isHiddenPart(rocket: any, id: string): boolean {
  return rocket.hiddenPartIds.has(id) || rocket.hiddenPartGroups.has(normalizeId(id));
}

export function buildNote(info: any): string {
  const style = contractorStyles[info.contractor];
  if (!style?.mergedInto) return info.note ?? '';
  return [info.note, `Later merged into ${style.mergedInto}.`].filter(Boolean).join(' ');
}

export function buildDescription(info: any): string {
  return info.description ?? 'Description unavailable for this graphic element.';
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  return {
    r: Number.parseInt(clean.slice(0, 2), 16),
    g: Number.parseInt(clean.slice(2, 4), 16),
    b: Number.parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
}

function mixHex(from: string, to: string, t: number): string {
  const s = hexToRgb(from);
  const e = hexToRgb(to);
  return rgbToHex({ r: s.r + (e.r - s.r) * t, g: s.g + (e.g - s.g) * t, b: s.b + (e.b - s.b) * t });
}

export function priceColor(amount: number): string {
  const normalized = maxPriceAmount === minPriceAmount ? 1 : (amount - minPriceAmount) / (maxPriceAmount - minPriceAmount);
  return mixHex('#e5f7e8', '#0f8e4f', Math.pow(Math.max(0, normalized), defaultPriceScaleExponent));
}

export function getPriceMeta(info: any) {
  if (!info.priceGroup) return null;
  const group = priceGroups[info.priceGroup];
  if (!group) return null;
  return { ...group, color: priceColor(group.amount) };
}

export function renderRocketSvg(rocket: any): string {
  const rawSvg = fs.readFileSync(rocket.svgPath, 'utf8');
  return rawSvg
    .replace('<svg ', `<svg class="rocket-svg rocket-svg--${rocket.slug}" role="img" aria-labelledby="${rocket.slug}-rocket-title ${rocket.slug}-rocket-desc" `)
    .replace(/<g id="Layer_2"/, `<title id="${rocket.slug}-rocket-title">${rocket.title}</title><desc id="${rocket.slug}-rocket-desc">${rocket.desc}</desc><g id="Layer_2"`)
    .replace(/<g\b([^>]*\bid="([^"]+)"[^>]*)>/g, (match: string, attrs: string, id: string) => {
      if (id === 'Layer_2' || isHiddenPart(rocket, id)) return match;
      const info = lookupPart(id, rocket.parts);
      if (!info) return match;
      const color = contractorStyles[info.contractor]?.color;
      if (!color) return match;
      const pm = getPriceMeta(info);
      const cleanAttrs = attrs.replace(/\sclass="[^"]*"/g, '');
      return `<g${cleanAttrs} class="artemis-part artemis-part--group" tabindex="0" role="button" style="--part-fill: ${color}" data-part="${escapeAttr(info.part)}" data-contractor="${escapeAttr(info.contractor)}" data-contractor-color="${escapeAttr(color)}" data-description="${escapeAttr(buildDescription(info))}" data-note="${escapeAttr(buildNote(info))}" data-rocket="${escapeAttr(rocket.label)}" data-part-group="${escapeAttr(normalizeId(id))}" data-price-group="${escapeAttr(info.priceGroup ?? '')}" data-price-label="${escapeAttr(pm?.label ?? 'Unavailable')}" data-price-title="${escapeAttr(pm?.title ?? 'Price unavailable')}" data-price-note="${escapeAttr(pm?.note ?? 'No isolated NASA-published part price was found in the reviewed source set.')}" data-price-color="${escapeAttr(pm?.color ?? '#d9ddd9')}" data-price-amount="${escapeAttr(pm?.amount ?? '')}" data-price-source="${escapeAttr(pm?.sourceKey ?? '')}" data-price-estimated="${pm?.estimated ? 'true' : 'false'}" data-price-available="${pm ? 'true' : 'false'}" aria-label="${escapeAttr(`${info.part}: ${info.contractor}`)}">`;
    })
    .replace(/<(path|polyline|polygon)\b([^>]*?)(\s*\/?)>/g, (match: string, tag: string, attrs: string, closing: string) => {
      const idMatch = attrs.match(/\bid="([^"]+)"/);
      if (!idMatch) return match;
      const id = idMatch[1];
      if (isHiddenPart(rocket, id)) return '';
      const info = lookupPart(id, rocket.parts);
      if (!info) return match;
      const color = contractorStyles[info.contractor]?.color;
      if (!color) return match;
      const pm = getPriceMeta(info);
      const cleanAttrs = attrs.replace(/\sclass="[^"]*"/g, '');
      return `<${tag}${cleanAttrs} class="artemis-part" tabindex="0" role="button" style="--part-fill: ${color}" data-part="${escapeAttr(info.part)}" data-contractor="${escapeAttr(info.contractor)}" data-contractor-color="${escapeAttr(color)}" data-description="${escapeAttr(buildDescription(info))}" data-note="${escapeAttr(buildNote(info))}" data-rocket="${escapeAttr(rocket.label)}" data-part-group="${escapeAttr(normalizeId(id))}" data-price-group="${escapeAttr(info.priceGroup ?? '')}" data-price-label="${escapeAttr(pm?.label ?? 'Unavailable')}" data-price-title="${escapeAttr(pm?.title ?? 'Price unavailable')}" data-price-note="${escapeAttr(pm?.note ?? 'No isolated NASA-published part price was found in the reviewed source set.')}" data-price-color="${escapeAttr(pm?.color ?? '#d9ddd9')}" data-price-amount="${escapeAttr(pm?.amount ?? '')}" data-price-source="${escapeAttr(pm?.sourceKey ?? '')}" data-price-estimated="${pm?.estimated ? 'true' : 'false'}" data-price-available="${pm ? 'true' : 'false'}" aria-label="${escapeAttr(`${info.part}: ${info.contractor}`)}"${closing}>`;
    });
}

export const rockets = [
  {
    slug: 'artemis',
    label: 'Artemis II',
    title: 'Artemis II contractor rocket diagram',
    desc: 'Interactive SLS and Orion diagram colored by contractor.',
    svgPath: path.join(process.cwd(), 'public', 'rockets', 'artemis', 'sls-diagram-02.svg'),
    hiddenPartIds: artemisHiddenPartIds,
    hiddenPartGroups: artemisHiddenPartGroups,
    parts: artemisParts,
  },
  {
    slug: 'apollo',
    label: 'Apollo Saturn V',
    title: 'Apollo Saturn V contractor rocket diagram',
    desc: 'Interactive Saturn V diagram colored by contractor and legacy company lineage.',
    svgPath: path.join(process.cwd(), 'public', 'rockets', 'apollo', 'saturn-v-diagram-01.svg'),
    hiddenPartIds: apolloHiddenPartIds,
    hiddenPartGroups: apolloHiddenPartGroups,
    parts: apolloParts,
  },
];
