import { X } from 'lucide-react';
import type {
  IAssetDimension,
  IAssetLogicData,
  IAssetLogicPlanetSystem,
  IParticleSystem,
  IParticleSystemEmitter,
  IParticleSystemParticle,
  IParticleSystemSimulation,
} from '../../types/nitro';
import { useAssetStore } from '../../store/assetStore';
import { Field } from '../shared/Field';
import { FormRow } from '../shared/FormRow';
import { ItemCard } from '../shared/ItemCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

// ── Model ─────────────────────────────────────────────────────────────────────

function ModelEditor({ model, onChange }: { model: IAssetLogicData['model']; onChange: (m: IAssetLogicData['model']) => void }) {
  const dim: IAssetDimension = model?.dimensions ?? { x: 1, y: 1, z: 115 };
  const dirs: number[] = model?.directions ?? [];

  const updDim = (partial: Partial<IAssetDimension>) =>
    onChange({ ...model, dimensions: { ...dim, ...partial } });

  const dirStr = dirs.join(',');

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dimensions</p>
      <FormRow cols={4}>
        <Field label="X">
          <Input type="number" value={dim.x} onChange={(e) => updDim({ x: Number(e.target.value) })} />
        </Field>
        <Field label="Y">
          <Input type="number" value={dim.y} onChange={(e) => updDim({ y: Number(e.target.value) })} />
        </Field>
        <Field label="Z">
          <Input type="number" value={dim.z ?? ''} onChange={(e) => updDim({ z: e.target.value ? Number(e.target.value) : undefined })} placeholder="opt" />
        </Field>
        <Field label="Center Z">
          <Input type="number" value={dim.centerZ ?? ''} onChange={(e) => updDim({ centerZ: e.target.value ? Number(e.target.value) : undefined })} placeholder="opt" />
        </Field>
      </FormRow>
      <Field label="Directions (comma-separated)" hint="Valid directions: 0,2,4,6 for 4-dir; 0,1,2,3,4,5,6,7 for 8-dir">
        <Input
          value={dirStr}
          onChange={(e) =>
            onChange({
              ...model,
              directions: e.target.value
                .split(',')
                .map((s) => parseInt(s.trim()))
                .filter((n) => !isNaN(n)),
            })
          }
          placeholder="0,2,4,6"
        />
      </Field>
    </div>
  );
}

// ── Planet System ─────────────────────────────────────────────────────────────

function PlanetSystemEntry({
  ps,
  index,
  onChange,
  onRemove,
}: {
  ps: IAssetLogicPlanetSystem;
  index: number;
  onChange: (p: IAssetLogicPlanetSystem) => void;
  onRemove: () => void;
}) {
  const upd = (partial: Partial<IAssetLogicPlanetSystem>) => onChange({ ...ps, ...partial });
  return (
    <ItemCard title={ps.name ?? `Planet ${index}`} onRemove={onRemove} index={index}>
      <FormRow cols={2}>
        <Field label="ID">
          <Input type="number" value={ps.id ?? 0} onChange={(e) => upd({ id: Number(e.target.value) })} />
        </Field>
        <Field label="Name">
          <Input value={ps.name ?? ''} onChange={(e) => upd({ name: e.target.value })} />
        </Field>
      </FormRow>
      <FormRow cols={2}>
        <Field label="Parent">
          <Input value={ps.parent ?? ''} onChange={(e) => upd({ parent: e.target.value })} placeholder="parent_id" />
        </Field>
        <Field label="Radius">
          <Input type="number" value={ps.radius ?? 0} onChange={(e) => upd({ radius: Number(e.target.value) })} />
        </Field>
      </FormRow>
      <FormRow cols={3}>
        <Field label="Arc Speed">
          <Input type="number" step="0.01" value={ps.arcSpeed ?? 0} onChange={(e) => upd({ arcSpeed: Number(e.target.value) })} />
        </Field>
        <Field label="Arc Offset">
          <Input type="number" step="0.01" value={ps.arcOffset ?? 0} onChange={(e) => upd({ arcOffset: Number(e.target.value) })} />
        </Field>
        <Field label="Blend">
          <Input type="number" step="0.01" min={0} max={1} value={ps.blend ?? 1} onChange={(e) => upd({ blend: Number(e.target.value) })} />
        </Field>
      </FormRow>
      <Field label="Height">
        <Input type="number" value={ps.height ?? 0} onChange={(e) => upd({ height: Number(e.target.value) })} />
      </Field>
    </ItemCard>
  );
}

// ── Particle System ───────────────────────────────────────────────────────────

function SimulationEditor({ sim, onChange }: { sim?: IParticleSystemSimulation; onChange: (s: IParticleSystemSimulation) => void }) {
  const s: IParticleSystemSimulation = sim ?? {};
  const upd = (partial: Partial<IParticleSystemSimulation>) => onChange({ ...s, ...partial });
  return (
    <div className="space-y-3 p-3 rounded-md bg-muted/30 border border-border/50">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Simulation</p>
      <FormRow cols={3}>
        <Field label="Force">
          <Input type="number" step="0.1" value={s.force ?? 0} onChange={(e) => upd({ force: Number(e.target.value) })} />
        </Field>
        <Field label="Direction">
          <Input type="number" value={s.direction ?? 0} onChange={(e) => upd({ direction: Number(e.target.value) })} />
        </Field>
        <Field label="Gravity">
          <Input type="number" step="0.1" value={s.gravity ?? 0} onChange={(e) => upd({ gravity: Number(e.target.value) })} />
        </Field>
      </FormRow>
      <FormRow cols={3}>
        <Field label="Air Friction">
          <Input type="number" step="0.01" value={s.airFriction ?? 0} onChange={(e) => upd({ airFriction: Number(e.target.value) })} />
        </Field>
        <Field label="Energy">
          <Input type="number" step="0.1" value={s.energy ?? 0} onChange={(e) => upd({ energy: Number(e.target.value) })} />
        </Field>
        <Field label="Shape">
          <Input value={s.shape ?? ''} onChange={(e) => upd({ shape: e.target.value })} placeholder="sphere" />
        </Field>
      </FormRow>
    </div>
  );
}

function ParticleEntry({
  particle,
  index,
  onChange,
  onRemove,
}: {
  particle: IParticleSystemParticle;
  index: number;
  onChange: (p: IParticleSystemParticle) => void;
  onRemove: () => void;
}) {
  const upd = (partial: Partial<IParticleSystemParticle>) => onChange({ ...particle, ...partial });
  const frames = particle.frames ?? [];
  return (
    <div className="p-3 rounded-md bg-muted/20 border border-border/40 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium">Particle {index}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <FormRow cols={2}>
        <Field label="Lifetime">
          <Input type="number" value={particle.lifeTime ?? 0} onChange={(e) => upd({ lifeTime: Number(e.target.value) })} />
        </Field>
        <Field label="Frames (comma-sep)">
          <Input
            value={frames.join(',')}
            onChange={(e) => upd({ frames: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            placeholder="frame1,frame2"
          />
        </Field>
      </FormRow>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={particle.isEmitter ?? false} onCheckedChange={(v) => upd({ isEmitter: v })} />
          <Label className="text-xs">Is Emitter</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={particle.fade ?? false} onCheckedChange={(v) => upd({ fade: v })} />
          <Label className="text-xs">Fade</Label>
        </div>
      </div>
    </div>
  );
}

function EmitterEntry({
  emitter,
  index,
  onChange,
  onRemove,
}: {
  emitter: IParticleSystemEmitter;
  index: number;
  onChange: (e: IParticleSystemEmitter) => void;
  onRemove: () => void;
}) {
  const upd = (partial: Partial<IParticleSystemEmitter>) => onChange({ ...emitter, ...partial });
  const particles = emitter.particles ?? [];
  return (
    <div className="p-3 rounded-md bg-muted/20 border border-border/40 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium">Emitter {index}: {emitter.name || '(unnamed)'}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemove}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <FormRow cols={3}>
        <Field label="ID">
          <Input type="number" value={emitter.id ?? 0} onChange={(e) => upd({ id: Number(e.target.value) })} />
        </Field>
        <Field label="Name">
          <Input value={emitter.name ?? ''} onChange={(e) => upd({ name: e.target.value })} />
        </Field>
        <Field label="Sprite ID">
          <Input type="number" value={emitter.spriteId ?? 0} onChange={(e) => upd({ spriteId: Number(e.target.value) })} />
        </Field>
      </FormRow>
      <FormRow cols={4}>
        <Field label="Max Particles">
          <Input type="number" value={emitter.maxNumParticles ?? 0} onChange={(e) => upd({ maxNumParticles: Number(e.target.value) })} />
        </Field>
        <Field label="Per Frame">
          <Input type="number" value={emitter.particlesPerFrame ?? 0} onChange={(e) => upd({ particlesPerFrame: Number(e.target.value) })} />
        </Field>
        <Field label="Burst Pulse">
          <Input type="number" value={emitter.burstPulse ?? 0} onChange={(e) => upd({ burstPulse: Number(e.target.value) })} />
        </Field>
        <Field label="Fuse Time">
          <Input type="number" value={emitter.fuseTime ?? 0} onChange={(e) => upd({ fuseTime: Number(e.target.value) })} />
        </Field>
      </FormRow>
      <SimulationEditor sim={emitter.simulation} onChange={(s) => upd({ simulation: s })} />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Particles</Label>
          <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => upd({ particles: [...particles, {}] })}>
            Add Particle
          </Button>
        </div>
        {particles.map((p, pi) => (
          <ParticleEntry
            key={pi}
            particle={p}
            index={pi}
            onChange={(v) => {
              const next = [...particles]; next[pi] = v; upd({ particles: next });
            }}
            onRemove={() => upd({ particles: particles.filter((_, idx) => idx !== pi) })}
          />
        ))}
      </div>
    </div>
  );
}

function ParticleSystemEntry({
  ps,
  index,
  onChange,
  onRemove,
}: {
  ps: IParticleSystem;
  index: number;
  onChange: (p: IParticleSystem) => void;
  onRemove: () => void;
}) {
  const upd = (partial: Partial<IParticleSystem>) => onChange({ ...ps, ...partial });
  const emitters = ps.emitters ?? [];
  return (
    <ItemCard title={`Particle System ${index}`} onRemove={onRemove} index={index}>
      <FormRow cols={4}>
        <Field label="Size">
          <Input type="number" value={ps.size ?? 0} onChange={(e) => upd({ size: Number(e.target.value) })} />
        </Field>
        <Field label="Canvas ID">
          <Input type="number" value={ps.canvasId ?? 0} onChange={(e) => upd({ canvasId: Number(e.target.value) })} />
        </Field>
        <Field label="Offset Y">
          <Input type="number" value={ps.offsetY ?? 0} onChange={(e) => upd({ offsetY: Number(e.target.value) })} />
        </Field>
        <Field label="Blend">
          <Input type="number" step="0.01" min={0} max={1} value={ps.blend ?? 1} onChange={(e) => upd({ blend: Number(e.target.value) })} />
        </Field>
      </FormRow>
      <Field label="BG Color">
        <Input value={ps.bgColor ?? ''} onChange={(e) => upd({ bgColor: e.target.value })} placeholder="#000000" />
      </Field>
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-center">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Emitters</Label>
          <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => upd({ emitters: [...emitters, { id: emitters.length }] })}>
            Add Emitter
          </Button>
        </div>
        {emitters.map((em, ei) => (
          <EmitterEntry
            key={ei}
            emitter={em}
            index={ei}
            onChange={(v) => {
              const next = [...emitters]; next[ei] = v; upd({ emitters: next });
            }}
            onRemove={() => upd({ emitters: emitters.filter((_, idx) => idx !== ei) })}
          />
        ))}
      </div>
    </ItemCard>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function LogicSection() {
  const { asset, updateAsset } = useAssetStore();
  const logic: IAssetLogicData = asset.logic ?? {};
  const upd = (partial: Partial<IAssetLogicData>) => updateAsset({ logic: { ...logic, ...partial } });

  const planetSystems = logic.planetSystems ?? [];
  const particleSystems = logic.particleSystems ?? [];
  const vars = logic.customVars?.variables ?? [];

  return (
    <div className="space-y-5">
      {/* Model */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Model</p>
        <ModelEditor model={logic.model} onChange={(m) => upd({ model: m })} />
      </div>

      <Separator />

      {/* Basic fields */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Properties</p>
        <FormRow cols={2}>
          <Field label="Mask Type" hint="Collision mask type">
            <Input value={logic.maskType ?? ''} onChange={(e) => upd({ maskType: e.target.value })} placeholder="default" />
          </Field>
          <Field label="Credits">
            <Input value={logic.credits ?? ''} onChange={(e) => upd({ credits: e.target.value })} placeholder="author" />
          </Field>
        </FormRow>
      </div>

      <Separator />

      {/* Sound */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Sound Sample</p>
        <FormRow cols={2}>
          <Field label="Sound ID">
            <Input
              type="number"
              value={logic.soundSample?.id ?? ''}
              onChange={(e) => upd({ soundSample: { ...logic.soundSample, id: Number(e.target.value) } })}
              placeholder="0"
            />
          </Field>
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-2 pb-1">
              <Switch
                checked={logic.soundSample?.noPitch ?? false}
                onCheckedChange={(v) => upd({ soundSample: { ...logic.soundSample, noPitch: v } })}
              />
              <Label className="text-xs">No Pitch</Label>
            </div>
          </div>
        </FormRow>
      </div>

      <Separator />

      {/* Action */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Action</p>
        <FormRow cols={2}>
          <Field label="Link">
            <Input value={logic.action?.link ?? ''} onChange={(e) => upd({ action: { ...logic.action, link: e.target.value } })} placeholder="action_link" />
          </Field>
          <Field label="Start State">
            <Input
              type="number"
              value={logic.action?.startState ?? 0}
              onChange={(e) => upd({ action: { ...logic.action, startState: Number(e.target.value) } })}
            />
          </Field>
        </FormRow>
      </div>

      <Separator />

      {/* Custom Vars */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Custom Variables</p>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => upd({ customVars: { variables: [...vars, ''] } })}>
            Add Var
          </Button>
        </div>
        {vars.map((v, vi) => (
          <div key={vi} className="flex gap-2">
            <Input
              value={v}
              onChange={(e) => {
                const next = [...vars]; next[vi] = e.target.value;
                upd({ customVars: { variables: next } });
              }}
              placeholder="variable_name"
            />
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => upd({ customVars: { variables: vars.filter((_, idx) => idx !== vi) } })}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {vars.length === 0 && <p className="text-xs text-muted-foreground">No custom variables.</p>}
      </div>

      <Separator />

      {/* Planet Systems */}
      <div className="space-y-3">
        <SectionHeader
          title="Planet Systems"
          count={planetSystems.length}
          onAdd={() => upd({ planetSystems: [...planetSystems, { id: planetSystems.length }] })}
          addLabel="Add Planet"
        />
        {planetSystems.map((ps, i) => (
          <PlanetSystemEntry
            key={i}
            ps={ps}
            index={i}
            onChange={(v) => {
              const next = [...planetSystems]; next[i] = v; upd({ planetSystems: next });
            }}
            onRemove={() => upd({ planetSystems: planetSystems.filter((_, idx) => idx !== i) })}
          />
        ))}
        {planetSystems.length === 0 && <p className="text-xs text-muted-foreground">No planet systems.</p>}
      </div>

      <Separator />

      {/* Particle Systems */}
      <div className="space-y-3">
        <SectionHeader
          title="Particle Systems"
          count={particleSystems.length}
          onAdd={() => upd({ particleSystems: [...particleSystems, { size: 1, emitters: [] }] })}
          addLabel="Add System"
        />
        {particleSystems.map((ps, i) => (
          <ParticleSystemEntry
            key={i}
            ps={ps}
            index={i}
            onChange={(v) => {
              const next = [...particleSystems]; next[i] = v; upd({ particleSystems: next });
            }}
            onRemove={() => upd({ particleSystems: particleSystems.filter((_, idx) => idx !== i) })}
          />
        ))}
        {particleSystems.length === 0 && <p className="text-xs text-muted-foreground">No particle systems.</p>}
      </div>
    </div>
  );
}
