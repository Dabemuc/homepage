import { Fragment } from "react";
import QslCard from "./QslCard";
import type { Intro, Skill } from "@/lib/api";
import { SECTION_WRAP, LABEL } from "@/lib/station";

type Props = {
  intro: Intro | null;
  skills: Skill[];
};

/** QSL card across the top, then the bio and the skills ("equipment") side by side. */
export default function OperatorSection({ intro, skills }: Props) {
  return (
    <section id="operator" className="bg-tx-haze">
      <div className={`${SECTION_WRAP} py-14 lg:py-10 flex flex-col gap-12 lg:gap-10`}>
        <div className="px-2 sm:px-4">
          <QslCard intro={intro} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[72px] items-start">
          <div className="flex flex-col gap-5">
            <span className={`${LABEL} text-tx-signal font-bold`}>OPERATOR PROFILE</span>
            {intro?.bio && (
              <p className="m-0 font-display font-light text-[26px] md:text-[30px] lg:text-[28px] leading-[1.2] whitespace-pre-wrap">
                {intro.bio}
              </p>
            )}
          </div>

          {skills.length > 0 && (
            <div className="flex flex-col gap-5">
              <span className={`${LABEL} text-tx-signal font-bold`}>EQUIPMENT</span>
              <dl className="m-0 grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] border-t border-tx-ink">
                {skills.map((skill) => (
                  <Fragment key={skill.id}>
                    <dt className="py-2.5 lg:py-2 pr-4 border-b border-tx-rule uppercase">{skill.label}</dt>
                    <dd className="m-0 py-2.5 lg:py-2 border-b border-tx-rule uppercase">{skill.value}</dd>
                  </Fragment>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
