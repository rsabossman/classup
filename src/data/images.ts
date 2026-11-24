// AI-generated illustrations (ElevenLabs, 2026-11). Each lives in public/img as <name>-480/800/1280.webp, 16:9.
// They show generic learners and settings only: no university logos, buildings or photos.
export interface Img { name: string; alt: string; ogWidth?: number }

const img = (name: string, alt: string): Img => ({ name, alt });

export const homeImg = img('home', 'Illustration of three adult learners in India, the Gulf and Africa studying online degrees on laptops from home');

export const regionImg: Record<string, Img> = {
  in: img('region-in', 'Illustration of a working professional in India studying an online degree on her laptop at dusk'),
  me: img('region-me', 'Illustration of an expat professional in a Gulf city studying an online degree on his laptop at night'),
  africa: img('region-africa', 'Illustration of a professional in an African city studying an online degree on her laptop at sunset'),
  saarc: img('region-saarc', 'Illustration of a young professional in a South Asian hill city studying an online degree on her laptop at dusk'),
  sea: img('region-sea', 'Illustration of a young professional on a balcony in a South East Asian city studying an online degree on her laptop in the evening'),
  intl: img('region-intl', 'Illustration of two learners in different time zones studying online degrees, with a globe between them'),
};

const business = img('deg-business', 'Illustration of a manager presenting a growth chart, representing business and management degrees');
const tech = img('deg-tech', 'Illustration of a developer at a laptop with code, cloud and database icons, representing computer applications degrees');
const commerce = img('deg-commerce', 'Illustration of a student with a calculator, ledger and coins, representing commerce and accounting degrees');
const arts = img('deg-arts', 'Illustration of a student reading among books with a globe, representing arts and humanities degrees');
const diploma = img('deg-diploma', 'Illustration of a learner on a tablet with a checklist and certificate, representing short diplomas and certificates');

export const degreeImg: Record<string, Img> = {
  MBA: business, BBA: business, PGD: business,
  MCA: tech, BCA: tech, DCA: tech,
  MCom: commerce, BCom: commerce,
  MA: arts, BA: arts,
  Diploma: diploma,
};
export const imgForDegree = (d: string) => degreeImg[d] ?? diploma;

export const articleImg: Record<string, Img> = {
  'check-if-online-degree-is-ugc-valid': img('art-check-if-online-degree-is-ugc-valid', 'Illustration of a student checking a degree document with a magnifying glass and a verified badge'),
  'mca-eligibility-without-maths': img('art-mca-eligibility-without-maths', 'Illustration of a learner climbing steps and crossing a bridge towards a coding screen, representing a bridge course into MCA'),
  'online-mba-vs-regular-mba': img('art-online-mba-vs-regular-mba', 'Illustration comparing studying an MBA online at home with a campus classroom, both roads leading to the same graduation cap'),
  'online-degree-for-gulf-professionals': img('art-online-degree-for-gulf-professionals', 'Illustration of an engineer in the Gulf studying on a laptop after work, with the city skyline at sunset'),
};

export const IMG_WIDTHS = [480, 800, 1280] as const;

// Full-width hero background photos (licensed stock supplied by the site owner), in public/img as hero-<id>-640/1024/1600.webp.
export const HERO_WIDTHS = [640, 1024, 1600] as const;
export const heroImg: Record<string, Img> = {
  home: { name: 'hero-home', alt: 'Student taking notes while studying in a library', ogWidth: 1600 },
  in: { name: 'hero-in', alt: 'Student with headphones taking notes during an online class on her laptop', ogWidth: 1600 },
  me: { name: 'hero-me', alt: 'Working professional in an office thinking about his next career step', ogWidth: 1600 },
  africa: { name: 'hero-africa', alt: 'Professional with a headset joining an online class on his laptop', ogWidth: 1600 },
  // SAARC and South East Asia reuse licensed photos until dedicated ones are chosen.
  saarc: { name: 'hero-in', alt: 'Student with headphones taking notes during an online class on her laptop', ogWidth: 1600 },
  sea: { name: 'hero-intl', alt: 'Professional studying on her laptop in a modern workspace', ogWidth: 1600 },
  intl: { name: 'hero-intl', alt: 'Professional studying on her laptop in a modern workspace', ogWidth: 1600 },
};

// Campus photos (from the universities' own websites, or supplied by the site owner), in public/img as uni-<id>-<w>.webp.
export const uniImg: Record<string, { img: Img; widths: readonly number[]; credit?: string }> = {
  uom: { img: img('uni-uom', 'Crawford Hall, the University of Mysore main building, Mysuru'), widths: [480, 800] },
  vtu: { img: img('uni-vtu', 'Aerial view of the Visvesvaraya Technological University main building, Belagavi'), widths: [480, 800] },
  gndu: { img: img('uni-gndu', 'Tree-lined main avenue of the Guru Nanak Dev University campus, Amritsar'), widths: [480, 800], credit: 'gndu.ac.in' },
  adbu: { img: img('uni-adbu', 'Academic Block 1 at Assam Don Bosco University, Guwahati'), widths: [480, 680] },
};
