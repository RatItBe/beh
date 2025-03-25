import { EquipmentSlot } from "@minecraft/server";
import { MeleeWeaponSystem } from "class/meleeWeaponSystem";
import { BleedSystem } from "class/bleedSystem";
import { meleeWeapon } from "data/meleeWeapon";

export function entityHitEntity(eventData) {
    const damagingEntity = eventData.damagingEntity // 때린 엔티티

    if (damagingEntity.typeId !== "minecraft:player") return;

    const hitEntity = eventData.hitEntity // 맞은 엔티티
    const equippable = damagingEntity.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
    if (mainhand) {
        const weapon = meleeWeapon[mainhand.typeId];
        if (weapon) {
            MeleeWeaponSystem.meleeAttack(damagingEntity, hitEntity, weapon);
        }
        else if (mainhand.typeId.includes("revive")) {
            if ((hitEntity.hasTag("bleeding_out") === true)) {
                BleedSystem.othersRevive(damagingEntity, hitEntity, mainhand.typeId);
            }
        }
    }
}