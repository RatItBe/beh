import { BurnSystem } from "class/burnSystem";

export function entityHurt(eventData) {
    if (eventData.hurtEntity.typeId !== "minecraft:player") return; //플레이어만 아래 코드들 실행
    const player = eventData.hurtEntity;
    const damageSource = eventData.damageSource;
    const damageCause = damageSource.cause;

    if (damageCause === "fireTick") { //불 틱 데미지를 입었다면
        BurnSystem.burnDamage(player);
    }
}