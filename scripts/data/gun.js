// 총기 리스트 (새 총 추가할 때마다 복붙 후 수정)
// 현재 releaseWeapon 과 useWeapon 2종류 있음

export const releaseWeaponList = [ // 당겨서 놓았을 때 발사되는 총 리스트
    {
        weaponName: "fs:r306_l", // 총 이름
        bulletName: "fs:r306_bullet", // 탄알 이름
        bulletSpeed: 5, // 탄알 속도
        bulletDamage: 1, // 탄알 데미지
        spreadAngle: 0.3, // 정확도
        weaponSound1: { name: "camera.take_picture", pitch: 2, volume: 10 }, // 소리 설정
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:r306_e", // 비어있는 총 이름
        burst: { count: 3, tick: 2 } // 점사 정보, (count: 1 = 단발, tick: 0 = 한번에 발사)
    },
    {
        weaponName:"fs:r306_mk1_l",
        bulletName: "fs:r306_bullet",
        bulletSpeed: 5,
        bulletDamage: 1,
        spreadAngle: 0.3,
        weaponSound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:r306_mk1_e",
        burst: { count: 3, tick: 2 }
    },
    {
        weaponName: "fs:r306_mk2_l",
        bulletName: "fs:r306_bullet",
        bulletSpeed: 6,
        bulletDamage: 1,
        spreadAngle: 0.25,
        weaponSound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:r306_mk2_e",
        burst: { count: 3, tick: 2 }
    },
    {
        weaponName: "fs:r306_mk3_l",
        bulletName: "fs:r306_bullet",
        bulletSpeed: 9,
        bulletDamage: 1,
        spreadAngle: 0.1,
        weaponSound1: { name: "camera.take_picture", pitch: 2, volume: 10 },
        weaponSound2: { name: false, pitch: 2, volume: 10 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: "fs:r306_mk3_e",
        burst: { count: 3, tick: 2 }
    },
    {
        weaponName: "fs:sentinel",
        bulletName: "fs:sentinel_bullet",
        bulletSpeed: 30,
        bulletDamage: 35,
        spreadAngle: 0.01,
        weaponSound1: { name: "fs_bolt_action", pitch: 1, volume: 0.5 },
        weaponSound2: { name: "fs_sniper_single", pitch: 1, volume: 15 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: undefined,
        burst: { count: 1, tick: 0 }
    },
    {
        weaponName: "fs:pump_action",
        bulletName: "fs:shotgun_pellet",
        bulletSpeed: 8,
        bulletDamage: 6,
        spreadAngle: 0.8,
        weaponSound1: { name: "fs_shotgun_fire", pitch: 1, volume: 15 },
        weaponSound2: { name: "fs_shotgun_rack", pitch: 1, volume: 0.5 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: undefined,
        burst: { count: 5, tick: 0 }
    },
    {
        weaponName: "fs:shotty_l",
        bulletName: "fs:shotgun_pellet",
        bulletSpeed: 8,
        bulletDamage: 10,
        spreadAngle: 0.25,
        weaponSound1: { name: "fs_shotgun_fire", pitch: 1, volume: 15 },
        weaponSound2: { name: "fs_shotgun_rack", pitch: 1, volume: 0.5 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: undefined,
        burst: { count: 8, tick: 0 }
    },
    {
        weaponName: "fs:h8r_l",
        bulletName: "fs:r306_bullet",
        bulletSpeed: 8,
        bulletDamage: 21,
        spreadAngle: 0.1,
        weaponSound1: { name: "fs_sniper_single", pitch: 1.6, volume: 15 },
        weaponSound2: { name: false, pitch: 1, volume: 0.5 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        emptyWeaponName: undefined,
        burst: { count: 1, tick: 0 }
    }
];

export const useWeaponList = [ // 클릭 시 즉발하는 총 리스트
    {
        weaponName: "fs:mg50", // 총 이름
        ammoItem: "fs:ammo_backpack", // 탄약 아이템 이름
        bulletName: "fs:mg50_bullet", // 탄알 이름
        bulletSpeed: 8, // 탄알 속도
        bulletDamage: 1, // 탄알 데미지
        spreadAngle: 0.2, // 퍼짐 각도
        weaponSound1: { name: "mob.ravager.step", pitch: 2.5, volume: 15 },
        weaponSound2: { name: false, pitch: 1, volume: 0.5 },
        weaponSound3: { name: false, pitch: 2, volume: 10 },
        burst: { count: 2, tick: 4 }
    }
];