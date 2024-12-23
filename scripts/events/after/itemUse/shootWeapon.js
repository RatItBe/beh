import { world, EquipmentSlot } from "@minecraft/server";

export function shootWeapon(player, weapon) {
    const equippable = player.getComponent("minecraft:equippable"); // 장비칸 전체 저장
    const offhand = equippable.getEquipmentSlot(EquipmentSlot.Offhand); //왼손 템슬롯 저장
    const ammoBackpack = equippable.getEquipment(EquipmentSlot.Offhand); //왼손 템 저장
    if (ammoBackpack) {
        if (ammoBackpack.typeId === "fs:ammo_backpack") {
            const ammo = ammoBackpack.getComponent("minecraft:durability");
            if (ammo.damage >= ammo.maxDurability) { // 아이템이 부서지기 직전인 상황이라면
                player.runCommandAsync("title @s actionbar 탄약 부족");
            }
            else {
                const viewDirection = player.getViewDirection();
                const baseSpeed = weapon.bulletSpeed;
                const spreadAngle = weapon.spreadAngle;
                const spawnPos = {
                    x: player.location.x + viewDirection.x,
                    y: player.location.y + viewDirection.y + 1.25,
                    z: player.location.z + viewDirection.z,
                };
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

                player.runCommandAsync("camerashake add @s 0.3 0.1 positional");
                if (player.getGameMode() != "creative") {
                    ammo.damage++;
                    offhand.setItem(ammoBackpack);
                }
            }
        }
    }
}