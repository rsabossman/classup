// AI-generated illustrations (ElevenLabs, 2026-11). Each lives in public/img as <name>-480/800/1280.webp, 16:9.
// They show generic learners and settings only: no university logos, buildings or photos.
export interface Img { name: string; alt: string }

const img = (name: string, alt: string): Img => ({ name, alt });

export const homeImg = img('home', 'Illustration of three adult learners in India, the Gulf and Africa studying online degrees on laptops from home');

export const regionImg: Record<string, Img> = {
  in: img('region-in', 'Illustration of a working professional in India studying an online degree on her laptop at dusk'),
  me: img('region-me', 'Illustration of an expat professional in a Gulf city studying an online degree on his laptop at night'),
  africa: img('region-africa', 'Illustration of a professional in an African city studying an online degree on her laptop at sunset'),
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
