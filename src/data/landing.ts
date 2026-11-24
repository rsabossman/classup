// Paid-ad landing pages: /go/<market>/<degree>/ (for example /go/ae/mba/).
// Each page is one market (country or region) × one degree. They are noindex and left out of the sitemap,
// so they never compete with the SEO pages; ads link to them directly.
import type { RegionId } from './regions';

export interface Market {
  id: string;
  region: RegionId;
  name: string; // shown in copy: "in the UAE"
  where: string;
  country: string; // ISO code sent with the lead ('' when the market spans several countries)
  dial: string; // phone placeholder hint
  hero: 'in' | 'me' | 'africa' | 'intl'; // which licensed stock photo to use
}

export const markets: Market[] = [
  { id: 'in', region: 'in', name: 'India', where: 'in India', country: 'IN', dial: '+91 98xxx xxxxx', hero: 'in' },
  { id: 'ae', region: 'me', name: 'the UAE', where: 'in the UAE', country: 'AE', dial: '+971 5x xxx xxxx', hero: 'me' },
  { id: 'sa', region: 'me', name: 'Saudi Arabia', where: 'in Saudi Arabia', country: 'SA', dial: '+966 5x xxx xxxx', hero: 'me' },
  { id: 'gulf', region: 'me', name: 'the Gulf', where: 'in the Gulf', country: '', dial: '+971 / +974 / +968 / +965 / +973 …', hero: 'me' },
  { id: 'ng', region: 'africa', name: 'Nigeria', where: 'in Nigeria', country: 'NG', dial: '+234 80x xxx xxxx', hero: 'africa' },
  { id: 'ke', region: 'africa', name: 'Kenya', where: 'in Kenya', country: 'KE', dial: '+254 7xx xxx xxx', hero: 'africa' },
  { id: 'africa', region: 'africa', name: 'Africa', where: 'in Africa', country: '', dial: '+234 / +254 / +233 / +27 …', hero: 'africa' },
  { id: 'intl', region: 'intl', name: 'your country', where: 'wherever you live', country: '', dial: 'Country code + number', hero: 'intl' },
];

export const lpDegrees = ['MBA', 'MCA', 'BBA', 'BCA'] as const;
export type LpDegree = (typeof lpDegrees)[number];

interface DegreeCopy {
  goal: string; // what the learner wants, used in headlines
  duration: string;
  eligibility: string;
  careers: string[];
  faqs: { q: string; a: string }[];
}

export const degreeCopy: Record<LpDegree, DegreeCopy> = {
  MBA: {
    goal: 'move into management',
    duration: '2 years, 4 semesters',
    eligibility: 'Any bachelor’s degree. Some universities ask for 50% (45% for reserved categories).',
    careers: ['Team lead and manager roles', 'Promotion in your current company', 'Switching to marketing, finance, HR or analytics', 'Running or growing your own business'],
    faqs: [
      { q: 'Can I do an online MBA while working full time?', a: 'Yes. That is who these programs are built for. Lectures are recorded, live sessions are usually at weekends, and exams are taken online from home, so you do not need to take leave.' },
      { q: 'Which MBA specialisation should I choose?', a: 'Pick the function you want to work in next. Marketing, finance and HR are the most common. Business analytics and digital marketing suit people who like working with data or online channels. An advisor can compare the options for your background.' },
      { q: 'Is an online MBA accepted for jobs and promotions?', a: 'Under the UGC (Online Programs) Regulations, an online degree from a UGC-entitled university is treated as equivalent to the same degree earned on campus. Employers in the private sector generally accept it. If you need it for a government job or abroad, our advisor will check the rules for your case first.' },
    ],
  },
  MCA: {
    goal: 'move up in tech',
    duration: '2 years, 4 semesters',
    eligibility: 'BCA, B.Sc CS/IT, or a bachelor’s with Mathematics, Statistics or Computer subjects. Some programs accept any graduate.',
    careers: ['Software developer and engineer', 'Data analyst and data scientist', 'Cloud and DevOps engineer', 'Cyber security analyst'],
    faqs: [
      { q: 'Can I do an online MCA without maths?', a: 'It depends on the university. Some ask for Mathematics at 10+2 or graduation, some offer a bridge course, and some MCA specialisations accept any graduate. Tell our advisor your background and we will shortlist the programs you are eligible for.' },
      { q: 'Which MCA specialisations are available?', a: 'Options include AI and data science, data analytics, cloud computing, cyber security, machine learning and blockchain, depending on the university.' },
      { q: 'Is an online MCA valid for IT jobs?', a: 'Under the UGC (Online Programs) Regulations, an online MCA from a UGC-entitled university is treated as equivalent to a regular MCA. What employers look at most is your skills and projects, so choose a specialisation that matches the role you want.' },
    ],
  },
  BBA: {
    goal: 'start a business career',
    duration: '3 years, 6 semesters',
    eligibility: '10+2 in any stream from a recognised board.',
    careers: ['Sales, marketing and operations roles', 'Digital marketing', 'Family business or your own startup', 'A strong base for an MBA later'],
    faqs: [
      { q: 'Can I join an online BBA after 12th in any stream?', a: 'Yes. The online BBA programs we list accept 10+2 in any stream from a recognised board.' },
      { q: 'Can I work or prepare for other exams alongside?', a: 'Yes. Classes are recorded and exams are online, so many students study while working, running a family business or preparing for other exams.' },
      { q: 'Can I do an MBA after an online BBA?', a: 'Yes. An online BBA from a UGC-entitled university is a valid bachelor’s degree, so you can apply for an MBA, online or on campus, after you graduate.' },
    ],
  },
  BCA: {
    goal: 'start a career in IT',
    duration: '3 years, 6 semesters',
    eligibility: '10+2 from a recognised board. Most programs accept any stream; one asks for 40%.',
    careers: ['Junior developer and web developer', 'Data analytics and data science roles', 'IT support and networking', 'A direct path to an MCA'],
    faqs: [
      { q: 'Can I do an online BCA without maths in 12th?', a: 'Most of the online BCA programs we list accept 10+2 in any stream. Our advisor will confirm the rule for the university you choose.' },
      { q: 'Will I learn real programming online?', a: 'Yes. You study programming, databases, web development and networking through recorded lectures, live sessions and practical assignments. Some programs specialise in data science or data analytics.' },
      { q: 'Can I do an MCA after an online BCA?', a: 'Yes. A BCA from a UGC-entitled university is the most common route into an MCA.' },
    ],
  },
};
