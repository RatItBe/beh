// 0.1초에 한 번 실행될 코드

export function runInterval2(player) {
    const reload = player.getDynamicProperty("reload");
    if (reload > 0) {
        player.setDynamicProperty("reload", reload - 1);
    }
}