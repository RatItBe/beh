import { world, system, EquipmentSlot } from "@minecraft/server";
import { useWeaponList } from 'data/gun';
import { RangedWeaponSystem } from "class/rangedWeaponSystem";

export function itemUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;
    
    const playerinv = player.getComponent("minecraft:equippable");
    const offhand = playerinv.getEquipment(EquipmentSlot.Offhand);

    const weapon = useWeaponList.find(w => w.weaponName === item.typeId);
    if (weapon && player.isSneaking) {
        system.run(() => {
            RangedWeaponSystem.type2Check(player, weapon, item); // 첫 번째 발사
            for (let i = 1; i < weapon.burst.count; i++) {
                system.runTimeout(() => {
                    RangedWeaponSystem.type2Check(player, weapon, item);
                }, weapon.burst.tick * i);
            }
        });
    }
    //왼손에 앵무조개가 있다면 오른손에 있는 템에 킵인벤이 부여/해제할 수 있음
    else if (offhand && offhand.typeId === "minecraft:nautilus_shell") {
        const hand = playerinv.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!hand.keepOnDeath) {
            hand.keepOnDeath = true;
        }
        else {
            hand.keepOnDeath = false;
        }
    }
    else if (item.typeId === "fs:debug_book") {
        world.setDynamicProperty("cookingPot", "");
        world.setDynamicProperty("completePot", "");
        world.clearDynamicProperties();
    }
}
