import {
  DevicePhoneMobileIcon,
  HomeIcon,
  ShoppingBagIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  TagIcon,
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
  MusicalNoteIcon,
  CameraIcon,
  HeartIcon,
  SparklesIcon,
  TruckIcon,
  CubeIcon,
} from '@heroicons/vue/24/outline'
import type { FunctionalComponent } from 'vue'

type HeroIcon = FunctionalComponent

const iconMap: Record<string, HeroIcon> = {
  eletrônico: DevicePhoneMobileIcon,
  eletronico: DevicePhoneMobileIcon,
  celular: DevicePhoneMobileIcon,
  telefone: DevicePhoneMobileIcon,
  móvel: HomeIcon,
  movel: HomeIcon,
  móveis: HomeIcon,
  moveis: HomeIcon,
  casa: HomeIcon,
  roupa: ShoppingBagIcon,
  roupas: ShoppingBagIcon,
  vestuário: ShoppingBagIcon,
  moda: ShoppingBagIcon,
  livro: BookOpenIcon,
  livros: BookOpenIcon,
  literatura: BookOpenIcon,
  brinquedo: PuzzlePieceIcon,
  brinquedos: PuzzlePieceIcon,
  infantil: PuzzlePieceIcon,
  esporte: TrophyIcon,
  esportes: TrophyIcon,
  fitness: TrophyIcon,
  computador: ComputerDesktopIcon,
  informática: ComputerDesktopIcon,
  informatica: ComputerDesktopIcon,
  ferramenta: WrenchScrewdriverIcon,
  ferramentas: WrenchScrewdriverIcon,
  música: MusicalNoteIcon,
  musica: MusicalNoteIcon,
  instrumento: MusicalNoteIcon,
  câmera: CameraIcon,
  camera: CameraIcon,
  foto: CameraIcon,
  saúde: HeartIcon,
  saude: HeartIcon,
  beleza: SparklesIcon,
  carro: TruckIcon,
  veículo: TruckIcon,
  veiculo: TruckIcon,
  caixa: CubeIcon,
  outros: TagIcon,
}

export function getCategoryIcon(categoryName: string): HeroIcon {
  const lower = categoryName.toLowerCase().trim()

  if (iconMap[lower]) return iconMap[lower]

  for (const [key, icon] of Object.entries(iconMap)) {
    if (lower.includes(key) || key.includes(lower)) return icon
  }

  return TagIcon
}
