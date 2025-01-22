import { EquipmentSlot } from "@minecraft/server";
import { BleedSystem } from "class/bleedSystem";

export function entityHitEntity(eventData) {
    const damagingEntity = eventData.damagingEntity // 때린 엔티티
    const hitEntity = eventData.hitEntity // 맞은 엔티티

    if (damagingEntity.typeId !== "minecraft:player") return;
    const equippable = damagingEntity.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
    if (mainhand) {
        if (mainhand.typeId.includes("revive")) {
            if ((hitEntity.hasTag("bleeding_out") === true)) {
                BleedSystem.othersRevive(damagingEntity, hitEntity, mainhand.typeId);
            }
        }
    }
}