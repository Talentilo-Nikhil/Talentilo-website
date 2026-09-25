import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LegalDocument, type LegalGroup } from '@/components/sections/LegalDocument';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Talentilo AI Privacy Policy — how we collect, use, and protect your personal information, including our Chrome Extension data practices.',
  alternates: { canonical: '/privacy' },
};

const PRIVACY_EMAIL = 'privacy@talentilo.ai';

/** Body copy. The document is one long read, so every paragraph takes the same measure. */
function P({ children }: { children: ReactNode }) {
  return <p className="text-body text-ink/85">{children}</p>;
}

/** The note that narrows a section to one jurisdiction. */
function Applies({ children }: { children: ReactNode }) {
  return <p className="text-body text-muted italic">{children}</p>;
}

function List({ children }: { children: ReactNode }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-body text-ink/85 marker:text-crusta-300">
      {children}
    </ul>
  );
}

/** The lead-in that names what a list item is about, before the colon. */
function Term({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

function Sub({ children }: { children: ReactNode }) {
  return <h3 className="mt-3 font-sans text-body font-semibold text-ink">{children}</h3>;
}

function Mail() {
  return (
    <a
      href={`mailto:${PRIVACY_EMAIL}`}
      className="text-brand-ember underline underline-offset-4 transition-opacity duration-200 hover:opacity-80"
    >
      {PRIVACY_EMAIL}
    </a>
  );
}

function Outbound({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-brand-ember underline underline-offset-4 transition-opacity duration-200 hover:opacity-80"
    >
      {children}
    </a>
  );
}

function PostalAddress() {
  return (
    <address className="text-body text-ink/85 not-italic">
      Talentilo Intelligence Pvt Ltd
      <br />
      210 A, Vardhmaan Star Shop Mall,
      <br />
      Sec-19, Faridabad, Haryana 121003,
      <br />
      India
    </address>
  );
}

const groups: LegalGroup[] = [
  {
    label: 'General policy',
    sections: [
      {
        number: '1',
        title: 'What Information Do We Collect?',
        body: (
          <>
            <Sub>Personal information you disclose to us</Sub>
            <P>
              We collect personal information that you voluntarily provide to us when you register
              on the Services, express an interest in obtaining information about us or our products
              and Services, when you participate in activities on the Services, or otherwise when
              you contact us.
            </P>
            <P>The personal information we collect may include the following:</P>
            <List>
              <li>Names</li>
              <li>Phone numbers</li>
              <li>Email addresses</li>
              <li>Usernames</li>
              <li>Passwords</li>
              <li>Contact preferences</li>
              <li>Contact or authentication data</li>
              <li>Billing addresses</li>
            </List>
            <P>
              <Term>Sensitive Information:</Term> We do not process sensitive information.
            </P>

            <Sub>Information automatically collected</Sub>
            <P>
              We automatically collect certain information when you visit, use, or navigate the
              Services. This information does not reveal your specific identity (like your name or
              contact information) but may include device and usage information, such as your IP
              address, browser and device characteristics, operating system, language preferences,
              referring URLs, device name, country, location, and information about how and when you
              use our Services.
            </P>
            <P>
              This information is primarily needed to maintain the security and operation of our
              Services, and for our internal analytics and reporting purposes.
            </P>
            <P>The information we collect includes:</P>
            <List>
              <li>
                <Term>Log and Usage Data:</Term> Service-related, diagnostic, usage, and performance
                information our servers automatically collect when you access or use our Services.
              </li>
              <li>
                <Term>Device Data:</Term> Information about your computer, phone, tablet, or other
                device you use to access the Services.
              </li>
              <li>
                <Term>Location Data:</Term> Information about your device’s location, which can be
                either precise or imprecise.
              </li>
            </List>
          </>
        ),
      },
      {
        number: '2',
        title: 'How Do We Process Your Information?',
        body: (
          <>
            <P>
              We process your personal information for a variety of reasons, depending on how you
              interact with our Services, including:
            </P>
            <List>
              <li>
                <Term>To facilitate account creation and authentication:</Term> To manage user
                accounts.
              </li>
              <li>
                <Term>To deliver and facilitate delivery of services:</Term> To provide you with the
                requested service.
              </li>
              <li>
                <Term>To respond to user inquiries/offer support:</Term> To respond to your
                inquiries and solve any potential issues.
              </li>
              <li>
                <Term>To send administrative information:</Term> To send you details about our
                products, services, changes to our terms and policies, and other similar
                information.
              </li>
              <li>
                <Term>To fulfill and manage your orders:</Term> To manage your orders, payments,
                returns, and exchanges made through the Services.
              </li>
              <li>
                <Term>To enable user-to-user communications:</Term> We may process your information
                if you choose to use any of our offerings that allow for communication with another
                user.
              </li>
              <li>
                <Term>To request feedback:</Term> To contact you about your use of our Services.
              </li>
              <li>
                <Term>To send you marketing and promotional communications:</Term> For our marketing
                purposes, if this is in accordance with your marketing preferences.
              </li>
              <li>
                <Term>To deliver targeted advertising:</Term> To develop and display personalized
                content and advertising tailored to your interests and location.
              </li>
              <li>
                <Term>To protect our Services:</Term> As part of our efforts to keep our Services
                safe and secure, including fraud monitoring and prevention.
              </li>
              <li>
                <Term>To identify usage trends:</Term> To understand how our Services are being used
                so we can improve them.
              </li>
              <li>
                <Term>To determine the effectiveness of marketing campaigns:</Term> To better
                understand marketing and promotional campaigns that are most relevant to you.
              </li>
              <li>
                <Term>To save or protect an individual’s vital interest:</Term> To prevent harm.
              </li>
            </List>
          </>
        ),
      },
      {
        number: '3',
        title: 'What Legal Bases Do We Rely On?',
        body: (
          <>
            <Applies>If you are located in the EU or UK, this section applies to you.</Applies>
            <P>
              We only process your personal information when we believe it is necessary and we have
              a valid legal reason (i.e., legal basis) to do so under applicable law, like with your
              consent, to comply with laws, to provide you with services to enter into or fulfill
              our contractual obligations, to protect your rights, or to fulfill our legitimate
              business interests.
            </P>
          </>
        ),
      },
      {
        number: '4',
        title: 'When and With Whom Do We Share Your Personal Information?',
        body: (
          <>
            <P>
              We may share your information in specific situations described in this section and/or
              with the following third parties:
            </P>
            <List>
              <li>
                <Term>Business Transfers:</Term> We may share or transfer your information in
                connection with, or during negotiations of, any merger, sale of company assets,
                financing, or acquisition of all or a portion of our business to another company.
              </li>
              <li>
                <Term>Affiliates:</Term> We may share your information with our affiliates, in which
                case we will require those affiliates to honor this Privacy Notice.
              </li>
              <li>
                <Term>Business Partners:</Term> We may share your information with our business
                partners to offer you certain products, services, or promotions.
              </li>
            </List>
          </>
        ),
      },
      {
        number: '5',
        title: 'Do We Use Cookies and Other Tracking Technologies?',
        body: (
          <>
            <P>
              We may use cookies and similar tracking technologies (like web beacons and pixels) to
              access or store information. Specific information about how we use such technologies
              and how you can refuse certain cookies is set out in our Cookie Notice.
            </P>
            <P>
              <Term>Google Analytics:</Term> We may share your information with Google Analytics to
              track and analyze the use of the Services. To opt out of being tracked by Google
              Analytics across the Services, visit{' '}
              <Outbound href="https://tools.google.com/dlpage/gaoptout">
                https://tools.google.com/dlpage/gaoptout
              </Outbound>
              .
            </P>
          </>
        ),
      },
      {
        number: '6',
        title: 'Do We Offer Artificial Intelligence-Based Products?',
        body: (
          <>
            <P>
              Yes, we offer products, features, or tools powered by artificial intelligence, machine
              learning, or similar technologies (collectively, “AI Products”).
            </P>
            <P>
              <Term>Use of AI Technologies:</Term> We provide the AI Products through third-party
              service providers (“AI Service Providers”), including Anthropic, OpenAI. Your input,
              output, and personal information will be shared and processed by these AI Service
              Providers to enable your use of our AI Products.
            </P>
            <P>Our AI Products are designed for the following functions:</P>
            <List>
              <li>AI applications</li>
              <li>AI search</li>
              <li>Text analysis</li>
              <li>AI insights</li>
            </List>
          </>
        ),
      },
      {
        number: '7',
        title: 'How Long Do We Keep Your Information?',
        body: (
          <P>
            We will only keep your personal information for as long as it is necessary for the
            purposes set out in this Privacy Notice, unless a longer retention period is required or
            permitted by law. When we have no ongoing legitimate business need to process your
            personal information, we will either delete or anonymize such information.
          </P>
        ),
      },
      {
        number: '8',
        title: 'How Do We Keep Your Information Safe?',
        body: (
          <P>
            We have implemented appropriate and reasonable technical and organizational security
            measures designed to protect the security of any personal information we process.
            However, despite our safeguards and efforts to secure your information, no electronic
            transmission over the Internet or information storage technology can be guaranteed to be
            100% secure. All data is transmitted via HTTPS (TLS 1.2+) and stored using AES-256
            encryption.
          </P>
        ),
      },
      {
        number: '9',
        title: 'What Are Your Privacy Rights?',
        body: (
          <>
            <P>
              In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights
              under applicable data protection laws. These may include the right (i) to request
              access and obtain a copy of your personal information, (ii) to request rectification
              or erasure; (iii) to restrict the processing of your personal information; and (iv) if
              applicable, to data portability. In certain circumstances, you may also have the right
              to object to the processing of your personal information.
            </P>
            <P>
              <Term>Withdrawing your consent:</Term> If we are relying on your consent to process
              your personal information, you have the right to withdraw your consent at any time.
            </P>
          </>
        ),
      },
      {
        number: '10',
        title: 'Controls for Do-Not-Track Features',
        body: (
          <P>
            Most web browsers and some mobile operating systems and mobile applications include a
            Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy
            preference not to have data about your online browsing activities monitored and
            collected. At this stage, no uniform technology standard for recognizing and
            implementing DNT signals has been finalized.
          </P>
        ),
      },
      {
        number: '11',
        title: 'Do United States Residents Have Specific Privacy Rights?',
        body: (
          <>
            <Applies>California and other US State-specific sections apply here.</Applies>
            <P>
              We have collected the following categories of personal information in the past twelve
              (12) months:
            </P>
            <List>
              <li>Identifiers (Contact details, IP address, account name)</li>
              <li>
                Personal information categories listed in the California Customer Records statute
                (Name, employment, financial info)
              </li>
              <li>Protected classification characteristics (Gender, age)</li>
              <li>Commercial information (Transaction history)</li>
              <li>Professional or employment-related information (Business contact details)</li>
            </List>
          </>
        ),
      },
      {
        number: '12',
        title: 'Do We Make Updates to This Notice?',
        body: (
          <P>
            Yes, we will update this notice as necessary to stay compliant with relevant laws. The
            updated version will be indicated by an updated “Revised” date at the top of this
            Privacy Notice.
          </P>
        ),
      },
      {
        number: '13',
        title: 'How Can You Contact Us About This Notice?',
        body: (
          <>
            <P>
              If you have questions or comments about this notice, you may email us at <Mail /> or
              by post to:
            </P>
            <PostalAddress />
          </>
        ),
      },
      {
        number: '14',
        title: 'How Can You Review, Update, or Delete the Data We Collect From You?',
        body: (
          <P>
            Based on the applicable laws of your country, you may have the right to request access
            to the personal information we collect from you, change that information, or delete it.
            To request to review, update, or delete your personal information, please submit a data
            subject access request to <Mail />.
          </P>
        ),
      },
    ],
  },
  {
    label: 'Chrome Extension',
    sections: [
      {
        number: 'E1',
        title: 'Single Purpose Statement',
        body: (
          <P>
            The Talentilo Chrome Extension (the “Extension”) serves one single purpose: to allow
            recruiters to efficiently capture candidate profile data and resumes from authorized
            professional networking and job sites (e.g., Naukri.com, LinkedIn) and import them into
            their private Talentilo ATS workspace.
          </P>
        ),
      },
      {
        number: 'E2',
        title: 'User-Controlled Operation',
        body: (
          <>
            <P>
              The Extension operates exclusively on user-initiated actions. It does not run in the
              background, monitor browsing activity, or collect any data passively.
            </P>
            <P>
              The Extension only activates when the user explicitly clicks an action button such as{' '}
              <Term>“Send to Backend”</Term>, <Term>“Shortlist”</Term>, or <Term>“Capture”</Term>.
              When triggered, the Extension may collect the following candidate data as directed by
              the user:
            </P>
            <List>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Work experience and employment history</li>
              <li>Skills and education details</li>
              <li>Resume / CV files</li>
              <li>Other publicly visible profile information on the active page</li>
            </List>
            <P>
              No data is collected from pages where the user has not explicitly interacted with the
              Talentilo Extension interface.
            </P>
          </>
        ),
      },
      {
        number: 'E3',
        title: 'Permissions Usage',
        body: (
          <>
            <P>
              The Extension requests the following browser permissions, each used solely for the
              Extension’s core functionality and not for tracking, profiling, or any purpose beyond
              what is described below:
            </P>
            <List>
              <li>
                <Term>storage:</Term> Stores API credentials (authentication tokens) locally in the
                browser using Chrome’s secure storage API. No candidate data is permanently stored
                in the Extension itself.
              </li>
              <li>
                <Term>tabs &amp; scripting:</Term> Reads data from the active tab only when the user
                triggers a capture action. Used to extract candidate profile information visible on
                the current page.
              </li>
            </List>
            <P>
              These permissions are used exclusively for the functionality of the Extension and are
              not used for tracking users, monitoring browsing habits, or any advertising purpose.
            </P>
          </>
        ),
      },
      {
        number: 'E4',
        title: 'Data Collection & Limited Use',
        body: (
          <>
            <P>
              Candidate data captured via the Extension is processed solely to populate the
              recruiter’s private Talentilo ATS workspace. Our data use is strictly limited:
            </P>
            <List>
              <li>
                <Term>No Sale of Data:</Term> We do not sell, trade, or rent candidate data to any
                third parties.
              </li>
              <li>
                <Term>No Advertising or Marketing Use:</Term> Data collected via the Extension is
                never used for advertising, remarketing, or marketing purposes.
              </li>
              <li>
                <Term>No Profiling or Credit Scoring:</Term> Data is not used to create consumer
                profiles, determine creditworthiness, or for any lending purposes.
              </li>
              <li>
                <Term>No Background Monitoring:</Term> The Extension does not monitor, log, or
                transmit any data unless the user explicitly initiates an action.
              </li>
            </List>
          </>
        ),
      },
      {
        number: 'E5',
        title: 'Data Storage & Security',
        body: (
          <>
            <P>We are committed to keeping captured data secure:</P>
            <List>
              <li>
                <Term>No Persistent Local Storage of Candidate Data:</Term> Candidate profile
                information and resumes are not permanently stored within the Extension. They are
                transmitted directly to Talentilo’s secure servers upon user action.
              </li>
              <li>
                <Term>API Credentials:</Term> Authentication tokens/API credentials are stored
                locally using Chrome’s built-in{' '}
                <code className="rounded bg-surface-tint px-1.5 py-0.5 font-mono text-small text-ink">
                  chrome.storage
                </code>{' '}
                API and are never transmitted to third parties.
              </li>
              <li>
                <Term>Encrypted Transmission:</Term> All data is transmitted to Talentilo’s servers
                exclusively via HTTPS (TLS 1.2+).
              </li>
              <li>
                <Term>Server-Side Encryption:</Term> Once received, data is stored using AES-256
                encryption on Talentilo’s secure infrastructure.
              </li>
            </List>
          </>
        ),
      },
      {
        number: 'E6',
        title: 'Third-Party Sites',
        body: (
          <P>
            The Extension is designed for use on authorized professional networking and job
            platforms (e.g., LinkedIn, Naukri.com). Talentilo is not responsible for the privacy
            practices of these third-party sites. Users should review the privacy policies of any
            platform they use in conjunction with the Extension.
          </P>
        ),
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Privacy Policy"
      revised="Last updated: April 27, 2026"
      preamble={
        <>
          <P>
            This Privacy Notice for <Term>Talentilo Intelligence Pvt Ltd</Term> (doing business as{' '}
            <Term>Talentilo AI</Term>) (“we,” “us,” or “our”), describes how and why we might access,
            collect, store, use, and/or share (“process”) your personal information when you use our
            services (“Services”), including when you:
          </P>
          <List>
            <li>
              Visit our website at{' '}
              <Outbound href="https://talentilo.ai">https://talentilo.ai</Outbound> or any website of
              ours that links to this Privacy Notice.
            </li>
            <li>
              Use the <Term>Talentilo Chrome Extension</Term> to capture candidate data from
              professional networking or job platforms.
            </li>
            <li>Engage with us in other related ways, including any marketing or events.</li>
          </List>
          <P>
            Questions or concerns? Reading this Privacy Notice will help you understand your privacy
            rights and choices. If you do not agree with our policies and practices, please do not
            use our Services. For questions, contact us at <Mail />.
          </P>
        </>
      }
      groups={groups}
      interlude={
        <div className="mt-20 border-t-2 border-crusta-200 pt-10">
          <p className="font-sans text-small font-semibold tracking-[0.08em] text-brand-ember uppercase">
            Chrome Extension
          </p>
          <h2 className="mt-2 text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] text-ink">
            Talentilo Chrome Extension: Privacy Disclosure
          </h2>
          <p className="mt-3 text-body text-muted">
            Effective Date: February 18, 2026 · Incorporated into this Privacy Policy
          </p>
          <p className="mt-4 text-body text-ink/85">
            The following sections (E1–E6) specifically describe the data practices of the{' '}
            <Term>Talentilo Chrome Extension</Term>. The Extension is a productivity tool available
            exclusively to registered Talentilo users. All general terms above also apply to
            Extension usage.
          </p>
        </div>
      }
    >
      <div className="mt-16 flex flex-col gap-3 border-t border-woodsmoke-100 pt-8">
        <h2 className="font-sans text-h5 font-semibold text-ink">Contact Us</h2>
        <P>
          For any questions about this Privacy Policy or our data practices (including the Chrome
          Extension), please contact us at <Mail />.
        </P>
        <PostalAddress />
      </div>
    </LegalDocument>
  );
}
