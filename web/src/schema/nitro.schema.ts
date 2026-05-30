// ── Schema type system ────────────────────────────────────────────────────────

export type FieldDef = PrimitiveDef | FieldGroup | SwitchRow | ObjectNode | ArrayNode;

export type PrimitiveDef =
  | { kind: 'text'; key: string; label: string; hint?: string; placeholder?: string; default?: string }
  | { kind: 'number'; key: string; label: string; hint?: string; placeholder?: string; step?: number; min?: number; max?: number; default?: number }
  | { kind: 'boolean'; key: string; label: string; hint?: string; default?: boolean }
  | { kind: 'select'; key: string; label: string; hint?: string; options: string[]; numericValue?: boolean; placeholder?: string }
  | { kind: 'csv-numbers'; key: string; label: string; hint?: string; placeholder?: string }
  | { kind: 'csv-strings'; key: string; label: string; hint?: string; placeholder?: string }
  | { kind: 'json'; key: string; label: string; hint?: string; rows?: number };

export interface FieldGroup {
  kind: 'group';
  cols: 2 | 3 | 4;
  fields: PrimitiveDef[];
}

export interface SwitchRow {
  kind: 'switch-row';
  fields: Array<{ key: string; label: string; hint?: string }>;
}

export interface ObjectNode {
  kind: 'object';
  key: string;
  label: string;
  hint?: string;
  fields: FieldDef[];
}

export interface ArrayNode {
  kind: 'array';
  key: string;
  label: string;
  hint?: string;
  labelKey?: string;
  defaultItem: Record<string, unknown>;
  fields: FieldDef[];
  addLabel?: string;
  emptyText?: string;
}

// ── GENERAL_SCHEMA ────────────────────────────────────────────────────────────

export const GENERAL_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'name', label: 'Name', hint: 'Unique asset identifier', placeholder: 'my_asset' },
      { kind: 'select', key: 'type', label: 'Type', options: ['furniture', 'figure', 'effect', 'pet', 'badge', 'room'], placeholder: 'Select type' },
    ],
  },
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'select', key: 'visualizationType', label: 'Visualization Type', hint: 'How this asset is rendered visually', options: ['furniture', 'figure', 'avatar', 'room', 'none'], placeholder: 'Select viz type' },
      { kind: 'select', key: 'logicType', label: 'Logic Type', hint: 'Logic handler for this asset', options: ['furniture', 'figure', 'avatar', 'room', 'none'], placeholder: 'Select logic type' },
    ],
  },
];

// ── ASSET_SCHEMA ──────────────────────────────────────────────────────────────

export const ASSET_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'name', label: 'Name', hint: 'Asset identifier', placeholder: 'asset_name' },
      { kind: 'text', key: 'source', label: 'Source', hint: 'Source asset name', placeholder: 'source_asset' },
    ],
  },
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'x', label: 'X Offset', default: 0 },
      { kind: 'number', key: 'y', label: 'Y Offset', default: 0 },
    ],
  },
  {
    kind: 'switch-row',
    fields: [
      { key: 'flipH', label: 'Flip H' },
      { key: 'flipV', label: 'Flip V' },
      { key: 'usesPalette', label: 'Uses Palette' },
    ],
  },
];

// ── ALIAS_SCHEMA ──────────────────────────────────────────────────────────────

export const ALIAS_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'name', label: 'Name', hint: 'The alias identifier', placeholder: 'alias_name' },
      { kind: 'text', key: 'link', label: 'Link', hint: 'Points to the source asset name', placeholder: 'source_asset' },
    ],
  },
  {
    kind: 'switch-row',
    fields: [
      { key: 'flipH', label: 'Flip H' },
      { key: 'flipV', label: 'Flip V' },
    ],
  },
];

// ── PALETTE_SCHEMA ────────────────────────────────────────────────────────────

export const PALETTE_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'text', key: 'source', label: 'Source', placeholder: 'source' },
      { kind: 'number', key: 'breed', label: 'Breed', default: 0 },
    ],
  },
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'colorTag', label: 'Color Tag', default: 0 },
      { kind: 'csv-strings', key: 'tags', label: 'Tags', hint: 'Comma-separated tag strings', placeholder: 'tag1,tag2' },
    ],
  },
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'color1', label: 'Color 1', placeholder: '#FFFFFF' },
      { kind: 'text', key: 'color2', label: 'Color 2', placeholder: '#000000' },
    ],
  },
  { kind: 'boolean', key: 'master', label: 'Master Palette' },
  {
    kind: 'json',
    key: 'rgb',
    label: 'RGB Triplets',
    hint: 'Array of [R,G,B] triplets, e.g. [[255,0,0],[0,255,0]]',
    rows: 4,
  },
];

// ── ANIMATION_SCHEMA ──────────────────────────────────────────────────────────

const DIRECTION_OFFSET_SCHEMA: FieldDef[] = [
  { kind: 'number', key: 'offset', label: 'Offset', default: 0 },
];

const SPRITE_DIRECTION_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'dx', label: 'dx', default: 0 },
      { kind: 'number', key: 'dy', label: 'dy', default: 0 },
    ],
  },
];

const FRAME_PART_ITEM_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'id', label: 'ID', placeholder: 'item_id' },
      { kind: 'text', key: 'base', label: 'Base', placeholder: 'base_id' },
    ],
  },
];

const FRAME_PART_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'text', key: 'id', label: 'ID', placeholder: 'part_id' },
      { kind: 'number', key: 'frame', label: 'Frame', default: 0 },
      { kind: 'text', key: 'base', label: 'Base', placeholder: 'base' },
    ],
  },
  {
    kind: 'group',
    cols: 4,
    fields: [
      { kind: 'number', key: 'dx', label: 'dx', default: 0 },
      { kind: 'number', key: 'dy', label: 'dy', default: 0 },
      { kind: 'number', key: 'dz', label: 'dz', default: 0 },
      { kind: 'number', key: 'dd', label: 'dd', default: 0 },
    ],
  },
  {
    kind: 'array',
    key: 'items',
    label: 'Items',
    labelKey: 'id',
    defaultItem: { id: '', base: '' },
    fields: FRAME_PART_ITEM_SCHEMA,
    addLabel: 'Add Item',
    emptyText: 'No items.',
  },
];

const ANIMATION_FRAME_SCHEMA: FieldDef[] = [
  { kind: 'number', key: 'repeats', label: 'Repeats', default: 1 },
  {
    kind: 'array',
    key: 'bodyparts',
    label: 'Body Parts',
    labelKey: 'id',
    defaultItem: { id: '', frame: 0 },
    fields: FRAME_PART_SCHEMA,
    addLabel: 'Add Body Part',
    emptyText: 'No body parts.',
  },
  {
    kind: 'array',
    key: 'fxs',
    label: 'FX Parts',
    labelKey: 'id',
    defaultItem: { id: '', frame: 0 },
    fields: FRAME_PART_SCHEMA,
    addLabel: 'Add FX Part',
    emptyText: 'No FX parts.',
  },
];

const SPRITE_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'id', label: 'ID', placeholder: 'sprite_id' },
      { kind: 'text', key: 'member', label: 'Member', placeholder: 'member_name' },
    ],
  },
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'number', key: 'directions', label: 'Directions', default: 0 },
      { kind: 'number', key: 'staticY', label: 'Static Y', default: 0 },
      { kind: 'number', key: 'ink', label: 'Ink', default: 0 },
    ],
  },
  {
    kind: 'array',
    key: 'directionList',
    label: 'Direction Offsets',
    defaultItem: { dx: 0, dy: 0 },
    fields: SPRITE_DIRECTION_SCHEMA,
    addLabel: 'Add Direction',
    emptyText: 'No direction offsets.',
  },
];

export const ANIMATION_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'name', label: 'Name', placeholder: 'anim_name' },
      { kind: 'text', key: 'desc', label: 'Description', placeholder: 'description' },
    ],
  },
  { kind: 'boolean', key: 'resetOnToggle', label: 'Reset On Toggle' },
  {
    kind: 'array',
    key: 'directions',
    label: 'Directions',
    defaultItem: { offset: 0 },
    fields: DIRECTION_OFFSET_SCHEMA,
    addLabel: 'Add Direction',
    emptyText: 'No directions.',
  },
  {
    kind: 'array',
    key: 'sprites',
    label: 'Sprites',
    labelKey: 'id',
    defaultItem: { id: '' },
    fields: SPRITE_SCHEMA,
    addLabel: 'Add Sprite',
    emptyText: 'No sprites.',
  },
  {
    kind: 'array',
    key: 'frames',
    label: 'Frames',
    defaultItem: { repeats: 1 },
    fields: ANIMATION_FRAME_SCHEMA,
    addLabel: 'Add Frame',
    emptyText: 'No frames.',
  },
];

// ── VISUALIZATION_SCHEMA ──────────────────────────────────────────────────────

const VIZ_LAYER_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 4,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'number', key: 'x', label: 'X', default: 0 },
      { kind: 'number', key: 'y', label: 'Y', default: 0 },
      { kind: 'number', key: 'z', label: 'Z', default: 0 },
    ],
  },
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'number', key: 'alpha', label: 'Alpha', min: 0, max: 255, default: 255 },
      { kind: 'text', key: 'ink', label: 'Ink', placeholder: 'ADD' },
      { kind: 'text', key: 'tag', label: 'Tag', placeholder: 'tag' },
    ],
  },
  { kind: 'boolean', key: 'ignoreMouse', label: 'Ignore Mouse' },
];

const COLOR_LAYER_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'number', key: 'color', label: 'Color (int)', hint: 'Integer color value e.g. 16777215 for white', default: 16777215 },
    ],
  },
];

const COLOR_SCHEMA: FieldDef[] = [
  { kind: 'number', key: 'id', label: 'Color Group ID', default: 0 },
  {
    kind: 'array',
    key: 'layers',
    label: 'Color Layers',
    defaultItem: { id: 0, color: 16777215 },
    fields: COLOR_LAYER_SCHEMA,
    addLabel: 'Add Color Layer',
    emptyText: 'No color layers.',
  },
];

const VIZ_DIRECTION_SCHEMA: FieldDef[] = [
  { kind: 'number', key: 'id', label: 'Direction ID', default: 0 },
  {
    kind: 'array',
    key: 'layers',
    label: 'Override Layers',
    defaultItem: { id: 0 },
    fields: VIZ_LAYER_SCHEMA,
    addLabel: 'Add Layer',
    emptyText: 'No override layers.',
  },
];

const SEQ_FRAME_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 4,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'number', key: 'x', label: 'x', default: 0 },
      { kind: 'number', key: 'y', label: 'y', default: 0 },
      { kind: 'number', key: 'randomX', label: 'rndX', default: 0 },
    ],
  },
];

const FRAME_SEQUENCE_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'loopCount', label: 'Loop Count', default: 0 },
      { kind: 'number', key: 'random', label: 'Random', default: 0 },
    ],
  },
  {
    kind: 'array',
    key: 'frames',
    label: 'Frames',
    defaultItem: { id: 0 },
    fields: SEQ_FRAME_SCHEMA,
    addLabel: 'Add Frame',
    emptyText: 'No frames.',
  },
];

const ANIM_LAYER_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 4,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'number', key: 'loopCount', label: 'Loop', default: 0 },
      { kind: 'number', key: 'frameRepeat', label: 'Frame Rpt', default: 0 },
      { kind: 'number', key: 'random', label: 'Random', default: 0 },
    ],
  },
  {
    kind: 'array',
    key: 'frameSequences',
    label: 'Frame Sequences',
    defaultItem: { frames: [] },
    fields: FRAME_SEQUENCE_SCHEMA,
    addLabel: 'Add Sequence',
    emptyText: 'No sequences.',
  },
];

const VISUAL_ANIMATION_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'number', key: 'transitionTo', label: 'Transition To', placeholder: 'opt' },
    ],
  },
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'transitionFrom', label: 'Transition From', placeholder: 'opt' },
      { kind: 'text', key: 'immediateChangeFrom', label: 'Immediate Change From', placeholder: 'opt' },
    ],
  },
  { kind: 'boolean', key: 'randomStart', label: 'Random Start' },
  {
    kind: 'array',
    key: 'layers',
    label: 'Animation Layers',
    labelKey: 'id',
    defaultItem: { id: 0 },
    fields: ANIM_LAYER_SCHEMA,
    addLabel: 'Add Layer',
    emptyText: 'No animation layers.',
  },
];

const POSTURE_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'id', label: 'ID', placeholder: 'std' },
      { kind: 'number', key: 'animationId', label: 'Animation ID', default: 0 },
    ],
  },
];

const GESTURE_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'id', label: 'ID', placeholder: 'idle' },
      { kind: 'number', key: 'animationId', label: 'Animation ID', default: 0 },
    ],
  },
];

export const VISUALIZATION_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'number', key: 'size', label: 'Size', hint: 'Rendering size (32, 64)', default: 64 },
      { kind: 'number', key: 'layerCount', label: 'Layer Count', default: 0 },
      { kind: 'number', key: 'angle', label: 'Angle', default: 45 },
    ],
  },
  {
    kind: 'array',
    key: 'layers',
    label: 'Layers',
    labelKey: 'id',
    defaultItem: { id: 0 },
    fields: VIZ_LAYER_SCHEMA,
    addLabel: 'Add Layer',
    emptyText: 'No layers.',
  },
  {
    kind: 'array',
    key: 'colors',
    label: 'Colors',
    labelKey: 'id',
    defaultItem: { id: 0, layers: [] },
    fields: COLOR_SCHEMA,
    addLabel: 'Add Color',
    emptyText: 'No colors.',
  },
  {
    kind: 'array',
    key: 'directions',
    label: 'Directions',
    labelKey: 'id',
    defaultItem: { id: 0, layers: [] },
    fields: VIZ_DIRECTION_SCHEMA,
    addLabel: 'Add Direction',
    emptyText: 'No directions.',
  },
  {
    kind: 'array',
    key: 'animations',
    label: 'Animations',
    labelKey: 'id',
    defaultItem: { id: 0, layers: [] },
    fields: VISUAL_ANIMATION_SCHEMA,
    addLabel: 'Add Animation',
    emptyText: 'No animations.',
  },
  { kind: 'text', key: 'defaultPosture', label: 'Default Posture', placeholder: 'std' },
  {
    kind: 'object',
    key: 'postures',
    label: 'Postures',
    fields: [
      { kind: 'text', key: 'defaultPosture', label: 'Default Posture', placeholder: 'std' },
      {
        kind: 'array',
        key: 'postures',
        label: 'Posture List',
        labelKey: 'id',
        defaultItem: { id: '', animationId: 0 },
        fields: POSTURE_SCHEMA,
        addLabel: 'Add Posture',
        emptyText: 'No postures.',
      },
    ],
  },
  {
    kind: 'array',
    key: 'gestures',
    label: 'Gestures',
    labelKey: 'id',
    defaultItem: { id: '', animationId: 0 },
    fields: GESTURE_SCHEMA,
    addLabel: 'Add Gesture',
    emptyText: 'No gestures.',
  },
];

// ── LOGIC_SCHEMA ──────────────────────────────────────────────────────────────

const DIMENSION_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 4,
    fields: [
      { kind: 'number', key: 'x', label: 'X', default: 1 },
      { kind: 'number', key: 'y', label: 'Y', default: 1 },
      { kind: 'number', key: 'z', label: 'Z', default: 115 },
      { kind: 'number', key: 'centerZ', label: 'Center Z', placeholder: 'opt' },
    ],
  },
];

const MODEL_SCHEMA: FieldDef[] = [
  {
    kind: 'object',
    key: 'dimensions',
    label: 'Dimensions',
    fields: DIMENSION_SCHEMA,
  },
  {
    kind: 'csv-numbers',
    key: 'directions',
    label: 'Directions',
    hint: 'Valid directions: 0,2,4,6 for 4-dir; 0,1,2,3,4,5,6,7 for 8-dir',
    placeholder: '0,2,4,6',
  },
];

const SOUND_SAMPLE_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'id', label: 'Sound ID', placeholder: '0' },
    ],
  },
  { kind: 'boolean', key: 'noPitch', label: 'No Pitch' },
];

const ACTION_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'link', label: 'Link', placeholder: 'action_link' },
      { kind: 'number', key: 'startState', label: 'Start State', default: 0 },
    ],
  },
];

const CUSTOM_VARS_SCHEMA: FieldDef[] = [
  {
    kind: 'csv-strings',
    key: 'variables',
    label: 'Variables',
    hint: 'Comma-separated custom variable names',
    placeholder: 'var1,var2',
  },
];

const PLANET_SYSTEM_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'text', key: 'name', label: 'Name', placeholder: 'planet_name' },
    ],
  },
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'parent', label: 'Parent', placeholder: 'parent_id' },
      { kind: 'number', key: 'radius', label: 'Radius', default: 0 },
    ],
  },
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'number', key: 'arcSpeed', label: 'Arc Speed', step: 0.01, default: 0 },
      { kind: 'number', key: 'arcOffset', label: 'Arc Offset', step: 0.01, default: 0 },
      { kind: 'number', key: 'blend', label: 'Blend', step: 0.01, min: 0, max: 1, default: 1 },
    ],
  },
  { kind: 'number', key: 'height', label: 'Height', default: 0 },
];

const SIMULATION_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'number', key: 'force', label: 'Force', step: 0.1, default: 0 },
      { kind: 'number', key: 'direction', label: 'Direction', default: 0 },
      { kind: 'number', key: 'gravity', label: 'Gravity', step: 0.1, default: 0 },
    ],
  },
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'number', key: 'airFriction', label: 'Air Friction', step: 0.01, default: 0 },
      { kind: 'number', key: 'energy', label: 'Energy', step: 0.1, default: 0 },
      { kind: 'text', key: 'shape', label: 'Shape', placeholder: 'sphere' },
    ],
  },
];

const PARTICLE_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'lifeTime', label: 'Lifetime', default: 0 },
      { kind: 'csv-strings', key: 'frames', label: 'Frames', hint: 'Comma-separated frame names', placeholder: 'frame1,frame2' },
    ],
  },
  {
    kind: 'switch-row',
    fields: [
      { key: 'isEmitter', label: 'Is Emitter' },
      { key: 'fade', label: 'Fade' },
    ],
  },
];

const EMITTER_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'text', key: 'name', label: 'Name', placeholder: 'emitter_name' },
      { kind: 'number', key: 'spriteId', label: 'Sprite ID', default: 0 },
    ],
  },
  {
    kind: 'group',
    cols: 4,
    fields: [
      { kind: 'number', key: 'maxNumParticles', label: 'Max Particles', default: 0 },
      { kind: 'number', key: 'particlesPerFrame', label: 'Per Frame', default: 0 },
      { kind: 'number', key: 'burstPulse', label: 'Burst Pulse', default: 0 },
      { kind: 'number', key: 'fuseTime', label: 'Fuse Time', default: 0 },
    ],
  },
  {
    kind: 'object',
    key: 'simulation',
    label: 'Simulation',
    fields: SIMULATION_SCHEMA,
  },
  {
    kind: 'array',
    key: 'particles',
    label: 'Particles',
    defaultItem: { lifeTime: 0, fade: false, isEmitter: false, frames: [] },
    fields: PARTICLE_SCHEMA,
    addLabel: 'Add Particle',
    emptyText: 'No particles.',
  },
];

const PARTICLE_SYSTEM_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 4,
    fields: [
      { kind: 'number', key: 'size', label: 'Size', default: 0 },
      { kind: 'number', key: 'canvasId', label: 'Canvas ID', default: 0 },
      { kind: 'number', key: 'offsetY', label: 'Offset Y', default: 0 },
      { kind: 'number', key: 'blend', label: 'Blend', step: 0.01, min: 0, max: 1, default: 1 },
    ],
  },
  { kind: 'text', key: 'bgColor', label: 'BG Color', placeholder: '#000000' },
  {
    kind: 'array',
    key: 'emitters',
    label: 'Emitters',
    labelKey: 'name',
    defaultItem: { id: 0 },
    fields: EMITTER_SCHEMA,
    addLabel: 'Add Emitter',
    emptyText: 'No emitters.',
  },
];

export const LOGIC_SCHEMA: FieldDef[] = [
  {
    kind: 'object',
    key: 'model',
    label: 'Model',
    fields: MODEL_SCHEMA,
  },
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'maskType', label: 'Mask Type', hint: 'Collision mask type', placeholder: 'default' },
      { kind: 'text', key: 'credits', label: 'Credits', placeholder: 'author' },
    ],
  },
  {
    kind: 'object',
    key: 'soundSample',
    label: 'Sound Sample',
    fields: SOUND_SAMPLE_SCHEMA,
  },
  {
    kind: 'object',
    key: 'action',
    label: 'Action',
    fields: ACTION_SCHEMA,
  },
  {
    kind: 'object',
    key: 'customVars',
    label: 'Custom Variables',
    fields: CUSTOM_VARS_SCHEMA,
  },
  {
    kind: 'array',
    key: 'planetSystems',
    label: 'Planet Systems',
    labelKey: 'name',
    defaultItem: { id: 0 },
    fields: PLANET_SYSTEM_SCHEMA,
    addLabel: 'Add Planet System',
    emptyText: 'No planet systems.',
  },
  {
    kind: 'array',
    key: 'particleSystems',
    label: 'Particle Systems',
    defaultItem: { size: 1, emitters: [] },
    fields: PARTICLE_SYSTEM_SCHEMA,
    addLabel: 'Add Particle System',
    emptyText: 'No particle systems.',
  },
];

// ── ROOM_VIZ_SCHEMA ───────────────────────────────────────────────────────────

const BITMAP_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'text', key: 'assetName', label: 'Asset Name', placeholder: 'assetName' },
      { kind: 'number', key: 'x', label: 'X', default: 0 },
    ],
  },
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'y', label: 'Y', default: 0 },
      { kind: 'boolean', key: 'flipH', label: 'Flip H' },
    ],
  },
  { kind: 'boolean', key: 'flipV', label: 'Flip V' },
];

const TEXTURE_SCHEMA: FieldDef[] = [
  { kind: 'text', key: 'id', label: 'Texture ID', placeholder: 'tex_0' },
  {
    kind: 'array',
    key: 'bitmaps',
    label: 'Bitmaps',
    labelKey: 'assetName',
    defaultItem: { assetName: '' },
    fields: BITMAP_SCHEMA,
    addLabel: 'Add Bitmap',
    emptyText: 'No bitmaps.',
  },
];

const PLANE_VIZ_LAYER_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'text', key: 'materialId', label: 'Material ID', placeholder: 'mat_0' },
      { kind: 'number', key: 'x', label: 'X', default: 0 },
      { kind: 'number', key: 'y', label: 'Y', default: 0 },
    ],
  },
  { kind: 'number', key: 'color', label: 'Color (int)', default: 0 },
];

const PLANE_VIZ_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 2,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'number', key: 'size', label: 'Size', default: 64 },
    ],
  },
  {
    kind: 'array',
    key: 'layers',
    label: 'Layers',
    labelKey: 'materialId',
    defaultItem: { materialId: '' },
    fields: PLANE_VIZ_LAYER_SCHEMA,
    addLabel: 'Add Layer',
    emptyText: 'No layers.',
  },
];

const PLANE_SCHEMA: FieldDef[] = [
  { kind: 'text', key: 'id', label: 'Plane ID', placeholder: 'plane_0' },
  {
    kind: 'array',
    key: 'visualizations',
    label: 'Visualizations',
    labelKey: 'id',
    defaultItem: { id: 0, size: 64, layers: [] },
    fields: PLANE_VIZ_SCHEMA,
    addLabel: 'Add Visualization',
    emptyText: 'No visualizations.',
  },
];

const MATERIAL_SCHEMA: FieldDef[] = [
  { kind: 'text', key: 'id', label: 'Material ID', placeholder: 'mat_0' },
  {
    kind: 'json',
    key: 'matrices',
    label: 'Cell Matrices',
    hint: 'Array of matrix objects with columns/cells. Deep structure — edit as JSON.',
    rows: 6,
  },
];

const PLANE_DATA_SCHEMA: FieldDef[] = [
  {
    kind: 'array',
    key: 'textures',
    label: 'Textures',
    labelKey: 'id',
    defaultItem: { id: '', bitmaps: [] },
    fields: TEXTURE_SCHEMA,
    addLabel: 'Add Texture',
    emptyText: 'No textures.',
  },
  {
    kind: 'array',
    key: 'materials',
    label: 'Materials',
    labelKey: 'id',
    defaultItem: { id: '', matrices: [] },
    fields: MATERIAL_SCHEMA,
    addLabel: 'Add Material',
    emptyText: 'No materials.',
  },
  {
    kind: 'array',
    key: 'planes',
    label: 'Planes',
    labelKey: 'id',
    defaultItem: { id: '', visualizations: [] },
    fields: PLANE_SCHEMA,
    addLabel: 'Add Plane',
    emptyText: 'No planes.',
  },
];

const MASK_VIZ_SCHEMA: FieldDef[] = [
  {
    kind: 'group',
    cols: 3,
    fields: [
      { kind: 'number', key: 'id', label: 'ID', default: 0 },
      { kind: 'number', key: 'size', label: 'Size', default: 64 },
      { kind: 'text', key: 'assetName', label: 'Asset Name', placeholder: 'asset_name' },
    ],
  },
];

const MASK_SCHEMA: FieldDef[] = [
  { kind: 'text', key: 'id', label: 'Mask ID', placeholder: 'mask_0' },
  {
    kind: 'array',
    key: 'visualizations',
    label: 'Visualizations',
    labelKey: 'assetName',
    defaultItem: { id: 0, size: 64 },
    fields: MASK_VIZ_SCHEMA,
    addLabel: 'Add Visualization',
    emptyText: 'No visualizations.',
  },
];

const MASK_DATA_SCHEMA: FieldDef[] = [
  {
    kind: 'array',
    key: 'masks',
    label: 'Masks',
    labelKey: 'id',
    defaultItem: { id: '', visualizations: [] },
    fields: MASK_SCHEMA,
    addLabel: 'Add Mask',
    emptyText: 'No masks.',
  },
];

export const ROOM_VIZ_SCHEMA: FieldDef[] = [
  {
    kind: 'object',
    key: 'floorData',
    label: 'Floor Data',
    fields: PLANE_DATA_SCHEMA,
  },
  {
    kind: 'object',
    key: 'wallData',
    label: 'Wall Data',
    fields: PLANE_DATA_SCHEMA,
  },
  {
    kind: 'object',
    key: 'landscapeData',
    label: 'Landscape Data',
    fields: PLANE_DATA_SCHEMA,
  },
  {
    kind: 'object',
    key: 'maskData',
    label: 'Mask Data',
    fields: MASK_DATA_SCHEMA,
  },
];
