import { system } from "@minecraft/server";
import { releaseWeaponList } from 'data/gun';
import { shootWeapon } from "./shootWeapon";

export function itemReleaseUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;

    const weapon = releaseWeaponList.find(w => w.weaponName === item.typeId);
    if (weapon && player.getDynamicProperty("reload") < 1) {
        system.run(() => {
            shootWeapon(player, item, weapon); // 첫 번째 발사
            for (let i = 1; i < weapon.burst.count; i++) {
                system.runTimeout(() => {
                    shootWeapon(player, item, weapon);
                }, weapon.burst.tick * i);
            }
        });
    }
}
