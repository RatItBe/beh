import { system, EquipmentSlot } from "@minecraft/server";
import { useWeaponList } from 'data/gun';
import { shootWeapon } from "./shootWeapon";
import { BleedSystem } from "class/bleedSystem";

export function itemUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;

    // 앵무조개가 왼손에 있다면 우클할 때 오른손에 있는 템에 킵인벤이 걸림
    const playerinv = player.getComponent("minecraft:equippable");
    const offhand = playerinv.getEquipment(EquipmentSlot.Offhand);
    // 복구나침반을 사용한다면 출혈이 멈춤

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
    else if (item.typeId.includes("revive") || item.typeId === "minecraft:recovery_compass") {
        if ((player.getDynamicProperty("bleed") === true) && (player.getDynamicProperty("reviveCooldown") < 1)) {
            BleedSystem.selfRevive(player, item.typeId);
        }
    }
    else if (offhand) { //테스트용 코드
        if (offhand.typeId === "minecraft:nautilus_shell") {
        const hand = playerinv.getEquipmentSlot(EquipmentSlot.Mainhand);
        hand.keepOnDeath = true;
        }
    }
}
