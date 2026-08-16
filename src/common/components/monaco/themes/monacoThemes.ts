import Active4D from 'monaco-themes/themes/Active4D.json'
import AllHallowsEve from 'monaco-themes/themes/All Hallows Eve.json'
import Amy from 'monaco-themes/themes/Amy.json'
import BirdsOfParadise from 'monaco-themes/themes/Birds of Paradise.json'
import Blackboard from 'monaco-themes/themes/Blackboard.json'
import BrillianceBlack from 'monaco-themes/themes/Brilliance Black.json'
import BrillianceDull from 'monaco-themes/themes/Brilliance Dull.json'
import ChromeDevTools from 'monaco-themes/themes/Chrome DevTools.json'
import Clouds from 'monaco-themes/themes/Clouds.json'
import Cobalt from 'monaco-themes/themes/Cobalt.json'
import Dracula from 'monaco-themes/themes/Dracula.json'
import Dreamweaver from 'monaco-themes/themes/Dreamweaver.json'
import Eiffel from 'monaco-themes/themes/Eiffel.json'
import GitHubDark from 'monaco-themes/themes/GitHub Dark.json'
import GitHubLight from 'monaco-themes/themes/GitHub Light.json'
import GitHub from 'monaco-themes/themes/GitHub.json'
import IDLE from 'monaco-themes/themes/IDLE.json'
import LAZY from 'monaco-themes/themes/LAZY.json'
import MerbivoreSoft from 'monaco-themes/themes/Merbivore Soft.json'
import MonokaiBright from 'monaco-themes/themes/Monokai Bright.json'
import NightOwl from 'monaco-themes/themes/Night Owl.json'
import Nord from 'monaco-themes/themes/Nord.json'
import OceanicNext from 'monaco-themes/themes/Oceanic Next.json'
import PastelsOnDark from 'monaco-themes/themes/Pastels on Dark.json'
import SlushAndPoppies from 'monaco-themes/themes/Slush and Poppies.json'
import SolarizedLight from 'monaco-themes/themes/Solarized-light.json'
import SpaceCadet from 'monaco-themes/themes/SpaceCadet.json'
import Sunburst from 'monaco-themes/themes/Sunburst.json'
import TextmateMacClassic from 'monaco-themes/themes/Textmate (Mac Classic).json'
import TomorrowNightBlue from 'monaco-themes/themes/Tomorrow-Night-Blue.json'
import TomorrowNightBright from 'monaco-themes/themes/Tomorrow-Night-Bright.json'
import TomorrowNightEighties from 'monaco-themes/themes/Tomorrow-Night-Eighties.json'
import TomorrowNight from 'monaco-themes/themes/Tomorrow-Night.json'
import Tomorrow from 'monaco-themes/themes/Tomorrow.json'
import Twilight from 'monaco-themes/themes/Twilight.json'
import UpstreamSunburst from 'monaco-themes/themes/Upstream Sunburst.json'
import VibrantInk from 'monaco-themes/themes/Vibrant Ink.json'
import XcodeDefault from 'monaco-themes/themes/Xcode_default.json'
import krTheme from 'monaco-themes/themes/krTheme.json'
import Monoindustrial from 'monaco-themes/themes/monoindustrial.json'

import roseQuartz from './data/RoseQuartz.json'
import starryNight from './data/StarryNight.json'
import amethystLight from './data/amethyst-light.json'
import amethyst from './data/amethyst.json'
import augustArstotzka from './data/august-arstotzka.json'
import augustCatppuccin from './data/august-catppuccin.json'
import augustOcean from './data/august-ocean.json'
import bold from './data/bold.json'
import contrast from './data/contrast.json'
import csb from './data/csb.json'
import decay from './data/decay.json'
import dobriAmethyst from './data/dobri-amethyst.json'
import dobriBlack from './data/dobri-black.json'
import dobriIndigo from './data/dobri-indigo.json'
import dobriOne from './data/dobri-one.json'
import duoToneEarth from './data/duoTone-earth.json'
import duoToneForest from './data/duoTone-forest.json'
import duoToneSea from './data/duoTone-sea.json'
import duoTone from './data/duoTone.json'
import earthbound from './data/earthbound.json'
import enfocado from './data/enfocado.json'
import gruvboxLight from './data/gruvbox-light.json'
import gruvbox from './data/gruvbox.json'
import kimbie from './data/kimbie.json'
import neon from './data/neon.json'
import redefinedAyu from './data/redefined-ayu.json'
import redefinedSnazzy from './data/redefined-snazzy.json'
import tinaciousBlack from './data/tinacious-black.json'
import tinaciousLight from './data/tinacious-light.json'
import tinacious from './data/tinacious.json'
import viowArabian from './data/viow-arabian.json'
import viowMars from './data/viow-mars.json'
import viowNeon from './data/viow-neon.json'
import vsDark from './data/vs-dark.json'
import vsLight from './data/vs-light.json'

export type ThemeMonacoName = keyof typeof monacoThemes
export type ThemeMonaco = (typeof monacoThemes)[ThemeMonacoName]

export const monacoThemes = {
  neon: { ...neon, name: 'neon' },
  roseQuartz: { ...roseQuartz, name: 'roseQuartz' },
  starryNight: { ...starryNight, name: 'starryNight' },
  redefinedSnazzy: { ...redefinedSnazzy, name: 'redefinedSnazzy' },
  redefinedAyu: { ...redefinedAyu, name: 'redefinedAyu' },
  earthbound: { ...earthbound, name: 'earthbound' },
  amethyst: { ...amethyst, name: 'amethyst' },
  augustCatppuccin: { ...augustCatppuccin, name: 'augustCatppuccin' },
  augustArstotzka: { ...augustArstotzka, name: 'augustArstotzka' },
  augustOcean: { ...augustOcean, name: 'augustOcean' },
  viowArabian: { ...viowArabian, name: 'viowArabian' },
  viowMars: { ...viowMars, name: 'viowMars' },
  viowNeon: { ...viowNeon, name: 'viowNeon' },
  dobriOne: { ...dobriOne, name: 'dobriOne' },
  dobriIndigo: { ...dobriIndigo, name: 'dobriIndigo' },
  tinacious: { ...tinacious, name: 'tinacious' },
  decay: { ...decay, name: 'decay' },
  enfocado: { ...enfocado, name: 'enfocado' },
  bold: { ...bold, name: 'bold' },
  csb: { ...csb, name: 'csb' },
  'vs-dark': { ...vsDark, name: 'vs-dark' },
  Dracula: { ...Dracula, name: 'Dracula' },
  GitHubDark: { ...GitHubDark, name: 'GitHubDark' },

  MerbivoreSoft: { ...MerbivoreSoft, name: 'MerbivoreSoft' },
  Nord: { ...Nord, name: 'Nord' },
  PastelsOnDark: { ...PastelsOnDark, name: 'PastelsOnDark' },
  contrast: { ...contrast, name: 'contrast' },
  SpaceCadet: { ...SpaceCadet, name: 'SpaceCadet' },
  Sunburst: { ...Sunburst, name: 'Sunburst' },
  TomorrowNightBright: { ...TomorrowNightBright, name: 'TomorrowNightBright' },
  TomorrowNightEighties: { ...TomorrowNightEighties, name: 'TomorrowNightEighties' },
  TomorrowNight: { ...TomorrowNight, name: 'TomorrowNight' },
  Twilight: { ...Twilight, name: 'Twilight' },
  UpstreamSunburst: { ...UpstreamSunburst, name: 'UpstreamSunburst' },
  VibrantInk: { ...VibrantInk, name: 'VibrantInk' },
  krTheme: { ...krTheme, name: 'krTheme' },
  Monoindustrial: { ...Monoindustrial, name: 'Monoindustrial' },

  // Black
  dobriBlack: { ...dobriBlack, name: 'dobriBlack' },
  tinaciousBlack: { ...tinaciousBlack, name: 'tinaciousBlack' },
  AllHallowsEve: { ...AllHallowsEve, name: 'AllHallowsEve' },
  BrillianceDull: { ...BrillianceDull, name: 'BrillianceDull' },
  BrillianceBlack: { ...BrillianceBlack, name: 'BrillianceBlack' },
  gruvbox: { ...gruvbox, name: 'gruvbox' },
  MonokaiBright: { ...MonokaiBright, name: 'MonokaiBright' },
  kimbie: { ...kimbie, name: 'kimbie' },
  BirdsOfParadise: { ...BirdsOfParadise, name: 'BirdsOfParadise' },

  // specials
  Cobalt: { ...Cobalt, name: 'Cobalt' },
  Blackboard: { ...Blackboard, name: 'Blackboard' },
  dobriAmethyst: { ...dobriAmethyst, name: 'dobriAmethyst' },
  Amy: { ...Amy, name: 'Amy' },
  OceanicNext: { ...OceanicNext, name: 'OceanicNext' },
  NightOwl: { ...NightOwl, name: 'NightOwl' },
  TomorrowNightBlue: { ...TomorrowNightBlue, name: 'TomorrowNightBlue' },
  duoTone: { ...duoTone, name: 'duoTone' },
  duoToneSea: { ...duoToneSea, name: 'duoToneSea' },
  duoToneEarth: { ...duoToneEarth, name: 'duoToneEarth' },
  duoToneForest: { ...duoToneForest, name: 'duoToneForest' },

  // light theme
  amethystLight: { ...amethystLight, name: 'amethystLight' },
  XcodeDefault: { ...XcodeDefault, name: 'XcodeDefault' },
  GitHub: { ...GitHub, name: 'GitHub' },
  tinaciousLight: { ...tinaciousLight, name: 'tinaciousLight' },
  'vs-light': { ...vsLight, name: 'vs-light' },
  IDLE: { ...IDLE, name: 'IDLE' },
  gruvboxLight: { ...gruvboxLight, name: 'gruvboxLight' },
  LAZY: { ...LAZY, name: 'LAZY' },
  SolarizedLight: { ...SolarizedLight, name: 'SolarizedLight' },
  SlushAndPoppies: { ...SlushAndPoppies, name: 'SlushAndPoppies' },
  TextmateMacClassic: { ...TextmateMacClassic, name: 'TextmateMacClassic' },
  Tomorrow: { ...Tomorrow, name: 'Tomorrow' },
  GitHubLight: { ...GitHubLight, name: 'GitHubLight' },
  Dreamweaver: { ...Dreamweaver, name: 'Dreamweaver' },
  Eiffel: { ...Eiffel, name: 'Eiffel' },
  ChromeDevTools: { ...ChromeDevTools, name: 'ChromeDevTools' },
  Clouds: { ...Clouds, name: 'Clouds' },
  Active4D: { ...Active4D, name: 'Active4D' }
}
