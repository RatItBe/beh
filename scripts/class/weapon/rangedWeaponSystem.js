import { EquipmentSlot, ItemStack } from "@minecraft/server";
import { PlayerMovement } from "class/util/playerMovement"

export class RangedWeaponSystem {
    constructor(eventData, weapon) {
        this.item = eventData.itemStack;
        this.player = eventData.source;
        this.equippable = this.player.getComponent("minecraft:equippable");
        this.mainhandSlot = this.equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        this.weapon = weapon;
    }
    
    releaseShoot() { // itemReleaseUse에서 실행
        this.rangedWeaponShoot();
        if (this.player.getGameMode() == "creative") return;
        const ammo = this.item.getComponent("minecraft:durability");
        if (ammo.damage >= ammo.maxDurability) {
            if (this.weapon.emptyWeapon) {
                const lore = this.mainhandSlot.getLore();
                this.mainhandSlot.setItem(new ItemStack(this.weapon.emptyWeapon));
                this.mainhandSlot.setLore(lore);
            }
        }
        else {
            ammo.damage++;
            this.mainhandSlot.setItem(this.item);
        }
    }

    useShoot() { // itemUse에서 실행
        const offhand = this.equippable.getEquipment(EquipmentSlot.Offhand);
        if (offhand.typeId !== this.weapon.ammoItem) return;

        const ammo = offhand.getComponent("minecraft:durability");
        if (ammo.damage >= ammo.maxDurability) {
            this.player.runCommand("title @s actionbar 탄약 부족");
        }
        else {
            if (!this.player.isSneaking) return;
            this.rangedWeaponShoot();
            if (this.player.getGameMode() != "creative") {
                ammo.damage++;
                const offhandSlot = this.equippable.getEquipmentSlot(EquipmentSlot.Offhand);
                offhandSlot.setItem(offhand);
            }
        }
    }

    rangedWeaponShoot() {
        const viewDirection = this.player.getViewDirection();
        const spawnPos = {
            x: this.player.location.x + viewDirection.x,
            y: this.player.location.y + viewDirection.y + 1.25,
            z: this.player.location.z + viewDirection.z,
        };
        const baseSpeed = this.weapon.bullet.speed;
        
        const spreadAngle = RangedWeaponSystem.spreadAngleSetting(this.player, this.item);
        const offsetX = viewDirection.x + Math.random() * spreadAngle / 100 - spreadAngle / 200;
        const offsetY = viewDirection.y + Math.random() * spreadAngle / 100 - spreadAngle / 200;
        const offsetZ = viewDirection.z + Math.random() * spreadAngle / 100 - spreadAngle / 200;
        const projectile = this.player.dimension.spawnEntity(this.weapon.bullet.name, spawnPos);
        projectile.getComponent("minecraft:projectile").owner = this.player;
        projectile.applyImpulse({
            x: offsetX * baseSpeed,
            y: offsetY * baseSpeed,
            z: offsetZ * baseSpeed,
        });

        const soundLocation = {
            x: this.player.location.x + viewDirection.x,
            y: this.player.location.y + viewDirection.y + 0.5,
            z: this.player.location.z + viewDirection.z,
        };
        if (this.weapon.sounds) {
            Object.values(this.weapon.sounds).forEach((sound) => {
                if (sound?.name) {
                    this.player.dimension.playSound(sound.name, soundLocation, { pitch: sound.pitch, volume: sound.volume });
                }
            });
        }
        this.player.runCommand("camerashake add @s 0.2 0.05 rotational");
    }

    rangedWeaponReload() { // itemReleaseUse에서 실행
        const ammoExist = this.player.runCommand(`clear @s ${this.weapon.weaponAmmo} 0 0`).successCount //탄창존재여부 체크
        if (!ammoExist) return;
        const lore = this.mainhandSlot.getLore();
        this.mainhandSlot.setItem(new ItemStack(this.weapon.weaponName));
        this.mainhandSlot.setLore(lore);
        this.player.runCommand(`clear @s ${this.weapon.weaponAmmo} 0 1`); //탄창 소비
        this.player.runCommand("playsound tile.piston.in @s ~~~ 0.5 1.8 0.2");
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

    static projectileHit(entity, weapon) { // projectileHitEntity에서 실행
        const options = {
            cause: "override"
        }
        entity.applyDamage(weapon.bullet.damage, options);
        return;
    }
}