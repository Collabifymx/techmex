import { ProjectComments } from "@/components/project-comments";
import { ProjectLikeButton } from "@/components/project-like-button";
import { ExternalLinkIcon, InstagramIcon, TikTokIcon, XIcon } from "@/components/icons";
import { socialKindLabel, socialUrl } from "@/lib/socials";
import type { Company, ProjectComment, SocialNetwork } from "@/lib/types";
import { FEATURED_PROJECT, isFeaturedProject } from "@/lib/featured";
import { formatNumber, formatPlace, formatPublishedOn } from "@/lib/utils";

export function ProjectProfile({
  company,
  comments,
}: {
  company: Company;
  comments: ProjectComment[];
}) {
  const place = formatPlace(company.city, company.state);

  return (
    <article className="border border-white/10 bg-[#070a07]">
      <div className="grid gap-px bg-white/10 sm:grid-cols-[140px_1fr]">
        <div
          className="flex items-center justify-center p-6"
          style={{ backgroundColor: company.iconBg }}
        >
          {company.iconUrl ? (
            <img
              src={company.iconUrl}
              alt=""
              className="h-20 w-20 object-cover"
            />
          ) : (
            <span className="text-3xl font-semibold text-white">
              {company.initials}
            </span>
          )}
        </div>
        <div className="bg-[#070a07] px-5 py-6 sm:px-7">
          <p className="mono text-[11px] tracking-[0.18em] text-mint">
            01 / FICHA · TECHMEX
          </p>
          {isFeaturedProject(company.slug) ? (
            <p className="mono mt-2 text-[10px] tracking-[0.16em] text-mute">
              DESTACADO DEL MES · {FEATURED_PROJECT.monthLabel.toUpperCase()}
            </p>
          ) : null}
          <h1 className="display mt-3 text-4xl text-white sm:text-6xl">
            {company.name}
          </h1>
          <p className="mt-4 text-sm text-mute">
            Publicado {formatPublishedOn(company.createdAt)}
          </p>
        </div>
      </div>

      <div className="space-y-10 border-t border-white/10 px-5 py-8 sm:px-7">
        <section>
          <p className="mono text-[11px] tracking-[0.18em] text-mint">
            02 / BRIEF
          </p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white">
            {company.description}
          </p>
          {company.tags.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {company.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono border border-white/10 px-2.5 py-1 text-[10px] tracking-[0.12em] text-mute"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section>
          <p className="mono text-[11px] tracking-[0.18em] text-mint">
            03 / DATOS
          </p>
          <dl className="mt-4 grid gap-px bg-white/10 sm:grid-cols-2">
            <Fact label="Categoría" value={company.category} />
            <Fact label="Lugar" value={place || "México"} />
            <Fact label="Sitio" value={hostOf(company.url)} />
            <Fact label="Clicks" value={formatNumber(company.clicks)} />
          </dl>
        </section>

        {company.founderName || company.socials.length ? (
          <section>
            <p className="mono text-[11px] tracking-[0.18em] text-mint">
              04 / FOUNDER
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {company.founderName ? (
                <div className="flex items-center gap-3">
                  {company.founderPhotoUrl ? (
                    <img
                      src={company.founderPhotoUrl}
                      alt=""
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center bg-black/40 text-sm font-semibold text-mute">
                      {founderInitials(company.founderName)}
                    </span>
                  )}
                  <div>
                    <p className="mono text-[10px] tracking-[0.14em] text-mute">
                      NOMBRE
                    </p>
                    <p className="text-sm text-white">{company.founderName}</p>
                  </div>
                </div>
              ) : null}
              {company.socials.map((link) => (
                <a
                  key={`${link.network}-${link.kind}`}
                  href={socialUrl(link)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-[13px] text-mute hover:border-mint/40 hover:text-mint"
                >
                  <SocialMark network={link.network} />
                  @{link.handle}
                  <span className="mono text-[9px] tracking-[0.12em]">
                    {socialKindLabel(link.kind).toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <p className="mono text-[11px] tracking-[0.18em] text-mint">
            05 / SEÑALES
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="border border-white/10 bg-black/25 px-4 py-3">
              <p className="mono text-[10px] tracking-[0.16em] text-mute">
                CLICKS
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {formatNumber(company.clicks)}
              </p>
              <p className="mono mt-1 text-[10px] tracking-[0.14em] text-mute">
                VISITAS AL SITIO
              </p>
            </div>
            <ProjectLikeButton slug={company.slug} likes={company.likes} />
          </div>
        </section>

        <section>
          <p className="mono text-[11px] tracking-[0.18em] text-mint">
            06 / SALIDA
          </p>
          <a
            href={`/go/${company.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-4 py-3.5 text-xl"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            VISITAR SITIO
          </a>
        </section>

        <ProjectComments slug={company.slug} comments={comments} />
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#070a07] px-4 py-3">
      <dt className="mono text-[10px] tracking-[0.14em] text-mute">{label}</dt>
      <dd className="mt-1 text-sm text-white">{value}</dd>
    </div>
  );
}

function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function founderInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function SocialMark({ network }: { network: SocialNetwork }) {
  if (network === "instagram") return <InstagramIcon />;
  if (network === "tiktok") return <TikTokIcon />;
  return <XIcon />;
}
