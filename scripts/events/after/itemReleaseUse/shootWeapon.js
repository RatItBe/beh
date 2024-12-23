import { world, EquipmentSlot, ItemStack } from "@minecraft/server";

export function shootWeapon(player, item, weapon) {
    const equippable = player.getComponent("minecraft:equippable");
    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    const ammo = item.getComponent("minecraft:durability");
    if (ammo.damage >= ammo.maxDurability) {
        if (weapon.emptyWeaponName) mainhand.setItem(new ItemStack(weapon.emptyWeaponName));
    }
    else {
        const viewDirection = player.getViewDirection();
        const spawnPos = {
            x: player.location.x + viewDirection.x,
            y: player.location.y + viewDirection.y + 1.25,
            z: player.location.z + viewDirection.z,
        };
        const baseSpeed = weapon.bulletSpeed;
        const spreadAngle = weapon.spreadAngle;
        const offsetX = viewDirection.x + Math.random() * spreadAngle - spreadAngle / 2;
        const offsetY = viewDirection.y + Math.random() * spreadAngle - spreadAngle / 2;
        const offsetZ = viewDirection.z + Math.random() * spreadAngle - spreadAngle / 2;
        const projectile = player.dimension.spawnEntity(weapon.bulletName, spawnPos);
        const projectileComp = projectile.getComponent("minecraft:projectile");
        projectileComp.owner = player;
        projectile.applyImpulse({
            x: offsetX * baseSpeed,
            y: offsetY * baseSpeed,
            z: offsetZ * baseSpeed,
        });

        const soundLocation = {
            x: player.location.x + viewDirection.x,
            y: player.location.y + viewDirection.y + 1,
            z: player.location.z + viewDirection.z,
        };
        [weapon.weaponSound1, weapon.weaponSound2, weapon.weaponSound3].forEach((sound) => {
            if (sound?.name) {
                world.playSound(sound.name, soundLocation, { pitch: sound.pitch, volume: sound.volume });
            }
        });

        player.runCommandAsync("camerashake add @s 0.2 0.05 rotational");
        if (player.getGameMode() != "creative") {
            ammo.damage++;
            mainhand.setItem(item);
        }
    }
}
