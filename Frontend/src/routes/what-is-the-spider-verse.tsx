import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/SiteChrome";
import { type Earth } from "@/data/spiderverse";
import { newId, useCollection } from "@/lib/content-store";
import {
  AddButton,
  EditToolbar,
  ItemControls,
  RecordDialog,
  ResetButton,
  type Field,
} from "@/components/ContentEditor";

export const Route = createFileRoute("/what-is-the-spider-verse")({
  head: () => ({
    meta: [
      { title: "What Is the Spider-Verse? — The Amazing Web" },
      {
        name: "description",
        content:
          "A short explainer on the Spider-Verse multiverse concept, why so many Spider-People exist, and how the Earth-### numbering system labels each universe.",
      },
      { property: "og:title", content: "What Is the Spider-Verse?" },
      {
        property: "og:description",
        content:
          "The multiverse concept explained, plus how Earth-### designations keep every parallel world straight.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WhatIsIt,
});

type Explainer = { id: string; title: string; body: string };

const seedSections: Explainer[] = [
  {
    id: "explainer-retold",
    title: "ONE STORY, RE-TOLD FOREVER",
    body: "A spider bites someone; power arrives with a cost. That premise has been re-told for six decades by different writers, in different decades, for different readers. Rather than throw old versions away, the comics decided that all of them happened — each in its own universe.",
  },
  {
    id: "explainer-what",
    title: "SO WHAT IS 'THE SPIDER-VERSE'?",
    body: "It's the name for the whole set of those versions taken together, and for the stories where they meet. When a crossover pulls a noir detective, a mech pilot, a cartoon pig and two teenagers into the same room, the joke and the point are the same: the mask fits anybody.",
  },
  {
    id: "explainer-numbering",
    title: "READING 'EARTH-###'",
    body: "Every parallel world gets a numeric designation. Earth-616 is the mainstream continuity; Earth-1610 is the restarted Ultimate line; Earth-65 is Gwen Stacy's world. The numbers are labels, not rankings — a low number doesn't mean an earlier or more important universe.",
  },
  {
    id: "explainer-branches",
    title: "WHY BRANCHES, NOT A LIST",
    body: "A flat list hides the shape. Most alternate Earths are recognisably a divergence from the main line: one decision, one death, one decade changed. Drawing them as branches off a trunk shows where each split happened, and crossovers become what they actually are — moments where two branches briefly touch.",
  },
];

const sectionFields: Field[] = [
  { key: "title", label: "Heading", placeholder: "WHY BRANCHES, NOT A LIST" },
  { key: "body", label: "Text", type: "textarea" },
];

const earthFields: Field[] = [
  { key: "designation", label: "Designation", placeholder: "Earth-616" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "primaryCharacter", label: "Primary character" },
  { key: "hex", label: "Accent colour (hex)", placeholder: "#e2334b" },
];

function WhatIsIt() {
  const sectionStore = useCollection<Explainer>("explainer-sections", seedSections);
  const earthStore = useCollection<Earth>("earths");

  const [sectionOpen, setSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Explainer | null>(null);
  const [earthOpen, setEarthOpen] = useState(false);
  const [editingEarth, setEditingEarth] = useState<Earth | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="The concept"
        title="WHAT IS THE SPIDER-VERSE"
        intro="If you're new to the idea of a multiverse full of Spider-People, start here. Short answers, then the map."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <EditToolbar>
          <AddButton
            label="Add section"
            onClick={() => {
              setEditingSection(null);
              setSectionOpen(true);
            }}
          />
          {sectionStore.hasChanges && <ResetButton onClick={sectionStore.resetAll} />}
        </EditToolbar>

        <div className="grid gap-4 md:grid-cols-2">
          {sectionStore.items.map((section, i) => (
            <article key={section.id} className="ink-panel relative rounded-lg p-6">
              <ItemControls
                className="absolute right-4 top-4"
                label={section.title}
                onEdit={() => {
                  setEditingSection(section);
                  setSectionOpen(true);
                }}
                onDelete={() => sectionStore.remove(section.id)}
              />
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 pr-20 text-3xl leading-none">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </div>

        <h2 className="mt-16 text-4xl leading-none">THE UNIVERSES ON THIS SITE</h2>
        <div className="mt-6">
          <EditToolbar>
            <AddButton
              label="Add universe"
              onClick={() => {
                setEditingEarth(null);
                setEarthOpen(true);
              }}
            />
            {earthStore.hasChanges && <ResetButton onClick={earthStore.resetAll} />}
          </EditToolbar>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {earthStore.items.map((earth) => (
              <li key={earth.id} className="ink-panel relative rounded-lg p-4">
                <ItemControls
                  className="absolute right-3 top-3"
                  label={earth.designation}
                  onEdit={() => {
                    setEditingEarth(earth);
                    setEarthOpen(true);
                  }}
                  onDelete={() => earthStore.remove(earth.id)}
                />
                <div className="flex items-center gap-2 pr-20">
                  <span
                    aria-hidden
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: earth.hex, boxShadow: `0 0 12px ${earth.hex}` }}
                  />
                  <p className="font-display text-lg leading-none">{earth.designation}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {earth.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/directory"
            className="rounded-full bg-primary px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground"
          >
            Meet the spider-people
          </Link>
          <Link
            to="/timeline"
            className="rounded-full border border-border px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-foreground/85 hover:border-accent"
          >
            See the branching timeline
          </Link>
        </div>
      </div>

      <RecordDialog
        open={sectionOpen}
        onOpenChange={setSectionOpen}
        title={editingSection ? `Edit ${editingSection.title}` : "Add a section"}
        description="Saved in this browser only."
        fields={sectionFields}
        initial={editingSection ?? undefined}
        onSave={(values) => {
          if (editingSection) sectionStore.update(editingSection.id, values as Partial<Explainer>);
          else
            sectionStore.create({
              id: newId("explainer"),
              ...(values as Omit<Explainer, "id">),
            });
        }}
      />

      <RecordDialog
        open={earthOpen}
        onOpenChange={setEarthOpen}
        title={editingEarth ? `Edit ${editingEarth.designation}` : "Add a universe"}
        description="Saved in this browser only."
        fields={earthFields}
        initial={editingEarth ?? { hex: "#7c5cff" }}
        onSave={(values) => {
          if (editingEarth) earthStore.update(editingEarth.id, values as Partial<Earth>);
          else
            earthStore.create({
              id: newId("earth"),
              colorVar: "--branch-accent",
              ...(values as Omit<Earth, "id" | "colorVar">),
            });
        }}
      />
    </>
  );
}
