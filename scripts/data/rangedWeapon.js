export const releaseWeapon = { // 당겨서 놓았을 때 발사되는 무기
    "fs:r306_l": {
        bullet: "fs:r306_bullet",
        speed: 5,
        damage: 5,
        sound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        emptyWeapon: "fs:r306_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 4, tick: 2.5 }
    },
    "fs:r306_mk1_l": {
        bullet: "fs:r306_bullet",
        speed: 5,
        damage: 7,
        sound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        emptyWeapon: "fs:r306_mk1_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 2 }
    },
    "fs:r306_mk2_l": {
        bullet: "fs:r306_bullet",
        speed: 6,
        damage: 1,
        sound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        emptyWeapon: "fs:r306_mk2_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 2 }
    },
    "fs:r306_mk3_l": {
        bullet: "fs:r306_bullet",
        speed: 9,
        damage: 1,
        sound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        emptyWeapon: "fs:r306_mk3_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 2 }
    },
    "fs:sentinel": {
        bullet: "fs:sentinel_bullet",
        speed: 15,
        damage: 35,
        sound1: { name: "fs_bolt_action", pitch: 1, volume: 0.5 },
        sound2: { name: "fs_sniper_single", pitch: 1, volume: 15 },
        emptyWeapon: "fs:sentinel_e",
        weaponAmmo: "fs:sniper_ammo",
        burst: { count: 1, tick: 0 }
    },
    "fs:pump_action": {
        bullet: "fs:shotgun_pellet",
        speed: 4,
        damage: 6,
        sound1: { name: "fs_shotgun_fire", pitch: 1, volume: 15 },
        sound2: { name: "fs_shotgun_rack", pitch: 1, volume: 0.5 },
        emptyWeapon: undefined,
        burst: { count: 5, tick: 0 }
    },
    "fs:shotty_l": {
        bullet: "fs:shotgun_pellet",
        speed: 6,
        damage: 15,
        sound1: { name: "fs_shotgun_fire", pitch: 1, volume: 15 },
        emptyWeapon: "fs:shotty_e",
        weaponAmmo: "fs:shotgun_ammo",
        burst: { count: 8, tick: 0 }
    },
    "fs:h8r_l": {
        bullet: "fs:r306_bullet",
        speed: 8,
        damage: 21,
        sound1: { name: "fs_sniper_single", pitch: 1.6, volume: 15 },
        emptyWeapon: "fs:h8r_e",
        weaponAmmo: "fs:shotgun_ammo",
        burst: { count: 1, tick: 0 }
    },
    "fs:mk33_l": {
        bullet: "fs:r306_bullet",
        speed: 9,
        damage: 1,
        sound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        emptyWeapon: "fs:r306_mk3_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 3 }
    },
    "fs:handcannon": {
        bullet: "fs:he_shell",
        speed: 10,
        damage: 20,
        sound1: { name: "fs_flak88", pitch: 1.3, volume: 10 },
        emptyWeapon: "fs:handcannon_e",
        weaponAmmo: "fs:sniper_ammo",
        burst: { count: 2, tick: 0 }
    }
};

export const useWeapon = { // 우클릭 시 즉발하는 무기
    "fs:mg50": {
        bullet: "fs:mg50_bullet",
        speed: 8,
        damage: 1,
        spreadAngle: 0.2,
        sound1: { name: "mob.ravager.step", pitch: 2.5, volume: 15 },
        ammoItem: "fs:ammo_backpack",
        burst: { count: 2, tick: 4 }
    }
};