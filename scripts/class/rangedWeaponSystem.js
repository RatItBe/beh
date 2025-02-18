import { world, EquipmentSlot, ItemStack } from "@minecraft/server";
import { PlayerMovement } from "class/util/playerMovement"

export class RangedWeaponSystem {
    static type1Check(player, weapon, item) { // itemReleaseUse에서 실행
        const equippable = player.getComponent("minecraft:equippable");
        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        const ammo = item.getComponent("minecraft:durability");

        if (ammo.damage >= ammo.maxDurability) {
            if (weapon.emptyWeaponName) mainhand.setItem(new ItemStack(weapon.emptyWeaponName));
        }
        else {
            RangedWeaponSystem.rangedWeaponShoot(player, weapon, item);
            if (player.getGameMode() != "creative") {
                ammo.damage++;
                mainhand.setItem(item);
            }
        }
    }

    static type2Check(player, weapon, item) { // itemUse에서 실행
        const equippable = player.getComponent("minecraft:equippable"); // 장비칸 정보
        const offhand = equippable.getEquipmentSlot(EquipmentSlot.Offhand); //왼손 템슬롯 저장
        const ammoBackpack = equippable.getEquipment(EquipmentSlot.Offhand); //왼손 템 저장
        if (ammoBackpack) {
            if (ammoBackpack.typeId === "fs:ammo_backpack") {
                const ammo = ammoBackpack.getComponent("minecraft:durability");
                if (ammo.damage >= ammo.maxDurability) { // 아이템이 부서지기 직전인 상황이라면
                    player.runCommandAsync("title @s actionbar 탄약 부족");
                }
                else {
                    RangedWeaponSystem.rangedWeaponShoot(player, weapon, item);
                    if (player.getGameMode() != "creative") {
                        ammo.damage++;
                        offhand.setItem(ammoBackpack);
                    }
                }
            }
        }
    }

    static rangedWeaponShoot(player, weapon, item) {
        const viewDirection = player.getViewDirection();
        const spawnPos = {
            x: player.location.x + viewDirection.x,
            y: player.location.y + viewDirection.y + 1.25,
            z: player.location.z + viewDirection.z,
        };
        const baseSpeed = weapon.bulletSpeed;
        
        const spreadAngle = RangedWeaponSystem.spreadAngleSetting(player, item);
        const offsetX = viewDirection.x + Math.random() * spreadAngle / 100 - spreadAngle / 200;
        const offsetY = viewDirection.y + Math.random() * spreadAngle / 100 - spreadAngle / 200;
        const offsetZ = viewDirection.z + Math.random() * spreadAngle / 100 - spreadAngle / 200;
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
            y: player.location.y + viewDirection.y + 0.5,
            z: player.location.z + viewDirection.z,
        };
        [weapon.weaponSound1, weapon.weaponSound2, weapon.weaponSound3].forEach((sound) => {
            if (sound?.name) {
                world.playSound(sound.name, soundLocation, { pitch: sound.pitch, volume: sound.volume });
            }
        });
        player.runCommandAsync("camerashake add @s 0.2 0.05 rotational");
    }

    static rangedWeaponReload(player, weapon) {
        const equippable = player.getComponent("minecraft:equippable"); // 장비칸 전체 저장
        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand); //오른손에 든 템 저장
        const ammoExist = player.runCommand(`clear @s ${weapon.weaponAmmo} 0 0`).successCount //탄창존재여부 체크
        if (ammoExist) { // 탄창이 있다면
            player.runCommandAsync(`clear @s ${weapon.weaponAmmo} 0 1`); //탄창 소비
            player.runCommandAsync("playsound tile.piston.in @s ~~~ 0.5 1.8 0.2");
            mainhand.setItem(new ItemStack(weapon.weaponName)); //장전된 총으로 변경
        }
    }

    static spreadAngleSetting(player, item) {
        const spreadAngleArray = [
            [1, 30, 40, 60], // sniper
            [25, 20, 30, 40], // rifle
            [70, 0, 0, 0], // shotgun
            [10, 10, 15, 20], // handgun
            [20, 0, 0, 0] // machinegun
        ];

        let gunIndex;
        if (item.hasTag("fs:sniper")) gunIndex = 0;
        else if (item.hasTag("fs:rifle")) gunIndex = 1;
        else if (item.hasTag("fs:shotgun")) gunIndex = 2;
        else if (item.hasTag("fs:handgun")) gunIndex = 3;
        else gunIndex = 4;

        let playerStatus = PlayerMovement.getStatus(player);
        let spreadAngle = spreadAngleArray[gunIndex][0];  // 기본 명중률
        if (playerStatus >= 4) {
            spreadAngle += spreadAngleArray[gunIndex][3];
            playerStatus -= 4;
        }
        else if (playerStatus >= 2) {
            spreadAngle += spreadAngleArray[gunIndex][2];
            playerStatus -= 2;
        }
        if (playerStatus >= 1) {
            spreadAngle += spreadAngleArray[gunIndex][1];
            playerStatus -= 1;
        }
        return spreadAngle;
    }
}