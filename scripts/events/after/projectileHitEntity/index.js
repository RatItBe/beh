import { WeaponSystem } from "class/equipment/weaponSystem";

export function projectileHitEntity(eventData) {
    if (eventData.source.typeId !== "minecraft:player") return; //플레이어가 쏜 투사체에만 아래 코드 실행
    const projectile = eventData.projectile;
    const entity = eventData.getEntityHit().entity;

    try {
        const rangedDamage = projectile.getDynamicProperty("rangedDamage") || 0;
        if (rangedDamage) {
            WeaponSystem.projectileHit(entity, rangedDamage);
        }
    } catch (error) {
        
    }
}