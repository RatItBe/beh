import { EquipmentSlot } from "@minecraft/server";
import { releaseWeapon } from 'data/rangedWeapon';
import { useWeapon } from 'data/rangedWeapon';

export function projectileHitEntity(eventData) {
    if (eventData.source.typeId !== "minecraft:player") return; //플레이어가 쏜 투사체만 허용
    const projectile = eventData.projectile;
    const entity = eventData.getEntityHit().entity;
    const player = eventData.source;

    const equippable = player.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);

    const weapon = releaseWeapon.find(w => w.weaponName === mainhand.typeId) || useWeapon.find(w => w.weaponName === mainhand.typeId);
    if (!weapon) return; //총기 리스트에 없는 무기면 종료
    
    if (projectile.typeId === weapon.bulletName) {
        const options = {
            cause: "override"
        }
        entity.applyDamage(weapon.bulletDamage, options);
    }
}