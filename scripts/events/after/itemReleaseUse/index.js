import { system } from "@minecraft/server";
import { releaseWeaponList } from 'data/gun';
import { RangedWeaponSystem } from "class/rangedWeaponSystem";

export function itemReleaseUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;
    const useDuration = eventData.useDuration;

    const weapon = releaseWeaponList.find(w => w.weaponName === item.typeId);
    const emptyWeapon = releaseWeaponList.find(w => w.emptyWeaponName === item.typeId);
    if (emptyWeapon) {
        if (useDuration <= 200000) RangedWeaponSystem.rangedWeaponReload(player, emptyWeapon);
    }
    else if (weapon) {
        system.run(() => {
            RangedWeaponSystem.type1Check(player, weapon, item); // 첫 번째 발사
            for (let i = 1; i < weapon.burst.count; i++) {
                system.runTimeout(() => {
                    RangedWeaponSystem.type1Check(player, weapon, item);
                }, weapon.burst.tick * i);
            }
        });
    }
}
