import { EquipmentSlot } from "@minecraft/server";

export function entityHitEntity(eventData) {
    const damagingEntity = eventData.damagingEntity // 때린 엔티티
    const hitEntity = eventData.hitEntity // 맞은 엔티티

    if (damagingEntity.typeId !== "minecraft:player") return;
    const equippable = damagingEntity.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
    if (mainhand) {
        if (mainhand.typeId === "minecraft:recovery_compass") {
            if (hitEntity.getDynamicProperty("bleed") === true) {
                hitEntity.setDynamicProperty("bleed", false);
                hitEntity.setSpawnPoint({dimension: hitEntity.dimension,
                    x:hitEntity.location.x, y:hitEntity.location.y, z:hitEntity.location.z});
                hitEntity.setDynamicProperty("respawnCooldown", 60)
            }
        }
    }
}