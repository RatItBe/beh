export function playerSpawn(eventData) {
    if (eventData.initialSpawn) return; // 플레이어가 죽고 부활한 경우에만 아래 코드 실행
    const player = eventData.player;
    player.setDynamicProperty("burns", 0); // 화상 초기화
    player.setDynamicProperty("reviveCooldown", 0); // 소생쿨 초기화
}