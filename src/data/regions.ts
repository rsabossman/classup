export type RegionId = 'in' | 'me' | 'africa' | 'intl';

export interface Region {
  id: RegionId;
  name: string;
  label: string;
  tag: string; // short region word for page titles
  hreflang: string[]; // language-country codes this region's pages serve
  audience: string; // phrase for descriptions, e.g. 'students in India'
  hero: string;
  sub: string;
  currency: string;
  showInrFees: boolean;
  whatsapp: string; // E.164 digits only, e.g. 919000000000. Empty hides every WhatsApp option.
  phone: string;
  hours: string;
  points: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}

const commonFaqs = [
  { q: 'Are online degrees from these universities valid?', a: 'Each program listed here is offered by a university that states it is entitled by the UGC (University Grants Commission) to run online programs. Under UGC regulations, a degree earned online from an entitled university is treated as equivalent to the same degree earned on campus. Always check the university’s current status on the UGC-DEB website before you enrol. We can show you how.' },
  { q: 'How are exams conducted?', a: 'Most programs use online proctored exams that you take from home with a webcam, plus assignments during the semester. A typical split is 30% internal assessment and 70% end-term exam. The exact pattern varies by university.' },
  { q: 'Is there an entrance exam?', a: 'Most online BBA, BCA, BCom, MBA, MCA and MCom programs listed here admit students on eligibility alone, with no entrance exam.' },
  { q: 'Do you charge a fee for counselling?', a: 'No. Counselling and application help are free.' },
];

export const regions: Record<RegionId, Region> = {
  in: {
    id: 'in', name: 'India', label: 'India', tag: 'India', hreflang: ['en-IN'], audience: 'students in India',
    hero: 'Online degrees from established Indian universities, from wherever you are',
    sub: 'Compare UGC-entitled online BBA, BCA, BCom, MBA, MCA and MCom programs on fees, eligibility and approvals. Free counselling on chat, WhatsApp or a call.',
    currency: 'INR', showInrFees: true,
    whatsapp: '', phone: '+91 80642 64489', hours: 'Mon–Sat, 9 AM–8 PM IST',
    points: [
      { title: 'Valid for jobs and higher studies', body: 'Online degrees from UGC-entitled universities are equivalent to regular degrees under the UGC (Online Programs) Regulations.' },
      { title: 'EMI and loan options', body: 'Most programs allow semester-wise or annual payment, and several offer no-cost EMI through banking partners.' },
      { title: 'Study while you work', body: 'Recorded lectures, weekend live sessions and online exams mean you never have to take leave.' },
    ],
    faqs: [
      ...commonFaqs,
      { q: 'Do I need an ABC ID?', a: 'Yes. Universities now ask for a 12-digit Academic Bank of Credits (ABC) ID, which you can create free at abc.gov.in using DigiLocker. We will walk you through it.' },
    ],
  },
  me: {
    id: 'me', name: 'Middle East', label: 'Gulf & Middle East', tag: 'Gulf', hreflang: ['en-AE', 'en-SA', 'en-QA', 'en-KW', 'en-OM', 'en-BH'], audience: 'working professionals in the Gulf',
    hero: 'Earn an Indian university degree online while you work in the Gulf',
    sub: 'Online MBA, MCA, BBA and BCA programs from established Indian universities, with exams you take from home and counselling in your time zone.',
    currency: 'USD', showInrFees: false,
    whatsapp: '', phone: '+91 80642 64489', hours: 'Sun–Fri, 10 AM–9 PM GST',
    points: [
      { title: 'No travel to India', body: 'Classes, assignments and proctored exams are fully online, so you can study around Gulf working hours.' },
      { title: 'Plan for equivalency early', body: 'If you need your degree attested or evaluated in the UAE, Saudi Arabia, Qatar, Oman, Kuwait or Bahrain, we check the program’s eligibility with you before you apply.' },
      { title: 'Career-focused specialisations', body: 'Business analytics, digital marketing, supply chain, data science and AI are offered by more than one university.' },
    ],
    faqs: [
      ...commonFaqs,
      { q: 'Will my degree be recognised in the GCC?', a: 'Recognition rules differ by country and employer, and some ministries treat online degrees differently from regular ones. Tell our counsellor your country and purpose (job, promotion, licensing or further study). We will share what the rules currently say so you can decide before you pay.' },
      { q: 'Can I pay in my local currency?', a: 'International fees and payment methods vary by university. Our counsellor will confirm the fee in your currency and the accepted payment options.' },
    ],
  },
  africa: {
    id: 'africa', name: 'Africa', label: 'Africa', tag: 'Africa', hreflang: ['en-NG', 'en-KE', 'en-GH', 'en-ZA', 'en-TZ', 'en-UG', 'en-ET', 'en-ZM'], audience: 'students in Africa',
    hero: 'Affordable, internationally-minded online degrees from India',
    sub: 'Study a UGC-entitled online MBA, MCA, BBA or BCA from home. These universities already have learners across Africa.',
    currency: 'USD', showInrFees: false,
    whatsapp: '', phone: '+91 80642 64489', hours: 'Mon–Sat, 8 AM–6 PM WAT / EAT',
    points: [
      { title: 'Low cost compared with studying abroad', body: 'You get an Indian university degree without visa, travel or relocation costs.' },
      { title: 'Light on bandwidth', body: 'Recorded lectures and downloadable material work on modest connections. Most universities ask for about 1 Mbps.' },
      { title: 'English-medium', body: 'All programs listed are taught and examined in English.' },
    ],
    faqs: [
      ...commonFaqs,
      { q: 'What qualifications do I need?', a: 'For bachelor’s programs, universities ask for 12 years of formal schooling. For master’s programs, they ask for 15 years (typically a 3-year bachelor’s). If your system differs, for example a WAEC or KCSE pathway, our counsellor will check equivalence with the university for you.' },
    ],
  },
  intl: {
    id: 'intl', name: 'International', label: 'Rest of the world', tag: 'International', hreflang: ['en'], audience: 'international students',
    hero: 'Indian university degrees, fully online, wherever you live',
    sub: 'Compare online MBA, MCA, BBA, BCA and more from UGC-entitled Indian universities. Free counselling on chat, WhatsApp or a call.',
    currency: 'USD', showInrFees: false,
    whatsapp: '', phone: '+91 80642 64489', hours: 'Mon–Sat, 24h on chat',
    points: [
      { title: 'Study in your own time zone', body: 'Recorded classes and flexible exam windows suit learners across Europe, the Americas, Asia and Oceania.' },
      { title: 'Credential evaluation', body: 'Some of these universities say they are recognised by WES for credential evaluation. We will confirm the current position for your country and purpose.' },
      { title: 'One counsellor, end to end', body: 'From choosing a program to enrolment and your first semester, you have one point of contact.' },
    ],
    faqs: commonFaqs,
  },
};

export const regionList = Object.values(regions);
