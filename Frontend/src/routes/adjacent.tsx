import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/SiteChrome";
import { newId, useCollection } from "@/lib/content-store";
import {
  AddButton,
  EditToolbar,
  ItemControls,
  RecordDialog,
  ResetButton,
  type Field,
} from "@/components/ContentEditor";

export const Route = createFileRoute("/adjacent")({
  head: () => ({
    meta: [
      { title: "Adjacent Characters — The Amazing Web" },
      {
        name: "description",
        content:
          "Daredevil, Deadpool and Venom: Marvel characters tied closely to Spider-Man's world, clearly labelled as connected but not core Spider-Verse.",
      },
      { property: "og:title", content: "Spider-Adjacent Characters" },
      {
        property: "og:description",
        content:
          "Connected, not core: the characters who share Spider-Man's city and enemies without holding a Spider-Verse Earth of their own.",
      },
    ],
  }),
  component: Adjacent,
});

type Adjacent = {
  id: string;
  name: string;
  realName: string;
  label: string;
  why: string;
  firstAppearance: string;
};

const fields: Field[] = [
  { key: "name", label: "Name" },
  { key: "realName", label: "Real name" },
  { key: "label", label: "Label", placeholder: "Connected, not core Spider-Verse" },
  { key: "why", label: "Why they're here", type: "textarea" },
  { key: "firstAppearance", label: "First appearance" },
];

const seedAdjacent: Adjacent[] = [
  {
    id: "daredevil",
    name: "Daredevil",
    realName: "Matt Murdock",
    label: "Connected, not core Spider-Verse",
    why: "Shares Hell's Kitchen with Spider-Man, has teamed up countless times, and their rogues' galleries overlap (Kingpin, Electro). Close enough to be family, but his story runs on its own track.",
    firstAppearance: "Daredevil #1 (1964)",
  },
  {
    id: "venom-eddie",
    name: "Venom",
    realName: "Eddie Brock",
    label: "Symbiote spin-off",
    why: "Born from Spider-Man's alien costume, Venom became his own franchise — anti-hero, lethal protector, sometimes outright villain. His origin is inseparable from Peter Parker's.",
    firstAppearance: "The Amazing Spider-Man #300 (1988)",
  },
  {
    id: "deadpool",
    name: "Deadpool",
    realName: "Wade Wilson",
    label: "Frequent crossover partner",
    why: "Not part of the Spider-Verse, but shares Spider-Man's wisecracks, fourth-wall breaks, and a long history of team-ups. Their buddy-cop dynamic is a fan favourite.",
    firstAppearance: "The New Mutants #98 (1991)",
  },
];

function Adjacent() {
  const store = useCollection<Adjacent>("adjacent", seedAdjacent);
  const [editing, setEditing] = useState<Adjacent | null>(null);
  const [open, setOpen] = useState(false);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        eyebrow="Connected, not core"
        title="ADJACENT CHARACTERS"
        intro="These characters orbit Spider-Man's corner of Marvel without belonging to the Spider-Verse itself. Listed here so the boundary stays honest."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <EditToolbar>
          <AddButton label="Add character" onClick={openNew} />
          {store.hasChanges && <ResetButton onClick={store.resetAll} />}
        </EditToolbar>

        <div className="grid gap-4 md:grid-cols-3">
          {store.items.map((character) => (
            <article key={character.id} className="ink-panel relative rounded-lg p-6">
              <ItemControls
                className="absolute right-4 top-4"
                label={character.name}
                onEdit={() => {
                  setEditing(character);
                  setOpen(true);
                }}
                onDelete={() => store.remove(character.id)}
              />
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-accent">
                {character.label}
              </p>
              <h2 className="mt-2 pr-20 text-3xl leading-none">{character.name.toUpperCase()}</h2>
              <p className="mt-1 font-mono text-[0.7rem] text-muted-foreground">
                {character.realName}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{character.why}</p>
              <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-foreground/70">
                First appearance · {character.firstAppearance}
              </p>
            </article>
          ))}
        </div>
      </div>

      <RecordDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Edit ${editing.name}` : "Add adjacent character"}
        description="Saved in this browser only."
        fields={fields}
        initial={editing ?? undefined}
        onSave={(values) => {
          if (editing) store.update(editing.id, values as Partial<Adjacent>);
          else store.create({ id: newId("adjacent"), ...(values as Omit<Adjacent, "id">) });
        }}
      />
    </>
  );
}
