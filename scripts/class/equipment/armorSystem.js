import { world, EquipmentSlot } from "@minecraft/server";
import { armorList } from "data/armor";

export class ArmorSystem {
    static armorCheck(player) {
        const equippable = player.getComponent("minecraft:equippable");
        const head = equippable.getEquipment(EquipmentSlot.Head);
        const chest = equippable.getEquipment(EquipmentSlot.Chest);
        const legs = equippable.getEquipment(EquipmentSlot.Legs);
        const feet = equippable.getEquipment(EquipmentSlot.Feet);

        /*for (const armorSet of armorList) {
            let match = true;
            if (armorSet.head && (!head ? true : head.typeId !== armorSet.head)) {
                match = false;
            }
            if (armorSet.chest && (!chest ? true : chest.typeId !== armorSet.chest)) {
                match = false;
            }
            if (armorSet.legs && (!legs ? true : legs.typeId !== armorSet.legs)) {
                match = false;
            }
            if (armorSet.feet && (!feet ? true : feet.typeId !== armorSet.feet)) {
                match = false;
            }
            if (match) {
                return armorSet.value;
            }
        }*/
       
        for (const armorSet of armorList) {
            if (armorSet.head === null) {
                if (head) {
                    continue; // 헬멧이 null인데 착용한 경우 스킵
                }
            } else {
                if (!head ? true : head.typeId !== armorSet.head) {
                    continue; // 헬멧이 없거나 세트와 다르면 스킵
                }
            }
            if (armorSet.chest === null) {
                if (chest) {
                    continue;
                }
            } else {
                if (!chest ? true : chest.typeId !== armorSet.chest) {
                    continue;
                }
            }
            if (armorSet.legs === null) {
                if (legs) {
                    continue;
                }
            } else {
                if (!legs ? true : legs.typeId !== armorSet.legs) {
                    continue;
                }
            }
            if (armorSet.feet === null) {
                if (feet) {
                    continue;
                }
            } else {
                if (!feet ? true : feet.typeId !== armorSet.feet) {
                    continue;
                }
            }
            player.setDynamicProperty("armorNum", armorSet.armorNum);
            return;
        }
        player.setDynamicProperty("armorNum", 0);
    }
}