import { DailyRewardSystem } from "class/DailyRewardSystem";

export function chatSend(eventData) {
    const player = eventData.sender;
    const message = eventData.message;

    if (message === "!출석") { // 출석 체크 명령어
        eventData.cancel = true;
        DailyRewardSystem.rewardReceipt(player);
    }
}
