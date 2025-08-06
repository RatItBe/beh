import { system, EquipmentSlot } from "@minecraft/server";
import { DebugSystem } from "class/debugSystem";
import { PlayerDataManager } from "class/playerDataManager";
import { CookbookClass } from "class/cookbookClass";
import { WeaponSystem } from "class/equipment/weaponSystem";

export function itemUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;
    
    const equippable = player.getComponent("minecraft:equippable");
    const mainhandSlot = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

    const ammoBackpack = item.getDynamicProperty("ammoBackpack");

    // 탄약낭이 필요한 아이템일 시(=기관총류 무기일 시)
    if (ammoBackpack !== undefined) {
        WeaponSystem.rangedAttack(player, mainhandSlot, {"ammoBackpack": ammoBackpack});
    }
    // typeId가 요리책류일 시
    else if (item.typeId.includes("_cookbook")) {
        CookbookClass.checkLore(player, mainhandSlot);
    }
    // 책일 시
    else if (item.typeId === "minecraft:book") {
        if (player.commandPermissionLevel === 0) return; // 일반 플레이어 권한으로는 실행 x
        PlayerDataManager.managePlayer(player);
    }

    const offhand = equippable.getEquipment(EquipmentSlot.Offhand);
    if (offhand) {
        switch (offhand.typeId) {
            case "fs:keep_inv_ticket":
                if (!mainhandSlot.keepOnDeath) {
                    mainhandSlot.keepOnDeath = true;
                    if (player.getGameMode() != "creative") {
                        equippable.getEquipmentSlot(EquipmentSlot.Offhand).setItem();
                    }
                }
                break;
            // (디버그용) 왼손에 앵무조개가 있다면 오른손에 있는 템에 킵인벤이 부여/해제할 수 있음
            case "minecraft:nautilus_shell":
                if (!mainhandSlot.keepOnDeath) {
                    mainhandSlot.keepOnDeath = true;
                }
                else {
                    mainhandSlot.keepOnDeath = false;
                }
                break;
            case "fs:debug_book":
                system.run(() => { DebugSystem.selectMenu(player) });
                break;
        }
    }
}
