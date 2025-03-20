import { EquipmentSlot } from "@minecraft/server";
import { BleedSystem } from "class/bleedSystem";
import { meleeWeapon } from "data/meleeWeapon";

export function entityHitEntity(eventData) {
    const damagingEntity = eventData.damagingEntity // 때린 엔티티
    const hitEntity = eventData.hitEntity // 맞은 엔티티

    if (damagingEntity.typeId !== "minecraft:player") return;
    const equippable = damagingEntity.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
    if (mainhand) {
        const item = meleeWeapon[mainhand.typeId];
        if (item) {
            const cooldown = damagingEntity.getDynamicProperty("meleeCooldown") || 0;
            //if (cooldown <= 0) {
                const options = {
                    cause: "override"
                }
                hitEntity.applyDamage(item.damage, options);
                //damagingEntity.setDynamicProperty("meleeCooldown", item.cooldown);
                console.warn(damagingEntity.getDynamicProperty("meleeCooldown"));//디버그용
                console.warn(hitEntity.getComponent("minecraft:health").currentValue);//디버그용
            //}
        }
        else if (mainhand.typeId.includes("revive")) {
            if ((hitEntity.hasTag("bleeding_out") === true)) {
                BleedSystem.othersRevive(damagingEntity, hitEntity, mainhand.typeId);
            }
        }
    }
}