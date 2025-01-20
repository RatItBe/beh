import { BleedSystem } from "class/bleedSystem";

export function itemCompleteUse(eventData) {
    const item = eventData.itemStack; // 사용된 아이템을 item 변수에 저장
    const player = eventData.source; // 아이템 사용자를 player 변수에 저장

    if (item.typeId.includes("revive")) {
        if ((player.getDynamicProperty("bleed") === true) && (player.getDynamicProperty("reviveCooldown") < 1)) {
            BleedSystem.selfRevive(player, item.typeId);
        }
    }
}