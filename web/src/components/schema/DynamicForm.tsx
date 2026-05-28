import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type {
  ArrayNode,
  FieldDef,
  FieldGroup,
  ObjectNode,
  PrimitiveDef,
  SwitchRow,
} from '../../schema/nitro.schema';
import { Field } from '../shared/Field';
import { FormRow } from '../shared/FormRow';
import { ItemCard } from '../shared/ItemCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

// ── Primitive renderer ────────────────────────────────────────────────────────

function PrimitiveRenderer({
  field,
  value,
  onChange,
}: {
  field: PrimitiveDef;
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  const v = value[field.key];
  const upd = (val: unknown) => onChange({ ...value, [field.key]: val });

  if (field.kind === 'boolean') {
    return (
      <div className="flex items-center gap-2 py-0.5">
        <Switch checked={!!v} onCheckedChange={upd} />
        <Label className="text-xs text-muted-foreground cursor-pointer">{field.label}</Label>
        {field.hint && (
          <span className="text-[10px] text-muted-foreground/50">{field.hint}</span>
        )}
      </div>
    );
  }

  if (field.kind === 'text') {
    return (
      <Field label={field.label} hint={field.hint}>
        <Input
          value={typeof v === 'string' ? v : (v !== undefined ? String(v) : '')}
          onChange={(e) => upd(e.target.value)}
          placeholder={field.placeholder}
        />
      </Field>
    );
  }

  if (field.kind === 'number') {
    return (
      <Field label={field.label} hint={field.hint}>
        <Input
          type="number"
          step={field.step}
          min={field.min}
          max={field.max}
          value={v !== undefined ? Number(v) : (field.default ?? 0)}
          onChange={(e) => upd(Number(e.target.value))}
          placeholder={field.placeholder}
        />
      </Field>
    );
  }

  if (field.kind === 'select') {
    const strVal = field.numericValue ? String(v ?? '') : ((v as string) ?? '');
    return (
      <Field label={field.label} hint={field.hint}>
        <Select
          value={strVal}
          onValueChange={(val) => upd(field.numericValue ? Number(val) : val)}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }

  if (field.kind === 'csv-numbers') {
    const arr = Array.isArray(v) ? (v as number[]) : [];
    return (
      <Field label={field.label} hint={field.hint}>
        <Input
          value={arr.join(',')}
          onChange={(e) => {
            const parsed = e.target.value
              .split(',')
              .map((s) => parseInt(s.trim(), 10))
              .filter((n) => !isNaN(n));
            upd(parsed);
          }}
          placeholder={field.placeholder}
        />
      </Field>
    );
  }

  if (field.kind === 'csv-strings') {
    const arr = Array.isArray(v) ? (v as string[]) : [];
    return (
      <Field label={field.label} hint={field.hint}>
        <Input
          value={arr.join(',')}
          onChange={(e) => {
            const parts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
            upd(parts);
          }}
          placeholder={field.placeholder}
        />
      </Field>
    );
  }

  if (field.kind === 'json') {
    return (
      <Field label={field.label} hint={field.hint}>
        <Textarea
          className="font-mono text-xs"
          rows={field.rows ?? 3}
          value={v !== undefined ? JSON.stringify(v, null, 2) : ''}
          onChange={(e) => {
            try {
              upd(JSON.parse(e.target.value));
            } catch {
              // ignore parse errors while typing
            }
          }}
        />
      </Field>
    );
  }

  return null;
}

// ── Inline array node ─────────────────────────────────────────────────────────

function InlineArrayNode({
  field,
  value,
  onChange,
}: {
  field: ArrayNode;
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  const items = (Array.isArray(value[field.key]) ? (value[field.key] as Record<string, unknown>[]) : []);

  const add = () => onChange({ ...value, [field.key]: [...items, { ...field.defaultItem }] });
  const remove = (i: number) => onChange({ ...value, [field.key]: items.filter((_, idx) => idx !== i) });
  const update = (i: number, item: Record<string, unknown>) => {
    const next = [...items];
    next[i] = item;
    onChange({ ...value, [field.key]: next });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground/75">
            {field.label}
          </span>
          {items.length > 0 && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 tabular-nums">
              {items.length}
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={add}
          title={field.addLabel ?? `Add ${field.label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {items.length === 0 && field.emptyText && (
        <p className="text-xs text-muted-foreground/60 text-center py-3 border border-dashed border-border/50 rounded-md">
          {field.emptyText}
        </p>
      )}

      <div className="space-y-1.5">
        {items.map((item, i) => {
          const title = field.labelKey
            ? String(item[field.labelKey] ?? `Item ${i}`)
            : `Item ${i}`;
          return (
            <ItemCard
              key={i}
              index={i}
              title={title}
              onRemove={() => remove(i)}
            >
              <DynamicForm
                schema={field.fields}
                value={item}
                onChange={(v) => update(i, v)}
              />
            </ItemCard>
          );
        })}
      </div>
    </div>
  );
}

// ── Field renderer ────────────────────────────────────────────────────────────

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  if (field.kind === 'group') {
    const f = field as FieldGroup;
    return (
      <FormRow cols={f.cols}>
        {f.fields.map((pf, i) => (
          <PrimitiveRenderer key={i} field={pf} value={value} onChange={onChange} />
        ))}
      </FormRow>
    );
  }

  if (field.kind === 'switch-row') {
    const f = field as SwitchRow;
    return (
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {f.fields.map((sf) => (
          <label key={sf.key} className="flex items-center gap-2 cursor-pointer">
            <Switch
              checked={!!value[sf.key]}
              onCheckedChange={(checked) => onChange({ ...value, [sf.key]: checked })}
            />
            <span className="text-xs text-muted-foreground">{sf.label}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.kind === 'object') {
    const f = field as ObjectNode;
    const nested = (value[f.key] ?? {}) as Record<string, unknown>;
    return (
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground/70">
          {f.label}
        </p>
        <div className="space-y-3 pl-3 border-l border-border/40">
          <DynamicForm
            schema={f.fields}
            value={nested}
            onChange={(v) => onChange({ ...value, [f.key]: v })}
          />
        </div>
      </div>
    );
  }

  if (field.kind === 'array') {
    return (
      <InlineArrayNode field={field as ArrayNode} value={value} onChange={onChange} />
    );
  }

  // Primitive
  return <PrimitiveRenderer field={field as PrimitiveDef} value={value} onChange={onChange} />;
}

// ── DynamicForm ───────────────────────────────────────────────────────────────

export function DynamicForm({
  schema,
  value,
  onChange,
}: {
  schema: FieldDef[];
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      {schema.map((f, i) => (
        <FieldRenderer key={i} field={f} value={value} onChange={onChange} />
      ))}
    </div>
  );
}

// ── ArraySection ──────────────────────────────────────────────────────────────

export function ArraySection({
  schema,
  items,
  labelKey,
  defaultItem,
  addLabel,
  emptyText,
  onChange,
}: {
  schema: FieldDef[];
  items: Record<string, unknown>[];
  labelKey?: string;
  defaultItem: Record<string, unknown>;
  addLabel?: string;
  emptyText?: string;
  onChange: (v: Record<string, unknown>[]) => void;
}) {
  const add = () => onChange([...items, { ...defaultItem }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, item: Record<string, unknown>) => {
    const next = [...items];
    next[i] = item;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <SectionHeader
        count={items.length}
        onAdd={add}
        addLabel={addLabel ?? 'Add'}
      />

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
          {emptyText ?? 'No items yet. Click Add to get started.'}
        </p>
      )}

      <div className="space-y-2">
        {items.map((item, i) => {
          const title = labelKey
            ? String(item[labelKey] ?? `Item ${i}`)
            : `Item ${i}`;
          return (
            <ItemCard
              key={i}
              index={i}
              title={title}
              onRemove={() => remove(i)}
            >
              <DynamicForm
                schema={schema}
                value={item}
                onChange={(v) => update(i, v)}
              />
            </ItemCard>
          );
        })}
      </div>
    </div>
  );
}

// Re-export for convenience
export type { FieldDef };
