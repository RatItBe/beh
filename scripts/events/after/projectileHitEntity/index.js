import { RangedWeaponSystem } from "class/weapon/rangedWeaponSystem";
import { releaseWeapon } from 'data/rangedWeapon';
import { useWeapon } from 'data/rangedWeapon';

export function projectileHitEntity(eventData) {
    if (eventData.source.typeId !== "minecraft:player") return; //플레이어가 쏜 투사체에만 아래 코드 실행
    const projectile = eventData.projectile;
    const entity = eventData.getEntityHit().entity;

    let bullet = Object.values(releaseWeapon).find(releaseWeapon => releaseWeapon.bullet.name === projectile.typeId);
    if (bullet) {
        RangedWeaponSystem.projectileHit(entity, bullet);
    }
    
    bullet = Object.values(useWeapon).find(useWeapon => useWeapon.bullet.name === projectile.typeId);
    if (bullet) {
        RangedWeaponSystem.projectileHit(entity, bullet);
    }
}