export class PlayerMovement {
    static getStatus(player) {
        if (!player.isOnGround) return 2; // 체공 중
        if (player.isSneaking) return 3; // 웅크리는 중
        if (player.isSprinting) return 4; // 달리는 중
        if (player.matches({scoreOptions:[{ objective:"moving", minScore: 1 }]})) return 1
        return 0; // 정지
    }
}
/* 사용 예시
import { PlayerMovement } from "util/playerMovement"
const playerStatus = PlayerMovement.getStatus(player);
*/