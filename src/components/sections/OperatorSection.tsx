import { Fragment } from "react";
import QslCard from "./QslCard";
import type { Intro, Skill } from "@/lib/api";
import { WRAP, LABEL } from "@/lib/station";

type Props = {
  intro: Intro | null;
  skills: Skill[];
};

export default function OperatorSection({ intro, skills }: Props) {
  return (
    <section id="operator" className="bg-tx-haze">
      <div className={`${WRAP} py-20 md:py-[110px] grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-[72px] items-center`}>
        <div className="px-2 sm:px-4">
          <QslCard intro={intro} />
        </div>

        <div className="flex flex-col gap-6">
          <span className={`${LABEL} text-tx-signal font-bold`}>OPERATOR PROFILE</span>
          {intro?.bio && (
            <p className="m-0 font-display font-light text-[30px] md:text-[40px] leading-[1.15] whitespace-pre-wrap">
              {intro.bio}
            </p>
          )}
          {skills.length > 0 && (
            <dl className="m-0 grid grid-cols-2 border-t border-tx-ink">
              {skills.map((skill) => (
                <Fragment key={skill.id}>
                  <dt className="py-3 pr-4 border-b border-tx-rule uppercase">{skill.label}</dt>
                  <dd className="m-0 py-3 border-b border-tx-rule uppercase">{skill.value}</dd>
                </Fragment>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
