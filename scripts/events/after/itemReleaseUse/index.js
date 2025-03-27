import { system } from "@minecraft/server";
import { RangedWeaponSystem } from "class/rangedWeaponSystem";
import { releaseWeapon } from "data/rangedWeapon";

export function itemReleaseUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;
    const useDuration = eventData.useDuration;

    const weapon = releaseWeapon[item.typeId];
    const emptyWeapon = Object.values(releaseWeapon).some(releaseWeapon => releaseWeapon.emptyWeapon === item.typeId);

    if (emptyWeapon) {
        if (useDuration <= 200000) RangedWeaponSystem.rangedWeaponReload(player, emptyWeapon);
    }
    else if (weapon) {
        system.run(() => {
            RangedWeaponSystem.releaseShoot(player, weapon, item); // 첫 번째 발사
            for (let i = 1; i < weapon.burst.count; i++) {
                system.runTimeout(() => {
                    RangedWeaponSystem.releaseShoot(player, weapon, item);
                }, weapon.burst.tick * i);
            }
        });
    }
}
