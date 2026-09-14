import { useEffect, useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsAdmin } from "@/hooks/use-admin";

export type FieldType = "text" | "textarea" | "number" | "list" | "select" | "image";

export type Field = {
  key: string;
  label: string;
  type?: FieldType | undefined;
  placeholder?: string | undefined;
  options?: Array<{ value: string; label: string }> | undefined;
  hint?: string | undefined;
};

type Values = Record<string, unknown>;

function toInput(value: unknown, type: FieldType): string {
  if (value === undefined || value === null) return "";
  if (type === "list") return Array.isArray(value) ? value.join(", ") : String(value);
  return String(value);
}

function fromInput(raw: string, type: FieldType): unknown {
  if (type === "number") return Number(raw) || 0;
  if (type === "list")
    return raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  return raw;
}

export function RecordDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | undefined;
  fields: Field[];
  initial?: Values | undefined;
  onSave: (values: Values) => void;
}) {
  const isAdmin = useIsAdmin();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const next: Record<string, string> = {};
    for (const field of fields) {
      next[field.key] = toInput(initial?.[field.key], field.type ?? "text");
    }
    setDraft(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleUpload = async (key: string, file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const finalUrl = data.url.startsWith('http') ? data.url : "http://localhost:3001" + data.url;
        setDraft((d) => ({ ...d, [key]: finalUrl }));
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const submit = () => {
    const values: Values = {};
    for (const field of fields) {
      values[field.key] = fromInput(draft[field.key] ?? "", field.type ?? "text");
    }
    onSave(values);
    onOpenChange(false);
  };

  const inputClass =
    "mt-1.5 w-full rounded-md border border-input bg-background/70 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent";

  if (!isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">
          {fields.map((field) => {
            const type = field.type ?? "text";
            return (
              <label key={field.key} className="block">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                  {field.label}
                </span>
                {type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={draft[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    className={inputClass}
                  />
                ) : type === "select" ? (
                  <select
                    value={draft[field.key] ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    className={inputClass}
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : type === "image" ? (
                  <div className="mt-2 flex flex-col gap-3">
                    {draft[field.key] ? (
                      <div className="relative h-32 w-32 overflow-hidden rounded-md border border-border bg-background/50">
                        <img 
                          src={draft[field.key]} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                          }}
                        />
                      </div>
                    ) : null}
                    <label className={`w-fit shrink-0 flex items-center justify-center rounded border border-border px-4 py-2 text-sm font-medium transition-colors ${isUploading ? 'bg-background/20 text-muted-foreground/50 cursor-not-allowed' : 'cursor-pointer bg-background/50 text-foreground hover:bg-accent/10 hover:border-accent/50'}`}>
                      {isUploading ? 'Uploading to Cloud...' : (draft[field.key] ? 'Change Image' : 'Upload Image')}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(field.key, file);
                        }} 
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    type={type === "number" ? "number" : "text"}
                    value={draft[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    className={inputClass}
                  />
                )}
                {field.hint && (
                  <span className="mt-1 block text-[0.7rem] text-muted-foreground">
                    {field.hint}
                  </span>
                )}
              </label>
            );
          })}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isUploading}
            className={`rounded-full px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-transform ${isUploading ? 'bg-primary/50 text-primary-foreground/50 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:scale-[1.03]'}`}
          >
            {isUploading ? 'Wait...' : 'Save'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-accent/20"
    >
      <Plus className="size-3.5" aria-hidden />
      {label}
    </button>
  );
}

export function ResetButton({ onClick }: { onClick: () => void }) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
    >
      <RotateCcw className="size-3.5" aria-hidden />
      Undo my changes
    </button>
  );
}

/** Small edit / delete pair, positioned by the parent. */
export function ItemControls({
  onEdit,
  onDelete,
  label,
  className = "",
}: {
  onEdit: () => void;
  onDelete?: (() => void) | undefined;
  label: string;
  className?: string;
}) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        aria-label={`Edit ${label}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
        className="rounded-full border border-border bg-background/80 p-1.5 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
      >
        <Pencil className="size-3.5" aria-hidden />
      </button>
      {onDelete && (
        <button
          type="button"
          aria-label={`Delete ${label}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm(`Delete "${label}"?`)) onDelete();
          }}
          className="rounded-full border border-border bg-background/80 p-1.5 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
        >
          <Trash2 className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}

export function EditToolbar({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return <div className="mb-6 flex flex-wrap items-center gap-3">{children}</div>;
}
