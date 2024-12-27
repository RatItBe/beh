// 1초에 한 번 실행될 코드
export function runInterval20(player) {
    const playerFire = player.getComponent("minecraft:onfire"); // 불 붙은 플레이어 확인
    const burns = player.getDynamicProperty("burns"); // 화상 값 확인
    if (!playerFire && burns > 0) player.setDynamicProperty("burns", burns - 1); //불이 안붙어있으면 화상값 감소

    const bleed = player.getDynamicProperty("bleed") || false; // 출혈 값 확인
    if (bleed) {
        player.applyDamage(2, {cause: "suicide"});
        player.dimension.spawnParticle("minecraft:villager_angry",
            {x: player.location.x, y: player.location.y+2, z: player.location.z});
        player.dimension.playSound("mob.warden.heartbeat", player.location);
    }
}
