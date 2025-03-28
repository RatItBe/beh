import { system, EquipmentSlot } from "@minecraft/server";
import { DebugSystem } from "class/debugSystem";
import { RangedWeaponSystem } from "class/rangedWeaponSystem";
import { useWeapon } from "data/rangedWeapon";

export function itemUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;
    
    const equippable = player.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

    const weaponKey = Object.keys(useWeapon).find(key => key === mainhand.typeId);

    switch (item.typeId) {
        case weaponKey:
            if (player.isSneaking) {
                const weapon = useWeapon[mainhand.typeId];
                system.run(() => {
                    RangedWeaponSystem.useShoot(player, weapon, item); // 첫 번째 발사
                    for (let i = 1; i < weapon.burst.count; i++) {
                        system.runTimeout(() => {
                            RangedWeaponSystem.useShoot(player, weapon, item);
                        }, weapon.burst.tick * i);
                    }
                });
            }
            break;
    }

    const offhand = equippable.getEquipment(EquipmentSlot.Offhand);
    if (offhand) {
        switch (offhand.typeId) {
            case "fs:keep_inv_ticket":
                if (!mainhand.keepOnDeath) {
                    mainhand.keepOnDeath = true;
                    if (player.getGameMode() != "creative") {
                        equippable.getEquipmentSlot(EquipmentSlot.Offhand).setItem();
                    }
                }
                break;
            // (디버그용) 왼손에 앵무조개가 있다면 오른손에 있는 템에 킵인벤이 부여/해제할 수 있음
            case "minecraft:nautilus_shell":
                if (!mainhand.keepOnDeath) {
                    mainhand.keepOnDeath = true;
                }
                else {
                    mainhand.keepOnDeath = false;
                }
                break;
            case "fs:debug_book":
                system.run(() => { DebugSystem.selectMenu(player) });
                break;
        }
    }
}
