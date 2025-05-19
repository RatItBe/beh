import { DailyRewardSystem } from "class/dailyRewardSystem";
import { structureSystem } from "class/structureSystem";

export function chatSend(eventData) {
    const player = eventData.sender;
    const message = eventData.message;

    if (message === "!출석") { // 출석 체크 명령어
        eventData.cancel = true;
        DailyRewardSystem.rewardReceipt(player);
    }
    else if (message === "!구조물") { // 클립보드로 구조물을 복원하는 명령어
        eventData.cancel = true;
        structureSystem.loadstructure(player);
    }
}
