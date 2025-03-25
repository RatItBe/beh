export const releaseWeapon = { // 당겨서 놓았을 때 발사되는 무기
    "fs:r306_l": {
        bullet: {
            typeId: "fs:r306_bullet",
            speed: 5,
            damage: 5
        },
        spreadAngle: 0.3, // 정확도
        weaponSound1: { name: "camera.take_picture", pitch: 2, volume: 10 }, // 소리 설정
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:r306_e", // 비어있는 총 이름
        weaponAmmo: "fs:r306_ammo", // 장전할 때 쓸 탄창 이름
        burst: { count: 4, tick: 2.5 } // 점사 정보, (count: 1 = 단발, tick: 0 = 한번에 발사)
    },
    "fs:r306_mk1_l": {
        bulletName: "fs:r306_bullet",
        bulletSpeed: 5,
        bulletDamage: 7,
        spreadAngle: 0.3,
        weaponSound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:r306_mk1_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 2 }
    },
    "fs:r306_mk2_l": {
        bulletName: "fs:r306_bullet",
        bulletSpeed: 6,
        bulletDamage: 1,
        spreadAngle: 0.25,
        weaponSound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:r306_mk2_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 2 }
    },
    "fs:r306_mk3_l": {
        bulletName: "fs:r306_bullet",
        bulletSpeed: 9,
        bulletDamage: 1,
        spreadAngle: 0.1,
        weaponSound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:r306_mk3_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 2 }
    },
    "fs:sentinel": {
        bulletName: "fs:sentinel_bullet",
        bulletSpeed: 15,
        bulletDamage: 35,
        spreadAngle: 0.01,
        weaponSound1: { name: "fs_bolt_action", pitch: 1, volume: 0.5 },
        weaponSound2: { name: "fs_sniper_single", pitch: 1, volume: 15 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:sentinel_e",
        weaponAmmo: "fs:sniper_ammo",
        burst: { count: 1, tick: 0 }
    },
    "fs:pump_action": {
        bulletName: "fs:shotgun_pellet",
        bulletSpeed: 4,
        bulletDamage: 6,
        spreadAngle: 0.7,
        weaponSound1: { name: "fs_shotgun_fire", pitch: 1, volume: 15 },
        weaponSound2: { name: "fs_shotgun_rack", pitch: 1, volume: 0.5 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: undefined,
        burst: { count: 5, tick: 0 }
    },
    "fs:shotty_l": {
        bulletName: "fs:shotgun_pellet",
        bulletSpeed: 6,
        bulletDamage: 15,
        spreadAngle: 0.4,
        weaponSound1: { name: "fs_shotgun_fire", pitch: 1, volume: 15 },
        weaponSound2: { name: false, pitch: 1, volume: 0.5 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:shotty_e",
        weaponAmmo: "fs:shotgun_ammo",
        burst: { count: 8, tick: 0 }
    },
    "fs:h8r_l": {
        bulletName: "fs:r306_bullet",
        bulletSpeed: 8,
        bulletDamage: 21,
        spreadAngle: 0.1,
        weaponSound1: { name: "fs_sniper_single", pitch: 1.6, volume: 15 },
        weaponSound2: { name: false, pitch: 1, volume: 0.5 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:h8r_e",
        weaponAmmo: "fs:shotgun_ammo",
        burst: { count: 1, tick: 0 }
    },
    "fs:mk33_l": {
        bulletName: "fs:r306_bullet",
        bulletSpeed: 9,
        bulletDamage: 1,
        spreadAngle: 0.1,
        weaponSound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:r306_mk3_e",
        weaponAmmo: "fs:r306_ammo",
        burst: { count: 3, tick: 3 }
    },
    "fs:handcannon": {
        bulletName: "fs:he_shell",
        bulletSpeed: 10,
        bulletDamage: 20,
        spreadAngle: 0,
        weaponSound1: { name: "fs_flak88", pitch: 1.3, volume: 10 },
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:handcannon_e",
        weaponAmmo: "fs:sniper_ammo",
        burst: { count: 2, tick: 0 }
    }
};

export const useWeapon = { // 우클릭 시 즉발하는 무기
    "fs:mg50": {
        ammoItem: "fs:ammo_backpack",
        bulletName: "fs:mg50_bullet",
        bulletSpeed: 8,
        bulletDamage: 1,
        spreadAngle: 0.2,
        weaponSound1: { name: "mob.ravager.step", pitch: 2.5, volume: 15 },
        weaponSound2: { name: false, pitch: 1, volume: 0.5 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        burst: { count: 2, tick: 4 }
    }
};