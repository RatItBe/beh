import { system, EquipmentSlot } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DebugSystem } from "class/debugSystem";
import { RangedWeaponSystem } from "class/rangedWeaponSystem";
import { useWeapon } from "data/rangedWeapon";

export function itemUse(eventData) {
    const item = eventData.itemStack;
    const player = eventData.source;
    
    const equippable = player.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

    const ui = new ActionFormData()
    .title("Form")
    .body("")
    .button("button1")
    .button("button2")
    .button("button3");

    const customUi = new ActionFormData()
    .title("Custom Form")
    .body("")
    .button("Rewards", "textures/ui/promo_holiday_gift_small")
    .button("Shop", "textures/ui/icon_deals")
    .button("무기 감정하기", "textures/ui/icon_deals")
    .button("솥 전체 초기화", "textures/ui/hammer_l");

    const weapon = useWeapon[mainhand.typeId];

    switch (item.typeId) {
        case "minecraft:compass":
            ui.show(player);
            break;
        case "minecraft:clock":
            customUi.show(player);
            break;
        case weapon:
            if (player.isSneaking) {
                system.run(() => {
                    RangedWeaponSystem.type2Check(player, weapon, item); // 첫 번째 발사
                    for (let i = 1; i < weapon.burst.count; i++) {
                        system.runTimeout(() => {
                            RangedWeaponSystem.type2Check(player, weapon, item);
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
