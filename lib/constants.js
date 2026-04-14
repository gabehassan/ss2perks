export const BASE_STATS = {
  MaxHp:100, AttackTime:0.15, MaxAmmoCount:5, ReloadTime:1.5,
  ReloadSpeed:1, AttackSpeed:1, BulletDamage:5, BulletForce:10,
  MoveSpeedMultiplier:1, NumProjectiles:1, BulletSpread:30, ShotInaccuracy:5,
  BulletSpeed:440, BulletLifetime:0.72, Luck:1, CritChance:0.05,
  CritMultiplier:1.5, LowHealthDamageMultiplier:1, FullHealthDamageMultiplier:1,
  NumDashes:1, DashCooldown:3.8, DashInvulnTime:0.25, DashStrength:250,
  FireDamage:2.5, FireLifetime:5, FreezeLifetime:4, FreezeTimeScale:0.6,
  FreezeFireDamageMultiplier:1, FearLifetime:2, FearDamageMultiplier:1,
  CoinAttractRange:155, CoinAttractStrength:220, NumPerkChoices:3, PushStrength:200,
  LastAmmoDamageMultiplier:1, OverallDamageMultiplier:1, NonBulletDamageMultiplier:1,
  ExplosionSizeMultiplier:1, ExplosionDamageMultiplier:1, BulletDamageMultiplier:1,
  AttackSpeedStill:1, ReloadSpeedStill:1, ReloadingMovespeedMultiplier:1,
  ShootingMovespeedMultiplier:1, Friction:8.5, CameraDistance:800, RadiusMultiplier:1,
  XpGainMultiplier:1, HealthyUnitDamagePercent:1, Scale:1, PoisonDamage:1.2,
  TurnSpeed:10, HealEffectiveness:1, ShotDamageMult:1, HealthRegen:0,
  DodgeChance:0, DamageReductionPercent:0, BulletNumPiercing:0, BulletNumBouncing:0,
  BulletSplashChance:0, BulletSplashDamagePercent:0, BulletDamageGrow:0,
  ShootFireIgniteChance:0, ShootFreezeChance:0, ShootPoisonChance:0,
  RarityIncreaseLegendary:0, RarityIncreaseUnique:0, BossSpawnSecondsEarly:0,
  NumRerollsPerLevel:0
};

export const RARITY_COLORS = {
  Common:'#999', Uncommon:'#4CAF50', Rare:'#2196F3', Epic:'#9C27B0',
  Mythic:'#FF5722', Legendary:'#FFD700', Unique:'#FF4081'
};

export const RARITY_ORDER = ['Common','Uncommon','Rare','Epic','Mythic','Legendary','Unique'];

export const STAT_DISPLAY = [
  // Combat
  { key:'_DPS', label:'DPS', icon:'\u{1F4CA}', format:'1f', section:'COMBAT', alwaysShow:true },
  { key:'BulletDamage', label:'Bullet Damage', icon:'\u{1F52B}', format:'1f', section:'COMBAT', alwaysShow:true },
  { key:'_DmgMult', label:'Damage Multiplier', icon:'\u2B06', format:'pctChange', section:'COMBAT', alwaysShow:true },
  { key:'NumProjectiles', label:'Bullets Per Shot', icon:'\u{1F4A0}', format:'int', section:'COMBAT', alwaysShow:true },
  { key:'MaxAmmoCount', label:'Ammo', icon:'\u{1F3AF}', format:'int', section:'COMBAT', alwaysShow:true },
  { key:'AttackSpeed', label:'Attack Speed', icon:'\u26A1', format:'pctFromBase', base:1, section:'COMBAT', alwaysShow:true },
  { key:'ReloadSpeed', label:'Reload Speed', icon:'\u{1F504}', format:'pctFromBase', base:1, section:'COMBAT', alwaysShow:true },
  // Bullet
  { key:'CritChance', label:'Bullet Crit Chance', icon:'\u{1F4A5}', format:'pct100', section:'BULLET', alwaysShow:true },
  { key:'CritMultiplier', label:'Crit Multiplier', icon:'\u2716', format:'pct100', section:'BULLET', alwaysShow:true },
  { key:'BulletSplashChance', label:'Bullet Splash Chance', icon:'\u{1F4A6}', format:'pct100', section:'BULLET' },
  { key:'BulletSplashDamagePercent', label:'Bullet Splash Damage', icon:'\u{1F4A6}', format:'pct100', section:'BULLET' },
  { key:'BulletDamageGrow', label:'Bullet Damage Growth', icon:'\u{1F4C8}', format:'perSec', section:'BULLET' },
  { key:'BulletSpeed', label:'Bullet Speed', icon:'\u27A1', format:'pctFromBase', base:440, section:'BULLET' },
  { key:'BulletLifetime', label:'Bullet Lifetime', icon:'\u23F3', format:'2f', section:'BULLET' },
  { key:'BulletNumPiercing', label:'Bullet Pierce', icon:'\u{1F5E1}', format:'int', section:'BULLET' },
  { key:'BulletNumBouncing', label:'Bullet Bounces', icon:'\u21A9', format:'int', section:'BULLET' },
  // Survival
  { key:'MaxHp', label:'Max Health', icon:'\u2764', format:'int', section:'SURVIVAL', alwaysShow:true },
  { key:'HealthRegen', label:'Health Regen', icon:'\u{1F49A}', format:'perSec', section:'SURVIVAL' },
  { key:'DodgeChance', label:'Dodge Chance', icon:'\u{1F6E1}', format:'pct100', section:'SURVIVAL' },
  { key:'DamageReductionPercent', label:'Damage Reduction', icon:'\u{1F6E1}', format:'pct100', section:'SURVIVAL' },
  // Mobility
  { key:'MoveSpeedMultiplier', label:'Move Speed', icon:'\u{1F3C3}', format:'pctFromBase', base:1, section:'MOBILITY', alwaysShow:true },
  { key:'NumDashes', label:'Num Dashes', icon:'\u{1F4A8}', format:'int', section:'MOBILITY', alwaysShow:true },
  { key:'DashCooldown', label:'Dash Cooldown', icon:'\u23F1', format:'1f', section:'MOBILITY', inverted:true },
  { key:'Scale', label:'Body Size', icon:'\u{1F4D0}', format:'pctFromBase', base:1, section:'MOBILITY' },
  { key:'CameraDistance', label:'Camera Distance', icon:'\u{1F52D}', format:'pctFromBase', base:800, section:'MOBILITY' },
  // Elemental
  { key:'ShootFireIgniteChance', label:'Fire Chance', icon:'\u{1F525}', format:'pct100', section:'ELEMENTAL' },
  { key:'FireDamage', label:'Fire Damage', icon:'\u{1F525}', format:'1f', section:'ELEMENTAL' },
  { key:'ShootFreezeChance', label:'Freeze Chance', icon:'\u2744', format:'pct100', section:'ELEMENTAL' },
  { key:'ShootPoisonChance', label:'Poison Chance', icon:'\u2620', format:'pct100', section:'ELEMENTAL' },
  { key:'PoisonDamage', label:'Poison Damage', icon:'\u2620', format:'1f', section:'ELEMENTAL' },
  // Rarity
  { key:'RarityIncreaseLegendary', label:'Legendary Perk Chance', icon:'\u2B50', format:'pctAdd', section:'RARITY' },
  { key:'RarityIncreaseUnique', label:'Unique Perk Chance', icon:'\u{1F48E}', format:'pctAdd', section:'RARITY' },
];

export const INVERTED_STATS = new Set(['DashCooldown','AttackTime','ReloadTime']);
