export class BleedSystem {
    static othersRevive(damagingPlayer, player, item) { // entityHitEntity에서 실행
        if (player.getDynamicProperty("reviveCooldown") < 1) {
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
        else {
            damagingPlayer.onScreenDisplay.setActionBar(
                `해당 플레이어의 소생 쿨타임이 ${player.getDynamicProperty("reviveCooldown")}초 남았습니다.`);
            player.onScreenDisplay.setActionBar(
                `현재 소생 쿨타임이 ${player.getDynamicProperty("reviveCooldown")}초 남았습니다.`);
        }
    }

    static selfRevive(player, item) { // itemCompleteUse에서 실행
        if (player.getDynamicProperty("reviveCooldown") < 1) {
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
        else {
            player.onScreenDisplay.setActionBar(
                `현재 소생 쿨타임이 ${player.getDynamicProperty("reviveCooldown")}초 남았습니다.`);
        }
    }
}
