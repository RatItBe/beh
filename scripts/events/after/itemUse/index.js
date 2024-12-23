import { system } from "@minecraft/server";
import { useWeaponList } from 'data/gun';
import { shootWeapon } from "./shootWeapon";

export function itemUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;

    const weapon = useWeaponList.find(w => w.weaponName === item.typeId);
    if (weapon && player.isSneaking) {
        system.run(() => {
            shootWeapon(player, weapon); // 첫 번째 발사
            for (let i = 1; i < weapon.burst.count; i++) {
                system.runTimeout(() => {
                    shootWeapon(player, weapon);
                }, weapon.burst.tick * i);
            }
        });
    }
}
