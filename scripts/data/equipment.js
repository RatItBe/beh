// 알파벳 순으로 정렬하면 좋음

export const equipmentData = {
    "fs:cleaver": {
        "maximumDurability": 100,
        "meleeDamage": 4,
        "meleeType": "slash",
        "meleeCooldown": 1,
        "criticalChance": 10,
        "availableAbility": ["melee", "sword"],
        "version": 1
    },
    "fs:debug_book": {
        "currentDurability": 100,
        "maximumDurability": 100,
        "meleeDamage": 10,
        "meleeType": "strike",
        "meleeCooldown": 0,
        "criticalChance": 100,
        "version": 1
    },
    "fs:greatsword": {
        "currentDurability": 100,
        "maximumDurability": 100,
        "meleeDamage": 10,
        "meleeType": "slash",
        "meleeCooldown": 3,
        "criticalChance": 50,
        "availableAbility": ["§6휩쓸기", "§e분쇄", "§7검무", "§a검기"],
        "version": 1
    },
    "fs:handcannon": {
        bullet: {
            name: "fs:he_shell",
            speed: 10,
            damage: 20
        },
        sounds: {
            sound1: { name: "fs_flak88", pitch: 1.3, volume: 10 },
        },
        emptyWeapon: "fs:handcannon_e",
        weaponAmmo: "fs:sniper_ammo",
        burst: { count: 2, tick: 0 },
        version: 1
    },
    "fs:h8r_l": {
        "maximumDurability": 100, // 최대 내구도
        "meleeDamage": 3, // 근거리 공격 데미지
        "meleeType": "strike", // 근거리 공격 유형, "slash" "strike" "pierce"
        "meleeCooldown": 0.5, // 근거리 공격 쿨타임
        "meleeSound": [ // 근거리 공격 소리
            { "soundName": "fs_sniper_single", "pitch": 1.6, "volume": 15 },
        ],
        "criticalChance": 0, // 치명타 확률
        "rangedDamage": 5, // 원거리 공격 데미지
        "rangedType": "pierce", // 원거리 공격 유형, "slash" "strike" "pierce"
        "rangedCooldown": 0.8, // 원거리 공격 쿨타임
        "rangedSound": [ // 원거리 공격 소리
            { "soundName": "fs_sniper_single", "pitch": 1.6, "volume": 15 },
        ],
        "inaccuracy": { "default": 10, "sneaking": 10, "jumping": 30, "moving": 10 }, // 부정확성, 0에 가까울수록 조준한대로 발사됨
        "projectileAmount": 1, // 투사체 개수
        "projectileSpeed": 8, // 투사체 속도
        "maximumAmmo": 10, // 최대 탄약 수
        "reloadItem": "fs:shotgun_ammo", // 장전에 필요한 아이템
        "emptyWeapon": "fs:h8r_e", // 탄약이 다 떨어졌을 때 변환될 아이템(보류)
        "availableAbility": ["§c화염탄", "§e빠른 장전", "§d정밀 사격"], // 부여될 수 있는 능력 목록
        "version": 1, // 이 아이템 버전
    },
    "fs:mg50": {
        "maximumDurability": 100,
        "meleeDamage": 5,
        "meleeType": "strike",
        "meleeCooldown": 1,
        "meleeSound": [
            { "soundName": "fs_sniper_single", "pitch": 1.6, "volume": 15 },
        ],
        "criticalChance": 0,
        "rangedDamage": 5,
        "rangedType": "strike",
        "rangedCooldown": 0.1,
        "rangedSound": [
            { "soundName": "mob.ravager.step", "pitch": 2.5, "volume": 15 },
        ],
        "inaccuracy": { "default": 10, "sneaking": 10, "jumping": 30, "moving": 10 },
        "projectileAmount": 2,
        "projectileBurstDelay": 4,
        "projectileSpeed": 8,
        "ammoBackpack": "fs:ammo_backpack",
        "availableAbility": ["§c연사력+", "§e관통", "§d견고"],
        "version": 1,
    },
    "fs:mk33_l": {
        bullet: {
            name: "fs:r306_bullet",
            speed: 9,
            damage: 1
        },
        sounds: {
            sound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        },
        emptyWeapon: "fs:r306_mk3_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 3 }
    },
    "fs:pump_action": {
        bullet: {
            name: "fs:shotgun_pellet",
            speed: 4,
            damage: 6
        },
        sounds: {
            sound1: { name: "fs_shotgun_fire", pitch: 1, volume: 15 },
            sound2: { name: "fs_shotgun_rack", pitch: 1, volume: 0.5 },
        },
        emptyWeapon: undefined,
        burst: { count: 5, tick: 0 }
    },
    "fs:r306_l": {
        bullet: {
            name: "fs:r306_bullet",
            speed: 5,
            damage: 5
        },
        sounds: {
            sound1: { name: "camera.take_picture", pitch: 2, volume: 10 }
        },
        emptyWeapon: "fs:r306_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 4, tick: 2.5 }
    },
    "fs:r306_mk1_l": {
        bullet: {
            name: "fs:r306_bullet",
            speed: 5,
            damage: 7
        },
        sounds: {
            sound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        },
        emptyWeapon: "fs:r306_mk1_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 2 }
    },
    "fs:r306_mk2_l": {
        bullet: {
            name: "fs:r306_bullet",
            speed: 6,
            damage: 1
        },
        sounds: {
            sound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        },
        emptyWeapon: "fs:r306_mk2_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 2 }
    },
    "fs:r306_mk3_l": {
        bullet: {
            name: "fs:r306_bullet",
            speed: 9,
            damage: 1
        },
        sounds: {
            sound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        },
        emptyWeapon: "fs:r306_mk3_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 2 }
    },
    "fs:sentinel": {
        bullet: {
            name: "fs:sentinel_bullet",
            speed: 15,
            damage: 35
        },
        sounds: {
            sound1: { name: "fs_bolt_action", pitch: 1, volume: 0.5 },
            sound2: { name: "fs_sniper_single", pitch: 1, volume: 15 },
        },
        emptyWeapon: "fs:sentinel_e",
        weaponAmmo: "fs:sniper_ammo",
        burst: { count: 1, tick: 0 }
    },
    "fs:shotty_l": {
        bullet: {
            name: "fs:shotgun_pellet",
            speed: 6,
            damage: 15
        },
        sounds: {
            sound1: { name: "fs_shotgun_fire", pitch: 1, volume: 15 },
        },
        emptyWeapon: "fs:shotty_e",
        weaponAmmo: "fs:shotgun_ammo",
        burst: { count: 8, tick: 0 }
    },
};

// §6 §7 §a §b §c §d §e

export const equipmentList = Object.keys(equipmentData);