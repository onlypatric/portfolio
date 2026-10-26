import { useId, useState } from 'react';
import { ArrowClockwiseIcon, ShuffleIcon, HeartIcon, PlayIcon } from '@phosphor-icons/react';
import { HStack, VStack } from '@/ohmygui/layout';
import { Text } from '@/ohmygui/content';
import { Toggle, Slider, Button, SegmentedPicker } from '@/ohmygui/input';
import { Animation, type MotionEffect } from '@/ohmygui/behavior';
import type { UIStyle } from '@/ohmygui';

const palettes = {
  moss: { label: 'Moss', accent: '#cfdfa7', sky: '#d9ddbb', hill: '#879970', front: '#425c48', glow: '#f6e7b5' },
  clay: { label: 'Clay', accent: '#efc1a7', sky: '#e9cabb', hill: '#b47d69', front: '#704c47', glow: '#ffe5b1' },
  dusk: { label: 'Dusk', accent: '#c6c4ed', sky: '#c9c8df', hill: '#8a88b2', front: '#4b506f', glow: '#f6d9bf' },
};
type Palette = keyof typeof palettes;
const effects = [{ value: 'slide', label: 'Glide' }, { value: 'scale', label: 'Bloom' }, { value: 'flip', label: 'Turn' }];
const initial = { palette: 'moss' as Palette, night: false, depth: true, radius: 24, duration: 800, effect: 'slide' as MotionEffect };
const surprises = [
  { palette: 'clay' as Palette, night: false, depth: true, radius: 32, duration: 1000, effect: 'scale' as MotionEffect },
  { palette: 'dusk' as Palette, night: true, depth: true, radius: 12, duration: 1200, effect: 'flip' as MotionEffect },
  { ...initial, night: true, radius: 4, duration: 600 },
];

export default function Playground() {
  const id = useId();
  const [settings, setSettings] = useState(initial);
  const [replay, setReplay] = useState(0);
  const [surprise, setSurprise] = useState(0);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const palette = palettes[settings.palette];
  const update = (next: Partial<typeof initial>) => setSettings(current => ({ ...current, ...next }));
  const replayMotion = () => setReplay(value => value + 1);
  const reset = () => { setSettings(initial); setSaved(false); setSurprise(0); replayMotion(); setNotice('Canvas reset to Moss, daylight, and Glide.'); };
  const shuffle = () => { const next = surprises[surprise % surprises.length]; setSettings(next); setSurprise(value => value + 1); replayMotion(); setNotice(`New mood: ${palettes[next.palette].label}, ${next.night ? 'night' : 'daylight'}.`); };

  return <section aria-label="Interactive ohmygui design studio" className="playground-studio" data-night={settings.night} style={{
    '--accent': palette.accent, '--accent-foreground': '#27291f', '--focus': palette.accent,
    '--scene-sky': palette.sky, '--scene-hill': palette.hill, '--scene-front': palette.front,
    '--scene-glow': palette.glow, '--scene-radius': `${settings.radius}px`,
  } as UIStyle}>
    <HStack align="center" justify="between" className="studio-toolbar"><HStack gap="xs" aria-hidden="true"><i /><i /><i /></HStack><Text variant="caption">Playground</Text></HStack>
    <div className="studio-stage">
      <Animation effect={settings.effect} duration={settings.duration} distance={28} replayKey={replay} className="studio-preview-motion">
        <div className="studio-postcard" data-depth={settings.depth}>
          <div className="studio-landscape" aria-hidden="true"><div className="studio-stars" /><div className="studio-sun" /><div className="studio-hill studio-hill--back" /><div className="studio-hill studio-hill--front" /><div className="studio-water" /></div>
          <HStack align="center" justify="between" className="studio-postcard-caption"><div><Text as="h4">Somewhere quieter.</Text></div><Button variant="unstyled" iconOnly aria-label={saved ? 'Unsave this scene' : 'Save this scene'} aria-pressed={saved} onClick={() => { setSaved(value => !value); setNotice(saved ? 'Scene unsaved.' : 'Scene saved for this visit.'); }} className="studio-save"><HeartIcon size={20} weight={saved ? 'fill' : 'regular'} /></Button></HStack>
        </div>
      </Animation>
      {saved && <div className="studio-scene-caption">Saved for this visit</div>}
    </div>
    <VStack gap="lg" align="stretch" className="studio-controls">
      <SegmentedPicker name={`${id}-palette`} label="Palette" value={settings.palette} choices={Object.entries(palettes).map(([value, item]) => ({ value, label: <span className="studio-palette-label"><span style={{ background: item.accent }} />{item.label}</span> }))} onChange={value => { if (value in palettes) update({ palette: value as Palette }); }} />
      <div className="studio-control-grid"><Slider label="Roundness" min={0} max={36} value={settings.radius} onValueChange={radius => update({ radius })} showValue formatValue={value => `${value}px`} /><Slider label="Duration" min={300} max={1500} step={100} value={settings.duration} onValueChange={duration => update({ duration })} showValue formatValue={value => `${(value / 1000).toFixed(1)}s`} /></div>
      <SegmentedPicker name={`${id}-motion`} label="Animation" value={settings.effect} choices={effects} onChange={value => { if (effects.some(effect => effect.value === value)) { update({ effect: value as MotionEffect }); replayMotion(); } }} />
      <div className="studio-control-grid"><Toggle label="Moonlight" checked={settings.night} onChange={event => update({ night: event.target.checked })} /><Toggle label="Soft depth" checked={settings.depth} onChange={event => update({ depth: event.target.checked })} /></div>
      <HStack gap="sm" className="studio-actions"><Button onClick={() => { replayMotion(); setNotice('Entrance replayed. Motion follows your device preferences.'); }} className="studio-replay"><PlayIcon weight="fill" size={14} aria-hidden="true" />Replay</Button><Button variant="secondary" onClick={shuffle} aria-label="Surprise me with a new mood"><ShuffleIcon size={17} aria-hidden="true" />Surprise me</Button><Button variant="ghost" iconOnly onClick={reset} aria-label="Reset playground"><ArrowClockwiseIcon size={18} aria-hidden="true" /></Button></HStack>
    </VStack>
    <span role="status" className="sr-only">{notice}</span>
    <noscript><p className="studio-noscript">Enable JavaScript to experiment with the controls.</p></noscript>
  </section>;
}
