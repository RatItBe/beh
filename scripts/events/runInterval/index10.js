// 0.5초에 한 번 실행될 코드
export function runInterval10(player) {
    const cooldown = player.getDynamicProperty("meleeCooldown") || 0;
    if (cooldown > 0) {
        player.setDynamicProperty("meleeCooldown", cooldown - 1);
    }
}
