export class BleedSystem {
    static othersRevive(damagingPlayer, player, item) { // entityHit에서 실행, 때린 아이템에 따라 다른 소생 효과
        player.removeTag("bleeding_out");
        player.inputPermissions.movementEnabled = true;
        player.removeEffect("minecraft:blindness");
        player.setSpawnPoint({
            dimension: player.dimension,
            x: player.location.x,
            y: player.location.y,
            z: player.location.z,
        });
        if (item === "fs:revive_syringe") {
            player.setDynamicProperty("reviveCooldown", 6);
        }
        damagingPlayer.runCommandAsync(`clear @s ${item} 0 1`);
    }

    static selfRevive(player, item) { // itemCompleteUse에서 실행, 사용한 아이템에 따라 다른 소생 효과
        player.removeTag("bleeding_out");
        player.inputPermissions.movementEnabled = true;
        player.removeEffect("minecraft:blindness");
        player.setSpawnPoint({
            dimension: player.dimension,
            x: player.location.x,
            y: player.location.y,
            z: player.location.z,
        });
        if (item === "fs:revive_syringe") {
            player.setDynamicProperty("reviveCooldown", 30);
            const health = player.getComponent("minecraft:health");
            health.setCurrentValue(4);
        }
        player.runCommandAsync(`clear @s ${item} 0 1`);
    }
}
