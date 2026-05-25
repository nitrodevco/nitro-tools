// ── Spritesheet ──────────────────────────────────────────────────────────────

export interface ISpritesheetMeta {
  app: string;
  version: string;
  image: string;
  format: string;
  size: { w: number; h: number };
  scale: string;
}

export interface ISpritesheetFrame {
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
  pivot: { x: number; y: number };
}

export interface ISpritesheetData {
  meta?: ISpritesheetMeta;
  frames?: { [index: string]: ISpritesheetFrame };
}

// ── Core Asset ───────────────────────────────────────────────────────────────

export interface IAsset {
  name?: string;
  source?: string;
  x?: number;
  y?: number;
  flipH?: boolean;
  flipV?: boolean;
  usesPalette?: boolean;
}

export interface IAssetAlias {
  name?: string;
  link?: string;
  flipH?: boolean;
  flipV?: boolean;
}

export interface IAssetPalette {
  id?: number;
  source?: string;
  master?: boolean;
  tags?: string[];
  breed?: number;
  colorTag?: number;
  color1?: string;
  color2?: string;
  rgb?: [number, number, number][];
}

// ── Animation (asset-level) ──────────────────────────────────────────────────

export interface IAssetAnimationDirection {
  offset?: number;
}

export interface IAssetAnimationShadow {
  [key: string]: unknown;
}

export interface IAssetAnimationAdd {
  [key: string]: unknown;
}

export interface IAssetAnimationRemove {
  [key: string]: unknown;
}

export interface IAssetAnimationSpriteDirection {
  dx?: number;
  dy?: number;
}

export interface IAssetAnimationSprite {
  id?: string;
  member?: string;
  directions?: number;
  staticY?: number;
  ink?: number;
  directionList?: IAssetAnimationSpriteDirection[];
}

export interface IAssetAnimationFramePartItem {
  id?: string;
  base?: string;
}

export interface IAssetAnimationFramePart {
  id?: string;
  frame?: number;
  base?: string;
  action?: string;
  dx?: number;
  dy?: number;
  dz?: number;
  dd?: number;
  items?: IAssetAnimationFramePartItem[];
}

export interface IAssetAnimationFrame {
  repeats?: number;
  fxs?: IAssetAnimationFramePart[];
  bodyparts?: IAssetAnimationFramePart[];
}

export interface IAssetAnimationAvatar {
  [key: string]: unknown;
}

export interface IAssetAnimationOverride {
  [key: string]: unknown;
}

export interface IAssetAnimation {
  name?: string;
  desc?: string;
  resetOnToggle?: boolean;
  directions?: IAssetAnimationDirection[];
  shadows?: IAssetAnimationShadow[];
  adds?: IAssetAnimationAdd[];
  removes?: IAssetAnimationRemove[];
  sprites?: IAssetAnimationSprite[];
  frames?: IAssetAnimationFrame[];
  avatars?: IAssetAnimationAvatar[];
  overrides?: IAssetAnimationOverride[];
}

// ── Visualization ─────────────────────────────────────────────────────────────

export interface IAssetColorLayer {
  id?: number;
  color?: number;
}

export interface IAssetColor {
  id?: number;
  layers?: IAssetColorLayer[];
}

export interface IAssetVisualizationLayer {
  id?: number;
  x?: number;
  y?: number;
  z?: number;
  alpha?: number;
  ink?: string;
  tag?: string;
  ignoreMouse?: boolean;
}

export interface IAssetVisualizationDirection {
  id?: number;
  layers?: IAssetVisualizationLayer[];
}

export interface IAssetVisualAnimationSequenceFrameOffset {
  direction?: number;
  x?: number;
  y?: number;
}

export interface IAssetVisualAnimationSequenceFrame {
  id?: number;
  x?: number;
  y?: number;
  randomX?: number;
  randomY?: number;
  offsets?: IAssetVisualAnimationSequenceFrameOffset[];
}

export interface IAssetVisualAnimationSequence {
  loopCount?: number;
  random?: number;
  frames?: IAssetVisualAnimationSequenceFrame[];
}

export interface IAssetVisualAnimationLayer {
  id?: number;
  loopCount?: number;
  frameRepeat?: number;
  random?: number;
  frameSequences?: IAssetVisualAnimationSequence[];
}

export interface IAssetVisualAnimation {
  id?: number;
  transitionTo?: number;
  transitionFrom?: number;
  immediateChangeFrom?: string;
  randomStart?: boolean;
  layers?: IAssetVisualAnimationLayer[];
}

export interface IAssetGesture {
  id?: string;
  animationId?: number;
}

export interface IAssetPosture {
  id?: string;
  animationId?: number;
}

export interface IAssetVisualizationData {
  size?: number;
  layerCount?: number;
  angle?: number;
  layers?: IAssetVisualizationLayer[];
  colors?: IAssetColor[];
  directions?: IAssetVisualizationDirection[];
  animations?: IAssetVisualAnimation[];
  defaultPosture?: string;
  postures?: { defaultPosture?: string; postures?: IAssetPosture[] };
  gestures?: IAssetGesture[];
}

// ── Logic ─────────────────────────────────────────────────────────────────────

export interface IAssetDimension {
  x: number;
  y: number;
  z?: number;
  centerZ?: number;
}

export interface IAssetLogicModel {
  dimensions?: IAssetDimension;
  directions?: number[];
}

export interface ISoundSample {
  id?: number;
  noPitch?: boolean;
}

export interface ICustomVars {
  variables?: string[];
}

export interface IAssetLogicPlanetSystem {
  id?: number;
  name?: string;
  parent?: string;
  radius?: number;
  arcSpeed?: number;
  arcOffset?: number;
  blend?: number;
  height?: number;
}

export interface IParticleSystemSimulation {
  force?: number;
  direction?: number;
  gravity?: number;
  airFriction?: number;
  shape?: string;
  energy?: number;
}

export interface IParticleSystemParticle {
  isEmitter?: boolean;
  lifeTime?: number;
  fade?: boolean;
  frames?: string[];
}

export interface IParticleSystemEmitter {
  id?: number;
  name?: string;
  spriteId?: number;
  maxNumParticles?: number;
  particlesPerFrame?: number;
  burstPulse?: number;
  fuseTime?: number;
  simulation?: IParticleSystemSimulation;
  particles?: IParticleSystemParticle[];
}

export interface IParticleSystem {
  size?: number;
  canvasId?: number;
  offsetY?: number;
  blend?: number;
  bgColor?: string;
  emitters?: IParticleSystemEmitter[];
}

export interface IAssetLogicData {
  model?: IAssetLogicModel;
  maskType?: string;
  credits?: string;
  soundSample?: ISoundSample;
  action?: { link?: string; startState?: number };
  planetSystems?: IAssetLogicPlanetSystem[];
  particleSystems?: IParticleSystem[];
  customVars?: ICustomVars;
}

// ── Room Visualization ────────────────────────────────────────────────────────

export interface IAssetPlaneTextureBitmap {
  assetName?: string;
  flipH?: boolean;
  flipV?: boolean;
  x?: number;
  y?: number;
}

export interface IAssetPlaneTexture {
  id?: string;
  bitmaps?: IAssetPlaneTextureBitmap[];
}

export interface IAssetPlaneMaterialCellExtraItemData {
  [key: string]: unknown;
}

export interface IAssetPlaneMaterialCell {
  textureId?: string;
  extraItemData?: IAssetPlaneMaterialCellExtraItemData;
}

export interface IAssetPlaneMaterialCellColumn {
  cells?: IAssetPlaneMaterialCell[];
}

export interface IAssetPlaneMaterialCellMatrix {
  columns?: IAssetPlaneMaterialCellColumn[];
}

export interface IAssetPlaneMaterial {
  id?: string;
  matrices?: IAssetPlaneMaterialCellMatrix[];
}

export interface IAssetPlaneVisualizationLayer {
  materialId?: string;
  color?: number;
  x?: number;
  y?: number;
}

export interface IAssetPlaneVisualizationAnimatedLayerItem {
  assetName?: string;
  x?: number;
  y?: number;
  speed?: number;
}

export interface IAssetPlaneVisualizationAnimatedLayer {
  items?: IAssetPlaneVisualizationAnimatedLayerItem[];
}

export interface IAssetPlaneVisualization {
  id?: number;
  size?: number;
  layers?: IAssetPlaneVisualizationLayer[];
  animatedLayers?: IAssetPlaneVisualizationAnimatedLayer[];
}

export interface IAssetPlane {
  id?: string;
  visualizations?: IAssetPlaneVisualization[];
  animatedVisualization?: IAssetPlaneVisualization[];
}

export interface IAssetPlaneMaskVisualization {
  id?: number;
  size?: number;
  assetName?: string;
}

export interface IAssetPlaneMask {
  id?: string;
  visualizations?: IAssetPlaneMaskVisualization[];
}

export interface IAssetPlaneMaskData {
  masks?: IAssetPlaneMask[];
}

export interface IAssetPlaneVisualizationData {
  textures?: IAssetPlaneTexture[];
  materials?: IAssetPlaneMaterial[];
  planes?: IAssetPlane[];
}

export interface IAssetRoomVisualizationData {
  floorData?: IAssetPlaneVisualizationData;
  wallData?: IAssetPlaneVisualizationData;
  landscapeData?: IAssetPlaneVisualizationData;
  maskData?: IAssetPlaneMaskData;
}

// ── Root ──────────────────────────────────────────────────────────────────────

export interface IAssetData {
  type?: string;
  name?: string;
  visualizationType?: string;
  logicType?: string;
  spritesheet?: ISpritesheetData;
  logic?: IAssetLogicData;
  assets?: IAsset[];
  aliases?: IAssetAlias[];
  animations?: IAssetAnimation[];
  palettes?: IAssetPalette[];
  visualizations?: IAssetVisualizationData[];
  roomVisualization?: IAssetRoomVisualizationData;
}
