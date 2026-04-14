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
  Common:'#9e9e9e', Uncommon:'#66bb6a', Rare:'#42a5f5', Epic:'#ab47bc',
  Mythic:'#ff7043', Legendary:'#ffd54f', Unique:'#ec407a'
};

export const RARITY_ORDER = ['Common','Uncommon','Rare','Epic','Mythic','Legendary','Unique'];

// Stats panel config - ordered to match the in-game STATS screen
export const STAT_DISPLAY = [
  // Top - Boss & DPS
  { key:'_BossArrival', label:'Boss Arrival Time', icon:'⏱', format:'time', section:'COMBAT', alwaysShow:true },
  { key:'_DPS', label:'DPS', icon:'📊', format:'1f', section:'COMBAT', alwaysShow:true },
  // Combat
  { key:'BulletDamage', label:'Bullet Damage', icon:'🔫', format:'1f', section:'COMBAT', alwaysShow:true },
  { key:'_DmgMult', label:'Damage Multiplier', icon:'⬆', format:'pctChange', section:'COMBAT', alwaysShow:true },
  { key:'NumProjectiles', label:'Bullets Per Shot', icon:'💠', format:'int', section:'COMBAT', alwaysShow:true },
  { key:'MaxAmmoCount', label:'Ammo', icon:'🎯', format:'int', section:'COMBAT', alwaysShow:true },
  { key:'AttackSpeed', label:'Attack Speed', icon:'⚡', format:'multPct', base:1, section:'COMBAT', alwaysShow:true },
  { key:'ReloadSpeed', label:'Reload Speed', icon:'🔄', format:'multPct', base:1, section:'COMBAT', alwaysShow:true },
  { key:'MoveSpeedMultiplier', label:'Move Speed', icon:'🏃', format:'multPct', base:1, section:'COMBAT', alwaysShow:true },
  // Survival
  { key:'MaxHp', label:'Max Health', icon:'❤', format:'intChange', base:100, section:'SURVIVAL', alwaysShow:true },
  { key:'HealthRegen', label:'Health Regen', icon:'💚', format:'perSec', section:'SURVIVAL' },
  { key:'DodgeChance', label:'Dodge Chance', icon:'🛡', format:'pct100', section:'SURVIVAL' },
  { key:'DamageReductionPercent', label:'Damage Reduction', icon:'🛡', format:'pct100', section:'SURVIVAL' },
  // Bullet
  { key:'CritChance', label:'Bullet Crit Chance', icon:'💥', format:'pct100', section:'BULLET', alwaysShow:true },
  { key:'CritMultiplier', label:'Crit Multiplier', icon:'✖', format:'pct100', section:'BULLET', alwaysShow:true },
  { key:'BulletSplashChance', label:'Bullet Splash Chance', icon:'💦', format:'pct100', section:'BULLET' },
  { key:'BulletSplashDamagePercent', label:'Bullet Splash Damage', icon:'💦', format:'pct100', section:'BULLET' },
  { key:'BulletDamageGrow', label:'Bullet Damage Growth', icon:'📈', format:'perSec', section:'BULLET' },
  { key:'BulletSpeed', label:'Bullet Speed', icon:'➡', format:'multPct', base:440, section:'BULLET' },
  { key:'BulletLifetime', label:'Bullet Lifetime', icon:'⏳', format:'2f', section:'BULLET' },
  { key:'BulletNumPiercing', label:'Bullet Pierce', icon:'🗡', format:'int', section:'BULLET' },
  { key:'BulletNumBouncing', label:'Bullet Bounces', icon:'↩', format:'int', section:'BULLET' },
  // Mobility
  { key:'NumDashes', label:'Num Dashes', icon:'💨', format:'int', section:'MOBILITY', alwaysShow:true },
  { key:'DashCooldown', label:'Dash Cooldown', icon:'⏱', format:'1f', section:'MOBILITY', inverted:true },
  { key:'Scale', label:'Body Size', icon:'📐', format:'multPct', base:1, section:'MOBILITY' },
  { key:'CameraDistance', label:'Camera Distance', icon:'🔭', format:'multPct', base:800, section:'MOBILITY' },
  // Elemental
  { key:'ShootFireIgniteChance', label:'Fire Chance', icon:'🔥', format:'pct100', section:'ELEMENTAL' },
  { key:'FireDamage', label:'Fire Damage', icon:'🔥', format:'1f', section:'ELEMENTAL' },
  { key:'ShootFreezeChance', label:'Freeze Chance', icon:'❄', format:'pct100', section:'ELEMENTAL' },
  { key:'ShootPoisonChance', label:'Poison Chance', icon:'☠', format:'pct100', section:'ELEMENTAL' },
  { key:'PoisonDamage', label:'Poison Damage', icon:'☠', format:'1f', section:'ELEMENTAL' },
  // Rarity
  { key:'RarityIncreaseLegendary', label:'Legendary Perk Chance', icon:'⭐', format:'pctAdd', section:'RARITY' },
  { key:'RarityIncreaseUnique', label:'Unique Perk Chance', icon:'💎', format:'pctAdd', section:'RARITY' },
];

export const INVERTED_STATS = new Set(['DashCooldown','AttackTime','ReloadTime']);
