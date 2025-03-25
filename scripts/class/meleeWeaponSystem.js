export class MeleeWeaponSystem {
    static meleeAttack(damagingEntity, hitEntity, weapon) { // entityHitEntity에서 실행
        const cooldown = damagingEntity.getDynamicProperty("meleeCooldown") || 0;
        if (cooldown <= 0) {
            const options = {
                cause: "override"
            }
            hitEntity.applyDamage(weapon.damage, options);
            damagingEntity.setDynamicProperty("meleeCooldown", Math.round(weapon.cooldown * 10));
        }
    }

    static cooldownCheck(player) { // runInterval2에서 실행
        const cooldown = player.getDynamicProperty("meleeCooldown") || 0;
        if (cooldown > 0) {
            player.setDynamicProperty("meleeCooldown", cooldown - 1);
        }   
    }
}