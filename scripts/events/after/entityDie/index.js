import { BleedSystem } from "class/bleedSystem";

export function entityDie(eventData) {
    const deadEntity = eventData.deadEntity;
    if (deadEntity.typeId !== "minecraft:player") return;
    const bleedSystem = new BleedSystem(eventData);
    bleedSystem.executeBleedSystem();
}