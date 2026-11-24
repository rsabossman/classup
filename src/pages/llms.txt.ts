import type { APIRoute } from 'astro';
import { programs, universities, uni, feeFor, degrees, degreeInfo } from '../data/catalog';
import { regionList } from '../data/regions';
import { site } from '../data/site';

export const GET: APIRoute = ({ site: s }) => {
  const abs = (p: string) => new URL(`${import.meta.env.BASE_URL.replace(/\/$/, '')}${p}`, s).href;
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.tagline}. ${site.name} is an independent counselling service, not a university. It lists ${programs.length} online programs from ${Object.keys(universities).length} UGC-entitled Indian universities and offers free counselling by chat, WhatsApp and phone for students in India, the Middle East, Africa and elsewhere.`,
    '',
    'Facts here come from university publications. Fees come from university fee notifications. INR amounts apply to students in India; USD amounts are tuition per semester for international students. Fees may change.',
    '',
    `Machine-readable catalog: ${abs('/programs.json')}`,
    '',
    '## Regions',
    ...regionList.map((r) => `- [${r.label}](${abs(`/${r.id}/`)}): ${r.sub}`),
    '',
    '## Universities',
    ...Object.values(universities).map((u) => `- [${u.name}](${abs(`/in/universities/${u.id}/`)}): ${u.city}, est. ${u.est}. Approvals: ${u.approvals.join(', ')}. Exams: ${u.exams}.`),
    '',
    ...degrees.flatMap((d) => [
      `## Online ${d} (${degreeInfo[d].full})`,
      ...programs.filter((p) => p.degree === d).map((p) => `- [${p.name}, ${uni(p).name}](${abs(`/in/programs/${p.id}/`)}): ${p.duration_years ? p.duration_years + ' yr' : ''}${p.credits ? ', ' + p.credits + ' credits' : ''}${feeFor(p, 'in') ? ', India fee ' + feeFor(p, 'in')!.short : ''}${feeFor(p, 'intl') ? ', international tuition ' + feeFor(p, 'intl')!.short : ''}. Eligibility: ${p.eligibility_india}.${p.specializations.length ? ' Specialisations: ' + p.specializations.join(', ') + '.' : ''}`),
      '',
    ]),
    '## Guides',
    `- [All guides](${abs('/articles/')})`,
    '',
    '## Contact',
    `- Free counselling: ${abs('/in/#counselling')}`,
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
