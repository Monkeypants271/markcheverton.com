import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Patents and Patent Applications",
  description:
    "Patents and published patent applications by Mark Cheverton from his work as a physicist and research engineer at GE, GE Aerospace, GE Plastics/SABIC Innovative Plastics, and Molecular Opto-Electronic Corporation.",
  alternates: { canonical: "/patents" },
};

type Patent = {
  number: string;
  url: string;
  title: string;
};

type PatentGroup = {
  heading: string;
  patents: Patent[];
};

const patentGroups: PatentGroup[] = [
  {
    heading: "Holography",
    patents: [
      {
        number: "US 9,373,351 B2",
        url: "https://patents.google.com/patent/US9373351B2/en",
        title:
          "System and method for dual-beam recording and readout of multilayered optical data storage media",
      },
      {
        number: "US 8,715,887 B2",
        url: "https://patents.google.com/patent/US8715887B2/en",
        title: "Complex holograms, method of making and using complex holograms",
      },
      {
        number: "US 8,194,520 B2",
        url: "https://patents.google.com/patent/US8194520B2/en",
        title: "Disc structure for bit-wise holographic storage",
      },
      {
        number: "US 8,703,363 B2",
        url: "https://patents.google.com/patent/US8703363B2/en",
        title: "Reflection hologram storage method",
      },
      {
        number: "US 8,609,300 B2",
        url: "https://patents.google.com/patent/US8609300B2/en",
        title: "Method of making holographic recording materials and articles formed thereby",
      },
      {
        number: "US 8,450,028 B2",
        url: "https://patents.google.com/patent/US8450028B2/en",
        title: "Holographic storage method",
      },
      {
        number: "US 2010/0328741 A1",
        url: "https://patents.google.com/patent/US20100328741A1/en",
        title: "Holographic device",
      },
      {
        number: "US 2009/0325078 A1",
        url: "https://patents.google.com/patent/US20090325078A1/en",
        title: "Holographic recording medium",
      },
      {
        number: "US 2013/0004887 A1",
        url: "https://patents.google.com/patent/US20130004887A1/en",
        title: "Holographic recording medium",
      },
      {
        number: "US 2013/0003151 A1",
        url: "https://patents.google.com/patent/US20130003151A1/en",
        title: "Holographic storage method and article",
      },
      {
        number: "US 2013/0038916 A1",
        url: "https://patents.google.com/patent/US20130038916A1/en",
        title: "Method of making multiplexed transmission holograms",
      },
      {
        number: "US 2010/0180937 A1",
        url: "https://patents.google.com/patent/US20100180937A1/en",
        title: "Holographic energy-collecting medium and associated device",
      },
      {
        number: "US 9,093,082 B2",
        url: "https://patents.google.com/patent/US9093082B2/en",
        title: "Data storage devices and methods",
      },
    ],
  },
  {
    heading: "Inspection / Machine Vision / Sensors",
    patents: [
      {
        number: "US 7,199,386 B2",
        url: "https://patents.google.com/patent/US7199386B2/en",
        title: "System and method for detecting defects in a light-management film",
      },
      {
        number: "US 7,435,986 B2",
        url: "https://patents.google.com/patent/US7435986B2/en",
        title: "System and method for detecting repeating defects in a light-management film",
      },
      {
        number: "US 2007/0115464 A1",
        url: "https://patents.google.com/patent/US20070115464A1/en",
        title: "System and method for inspection of films",
      },
      {
        number: "US 2007/0116350 A1",
        url: "https://patents.google.com/patent/US20070116350A1/en",
        title: "Method for detecting the alignment of films for automated defect detection",
      },
      {
        number: "US 2007/0114693 A1",
        url: "https://patents.google.com/patent/US20070114693A1/en",
        title:
          "Methods for improving mold quality for use in the manufacture of liquid crystal display components",
      },
      {
        number: "US 2007/0115460 A1",
        url: "https://patents.google.com/patent/US20070115460A1/en",
        title: "Method for examining molds and apparatus for accomplishing the same",
      },
      {
        number: "US 2007/0117225 A1",
        url: "https://patents.google.com/patent/US20070117225A1/en",
        title: "Integrated inspection system and defect correction method",
      },
      {
        number: "US 8,582,195 B2",
        url: "https://patents.google.com/patent/US8582195B2/en",
        title: "Systems and methods for relative positioning",
      },
      {
        number: "US 9,395,301 B2",
        url: "https://patents.google.com/patent/US9395301B2/en",
        title: "Methods for monitoring environmental barrier coatings",
      },
      {
        number: "US 9,964,455 B2",
        url: "https://patents.google.com/patent/US9964455B2/en",
        title: "Methods for monitoring strain and temperature in a hot gas path component",
      },
      {
        number: "US 9,482,585 B2",
        url: "https://patents.google.com/patent/US9482585B2/en",
        title: "Method and system for multi-functional embedded sensors",
      },
      {
        number: "US 9,551,620 B2",
        url: "https://patents.google.com/patent/US9551620B2/en",
        title: "Method and system for multi-functional embedded sensors",
      },
      {
        number: "US 2014/0037857 A1",
        url: "https://patents.google.com/patent/US20140037857A1/en",
        title: "Methods for applying fixed images to electrochemical devices",
      },
    ],
  },
  {
    heading: "Fiber Optics",
    patents: [
      {
        number: "US 2003/0156792 A1",
        url: "https://patents.google.com/patent/US20030156792A1/en",
        title:
          "Optical waveguide amplifier using a circulator and an optical signal reflective surface and method employing same",
      },
      {
        number: "US 6,511,571 B2",
        url: "https://patents.google.com/patent/US6511571B2/en",
        title: "Method for fabricating an optical waveguide",
      },
    ],
  },
  {
    heading: "3D Printing / Additive Manufacturing",
    patents: [
      {
        number: "US 9,724,876 B2",
        url: "https://patents.google.com/patent/US9724876B2/en",
        title: "Operational performance assessment of additive manufacturing",
      },
      {
        number: "US 9,751,262 B2",
        url: "https://patents.google.com/patent/US9751262B2/en",
        title:
          "Systems and methods for creating compensated digital representations for use in additive manufacturing processes",
      },
      {
        number: "US 10,112,262 B2",
        url: "https://patents.google.com/patent/US10112262B2/en",
        title: "System and methods for real-time enhancement of build parameters of a component",
      },
      {
        number: "US 10,821,508 B2",
        url: "https://patents.google.com/patent/US10821508B2/en",
        title: "System and methods for enhancing the build parameters of a component",
      },
      {
        number: "US 10,048,661 B2",
        url: "https://patents.google.com/patent/US10048661B2/en",
        title: "Visualization of additive manufacturing process data",
      },
      {
        number: "US 10,464,262 B2",
        url: "https://patents.google.com/patent/US10464262B2/en",
        title: "Systems and methods for monitoring a melt pool using a dedicated scanning device",
      },
      {
        number: "US 10,086,567 B2",
        url: "https://patents.google.com/patent/US10086567B2/en",
        title: "Method for additively manufacturing component and component made therefrom",
      },
      {
        number: "US 10,532,515 B2",
        url: "https://patents.google.com/patent/US10532515B2/en",
        title: "Additively manufactured component with locator element for aligning sub-components",
      },
      {
        number: "US 10,343,392 B2",
        url: "https://patents.google.com/patent/US10343392B2/en",
        title: "Powder-bed additive manufacturing devices and methods",
      },
      {
        number: "US 11,583,931 B2",
        url: "https://patents.google.com/patent/US11583931B2/en",
        title: "Powder-bed additive manufacturing devices and methods",
      },
      {
        number: "US 10,888,925 B2",
        url: "https://patents.google.com/patent/US10888925B2/en",
        title: "Three-dimensional printing of three-dimensional objects",
      },
      {
        number: "US 10,195,692 B2",
        url: "https://patents.google.com/patent/US10195692B2/en",
        title: "Selective laser melting additive manufacturing method with reduced residual stress",
      },
      {
        number: "US 2019/0016053 A1",
        url: "https://patents.google.com/patent/US20190016053A1/en",
        title: "Method for additively manufacturing component and component made therefrom",
      },
      {
        number: "US 2026/0138187 A1",
        url: "https://patents.google.com/patent/US20260138187A1/en",
        title:
          "Apparatus for high resolution imaging of an additive manufacturing process with multi-frame camera capture",
      },
      {
        number: "US 2026/0138189 A1",
        url: "https://patents.google.com/patent/US20260138189A1/en",
        title: "High resolution imaging process monitoring system for additive manufacturing",
      },
      {
        number: "US 2026/0138190 A1",
        url: "https://patents.google.com/patent/US20260138190A1/en",
        title:
          "Multi-camera high resolution imaging process monitoring system for additive manufacturing",
      },
      {
        number: "US 2026/0141562 A1",
        url: "https://patents.google.com/patent/US20260141562A1/en",
        title:
          "High resolution imaging calibration for process monitoring system for additive manufacturing",
      },
    ],
  },
];

export default function PatentsPage() {
  return (
    <>
      <PageHeader eyebrow="Technical Work" title="Patents and Patent Applications">
        Before becoming a full-time author, Mark Cheverton worked as a
        physicist and research engineer at GE, GE Aerospace, GE
        Plastics/SABIC Innovative Plastics, and Molecular Opto-Electronic
        Corporation. His technical work includes more than thirty U.S.
        patents and published patent applications across holography,
        automated inspection, fiber optics, sensors, and additive
        manufacturing.
      </PageHeader>

      <Container className="py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {patentGroups.map((group) => (
            <section key={group.heading}>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.patents.map((patent) => (
                  <li
                    key={patent.number}
                    className="text-[var(--color-ink-soft)] leading-relaxed"
                  >
                    <a
                      href={patent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--color-accent)] hover:underline"
                    >
                      {patent.number}
                    </a>{" "}
                    &ndash; {patent.title}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="text-sm text-[var(--color-muted)] border-t border-[var(--color-rule)] pt-6">
            This list includes issued U.S. patents and published U.S. patent
            applications. Some technologies were developed while Mark worked
            at GE, GE Aerospace, GE Plastics/SABIC Innovative Plastics, and
            Molecular Opto-Electronic Corporation. Patent ownership belongs to
            the listed assignee, not to Mark personally.
          </p>
        </div>
      </Container>
    </>
  );
}
