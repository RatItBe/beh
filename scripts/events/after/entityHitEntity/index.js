import { EquipmentSlot } from "@minecraft/server";

export function entityHitEntity(eventData) {
    const damagingEntity = eventData.damagingEntity // 때린 엔티티
    const hitEntity = eventData.hitEntity // 맞은 엔티티

    if (damagingEntity.typeId !== "minecraft:player") return;
    const equippable = damagingEntity.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
    if (mainhand) {
        hitEntity.setDynamicProperty("bleed", false);
        player.setSpawnPoint({dimension: player.dimension,
            x:player.location.x, y:player.location.y, z:player.location.z});
    }
}