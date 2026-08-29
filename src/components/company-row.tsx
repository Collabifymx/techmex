"use client";

import { useState } from "react";
import {
  EyeIcon,
  InstagramIcon,
  TikTokIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons";
import { socialKindLabel, socialUrl } from "@/lib/socials";
import type { Company, SocialLink, SocialNetwork } from "@/lib/types";
import { formatNumber, formatPlace } from "@/lib/utils";

export function CompanyRow({ company }: { company: Company }) {
  const [clicks, setClicks] = useState(company.clicks);
  const hasFounder = Boolean(company.founderName);
  const hasSocials = company.socials.length > 0;

  return (
    <article className="surface overflow-hidden">
      <a
        href={`/go/${company.slug}`}
        target="_blank"
        rel="noreferrer"
        onClick={() => setClicks((value) => value + 1)}
        className="block px-4 py-5 sm:px-5"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          {company.iconUrl ? (
            <img
              src={company.iconUrl}
              alt=""
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: company.iconBg }}
            >
              {company.initials}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="min-w-0">
                <h3 className="break-words text-[17px] font-semibold text-white">
                  {company.name}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mute">
                  <span className="inline-flex items-center gap-1.5">
                    <UsersIcon />
                    {formatNumber(clicks)} clicks
                  </span>
                  {formatPlace(company.city, company.state) ? (
                    <span>{formatPlace(company.city, company.state)}</span>
                  ) : null}
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[12px] text-mute">
                <EyeIcon />
                {company.category}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 break-words text-mute">
              {company.description}
            </p>
            {company.tags.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {company.tags.map((tag) => (
                  <span
                    key={tag}
                    className="mono rounded-full border border-white/10 px-2.5 py-1 text-[10px] tracking-[0.12em] text-mute"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </a>

      {hasFounder || hasSocials ? (
        <div className="flex flex-col gap-3 border-t border-white/6 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          {hasFounder ? (
            <div className="flex min-w-0 items-center gap-2.5">
              {company.founderPhotoUrl ? (
                <img
                  src={company.founderPhotoUrl}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40 text-[10px] font-semibold text-mute">
                  {founderInitials(company.founderName ?? "")}
                </span>
              )}
              <div className="min-w-0">
                <p className="mono text-[10px] tracking-[0.14em] text-mute">
                  FOUNDER
                </p>
                <p className="truncate text-sm text-white">{company.founderName}</p>
              </div>
            </div>
          ) : (
            <span />
          )}

          {hasSocials ? (
            <div className="flex flex-wrap gap-2">
              {company.socials.map((link) => (
                <SocialChip key={`${link.network}-${link.kind}`} link={link} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function SocialChip({ link }: { link: SocialLink }) {
  return (
    <a
      href={socialUrl(link)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[12px] text-mute hover:border-mint/40 hover:text-mint"
    >
      <SocialMark network={link.network} />
      <span>@{link.handle}</span>
      <span className="mono text-[9px] tracking-[0.12em] text-mute/80">
        {socialKindLabel(link.kind).toUpperCase()}
      </span>
    </a>
  );
}

function SocialMark({ network }: { network: SocialNetwork }) {
  if (network === "instagram") return <InstagramIcon />;
  if (network === "tiktok") return <TikTokIcon />;
  return <XIcon />;
}

function founderInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
