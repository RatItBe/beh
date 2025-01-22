export class PlayerMovement {
    static getStatus(player) {
        let status = 0;
        if (!player.isSneaking) status += 1;
        if (!player.isOnGround) status += 4;
        else if (player.matches({ scoreOptions:[{ objective:"moving", minScore: 1 }] })) status += 2;
        return status;
    }
}
/* 사용 예시
import { PlayerMovement } from "class/util/playerMovement"
const playerStatus = PlayerMovement.getStatus(player);
*/