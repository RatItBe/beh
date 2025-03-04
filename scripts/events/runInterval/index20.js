// 1초에 한 번 실행될 코드
export function runInterval20(player) {
    const playerFire = player.getComponent("minecraft:onfire"); // 불 붙은 플레이어 확인
    const burns = player.getDynamicProperty("burns"); // 화상 값 확인
    if (!playerFire && burns > 0) player.setDynamicProperty("burns", burns - 1); //불이 안붙어있으면 화상값 감소

    const reviveCooldown = player.getDynamicProperty("reviveCooldown") || 0;
    if (reviveCooldown > 0) player.setDynamicProperty("reviveCooldown", reviveCooldown - 1);
}
