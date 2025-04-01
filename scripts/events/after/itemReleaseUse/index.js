import { system } from "@minecraft/server";
import { RangedWeaponSystem } from "class/weapon/rangedWeaponSystem";
import { releaseWeapon } from "data/rangedWeapon";

export function itemReleaseUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;

    const weapon = releaseWeapon.find(w => w.weaponName === item.typeId);
    if (weapon) {
        system.run(() => {
            const rangedWeaponSystem = new RangedWeaponSystem(eventData);
            rangedWeaponSystem.releaseShoot(); // 첫 번째 발사
            for (let i = 1; i < weapon.burst.count; i++) {
                system.runTimeout(() => {
                    rangedWeaponSystem.releaseShoot();
                }, weapon.burst.tick * i);
            }
        });
        return;
    }

    const useDuration = eventData.useDuration;
    const emptyWeapon = releaseWeapon.find(w => w.emptyWeapon === item.typeId);
    if (emptyWeapon && useDuration <= 200000) {
        const rangedWeaponSystem = new RangedWeaponSystem(eventData);
        rangedWeaponSystem.rangedWeaponReload();
        return;
    }
}
