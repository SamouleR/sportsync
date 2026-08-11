// ===== Sport Configuration Constants =====
// Extracted from store.js to be the single source of truth for sport formats

export const SPORTS_CONFIG = {
  football: {
    label: 'Football',
    icon: 'sports_soccer',
    formats: {
      'foot11': {
        label: 'Foot à 11',
        titulaires: 11,
        remplacants: 7,
        maxConvocation: 18,
        positions: ['Gardien','Défenseur central','Latéral droit','Latéral gauche','Milieu défensif','Milieu central','Milieu offensif','Ailier droit','Ailier gauche','Avant-centre','Second attaquant'],
        positionCategories: {
          'Gardien': ['Gardien'],
          'Défenseurs': ['Défenseur central','Latéral droit','Latéral gauche'],
          'Milieux': ['Milieu défensif','Milieu central','Milieu offensif'],
          'Attaquants': ['Ailier droit','Ailier gauche','Avant-centre','Second attaquant'],
        },
      },
      'foot5': {
        label: 'Foot à 5',
        titulaires: 5,
        remplacants: 3,
        maxConvocation: 8,
        positions: ['Gardien','Défenseur','Pivot','Ailier droit','Ailier gauche'],
        positionCategories: {
          'Gardien': ['Gardien'],
          'Défenseurs': ['Défenseur'],
          'Attaquants': ['Pivot','Ailier droit','Ailier gauche'],
        },
      },
    },
  },
  basketball: {
    label: 'Basketball',
    icon: 'sports_basketball',
    formats: {
      'basket5x5': {
        label: 'Basket 5x5',
        titulaires: 5,
        remplacants: 7,
        maxConvocation: 12,
        positions: ['Meneur','Arrière','Ailier','Ailier fort','Pivot'],
        positionCategories: {
          'Extérieurs': ['Meneur','Arrière'],
          'Intérieurs': ['Ailier','Ailier fort','Pivot'],
        },
      },
      'basket3x3': {
        label: 'Basket 3x3',
        titulaires: 3,
        remplacants: 1,
        maxConvocation: 4,
        positions: ['Meneur','Ailier','Pivot'],
        positionCategories: {
          'Postes': ['Meneur','Ailier','Pivot'],
        },
      },
    },
  },
};

// Default club configuration
export const DEFAULT_CLUB_CONFIG = {
  sport: 'football',
  format: 'foot11',
};

// Get the current format config
export const getFormatConfig = (sport, format) => {
  return SPORTS_CONFIG[sport]?.formats[format] || SPORTS_CONFIG.football.formats.foot11;
};

// Default locations
export const LOCATIONS = [
  'Terrain synthétique principal',
  'Gymnase municipal',
  'Stade André Lemoine',
  'Terrain annexe B',
];
