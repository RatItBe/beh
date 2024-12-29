import { system, world } from "@minecraft/server";

export class BleedSystem {
    constructor(eventData) {
        this.player = eventData.deadEntity;
        this.location = this.player.location;
        this.dimension = this.player.dimension;
        this.invDatabase = {};
    }

    executeBleedSystem() { // entityDie에서 실행, 출혈 상태에 따라 분기
        const bleed = this.player.getDynamicProperty("bleed") || false;
        if (!bleed) {
            this.DeathWithoutBleed();
        } else {
            this.DeathWithBleed();
        }
    }

    DeathWithoutBleed() { // 출혈 상태가 아닐 때 사망 시 실행
        this.player.playSound("block.bell.hit", { pitch: 2, volume: 3 });
        this.player.setDynamicProperty("bleed", true);
        this.player.inputPermissions.movementEnabled = false;

        const bleedCheck = system.runInterval(() => {
            const onlinePlayer = world.getAllPlayers().find(p => p.name === this.player.name);
            if (!onlinePlayer) {
                system.clearRun(bleedCheck);
                return;
            }

            const result = this.player.addEffect("minecraft:invisibility", 20, { showParticles: false });
            if (result !== undefined) {
                this.player.teleport(this.location);
                const spawnPointString = this.player.getDynamicProperty("spawnPoint");
                const [dimensionId, x, y, z] = spawnPointString.split(",");
                const spawnPoint = {
                    dimension: world.getDimension(dimensionId),
                    x: parseFloat(x),
                    y: parseFloat(y),
                    z: parseFloat(z),
                };
                this.player.setSpawnPoint(spawnPoint);
                system.clearRun(bleedCheck);
            }
        }, 2);
    }

    DeathWithBleed() { // 출혈 상태에서 사망 시 실행
        this.player.setDynamicProperty("bleed", false);
        this.player.inputPermissions.movementEnabled = true;

        const playerinv = this.player.getComponent("minecraft:inventory").container;
        const equipComp = this.player.getComponent("minecraft:equippable");

        const slotNumbers = Array.from({ length: playerinv.size })
            .map((_, i) => (playerinv.getItem(i) ? i : undefined))
            .filter(i => i !== undefined);

        const nonKeepInvItems = slotNumbers
            .filter(slot => !playerinv.getSlot(slot).keepOnDeath)
            .map(slot => ({
                slot,
                item: playerinv.getItem(slot),
            }));

        const equipmentSlots = ["Head", "Chest", "Legs", "Feet", "Offhand"];
        const nonKeepEquipItems = equipmentSlots
            .map(slot => ({
                slot,
                item: equipComp.getEquipment(slot),
            }))
            .filter(({ item }) => item && !item.keepOnDeath);

        this.invDatabase[this.player.id] = {
            location: this.location,
            dimension: this.dimension.id,
            items: [
                ...nonKeepInvItems.map(({ item }) => item),
                ...nonKeepEquipItems.map(({ item }) => item),
            ],
        };

        nonKeepInvItems.forEach(({ slot }) => playerinv.setItem(slot, undefined));
        nonKeepEquipItems.forEach(({ slot }) => equipComp.setEquipment(slot, undefined));

        this.invDatabase[this.player.id]?.items.map(value =>
            world
                .getDimension(this.invDatabase[this.player.id].dimension)
                .spawnItem(value, this.invDatabase[this.player.id].location)
        );
    }

    static applyBleedEffect(player) { // runInterval에서 실행, 1초에 한번 출혈뎀
        player.applyDamage(2, { cause: "suicide" });
        player.dimension.spawnParticle("minecraft:villager_angry", {
            x: player.location.x,
            y: player.location.y + 2,
            z: player.location.z,
        });
        player.dimension.playSound("mob.warden.heartbeat", player.location);
        player.addEffect("minecraft:blindness", 200, { showParticles: false });
    }

    static othersRevive(player, item) { // entityHit에서 실행, 때린 아이템에 따라 다른 소생 효과
        player.setDynamicProperty("bleed", false);
        player.inputPermissions.movementEnabled = true;
        player.removeEffect("minecraft:blindness");
        player.setSpawnPoint({
            dimension: player.dimension,
            x: player.location.x,
            y: player.location.y,
            z: player.location.z,
        });
        if (item === "minecraft:recovery_compass") {
            player.setDynamicProperty("reviveCooldown", 6);
        }
    }

    static selfRevive(player, item) { // itemUse에서 실행, 사용한 아이템에 따라 다른 소생 효과
        player.setDynamicProperty("bleed", false);
        player.inputPermissions.movementEnabled = true;
        player.removeEffect("minecraft:blindness");
        player.setSpawnPoint({
            dimension: player.dimension,
            x: player.location.x,
            y: player.location.y,
            z: player.location.z,
        });
        if (item === "minecraft:recovery_compass") {
            player.setDynamicProperty("reviveCooldown", 30);
            const health = player.getComponent("minecraft:health");
            health.setCurrentValue(4);
        }
    }
}
