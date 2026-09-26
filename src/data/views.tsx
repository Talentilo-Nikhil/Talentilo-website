import { TrackerPanel } from '@/components/panels/TrackerPanel';
import type { ViewTab } from '@/components/sections/ViewPanel';
import { Creative } from '@/components/ui/Creative';

/** Each view shows the workspace as that role actually sees it, captured from the design file. */
const VIEW_SIZES = '(min-width: 1280px) 1216px, 100vw';

/**
 * The three lenses the switcher on /platform/recruitment-os offers, in the order it shows them.
 *
 * The home page briefly rendered one of these on its own and imported it from here. It now makes
 * its own case with its own screen, so these are back to serving the one page that shows all
 * three — see the note on the Recruiter Performance section in src/app/page.tsx.
 */
export const views: ViewTab[] = [
  {
    label: 'The Owner/VP',
    title: 'The Owner/VP',
    // The screen behind this tab was an annual target table until website-update-v4.fig replaced
    // it with one recruiter's month against target. The detail follows it: what it promised —
    // revenue forecasts, cash flow, a global index — is not on the screen, and the screen is
    // about one person rather than the agency.
    detail:
      "Every recruiter's month against target: revenue, interviews, submissions and shortlist ratio, set and tracked in one place.",
    media: <Creative name="ros-view-owner" sizes={VIEW_SIZES} />,
  },
  {
    label: 'The Ops Manager',
    title: 'The Ops Manager',
    // Likewise: the floor workspace here became a candidate scoring breakdown, so the standard-of-
    // working line it carried describes nothing on the screen.
    detail:
      'Why a candidate scores what they score: location, experience, skills and education, with the gaps named.',
    media: <Creative name="ros-view-ops" sizes={VIEW_SIZES} />,
  },
  {
    label: 'The Recruiter',
    title: 'The Recruiter',
    // This tab used to show `ros-view-recruiter` — one candidate's record — under a line about
    // today's pipeline and today's follow-ups. The screen was a detail view of one person and the
    // copy described a to-do list that was not on it, so neither said what the recruiter does
    // here. The job is the client's candidate tracker: their spreadsheet, their column headings,
    // filled in by hand out of a folder of CVs. See the note in TrackerPanel.
    detail:
      'Set the columns your client wants, drop in the CVs, and the tracker comes back filled — no more copying fields out of resumes one at a time.',
    media: (
      <TrackerPanel
        trackerName="Acme Ltd — Nov intake"
        trackerNote="Define the columns once, or upload the client's own .xlsx."
        columns={[
          { label: 'Sr. No.', source: 'Auto', auto: true },
          { label: 'Candidate Name', source: 'From CV' },
          { label: '10th Marks %', source: 'From CV' },
          { label: '12th Marks %', source: 'From CV' },
          { label: 'Certificates', source: 'From CV' },
          { label: '12th Subject', source: 'From CV' },
          { label: 'Date of Birth', source: 'From CV' },
          { label: 'Date of Sending', source: 'Auto', auto: true },
        ]}
        intakeCount="128"
        intakeLabel="CVs in"
        formats={['PDF', 'DOCX', 'Scan']}
        generateNote="Talentilo reads every file and writes the columns you set."
        headings={['10th %', '12th %', 'Certificates']}
        rows={[
          { name: 'Aarti Deshmukh', cells: ['88.4', '91.0', 'AWS SAA'] },
          { name: 'Rahul Menon', cells: ['79.6', '84.2', 'PMP'] },
          { name: 'Sneha Kulkarni', cells: ['91.2', '88.8', 'CFA L1'] },
          { name: 'Imran Shaikh', cells: ['74.0', '81.5', '—'] },
          { name: 'Meera Nair', cells: ['86.0', '90.4', 'Six Sigma'] },
          { name: 'Vikram Rao', cells: ['81.8', '85.6', '—'] },
          { name: 'Priya Iyer', cells: ['93.0', '89.2', 'AWS SAA'] },
          { name: 'Arjun Bhatt', cells: ['77.2', '80.0', '—'] },
        ]}
        moreRows="+120 more rows"
        sheetStatus="filled from 128 CVs"
        actions={['Download Tracker Data', 'Update & Send']}
      />
    ),
  },
];
