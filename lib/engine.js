import { BASE_STATS, INVERTED_STATS } from './constants';

/**
 * Compute final stats given a build (Map<perkId, level>) and perk data (Map<perkId, perkObj>).
 * Formula: final = (base + sum_adds) * product_mults
 * Set type: highest priority wins, replaces base entirely.
 */
export function computeStats(build, perksMap) {
  const adds = {};
  const mults = {};
  const sets = {};

  for (const [perkId, level] of build.entries()) {
    const perk = perksMap.get(perkId);
    if (!perk) continue;
    for (const mod of perk.modifiers) {
      if (!mod.values) continue;
      const val = mod.values[String(level)];
      if (val === undefined) continue;
      const stat = mod.stat;

      if (mod.type === 'Add') {
        adds[stat] = (adds[stat] || 0) + val;
      } else if (mod.type === 'Mult') {
        mults[stat] = (mults[stat] || 1) * val;
      } else if (mod.type === 'Set') {
        // Highest Set value wins
        if (sets[stat] === undefined || val > sets[stat]) {
          sets[stat] = val;
        }
      }
    }
  }

  const result = { ...BASE_STATS };

  // Apply to all known base stats
  for (const stat of Object.keys(BASE_STATS)) {
    let base = BASE_STATS[stat];
    if (sets[stat] !== undefined) {
      base = sets[stat];
    }
    const add = adds[stat] || 0;
    const mult = mults[stat] || 1;
    result[stat] = (base + add) * mult;
  }

  // Compute derived stats
  const dps = computeDPS(result);
  result._DPS = dps;

  // Combined damage multiplier for display
  result._DmgMult = result.BulletDamageMultiplier * result.OverallDamageMultiplier * result.ShotDamageMult;

  return result;
}

/**
 * Compute DPS from a stats object.
 * effectiveShotsPerSec = MaxAmmoCount / (MaxAmmoCount * AttackTime/AttackSpeed + ReloadTime/ReloadSpeed)
 * DPS = effectiveShotsPerSec * NumProjectiles * BulletDamage * BulletDamageMultiplier * OverallDamageMultiplier * ShotDamageMult * (1 + CritChance*(CritMultiplier-1))
 */
export function computeDPS(stats) {
  const attackTime = stats.AttackTime / stats.AttackSpeed;
  const reloadTime = stats.ReloadTime / stats.ReloadSpeed;
  const magTime = stats.MaxAmmoCount * attackTime + reloadTime;
  const effectiveShotsPerSec = magTime > 0 ? stats.MaxAmmoCount / magTime : 0;

  return effectiveShotsPerSec
    * stats.NumProjectiles
    * stats.BulletDamage
    * stats.BulletDamageMultiplier
    * stats.OverallDamageMultiplier
    * stats.ShotDamageMult
    * (1 + stats.CritChance * (stats.CritMultiplier - 1));
}

const BOSS_HP = { Easy: 4000, Normal: 5000, Hard: 7000 };

/**
 * Compute boss time-to-kill in seconds.
 */
export function computeBossTTK(dps, difficulty) {
  if (dps <= 0) return Infinity;
  return (BOSS_HP[difficulty] || 5000) / dps;
}

/**
 * Get boss arrival time in seconds (780 - BossSpawnSecondsEarly).
 */
export function getBossArrival(stats) {
  return 780 - (stats.BossSpawnSecondsEarly || 0);
}

/**
 * Format a stat value for display.
 */
export function formatStat(value, format, base) {
  switch (format) {
    case 'int':
      return Math.round(value).toString();
    case '1f':
      return value.toFixed(1);
    case '2f':
      return value.toFixed(2);
    case 'pct100':
      return (value * 100).toFixed(1) + '%';
    case 'pctFromBase': {
      const pct = ((value / (base || 1)) * 100).toFixed(0);
      return pct + '%';
    }
    case 'pctChange': {
      const pct = ((value - 1) * 100).toFixed(1);
      return (value >= 1 ? '+' : '') + pct + '%';
    }
    case 'pctAdd': {
      const pct = (value * 100).toFixed(1);
      return (value >= 0 ? '+' : '') + pct + '%';
    }
    case 'perSec':
      return value.toFixed(1) + '/s';
    default:
      return value.toFixed(1);
  }
}

/**
 * Determine if a stat change is positive, negative, or neutral.
 * Returns 'positive', 'negative', or null.
 */
export function getStatDirection(value, format, base, inverted) {
  let baseRef;
  let isIncreased;

  switch (format) {
    case 'pctFromBase':
      baseRef = base !== undefined ? base : 1;
      isIncreased = value > baseRef;
      break;
    case 'pctChange':
      baseRef = 1;
      isIncreased = value > 1;
      break;
    case 'pctAdd':
      baseRef = 0;
      isIncreased = value > 0;
      break;
    default:
      baseRef = base !== undefined ? base : 0;
      isIncreased = value > baseRef;
      break;
  }

  const isChanged = Math.abs(value - baseRef) > 0.0001;
  if (!isChanged) return null;

  if (inverted) {
    return isIncreased ? 'negative' : 'positive';
  }
  return isIncreased ? 'positive' : 'negative';
}

/**
 * Get a short label for a modifier stat for the preview line on perk cards.
 */
export function getStatShortLabel(stat) {
  const labels = {
    BulletDamage: 'BulletDmg',
    BulletDamageMultiplier: 'BulletDmg\u00D7',
    OverallDamageMultiplier: 'OverallDmg\u00D7',
    AttackSpeed: 'AtkSpd',
    ReloadSpeed: 'RldSpd',
    MoveSpeedMultiplier: 'MoveSpd',
    NumProjectiles: 'Bullets',
    MaxAmmoCount: 'Ammo',
    MaxHp: 'MaxHP',
    CritChance: 'CritChance',
    CritMultiplier: 'CritMult',
    BulletSpeed: 'BulletSpd',
    BulletLifetime: 'BulletLife',
    NumDashes: 'Dashes',
    DashCooldown: 'DashCD',
    BulletNumPiercing: 'Pierce',
    BulletNumBouncing: 'Bounce',
    HealthRegen: 'HPRegen',
    DodgeChance: 'Dodge',
    DamageReductionPercent: 'DmgReduc',
    ShootFireIgniteChance: 'FireChance',
    FireDamage: 'FireDmg',
    ShootFreezeChance: 'FreezeChance',
    ShootPoisonChance: 'PoisonChance',
    PoisonDamage: 'PoisonDmg',
    Scale: 'Size',
    ShotDamageMult: 'ShotDmg\u00D7',
    BulletSplashChance: 'SplashChance',
    BulletSplashDamagePercent: 'SplashDmg',
    BulletDamageGrow: 'DmgGrow',
    ExplosionSizeMultiplier: 'ExplSize',
    ExplosionDamageMultiplier: 'ExplDmg',
    CameraDistance: 'CamDist',
    XpGainMultiplier: 'XPGain',
    RarityIncreaseLegendary: 'Legendary+',
    RarityIncreaseUnique: 'Unique+',
    BossSpawnSecondsEarly: 'BossEarly',
    NumRerollsPerLevel: 'Rerolls',
    CoinAttractRange: 'CoinRange',
    CoinAttractStrength: 'CoinPull',
    BulletSpread: 'Spread',
    ShotInaccuracy: 'Inaccuracy',
    NonBulletDamageMultiplier: 'NonBulletDmg',
    Luck: 'Luck',
    LowHealthDamageMultiplier: 'LowHPDmg',
    FullHealthDamageMultiplier: 'FullHPDmg',
    LastAmmoDamageMultiplier: 'LastAmmoDmg',
    Friction: 'Friction',
    HealEffectiveness: 'HealEff',
    ReloadingMovespeedMultiplier: 'RldMoveSpd',
    ShootingMovespeedMultiplier: 'ShootMoveSpd',
    BulletForce: 'BulletForce',
    DashStrength: 'DashStr',
    DashInvulnTime: 'DashInvuln',
    PushStrength: 'PushStr',
    FreezeTimeScale: 'FreezeSpd',
    FreezeFireDamageMultiplier: 'FreezeFire',
    FearLifetime: 'FearDur',
    FearDamageMultiplier: 'FearDmg',
    AttackSpeedStill: 'AtkSpdStill',
    ReloadSpeedStill: 'RldSpdStill',
    NumPerkChoices: 'PerkChoices',
    TurnSpeed: 'TurnSpd',
    RadiusMultiplier: 'Radius',
    FreezeLifetime: 'FreezeDur',
    FireLifetime: 'FireDur',
    HealthyUnitDamagePercent: 'HealthyDmg',
  };
  return labels[stat] || stat.replace(/([A-Z])/g, ' $1').trim().substring(0, 12);
}

/**
 * Format a modifier value for preview display.
 */
export function formatModPreview(stat, type, value) {
  const isInverted = INVERTED_STATS.has(stat);

  if (type === 'Mult') {
    const isPositive = isInverted ? value < 1 : value > 1;
    const color = isPositive ? 'positive' : 'negative';
    return { text: `\u00D7${value.toFixed(2)}`, color };
  } else if (type === 'Add') {
    const isPositive = isInverted ? value < 0 : value > 0;
    const color = isPositive ? 'positive' : 'negative';
    const sign = value > 0 ? '+' : '';
    // Format as percentage if the stat base is between 0 and 1 (like CritChance)
    const base = BASE_STATS[stat];
    if (base !== undefined && base >= 0 && base < 1 && Math.abs(value) < 1) {
      return { text: `${sign}${(value * 100).toFixed(0)}%`, color };
    }
    return { text: `${sign}${Number.isInteger(value) ? value : value.toFixed(1)}`, color };
  } else if (type === 'Set') {
    return { text: `=${value}`, color: 'neutral' };
  }
  return { text: String(value), color: 'neutral' };
}
